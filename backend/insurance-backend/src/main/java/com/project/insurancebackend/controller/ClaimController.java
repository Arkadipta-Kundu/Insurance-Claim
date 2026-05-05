// src/main/java/com/project/insurancebackend/controller/ClaimController.java
package com.project.insurancebackend.controller;

import com.project.insurancebackend.dto.ClaimDto;
import com.project.insurancebackend.service.AuthService;
import com.project.insurancebackend.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private AuthService authService;

    private final Path uploadDir = Paths.get("uploads");

    @PostMapping
    public ResponseEntity<?> createClaim(@RequestHeader("Authorization") String token) {
        try {
            // Extract user email from token (simplified - in production use proper JWT
            // parsing)
            String userEmail = extractEmailFromToken(token);
            ClaimDto created = claimService.createClaim(userEmail);
            Map<String, Object> response = new HashMap<>();
            response.put("claimId", created.getId());
            response.put("claim", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{claimId}/docs/{docType}")
    public ResponseEntity<?> uploadDocument(
            @PathVariable String claimId,
            @PathVariable String docType,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);

            // Create upload directory if it doesn't exist
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Save file
            String fileName = claimId + "_" + docType + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, file.getBytes());

            // Update claim with file info
            ClaimDto claim = claimService.addDocument(claimId, userEmail, docType, fileName);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Document uploaded successfully");
            response.put("claim", claim);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{claimId}/docs/{docType}")
    public ResponseEntity<?> downloadDocument(
            @PathVariable String claimId,
            @PathVariable String docType,
            @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            String fileName = claimService.getDocumentFileName(claimId, userEmail, docType);

            if (fileName == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = uploadDir.resolve(fileName);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            ByteArrayResource resource = new ByteArrayResource(fileContent);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{claimId}/biometric/{who}")
    public ResponseEntity<?> verifyBiometric(
            @PathVariable String claimId,
            @PathVariable String who,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            String biometricToken = request.get("biometricToken");

            ClaimDto claim = claimService.verifyBiometric(claimId, userEmail, who, biometricToken);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{claimId}/process-images")
    public ResponseEntity<?> processImages(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            Map<String, Object> result = claimService.processImages(claimId, userEmail);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{claimId}/submit")
    public ResponseEntity<?> submitClaim(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            ClaimDto claim = claimService.submitClaim(claimId, userEmail);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{claimId}/certificate")
    public ResponseEntity<?> getCertificate(
            @PathVariable String claimId,
            @RequestHeader("Authorization") String token) {
        try {
            String userEmail = extractEmailFromToken(token);
            byte[] certificate = claimService.generateCertificatePdf(claimId, userEmail);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"insurance-certificate-" + claimId + ".pdf\"")
                    .body(certificate);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserClaims(@PathVariable String userId) {
        List<ClaimDto> claims = claimService.getUserClaims(userId);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingClaims() {
        List<ClaimDto> claims = claimService.getPendingClaims();
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllClaims() {
        List<ClaimDto> claims = claimService.getAllClaims();
        return ResponseEntity.ok(claims);
    }

    @PutMapping("/{claimId}/status")
    public ResponseEntity<?> updateClaimStatus(@PathVariable String claimId,
            @RequestBody Map<String, String> request,
            @RequestHeader("userId") String userId,
            @RequestHeader("userRole") String userRole) {
        try {
            String status = request.get("status");
            String rejectionReason = request.get("rejectionReason");

            ClaimDto updated = claimService.updateClaimStatus(claimId, status, userId, rejectionReason);
            return ResponseEntity.ok(updated);
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
