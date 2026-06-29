import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePitch } from "@/lib/pitch";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { prospectId } = await req.json();

  const [agencyProfile, prospect] = await Promise.all([
    prisma.agencyProfile.findUnique({ where: { id: "agency" } }),
    prisma.prospect.findUnique({ where: { id: prospectId } }),
  ]);

  if (!agencyProfile) {
    return NextResponse.json({ error: "Agency profile not set up" }, { status: 400 });
  }
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }

  const result = await generatePitch(agencyProfile, prospect);

  const pitch = await prisma.pitch.create({
    data: {
      prospectId: prospect.id,
      bigIdea: result.bigIdea,
      hook: result.hook,
      situation: result.situation,
      insight: result.insight,
      concept: result.concept,
      execution: result.execution,
      whyUs: result.whyUs,
      whyNow: result.whyNow,
      callToAction: result.callToAction,
      dataPoints: result.dataPoints,
    },
  });

  return NextResponse.json({ ok: true, pitch });
}
