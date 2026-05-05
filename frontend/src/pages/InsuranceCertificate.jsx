// frontend/src/pages/InsuranceCertificate.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const InsuranceCertificate = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if certificate was passed from biometric verification
    if (location.state?.certificate) {
      setCertificate(location.state.certificate);
      setLoading(false);
      return;
    }

    // Check localStorage for existing certificate
    const savedCert = localStorage.getItem("insuranceCertificate");
    if (savedCert) {
      setCertificate(JSON.parse(savedCert));
      setLoading(false);
    } else {
      // No certificate found, redirect to biometric verification
      setLoading(false);
    }
  }, [location.state]);

  const handleDownload = async () => {
    if (token && certificate?.claimId) {
      try {
        const { blob, filename } = await api.downloadCertificate(
          token,
          certificate.claimId,
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      } catch (error) {
        alert(error.message || "Failed to download certificate PDF");
        return;
      }
    }

    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitClaim = () => {
    navigate("/claims/new", {
      state: { certificateId: certificate.certificateId },
    });
  };

  const handleRegenerate = () => {
    if (
      confirm(
        "Are you sure you want to regenerate your certificate? This will require re-verification.",
      )
    ) {
      localStorage.removeItem("insuranceCertificate");
      localStorage.removeItem("insuranceCertificateId");
      navigate("/biometric-verification");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Insurance Certificate Found
          </h2>
          <p className="text-gray-600 mb-6">
            You need to complete biometric verification to generate your
            insurance certificate.
          </p>
          <button
            onClick={() => navigate("/biometric-verification")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
          >
            Start Biometric Verification →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Certificate Card */}
      <div
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
        id="certificate-print"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Insurance Certificate
              </h1>
              <p className="text-green-100 mt-1">
                Your insurance policy has been generated successfully!
              </p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="p-8">
          {/* Status Badge */}
          <div className="flex justify-end mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {certificate.status} ✓
            </span>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              CERTIFICATE OF INSURANCE
            </h2>
            <p className="text-gray-600">
              This certifies that the following individual is insured under our
              policy
            </p>
          </div>

          {/* Certificate Details */}
          <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Policy Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Certificate ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {certificate.certificateId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {certificate.policyNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Coverage Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      {certificate.coverageAmount}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Validity
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="font-semibold text-gray-900">
                      {certificate.issueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-semibold text-gray-900">
                      {certificate.expiryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-green-600 font-semibold">
                      Active - Ready for Claims
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Holder Details */}
          <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Policy Holder Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold">{certificate.holderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-semibold">{certificate.holderEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-semibold">
                  {certificate.holderPhone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Nominee Details */}
          <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nominee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nominee Name</p>
                <p className="font-semibold">{certificate.nomineeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Relation</p>
                <p className="font-semibold">{certificate.nomineeRelation}</p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Verification Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-xs text-green-700">Address Proof</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-xs text-green-700">ID Proof</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-xs text-green-700">Medical Reports</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-xs text-green-700">Biometric</p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Important:</strong> This certificate is digitally
              signed and valid for insurance claims. To claim insurance, please
              submit this certificate along with biometric verification. Keep
              this certificate safe for future reference.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
        >
          <span>📥</span>
          <span>Download Certificate</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"
        >
          <span>🖨️</span>
          <span>Print Certificate</span>
        </button>

        <button
          onClick={handleSubmitClaim}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <span>📝</span>
          <span>Submit a Claim</span>
        </button>

        <button
          onClick={handleRegenerate}
          className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Regenerate Certificate</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none;
          }
          #certificate-print {
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default InsuranceCertificate;
