import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {title ? <h2 className="text-xl font-semibold mb-4">{title}</h2> : null}
      {children}
    </div>
  );
}
