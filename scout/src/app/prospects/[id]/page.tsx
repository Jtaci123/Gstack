"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import type { Prospect, Pitch } from "@/types";

export default function ProspectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [pitching, setPitching] = useState(false);
  const [activePitch, setActivePitch] = useState<Pitch | null>(null);

  async function loadProspect() {
    const res = await fetch(`/api/prospects/${id}`);
    if (!res.ok) { router.push("/prospects"); return; }
    const data: Prospect = await res.json();
    setProspect(data);
    if (data.pitches && data.pitches.length > 0) setActivePitch(data.pitches[0]);
    setLoading(false);
  }

  useEffect(() => { loadProspect(); }, [id]);

  async function handleGeneratePitch() {
    setPitching(true);
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId: id }),
      });
      const data = await res.json();
      if (data.pitch) {
        setActivePitch(data.pitch);
        await loadProspect();
      }
    } finally {
      setPitching(false);
    }
  }

  async function handleStatusChange(status: string) {
    await fetch(`/api/prospects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setProspect((p) => p ? { ...p, status } : p);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32" style={{ color: "#4b5563" }}>
        Loading...
      </div>
    );
  }

  if (!prospect) return null;

  const scoreColor =
    prospect.fitScore >= 8 ? "#4ade80" : prospect.fitScore >= 6 ? "#fbbf24" : "#f87171";
  const scoreBg =
    prospect.fitScore >= 8 ? "#052e16" : prospect.fitScore >= 6 ? "#1c1917" : "#450a0a";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Prospect header */}
      <div className="mb-8">
        <button onClick={() => router.push("/prospects")} className="text-sm mb-4 inline-block transition-opacity hover:opacity-80" style={{ color: "#6b7280" }}>
          ← Prospects
        </button>
        <div className="rounded-2xl p-6" style={{ background: "#111118", border: "1px solid #1f2937" }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{ background: scoreBg, color: scoreColor }}
              >
                {prospect.fitScore}
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "#f9fafb" }}>{prospect.companyName}</h1>
                <div className="flex items-center gap-3 mt-1">
                  {prospect.industry && (
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#1e3a5f", color: "#93c5fd" }}>
                      {prospect.industry}
                    </span>
                  )}
                  {prospect.website && (
                    <span className="text-xs" style={{ color: "#4b5563" }}>{prospect.website}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={prospect.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs rounded-lg px-3 py-1.5"
                style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af" }}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="pitched">Pitched</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {prospect.description && (
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>{prospect.description}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            {prospect.signals && (
              <div className="rounded-xl p-3" style={{ background: "#0d0d14", border: "1px solid #1f2937" }}>
                <div className="text-xs font-semibold mb-1" style={{ color: "#7c3aed" }}>Signal</div>
                <div style={{ color: "#9ca3af" }}>{prospect.signals}</div>
              </div>
            )}
            {prospect.painPoints && (
              <div className="rounded-xl p-3" style={{ background: "#0d0d14", border: "1px solid #1f2937" }}>
                <div className="text-xs font-semibold mb-1" style={{ color: "#7c3aed" }}>Marketing Gap</div>
                <div style={{ color: "#9ca3af" }}>{prospect.painPoints}</div>
              </div>
            )}
            {prospect.whyFit && (
              <div className="rounded-xl p-3" style={{ background: "#0d0d14", border: "1px solid #1f2937" }}>
                <div className="text-xs font-semibold mb-1" style={{ color: "#7c3aed" }}>Why We Fit</div>
                <div style={{ color: "#9ca3af" }}>{prospect.whyFit}</div>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleGeneratePitch}
              disabled={pitching}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: "#7c3aed", color: "#fff" }}
            >
              {pitching ? "Writing pitch..." : prospect.pitches && prospect.pitches.length > 0 ? "Regenerate Pitch" : "Generate Pitch"}
            </button>
            {prospect.pitches && prospect.pitches.length > 1 && (
              <div className="flex gap-2">
                {prospect.pitches.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePitch(p)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{
                      background: activePitch?.id === p.id ? "#2e1065" : "#1f2937",
                      color: activePitch?.id === p.id ? "#c4b5fd" : "#6b7280",
                      border: `1px solid ${activePitch?.id === p.id ? "#4c1d95" : "transparent"}`,
                    }}
                  >
                    v{prospect.pitches!.length - i}
                  </button>
                ))}
              </div>
            )}
          </div>

          {pitching && (
            <div className="mt-3 text-sm" style={{ color: "#c4b5fd" }}>
              Scout is researching {prospect.companyName} and crafting your pitch... ~30-60 seconds
            </div>
          )}
        </div>
      </div>

      {/* Pitch document */}
      {activePitch && <PitchDocument pitch={activePitch} companyName={prospect.companyName} />}
    </div>
  );
}

function PitchDocument({ pitch, companyName }: { pitch: Pitch; companyName: string }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2e1065" }}>
      {/* Header */}
      <div className="px-8 py-10" style={{ background: "linear-gradient(135deg, #0d0d14 0%, #1a0a2e 100%)" }}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>
          Pitch for {companyName}
        </div>
        <h2
          className="text-3xl font-bold mb-6 leading-tight"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #c4b5fd 60%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {pitch.bigIdea}
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#d1d5db", maxWidth: "640px" }}>
          {pitch.hook}
        </p>
      </div>

      {/* Body */}
      <div className="divide-y" style={{ borderColor: "#1f2937" }}>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderTop: "1px solid #1f2937" }}>
          <PitchSection label="Their Situation" content={pitch.situation} />
          <PitchSection label="The Insight" content={pitch.insight} accent />
        </div>

        <div className="px-8 py-7" style={{ background: "#0d0d14" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            The Concept
          </div>
          <p className="text-base leading-relaxed" style={{ color: "#e5e7eb" }}>{pitch.concept}</p>
        </div>

        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderTop: "1px solid #1f2937" }}>
          <PitchSection label="How We Execute" content={pitch.execution} />
          <PitchSection label="Why Us" content={pitch.whyUs} />
        </div>

        <div className="px-8 py-7">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>
            Why Now
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{pitch.whyNow}</p>
        </div>

        {/* CTA */}
        <div className="px-8 py-8" style={{ background: "#111118" }}>
          <div
            className="rounded-2xl px-6 py-5"
            style={{ background: "linear-gradient(135deg, #1e0a3c 0%, #2e1065 100%)", border: "1px solid #4c1d95" }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>
              Next Step
            </div>
            <p className="font-semibold text-base" style={{ color: "#f9fafb" }}>{pitch.callToAction}</p>
          </div>
        </div>

        {/* Data signals */}
        {pitch.dataPoints && (
          <div className="px-8 py-5">
            <div className="text-xs font-semibold mb-2" style={{ color: "#4b5563" }}>Signals & data used</div>
            <p className="text-xs" style={{ color: "#374151" }}>{pitch.dataPoints}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PitchSection({ label, content, accent = false }: { label: string; content: string; accent?: boolean }) {
  return (
    <div className="px-8 py-7">
      <div
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: accent ? "#a78bfa" : "#7c3aed" }}
      >
        {label}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{content}</p>
    </div>
  );
}
