package com.traingo.backend;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * DBConnection provides a centralized database connection management system using JDBC.
 * It reads configuration properties from db.properties and safely falls back to standard
 * local development defaults if properties aren't available.
 */
public class DBConnection {

    private static String url = "jdbc:mysql://localhost:3306/traingo_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static String username = "root";
    private static String password = "123321"; // Default password used in the existing prototype

    static {
        try {
            // Load credentials dynamically from db.properties
            Properties props = new Properties();
            try (InputStream is = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
                if (is != null) {
                    props.load(is);
                    url = props.getProperty("db.url", url);
                    username = props.getProperty("db.username", username);
                    password = props.getProperty("db.password", password);
                    System.out.println("[DBConnection] Configuration loaded successfully from db.properties");
                } else {
                    System.out.println("[DBConnection] db.properties not found on classpath. Using default local credentials.");
                }
            }
            
            // Register modern MySQL JDBC driver (com.mysql.cj.jdbc.Driver is correct for current MySQL connectors)
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] Critical Error: MySQL JDBC driver class not found in classpath.");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("[DBConnection] Warning: Error loading db.properties configuration.");
            e.printStackTrace();
        }
    }

    /**
     * Obtains a new connection to the MySQL database.
     * 
     * @return a valid Connection object
     * @throws SQLException if a database access error occurs or URL is invalid
     */
    public static Connection getConnection() throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            return connection;
        } catch (SQLException e) {
            System.err.println("[DBConnection] Failed to establish database connection to: " + url);
            throw e;
        }
    }
}
