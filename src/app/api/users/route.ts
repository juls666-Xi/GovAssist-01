import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
