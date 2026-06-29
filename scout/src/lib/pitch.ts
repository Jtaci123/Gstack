import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PitchResult {
  bigIdea: string;
  hook: string;
  situation: string;
  insight: string;
  concept: string;
  execution: string;
  whyUs: string;
  whyNow: string;
  callToAction: string;
  dataPoints: string;
}

function extractJsonObject(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : "{}";
}

export async function generatePitch(
  agencyProfile: {
    name: string;
    strengths?: string | null;
    pastWork?: string | null;
    industries?: string | null;
    style?: string | null;
    credentials?: string | null;
  },
  prospect: {
    companyName: string;
    website?: string | null;
    industry?: string | null;
    description?: string | null;
    signals?: string | null;
    painPoints?: string | null;
    whyFit?: string | null;
  }
): Promise<PitchResult> {
  const prompt = `You are the chief creative director and head strategist for ${agencyProfile.name}, a marketing agency.

AGENCY PROFILE:
${agencyProfile.strengths ? `Strengths: ${agencyProfile.strengths}` : ""}
${agencyProfile.pastWork ? `Past Work & Case Studies: ${agencyProfile.pastWork}` : ""}
${agencyProfile.industries ? `Industries: ${agencyProfile.industries}` : ""}
${agencyProfile.style ? `Creative Style: ${agencyProfile.style}` : ""}
${agencyProfile.credentials ? `Credentials & Awards: ${agencyProfile.credentials}` : ""}

PROSPECT:
Company: ${prospect.companyName}
${prospect.website ? `Website: ${prospect.website}` : ""}
${prospect.industry ? `Industry: ${prospect.industry}` : ""}
${prospect.description ? `What they do: ${prospect.description}` : ""}
${prospect.signals ? `Why now: ${prospect.signals}` : ""}
${prospect.painPoints ? `Marketing gaps: ${prospect.painPoints}` : ""}
${prospect.whyFit ? `Why we're a fit: ${prospect.whyFit}` : ""}

Search the web for the latest intelligence on ${prospect.companyName} — their recent campaigns, news, cultural moment, competitors, executive moves, and brand positioning. Then write a pitch document that will WIN this account.

The pitch must:
- Open with something specific and surprising about their brand right now (not generic praise)
- Lead with a bold, original campaign concept — a real creative idea ready to execute
- Connect our past work directly and specifically to their challenge
- Use real, current data to build urgency and credibility
- Sound like it was written by someone obsessed with their brand for months

Return ONLY valid JSON — no other text:
{
  "bigIdea": "the campaign or concept name — punchy, memorable, max 8 words",
  "hook": "the opening — reference something specific about their brand this moment, then pivot to the opportunity. Confident, not flattering (2-3 sentences)",
  "situation": "their current market position, recent moves, what's happening in their world — use real data and specifics (3-4 sentences)",
  "insight": "the single cultural or market insight that unlocks everything — the 'a-ha' that justifies the strategy (2-3 sentences)",
  "concept": "the full creative concept — what it is, what it looks and feels like, why it's right for THIS brand right now (4-5 sentences)",
  "execution": "specific platforms, phases, formats, and deliverables — make it feel executable and real (4-5 sentences)",
  "whyUs": "why ${agencyProfile.name} specifically — tie our actual past work and exact capabilities to their specific need (3-4 sentences)",
  "whyNow": "the urgency — why this exact moment demands action, and what's at stake if they wait (2-3 sentences)",
  "callToAction": "a specific, confident ask — not 'let's chat', a real next step (1-2 sentences)",
  "dataPoints": "comma-separated list of all real data points, news, stats, and signals referenced in this pitch"
}`;

  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: any[] = [{ type: "web_search_20250305", name: "web_search" }];

  for (let i = 0; i < 6; i++) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const text = response.content
        .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return JSON.parse(extractJsonObject(text)) as PitchResult;
    }

    if (response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content });
      const toolResults = response.content
        .filter((b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use")
        .map((b) => ({
          type: "tool_result" as const,
          tool_use_id: b.id,
          content: "",
        }));
      messages.push({ role: "user", content: toolResults });
    }
  }

  throw new Error("Pitch generation exceeded maximum iterations");
}
