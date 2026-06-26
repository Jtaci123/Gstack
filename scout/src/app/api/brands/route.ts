import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { ideas: true } } },
  });
  return NextResponse.json(brands);
}

export async function POST(req: Request) {
  const body = await req.json();
  const brand = await prisma.brand.create({ data: body });
  return NextResponse.json(brand, { status: 201 });
}
