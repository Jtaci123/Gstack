import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout — Autonomous Brand Intelligence",
  description: "Overnight marketing idea machine powered by real cultural signals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
