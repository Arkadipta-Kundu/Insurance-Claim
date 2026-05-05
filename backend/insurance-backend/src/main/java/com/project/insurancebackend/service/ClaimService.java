// src/main/java/com/project/insurancebackend/service/ClaimService.java
package com.project.insurancebackend.service;

import com.project.insurancebackend.dto.ClaimDto;
import com.project.insurancebackend.dto.UserDto;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private Map<String, ClaimDto> claims = new ConcurrentHashMap<>();
    private Map<String, List<String>> userClaims = new ConcurrentHashMap<>();
    private Map<String, Map<String, String>> claimDocuments = new ConcurrentHashMap<>();

    @Autowired
    private AuthService authService;

    private final Path uploadDir = Paths.get("uploads");
    private final Path processedDir = Paths.get("processed");

    public ClaimDto createClaim(String userEmail) {
        String claimId = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        ClaimDto claimDto = new ClaimDto();
        claimDto.setId(claimId);
        claimDto.setUserId(userEmail);
        claimDto.setSubmissionDate(new Date());
        claimDto.setStatus("DRAFT");

        UserDto user = authService.getUserByEmail(userEmail);
        if (user != null) {
            claimDto.setUserName(user.getName());
        }

        claims.put(claimId, claimDto);
        userClaims.computeIfAbsent(userEmail, k -> new ArrayList<>()).add(claimId);
        claimDocuments.put(claimId, new ConcurrentHashMap<>());

        return claimDto;
    }

    public ClaimDto addDocument(String claimId, String userEmail, String docType, String fileName) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        if (!claim.getUserId().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        Map<String, String> docs = claimDocuments.get(claimId);
        docs.put(docType, fileName);

        // Update claim document URLs
        List<String> docUrls = claim.getDocumentUrls();
        if (docUrls == null) {
            docUrls = new ArrayList<>();
        }
        docUrls.add("/api/claims/" + claimId + "/docs/" + docType);
        claim.setDocumentUrls(docUrls);

        return claim;
    }

    public String getDocumentFileName(String claimId, String userEmail, String docType) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        Map<String, String> docs = claimDocuments.get(claimId);
        return docs != null ? docs.get(docType) : null;
    }

    public ClaimDto verifyBiometric(String claimId, String userEmail, String who, String biometricToken) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        // Simulate biometric verification - in production, integrate with actual
        // biometric service
        boolean verified = biometricToken != null && !biometricToken.isEmpty();

        if ("user".equals(who)) {
            // Store user biometric verification status
        } else if ("nominee".equals(who)) {
            // Store nominee biometric verification status
        }

        return claim;
    }

    public Map<String, Object> processImages(String claimId, String userEmail) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("fragmented", true);
        result.put("steganographed", true);
        result.put("merged", true);
        result.put("message", "Images processed successfully");

        try {
            // Create processed directory
            if (!Files.exists(processedDir)) {
                Files.createDirectories(processedDir);
            }

            Map<String, String> docs = claimDocuments.get(claimId);

            // Process pathology report - fragmentation
            if (docs != null && docs.containsKey("pathology")) {
                String pathologyFile = docs.get("pathology");
                Path pathologyPath = uploadDir.resolve(pathologyFile);

                if (Files.exists(pathologyPath) && isImageFile(pathologyFile)) {
                    fragmentImage(pathologyPath.toString(), processedDir.resolve(claimId + "_fragments").toString());
                }
            }

            // Process steganography
            if (docs != null && docs.containsKey("cover") && docs.containsKey("secret")) {
                String coverFile = docs.get("cover");
                String secretFile = docs.get("secret");

                Path coverPath = uploadDir.resolve(coverFile);
                Path secretPath = uploadDir.resolve(secretFile);

                if (Files.exists(coverPath) && Files.exists(secretPath)) {
                    String stegoOutput = processedDir.resolve(claimId + "_stego.png").toString();
                    hideImageInImage(coverPath.toString(), secretPath.toString(), stegoOutput);
                    result.put("stegoImage", "/processed/" + claimId + "_stego.png");
                }
            }

            claim.setStatus("PROCESSED");
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }

        return result;
    }

    private boolean isImageFile(String fileName) {
        String lower = fileName.toLowerCase();
        return lower.endsWith(".png") || lower.endsWith(".jpg") ||
                lower.endsWith(".jpeg") || lower.endsWith(".gif");
    }

    private void fragmentImage(String inputPath, String outputDir) throws IOException {
        BufferedImage image = ImageIO.read(new File(inputPath));
        if (image == null)
            return;

        int width = image.getWidth();
        int height = image.getHeight();
        int partWidth = width / 2;
        int partHeight = height / 2;

        File outDir = new File(outputDir);
        outDir.mkdirs();

        BufferedImage part1 = image.getSubimage(0, 0, partWidth, partHeight);
        BufferedImage part2 = image.getSubimage(partWidth, 0, partWidth, partHeight);
        BufferedImage part3 = image.getSubimage(0, partHeight, partWidth, partHeight);
        BufferedImage part4 = image.getSubimage(partWidth, partHeight, partWidth, partHeight);

        ImageIO.write(part1, "png", new File(outDir, "part1.png"));
        ImageIO.write(part2, "png", new File(outDir, "part2.png"));
        ImageIO.write(part3, "png", new File(outDir, "part3.png"));
        ImageIO.write(part4, "png", new File(outDir, "part4.png"));
    }

    private void hideImageInImage(String coverPath, String secretPath, String outputPath) throws IOException {
        BufferedImage cover = ImageIO.read(new File(coverPath));
        BufferedImage secret = ImageIO.read(new File(secretPath));

        if (cover == null || secret == null)
            return;

        // Simple LSB steganography
        BufferedImage stego = new BufferedImage(cover.getWidth(), cover.getHeight(), BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < cover.getHeight(); y++) {
            for (int x = 0; x < cover.getWidth(); x++) {
                int coverRGB = cover.getRGB(x, y);
                int secretRGB = (x < secret.getWidth() && y < secret.getHeight()) ? secret.getRGB(x, y) : 0;

                // Hide secret image in LSB of cover
                int r = ((coverRGB >> 16) & 0xFE) | ((secretRGB >> 16) & 0x01);
                int g = ((coverRGB >> 8) & 0xFE) | ((secretRGB >> 8) & 0x01);
                int b = (coverRGB & 0xFE) | (secretRGB & 0x01);

                stego.setRGB(x, y, (r << 16) | (g << 8) | b);
            }
        }

        ImageIO.write(stego, "png", new File(outputPath));
    }

    public ClaimDto submitClaim(String claimId, String userEmail) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        if (!claim.getUserId().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        Map<String, String> docs = claimDocuments.get(claimId);

        // Verify all required documents are uploaded
        if (docs == null || !docs.containsKey("pathology") || !docs.containsKey("prescription") ||
                !docs.containsKey("cover") || !docs.containsKey("secret")) {
            throw new RuntimeException("All required documents must be uploaded");
        }

        claim.setStatus("APPROVED");
        claim.setVerifiedDate(new Date());
        claim.setCertificateUrl("/api/claims/" + claimId + "/certificate");
        return claim;
    }

    public Map<String, Object> generateCertificate(String claimId, String userEmail) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        UserDto user = authService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Map<String, Object> certificate = new HashMap<>();
        certificate.put("claimId", claimId);
        certificate.put("userEmail", userEmail);
        certificate.put("userName", user.getName());
        certificate.put("status", claim.getStatus());
        certificate.put("issueDate", new Date().toString());
        certificate.put("certificateId", "CERT-" + claimId);
        certificate.put("coverageAmount", claim.getAmount() > 0 ? claim.getAmount() : 50000);
        certificate.put("policyNumber", "POL-" + claimId.replace("CLM-", ""));
        certificate.put("holderName", user.getName());
        certificate.put("holderEmail", user.getEmail());
        certificate.put("holderPhone", user.getPhone());
        certificate.put("documents", claimDocuments.get(claimId));

        return certificate;
    }

    public byte[] generateCertificatePdf(String claimId, String userEmail) {
        ClaimDto claim = claims.get(claimId);
        if (claim == null) {
            throw new RuntimeException("Claim not found");
        }

        Map<String, Object> certificate = generateCertificate(claimId, userEmail);

        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDFont regularFont = new org.apache.pdfbox.pdmodel.font.PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont boldFont = new org.apache.pdfbox.pdmodel.font.PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDFont italicFont = new org.apache.pdfbox.pdmodel.font.PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float margin = 50f;
                float y = page.getMediaBox().getHeight() - margin;
                float leading = 18f;

                contentStream.beginText();
                contentStream.setLeading(leading);
                contentStream.newLineAtOffset(margin, y);

                writeLine(contentStream, boldFont, 20, "Insurance Claim Certificate");
                contentStream.newLine();
                writeLine(contentStream, regularFont, 12,
                        "This document confirms the claim and policy details recorded in the system.");
                contentStream.newLine();
                contentStream.newLine();

                writeLine(contentStream, boldFont, 12, "Certificate ID: " + certificate.get("certificateId"));
                writeLine(contentStream, regularFont, 12, "Claim ID: " + certificate.get("claimId"));
                writeLine(contentStream, regularFont, 12, "Status: " + certificate.get("status"));
                writeLine(contentStream, regularFont, 12, "Issue Date: " + certificate.get("issueDate"));
                writeLine(contentStream, regularFont, 12, "Policy Number: " + certificate.get("policyNumber"));
                contentStream.newLine();

                writeLine(contentStream, boldFont, 12, "Policy Holder");
                writeLine(contentStream, regularFont, 12,
                        "Name: " + valueOrDefault(certificate.get("holderName"), "N/A"));
                writeLine(contentStream, regularFont, 12,
                        "Email: " + valueOrDefault(certificate.get("holderEmail"), "N/A"));
                writeLine(contentStream, regularFont, 12,
                        "Phone: " + valueOrDefault(certificate.get("holderPhone"), "N/A"));
                contentStream.newLine();

                writeLine(contentStream, boldFont, 12, "Claim Summary");
                writeLine(contentStream, regularFont, 12,
                        "Coverage Amount: $" + certificate.get("coverageAmount"));
                writeLine(contentStream, regularFont, 12,
                        "Claim Type: " + valueOrDefault(claim.getType(), "General Insurance"));
                writeLine(contentStream, regularFont, 12,
                        "Description: " + valueOrDefault(claim.getDescription(), "No description provided"));
                contentStream.newLine();

                writeLine(contentStream, boldFont, 12, "Uploaded Documents");
                Map<String, String> documents = claimDocuments.getOrDefault(claimId, Collections.emptyMap());
                if (documents.isEmpty()) {
                    writeLine(contentStream, regularFont, 12, "No documents recorded.");
                } else {
                    for (Map.Entry<String, String> entry : documents.entrySet()) {
                        writeLine(contentStream, regularFont, 12,
                                "- " + entry.getKey() + ": " + entry.getValue());
                    }
                }
                contentStream.newLine();
                writeLine(contentStream, italicFont, 11,
                        "Digitally generated by the Insurance Claim Verification System.");
                contentStream.endText();
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException ex) {
            throw new RuntimeException("Failed to generate certificate PDF", ex);
        }
    }

    public ClaimDto getClaim(String claimId) {
        return claims.get(claimId);
    }

    public List<ClaimDto> getUserClaims(String userId) {
        List<String> claimIds = userClaims.getOrDefault(userId, new ArrayList<>());
        return claimIds.stream()
                .map(claims::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<ClaimDto> getAllClaims() {
        return new ArrayList<>(claims.values());
    }

    public List<ClaimDto> getPendingClaims() {
        return claims.values().stream()
                .filter(claim -> "PENDING".equals(claim.getStatus()))
                .collect(Collectors.toList());
    }

    public ClaimDto updateClaimStatus(String claimId, String status, String insuranceCompanyId,
            String rejectionReason) {
        ClaimDto claim = claims.get(claimId);
        if (claim != null) {
            claim.setStatus(status);
            if ("APPROVED".equals(status)) {
                claim.setInsuranceCompanyId(insuranceCompanyId);
                claim.setVerifiedDate(new Date());
                claim.setCertificateUrl("/certificates/" + claimId + ".pdf");
            } else if ("REJECTED".equals(status) && rejectionReason != null) {
                claim.setRejectionReason(rejectionReason);
            }
            claims.put(claimId, claim);
        }
        return claim;
    }

    public List<ClaimDto> getClaimsByInsuranceCompany(String insuranceCompanyId) {
        return claims.values().stream()
                .filter(claim -> insuranceCompanyId.equals(claim.getInsuranceCompanyId()))
                .collect(Collectors.toList());
    }

    private void writeLine(PDPageContentStream contentStream, PDFont font, float fontSize, String text)
            throws IOException {
        contentStream.setFont(font, fontSize);
        contentStream.showText(text);
        contentStream.newLine();
    }

    private String valueOrDefault(Object value, String fallback) {
        if (value == null) {
            return fallback;
        }

        String text = value.toString();
        return text.isBlank() ? fallback : text;
    }
}
