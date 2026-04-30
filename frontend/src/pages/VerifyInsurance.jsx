// src/pages/VerifyInsurance.jsx
import { useState } from "react";

const VerifyInsurance = () => {
  const [formData, setFormData] = useState({
    policyNumber: "",
    provider: "",
    claimAmount: "",
    document: null,
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const providers = [
    "Select Provider",
    "Blue Cross Blue Shield",
    "UnitedHealthcare",
    "Aetna",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      alert("Verification completed successfully!");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">
            Verify Insurance Claim
          </h1>
          <p className="text-blue-100 mt-1">
            Enter the details below to verify your insurance claim
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Policy Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Policy Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.policyNumber}
                onChange={(e) =>
                  setFormData({ ...formData, policyNumber: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter policy number"
              />
            </div>

            {/* Insurance Provider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Insurance Provider <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.provider}
                onChange={(e) =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {providers.map((provider, index) => (
                  <option
                    key={index}
                    value={provider === "Select Provider" ? "" : provider}
                  >
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            {/* Claim Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Claim Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.claimAmount}
                onChange={(e) =>
                  setFormData({ ...formData, claimAmount: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Supporting Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFormData({ ...formData, document: e.target.files[0] })
                  }
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-3xl mb-2 block">📎</span>
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    PDF, JPG, PNG (max. 10MB)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Any additional information about the claim..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                isVerifying ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Claim"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
            ✓
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Quick Processing</h4>
            <p className="text-sm text-gray-600">
              Average verification time: 2 minutes
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
            🔒
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Secure & Private</h4>
            <p className="text-sm text-gray-600">
              Your data is encrypted and protected
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
            📊
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Detailed Report</h4>
            <p className="text-sm text-gray-600">
              Get comprehensive verification results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyInsurance;
