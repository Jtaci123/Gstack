"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Idea } from "@/types";

export default function BrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadBrand() {
    const res = await fetch(`/api/brands/${id}`);
    if (!res.ok) { router.push("/"); return; }
    setBrand(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadBrand(); }, [id]);

  async function handleRun() {
    setRunning(true);
    try {
      await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: id, sendEmail: false }),
      });
      await loadBrand();
    } finally {
      setRunning(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f", color: "#4b5563" }}>
      Loading...
    </div>
  );

  if (!brand) return null;

  return (
    <main className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-sm transition-opacity hover:opacity-80" style={{ color: "#6b7280" }}>
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#f9fafb" }}>{brand.name}</h1>
            {brand.audience && <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{brand.audience}</p>}
          </div>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "#7c3aed", color: "#fff" }}
        >
          {running ? "Running Scout..." : "▶ Run Scout Now"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {running && (
          <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: "#0d0d14", border: "1px solid #2e1065", color: "#c4b5fd" }}>
            🔭 Scout is scanning signals and generating ideas... this takes ~15 seconds
          </div>
        )}

        {(!brand.ideas || brand.ideas.length === 0) ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">💡</div>
            <div className="font-semibold mb-2" style={{ color: "#f9fafb" }}>No ideas yet</div>
            <p style={{ color: "#6b7280" }}>Run Scout to generate your first batch of ideas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-sm mb-2" style={{ color: "#4b5563" }}>
              {brand.ideas.length} ideas generated
            </div>
            {brand.ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function IdeaCard({ idea }: { idea: Idea }) {
  const scoreColor = idea.score >= 8 ? "#4ade80" : idea.score >= 6 ? "#fbbf24" : "#f87171";
  const scoreBg = idea.score >= 8 ? "#052e16" : idea.score >= 6 ? "#1c1917" : "#450a0a";

  return (
    <div className="rounded-2xl p-5" style={{ background: "#111118", border: "1px solid #1f2937" }}>
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: scoreBg, color: scoreColor }}
        >
          {idea.score}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-1.5" style={{ color: "#f9fafb" }}>{idea.headline}</div>
          <div className="flex gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#1e3a5f", color: "#93c5fd" }}>{idea.platform}</span>
            <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#1f2937", color: "#9ca3af" }}>{idea.format}</span>
          </div>
          <div className="text-sm mb-2" style={{ color: "#9ca3af" }}>
            <span className="font-medium" style={{ color: "#e5e7eb" }}>Why now: </span>
            {idea.whyNow}
          </div>
          <div className="text-sm" style={{ color: "#9ca3af" }}>
            <span className="font-medium" style={{ color: "#e5e7eb" }}>Execution: </span>
            {idea.execution}
          </div>
          {idea.sourceSignals && (
            <div className="mt-3 text-xs" style={{ color: "#4b5563" }}>
              Signals: {idea.sourceSignals}
            </div>
          )}
          <div className="mt-2 text-xs" style={{ color: "#4b5563" }}>
            {new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </div>
  );
}
