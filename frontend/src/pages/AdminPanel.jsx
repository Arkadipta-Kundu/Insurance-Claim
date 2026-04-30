// frontend/src/pages/AdminPanel.jsx
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
} from "recharts";

const AdminPanel = () => {
  const { user } = useAuth();
  const [allClaims, setAllClaims] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [ticketFilter, setTicketFilter] = useState("open");
  const [selectedUser, setSelectedUser] = useState(null);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoApproveClaims: false,
    maxClaimAmount: 50000,
    emailNotifications: true,
  });
  const [showSettings, setShowSettings] = useState(false);
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
          userId: "1",
          type: "Health",
          amount: 5000,
          status: "APPROVED",
          date: "2024-01-15",
          insuranceCompany: "ABC Insurance",
        },
        {
          id: "CLM002",
          userName: "Jane Smith",
          userId: "3",
          type: "Vehicle",
          amount: 2500,
          status: "PENDING",
          date: "2024-01-20",
          insuranceCompany: null,
        },
        {
          id: "CLM003",
          userName: "Mike Johnson",
          userId: "4",
          type: "Home",
          amount: 10000,
          status: "UNDER_REVIEW",
          date: "2024-01-22",
          insuranceCompany: "XYZ Insurance",
        },
        {
          id: "CLM004",
          userName: "Sarah Williams",
          userId: "6",
          type: "Health",
          amount: 3000,
          status: "REJECTED",
          date: "2024-01-25",
          insuranceCompany: null,
        },
        {
          id: "CLM005",
          userName: "Robert Brown",
          userId: "7",
          type: "Life",
          amount: 50000,
          status: "PENDING",
          date: "2024-01-28",
          insuranceCompany: null,
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
          verified: false,
          registeredDate: "2024-01-10",
          lastActive: null,
          claims: 0,
          status: "PENDING",
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
      ];

      const mockTickets = [
        {
          id: "TKT001",
          userId: "1",
          userName: "John Doe",
          userEmail: "john@example.com",
          subject: "Claim status inquiry",
          message:
            "When will my claim be processed? It has been pending for 5 days.",
          status: "OPEN",
          priority: "HIGH",
          date: "2024-01-18",
          replies: [],
          resolvedDate: null,
        },
        {
          id: "TKT002",
          userId: "3",
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          subject: "Document upload issue",
          message: "Getting error while uploading PDF files.",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          date: "2024-01-19",
          replies: ["We are investigating this issue."],
          resolvedDate: null,
        },
        {
          id: "TKT003",
          userId: "4",
          userName: "Mike Johnson",
          userEmail: "mike@example.com",
          subject: "Insurance certificate download",
          message: "Unable to download my approved certificate.",
          status: "RESOLVED",
          priority: "HIGH",
          date: "2024-01-15",
          replies: ["Certificate download link has been fixed."],
          resolvedDate: "2024-01-17",
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

  const handleApproveCompany = (userId) => {
    setAllUsers(
      allUsers.map((u) =>
        u.id === userId ? { ...u, verified: true, status: "ACTIVE" } : u,
      ),
    );
    alert("Insurance company approved successfully!");
  };

  const handleSuspendUser = (userId) => {
    setAllUsers(
      allUsers.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : u,
      ),
    );
    alert(
      `User ${allUsers.find((u) => u.id === userId)?.status === "ACTIVE" ? "suspended" : "activated"} successfully!`,
    );
  };

  const handleReplyToTicket = (ticketId, action) => {
    if (action === "resolve" && !replyMessage) {
      alert("Please provide a resolution message before resolving the ticket.");
      return;
    }

    const updatedTickets = allTickets.map((ticket) => {
      if (ticket.id === ticketId) {
        const updatedTicket = { ...ticket };

        if (action === "resolve") {
          updatedTicket.status = "RESOLVED";
          updatedTicket.resolvedDate = new Date().toISOString().split("T")[0];
          if (replyMessage) {
            updatedTicket.replies = [
              ...(updatedTicket.replies || []),
              `Admin: ${replyMessage}`,
            ];
          }
        } else if (action === "reject") {
          updatedTicket.status = "REJECTED";
          updatedTicket.resolvedDate = new Date().toISOString().split("T")[0];
          if (replyMessage) {
            updatedTicket.replies = [
              ...(updatedTicket.replies || []),
              `Admin: ${replyMessage} - Ticket rejected as invalid/duplicate`,
            ];
          }
        } else if (action === "in-progress") {
          updatedTicket.status = "IN_PROGRESS";
          if (replyMessage) {
            updatedTicket.replies = [
              ...(updatedTicket.replies || []),
              `Admin: ${replyMessage}`,
            ];
          }
        }

        return updatedTicket;
      }
      return ticket;
    });

    setAllTickets(updatedTickets);
    alert(
      `Ticket ${action === "resolve" ? "resolved" : action === "reject" ? "rejected" : "updated to In Progress"} successfully!`,
    );
    setSelectedTicket(null);
    setReplyMessage("");
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

  const getTicketStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-600";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-600";
      case "RESOLVED":
        return "bg-green-100 text-green-600";
      case "REJECTED":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-600";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";
      case "LOW":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "HIGH":
        return "🔴";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const filteredTickets = allTickets.filter((ticket) => {
    if (ticketFilter === "open") return ticket.status === "OPEN";
    if (ticketFilter === "in-progress") return ticket.status === "IN_PROGRESS";
    if (ticketFilter === "resolved") return ticket.status === "RESOLVED";
    if (ticketFilter === "rejected") return ticket.status === "REJECTED";
    if (ticketFilter === "all") return true;
    return true;
  });

  const stats = {
    totalClaims: allClaims.length,
    pendingClaims: allClaims.filter((c) => c.status === "PENDING").length,
    approvedClaims: allClaims.filter((c) => c.status === "APPROVED").length,
    rejectedClaims: allClaims.filter((c) => c.status === "REJECTED").length,
    totalUsers: allUsers.length,
    insuranceCompanies: allUsers.filter((u) => u.role === "INSURANCE_COMPANY")
      .length,
    regularUsers: allUsers.filter((u) => u.role === "USER").length,
    pendingUsers: allUsers.filter(
      (u) => u.role === "INSURANCE_COMPANY" && !u.verified,
    ).length,
    openTickets: allTickets.filter((t) => t.status === "OPEN").length,
    inProgressTickets: allTickets.filter((t) => t.status === "IN_PROGRESS")
      .length,
    resolvedTickets: allTickets.filter((t) => t.status === "RESOLVED").length,
    rejectedTickets: allTickets.filter((t) => t.status === "REJECTED").length,
  };

  const claimStatusData = [
    { name: "Pending", value: stats.pendingClaims, color: "#F59E0B" },
    { name: "Approved", value: stats.approvedClaims, color: "#10B981" },
    { name: "Rejected", value: stats.rejectedClaims, color: "#EF4444" },
  ];

  const userRoleData = [
    { name: "Users", value: stats.regularUsers, color: "#3B82F6" },
    {
      name: "Insurance Companies",
      value: stats.insuranceCompanies,
      color: "#8B5CF6",
    },
  ];

  const weeklyData = [
    { day: "Mon", claims: 12, resolved: 8 },
    { day: "Tue", claims: 15, resolved: 10 },
    { day: "Wed", claims: 8, resolved: 12 },
    { day: "Thu", claims: 20, resolved: 15 },
    { day: "Fri", claims: 18, resolved: 14 },
    { day: "Sat", claims: 5, resolved: 6 },
    { day: "Sun", claims: 3, resolved: 4 },
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
            <p className="text-red-100">
              System Administration & Management Console
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            ⚙️ System Settings
          </button>
        </div>
      </div>

      {/* System Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            System Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Maintenance Mode</p>
                <p className="text-sm text-gray-500">
                  Prevent new submissions during maintenance
                </p>
              </div>
              <button
                onClick={() =>
                  setSystemSettings({
                    ...systemSettings,
                    maintenanceMode: !systemSettings.maintenanceMode,
                  })
                }
                className={`px-4 py-2 rounded-lg ${systemSettings.maintenanceMode ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {systemSettings.maintenanceMode ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Auto-Approve Claims</p>
                <p className="text-sm text-gray-500">
                  Automatically approve claims under threshold
                </p>
              </div>
              <button
                onClick={() =>
                  setSystemSettings({
                    ...systemSettings,
                    autoApproveClaims: !systemSettings.autoApproveClaims,
                  })
                }
                className={`px-4 py-2 rounded-lg ${systemSettings.autoApproveClaims ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {systemSettings.autoApproveClaims ? "Enabled" : "Disabled"}
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold mb-2">Max Claim Amount</p>
              <input
                type="number"
                value={systemSettings.maxClaimAmount}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    maxClaimAmount: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Send email alerts for new claims/tickets
                </p>
              </div>
              <button
                onClick={() =>
                  setSystemSettings({
                    ...systemSettings,
                    emailNotifications: !systemSettings.emailNotifications,
                  })
                }
                className={`px-4 py-2 rounded-lg ${systemSettings.emailNotifications ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {systemSettings.emailNotifications ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalClaims}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
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

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalUsers}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-blue-600">👤 {stats.regularUsers} Users</span>
            <span className="text-purple-600">
              🏢 {stats.insuranceCompanies} Companies
            </span>
            <span className="text-orange-600">
              ⏳ {stats.pendingUsers} Pending
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Active Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.openTickets + stats.inProgressTickets}
              </p>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-red-600">🔴 {stats.openTickets} Open</span>
            <span className="text-yellow-600">
              🟡 {stats.inProgressTickets} In Progress
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Resolved Items</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.resolvedTickets + stats.approvedClaims}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {stats.resolvedTickets} Tickets + {stats.approvedClaims} Claims
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Claims Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={claimStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {claimStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            System Activity Trend
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
        <ResponsiveContainer width="100%" height={300}>
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
              dataKey="resolved"
              stroke="#10B981"
              strokeWidth={2}
              name="Resolved Claims"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📈 System Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "users"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setActiveTab("claims")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "claims"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📋 Claims Audit
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "companies"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🏢 Company Approvals
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "tickets"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🎫 Support Management ({stats.openTickets} pending)
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Recent System Activity
              </h3>
              <div className="space-y-3">
                {allClaims.slice(0, 5).map((claim) => (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {claim.userName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {claim.type} Claim - ${claim.amount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}
                      >
                        {claim.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {claim.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Claims
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allUsers
                    .filter((u) => u.role !== "ADMIN")
                    .map((userItem) => (
                      <tr key={userItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">
                          {userItem.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {userItem.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              userItem.role === "INSURANCE_COMPANY"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {userItem.role === "INSURANCE_COMPANY"
                              ? "Insurance Co"
                              : "User"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              userItem.status === "ACTIVE"
                                ? "bg-green-100 text-green-600"
                                : userItem.status === "SUSPENDED"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {userItem.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {userItem.claims || 0}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            {!userItem.verified &&
                              userItem.role === "INSURANCE_COMPANY" && (
                                <button
                                  onClick={() =>
                                    handleApproveCompany(userItem.id)
                                  }
                                  className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                                >
                                  Approve
                                </button>
                              )}
                            <button
                              onClick={() => handleSuspendUser(userItem.id)}
                              className={`px-2 py-1 text-xs rounded ${userItem.status === "ACTIVE" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
                            >
                              {userItem.status === "ACTIVE"
                                ? "Suspend"
                                : "Activate"}
                            </button>
                            <button
                              onClick={() => setSelectedUser(userItem)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Claims Audit Tab */}
          {activeTab === "claims" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Insurance Co
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {claim.id}
                      </td>
                      <td className="px-4 py-3 text-sm">{claim.userName}</td>
                      <td className="px-4 py-3 text-sm">{claim.type}</td>
                      <td className="px-4 py-3 text-sm">${claim.amount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {claim.insuranceCompany || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {claim.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Company Approvals Tab */}
          {activeTab === "companies" && (
            <div className="space-y-4">
              {allUsers
                .filter((u) => u.role === "INSURANCE_COMPANY")
                .map((company) => (
                  <div key={company.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {company.companyName}
                        </h3>
                        <p className="text-sm text-gray-600">{company.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Registered: {company.registeredDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${company.verified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {company.verified ? "✓ Approved" : "⏳ Pending"}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                          Claims: {company.claims || 0}
                        </p>
                      </div>
                    </div>
                    {!company.verified && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleApproveCompany(company.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                          Approve Company
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Support Management Tab */}
          {activeTab === "tickets" && (
            <div>
              <div className="flex space-x-2 mb-4 border-b">
                <button
                  onClick={() => setTicketFilter("open")}
                  className={`px-4 py-2 text-sm ${ticketFilter === "open" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500"}`}
                >
                  Open ({stats.openTickets})
                </button>
                <button
                  onClick={() => setTicketFilter("in-progress")}
                  className={`px-4 py-2 text-sm ${ticketFilter === "in-progress" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500"}`}
                >
                  In Progress ({stats.inProgressTickets})
                </button>
                <button
                  onClick={() => setTicketFilter("resolved")}
                  className={`px-4 py-2 text-sm ${ticketFilter === "resolved" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
                >
                  Resolved ({stats.resolvedTickets})
                </button>
              </div>

              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{ticket.subject}</h4>
                        <p className="text-sm text-gray-500">
                          From: {ticket.userName} • {ticket.date}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getTicketStatusColor(ticket.status)}`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{ticket.message}</p>

                    {selectedTicket === ticket.id ? (
                      <div className="mt-3">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your response..."
                          className="w-full p-2 border rounded mb-2"
                          rows="2"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleReplyToTicket(ticket.id, "resolve")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() =>
                              handleReplyToTicket(ticket.id, "in-progress")
                            }
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() =>
                              handleReplyToTicket(ticket.id, "reject")
                            }
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setSelectedTicket(null)}
                            className="px-3 py-1 bg-gray-300 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTicket(ticket.id)}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Reply & Manage
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Registered:</strong> {selectedUser.registeredDate}
              </p>
              <p>
                <strong>Last Active:</strong>{" "}
                {selectedUser.lastActive || "Never"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
