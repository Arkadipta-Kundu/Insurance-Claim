import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { api } from "../lib/api";

export default function UploadDocuments() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const [claimId, setClaimId] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);

  const [pathologyUploaded, setPathologyUploaded] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [coverImageUploaded, setCoverImageUploaded] = useState(false);
  const [secretImageUploaded, setSecretImageUploaded] = useState(false);

  // File type validation function
  const isValidImageFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExt = "." + file.name.split(".").pop().toLowerCase();
    return validTypes.includes(file.type) || validExtensions.includes(fileExt);
  };

  // File size validation (max 10MB)
  const isValidFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  };

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }

    (async () => {
      try {
        const data = await api.createClaim(token);
        setClaimId(data.claimId);
      } catch (ex) {
        setErr(ex.message);
      }
    })();
  }, [token, nav]);

  async function handleUpload(docType, file) {
    if (!file) return;

    // Validate file type
    if (docType === "cover" || docType === "secret") {
      if (!isValidImageFile(file)) {
        setErr(
          `Please select a valid image file (JPEG, PNG, or GIF) for ${docType}`,
        );
        return;
      }
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      setErr(`File size must be less than 10MB for ${docType}`);
      return;
    }

    setErr("");
    setMsg("");
    setUploading(true);

    try {
      await api.uploadDoc(token, claimId, docType, file);
      setMsg(
        `${docType.charAt(0).toUpperCase() + docType.slice(1)} uploaded successfully ✅`,
      );

      // Mark as uploaded
      if (docType === "pathology") setPathologyUploaded(true);
      if (docType === "prescription") setPrescriptionUploaded(true);
      if (docType === "cover") setCoverImageUploaded(true);
      if (docType === "secret") setSecretImageUploaded(true);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
    }
  }

  function allDocumentsUploaded() {
    return (
      pathologyUploaded &&
      prescriptionUploaded &&
      coverImageUploaded &&
      secretImageUploaded
    );
  }

  function handleProceed() {
    if (allDocumentsUploaded()) {
      nav(`/biometric-verification/${claimId}`);
    }
  }

  if (!token) return <div className="p-6">Redirecting to login...</div>;
  if (!claimId) return <div className="p-6 text-center">Creating claim...</div>;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🔵 Upload Documents</h1>
        <p className="text-gray-600 mt-2">
          Claim ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {claimId}
          </span>
        </p>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {err}
        </div>
      )}

      <Card title="📋 Required Documents">
        <p className="text-gray-600 mb-6">
          Please upload all four required documents. You must upload them all
          before proceeding to biometric verification.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pathology Report */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <span className="text-3xl">📄</span>
              <h3 className="font-semibold">Pathology Report</h3>
              <p className="text-xs text-gray-500">(PDF or Image)</p>
            </div>
            <input
              type="file"
              id="pathology"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={(e) =>
                e.target.files && handleUpload("pathology", e.target.files[0])
              }
              disabled={uploading}
            />
            <label htmlFor="pathology" className="block">
              <Button
                type="button"
                onClick={() => document.getElementById("pathology").click()}
                disabled={uploading}
              >
                {pathologyUploaded ? "✅ Uploaded" : "Choose File"}
              </Button>
            </label>
            {pathologyUploaded && (
              <p className="text-green-600 text-sm mt-2">Status: Uploaded</p>
            )}
          </div>

          {/* Prescription */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <span className="text-3xl">💊</span>
              <h3 className="font-semibold">Prescription</h3>
              <p className="text-xs text-gray-500">(PDF or Image)</p>
            </div>
            <input
              type="file"
              id="prescription"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={(e) =>
                e.target.files &&
                handleUpload("prescription", e.target.files[0])
              }
              disabled={uploading}
            />
            <label htmlFor="prescription" className="block">
              <Button
                type="button"
                onClick={() => document.getElementById("prescription").click()}
                disabled={uploading}
              >
                {prescriptionUploaded ? "✅ Uploaded" : "Choose File"}
              </Button>
            </label>
            {prescriptionUploaded && (
              <p className="text-green-600 text-sm mt-2">Status: Uploaded</p>
            )}
          </div>

          {/* Cover Image */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🖼️</span>
              <h3 className="font-semibold">Cover Image</h3>
              <p className="text-xs text-gray-500">
                (For steganography - JPEG, PNG, GIF only)
              </p>
            </div>
            <input
              type="file"
              id="cover"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleUpload("cover", e.target.files[0])
              }
              disabled={uploading}
              accept="image/jpeg,image/jpg,image/png,image/gif"
            />
            <label htmlFor="cover" className="block">
              <Button
                type="button"
                onClick={() => document.getElementById("cover").click()}
                disabled={uploading}
              >
                {coverImageUploaded ? "✅ Uploaded" : "Choose Image"}
              </Button>
            </label>
            {coverImageUploaded && (
              <p className="text-green-600 text-sm mt-2">Status: Uploaded</p>
            )}
            {!coverImageUploaded && (
              <p className="text-gray-400 text-xs mt-2">
                Accepted: JPG, PNG, GIF (Max 10MB)
              </p>
            )}
          </div>

          {/* Secret Image */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🔐</span>
              <h3 className="font-semibold">Secret Image</h3>
              <p className="text-xs text-gray-500">
                (To be hidden - JPEG, PNG, GIF only)
              </p>
            </div>
            <input
              type="file"
              id="secret"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleUpload("secret", e.target.files[0])
              }
              disabled={uploading}
              accept="image/jpeg,image/jpg,image/png,image/gif"
            />
            <label htmlFor="secret" className="block">
              <Button
                type="button"
                onClick={() => document.getElementById("secret").click()}
                disabled={uploading}
              >
                {secretImageUploaded ? "✅ Uploaded" : "Choose Image"}
              </Button>
            </label>
            {secretImageUploaded && (
              <p className="text-green-600 text-sm mt-2">Status: Uploaded</p>
            )}
            {!secretImageUploaded && (
              <p className="text-gray-400 text-xs mt-2">
                Accepted: JPG, PNG, GIF (Max 10MB)
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card title="📊 Upload Progress">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${pathologyUploaded ? "bg-green-500" : "bg-gray-300"}`}
            >
              {pathologyUploaded ? "✓" : "1"}
            </span>
            <span
              className={pathologyUploaded ? "text-green-600" : "text-gray-600"}
            >
              Pathology Report
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${prescriptionUploaded ? "bg-green-500" : "bg-gray-300"}`}
            >
              {prescriptionUploaded ? "✓" : "2"}
            </span>
            <span
              className={
                prescriptionUploaded ? "text-green-600" : "text-gray-600"
              }
            >
              Prescription
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${coverImageUploaded ? "bg-green-500" : "bg-gray-300"}`}
            >
              {coverImageUploaded ? "✓" : "3"}
            </span>
            <span
              className={
                coverImageUploaded ? "text-green-600" : "text-gray-600"
              }
            >
              Cover Image
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${secretImageUploaded ? "bg-green-500" : "bg-gray-300"}`}
            >
              {secretImageUploaded ? "✓" : "4"}
            </span>
            <span
              className={
                secretImageUploaded ? "text-green-600" : "text-gray-600"
              }
            >
              Secret Image
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>
              {Math.floor(
                ([
                  pathologyUploaded,
                  prescriptionUploaded,
                  coverImageUploaded,
                  secretImageUploaded,
                ].filter(Boolean).length /
                  4) *
                  100,
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${([pathologyUploaded, prescriptionUploaded, coverImageUploaded, secretImageUploaded].filter(Boolean).length / 4) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={() => nav("/dashboard")}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleProceed}
          disabled={!allDocumentsUploaded() || uploading}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            allDocumentsUploaded() && !uploading
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg transform hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed to Biometric Verification →
        </button>
      </div>
    </div>
  );
}
