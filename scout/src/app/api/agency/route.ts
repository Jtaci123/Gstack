import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SINGLETON_ID = "agency";

export async function GET() {
  const profile = await prisma.agencyProfile.findUnique({ where: { id: SINGLETON_ID } });
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { name, tagline, strengths, pastWork, industries, style, credentials } = body;

  const profile = await prisma.agencyProfile.upsert({
    where: { id: SINGLETON_ID },
    update: { name, tagline, strengths, pastWork, industries, style, credentials },
    create: { id: SINGLETON_ID, name, tagline, strengths, pastWork, industries, style, credentials },
  });

  return NextResponse.json(profile);
}
