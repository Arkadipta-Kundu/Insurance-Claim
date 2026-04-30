// frontend/src/pages/Tickets.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [ticketFilter, setTicketFilter] = useState("open");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Mock data - In real app, fetch from API based on user role
      let mockTickets = [];

      if (user?.role === "ADMIN") {
        // Admin sees all tickets
        mockTickets = [
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
            message:
              'Getting error while uploading PDF files. The error says "File too large" even though it\'s only 5MB.',
            status: "IN_PROGRESS",
            priority: "MEDIUM",
            date: "2024-01-19",
            replies: [
              "We are investigating this issue. Can you try compressing the file?",
            ],
            resolvedDate: null,
          },
          {
            id: "TKT003",
            userId: "4",
            userName: "Mike Johnson",
            userEmail: "mike@example.com",
            subject: "Insurance certificate download",
            message:
              "Unable to download my approved certificate. The download link is not working.",
            status: "OPEN",
            priority: "HIGH",
            date: "2024-01-20",
            replies: [],
            resolvedDate: null,
          },
          {
            id: "TKT004",
            userId: "1",
            userName: "John Doe",
            userEmail: "john@example.com",
            subject: "Biometric verification failed",
            message:
              "The fingerprint scanner is not recognizing my fingerprint.",
            status: "RESOLVED",
            priority: "MEDIUM",
            date: "2024-01-15",
            replies: [
              "Please clean the scanner and try again.",
              "Issue resolved after cleaning",
            ],
            resolvedDate: "2024-01-17",
          },
          {
            id: "TKT005",
            userId: "2",
            userName: "ABC Insurance",
            userEmail: "abc@insurance.com",
            subject: "System access issue",
            message: "Cannot access verification panel, getting 403 error.",
            status: "REJECTED",
            priority: "HIGH",
            date: "2024-01-14",
            replies: ["This was a permission issue that has been fixed."],
            resolvedDate: "2024-01-16",
          },
        ];
      } else {
        // Regular users only see their own tickets
        mockTickets = [
          {
            id: "TKT001",
            userId: user?.id,
            userName: user?.name,
            userEmail: user?.email,
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
            id: "TKT004",
            userId: user?.id,
            userName: user?.name,
            userEmail: user?.email,
            subject: "Biometric verification failed",
            message:
              "The fingerprint scanner is not recognizing my fingerprint.",
            status: "RESOLVED",
            priority: "MEDIUM",
            date: "2024-01-15",
            replies: [
              "Please clean the scanner and try again.",
              "Issue resolved after cleaning",
            ],
            resolvedDate: "2024-01-17",
          },
        ];
      }

      setTickets(mockTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToTicket = (ticketId, action) => {
    if (action === "resolve" && !replyMessage) {
      alert("Please provide a resolution message before resolving the ticket.");
      return;
    }

    const updatedTickets = tickets.map((ticket) => {
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

    setTickets(updatedTickets);
    alert(
      `Ticket ${action === "resolve" ? "resolved" : action === "reject" ? "rejected" : "updated to In Progress"} successfully!`,
    );
    setSelectedTicket(null);
    setReplyMessage("");
  };

  const getStatusColor = (status) => {
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

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    if (filter === "open") return ticket.status === "OPEN";
    if (filter === "in-progress") return ticket.status === "IN_PROGRESS";
    if (filter === "resolved") return ticket.status === "RESOLVED";
    if (filter === "rejected") return ticket.status === "REJECTED";
    return true;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
    rejected: tickets.filter((t) => t.status === "REJECTED").length,
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
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === "ADMIN"
              ? "Manage and resolve user support requests"
              : "View and track your support requests"}
          </p>
        </div>
        {/* Only show "Raise New Ticket" button for regular users, NOT for admin */}
        {user?.role !== "ADMIN" && (
          <Link
            to="/tickets/new"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            + Raise New Ticket
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">🎫</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-gray-600">Total Tickets</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">🔴</div>
          <p className="text-2xl font-bold text-red-600">{stats.open}</p>
          <p className="text-gray-600">Open Tickets</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">🟡</div>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.inProgress}
          </p>
          <p className="text-gray-600">In Progress</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-gray-600">Resolved</p>
        </div>
      </div>

      {/* Filter Tabs - Different for Admin vs User */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {user?.role === "ADMIN" ? (
              // Admin filters
              <>
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    filter === "all"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Tickets ({stats.total})
                </button>
                <button
                  onClick={() => setFilter("open")}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    filter === "open"
                      ? "border-b-2 border-red-500 text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🔴 Open ({stats.open})
                </button>
                <button
                  onClick={() => setFilter("in-progress")}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    filter === "in-progress"
                      ? "border-b-2 border-yellow-500 text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🟡 In Progress ({stats.inProgress})
                </button>
                <button
                  onClick={() => setFilter("resolved")}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    filter === "resolved"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  ✅ Resolved ({stats.resolved})
                </button>
                <button
                  onClick={() => setFilter("rejected")}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    filter === "rejected"
                      ? "border-b-2 border-gray-500 text-gray-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  ⚪ Rejected ({stats.rejected})
                </button>
              </>
            ) : (
              // Regular user filters
              <>
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-3 text-sm font-medium ${
                    filter === "all"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Tickets
                </button>
                <button
                  onClick={() => setFilter("open")}
                  className={`px-6 py-3 text-sm font-medium ${
                    filter === "open"
                      ? "border-b-2 border-red-500 text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilter("in-progress")}
                  className={`px-6 py-3 text-sm font-medium ${
                    filter === "in-progress"
                      ? "border-b-2 border-yellow-500 text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilter("resolved")}
                  className={`px-6 py-3 text-sm font-medium ${
                    filter === "resolved"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Resolved
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Tickets Found
            </h3>
            <p className="text-gray-600">
              {user?.role === "ADMIN"
                ? "No tickets match your filter criteria."
                : "You haven't raised any tickets yet. Need help? Raise a ticket!"}
            </p>
            {user?.role !== "ADMIN" && (
              <Link
                to="/tickets/new"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
              >
                Raise New Ticket →
              </Link>
            )}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Ticket Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl">
                        {getPriorityIcon(ticket.priority)}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}
                      >
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Ticket #{ticket.id} • {ticket.date}
                      {user?.role === "ADMIN" && (
                        <span className="ml-2 text-blue-600">
                          • From: {ticket.userName} ({ticket.userEmail})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Ticket Message */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{ticket.message}</p>
                </div>

                {/* Reply History */}
                {ticket.replies && ticket.replies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Conversation History:
                    </p>
                    <div className="space-y-2">
                      {ticket.replies.map((reply, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{reply}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Actions - Only visible to admins */}
                {user?.role === "ADMIN" &&
                  ticket.status !== "RESOLVED" &&
                  ticket.status !== "REJECTED" &&
                  (selectedTicket === ticket.id ? (
                    <div className="space-y-3 mt-4">
                      <textarea
                        placeholder="Write your response here..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        rows="3"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleReplyToTicket(ticket.id, "resolve")
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          ✓ Resolve Ticket
                        </button>
                        <button
                          onClick={() =>
                            handleReplyToTicket(ticket.id, "in-progress")
                          }
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                        >
                          ⚡ Mark In Progress
                        </button>
                        <button
                          onClick={() =>
                            handleReplyToTicket(ticket.id, "reject")
                          }
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          ✗ Reject Ticket
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicket(null);
                            setReplyMessage("");
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => setSelectedTicket(ticket.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reply & Manage Ticket
                      </button>
                    </div>
                  ))}

                {/* Resolved/Rejected Info */}
                {ticket.status === "RESOLVED" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Resolved on: {ticket.resolvedDate}
                    </p>
                  </div>
                )}

                {ticket.status === "REJECTED" && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800">
                      ⚪ Rejected as invalid/duplicate
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

export default Tickets;
