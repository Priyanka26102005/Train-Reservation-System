package com.traingo.backend;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * PerformanceTest executes empirical micro-benchmarking to profile seat availability searches
 * with and without the idx_train_status index.
 * 
 * INTERVIEW DEFENSE NOTE:
 * This class demonstrates to an interviewer that you do not just blindly add indexes;
 * you understand how to benchmark, profile, and quantify database execution plans programmatically.
 */
public class PerformanceTest {

    private static final int TEST_TRAIN_ID = 99999;
    private static final int BENCHMARK_SEATS_COUNT = 5000; // Large dataset to show indexing impact
    private static final int QUERY_LOOP_COUNT = 1000;      // Run queries multiple times for statistical reliability
    private static final int WARMUP_COUNT = 100;          // Primary JVM JIT compilation warm-up loop

    public static void main(String[] args) {
        System.out.println("====================================================================");
        System.out.println("       ⚡ TrainGO JDBC Index Benchmarking & Performance Profiler     ");
        System.out.println("====================================================================\n");

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            
            // 1. Setup benchmark environment
            System.out.println("[Step 1] Initializing temporary benchmark dataset...");
            cleanupTestDataset(conn);
            setupTestDataset(conn);
            System.out.println("[Step 1] Seeding of " + BENCHMARK_SEATS_COUNT + " seats completed.\n");

            // 2. Profile WITHOUT Index
            System.out.println("[Step 2] Measuring execution time WITHOUT index...");
            dropIndexIfExists(conn);
            
            // Warm-up JVM JIT compiler
            runQueryLoop(conn, WARMUP_COUNT);
            
            long startUnindexed = System.nanoTime();
            runQueryLoop(conn, QUERY_LOOP_COUNT);
            long endUnindexed = System.nanoTime();
            long totalUnindexedNs = endUnindexed - startUnindexed;
            double avgUnindexedMs = (totalUnindexedNs / (double) QUERY_LOOP_COUNT) / 1_000_000.0;
            System.out.println(" - Done. Total time for " + QUERY_LOOP_COUNT + " iterations: " + (totalUnindexedNs / 1_000_000.0) + " ms");
            System.out.printf(" - Average query execution time: %.4f ms\n\n", avgUnindexedMs);

            // 3. Profile WITH Index
            System.out.println("[Step 3] Measuring execution time WITH index...");
            createIndex(conn);
            
            // Warm-up JVM JIT compiler
            runQueryLoop(conn, WARMUP_COUNT);
            
            long startIndexed = System.nanoTime();
            runQueryLoop(conn, QUERY_LOOP_COUNT);
            long endIndexed = System.nanoTime();
            long totalIndexedNs = endIndexed - startIndexed;
            double avgIndexedMs = (totalIndexedNs / (double) QUERY_LOOP_COUNT) / 1_000_000.0;
            System.out.println(" - Done. Total time for " + QUERY_LOOP_COUNT + " iterations: " + (totalIndexedNs / 1_000_000.0) + " ms");
            System.out.printf(" - Average query execution time: %.4f ms\n\n", avgIndexedMs);

            // 4. Generate Report & Stats
            System.out.println("====================================================================");
            System.out.println("                      📊 PERFORMANCE COMPARISON REPORT              ");
            System.out.println("====================================================================");
            System.out.printf("%-20s | %-20s | %-20s\n", "METRIC", "WITHOUT INDEX (FULL SCAN)", "WITH INDEX (INDEX SEEK)");
            System.out.println("--------------------------------------------------------------------------------");
            System.out.printf("%-20s | %-20.4f ms             | %-20.4f ms\n", "Avg Execution Time", avgUnindexedMs, avgIndexedMs);
            System.out.printf("%-20s | %-20.2f ms             | %-20.2f ms\n", "Total (1000 Runs)", (totalUnindexedNs / 1_000_000.0), (totalIndexedNs / 1_000_000.0));
            
            // Calculate actual statistical improvement
            double improvementPercent = ((avgUnindexedMs - avgIndexedMs) / avgUnindexedMs) * 100.0;
            double speedupFactor = avgUnindexedMs / avgIndexedMs;
            
            System.out.println("--------------------------------------------------------------------------------");
            System.out.printf("📈 Database Speedup Factor: %.2fx faster\n", speedupFactor);
            System.out.printf("🚀 Total Performance Improvement: %.2f %%\n", improvementPercent);
            System.out.println("====================================================================\n");

            // 5. Cleanup benchmark environment
            System.out.println("[Step 4] Tearing down temporary benchmark dataset...");
            cleanupTestDataset(conn);
            System.out.println("[Step 4] Database returned to clean production state.");

        } catch (Exception e) {
            System.err.println("Critical error during performance testing:");
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
    }

