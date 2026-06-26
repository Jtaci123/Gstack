"use client";

import { useState, useEffect } from "react";
import BrandCard from "@/components/BrandCard";
import NewBrandModal from "@/components/NewBrandModal";
import type { Brand } from "@/types";

export default function Home() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadBrands() {
    const res = await fetch("/api/brands");
    setBrands(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadBrands(); }, []);

  return (
    <main className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="border-b" style={{ borderColor: "#1f2937" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>🔭 Scout</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4b5563", letterSpacing: "0.5px", textTransform: "uppercase" }}>Autonomous overnight brand intelligence</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "#7c3aed", color: "#fff" }}
          >
            + Add Brand
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20" style={{ color: "#4b5563" }}>Loading...</div>
        ) : brands.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔭</div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#f9fafb" }}>No brands yet</div>
            <p className="mb-6" style={{ color: "#6b7280" }}>Add your first brand to start generating overnight ideas.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-80"
              style={{ background: "#7c3aed", color: "#fff" }}
            >
              Add Brand
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} onRefresh={loadBrands} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewBrandModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); loadBrands(); }}
        />
      )}
    </main>
  );
}
