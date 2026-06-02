package com.traingo.backend;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

/**
 * Main integration test runner and demonstration class for TrainGO JDBC Backend.
 * Extended to showcase Role-Based Authentication, Session Management, Admin CRUD Modules,
 * and high-performance transactional batch seat generation.
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("====================================================================");
        System.out.println("     🚆 TrainGO JDBC Backend Advanced Integration Test Suite       ");
        System.out.println("====================================================================\n");

        try {
            // Step 1: Initialize Database and Tables
            System.out.println("[Step 1] Initializing normalized database schema & seeding data...");
            initializeDatabase();
            System.out.println("[Step 1] Database schema and initial seeds ready.\n");

            // Instantiate DAOs and Services
            UserDAO userDAO = new UserDAO();
            TrainDAO trainDAO = new TrainDAO();
            BookingService bookingService = new BookingService();

            // Step 2: User Registration
            System.out.println("[Step 2] Registering users in database...");
            boolean regAlice = userDAO.registerUser("Alice Smith", "alice@example.com", "alicepass123", "user");
            boolean regBob = userDAO.registerUser("Bob Miller", "bob@traingo.com", "adminsecure", "admin");
            System.out.println("Alice (Standard User) Registered: " + regAlice);
            System.out.println("Bob (System Admin) Registered: " + regBob + "\n");

            // Step 3: User Authentication & Session Generation
            System.out.println("[Step 3] Authenticating users and generating active session tokens...");
            
            // 3.1 Authenticate and log in Alice
            User aliceUser = userDAO.loginUser("alice@example.com", "alicepass123");
            String aliceToken = null;
            if (aliceUser != null) {
                aliceToken = SessionManager.createSession(aliceUser.getUserId(), aliceUser.getRole());
            }

            // 3.2 Authenticate and log in Bob
            User bobUser = userDAO.loginUser("bob@traingo.com", "adminsecure");
            String bobToken = null;
            if (bobUser != null) {
                bobToken = SessionManager.createSession(bobUser.getUserId(), bobUser.getRole());
            }
            System.out.println();

            // Step 4: Role-Based Authentication / Authorization Checks
            System.out.println("[Step 4] Enforcing Role-Based Access Control (RBAC)...");
            
            // 4.1 Test Case: Regular User attempts to create a train (Security Exception Expected)
            System.out.println(" -> Test Case 4.1: Alice (Standard User) attempts to create a new train...");
            boolean aliceAuth = checkAdminAuthorization(aliceToken, userDAO);
            if (!aliceAuth) {
                System.out.println("❌ AUTHORIZATION REJECTED: Access denied! Standard users cannot create trains.");
            } else {
                System.err.println("❌ FAILURE: Standard user authorized for administrative task!");
            }
            System.out.println();

            // 4.2 Test Case: Administrator attempts to create a train (Access Approved)
            System.out.println(" -> Test Case 4.2: Bob (System Admin) attempts to create a new train...");
            boolean bobAuth = checkAdminAuthorization(bobToken, userDAO);
            if (bobAuth) {
                System.out.println("✅ AUTHORIZATION APPROVED: Administrator verified. Initiating train creation...");
                
                // Create a new train schedule: Rajdhani Superfast with 10 available seats
                Train newTrain = new Train(
                    12003, 
                    "Rajdhani Superfast", 
                    "New Delhi", 
                    "Mumbai", 
                    Date.valueOf("2026-06-20"), 
                    10
                );
                
                // Saving train automatically triggers highly optimized batch seat generation inside transaction
                boolean success = trainDAO.addTrain(newTrain);
                System.out.println("Train Creation Status: " + (success ? "SUCCESS" : "FAILED"));
            } else {
                System.err.println("❌ FAILURE: Administrator access denied!");
            }
            System.out.println();

            // Step 5: Administrative Train Update
            System.out.println("[Step 5] Demonstrating Administrative Train Updates...");
            if (checkAdminAuthorization(bobToken, userDAO)) {
                // Update travel date of our new train 12003 to 2026-06-25
                Train updatedTrain = new Train(
                    12003, 
                    "Rajdhani Superfast", 
                    "New Delhi", 
                    "Mumbai", 
                    Date.valueOf("2026-06-25"), // Updated Travel Date
                    10
                );
                boolean updateStatus = trainDAO.updateTrain(updatedTrain);
                System.out.println("Bob updated Train 12003 Travel Date successfully: " + updateStatus);
            }
            System.out.println();

            // Step 6: User Train Search & Seating Reservations
            System.out.println("[Step 6] Standard user searches routes and buys a seat...");
            
            // Search trains New Delhi -> Mumbai
            List<Train> searchResults = trainDAO.searchTrains("New Delhi", "Mumbai");
            System.out.println("Alice search results for route New Delhi -> Mumbai:");
            for (Train t : searchResults) {
                System.out.println(" - " + t);
            }
            System.out.println();

            if (!searchResults.isEmpty()) {
                Train foundTrain = searchResults.get(0);
                int trainId = foundTrain.getTrainId();
                
                // List available seats (Notice the batch generated seats S1 to S10 are present!)
                System.out.println("Available Seats on " + foundTrain.getTrainName() + ":");
                List<Seat> seats = trainDAO.getAvailableSeats(trainId);
                for (Seat s : seats) {
                    System.out.println(" - " + s);
                }
                System.out.println();

                if (!seats.isEmpty()) {
                    Seat seatToBook = seats.get(0); // Select seat S1 (seat_id = 4 or dynamically fetched)
                    int seatId = seatToBook.getSeatId();
                    
                    // Alice books the seat using the transaction-safe checkout engine
                    System.out.println("Alice requests to book Seat: " + seatToBook.getSeatNumber() + " (Seat ID: " + seatId + ")...");
                    bookingService.bookSeat(aliceUser.getUserId(), seatId);
                    // Bob tries to book the same seat
                try {
                    System.out.println("\nBob attempts to book the SAME seat...");
                    bookingService.bookSeat(bobUser.getUserId(), seatId);
                    System.out.println("ERROR: Double booking succeeded!");
                } catch (Exception e) {
                    System.out.println("SUCCESS: Double booking prevented!");
                    System.out.println("Reason: " + e.getMessage());
                }
            }
        }
            System.out.println();

            // Step 7: Administrative Auditing Dashboard
            System.out.println("[Step 7] Administrator audits booking transaction logs...");
            if (checkAdminAuthorization(bobToken, userDAO)) {
                List<BookingDetails> bookingLogs = trainDAO.getAllBookings();
                System.out.printf("%-12s | %-15s | %-20s | %-12s | %-10s | %-20s\n",
                        "BOOKING ID", "PASSENGER", "TRAIN NAME", "SEAT NUMBER", "PNR CODE", "TIMESTAMP");
                System.out.println("--------------------------------------------------------------------------------------------------");
                for (BookingDetails b : bookingLogs) {
                    System.out.printf("%-12d | %-15s | %-20s | %-12s | %-10s | %-20s\n",
                            b.getBookingId(),
                            b.getPassengerName(),
                            b.getTrainName(),
                            b.getSeatNumber(),
                            b.getPnr(),
                            b.getBookingTime().toString()
                    );
                }
            } else {
                System.err.println("Access Denied: Only administrators can audit logs.");
            }
            System.out.println();

            // Step 8: Administrative Train Deletion & Cascading Integrity Check
            System.out.println("[Step 8] Administrator deletes train & verifies database cascading drops...");
            if (checkAdminAuthorization(bobToken, userDAO)) {
                // Bob deletes train 12003
                System.out.println("Bob requests deletion of Train ID: 12003...");
                boolean deleteSuccess = trainDAO.deleteTrain(12003);
                System.out.println("Train 12003 deletion: " + (deleteSuccess ? "SUCCESS" : "FAILED"));
                
                // Confirm that all child seats and bookings related to train 12003 were automatically cleared
                List<BookingDetails> activeBookings = trainDAO.getAllBookings();
                System.out.println("Active bookings remaining in system (should be 0 for train 12003): " + activeBookings.size());
            }
            System.out.println();

            // Step 9: User Logout (Session Invalidation)
            System.out.println("[Step 9] Demonstrating Session Invalidation (Logout)...");
            SessionManager.destroySession(aliceToken);
            SessionManager.destroySession(bobToken);
            
            // Validate that tokens are no longer accepted
            System.out.println("Validating Bob's token after logout: " + SessionManager.validateSession(bobToken));

            System.out.println("\n====================================================================");
            System.out.println("   🎉 All Advanced JDBC Integration Tests Completed Defensively!  ");
            System.out.println("====================================================================");

        } catch (Exception e) {
            System.err.println("Critical failure during integration test execution:");
            e.printStackTrace();
        }
    }

    /**
     * Helper method to validate a session token and verify administrative privileges.
     */
    private static boolean checkAdminAuthorization(String token, UserDAO userDAO) {
        if (!SessionManager.validateSession(token)) {
            System.err.println("[AuthCheck] Failed: Session token is invalid or expired.");
            return false;
        }
        
        SessionManager.Session session = SessionManager.getSession(token);
        if (session == null) {
            return false;
        }
        
        // Authorization validation directly query-backed by UserDAO
        return userDAO.isAdmin(session.getUserId());
    }

    /**
     * Resets the schema and populates seed data in MySQL automatically.
     */
    private static void initializeDatabase() throws Exception {
        String baseUrl = "jdbc:mysql://localhost:3306/?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String user = "root";
        String pass = "Priya@05";

        try (Connection conn = java.sql.DriverManager.getConnection(baseUrl, user, pass);
             Statement stmt = conn.createStatement()) {
            
            System.out.println(" - Connected to MySQL server.");
            
            // Create database
            stmt.execute("CREATE DATABASE IF NOT EXISTS traingo_db");
            stmt.execute("USE traingo_db");
            System.out.println(" - Database 'traingo_db' created/selected.");

            // Drop tables in reverse order of foreign keys
            stmt.execute("DROP TABLE IF EXISTS bookings");
            stmt.execute("DROP TABLE IF EXISTS seats");
            stmt.execute("DROP TABLE IF EXISTS trains");
            stmt.execute("DROP TABLE IF EXISTS users");
            System.out.println(" - Any pre-existing tables dropped.");

            // Create users table
            stmt.execute("CREATE TABLE users (" +
                         "  user_id INT PRIMARY KEY AUTO_INCREMENT," +
                         "  name VARCHAR(100) NOT NULL," +
                         "  email VARCHAR(100) UNIQUE NOT NULL," +
                         "  password VARCHAR(255) NOT NULL," +
                         "  role ENUM('user', 'admin') NOT NULL DEFAULT 'user'" +
                         ")");
            System.out.println(" - Created table: users");

            // Create trains table
            stmt.execute("CREATE TABLE trains (" +
                         "  train_id INT PRIMARY KEY," +
                         "  train_name VARCHAR(100) NOT NULL," +
                         "  source VARCHAR(100) NOT NULL," +
                         "  destination VARCHAR(100) NOT NULL," +
                         "  travel_date DATE NOT NULL," +
                         "  total_seats INT NOT NULL DEFAULT 50" +
                         ")");
            System.out.println(" - Created table: trains");

            // Create seats table
            stmt.execute("CREATE TABLE seats (" +
                         "  seat_id INT PRIMARY KEY AUTO_INCREMENT," +
                         "  train_id INT NOT NULL," +
                         "  seat_number VARCHAR(10) NOT NULL," +
                         "  status ENUM('AVAILABLE', 'BOOKED') NOT NULL DEFAULT 'AVAILABLE'," +
                         "  FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE" +
                         ")");
            System.out.println(" - Created table: seats");

            // Create bookings table
            stmt.execute("CREATE TABLE bookings (" +
                         "  booking_id INT PRIMARY KEY AUTO_INCREMENT," +
                         "  user_id INT NOT NULL," +
                         "  seat_id INT NOT NULL," +
                         "  pnr VARCHAR(50) UNIQUE NOT NULL," +
                         "  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                         "  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE," +
                         "  FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE" +
                         ")");
            System.out.println(" - Created table: bookings");

            // Create index
            stmt.execute("CREATE INDEX idx_train_status ON seats(train_id, status)");
            System.out.println(" - Created index: idx_train_status");

            // Insert initial seed trains
            stmt.execute("INSERT INTO trains VALUES (12001, 'Shatabdi Express', 'New Delhi', 'Chandigarh', '2026-06-15', 3)");
            stmt.execute("INSERT INTO trains VALUES (12002, 'Rajdhani Express', 'New Delhi', 'Mumbai', '2026-06-16', 2)");
            System.out.println(" - Seeded trains data.");

            // Insert initial seed seats for Shatabdi Express
            stmt.execute("INSERT INTO seats (train_id, seat_number, status) VALUES " +
                         "(12001, '1A', 'AVAILABLE'), " +
                         "(12001, '1B', 'AVAILABLE'), " +
                         "(12001, '1C', 'AVAILABLE')");
            
            // Insert initial seed seats for Rajdhani Express
            stmt.execute("INSERT INTO seats (train_id, seat_number, status) VALUES " +
                         "(12002, '2A', 'AVAILABLE'), " +
                         "(12002, '2B', 'AVAILABLE')");
            System.out.println(" - Seeded seats data.");
        }
    }
}
