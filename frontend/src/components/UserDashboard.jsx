// frontend/src/components/UserDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    approvedClaims: 0,
    pendingClaims: 0,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const savedClaims = localStorage.getItem("userClaims");
      const userClaims = savedClaims ? JSON.parse(savedClaims) : [];

      setClaims(userClaims);

      setStats({
        totalClaims: userClaims.length,
        approvedClaims: userClaims.filter((c) => c.status === "APPROVED")
          .length,
        pendingClaims: userClaims.filter((c) => c.status === "PENDING").length,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Approved ✓";
      case "PENDING":
        return "Pending";
      case "UNDER_REVIEW":
        return "Under Review";
      case "REJECTED":
        return "Rejected ✗";
      default:
        return status;
    }
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100">
          Manage your insurance claims and track their status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">📄</div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalClaims}
          </p>
          <p className="text-gray-600">Total Claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-2xl font-bold text-green-600">
            {stats.approvedClaims}
          </p>
          <p className="text-gray-600">Approved Claims</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendingClaims}
          </p>
          <p className="text-gray-600">Pending Claims</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/claims/new"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all text-center"
        >
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Submit New Claim
          </h3>
          <p className="text-gray-600 text-sm">File a new insurance claim</p>
        </Link>

        <Link
          to="/claims"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all text-center"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            My Claims
          </h3>
          <p className="text-gray-600 text-sm">View all your claims</p>
        </Link>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Claims</h2>
          <Link
            to="/claims"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View All →
          </Link>
        </div>
        {claims.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No claims yet. Submit your first claim!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {claims.slice(0, 5).map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {claim.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {claim.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${claim.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}
                      >
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