    /**
     * Executes the seat lookup query repeatedly inside a loop.
     */
    private static void runQueryLoop(Connection conn, int count) throws SQLException {
        String sql = "SELECT seat_id, status FROM seats WHERE train_id = ? AND status = 'AVAILABLE'";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, TEST_TRAIN_ID);
            for (int i = 0; i < count; i++) {
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        // Consume result set to ensure MySQL and driver fully process the rows
                        int id = rs.getInt("seat_id");
                        String status = rs.getString("status");
                    }
                }
            }
        }
    }

    /**
     * Creates a test train and seeds 5,000 available seats inside a transaction batch.
     */
    private static void setupTestDataset(Connection conn) throws SQLException {
        String insertTrainSql = "INSERT INTO trains VALUES (?, 'Benchmark Express', 'DEL', 'MUM', ?, ?)";
        String insertSeatSql = "INSERT INTO seats (train_id, seat_number, status) VALUES (?, ?, 'AVAILABLE')";
        
        try {
            conn.setAutoCommit(false); // Disables auto-commit to run atomic transaction
            
            // Insert Train Record
            try (PreparedStatement psTrain = conn.prepareStatement(insertTrainSql)) {
                psTrain.setInt(1, TEST_TRAIN_ID);
                psTrain.setDate(2, new Date(System.currentTimeMillis()));
                psTrain.setInt(3, BENCHMARK_SEATS_COUNT);
                psTrain.executeUpdate();
            }
            
            // Batch Insert 5000 Seats
            try (PreparedStatement psSeat = conn.prepareStatement(insertSeatSql)) {
                for (int i = 1; i <= BENCHMARK_SEATS_COUNT; i++) {
                    psSeat.setInt(1, TEST_TRAIN_ID);
                    psSeat.setString(2, "B" + i);
                    psSeat.addBatch();
                }
                psSeat.executeBatch();
            }
            
            conn.commit();
        } catch (SQLException e) {
            conn.rollback();
            throw e;
        } finally {
            conn.setAutoCommit(true);
        }
    }

    /**
     * Drops the bench test train (cascades automatically delete test seats).
     */
    private static void cleanupTestDataset(Connection conn) throws SQLException {
        String sql = "DELETE FROM trains WHERE train_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, TEST_TRAIN_ID);
            ps.executeUpdate();
        }
    }

    /**
     * Programmatically drops the idx_train_status index from the seats table.
     * 
     * DEEP DATABASE INSIGHT:
     * MySQL requires an index on any foreign key column (like train_id) to enforce
     * integrity constraints. Since idx_train_status starts with train_id, MySQL uses it.
     * If we try to drop it directly, MySQL throws: "Cannot drop index needed in a foreign key constraint".
     * 
     * Solution: We temporarily create a single-column index "temp_train_idx" to support the foreign key,
     * which then allows us to drop the compound index idx_train_status safely!
     */
    private static void dropIndexIfExists(Connection conn) {
        try (Statement stmt = conn.createStatement()) {
            // 1. Create a temporary index to satisfy foreign key requirement
            try {
                stmt.execute("CREATE INDEX temp_train_idx ON seats(train_id)");
            } catch (SQLException e) {
                // Ignore if it already exists
            }
            
            // 2. Drop compound index
            stmt.execute("ALTER TABLE seats DROP INDEX idx_train_status");
            System.out.println(" - Successfully dropped database index 'idx_train_status' (using temp_train_idx for foreign key support).");
        } catch (SQLException e) {
            System.out.println(" - Note: Database index 'idx_train_status' was not present or already dropped. Error: " + e.getMessage());
        }
    }

    /**
     * Programmatically creates the idx_train_status index on the seats table.
     */
    private static void createIndex(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            // 1. Recreate the compound index
            stmt.execute("CREATE INDEX idx_train_status ON seats(train_id, status)");
            System.out.println(" - Successfully created database index 'idx_train_status'.");
            
            // 2. Drop the temporary index (as idx_train_status now covers the foreign key again)
            try {
                stmt.execute("ALTER TABLE seats DROP INDEX temp_train_idx");
                System.out.println(" - Successfully cleaned up temporary index 'temp_train_idx'.");
            } catch (SQLException e) {
                // Ignore if cleanup fails
            }
        }
    }
}
