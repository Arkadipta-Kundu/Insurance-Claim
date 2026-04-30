// frontend/src/pages/BiometricVerification.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BiometricVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({
    addressProof: null,
    idProof: null,
    nomineeName: "",
    nomineeRelation: "",
    nomineeEmail: "",
    nomineePhone: "",
    pathologyReport: null,
    doctorPrescription: null,
    userEnrolled: false,
    userEnrolledTemplate: null,
    userVerified: false,
    userMatchScore: null,
    nomineeEnrolled: false,
    nomineeEnrolledTemplate: null,
    nomineeVerified: false,
    nomineeMatchScore: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState("");
  const [scanPhase, setScanPhase] = useState("");

  const generateFingerprintTemplate = (personName, personEmail, salt = "") => {
    const baseString = `${personName}|${personEmail}|${salt}|${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < baseString.length; i++) {
      const char = baseString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const templateId = Math.abs(hash).toString(16);

    const minutiaePoints = Array.from({ length: 35 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      angle: Math.random() * 360,
      type: Math.random() > 0.7 ? "bifurcation" : "ridge_ending",
    }));

    return {
      templateId,
      minutiaePoints,
      quality: Math.floor(Math.random() * 30) + 70,
      capturedAt: new Date().toISOString(),
    };
  };

  const matchFingerprints = (enrolledTemplate, verificationTemplate) => {
    if (!enrolledTemplate || !verificationTemplate) return 0;

    const enrolledPoints = enrolledTemplate.minutiaePoints || [];
    const verifyPoints = verificationTemplate.minutiaePoints || [];

    if (enrolledPoints.length === 0 || verifyPoints.length === 0) return 0;

    let matches = 0;
    for (const ep of enrolledPoints) {
      for (const vp of verifyPoints) {
        const distance = Math.sqrt(
          Math.pow(ep.x - vp.x, 2) + Math.pow(ep.y - vp.y, 2),
        );
        if (distance < 8 && Math.abs(ep.angle - vp.angle) < 20) {
          matches++;
          break;
        }
      }
    }

    const similarityScore =
      (matches / Math.max(enrolledPoints.length, verifyPoints.length)) * 100;
    return Math.min(99, Math.max(0, similarityScore));
  };

  const simulateFingerprintScan = (type, personName, personEmail, phase) => {
    setScanning(true);
    setScanType(type);
    setScanPhase(phase);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          if (phase === "enroll") {
            const template = generateFingerprintTemplate(
              personName,
              personEmail,
              "enrollment",
            );

            if (type === "user") {
              setVerificationData((prev) => ({
                ...prev,
                userEnrolled: true,
                userEnrolledTemplate: template,
              }));
              alert(
                `✅ Your fingerprint has been ENROLLED! Quality: ${template.quality}%`,
              );
            } else {
              setVerificationData((prev) => ({
                ...prev,
                nomineeEnrolled: true,
                nomineeEnrolledTemplate: template,
              }));
              alert(
                `✅ ${personName}'s fingerprint has been ENROLLED! Quality: ${template.quality}%`,
              );
            }
          } else {
            const verificationTemplate = generateFingerprintTemplate(
              personName,
              personEmail,
              "verification",
            );
            const enrolledTemplate =
              type === "user"
                ? verificationData.userEnrolledTemplate
                : verificationData.nomineeEnrolledTemplate;

            const matchScore = matchFingerprints(
              enrolledTemplate,
              verificationTemplate,
            );
            const isMatch = matchScore > 65;

            if (type === "user") {
              setVerificationData((prev) => ({
                ...prev,
                userVerified: isMatch,
                userMatchScore: matchScore,
              }));
              if (isMatch) {
                alert(
                  `✅ Fingerprint VERIFIED! Match Score: ${matchScore.toFixed(1)}%`,
                );
              } else {
                alert(
                  `❌ Verification FAILED! Match Score: ${matchScore.toFixed(1)}% (Need >65%)`,
                );
              }
            } else {
              setVerificationData((prev) => ({
                ...prev,
                nomineeVerified: isMatch,
                nomineeMatchScore: matchScore,
              }));
              if (isMatch) {
                alert(
                  `✅ ${personName}'s fingerprint VERIFIED! Match Score: ${matchScore.toFixed(1)}%`,
                );
              } else {
                alert(
                  `❌ ${personName}'s verification FAILED! Match Score: ${matchScore.toFixed(1)}% (Need >65%)`,
                );
              }
            }
          }

          setScanning(false);
          return 0;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleFileUpload = (field, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setVerificationData((prev) => ({
      ...prev,
      [field]: file,
    }));
    setError("");
  };

  const handleBiometricEnroll = (type) => {
    const personName =
      type === "user" ? user?.name : verificationData.nomineeName;
    const personEmail =
      type === "user" ? user?.email : verificationData.nomineeEmail;

    if (type === "nominee" && !verificationData.nomineeName) {
      setError("Please enter nominee details first");
      return;
    }
    simulateFingerprintScan(type, personName, personEmail, "enroll");
  };

  const handleBiometricVerify = (type) => {
    const personName =
      type === "user" ? user?.name : verificationData.nomineeName;
    const personEmail =
      type === "user" ? user?.email : verificationData.nomineeEmail;

    if (type === "user" && !verificationData.userEnrolled) {
      setError("Please enroll your fingerprint first");
      return;
    }
    if (type === "nominee" && !verificationData.nomineeEnrolled) {
      setError("Please enroll nominee fingerprint first");
      return;
    }
    simulateFingerprintScan(type, personName, personEmail, "verify");
  };

  const handleSubmit = async () => {
    if (!verificationData.userEnrolled || !verificationData.nomineeEnrolled) {
      setError("Please enroll both fingerprints");
      return;
    }

    try {
      setLoading(true);
      setIsLoading(true);
      setError("");

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to certificate page on success
      navigate("/certificate", {
        state: {
          nomineeName: verificationData.nomineeName,
          nomineeRelation: verificationData.nomineeRelation,
          userMatchScore: verificationData.userMatchScore,
          nomineeMatchScore: verificationData.nomineeMatchScore,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Generate Insurance Certificate
          </h1>
          <p className="text-blue-100">
            Complete all steps to generate your insurance certificate
          </p>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex-1 text-center">
                <div
                  className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                    step >= num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {num}
                </div>
                <p className="text-xs mt-2 text-gray-600">
                  {num === 1 && "Documents"}
                  {num === 2 && "Nominee"}
                  {num === 3 && "Medical"}
                  {num === 4 && "Biometric"}
                </p>
              </div>
            ))}
          </div>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Scanning Progress Overlay */}
          {scanning && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-700 font-medium">
                  {scanPhase === "enroll" ? "Enrolling" : "Verifying"}{" "}
                  {scanType === "user" ? "your" : "nominee's"} fingerprint...
                </span>
                <span className="text-blue-600">{scanProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Documents */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Step 1: Upload Documents
              </h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address Proof *
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload("addressProof", e.target.files[0])
                    }
                    className="hidden"
                    id="address"
                  />
                  <label htmlFor="address" className="cursor-pointer block">
                    <div className="text-4xl mb-2">🏠</div>
                    <p className="text-gray-600">Click to upload</p>
                  </label>
                </div>
                {verificationData.addressProof && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {verificationData.addressProof.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ID Proof *
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload("idProof", e.target.files[0])
                    }
                    className="hidden"
                    id="idproof"
                  />
                  <label htmlFor="idproof" className="cursor-pointer block">
                    <div className="text-4xl mb-2">🪪</div>
                    <p className="text-gray-600">Click to upload</p>
                  </label>
                </div>
                {verificationData.idProof && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {verificationData.idProof.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={
                  !verificationData.addressProof || !verificationData.idProof
                }
                className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Nominee Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 2: Nominee Details</h2>
              <input
                type="text"
                value={verificationData.nomineeName}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    nomineeName: e.target.value,
                  })
                }
                placeholder="Nominee Full Name *"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={verificationData.nomineeRelation}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    nomineeRelation: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Relation *</option>
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="email"
                value={verificationData.nomineeEmail}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    nomineeEmail: e.target.value,
                  })
                }
                placeholder="Nominee Email (Optional)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                value={verificationData.nomineePhone}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    nomineePhone: e.target.value,
                  })
                }
                placeholder="Nominee Phone (Optional)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={
                    !verificationData.nomineeName ||
                    !verificationData.nomineeRelation
                  }
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Medical Reports */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 3: Medical Reports</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pathology Report *
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload("pathologyReport", e.target.files[0])
                    }
                    className="hidden"
                    id="pathology"
                  />
                  <label htmlFor="pathology" className="cursor-pointer block">
                    <div className="text-4xl mb-2">🔬</div>
                    <p className="text-gray-600">Click to upload</p>
                  </label>
                </div>
                {verificationData.pathologyReport && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {verificationData.pathologyReport.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Doctor's Prescription *
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload("doctorPrescription", e.target.files[0])
                    }
                    className="hidden"
                    id="prescription"
                  />
                  <label
                    htmlFor="prescription"
                    className="cursor-pointer block"
                  >
                    <div className="text-4xl mb-2">👨‍⚕️</div>
                    <p className="text-gray-600">Click to upload</p>
                  </label>
                </div>
                {verificationData.doctorPrescription && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {verificationData.doctorPrescription.name}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={
                    !verificationData.pathologyReport ||
                    !verificationData.doctorPrescription
                  }
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Biometric */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Step 4: Biometric Enrollment
              </h2>

              {/* User Biometric */}
              <div className="border-2 border-purple-200 rounded-xl p-4">
                <h3 className="font-semibold mb-3">
                  Policy Holder: {user?.name}
                </h3>

                {!verificationData.userEnrolled ? (
                  <button
                    onClick={() => handleBiometricEnroll("user")}
                    disabled={isLoading}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    📝 Enroll Fingerprint
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-green-100 rounded-lg text-center">
                      <p className="text-green-700">
                        ✓ Fingerprint Enrolled Successfully
                      </p>
                      {verificationData.userEnrolledTemplate && (
                        <p className="text-sm text-green-600 mt-1">
                          Quality:{" "}
                          {verificationData.userEnrolledTemplate.quality}%
                        </p>
                      )}
                    </div>
                    {!verificationData.userVerified && (
                      <button
                        onClick={() => handleBiometricVerify("user")}
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? "Verifying..." : "🔐 Verify Fingerprint"}
                      </button>
                    )}
                    {verificationData.userVerified && (
                      <div className="p-3 bg-blue-100 rounded-lg text-center">
                        <p className="text-blue-700">
                          ✓ Fingerprint Verified! Match Score:{" "}
                          {verificationData.userMatchScore?.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Nominee Biometric */}
              <div className="border-2 border-pink-200 rounded-xl p-4">
                <h3 className="font-semibold mb-3">
                  Nominee: {verificationData.nomineeName || "Not added"}
                </h3>

                {!verificationData.nomineeEnrolled ? (
                  <button
                    onClick={() => handleBiometricEnroll("nominee")}
                    disabled={!verificationData.nomineeName || isLoading}
                    className="w-full py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50 hover:bg-pink-700 transition-colors"
                  >
                    📝 Enroll Nominee Fingerprint
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-green-100 rounded-lg text-center">
                      <p className="text-green-700">
                        ✓ Nominee Fingerprint Enrolled Successfully
                      </p>
                      {verificationData.nomineeEnrolledTemplate && (
                        <p className="text-sm text-green-600 mt-1">
                          Quality:{" "}
                          {verificationData.nomineeEnrolledTemplate.quality}%
                        </p>
                      )}
                    </div>
                    {!verificationData.nomineeVerified && (
                      <button
                        onClick={() => handleBiometricVerify("nominee")}
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading
                          ? "Verifying..."
                          : "🔐 Verify Nominee Fingerprint"}
                      </button>
                    )}
                    {verificationData.nomineeVerified && (
                      <div className="p-3 bg-blue-100 rounded-lg text-center">
                        <p className="text-blue-700">
                          ✓ Nominee Verified! Match Score:{" "}
                          {verificationData.nomineeMatchScore?.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !verificationData.userEnrolled ||
                    !verificationData.nomineeEnrolled ||
                    !verificationData.userVerified ||
                    !verificationData.nomineeVerified
                  }
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
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
                      Generating Certificate...
                    </span>
                  ) : (
                    "✅ Generate Certificate"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricVerification;
