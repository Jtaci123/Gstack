"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const RING_POP_DEFAULTS = {
  name: "Ring Pop",
  audience: "Gen Z (16-24), nostalgia seekers, social media natives who grew up in the 90s/early 2000s",
  tone: "Playful, bold, irreverent. Leans into fun and nostalgia. Never corporate or serious. Think: candy counter energy meets internet culture.",
  history: "Ring Pop launched in 1979. Iconic 90s/Y2K candy worn on the finger. Associated with childhood, fun, pop culture (worn by celebrities in music videos). Now experiencing a Gen Z nostalgia revival.",
  doList: "Nostalgia, Y2K aesthetics, bold color, pop culture collabs, Gen Z humor, wearable candy concept, viral/shareable moments",
  dontList: "Health messaging, sophisticated/luxury tone, corporate language, anything that makes it feel like adult candy",
  searchTerms: "Ring Pop candy nostalgia Gen Z Y2K candy culture viral",
  email: "",
  ideasPerRun: 3,
};

export default function NewBrandModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    audience: "",
    tone: "",
    history: "",
    doList: "",
    dontList: "",
    searchTerms: "",
    email: "",
    ideasPerRun: 3,
  });
  const [saving, setSaving] = useState(false);

  function loadRingPop() {
    setForm({ ...RING_POP_DEFAULTS });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onCreated();
  }

  const field = (label: string, key: keyof typeof form, multiline = false, placeholder = "") => (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>{label}</label>
      {multiline ? (
        <textarea
          className="w-full rounded-lg px-3 py-2 text-sm resize-none"
          style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb" }}
          rows={3}
          value={form[key] as string}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <input
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb" }}
          value={form[key] as string}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <div className="w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto" style={{ background: "#111118", border: "1px solid #1f2937" }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#1f2937" }}>
          <h2 className="text-lg font-semibold" style={{ color: "#f9fafb" }}>Add Brand</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadRingPop}
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "#2e1065", color: "#c4b5fd", border: "1px solid #4c1d95" }}
            >
              Load Ring Pop example
            </button>
            <button onClick={onClose} style={{ color: "#6b7280" }}>✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {field("Brand Name *", "name", false, "e.g. Ring Pop")}
          {field("Target Audience", "audience", true, "Who buys this? Age, interests, platforms...")}
          {field("Tone & Voice", "tone", true, "How should the brand sound?")}
          {field("Brand History", "history", true, "Key milestones, cultural moments...")}
          {field("Do: (what works)", "doList", false, "nostalgia, bold color, Gen Z humor...")}
          {field("Don't: (what to avoid)", "dontList", false, "corporate tone, health messaging...")}
          {field("Search Terms", "searchTerms", false, "brand candy nostalgia Gen Z...")}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Delivery Email *</label>
            <input
              type="email"
              required
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb" }}
              value={form.email}
              placeholder="you@yourcompany.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#9ca3af" }}>Ideas Per Run</label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ background: "#0d0d14", border: "1px solid #1f2937", color: "#f9fafb" }}
              value={form.ideasPerRun}
              onChange={(e) => setForm({ ...form, ideasPerRun: Number(e.target.value) })}
            >
              {[1, 2, 3, 5].map((n) => <option key={n} value={n}>{n} ideas</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: "#1f2937", color: "#9ca3af" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name || !form.email}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: "#7c3aed", color: "#fff" }}
            >
              {saving ? "Creating..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
