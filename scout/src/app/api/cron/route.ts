import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const maxDuration = 300;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brands = await prisma.brand.findMany({ where: { active: true } });

  const results = await Promise.allSettled(
    brands.map((brand) =>
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: brand.id, sendEmail: true }),
      })
    )
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ ok: true, ran: brands.length, succeeded });
}
