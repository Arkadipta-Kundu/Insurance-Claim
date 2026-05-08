// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import ClaimForm from "./pages/ClaimForm";
import Profile from "./pages/Profile";
import VerifyOTP from "./pages/VerifyOTP";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import InsuranceCompanyDashboard from "./components/InsuranceCompanyDashboard";
import UserDashboard from "./components/UserDashboard";
import Tickets from "./pages/Tickets";
import TicketForm from "./pages/TicketForm";
import Documents from "./pages/Documents";
import DocumentUpload from "./pages/DocumentUpload";
import VerifyClaims from "./pages/VerifyClaims";
import BiometricVerification from "./pages/BiometricVerification";
import InsuranceCertificate from "./pages/InsuranceCertificate";
import UploadDocuments from "./pages/UploadDocuments";
import SubmitClaim from "./pages/SubmitClaim";
import Certificate from "./pages/Certificate";
import InsurancePurchase from "./pages/InsurancePurchase";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/claims"
              element={
                <PrivateRoute>
                  <Claims />
                </PrivateRoute>
              }
            />
            <Route
              path="/claims/new"
              element={
                <PrivateRoute>
                  <ClaimForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <PrivateRoute>
                  <Tickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets/new"
              element={
                <PrivateRoute>
                  <TicketForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <PrivateRoute>
                  <Documents />
                </PrivateRoute>
              }
            />
            <Route
              path="/documents/upload"
              element={
                <PrivateRoute>
                  <DocumentUpload />
                </PrivateRoute>
              }
            />
            <Route
              path="/verify-claims"
              element={
                <PrivateRoute>
                  <VerifyClaims />
                </PrivateRoute>
              }
            />
            <Route
              path="/biometric-verification"
              element={
                <PrivateRoute>
                  <BiometricVerification />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance-certificate"
              element={
                <PrivateRoute>
                  <InsuranceCertificate />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance/purchase"
              element={
                <PrivateRoute>
                  <InsurancePurchase />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
