import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../lib/api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const email = sessionStorage.getItem("pendingEmail") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  async function onVerify(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.verifyOtp(email, otp);
      sessionStorage.setItem("emailVerified", "true");
      nav("/create-account");
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  async function onResendOtp() {
    setErr("");
    setResendMsg("");
    setResendLoading(true);
    try {
      await api.sendOtp(email);
      setResendMsg("✅ New OTP sent successfully! Please check your email.");
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setResendLoading(false);
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card title="No Email Found">
          <p>Please start registration again.</p>
          <button
            onClick={() => nav("/register")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Registration
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <Card title="Verify Email">
          <p className="text-sm text-slate-600 mb-4">
            OTP sent to: <b>{email}</b>
          </p>
          <form className="space-y-4" onSubmit={onVerify}>
            <Input
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter 6-digit OTP"
            />
            {err ? <p className="text-red-600 text-sm">{err}</p> : null}
            {resendMsg && <p className="text-green-600 text-sm">{resendMsg}</p>}
            <Button loading={loading} type="submit">
              Verify
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={onResendOtp}
              disabled={resendLoading}
              className="text-blue-600 text-sm hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            <p>
              ⚠️ Note: Check your spam folder if you don't see the email in your
              inbox.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
