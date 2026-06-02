package com.traingo.backend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) for Train and Seat information.
 * All queries are strictly parameterized using PreparedStatement to ensure SQL injection safety.
 */
public class TrainDAO {

    /**
     * Searches for trains running between a specific source and destination.
     * 
     * @param source Origin station.
     * @param destination Destination station.
     * @return List of matching Train objects.
     */
    public List<Train> searchTrains(String source, String destination) {
        List<Train> trainsList = new ArrayList<>();
        String sql = "SELECT train_id, train_name, source, destination, travel_date, total_seats FROM trains WHERE source = ? AND destination = ?";

        // INTERVIEW TOPIC: Why PreparedStatement?
        // Parameterized queries ensure that search strings like "New Delhi" or "Chandigarh"
        // cannot escape quotes or inject malicious queries even if input contains special characters.
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, source);
            ps.setString(2, destination);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    trainsList.add(new Train(
                        rs.getInt("train_id"),
                        rs.getString("train_name"),
                        rs.getString("source"),
                        rs.getString("destination"),
                        rs.getDate("travel_date"),
                        rs.getInt("total_seats")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TrainDAO] Error while searching trains from " + source + " to " + destination);
            e.printStackTrace();
        }
        return trainsList;
    }

    /**
     * Retrieves all AVAILABLE seats for a given train.
     * Uses our optimized idx_train_status index for rapid query execution.
     * 
     * @param trainId ID of the train.
     * @return List of available Seat objects.
     */
    public List<Seat> getAvailableSeats(int trainId) {
        List<Seat> availableSeats = new ArrayList<>();
        String sql = "SELECT seat_id, train_id, seat_number, status FROM seats WHERE train_id = ? AND status = 'AVAILABLE'";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, trainId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    availableSeats.add(new Seat(
                        rs.getInt("seat_id"),
                        rs.getInt("train_id"),
                        rs.getString("seat_number"),
                        rs.getString("status")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[TrainDAO] Error retrieving available seats for train: " + trainId);
            e.printStackTrace();
        }
        return availableSeats;
    }

    /**
     * Admin Operation: Creates a new train in the database and automatically seeds all its seats.
     * 
     * INTERVIEW TOPIC: High-Performance Database Batch Inserts & Transactions
     * 1. Transaction Control: We disable auto-commit (`conn.setAutoCommit(false)`) so that inserting 
     *    the train and inserting all its seats occur as a single atomic unit. If any seat insert fails, 
     *    we call `conn.rollback()` to prevent orphaned or partial train records.
     * 2. JDBC Batching: Instead of issuing N separate INSERT calls over the network for N seats 
     *    (which would take N network roundtrips), we use `addBatch()` and `executeBatch()`. 
     *    This bundles all seat insert operations into a single network execution trip, 
     *    skyrocketing insertion speed.
     * 
     * @param train The Train object to insert.
     * @return true if successful, false otherwise.
     */
    public boolean addTrain(Train train) {
        String insertTrainSql = "INSERT INTO trains (train_id, train_name, source, destination, travel_date, total_seats) VALUES (?, ?, ?, ?, ?, ?)";
        String insertSeatSql = "INSERT INTO seats (train_id, seat_number, status) VALUES (?, ?, 'AVAILABLE')";
        
        Connection conn = null;
        PreparedStatement psTrain = null;
        PreparedStatement psSeat = null;
        
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Disables auto-commit to run atomic transaction
            
            // 1. Insert Train Record
            psTrain = conn.prepareStatement(insertTrainSql);
            psTrain.setInt(1, train.getTrainId());
            psTrain.setString(2, train.getTrainName());
            psTrain.setString(3, train.getSource());
            psTrain.setString(4, train.getDestination());
            psTrain.setDate(5, train.getTravelDate());
            psTrain.setInt(6, train.getTotalSeats());
            
            int trainRows = psTrain.executeUpdate();
            if (trainRows == 0) {
                throw new SQLException("Train insertion failed.");
            }
            
            // 2. High-Performance Batch Seat Generation
            psSeat = conn.prepareStatement(insertSeatSql);
            for (int i = 1; i <= train.getTotalSeats(); i++) {
                psSeat.setInt(1, train.getTrainId());
                psSeat.setString(2, "S" + i);
                psSeat.addBatch(); // Enqueue statement to the batch
            }
            
            psSeat.executeBatch(); // Execute all statement batch in a single network trip
            
            // Commit transaction atomically
            conn.commit();
            System.out.println("[TrainDAO] SUCCESS: Created train \"" + train.getTrainName() + "\" and generated " + train.getTotalSeats() + " seats in a single batch.");
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    System.err.println("[TrainDAO] Error creating train. Rolling back transaction...");
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
            return false;
        } finally {
            if (psTrain != null) { try { psTrain.close(); } catch (SQLException e) {} }
            if (psSeat != null) { try { psSeat.close(); } catch (SQLException e) {} }
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {}
            }
        }
    }

    /**
     * Admin Operation: Updates an existing train's route and metadata.
     * 
     * @param train The Train object containing updated fields.
     * @return true if successful, false otherwise.
     */
    public boolean updateTrain(Train train) {
        String sql = "UPDATE trains SET train_name = ?, source = ?, destination = ?, travel_date = ?, total_seats = ? WHERE train_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, train.getTrainName());
            ps.setString(2, train.getSource());
            ps.setString(3, train.getDestination());
            ps.setDate(4, train.getTravelDate());
            ps.setInt(5, train.getTotalSeats());
            ps.setInt(6, train.getTrainId());
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TrainDAO] Error updating train ID: " + train.getTrainId());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Admin Operation: Deletes a train and cascades deletions to all associated seats and bookings.
     * 
     * @param trainId ID of the train to delete.
     * @return true if successful, false otherwise.
     */
    public boolean deleteTrain(int trainId) {
        String sql = "DELETE FROM trains WHERE train_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, trainId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[TrainDAO] Error deleting train ID: " + trainId);
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Admin Operation: Fetches all trains currently registered in the system.
     * 
     * @return List of all trains.
     */
    public List<Train> getAllTrains() {
        List<Train> trainsList = new ArrayList<>();
        String sql = "SELECT train_id, train_name, source, destination, travel_date, total_seats FROM trains";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                trainsList.add(new Train(
                    rs.getInt("train_id"),
                    rs.getString("train_name"),
                    rs.getString("source"),
                    rs.getString("destination"),
                    rs.getDate("travel_date"),
                    rs.getInt("total_seats")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[TrainDAO] Error fetching all trains");
            e.printStackTrace();
        }
        return trainsList;
    }

    /**
     * Admin Operation: Audits all booking transactions currently recorded in the database.
     * Uses JOIN queries to gather complete metadata details.
     * 
     * @return List of comprehensive BookingDetails objects.
     */
    public List<BookingDetails> getAllBookings() {
        List<BookingDetails> bookingsList = new ArrayList<>();
        String sql = "SELECT b.booking_id, u.name AS passenger_name, t.train_name, s.seat_number, b.pnr, b.booking_time " +
                     "FROM bookings b " +
                     "JOIN users u ON b.user_id = u.user_id " +
                     "JOIN seats s ON b.seat_id = s.seat_id " +
                     "JOIN trains t ON s.train_id = t.train_id " +
                     "ORDER BY b.booking_time DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                bookingsList.add(new BookingDetails(
                    rs.getInt("booking_id"),
                    rs.getString("passenger_name"),
                    rs.getString("train_name"),
                    rs.getString("seat_number"),
                    rs.getString("pnr"),
                    rs.getTimestamp("booking_time")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[TrainDAO] Error fetching booking audit logs");
            e.printStackTrace();
        }
        return bookingsList;
    }
}
