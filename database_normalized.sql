-- TrainGO Normalized Database Creation Script
-- Production-Ready and Interview-Defensible

CREATE DATABASE IF NOT EXISTS traingo_db;
USE traingo_db;

-- 1. Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS users;

-- 2. Create Normalized Tables

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- Trains Table
CREATE TABLE trains (
    train_id INT PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    travel_date DATE NOT NULL,
    total_seats INT NOT NULL DEFAULT 50
);

-- Seats Table
CREATE TABLE seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    status ENUM('AVAILABLE', 'BOOKED') NOT NULL DEFAULT 'AVAILABLE',
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    seat_id INT NOT NULL,
    pnr VARCHAR(50) UNIQUE NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE
);

-- 3. Create Required Performance and Concurrency Index
-- This index speeds up seat availability searches and helps lock precise index blocks/rows during 'SELECT FOR UPDATE'
CREATE INDEX idx_train_status ON seats(train_id, status);

-- 4. Seed High-Quality Test Data

-- Insert Users
INSERT INTO users (name, email, password, role) VALUES
('Priyanka', 'priyanka@example.com', 'password123', 'user'),
('Admin User', 'admin@traingo.com', 'admin123', 'admin'),
('John Doe', 'john.doe@example.com', 'securepass', 'user');

-- Insert Trains
INSERT INTO trains (train_id, train_name, source, destination, travel_date, total_seats) VALUES
(12001, 'Shatabdi Express', 'New Delhi', 'Chandigarh', '2026-06-15', 5),
(12002, 'Rajdhani Express', 'New Delhi', 'Mumbai', '2026-06-16', 5),
(12259, 'Duronto Express', 'Mumbai', 'New Delhi', '2026-06-17', 5);

-- Insert Seats for Shatabdi Express (12001) - 5 seats
INSERT INTO seats (train_id, seat_number, status) VALUES
(12001, '1A', 'AVAILABLE'),
(12001, '1B', 'AVAILABLE'),
(12001, '1C', 'AVAILABLE'),
(12001, '1D', 'AVAILABLE'),
(12001, '1E', 'AVAILABLE');

-- Insert Seats for Rajdhani Express (12002) - 5 seats
INSERT INTO seats (train_id, seat_number, status) VALUES
(12002, '2A', 'AVAILABLE'),
(12002, '2B', 'AVAILABLE'),
(12002, '2C', 'AVAILABLE'),
(12002, '2D', 'AVAILABLE'),
(12002, '2E', 'AVAILABLE');

-- Insert Seats for Duronto Express (12259) - 5 seats
INSERT INTO seats (train_id, seat_number, status) VALUES
(12259, '3A', 'AVAILABLE'),
(12259, '3B', 'AVAILABLE'),
(12259, '3C', 'AVAILABLE'),
(12259, '3D', 'AVAILABLE'),
(12259, '3E', 'AVAILABLE');
