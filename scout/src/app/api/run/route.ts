import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { synthesizeIdeas } from "@/lib/synthesize";
import { sendMorningBrief } from "@/lib/email";

export const maxDuration = 60;

async function gatherSignals(brand: {
  name: string;
  searchTerms?: string | null;
  audience?: string | null;
}): Promise<string> {
  // Stub signal data — in production this calls the last30days engine
  // For demo/MVP we return curated signals so the app works without API keys
  return `
LIVE CULTURAL SIGNALS — ${new Date().toLocaleDateString()}

Source: Reddit (r/nostalgia, r/GenZ, r/candy)
- "Why Gen Z Is Reviving 90s Fashion and Pop Culture" — 90s revival trend accelerating, nostalgia-driven content dominating social feeds
- Wearable tech conversation peaked (Oura Ring 5 launched, Apple Watch Ultra news) — ring form factor top of mind across tech + fashion

Source: Hacker News
- Oura Ring 5 launch covered twice this week (Bloomberg + official) — wearables mainstream conversation
- Smart ring category growing rapidly

Source: Twitter/X trends
- #Y2Kaesthetic trending, 90s candy visuals getting heavy engagement
- Anti-luxury / authenticity backlash posts going viral ("just let things be fun")

Source: TikTok
- Nostalgia candy unboxing content averaging 2M+ views
- "Childhood snacks" format surging — creators eating Ring Pop featured in multiple viral clips

Brand context: ${brand.name} — ${brand.audience || "Gen Z and millennial audience"}
Search terms: ${brand.searchTerms || brand.name}
  `.trim();
}

export async function POST(req: Request) {
  const { brandId, sendEmail = false } = await req.json();

  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const signals = await gatherSignals(brand);

  const brandDoc = [
    `Brand: ${brand.name}`,
    brand.audience && `Audience: ${brand.audience}`,
    brand.tone && `Tone & Voice: ${brand.tone}`,
    brand.history && `History: ${brand.history}`,
    brand.doList && `Do: ${brand.doList}`,
    brand.dontList && `Don't: ${brand.dontList}`,
  ]
    .filter(Boolean)
    .join("\n");

  const ideas = await synthesizeIdeas(brand.name, brandDoc, signals, brand.ideasPerRun);

  const saved = await prisma.$transaction(
    ideas.map((idea) =>
      prisma.idea.create({
        data: {
          brandId: brand.id,
          headline: idea.headline,
          platform: idea.platform,
          format: idea.format,
          whyNow: idea.whyNow,
          execution: idea.execution,
          score: idea.score,
          sourceSignals: idea.sourceSignals,
        },
      })
    )
  );

  if (sendEmail && brand.email) {
    await sendMorningBrief(brand.email, brand.name, ideas);
  }

  return NextResponse.json({ ok: true, ideas: saved });
}
