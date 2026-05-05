// src/main/java/com/project/insurancebackend/service/AuthService.java
package com.project.insurancebackend.service;

import com.project.insurancebackend.dto.LoginRequest;
import com.project.insurancebackend.dto.RegisterRequest;
import com.project.insurancebackend.dto.AuthResponse;
import com.project.insurancebackend.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private EmailService emailService;

    private Map<String, UserDto> users = new ConcurrentHashMap<>();
    private Map<String, String> otpStore = new ConcurrentHashMap<>();
    private Map<String, String> tempUsers = new ConcurrentHashMap<>();
    private Map<String, String> tokenStore = new ConcurrentHashMap<>();

    // Initialize default admin user
    public AuthService() {
        // Create default admin user
        UserDto admin = new UserDto();
        admin.setId(UUID.randomUUID().toString());
        admin.setName("System Administrator");
        admin.setEmail("admin@insurance.com");
        admin.setPhone("+1234567890");
        admin.setPassword("admin123");
        admin.setRole("ADMIN");
        admin.setVerified(true);
        users.put("admin@insurance.com", admin);

        System.out.println("✅ Default admin user created: admin@insurance.com / admin123");
    }

    public AuthResponse register(RegisterRequest request) {
        System.out.println("=== REGISTER REQUEST ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Name: " + request.getName());
        System.out.println("Role: " + request.getRole());

        if (users.containsKey(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String role = request.getRole();
        if (role == null || (!role.equals("USER") && !role.equals("INSURANCE_COMPANY"))) {
            role = "USER";
        }

        if (role.equals("INSURANCE_COMPANY")) {
            if (request.getCompanyName() == null || request.getCompanyName().trim().isEmpty()) {
                throw new RuntimeException("Company name is required for insurance company registration");
            }
        }

        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        System.out.println("Generated OTP: " + otp);

        otpStore.put(request.getEmail(), otp);
        String tempData = request.getName() + "|" + request.getPhone() + "|" + request.getPassword() + "|" + role + "|"
                +
                (request.getCompanyName() != null ? request.getCompanyName() : "");
        tempUsers.put(request.getEmail(), tempData);

        emailService.sendOtpEmail(request.getEmail(), otp);

        UserDto userDto = new UserDto();
        userDto.setEmail(request.getEmail());
        userDto.setName(request.getName());
        userDto.setPhone(request.getPhone());
        userDto.setRole(role);

        return new AuthResponse("temp_token", userDto);
    }

    public boolean verifyOtp(String email, String otp) {
        email = email.trim();
        otp = otp.trim();

        String storedOtp = otpStore.get(email);

        if (storedOtp != null && storedOtp.equals(otp)) {
            String tempData = tempUsers.get(email);

            if (tempData != null) {
                String[] parts = tempData.split("\\|");
                if (parts.length >= 4) {
                    UserDto user = new UserDto();
                    user.setId(UUID.randomUUID().toString());
                    user.setName(parts[0]);
                    user.setEmail(email);
                    user.setPhone(parts[1]);
                    user.setPassword(parts[2]);
                    user.setRole(parts[3]);
                    user.setVerified(true);

                    if (parts.length > 4 && parts[3].equals("INSURANCE_COMPANY")) {
                        user.setCompanyName(parts[4]);
                    }

                    users.put(email, user);
                    emailService.sendWelcomeEmail(email, user.getName());

                    otpStore.remove(email);
                    tempUsers.remove(email);

                    return true;
                }
            }
        }
        return false;
    }

    public AuthResponse login(LoginRequest request) {
        UserDto user = users.get(request.getEmail());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = UUID.randomUUID().toString();
        tokenStore.put(token, user.getEmail());
        UserDto responseUser = new UserDto();
        responseUser.setId(user.getId());
        responseUser.setName(user.getName());
        responseUser.setEmail(user.getEmail());
        responseUser.setPhone(user.getPhone());
        responseUser.setRole(user.getRole());
        responseUser.setVerified(user.isVerified());
        responseUser.setCompanyName(user.getCompanyName());

        return new AuthResponse(token, responseUser);
    }

    public String getEmailByToken(String token) {
        return tokenStore.get(token);
    }

    public List<UserDto> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    public UserDto getUserByEmail(String email) {
        return users.get(email);
    }

    public UserDto getUserById(String id) {
        return users.values().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
