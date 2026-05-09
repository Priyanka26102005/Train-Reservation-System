-- TrainGO Database Creation Script
-- Run this in MySQL Workbench or phpMyAdmin

CREATE DATABASE IF NOT EXISTS traingo_db;
USE traingo_db;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    aadhar VARCHAR(12) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trains Table
CREATE TABLE trains (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    route VARCHAR(200) NOT NULL,
    start_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    total_seats INT NOT NULL DEFAULT 200,
    available_seats INT NOT NULL DEFAULT 200,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets Table
CREATE TABLE tickets (
    id VARCHAR(20) PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    route VARCHAR(200) NOT NULL,
    travel_date DATE NOT NULL,
    seat_class ENUM('1st', '2nd', '3rd', 'Sleeper') NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    booking_date DATE DEFAULT CURRENT_DATE,
    status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

-- Passengers Table
CREATE TABLE passengers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    username VARCHAR(100) NOT NULL,
    train_id INT NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

-- Insert Sample Trains Data
INSERT INTO trains (id, name, route, start_time, arrival_time, total_seats, available_seats, price) VALUES
(12001, 'Shatabdi Express', 'New Delhi to Chandigarh', '07:20:00', '10:50:00', 200, 200, 1200.00),
(12002, 'Rajdhani Express', 'New Delhi to Mumbai', '16:55:00', '08:35:00', 180, 180, 2500.00),
(12259, 'Duronto Express', 'New Delhi to Katra', '19:55:00', '05:45:00', 220, 220, 1800.00),
(12423, 'Dibrugarh Rajdhani', 'New Delhi to Dibrugarh', '13:05:00', '18:00:00', 160, 160, 3200.00),
(12951, 'Mumbai Rajdhani', 'Mumbai to New Delhi', '17:00:00', '09:10:00', 190, 190, 2400.00),
(12301, 'Howrah Rajdhani', 'New Delhi to Kolkata', '17:00:00', '10:10:00', 170, 170, 2200.00),
(12626, 'Kerala Express', 'New Delhi to Thiruvananthapuram', '11:00:00', '11:30:00', 240, 240, 2800.00),
(12723, 'Telangana Express', 'New Delhi to Hyderabad', '21:15:00', '20:50:00', 210, 210, 2100.00),
(12615, 'Grand Trunk Express', 'New Delhi to Chennai', '19:30:00', '22:45:00', 250, 250, 2600.00),
(12780, 'Goa Express', 'New Delhi to Vasco Da Gama', '15:00:00', '14:40:00', 200, 200, 2300.00);

-- Create Admin User
INSERT INTO users (full_name, username, email, phone, age, gender, aadhar, address, password) VALUES
('Admin User', 'admin', 'admin@traingo.in', '9999999999', 30, 'Male', '123456789012', 'TrainGO Headquarters, New Delhi', 'admin123');

-- Create Indexes for Better Performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_train_id ON tickets(train_id);
CREATE INDEX idx_tickets_travel_date ON tickets(travel_date);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_train_id ON reviews(train_id);