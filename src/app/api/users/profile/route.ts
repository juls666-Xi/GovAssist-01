import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        name: `${body.firstName} ${body.lastName}`,
        phone: body.phone,
        address: body.address,
        barangay: body.barangay,
        city: body.city,
        province: body.province,
        zipCode: body.zipCode,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "User",
        entityId: session.user.id,
        details: "Updated profile information",
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
