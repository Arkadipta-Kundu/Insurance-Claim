import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-3xl font-bold">Secure Claim Verification</h1>
        <p className="text-slate-600">
          Email OTP → Account → Upload Documents → Biometric verify →
          Certificate.
        </p>

        <Card title="Get Started">
          <div className="flex gap-3">
            <Link className="rounded-xl border px-4 py-2" to="/register">
              Register
            </Link>
            <Link
              className="rounded-xl bg-slate-900 text-white px-4 py-2"
              to="/login"
            >
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
