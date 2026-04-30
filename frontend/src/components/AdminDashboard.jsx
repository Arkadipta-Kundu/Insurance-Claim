// frontend/src/components/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [allClaims, setAllClaims] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("week");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Mock Data
      const mockClaims = [
        {
          id: "CLM001",
          userName: "John Doe",
          type: "Health",
          amount: 5000,
          status: "APPROVED",
          date: "2024-01-15",
          insuranceCompany: "ABC Insurance",
        },
        {
          id: "CLM002",
          userName: "Jane Smith",
          type: "Vehicle",
          amount: 2500,
          status: "PENDING",
          date: "2024-01-20",
          insuranceCompany: null,
        },
        {
          id: "CLM003",
          userName: "Mike Johnson",
          type: "Home",
          amount: 10000,
          status: "UNDER_REVIEW",
          date: "2024-01-22",
          insuranceCompany: "XYZ Insurance",
        },
        {
          id: "CLM004",
          userName: "Sarah Williams",
          type: "Health",
          amount: 3000,
          status: "REJECTED",
          date: "2024-01-25",
          insuranceCompany: null,
        },
        {
          id: "CLM005",
          userName: "Robert Brown",
          type: "Life",
          amount: 50000,
          status: "PENDING",
          date: "2024-01-28",
          insuranceCompany: null,
        },
        {
          id: "CLM006",
          userName: "Emily Davis",
          type: "Vehicle",
          amount: 1800,
          status: "APPROVED",
          date: "2024-01-29",
          insuranceCompany: "XYZ Insurance",
        },
        {
          id: "CLM007",
          userName: "David Wilson",
          type: "Health",
          amount: 7500,
          status: "UNDER_REVIEW",
          date: "2024-01-30",
          insuranceCompany: "ABC Insurance",
        },
      ];

      const mockUsers = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
          verified: true,
          registeredDate: "2024-01-01",
          lastActive: "2024-01-30",
          claims: 3,
          status: "ACTIVE",
        },
        {
          id: "2",
          name: "ABC Insurance",
          email: "abc@insurance.com",
          role: "INSURANCE_COMPANY",
          companyName: "ABC Insurance",
          verified: true,
          registeredDate: "2024-01-02",
          lastActive: "2024-01-29",
          claims: 15,
          status: "ACTIVE",
        },
        {
          id: "3",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "USER",
          verified: true,
          registeredDate: "2024-01-03",
          lastActive: "2024-01-28",
          claims: 2,
          status: "ACTIVE",
        },
        {
          id: "4",
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "USER",
          verified: true,
          registeredDate: "2024-01-04",
          lastActive: "2024-01-27",
          claims: 1,
          status: "ACTIVE",
        },
        {
          id: "5",
          name: "XYZ Insurance",
          email: "xyz@insurance.com",
          role: "INSURANCE_COMPANY",
          companyName: "XYZ Insurance",
          verified: true,
          registeredDate: "2024-01-10",
          lastActive: "2024-01-28",
          claims: 12,
          status: "ACTIVE",
        },
        {
          id: "6",
          name: "Sarah Williams",
          email: "sarah@example.com",
          role: "USER",
          verified: true,
          registeredDate: "2024-01-05",
          lastActive: "2024-01-26",
          claims: 1,
          status: "ACTIVE",
        },
        {
          id: "7",
          name: "Robert Brown",
          email: "robert@example.com",
          role: "USER",
          verified: true,
          registeredDate: "2024-01-06",
          lastActive: "2024-01-25",
          claims: 0,
          status: "SUSPENDED",
        },
        {
          id: "8",
          name: "Emily Davis",
          email: "emily@example.com",
          role: "USER",
          verified: true,
          registeredDate: "2024-01-07",
          lastActive: "2024-01-29",
          claims: 1,
          status: "ACTIVE",
        },
      ];

      const mockTickets = [
        {
          id: "TKT001",
          userName: "John Doe",
          subject: "Claim status inquiry",
          status: "OPEN",
          priority: "HIGH",
          date: "2024-01-18",
        },
        {
          id: "TKT002",
          userName: "Jane Smith",
          subject: "Document upload issue",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          date: "2024-01-19",
        },
        {
          id: "TKT003",
          userName: "Mike Johnson",
          subject: "Certificate download",
          status: "RESOLVED",
          priority: "HIGH",
          date: "2024-01-15",
        },
        {
          id: "TKT004",
          userName: "Sarah Williams",
          subject: "Biometric verification",
          status: "OPEN",
          priority: "HIGH",
          date: "2024-01-28",
        },
        {
          id: "TKT005",
          userName: "Emily Davis",
          subject: "Payment delay",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          date: "2024-01-29",
        },
      ];

      setAllClaims(mockClaims);
      setAllUsers(mockUsers);
      setAllTickets(mockTickets);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const stats = {
    totalClaims: allClaims.length,
    pendingClaims: allClaims.filter((c) => c.status === "PENDING").length,
    approvedClaims: allClaims.filter((c) => c.status === "APPROVED").length,
    rejectedClaims: allClaims.filter((c) => c.status === "REJECTED").length,
    underReviewClaims: allClaims.filter((c) => c.status === "UNDER_REVIEW")
      .length,
    totalUsers: allUsers.length,
    insuranceCompanies: allUsers.filter((u) => u.role === "INSURANCE_COMPANY")
      .length,
    regularUsers: allUsers.filter((u) => u.role === "USER").length,
    activeUsers: allUsers.filter((u) => u.status === "ACTIVE").length,
    suspendedUsers: allUsers.filter((u) => u.status === "SUSPENDED").length,
    totalTickets: allTickets.length,
    openTickets: allTickets.filter((t) => t.status === "OPEN").length,
    inProgressTickets: allTickets.filter((t) => t.status === "IN_PROGRESS")
      .length,
    resolvedTickets: allTickets.filter((t) => t.status === "RESOLVED").length,
    highPriorityTickets: allTickets.filter((t) => t.priority === "HIGH").length,
  };

  // Chart Data
  const claimStatusData = [
    { name: "Pending", value: stats.pendingClaims, color: "#F59E0B" },
    { name: "Under Review", value: stats.underReviewClaims, color: "#3B82F6" },
    { name: "Approved", value: stats.approvedClaims, color: "#10B981" },
    { name: "Rejected", value: stats.rejectedClaims, color: "#EF4444" },
  ];

  const userRoleData = [
    { name: "Regular Users", value: stats.regularUsers, color: "#3B82F6" },
    {
      name: "Insurance Companies",
      value: stats.insuranceCompanies,
      color: "#8B5CF6",
    },
  ];

  const ticketStatusData = [
    { name: "Open", value: stats.openTickets, color: "#EF4444" },
    { name: "In Progress", value: stats.inProgressTickets, color: "#F59E0B" },
    { name: "Resolved", value: stats.resolvedTickets, color: "#10B981" },
  ];

  const weeklyData = [
    { day: "Mon", claims: 12, approved: 8, pending: 4 },
    { day: "Tue", claims: 15, approved: 10, pending: 5 },
    { day: "Wed", claims: 8, approved: 12, pending: 3 },
    { day: "Thu", claims: 20, approved: 15, pending: 5 },
    { day: "Fri", claims: 18, approved: 14, pending: 4 },
    { day: "Sat", claims: 5, approved: 6, pending: 2 },
    { day: "Sun", claims: 3, approved: 4, pending: 1 },
  ];

  const monthlyTrendData = [
    { month: "Jan", claims: 45, users: 12, tickets: 8 },
    { month: "Feb", claims: 52, users: 8, tickets: 12 },
    { month: "Mar", claims: 48, users: 15, tickets: 10 },
    { month: "Apr", claims: 60, users: 10, tickets: 15 },
    { month: "May", claims: 55, users: 18, tickets: 20 },
    { month: "Jun", claims: 42, users: 12, tickets: 18 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-red-100">
          Welcome, {user?.name}! Here's an overview of your insurance claim
          system.
        </p>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalClaims}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-4 flex justify-between text-xs">
            <span className="text-green-600">
              ✓ {stats.approvedClaims} Approved
            </span>
            <span className="text-yellow-600">
              ⏳ {stats.pendingClaims} Pending
            </span>
            <span className="text-red-600">
              ✗ {stats.rejectedClaims} Rejected
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalUsers}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <div className="mt-4 flex justify-between text-xs">
            <span className="text-blue-600">👤 {stats.regularUsers} Users</span>
            <span className="text-purple-600">
              🏢 {stats.insuranceCompanies} Companies
            </span>
            <span className="text-green-600">✓ {stats.activeUsers} Active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Support Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalTickets}
              </p>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
          <div className="mt-4 flex justify-between text-xs">
            <span className="text-red-600">🔴 {stats.openTickets} Open</span>
            <span className="text-yellow-600">
              🟡 {stats.inProgressTickets} In Progress
            </span>
            <span className="text-green-600">
              ✅ {stats.resolvedTickets} Resolved
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">System Health</p>
              <p className="text-3xl font-bold text-green-600 mt-2">98%</p>
            </div>
            <div className="text-3xl">💚</div>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            All systems operational
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Claims Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Claims Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={claimStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {claimStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Role Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ticket Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ticket Status
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ticketStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {ticketStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Activity
            </h3>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="claims"
                stroke="#3B82F6"
                strokeWidth={2}
                name="New Claims"
              />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#10B981"
                strokeWidth={2}
                name="Approved"
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Trend Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="claims"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              name="Claims"
            />
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
              name="New Users"
            />
            <Area
              type="monotone"
              dataKey="tickets"
              stackId="1"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.3}
              name="Tickets"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Claims */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Claims
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {allClaims.slice(0, 5).map((claim) => (
              <div
                key={claim.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {claim.userName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {claim.type} - ${claim.amount}
                    </p>
                    <p className="text-xs text-gray-400">{claim.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Support Tickets
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {allTickets.slice(0, 5).map((ticket) => (
              <div
                key={ticket.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {ticket.subject}
                    </p>
                    <p className="text-sm text-gray-500">
                      From: {ticket.userName}
                    </p>
                    <p className="text-xs text-gray-400">{ticket.date}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === "OPEN"
                          ? "bg-red-100 text-red-600"
                          : ticket.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ticket.priority === "HIGH"
                          ? "bg-red-100 text-red-600"
                          : ticket.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticket.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-2xl font-bold text-blue-700">
            {((stats.approvedClaims / stats.totalClaims) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-blue-600">Approval Rate</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold text-green-700">
            {stats.resolvedTickets}
          </p>
          <p className="text-sm text-green-600">Resolved Tickets</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="text-3xl mb-2">🏢</div>
          <p className="text-2xl font-bold text-purple-700">
            {stats.insuranceCompanies}
          </p>
          <p className="text-sm text-purple-600">Active Companies</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="text-3xl mb-2">💰</div>
          <p className="text-2xl font-bold text-orange-700">
            ${allClaims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-orange-600">Total Claim Amount</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
