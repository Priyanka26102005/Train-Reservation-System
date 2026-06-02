package com.traingo.backend;

/**
 * Custom exception indicating that a requested train seat is not available for booking
 * (e.g., it is already BOOKED or does not exist).
 * 
 * Creating a custom domain-specific exception is a backend development best practice.
 * It separates business validation failures from database-level SQL exceptions, 
 * making the application easier to maintain, test, and debug.
 */
public class SeatNotAvailableException extends Exception {
    
    private static final long serialVersionUID = 1L;

    public SeatNotAvailableException(String message) {
        super(message);
    }
}
