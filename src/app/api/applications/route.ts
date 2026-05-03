import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateApplicationNumber } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let where: any = {};

    if (session.user.role === "CITIZEN") {
      where.userId = session.user.id;
    } else if (session.user.role === "STAFF" || session.user.role === "ADMIN") {
      if (status) {
        where.status = { in: status.split(",") };
      }
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        program: { select: { name: true, category: true, color: true } },
        user: { select: { name: true, email: true, firstName: true, lastName: true, phone: true } },
        documents: { select: { id: true, name: true, status: true, fileUrl: true } },
        schedule: { select: { scheduledDate: true, scheduledTime: true, location: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "CITIZEN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { programId, formData } = body;

    const applicationNumber = generateApplicationNumber();

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        userId: session.user.id,
        programId,
        formData,
        status: "PENDING",
        submittedAt: new Date(),
      },
    });

    // Update program applicant count
    await prisma.assistanceProgram.update({
      where: { id: programId },
      data: { currentApplicants: { increment: 1 } },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "APPLICATION_SUBMITTED",
        title: "Application Submitted",
        message: `Your application ${applicationNumber} has been received and is pending review.`,
        link: `/citizen/applications/${application.id}`,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Application",
        entityId: application.id,
        details: `Submitted application ${applicationNumber}`,
      },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ message: "Failed to create application" }, { status: 500 });
  }
}
