import { Resend } from "resend";
import type { IdeaResult } from "./synthesize";

export async function sendMorningBrief(
  to: string,
  brandName: string,
  ideas: IdeaResult[]
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const ideasHtml = ideas
    .map(
      (idea, i) => `
    <div style="background:#111118;border:1px solid #1f2937;border-radius:12px;padding:20px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="background:#052e16;color:#4ade80;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0;text-align:center;line-height:36px;">${idea.score}</div>
        <div style="font-size:15px;font-weight:600;color:#f9fafb;">${idea.headline}</div>
      </div>
      <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">
        <span style="background:#1e3a5f;color:#93c5fd;padding:2px 8px;border-radius:4px;margin-right:6px;">${idea.platform}</span>
        <span style="background:#1f2937;color:#9ca3af;padding:2px 8px;border-radius:4px;">${idea.format}</span>
      </div>
      <div style="font-size:13px;color:#9ca3af;margin-bottom:6px;"><strong style="color:#e5e7eb;">Why now:</strong> ${idea.whyNow}</div>
      <div style="font-size:13px;color:#9ca3af;"><strong style="color:#e5e7eb;">Execution:</strong> ${idea.execution}</div>
    </div>
  `
    )
    .join("");

  await resend.emails.send({
    from: "Scout <scout@resend.dev>",
    to,
    subject: `🔭 Scout Brief — ${ideas.length} new ideas for ${brandName} · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="background:#0a0a0f;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px 16px;margin:0;">
        <div style="max-width:600px;margin:0 auto;">
          <div style="margin-bottom:32px;">
            <div style="font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px;">🔭 Scout</div>
            <div style="font-size:13px;color:#6b7280;">Autonomous overnight brand intelligence · ${brandName}</div>
          </div>
          <div style="font-size:14px;color:#9ca3af;margin-bottom:24px;">
            Good morning. Scout ran overnight and found <strong style="color:#f9fafb;">${ideas.length} ideas</strong> grounded in what's actually moving right now. Top pick scored ${ideas[0]?.score}/10.
          </div>
          ${ideasHtml}
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #1f2937;font-size:12px;color:#4b5563;text-align:center;">
            Scout — Autonomous marketing intelligence. Running nightly so you don't have to.
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
