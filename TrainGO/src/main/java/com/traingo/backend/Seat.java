package com.traingo.backend;

/**
 * Seat domain model representing a specific seat within a train.
 */
public class Seat {
    private int seatId;
    private int trainId;
    private String seatNumber;
    private String status; // 'AVAILABLE' or 'BOOKED'

    public Seat(int seatId, int trainId, String seatNumber, String status) {
        this.seatId = seatId;
        this.trainId = trainId;
        this.seatNumber = seatNumber;
        this.status = status;
    }

    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }

    public int getTrainId() {
        return trainId;
    }

    public void setTrainId(int trainId) {
        this.trainId = trainId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Seat{id=" + seatId + ", trainId=" + trainId + ", number='" + seatNumber + "', status='" + status + "'}";
    }
}
