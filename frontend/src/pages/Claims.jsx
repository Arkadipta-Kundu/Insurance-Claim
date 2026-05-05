// frontend/src/pages/Claims.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const Claims = () => {
  const { user, token } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token && user?.email) {
      fetchClaims();
    }
  }, [token, user?.email]);

  const fetchClaims = async () => {
    try {
      const data = await api.getUserClaims(token, user.email);
      setClaims(data);
    } catch (error) {
      console.error("Error fetching claims:", error);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-600";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return "✅";
      case "PENDING":
        return "⏳";
      case "UNDER_REVIEW":
        return "🔍";
      case "REJECTED":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Approved - Claim Certificate Ready";
      case "PENDING":
        return "Pending Review";
      case "UNDER_REVIEW":
        return "Under Review by Insurance Company";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const handleDownloadCertificate = async (claim) => {
    try {
      const { blob, filename } = await api.downloadCertificate(token, claim.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message || "Failed to download certificate");
    }
  };

  const formatDate = (value) => {
    if (!value) return "Not available";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? "Not available"
      : parsed.toLocaleDateString();
  };

  const filteredClaims = claims.filter((claim) => {
    if (filter === "all") return true;
    return claim.status === filter;
  });

  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status === "APPROVED").length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    underReview: claims.filter((c) => c.status === "UNDER_REVIEW").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Insurance Claims
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your insurance claims
          </p>
        </div>
        <Link
          to="/claims/new"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          + Submit New Claim
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">📊</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-gray-600">Total Claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-gray-600">Approved</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-gray-600">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-2xl font-bold text-blue-600">
            {stats.underReview}
          </p>
          <p className="text-gray-600">Under Review</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {["all", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    filter === status
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {status === "all" ? "All Claims" : status.replace("_", " ")}
                </button>
              ),
            )}
          </nav>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Claims Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any claims yet.
            </p>
            <Link
              to="/claims/new"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg inline-block"
            >
              Submit Your First Claim
            </Link>
          </div>
        ) : (
          filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">
                        {getStatusIcon(claim.status)}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Claim #{claim.id}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Submitted: {formatDate(claim.submissionDate)}
                    </p>
                    {(claim.approvedDate || claim.verifiedDate) && (
                      <p className="text-sm text-green-600">
                        Approved: {formatDate(claim.approvedDate || claim.verifiedDate)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}
                  >
                    {getStatusText(claim.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Claim Type</p>
                    <p className="font-medium">
                      {claim.type || "General Insurance"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Claim Amount</p>
                    <p className="font-medium text-lg text-blue-600">
                      ${claim.amount || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Incident Date</p>
                    <p className="font-medium">{formatDate(claim.incidentDate)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">
                    {claim.description || "No description provided."}
                  </p>
                </div>

                {claim.documents && claim.documents.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Documents ({claim.documents.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {claim.documents.map((doc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                        >
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {claim.status === "APPROVED" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDownloadCertificate(claim)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📥 Download Claim Certificate
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Your claim has been approved. Download the certificate for
                      your records.
                    </p>
                  </div>
                )}

                {claim.status === "REJECTED" && claim.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-semibold text-red-800">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-red-700">
                      {claim.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Claims;
