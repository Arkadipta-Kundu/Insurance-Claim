package com.project.insurancebackend;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class InMemoryStore {

    public static Map<String, String> otpStore = new java.util.concurrent.ConcurrentHashMap<>();
    public static Map<String, Boolean> verifiedEmails = new java.util.concurrent.ConcurrentHashMap<>();
    public static Map<String, User> users = new java.util.concurrent.ConcurrentHashMap<>();
    public static Map<String, Claim> claims = new java.util.concurrent.ConcurrentHashMap<>();

    public static class User {
        public String email;
        public String password;
        public String name;
        public String address;
        public String mobile;
        public String validIdProofNo;
        public String nomineeName;
        public String nomineeMobile;

        public User(String email, String password, String name, String address,
                String mobile, String validIdProofNo, String nomineeName, String nomineeMobile) {
            this.email = email;
            this.password = password;
            this.name = name;
            this.address = address;
            this.mobile = mobile;
            this.validIdProofNo = validIdProofNo;
            this.nomineeName = nomineeName;
            this.nomineeMobile = nomineeMobile;
        }
    }

    public static class Claim {
        public String id;
        public String userEmail;
        public String status;
        public int userBioAttempts;
        public int nomineeBioAttempts;
        public boolean userBioVerified;
        public boolean nomineeBioVerified;
        public LocalDateTime createdAt;
        public Map<String, String> files = new HashMap<>();

        public Claim(String userEmail) {
            this.id = UUID.randomUUID().toString().substring(0, 8);
            this.userEmail = userEmail;
            this.status = "Pending";
            this.userBioAttempts = 0;
            this.nomineeBioAttempts = 0;
            this.userBioVerified = false;
            this.nomineeBioVerified = false;
            this.createdAt = LocalDateTime.now();
        }
    }
}