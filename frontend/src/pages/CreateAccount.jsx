import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { api } from "../lib/api";

export default function CreateAccount() {
  const nav = useNavigate();
  const email = sessionStorage.getItem("pendingEmail") || "";
  const verified = sessionStorage.getItem("emailVerified") === "true";

  const [form, setForm] = useState({
    name: "",
    address: "",
    mobile: "",
    validIdProofNo: "",
    nomineeName: "",
    nomineeMobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card title="Not Verified">
          <p>Please verify email first.</p>
        </Card>
      </div>
    );
  }

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.register({ email, ...form });
      sessionStorage.removeItem("emailVerified");
      nav("/login");
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card title="Create Account">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={onCreate}
          >
            <Input label="Email" value={email} disabled />
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
            <Input
              label="Mobile"
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              required
            />
            <Input
              label="Valid ID Proof No."
              value={form.validIdProofNo}
              onChange={(e) => set("validIdProofNo", e.target.value)}
              required
            />
            <Input
              label="Nominee Name"
              value={form.nomineeName}
              onChange={(e) => set("nomineeName", e.target.value)}
              required
            />
            <Input
              label="Nominee Mobile"
              value={form.nomineeMobile}
              onChange={(e) => set("nomineeMobile", e.target.value)}
              required
            />

            <div className="md:col-span-2">
              {err ? <p className="text-red-600 text-sm mb-2">{err}</p> : null}
              <Button loading={loading} type="submit">
                Create Account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
