// frontend/src/pages/Documents.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Simulating API data
      const mockDocuments = [
        {
          id: "DOC001",
          name: "Medical Report.pdf",
          type: "Medical",
          size: "2.5 MB",
          status: "VERIFIED",
          uploadDate: "2024-01-15",
        },
        {
          id: "DOC002",
          name: "Police Report.pdf",
          type: "Incident",
          size: "1.2 MB",
          status: "PENDING",
          uploadDate: "2024-01-20",
        },
        {
          id: "DOC003",
          name: "Insurance Certificate.pdf",
          type: "Certificate",
          size: "0.8 MB",
          status: "APPROVED",
          uploadDate: "2024-01-22",
        },
        {
          id: "DOC004",
          name: "Hospital Bill.pdf",
          type: "Medical",
          size: "3.1 MB",
          status: "VERIFIED",
          uploadDate: "2024-01-18",
        },
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "VERIFIED":
      case "APPROVED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.name}`);
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
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage your insurance documents
          </p>
        </div>
        <Link
          to="/documents/upload"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          + Upload Document
        </Link>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">
                  {doc.type === "Medical"
                    ? "🏥"
                    : doc.type === "Incident"
                      ? "🚔"
                      : "📄"}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}
                >
                  {doc.status}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {doc.type} • {doc.size}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Uploaded: {doc.uploadDate}
              </p>

              <button
                onClick={() => handleDownload(doc)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download{" "}
                {doc.status === "APPROVED" ? "Certificate" : "Document"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
