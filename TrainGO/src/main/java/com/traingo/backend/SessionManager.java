package com.traingo.backend;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SessionManager handles user state preservation and session security controls.
 * 
 * INTERVIEW DEFENSE NOTE:
 * In a pure console application, we replicate the web container's session tracking using
 * UUID session tokens stored in a thread-safe ConcurrentHashMap.
 * 
 * WEB INTERVIEW KNOWLEDGE:
 * In Java Web Applications (JSP/Servlets), this lifecycle is natively managed by the container 
 * via `HttpSession` (e.g. `request.getSession()`). The container sends a cookie named JSESSIONID 
 * containing a session ID back to the user's browser, which is returned automatically in HTTP headers 
 * on subsequent requests to keep the user authenticated.
 */
public class SessionManager {

    // Thread-safe repository storing active sessions (token -> Session object)
    private static final ConcurrentHashMap<String, Session> activeSessions = new ConcurrentHashMap<>();
    
    // Session validity timeout (e.g., 30 minutes)
    private static final long SESSION_TIMEOUT_MS = 30 * 60 * 1000L;

    /**
     * Session data structure representing an active authenticated user session.
     */
    public static class Session {
        private final String token;
        private final int userId;
        private final String role;
        private final long startTime;

        public Session(String token, int userId, String role) {
            this.token = token;
            this.userId = userId;
            this.role = role;
            this.startTime = System.currentTimeMillis();
        }

        public String getToken() { return token; }
        public int getUserId() { return userId; }
        public String getRole() { return role; }
        public long getStartTime() { return startTime; }

        @Override
        public String toString() {
            return "Session{token='" + token.substring(0, 8) + "...', userId=" + userId + ", role='" + role + "'}";
        }
    }

    /**
     * Generates a new secure session for an authenticated user.
     * 
     * @param userId The ID of the authenticated user.
     * @param role The role of the user (user/admin).
     * @return Unique session token (UUID).
     */
    public static String createSession(int userId, String role) {
        String token = UUID.randomUUID().toString();
        Session session = new Session(token, userId, role);
        activeSessions.put(token, session);
        System.out.println("[SessionManager] Created session token: " + token + " for User ID: " + userId + " (" + role + ")");
        return token;
    }

    /**
     * Validates a session token to ensure it exists, belongs to an active user,
     * and has not expired.
     * 
     * @param token The session token to validate.
     * @return true if the session is valid, false otherwise.
     */
    public static boolean validateSession(String token) {
        if (token == null || !activeSessions.containsKey(token)) {
            System.err.println("[SessionManager] Session validation failed: Token does not exist.");
            return false;
        }
        
        Session session = activeSessions.get(token);
        long elapsed = System.currentTimeMillis() - session.getStartTime();
        
        if (elapsed > SESSION_TIMEOUT_MS) {
            System.err.println("[SessionManager] Session validation failed: Session expired.");
            activeSessions.remove(token); // Purge expired session
            return false;
        }
        
        return true;
    }

    /**
     * Retrieves session details for a given token.
     * 
     * @param token Session token.
     * @return Session object or null if invalid/expired.
     */
    public static Session getSession(String token) {
        if (validateSession(token)) {
            return activeSessions.get(token);
        }
        return null;
    }

    /**
     * Destroys an active session (Logout).
     * 
     * @param token The session token to invalidate.
     */
    public static void destroySession(String token) {
        if (token != null && activeSessions.containsKey(token)) {
            Session s = activeSessions.remove(token);
            if (s != null) {
                System.out.println("[SessionManager] Destroyed session for User ID: " + s.getUserId() + ". Logout successful.");
            }
        }
    }
}
