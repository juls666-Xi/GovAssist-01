import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  GraduationCap,
  Users,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Wallet,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  GraduationCap,
  Users,
  Briefcase,
  AlertTriangle,
};

async function getPrograms() {
  return prisma.assistanceProgram.findMany({
    where: { status: "ACTIVE" },
    include: {
      requirements: { orderBy: { sortOrder: "asc" } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProgramsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const programs = await getPrograms();

  return (
    <DashboardLayout requiredRole="CITIZEN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-900">Assistance Programs</h1>
          <p className="text-muted-foreground">
            Browse and apply for available government assistance programs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => {
            const Icon = iconMap[program.icon || "Heart"] || Heart;
            const spotsLeft = program.maxApplicants
              ? program.maxApplicants - program.currentApplicants
              : null;

            return (
              <Card key={program.id} className="gov-card flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: program.color + "20" }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: program.color || "#0ea5e9" }}
                      />
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gov-900 mt-2">{program.name}</CardTitle>
                  <CardDescription>{program.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {program.budget ? formatCurrency(Number(program.budget)) : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatDate(program.startDate)} - {formatDate(program.endDate)}
                      </span>
                    </div>
                    {spotsLeft !== null && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className={spotsLeft < 50 ? "text-orange-600 font-medium" : ""}>
                          {spotsLeft} spots remaining
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Requirements:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {program.requirements.slice(0, 3).map((req) => (
                          <Badge key={req.id} variant="secondary" className="text-xs">
                            {req.name}
                          </Badge>
                        ))}
                        {program.requirements.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{program.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Link href={`/citizen/apply?program=${program.id}`} className="block">
                      <Button className="w-full bg-gov-700 hover:bg-gov-800">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
