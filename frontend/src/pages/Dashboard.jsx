// frontend/src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import UserDashboard from "../components/UserDashboard";
import InsuranceCompanyDashboard from "../components/InsuranceCompanyDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render different dashboard based on user role
  switch (user?.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "INSURANCE_COMPANY":
      return <InsuranceCompanyDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;
