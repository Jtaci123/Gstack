import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { discoverProspects } from "@/lib/discover";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { targetCriteria } = await req.json();

  const agencyProfile = await prisma.agencyProfile.findUnique({ where: { id: "agency" } });
  if (!agencyProfile) {
    return NextResponse.json({ error: "Agency profile not set up" }, { status: 400 });
  }

  const results = await discoverProspects(agencyProfile, targetCriteria ?? "");

  const saved = await prisma.$transaction(
    results.map((r) =>
      prisma.prospect.create({
        data: {
          companyName: r.companyName,
          website: r.website,
          industry: r.industry,
          description: r.description,
          signals: r.signals,
          painPoints: r.painPoints,
          whyFit: r.whyFit,
          fitScore: r.fitScore,
        },
      })
    )
  );

  return NextResponse.json({ ok: true, count: saved.length, prospects: saved });
}
