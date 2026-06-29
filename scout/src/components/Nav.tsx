"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Scout", icon: "🔭", desc: "Brand Ideas" },
  { href: "/prospects", label: "Prospects", icon: "🎯", desc: "Find Clients" },
  { href: "/agency", label: "Agency", icon: "🏢", desc: "Our Profile" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <header className="border-b" style={{ borderColor: "#1f2937", background: "#0a0a0f" }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = link.href === "/" ? path === "/" : path.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active ? "#2e1065" : "transparent",
                  color: active ? "#c4b5fd" : "#6b7280",
                  border: active ? "1px solid #4c1d95" : "1px solid transparent",
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="text-xs" style={{ color: "#374151" }}>
          Scout
        </div>
      </div>
    </header>
  );
}
