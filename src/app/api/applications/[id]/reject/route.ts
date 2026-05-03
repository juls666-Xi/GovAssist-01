import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { reviewNotes } = body;

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        reviewNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: "APPLICATION_REJECTED",
        title: "Application Rejected",
        message: `Your application ${application.applicationNumber} has been rejected. Reason: ${reviewNotes || "Not specified"}`,
        link: `/citizen/applications/${application.id}`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "REJECT",
        entity: "Application",
        entityId: application.id,
        details: `Rejected application ${application.applicationNumber}`,
      },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ message: "Failed to reject application" }, { status: 500 });
  }
}
