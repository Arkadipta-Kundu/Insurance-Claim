package com.project.insurancebackend.service;

import com.project.insurancebackend.dto.PolicyPlanDto;
import com.project.insurancebackend.dto.PolicyPurchaseDto;
import com.project.insurancebackend.dto.PurchasePolicyRequest;
import com.project.insurancebackend.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    private final Map<String, PolicyPlanDto> planCatalog = new ConcurrentHashMap<>();
    private final Map<String, PolicyPurchaseDto> purchases = new ConcurrentHashMap<>();
    private final Map<String, List<String>> userPurchases = new ConcurrentHashMap<>();

    @Autowired
    private AuthService authService;

    public PolicyService() {
        seedPlans();
    }

    public List<PolicyPlanDto> getAvailablePlans() {
        return planCatalog.values().stream()
                .sorted(Comparator.comparing(PolicyPlanDto::isFeatured).reversed()
                        .thenComparing(PolicyPlanDto::getAnnualPremium))
                .collect(Collectors.toList());
    }

    public List<PolicyPurchaseDto> getUserPolicies(String userEmail) {
        return userPurchases.getOrDefault(userEmail, List.of()).stream()
                .map(purchases::get)
                .filter(java.util.Objects::nonNull)
                .sorted(Comparator.comparing(PolicyPurchaseDto::getPurchasedAt).reversed())
                .collect(Collectors.toList());
    }

    public PolicyPurchaseDto purchasePolicy(String userEmail, PurchasePolicyRequest request) {
        if (request == null || request.getPlanId() == null || request.getPlanId().isBlank()) {
            throw new RuntimeException("Plan selection is required");
        }

        PolicyPlanDto plan = planCatalog.get(request.getPlanId());
        if (plan == null) {
            throw new RuntimeException("Selected plan was not found");
        }

        UserDto user = authService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String frequency = normalizeFrequency(request.getPremiumFrequency());
        Date purchasedAt = new Date();

        Calendar start = Calendar.getInstance();
        start.setTime(purchasedAt);

        Calendar end = Calendar.getInstance();
        end.setTime(purchasedAt);
        end.add(Calendar.YEAR, 1);

        PolicyPurchaseDto purchase = new PolicyPurchaseDto();
        purchase.setId("PUR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT));
        purchase.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase(Locale.ROOT));
        purchase.setUserEmail(userEmail);
        purchase.setHolderName(user.getName());
        purchase.setHolderPhone(user.getPhone());
        purchase.setPlanId(plan.getId());
        purchase.setPlanName(plan.getName());
        purchase.setCategory(plan.getCategory());
        purchase.setCoverageAmount(plan.getCoverageAmount());
        purchase.setPremiumAmount("MONTHLY".equals(frequency) ? plan.getMonthlyPremium() : plan.getAnnualPremium());
        purchase.setPremiumFrequency(frequency);
        purchase.setDeductible(plan.getDeductible());
        purchase.setClaimSettlementRatio(plan.getClaimSettlementRatio());
        purchase.setNomineeName(blankToNull(request.getNomineeName()));
        purchase.setNomineeRelationship(blankToNull(request.getNomineeRelationship()));
        purchase.setStatus("ACTIVE");
        purchase.setPurchasedAt(purchasedAt);
        purchase.setCoverageStartDate(start.getTime());
        purchase.setCoverageEndDate(end.getTime());
        purchase.setBenefits(new ArrayList<>(plan.getBenefits()));

        purchases.put(purchase.getId(), purchase);
        userPurchases.computeIfAbsent(userEmail, key -> new ArrayList<>()).add(purchase.getId());
        return purchase;
    }

    public Map<String, Object> getUserPolicySummary(String userEmail) {
        List<PolicyPurchaseDto> policies = getUserPolicies(userEmail);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalPolicies", policies.size());
        summary.put("activePolicies", policies.stream().filter(policy -> "ACTIVE".equals(policy.getStatus())).count());
        summary.put("totalCoverage", policies.stream().mapToDouble(PolicyPurchaseDto::getCoverageAmount).sum());
        summary.put("monthlyPolicies", policies.stream().filter(policy -> "MONTHLY".equals(policy.getPremiumFrequency())).count());
        return summary;
    }

    private void seedPlans() {
        savePlan(createPlan(
                "PLAN-HEALTH-PLUS",
                "Health Plus Shield",
                "Health Insurance",
                "Cashless hospitalization, annual wellness checks, and family add-ons for everyday protection.",
                2499,
                26999,
                500000,
                5000,
                "98.4%",
                true,
                List.of("Cashless network hospitals", "Pre and post hospitalization", "Annual health check-up",
                        "Day care procedures")));

        savePlan(createPlan(
                "PLAN-FAMILY-SECURE",
                "Family Secure Gold",
                "Family Floater",
                "A broader family floater plan covering spouse, children, and emergency ambulance support.",
                4199,
                45999,
                1000000,
                8000,
                "97.9%",
                true,
                List.of("Covers entire family under one plan", "Maternity waiting period benefits",
                        "Ambulance and emergency support", "No claim bonus every renewal")));

        savePlan(createPlan(
                "PLAN-MOTOR-SMART",
                "Motor Smart Protect",
                "Vehicle Insurance",
                "Comprehensive car coverage with roadside assistance, own damage cover, and theft protection.",
                1499,
                15999,
                300000,
                2500,
                "96.8%",
                false,
                List.of("Comprehensive own damage cover", "24/7 roadside assistance", "Third-party liability cover",
                        "Theft and natural calamity protection")));
    }

    private void savePlan(PolicyPlanDto plan) {
        planCatalog.put(plan.getId(), plan);
    }

    private PolicyPlanDto createPlan(String id, String name, String category, String description,
            double monthlyPremium, double annualPremium, double coverageAmount, double deductible,
            String claimSettlementRatio, boolean featured, List<String> benefits) {
        PolicyPlanDto plan = new PolicyPlanDto();
        plan.setId(id);
        plan.setName(name);
        plan.setCategory(category);
        plan.setDescription(description);
        plan.setMonthlyPremium(monthlyPremium);
        plan.setAnnualPremium(annualPremium);
        plan.setCoverageAmount(coverageAmount);
        plan.setDeductible(deductible);
        plan.setClaimSettlementRatio(claimSettlementRatio);
        plan.setFeatured(featured);
        plan.setBenefits(benefits);
        return plan;
    }

    private String normalizeFrequency(String frequency) {
        if (frequency == null) {
            return "ANNUAL";
        }

        String normalized = frequency.trim().toUpperCase(Locale.ROOT);
        return "MONTHLY".equals(normalized) ? "MONTHLY" : "ANNUAL";
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
