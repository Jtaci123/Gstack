import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ProspectResult {
  companyName: string;
  website: string;
  industry: string;
  description: string;
  signals: string;
  painPoints: string;
  whyFit: string;
  fitScore: number;
}

function extractJsonArray(text: string): string {
  const match = text.match(/\[[\s\S]*\]/);
  return match ? match[0] : "[]";
}

export async function discoverProspects(
  agencyProfile: {
    name: string;
    strengths?: string | null;
    pastWork?: string | null;
    industries?: string | null;
    style?: string | null;
    credentials?: string | null;
  },
  targetCriteria: string
): Promise<ProspectResult[]> {
  const prompt = `You are a strategic business development analyst for ${agencyProfile.name}, a creative marketing agency.

AGENCY PROFILE:
${agencyProfile.strengths ? `Strengths: ${agencyProfile.strengths}` : ""}
${agencyProfile.pastWork ? `Past Work: ${agencyProfile.pastWork}` : ""}
${agencyProfile.industries ? `Target Industries: ${agencyProfile.industries}` : ""}
${agencyProfile.style ? `Creative Style: ${agencyProfile.style}` : ""}
${agencyProfile.credentials ? `Credentials: ${agencyProfile.credentials}` : ""}

TARGET CRITERIA: ${targetCriteria || "companies with recent funding rounds, product launches, rebrands, or marketing leadership changes"}

Search the web to find 6-8 companies that are excellent prospective clients for this agency RIGHT NOW. Prioritize:
- Companies with fresh Series A/B/C funding who need to build brand awareness fast
- Companies launching new products or entering new markets needing a creative push
- Companies facing a brand challenge or competitive threat where marketing can move the needle
- Companies that clearly align with this agency's industry expertise and past work

Gather real, current intel for each. Score each on strategic fit (1-10).

Return ONLY a valid JSON array — no other text:
[{
  "companyName": "string",
  "website": "string (domain only, e.g. company.com)",
  "industry": "string",
  "description": "2-3 sentences about what they do",
  "signals": "specific recent signals that make them a hot prospect right now — cite the actual news, funding amount, launch date, etc.",
  "painPoints": "their marketing gaps, challenges, and opportunities",
  "whyFit": "exactly why this agency is the right partner for them — be specific",
  "fitScore": number
}]`;

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
      return JSON.parse(extractJsonArray(text)) as ProspectResult[];
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

  throw new Error("Discovery exceeded maximum iterations");
}
