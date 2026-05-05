import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.role || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { reviewNotes } = body;

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        approvedBy: session.user.id,
        approvedAt: new Date(),
      },
      include: { user: { select: { id: true } } },
    });

    // Create notification for citizen
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: "APPLICATION_APPROVED",
        title: "Application Approved",
        message: `Your application ${application.applicationNumber} has been approved. You can now schedule your claim.`,
        link: `/citizen/applications/${application.id}`,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "APPROVE",
        entity: "Application",
        entityId: application.id,
        details: `Approved application ${application.applicationNumber}`,
      },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ message: "Failed to approve application" }, { status: 500 });
  }
}
