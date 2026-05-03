"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface Program {
  id: string;
  name: string;
  description: string | null;
  requirements: Array<{
    id: string;
    name: string;
    description: string | null;
    isRequired: boolean;
    documentType: string | null;
  }>;
}

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const preselectedProgram = searchParams.get("program");

  const [step, setStep] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>(preselectedProgram || "");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Record<string, File>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrograms() {
      const res = await fetch("/api/programs");
      const data = await res.json();
      setPrograms(data);
    }
    fetchPrograms();
  }, []);

  const selectedProgramData = programs.find((p) => p.id === selectedProgram);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  function handleFormChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(requirementId: string, file: File | null) {
    if (file) {
      setDocuments((prev) => ({ ...prev, [requirementId]: file }));
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError("");

    try {
      // Create application
      const appRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: selectedProgram,
          formData,
        }),
      });

      if (!appRes.ok) {
        const err = await appRes.json();
        throw new Error(err.message || "Failed to create application");
      }

      const application = await appRes.json();

      // Upload documents
      const uploadPromises = Object.entries(documents).map(async ([reqId, file]) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("applicationId", application.id);
        formDataUpload.append("requirementId", reqId);

        return fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Application Submitted!",
        description: `Your application ${application.applicationNumber} has been received.`,
        variant: "success",
      });

      router.push("/citizen/applications");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  }

  function canProceed() {
    if (step === 1) return !!selectedProgram;
    if (step === 2) {
      // Check required form fields
      return true;
    }
    if (step === 3) {
      // Check required documents
      const requiredDocs = selectedProgramData?.requirements.filter((r) => r.isRequired) || [];
      return requiredDocs.every((r) => documents[r.id]);
    }
    return false;
  }

  return (
    <DashboardLayout requiredRole="CITIZEN">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gov-900">New Application</h1>
            <p className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Select Program */}
        {step === 1 && (
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-900">Select Program</CardTitle>
              <CardDescription>Choose the assistance program you want to apply for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    onClick={() => setSelectedProgram(program.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedProgram === program.id
                        ? "border-gov-500 bg-gov-50"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gov-900">{program.name}</h3>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      </div>
                      {selectedProgram === program.id && (
                        <CheckCircle className="h-5 w-5 text-gov-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Fill Form */}
        {step === 2 && selectedProgramData && (
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-900">Application Details</CardTitle>
              <CardDescription>
                Provide the required information for {selectedProgramData.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Application *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe why you need this assistance..."
                    value={formData.purpose || ""}
                    onChange={(e) => handleFormChange("purpose", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Requested Amount (if applicable)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount || ""}
                    onChange={(e) => handleFormChange("amount", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    placeholder="Any other relevant information..."
                    value={formData.details || ""}
                    onChange={(e) => handleFormChange("details", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload Documents */}
        {step === 3 && selectedProgramData && (
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-900">Upload Documents</CardTitle>
              <CardDescription>
                Upload the required documents for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProgramData.requirements.map((req) => (
                <div key={req.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">
                        {req.name}
                        {req.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      {req.description && (
                        <p className="text-xs text-muted-foreground">{req.description}</p>
                      )}
                    </div>
                    {documents[req.id] && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(req.id, e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                  </div>
                  {documents[req.id] && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {documents[req.id].name} ({(documents[req.id].size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed()}
              className="bg-gov-700 hover:bg-gov-800"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-gov-700 hover:bg-gov-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
