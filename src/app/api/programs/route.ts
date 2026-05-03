import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin");

    if (admin) {
      const session = await auth();
      if (!session?.user?.role || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
      const programs = await prisma.assistanceProgram.findMany({
        include: {
          requirements: { orderBy: { sortOrder: "asc" } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(programs);
    }

    const programs = await prisma.assistanceProgram.findMany({
      where: { status: "ACTIVE" },
      include: {
        requirements: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(programs);
  } catch {
    return NextResponse.json({ message: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const program = await prisma.assistanceProgram.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        requirements: body.requirements,
        benefits: body.benefits,
        eligibility: body.eligibility,
        budget: body.budget ? parseFloat(body.budget) : null,
        maxApplicants: body.maxApplicants ? parseInt(body.maxApplicants) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        color: body.color,
        createdBy: session.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "AssistanceProgram",
        entityId: program.id,
        details: `Created program: ${program.name}`,
      },
    });

    return NextResponse.json(program);
  } catch {
    return NextResponse.json({ message: "Failed to create program" }, { status: 500 });
  }
}
