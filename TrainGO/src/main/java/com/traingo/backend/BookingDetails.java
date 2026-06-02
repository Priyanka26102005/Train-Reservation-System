package com.traingo.backend;

import java.sql.Timestamp;

/**
 * Domain model representing a detailed joined booking transaction record
 * for administrator review.
 */
public class BookingDetails {
    private int bookingId;
    private String passengerName;
    private String trainName;
    private String seatNumber;
    private String pnr;
    private Timestamp bookingTime;

    public BookingDetails(int bookingId, String passengerName, String trainName, String seatNumber, String pnr, Timestamp bookingTime) {
        this.bookingId = bookingId;
        this.passengerName = passengerName;
        this.trainName = trainName;
        this.seatNumber = seatNumber;
        this.pnr = pnr;
        this.bookingTime = bookingTime;
    }

    public int getBookingId() { return bookingId; }
    public String getPassengerName() { return passengerName; }
    public String getTrainName() { return trainName; }
    public String getSeatNumber() { return seatNumber; }
    public String getPnr() { return pnr; }
    public Timestamp getBookingTime() { return bookingTime; }

    @Override
    public String toString() {
        return "BookingDetails{id=" + bookingId + 
               ", passenger='" + passengerName + '\'' + 
               ", train='" + trainName + '\'' + 
               ", seat='" + seatNumber + '\'' + 
               ", pnr='" + pnr + '\'' + 
               ", time=" + bookingTime + '}';
    }
}
