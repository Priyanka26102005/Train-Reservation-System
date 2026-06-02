package com.traingo.backend;

import java.sql.Date;

/**
 * Train domain model representing a train route and schedule in the system.
 */
public class Train {
    private int trainId;
    private String trainName;
    private String source;
    private String destination;
    private Date travelDate;
    private int totalSeats;

    public Train(int trainId, String trainName, String source, String destination, Date travelDate, int totalSeats) {
        this.trainId = trainId;
        this.trainName = trainName;
        this.source = source;
        this.destination = destination;
        this.travelDate = travelDate;
        this.totalSeats = totalSeats;
    }

    public int getTrainId() {
        return trainId;
    }

    public void setTrainId(int trainId) {
        this.trainId = trainId;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Date getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(Date travelDate) {
        this.travelDate = travelDate;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    @Override
    public String toString() {
        return "Train{id=" + trainId + ", name='" + trainName + "', route='" + source + " -> " + destination + "', date=" + travelDate + ", capacity=" + totalSeats + "}";
    }
}
