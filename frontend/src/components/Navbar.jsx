// frontend/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    const links = [{ path: "/", label: "Home", icon: "🏠", showAlways: true }];

    if (isAuthenticated && user) {
      // Dashboard is common for all authenticated users
      links.push({
        path: "/dashboard",
        label: "Dashboard",
        icon: "📊",
        showAlways: true,
      });
      links.push({
        path: "/documents",
        label: "Documents",
        icon: "📄",
        showAlways: true,
      });
      links.push({
        path: "/tickets",
        label: "Support",
        icon: "🎫",
        showAlways: true,
      });

      // Role-specific links
      switch (user.role) {
        case "ADMIN":
          // Admin sees the same dashboard (which shows AdminDashboard)
          // No additional links needed
          break;
        case "INSURANCE_COMPANY":
          links.push({
            path: "/verify-claims",
            label: "Verify Claims",
            icon: "✅",
            showAlways: true,
          });
          break;
        case "USER":
          links.push({
            path: "/insurance/purchase",
            label: "Buy Insurance",
            icon: "🛡️",
            showAlways: true,
          });
          links.push({
            path: "/claims",
            label: "My Claims",
            icon: "📋",
            showAlways: true,
          });
          links.push({
            path: "/claims/new",
            label: "New Claim",
            icon: "➕",
            showAlways: true,
          });
          break;
        default:
          break;
      }
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InsuranceClaim
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      user?.role === "ADMIN"
                        ? "bg-red-500"
                        : user?.role === "INSURANCE_COMPANY"
                          ? "bg-purple-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-gray-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span
                    className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              user?.role === "ADMIN"
                                ? "bg-red-100 text-red-600"
                                : user?.role === "INSURANCE_COMPANY"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {user?.role === "ADMIN"
                              ? "👑 Administrator"
                              : user?.role === "INSURANCE_COMPANY"
                                ? "🏢 Insurance Company"
                                : "👤 User"}
                          </span>
                        </div>
                        {user?.companyName && (
                          <p className="text-xs text-gray-500 mt-1">
                            {user.companyName}
                          </p>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span>👤</span>
                        <span className="text-sm text-gray-700">
                          Profile Settings
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <span>🚪</span>
                        <span className="text-sm text-red-600">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <span>👤</span>
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
