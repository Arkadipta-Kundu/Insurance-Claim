// frontend/src/components/InsuranceCompanyDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const InsuranceCompanyDashboard = () => {
  const { user } = useAuth();
  const [pendingClaims, setPendingClaims] = useState([]);
  const [approvedClaims, setApprovedClaims] = useState([]);
  const [rejectedClaims, setRejectedClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchAllClaims();
  }, []);

  const fetchAllClaims = async () => {
    try {
      // Simulating API data
      const mockClaims = [
        {
          id: "CLM001",
          userName: "John Doe",
          userEmail: "john@example.com",
          type: "Health Insurance",
          amount: 5000,
          description: "Medical expenses for surgery",
          incidentDate: "2024-01-10",
          submissionDate: "2024-01-15",
          status: "PENDING",
          documents: ["medical_report.pdf", "hospital_bill.pdf"],
        },
        {
          id: "CLM002",
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          type: "Vehicle Insurance",
          amount: 2500,
          description: "Car accident repair",
          incidentDate: "2024-01-18",
          submissionDate: "2024-01-20",
          status: "PENDING",
          documents: ["police_report.pdf", "repair_estimate.pdf"],
        },
        {
          id: "CLM003",
          userName: "Mike Johnson",
          userEmail: "mike@example.com",
          type: "Home Insurance",
          amount: 10000,
          description: "Water damage restoration",
          incidentDate: "2024-01-05",
          submissionDate: "2024-01-08",
          status: "PENDING",
          documents: ["damage_photos.zip", "plumber_report.pdf"],
        },
      ];

      setPendingClaims(mockClaims);
      setApprovedClaims([]);
      setRejectedClaims([]);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClaim = async (claimId, status) => {
    try {
      // In real app, this would be an API call
      const claim = pendingClaims.find((c) => c.id === claimId);
      if (claim) {
        claim.status = status;
        if (status === "APPROVED") {
          claim.insuranceCompanyId = user.id;
          claim.insuranceCompanyName = user.companyName;
          claim.verifiedDate = new Date().toISOString();
          setApprovedClaims([...approvedClaims, claim]);
        } else if (status === "REJECTED") {
          claim.rejectionReason = rejectionReason;
          setRejectedClaims([...rejectedClaims, claim]);
        }
        setPendingClaims(pendingClaims.filter((c) => c.id !== claimId));
        alert(`Claim ${status.toLowerCase()} successfully!`);
        setSelectedClaim(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error updating claim:", error);
      alert("Failed to update claim");
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-600",
      APPROVED: "bg-green-100 text-green-600",
      REJECTED: "bg-red-100 text-red-600",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.companyName || user?.name}!
        </h1>
        <p className="text-purple-100">
          Review and verify insurance claims submitted by users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingClaims.length}
          </p>
          <p className="text-gray-600">Pending Claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-2xl font-bold text-green-600">
            {approvedClaims.length}
          </p>
          <p className="text-gray-600">Approved Claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">❌</div>
          <p className="text-2xl font-bold text-red-600">
            {rejectedClaims.length}
          </p>
          <p className="text-gray-600">Rejected Claims</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Claims ({pendingClaims.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "approved"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Approved ({approvedClaims.length})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "rejected"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Rejected ({rejectedClaims.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "pending" && (
            <>
              {pendingClaims.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No pending claims to review.
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Claim #{claim.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Submitted by: {claim.userName} ({claim.userEmail})
                          </p>
                          <p className="text-sm text-gray-500">
                            Submitted on: {claim.submissionDate}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(claim.status)}`}
                        >
                          {claim.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{claim.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium">${claim.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Incident Date</p>
                          <p className="font-medium">{claim.incidentDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Documents</p>
                          <p className="font-medium">
                            {claim.documents.length} file(s)
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-gray-700">{claim.description}</p>
                      </div>

                      {claim.documents && claim.documents.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">
                            Documents
                          </p>
                          <div className="flex space-x-2">
                            {claim.documents.map((doc, idx) => (
                              <button
                                key={idx}
                                className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                              >
                                📄 {doc}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedClaim === claim.id ? (
                        <div className="space-y-3 mt-4">
                          <textarea
                            placeholder="Reason for rejection (required if rejecting)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            rows="2"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleVerifyClaim(claim.id, "APPROVED")
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              ✓ Approve Claim
                            </button>
                            <button
                              onClick={() =>
                                handleVerifyClaim(claim.id, "REJECTED")
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              ✗ Reject Claim
                            </button>
                            <button
                              onClick={() => setSelectedClaim(null)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedClaim(claim.id)}
                          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Review & Verify Claim
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "approved" && (
            <div className="space-y-4">
              {approvedClaims.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No approved claims yet.
                </div>
              ) : (
                approvedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="border rounded-lg p-4 bg-green-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Claim #{claim.id}</p>
                        <p className="text-sm text-gray-600">
                          {claim.userName}
                        </p>
                        <p className="text-sm">
                          ${claim.amount} - {claim.type}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-700">
                        Verified on {claim.verifiedDate}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "rejected" && (
            <div className="space-y-4">
              {rejectedClaims.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No rejected claims.
                </div>
              ) : (
                rejectedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="border rounded-lg p-4 bg-red-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Claim #{claim.id}</p>
                        <p className="text-sm text-gray-600">
                          {claim.userName}
                        </p>
                        <p className="text-sm">
                          ${claim.amount} - {claim.type}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {claim.rejectionReason}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-700">
                        Rejected
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceCompanyDashboard;
