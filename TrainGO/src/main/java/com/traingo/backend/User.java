package com.traingo.backend;

/**
 * User domain model representing a registered user in the TrainGO system.
 */
public class User {
    private int userId;
    private String name;
    private String email;
    private String role; // 'user' or 'admin'

    public User(int userId, String name, String email, String role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{id=" + userId + ", name='" + name + "', email='" + email + "', role='" + role + "'}";
    }
}
