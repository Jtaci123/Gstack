"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Brand } from "@/types";

interface Props {
  brand: Brand;
  onRefresh: () => void;
}

export default function BrandCard({ brand, onRefresh }: Props) {
  const router = useRouter();
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    try {
      await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: brand.id, sendEmail: false }),
      });
      router.push(`/brand/${brand.id}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all hover:border-violet-700"
      style={{ background: "#111118", border: "1px solid #1f2937" }}
      onClick={() => router.push(`/brand/${brand.id}`)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-base" style={{ color: "#f9fafb" }}>{brand.name}</div>
          {brand.audience && (
            <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{brand.audience}</div>
          )}
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={brand.active ? { background: "#052e16", color: "#4ade80" } : { background: "#1f2937", color: "#6b7280" }}
        >
          {brand.active ? "Active" : "Paused"}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs" style={{ color: "#4b5563" }}>
        <span>📬 {brand.email}</span>
        <span>💡 {brand._count?.ideas ?? 0} ideas generated</span>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); handleRun(); }}
        disabled={running}
        className="mt-1 w-full py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ background: "#2e1065", color: "#c4b5fd", border: "1px solid #4c1d95" }}
      >
        {running ? "Running Scout..." : "▶ Run Scout Now"}
      </button>
    </div>
  );
}
