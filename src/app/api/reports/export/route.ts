import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "applications";
    const format = searchParams.get("format") || "csv";

    let data: any[] = [];
    let headers: string[] = [];

    switch (type) {
      case "applications":
        data = await prisma.application.findMany({
          include: {
            program: { select: { name: true } },
            user: { select: { name: true, email: true } },
          },
        });
        headers = ["ID", "Number", "Applicant", "Program", "Status", "Submitted", "Approved"];
        break;
      case "users":
        data = await prisma.user.findMany({
          select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        });
        headers = ["ID", "Name", "Email", "Role", "Status", "Created"];
        break;
      default:
        data = [];
    }

    if (format === "csv") {
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((h) => {
            const key = h.toLowerCase();
            let val = row[key] || row[h.toLowerCase().replace(/\s/g, "")] || "";
            if (typeof val === "object") val = JSON.stringify(val);
            return `"${String(val).replace(/"/g, '""')}"`;
          }).join(",")
        ),
      ];

      const csv = csvRows.join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="report-${type}.csv"`,
        },
      });
    }

    // For PDF, return JSON that can be used with a PDF library
    return NextResponse.json({ data, headers });
  } catch {
    return NextResponse.json({ message: "Failed to generate report" }, { status: 500 });
  }
}
