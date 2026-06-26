import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface IdeaResult {
  headline: string;
  platform: string;
  format: string;
  whyNow: string;
  execution: string;
  score: number;
  sourceSignals: string;
}

export async function synthesizeIdeas(
  brandName: string,
  brandDoc: string,
  signals: string,
  count: number
): Promise<IdeaResult[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are Scout, an autonomous marketing intelligence system.

Brand: ${brandName}
Brand Document:
${brandDoc}

Live Cultural Signals (last 30 days):
${signals}

Generate exactly ${count} ranked marketing campaign ideas that intersect what is trending RIGHT NOW with what is on-brand. Each idea must be grounded in the real signals provided.

Return a JSON array with exactly ${count} objects. Each object must have these exact keys:
- headline: string (punchy campaign name, max 10 words)
- platform: string (e.g. "TikTok", "Instagram + OOH", "X/Twitter")
- format: string (e.g. "3-part video series", "limited drop", "print + social")
- whyNow: string (1-2 sentences citing specific signal data)
- execution: string (2-3 sentences describing how to execute)
- score: number (1-10, confidence/potential score)
- sourceSignals: string (comma-separated list of signals used)

Rank by score descending. Return ONLY the JSON array, no other text.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text) as IdeaResult[];
}
