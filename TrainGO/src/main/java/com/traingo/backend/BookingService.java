package com.traingo.backend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

/**
 * BookingService handles core transactional business logic for seat bookings.
 * 
 * INTERVIEW DEFENSE NOTE:
 * This class is designed to prevent double-booking in concurrent scenarios.
 * It uses a combination of explicit database transactions and Pessimistic Locking
 * (via SELECT ... FOR UPDATE) to lock the seat row during checkout.
 */
public class BookingService {

    /**
     * Books a specific seat for a given user in a safe, transaction-isolated manner.
     * 
     * @param userId ID of the booking user.
     * @param seatId ID of the seat to book.
     * @throws SeatNotAvailableException if the seat is already BOOKED or invalid.
     * @throws SQLException if a database transaction error occurs.
     */
    public void bookSeat(int userId, int seatId) throws SeatNotAvailableException, SQLException {
        Connection conn = null;
        PreparedStatement selectStmt = null;
        PreparedStatement updateStmt = null;
        PreparedStatement insertStmt = null;
        ResultSet rs = null;

        try {
            // Obtain raw connection from our manager
            conn = DBConnection.getConnection();

            // INTERVIEW TOPIC: Manual Transaction Management
            // By default, JDBC connections are in auto-commit mode (each SQL statement executes as its own transaction).
            // We set setAutoCommit(false) to group the locking, validation, update, and booking insert into a SINGLE transaction unit.
            conn.setAutoCommit(false);

            // INTERVIEW TOPIC: Pessimistic Locking with "SELECT ... FOR UPDATE"
            // Why use SELECT ... FOR UPDATE?
            // In a high-traffic railway application, two threads could check seat availability simultaneously.
            // If they both execute a standard SELECT, both will see status = 'AVAILABLE', and both will proceed
            // to issue UPDATE statements, resulting in a DOUBLE-BOOKED seat (a critical concurrency anomaly).
            //
            // "SELECT ... FOR UPDATE" acquires an exclusive row-level write lock on the matched row in MySQL.
            // If another transaction attempts to read or lock the same row, it is blocked (placed in a wait queue)
            // until this transaction commits or rolls back. This guarantees thread-safety at the database level!
            String selectSql = "SELECT status FROM seats WHERE seat_id = ? FOR UPDATE";
            selectStmt = conn.prepareStatement(selectSql);
            selectStmt.setInt(1, seatId);
            rs = selectStmt.executeQuery();

            if (!rs.next()) {
                throw new SeatNotAvailableException("Seat ID " + seatId + " does not exist in the database.");
            }

            String status = rs.getString("status");
            
            // Validate availability
            if (!"AVAILABLE".equalsIgnoreCase(status)) {
                // If not available, throw custom exception which triggers catch block (rollback)
                throw new SeatNotAvailableException("Seat ID " + seatId + " is already BOOKED! Reservation failed.");
            }

            // INTERVIEW TOPIC: SQL Injection Prevention (PreparedStatement)
            // We use PreparedStatement for the update and insert statements. Parameters are compiled
            // separately from the execution plan, preventing SQL injection hacks.
            String updateSql = "UPDATE seats SET status = 'BOOKED' WHERE seat_id = ?";
            updateStmt = conn.prepareStatement(updateSql);
            updateStmt.setInt(1, seatId);
            updateStmt.executeUpdate();

            // Generate unique PNR code
            String pnr = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // Insert new booking record
            String insertSql = "INSERT INTO bookings (user_id, seat_id, pnr, booking_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
            insertStmt = conn.prepareStatement(insertSql);
            insertStmt.setInt(1, userId);
            insertStmt.setInt(2, seatId);
            insertStmt.setString(3, pnr);
            insertStmt.executeUpdate();

            // Commit the entire transaction atomically
            conn.commit();
            System.out.println("[BookingService] SUCCESS: Seat ID " + seatId + " booked for User ID " + userId + ". PNR: " + pnr);

        } catch (Exception e) {
            // Rollback transaction on ANY exception (SQL, business validation, or runtime errors)
            if (conn != null) {
                try {
                    System.err.println("[BookingService] ERROR/ROLLBACK: Booking failed due to: " + e.getMessage() + ". Rolling back transaction...");
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("[BookingService] Critical: Failed to rollback transaction.");
                    ex.printStackTrace();
                }
            }
            // Propagate the exception back to the caller
            throw e;
        } finally {
            // INTERVIEW TOPIC: Proper Resource Management
            // Always close ResultSets, PreparedStatements, and Connections in a finally block to prevent resource leaks
            // which can exhaust database connection pools in production.
            if (rs != null) {
                try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
            if (selectStmt != null) {
                try { selectStmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
            if (updateStmt != null) {
                try { updateStmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
            if (insertStmt != null) {
                try { insertStmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
            if (conn != null) {
                try {
                    // Reset auto-commit state before closing/returning to pool (best practice)
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
