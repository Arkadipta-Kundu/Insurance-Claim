import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/Card";
import { api } from "../lib/api";

export default function Certificate() {
  const { claimId } = useParams();
  const token = localStorage.getItem("token");
  const [err, setErr] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!token) {
      setErr("Please log in to view your certificate.");
    }
  }, [token]);

  async function handleDownload() {
    try {
      setDownloading(true);
      setErr("");
      const { blob, filename } = await api.downloadCertificate(token, claimId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          🟢 Claim Verification Certificate
        </h1>
        <p className="text-gray-600 mt-2">
          Your insurance claim has been successfully verified and approved
        </p>
      </div>

      {err ? (
        <Card title="Error">
          <p className="text-red-600">{err}</p>
          <Link
            to="/dashboard"
            className="text-blue-600 underline mt-4 inline-block"
          >
            Return to Dashboard
          </Link>
        </Card>
      ) : (
        <>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl shadow-lg p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl">✅</div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Verification Successful
                </h2>
                <p className="text-gray-600">Your claim has been approved</p>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4 text-left">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600 font-semibold">Claim ID:</span>
                  <span className="font-mono text-lg text-gray-900">
                    {claimId}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600 font-semibold">Status:</span>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    APPROVED
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600 font-semibold">
                    Certificate:
                  </span>
                  <span className="text-green-600 font-semibold">
                    ✓ Generated
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Card title="📋 Claim Processing Summary">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Documents Uploaded
                  </p>
                  <p className="text-sm text-gray-600">
                    Pathology Report, Prescription, Cover Image, Secret Image
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Biometric Verification
                  </p>
                  <p className="text-sm text-gray-600">
                    User & Nominee successfully verified
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Image Security Processing
                  </p>
                  <p className="text-sm text-gray-600">
                    🔀 Fragmentation | 🖼️ Steganography | 🔗 Merge
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Claim Approved</p>
                  <p className="text-sm text-gray-600">
                    Your claim has been processed and approved
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="🔐 Security Protocols Applied">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">
                  Dual Biometric Verification
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Both user and nominee underwent fingerprint verification to
                  prevent fraud
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-gray-900">
                  Image Steganography
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Secret image securely hidden within cover image for data
                  protection
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold text-gray-900">
                  Image Fragmentation
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Pathology report split into 4 fragments for enhanced security
                </p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <p className="font-semibold text-gray-900">
                  Token Authentication
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  All access controlled through secure token-based
                  authentication
                </p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all disabled:opacity-60"
            >
              {downloading ? "Preparing PDF..." : "Download PDF Certificate"}
            </button>
            <Link
              to="/dashboard"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all"
            >
              Return to Dashboard
            </Link>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
              className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl text-center hover:bg-blue-50 transition-all"
            >
              Print Certificate
            </a>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 text-sm">
              <b>✅ Success!</b> Your insurance claim verification is complete.
              Keep this certificate for your records.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
