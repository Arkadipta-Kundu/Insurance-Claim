// frontend/src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function request(path, options = {}) {
  const headers = options.headers || {};

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type");

  let data;
  if (contentType?.includes("application/json")) {
    data = await res.json();
  } else if (contentType?.includes("application/octet-stream")) {
    data = await res.blob();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const msg =
      typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(msg);
  }

  return data;
}

function getFilenameFromDisposition(disposition, fallback) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

export const api = {
  sendOtp: (email) =>
    request("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email, otp) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    }),

  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  getPolicyPlans: () =>
    request("/api/policies/plans", {
      method: "GET",
    }),

  getMyPolicies: (token) =>
    request("/api/policies/my", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  purchasePolicy: (token, payload) =>
    request("/api/policies/purchase", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),

  createClaim: (token) =>
    request("/api/claims", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),

  getUserClaims: (token, userEmail) =>
    request(`/api/claims/user/${encodeURIComponent(userEmail)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  uploadDoc: async (token, claimId, docType, file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${BASE}/api/claims/${claimId}/docs/${docType}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Upload failed");
    }

    return await res.json();
  },

  downloadDoc: async (token, claimId, docType) => {
    const res = await fetch(`${BASE}/api/claims/${claimId}/docs/${docType}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Download failed");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = docType;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
    return { success: true };
  },

  verifyBiometric: (token, claimId, who, biometricToken) =>
    request(`/api/claims/${claimId}/biometric/${who}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ biometricToken }),
    }),

  submitClaim: (token, claimId) =>
    request(`/api/claims/${claimId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  downloadCertificate: async (token, claimId) => {
    const res = await fetch(`${BASE}/api/claims/${claimId}/certificate`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      let message = "Certificate download failed";
      try {
        const data = await res.json();
        message = data?.message || message;
      } catch {
        const text = await res.text();
        message = text || message;
      }
      throw new Error(message);
    }

    const blob = await res.blob();
    const filename = getFilenameFromDisposition(
      res.headers.get("content-disposition"),
      `insurance-certificate-${claimId}.pdf`,
    );

    return { blob, filename };
  },

  processImages: (token, claimId) =>
    request(`/api/claims/${claimId}/process-images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
