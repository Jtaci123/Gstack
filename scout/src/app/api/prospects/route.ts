import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const prospects = await prisma.prospect.findMany({
    orderBy: [{ fitScore: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { pitches: true } } },
  });
  return NextResponse.json(prospects);
}

export async function POST(req: Request) {
  const body = await req.json();
  const prospect = await prisma.prospect.create({ data: body });
  return NextResponse.json(prospect, { status: 201 });
}
