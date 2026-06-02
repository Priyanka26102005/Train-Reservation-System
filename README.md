# 🚆 TrainGO — Java JDBC Train Reservation System

TrainGO is a web-based train reservation system built using Java JDBC, MySQL, Servlets, HTML, CSS, and JavaScript. The project demonstrates database design, transaction management, concurrency control, role-based authentication, session management, and secure database interaction using parameterized queries.

The system allows users to search trains, check seat availability, book seats, generate PNRs, and manage bookings while preventing double-booking through database-level locking mechanisms.

---

# 📌 Core Features

## 👤 User Features

* User Registration and Login
* Role-Based Authentication (User/Admin)
* Session Management using UUID-based Session Tokens
* Train Search by Source and Destination
* Live Seat Availability Tracking
* Booking History and PNR Generation

## 👨‍💼 Admin Features

* Create New Trains
* Update Train Details
* Delete Trains
* View All Trains
* View Booking Records
* Automatic Seat Generation when New Trains are Added

## 🚉 Booking Engine

* Transaction-Based Seat Booking
* Row-Level Locking using `SELECT ... FOR UPDATE`
* Automatic Rollback on Failed Bookings
* Unique PNR Generation
* Concurrent Booking Protection

---

# 🛠️ Technologies Used

Backend:

* Java SE
* JDBC
* Java Servlets
* MySQL

Frontend:

* HTML5
* CSS3
* JavaScript

Server:

* Apache Tomcat

Database Driver:

* MySQL Connector/J

---

# 🗄️ Database Design

The application uses a normalized relational schema consisting of:

1. users
2. trains
3. seats
4. bookings

Relationships are maintained using foreign key constraints.

Performance optimization is achieved through:

CREATE INDEX idx_train_status ON seats(train_id, status);

which improves seat availability lookup performance.

---

# 🧠 Backend Engineering Concepts Demonstrated

## Transaction Management

Seat booking operations run inside JDBC transactions using:

* setAutoCommit(false)
* commit()
* rollback()

to ensure data consistency.

## Concurrency Control

The system uses:

SELECT ... FOR UPDATE

to lock seat records during booking and prevent multiple users from booking the same seat simultaneously.

## SQL Injection Prevention

All user input is processed using PreparedStatement instead of dynamic SQL string concatenation.

## Session Management

A SessionManager component generates UUID-based session tokens, validates active sessions, supports timeout handling, and performs logout operations.

## Role-Based Access Control (RBAC)

User roles are stored in the database and authorization checks restrict administrative functionality to admin users only.

## JDBC Batch Processing

Administrative train creation automatically generates seat records using JDBC batch operations for improved efficiency.

---

# 📊 Performance Benchmarking

PerformanceTest.java benchmarks seat availability queries with and without indexing.

The benchmark demonstrates the effect of composite indexing on query performance and provides measurable performance comparisons based on the local database environment.

---

# 🚀 Future Improvements

* HikariCP Connection Pooling
* JWT Authentication
* Email Notifications
* SMS Notifications
* Payment Gateway Integration
* Cloud Deployment

---

# 👥 Team Project

Developed as a team project with 4 members.

## My Contributions

* Implemented booking workflow and reservation logic
* Worked on JDBC database integration
* Contributed to schema design and indexing
* Implemented authentication and train search features
* Participated in testing and debugging
* Worked on frontend-backend integration

---

# 📜 License

Educational project developed for learning database systems, JDBC, transaction management, and web application development.
