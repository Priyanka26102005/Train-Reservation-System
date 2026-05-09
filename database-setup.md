# TrainGO Database Setup Guide

## Prerequisites
1. Install MySQL Server
2. Install phpMyAdmin or MySQL Workbench

## Setup Steps

### 1. Create Database
```sql
-- Run database.sql file in MySQL
mysql -u root -p < database.sql
```

### 2. Database Structure
- **users** - Store user accounts
- **trains** - Store train information
- **tickets** - Store booking details
- **passengers** - Store passenger details for each ticket
- **reviews** - Store user reviews and ratings

### 3. Default Login
- **Admin Username:** admin
- **Admin Password:** admin123

### 4. Connection Details
```
Host: localhost
Database: traingo_db
Username: root
Password: [your mysql password]
Port: 3306
```

## Tables Overview

### Users Table
- Stores user registration data
- Unique username and email
- Encrypted passwords

### Trains Table
- Pre-loaded with 10 Indian trains
- Real train numbers and routes
- Seat availability tracking

### Tickets Table
- Links users to train bookings
- Tracks booking status
- Stores pricing information

### Passengers Table
- Individual passenger details
- Linked to ticket bookings
- Age and gender information

### Reviews Table
- User feedback system
- 1-5 star ratings
- Text reviews for trains

## Sample Queries

### Get All Available Trains
```sql
SELECT * FROM trains WHERE available_seats > 0;
```

### Get User Bookings
```sql
SELECT t.*, tr.name, tr.route 
FROM tickets t 
JOIN trains tr ON t.train_id = tr.id 
WHERE t.user_id = 1;
```

### Get Train Reviews
```sql
SELECT r.*, u.full_name 
FROM reviews r 
JOIN users u ON r.user_id = u.id 
WHERE r.train_id = 12001;
```