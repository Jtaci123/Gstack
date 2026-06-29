"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Prospect } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  pitched: "Pitched",
  won: "Won",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: "#1e3a5f", color: "#93c5fd" },
  contacted: { bg: "#2e1065", color: "#c4b5fd" },
  pitched: { bg: "#1c2a1c", color: "#86efac" },
  won: { bg: "#052e16", color: "#4ade80" },
  lost: { bg: "#1f2937", color: "#6b7280" },
};

export default function ProspectsPage() {
  const router = useRouter();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [hasAgency, setHasAgency] = useState<boolean | null>(null);
  const [discoverError, setDiscoverError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/agency").then((r) => r.json()),
      fetch("/api/prospects").then((r) => r.json()),
    ]).then(([agency, prospects]) => {
      setHasAgency(!!agency?.name);
      setProspects(prospects);
      setLoading(false);
    });
  }, []);

  async function handleDiscover() {
    setDiscovering(true);
    setDiscoverError("");
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCriteria: criteria }),
      });
      if (!res.ok) {
        const err = await res.json();
        setDiscoverError(err.error ?? "Discovery failed");
        return;
      }
      const fresh = await fetch("/api/prospects").then((r) => r.json());
      setProspects(fresh);
    } finally {
      setDiscovering(false);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Remove this prospect?")) return;
    await fetch(`/api/prospects/${id}`, { method: "DELETE" });
    setProspects((p) => p.filter((x) => x.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32" style={{ color: "#4b5563" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#f9fafb" }}>Prospect Finder</h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Scout scours the internet for companies that are a strategic fit — then writes the pitch.
          </p>
        </div>
      </div>

      {!hasAgency && (
        <div className="rounded-2xl p-5 mb-8 flex items-center gap-4" style={{ background: "#1c1917", border: "1px solid #292524" }}>
          <div className="text-2xl">🏢</div>
          <div className="flex-1">
            <div className="font-semibold text-sm mb-0.5" style={{ color: "#f9fafb" }}>Set up your Agency Profile first</div>
            <div className="text-sm" style={{ color: "#6b7280" }}>
              Scout needs to know your strengths and past work before it can find the right prospects.
            </div>
          </div>
          <button
            onClick={() => router.push("/agency")}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "#7c3aed", color: "#fff" }}
          >
            Set Up Profile
          </button>
        </div>
      )}

      <div className="rounded-2xl p-6 mb-8" style={{ background: "#111118", border: "1px solid #1f2937" }}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7c3aed" }}>
          Run Discovery
        </div>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <textarea
              className="w-full rounded-xl px-4 py-3 text-sm resize-none"
              style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb", outline: "none" }}
              rows={2}
              placeholder="Optional: narrow the search — e.g. 'D2C brands that raised Series B in 2025' or 'fashion brands launching a US market entry'"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
            />
            {discoverError && (
              <p className="text-xs mt-2" style={{ color: "#f87171" }}>{discoverError}</p>
            )}
          </div>
          <button
            onClick={handleDiscover}
            disabled={discovering || !hasAgency}
            className="flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "#7c3aed", color: "#fff" }}
          >
            {discovering ? "Searching..." : "Find Prospects"}
          </button>
        </div>
        {discovering && (
          <div className="mt-4 text-sm" style={{ color: "#c4b5fd" }}>
            Scout is searching the web for companies that match your agency&apos;s profile. This takes 30-60 seconds...
          </div>
        )}
      </div>

      {prospects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎯</div>
          <div className="text-lg font-semibold mb-2" style={{ color: "#f9fafb" }}>No prospects yet</div>
          <p style={{ color: "#6b7280" }}>Run discovery above and Scout will find your next clients.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-xs mb-2" style={{ color: "#4b5563" }}>
            {prospects.length} prospect{prospects.length !== 1 ? "s" : ""} found
          </div>
          {prospects.map((p) => (
            <ProspectCard key={p.id} prospect={p} onDelete={handleDelete} onClick={() => router.push(`/prospects/${p.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProspectCard({
  prospect,
  onClick,
  onDelete,
}: {
  prospect: Prospect;
  onClick: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) {
  const scoreColor =
    prospect.fitScore >= 8 ? "#4ade80" : prospect.fitScore >= 6 ? "#fbbf24" : "#f87171";
  const scoreBg =
    prospect.fitScore >= 8 ? "#052e16" : prospect.fitScore >= 6 ? "#1c1917" : "#450a0a";
  const status = STATUS_COLORS[prospect.status] ?? STATUS_COLORS.new;

  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-all hover:border-violet-700"
      style={{ background: "#111118", border: "1px solid #1f2937" }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: scoreBg, color: scoreColor }}
        >
          {prospect.fitScore}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold" style={{ color: "#f9fafb" }}>{prospect.companyName}</div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              {STATUS_LABELS[prospect.status] ?? prospect.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            {prospect.industry && (
              <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#1e3a5f", color: "#93c5fd" }}>
                {prospect.industry}
              </span>
            )}
            {prospect.website && (
              <span className="text-xs" style={{ color: "#4b5563" }}>{prospect.website}</span>
            )}
            {prospect._count && prospect._count.pitches > 0 && (
              <span className="text-xs" style={{ color: "#7c3aed" }}>
                {prospect._count.pitches} pitch{prospect._count.pitches !== 1 ? "es" : ""}
              </span>
            )}
          </div>
          {prospect.description && (
            <p className="text-sm mb-2 line-clamp-2" style={{ color: "#9ca3af" }}>{prospect.description}</p>
          )}
          {prospect.signals && (
            <p className="text-xs" style={{ color: "#6b7280" }}>
              <span style={{ color: "#e5e7eb" }}>Signal: </span>{prospect.signals}
            </p>
          )}
        </div>
        <button
          onClick={(e) => onDelete(prospect.id, e)}
          className="flex-shrink-0 text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
          style={{ color: "#4b5563", background: "#1f2937" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
