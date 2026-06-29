"use client";

import { useState, useEffect } from "react";
import type { AgencyProfile } from "@/types";

const EMPTY: Omit<AgencyProfile, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  tagline: "",
  strengths: "",
  pastWork: "",
  industries: "",
  style: "",
  credentials: "",
};

export default function AgencyPage() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agency")
      .then((r) => r.json())
      .then((data) => {
        if (data) setForm({ ...EMPTY, ...data });
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/agency", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function field(
    label: string,
    key: keyof typeof form,
    multiline = false,
    placeholder = "",
    hint = ""
  ) {
    return (
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "#c4b5fd" }}>
          {label}
        </label>
        {hint && <p className="text-xs mb-2" style={{ color: "#4b5563" }}>{hint}</p>}
        {multiline ? (
          <textarea
            className="w-full rounded-xl px-4 py-3 text-sm resize-none"
            style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb", outline: "none" }}
            rows={4}
            value={(form[key] as string) ?? ""}
            placeholder={placeholder}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
            onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
          />
        ) : (
          <input
            className="w-full rounded-xl px-4 py-3 text-sm"
            style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb", outline: "none" }}
            value={(form[key] as string) ?? ""}
            placeholder={placeholder}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
            onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32" style={{ color: "#4b5563" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#f9fafb" }}>Agency Profile</h1>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          This is the foundation Scout uses to find the right prospects and write pitches that actually sound like you.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#111118", border: "1px solid #1f2937" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7c3aed" }}>Identity</div>
          {field("Agency Name *", "name", false, "e.g. Droga5, Wieden+Kennedy, your agency")}
          {field("Tagline", "tagline", false, "What you say when someone asks what you do in one line")}
        </div>

        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#111118", border: "1px solid #1f2937" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7c3aed" }}>What We&apos;re Good At</div>
          {field(
            "Core Strengths",
            "strengths",
            true,
            "Brand strategy, social-first campaigns, integrated launches, experiential, performance creative...",
            "What does your agency genuinely do better than most? Be specific."
          )}
          {field(
            "Creative Style & Approach",
            "style",
            true,
            "Bold and culturally fluent. We lead with earned media and build stories that travel. Always insight-first...",
            "How would a client describe your work after seeing it?"
          )}
        </div>

        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#111118", border: "1px solid #1f2937" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7c3aed" }}>Our Work</div>
          {field(
            "Past Work & Case Studies",
            "pastWork",
            true,
            "Nike — launched Air Max Day globally, 40M impressions. Oatly US — repositioned brand, drove 3x category growth. Apple — Back to School integrated campaign...",
            "List your best work. Include client, what you did, and results if you have them. This is what Scout references in pitches."
          )}
          {field(
            "Target Industries",
            "industries",
            false,
            "Consumer goods, tech startups, fashion/apparel, food & beverage, health & wellness...",
            "Industries where you do your best work and want more clients."
          )}
          {field(
            "Credentials & Awards",
            "credentials",
            true,
            "Cannes Lions x3, D&AD Pencil, Effie Gold, One Show finalist...",
            "Awards, notable clients, or proof points that build trust."
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || !form.name}
            className="px-8 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "#7c3aed", color: "#fff" }}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {saved && (
            <span className="text-sm" style={{ color: "#4ade80" }}>
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
