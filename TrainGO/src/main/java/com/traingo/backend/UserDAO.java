package com.traingo.backend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Data Access Object (DAO) for User entity.
 * Handles database operations for user registration and authentication.
 */
public class UserDAO {

    /**
     * Registers a new user in the database.
     * 
     * @param name The full name of the user.
     * @param email The unique email address of the user.
     * @param password The user's password (plaintext for local dev, should be hashed in production).
     * @param role The user's role ('user' or 'admin').
     * @return true if registration is successful, false otherwise.
     */
    public boolean registerUser(String name, String email, String password, String role) {
        String sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        
        // INTERVIEW TOPIC: Why PreparedStatement?
        // 1. SQL Injection Prevention: Parameter placeholders (?) separate sql syntax from parameter data.
        //    The SQL engine pre-compiles the query outline first, meaning a malicious string like 
        //    "john@domain.com' OR '1'='1" cannot manipulate the execution logic of the query.
        // 2. Performance: Pre-compiling allows the MySQL engine to reuse execution plans for future calls.
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, password);
            ps.setString(4, role);
            
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error during user registration for email: " + email);
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Authenticates user by email and password.
     * 
     * @param email User's email address.
     * @param password User's password.
     * @return User object on successful authentication, null otherwise.
     */
    public User loginUser(String email, String password) {
        String sql = "SELECT user_id, name, email, role FROM users WHERE email = ? AND password = ?";
        
        // INTERVIEW TOPIC: Always use PreparedStatement for logins!
        // Using string concatenation like "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'"
        // allows trivial bypasses (e.g., entering "admin@traingo.com' --" as email bypasses password checks).
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, email);
            ps.setString(2, password);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("user_id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("role")
                    );
                }
            }
            
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error during user login for email: " + email);
            e.printStackTrace();
        }
        
        return null; // Login failed or error occurred
    }

    /**
     * Authorization Check: Verifies if a user has the 'admin' role.
     * 
     * INTERVIEW TOPIC: Role-Based Access Control (RBAC)
     * This method query checks user roles dynamically from the persistent database
     * rather than relying solely on client-side session states, making authorization 
     * robust, secure, and resilient against session-hijacking / client manipulation.
     * 
     * @param userId The ID of the user to check.
     * @return true if the user role is 'admin', false otherwise.
     */
    public boolean isAdmin(int userId) {
        String sql = "SELECT role FROM users WHERE user_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String role = rs.getString("role");
                    return "admin".equalsIgnoreCase(role);
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] Error checking admin status for user ID: " + userId);
            e.printStackTrace();
        }
        return false;
    }
}
