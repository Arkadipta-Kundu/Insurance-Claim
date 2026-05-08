package com.project.insurancebackend.controller;

import com.project.insurancebackend.dto.PolicyPurchaseDto;
import com.project.insurancebackend.dto.PurchasePolicyRequest;
import com.project.insurancebackend.service.AuthService;
import com.project.insurancebackend.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "http://localhost:5173")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @Autowired
    private AuthService authService;

    @GetMapping("/plans")
    public ResponseEntity<?> getPlans() {
        return ResponseEntity.ok(policyService.getAvailablePlans());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPolicies(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            Map<String, Object> response = new HashMap<>();
            response.put("summary", policyService.getUserPolicySummary(userEmail));
            response.put("policies", policyService.getUserPolicies(userEmail));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchasePolicy(
            @RequestHeader("Authorization") String token,
            @RequestBody PurchasePolicyRequest request) {
        try {
            String userEmail = extractEmailFromToken(token);
            PolicyPurchaseDto purchase = policyService.purchasePolicy(userEmail, request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Insurance plan purchased successfully");
            response.put("policy", purchase);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private String extractEmailFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = authService.getEmailByToken(token);
            if (email != null && !email.isBlank()) {
                return email;
            }
        }
        throw new RuntimeException("Invalid token");
    }
}
