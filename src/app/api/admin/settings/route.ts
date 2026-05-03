import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // Update or create settings
    const updates = Object.entries(body).map(async ([key, value]) => {
      return prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value), updatedBy: session.user.id },
        create: {
          key,
          value: String(value),
          category: "GENERAL",
          updatedBy: session.user.id,
        },
      });
    });

    await Promise.all(updates);

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "SETTINGS_CHANGE",
        entity: "SystemSetting",
        details: "Updated system settings",
      },
    });

    return NextResponse.json({ message: "Settings updated" });
  } catch {
    return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
  }
}
