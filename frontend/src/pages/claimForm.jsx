// frontend/src/pages/ClaimForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ClaimForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    date: "",
    incidentLocation: "",
    witnessName: "",
    witnessContact: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCertificate, setHasCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [checkingCertificate, setCheckingCertificate] = useState(true);

  useEffect(() => {
    checkCertificate();
  }, []);

  const checkCertificate = () => {
    const savedCertificate = localStorage.getItem("insuranceCertificate");
    if (savedCertificate) {
      try {
        const cert = JSON.parse(savedCertificate);
        // Check if certificate has valid biometric data
        const hasValidBiometric =
          cert.biometricData?.user?.enrolled &&
          cert.biometricData?.nominee?.enrolled;

        if (hasValidBiometric) {
          setHasCertificate(true);
          setCertificateData(cert);
        } else {
          setHasCertificate(false);
        }
      } catch (error) {
        setHasCertificate(false);
      }
    } else {
      setHasCertificate(false);
    }
    setCheckingCertificate(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasCertificate) {
      setError("Please generate an insurance certificate first");
      return;
    }

    if (
      !formData.type ||
      !formData.amount ||
      !formData.description ||
      !formData.date
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const newClaim = {
        id: `CLM${Date.now()}`,
        type: formData.type,
        amount: formData.amount,
        description: formData.description,
        incidentDate: formData.date,
        incidentLocation: formData.incidentLocation,
        witnessName: formData.witnessName,
        witnessContact: formData.witnessContact,
        certificateId: certificateData.certificateId,
        submissionDate: new Date().toISOString(),
        status: "PENDING",
        documents: files.map((f) => f.name),
        nomineeName: certificateData.nomineeName,
        nomineeRelation: certificateData.nomineeRelation,
      };

      const existingClaims = JSON.parse(
        localStorage.getItem("userClaims") || "[]",
      );
      existingClaims.push(newClaim);
      localStorage.setItem("userClaims", JSON.stringify(existingClaims));

      alert("✅ Claim submitted successfully!");
      navigate("/claims");
    } catch (err) {
      setError("Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  if (checkingCertificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasCertificate) {
    return (
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Insurance Certificate Found
          </h2>
          <p className="text-gray-600 mb-6">
            You need to generate an insurance certificate before submitting a
            claim. This requires biometric verification for you and your
            nominee.
          </p>
          <button
            onClick={() => navigate("/biometric-verification")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
          >
            Generate Insurance Certificate →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Submit Insurance Claim
          </h1>
          <p className="text-blue-100">
            Certificate: {certificateData.certificateId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Certificate Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-semibold">
              Active Insurance Certificate
            </p>
            <p className="text-xs text-green-600">
              Holder: {certificateData.holderName} | Nominee:{" "}
              {certificateData.nomineeName} ({certificateData.nomineeRelation})
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Claim Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select claim type</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Vehicle Insurance">Vehicle Insurance</option>
              <option value="Home Insurance">Home Insurance</option>
              <option value="Life Insurance">Life Insurance</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Amount ($) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount in USD"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Incident Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Incident Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Location *
            </label>
            <input
              type="text"
              name="incidentLocation"
              value={formData.incidentLocation}
              onChange={handleChange}
              required
              placeholder="Where did the incident occur?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Witness Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Witness Name (Optional)
              </label>
              <input
                type="text"
                name="witnessName"
                value={formData.witnessName}
                onChange={handleChange}
                placeholder="Name of witness"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Witness Contact (Optional)
              </label>
              <input
                type="text"
                name="witnessContact"
                value={formData.witnessContact}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe what happened in detail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Supporting Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-gray-600">
                  Click to upload supporting documents
                </p>
                <p className="text-xs text-gray-500">
                  Medical reports, police reports, photos, etc. (Max 10MB each)
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded Files:
                </p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📄</span>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/claims")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
