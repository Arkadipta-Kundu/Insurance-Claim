import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { api } from "../lib/api";

export default function SubmitClaim() {
  const nav = useNavigate();
  const { claimId } = useParams();
  const token = localStorage.getItem("token");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);

  useEffect(() => {
    if (!token) {
      nav("/login");
    }
  }, [token, nav]);

  async function handleSubmit() {
    setErr("");
    setMsg("");
    setSubmitting(true);

    try {
      // Process images first (optional but recommended)
      try {
        console.log("Processing images...");
        await api.processImages(token, claimId);
        console.log("Images processed successfully");
        setMsg("✅ Images processed successfully!");
      } catch (err) {
        console.warn("Image processing warning:", err);
        setMsg(
          "⚠️ Image processing skipped (optional), continuing with submission...",
        );
        // Continue anyway - not critical
      }

      // Submit the claim
      const submitResponse = await api.submitClaim(token, claimId);
      setMsg("✅ Claim submitted successfully!");

      // Wait a moment and then redirect to certificate
      setTimeout(() => {
        nav(`/certificate/${claimId}`);
      }, 1500);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProcessImages() {
    setErr("");
    setMsg("");
    setProcessingImages(true);

    try {
      const response = await api.processImages(token, claimId);
      setMsg(
        `✅ Image processing completed: Fragmented ✓ | Steganographed ✓ | Merged ✓`,
      );
    } catch (ex) {
      // Images are optional, so continue
      setMsg("⚠️ Image processing skipped (optional)");
    } finally {
      setProcessingImages(false);
    }
  }

  if (!token) return <div className="p-6">Redirecting to login...</div>;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🟡 Submit Claim</h1>
        <p className="text-gray-600 mt-2">
          Claim ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {claimId}
          </span>
        </p>
      </div>

      {msg && (
        <div
          className={`${msg.includes("✅") ? "bg-green-50 border-green-200 text-green-800" : "bg-yellow-50 border-yellow-200 text-yellow-800"} border rounded-lg p-4`}
        >
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {err}
        </div>
      )}

      <Card title="📋 Process Summary">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              ✓
            </span>
            <span className="text-gray-800">
              Documents uploaded successfully
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              ✓
            </span>
            <span className="text-gray-800">User biometric verified</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              ✓
            </span>
            <span className="text-gray-800">Nominee biometric verified</span>
          </div>
        </div>
      </Card>

      <Card title="🟢 Image Security Processing">
        <div className="space-y-4">
          <p className="text-gray-600">
            Your documents will be secured using advanced image processing
            techniques:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-lg">🔀</span>
              <span>
                <b>Step 1 - Fragmentation:</b> Pathology report split into 4
                secure fragments
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">🖼️</span>
              <span>
                <b>Step 2 - Steganography:</b> Secret image hidden inside cover
                image
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">🔗</span>
              <span>
                <b>Step 3 - Merge:</b> Fragments reconstructed into final secure
                image
              </span>
            </div>
          </div>

          <Button
            onClick={handleProcessImages}
            disabled={processingImages || submitting}
            loading={processingImages}
          >
            Process Images Now
          </Button>
        </div>
      </Card>

      <Card title="🔐 Final Submission">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <b>Ready to submit?</b> All verifications are complete. Once
            submitted, your claim will be:
          </p>
          <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc space-y-1">
            <li>Marked as Approved</li>
            <li>Processed with image security techniques</li>
            <li>Issued a verification certificate</li>
          </ul>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          loading={submitting}
        >
          Submit Claim & Generate Certificate
        </Button>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={() => nav("/dashboard")}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
