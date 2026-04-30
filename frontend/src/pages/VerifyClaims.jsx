// frontend/src/pages/VerifyClaims.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const VerifyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      // Simulate API call
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
          certificateId: "INS-1705305600000",
          documents: ["medical_report.pdf", "hospital_bill.pdf"],
          biometricVerified: true,
        },
      ];
      setClaims(mockClaims);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (claimId, status) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Claim ${status.toLowerCase()} successfully!`);
      setClaims(claims.filter((c) => c.id !== claimId));
      setSelectedClaim(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error verifying claim:", error);
      alert("Failed to verify claim");
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Verify Claims</h1>
        <p className="text-purple-100">
          Review and verify pending insurance claims
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Pending Claims
          </h3>
          <p className="text-gray-600">All claims have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-6">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Claim #{claim.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submitted by: {claim.userName} ({claim.userEmail})
                    </p>
                    <p className="text-sm text-gray-500">
                      Certificate ID: {claim.certificateId}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                    PENDING
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
                    <p className="text-sm text-gray-500">Biometric Status</p>
                    <p className="font-medium text-green-600">✓ Verified</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{claim.description}</p>
                </div>

                {selectedClaim === claim.id ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Reason for rejection (if rejecting)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVerify(claim.id, "APPROVED")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        ✓ Approve Claim
                      </button>
                      <button
                        onClick={() => handleVerify(claim.id, "REJECTED")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ✗ Reject Claim
                      </button>
                      <button
                        onClick={() => setSelectedClaim(null)}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedClaim(claim.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Review & Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyClaims;
