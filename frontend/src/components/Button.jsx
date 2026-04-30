import React from "react";

export default function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 disabled:opacity-50"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
