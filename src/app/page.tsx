import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  FileText,
  Clock,
  Bell,
  CheckCircle,
  Users,
  BarChart3,
  ArrowRight,
  Heart,
  GraduationCap,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gov-gradient py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            GovAssist<span className="text-gov-300">Pro</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gov-100">
            Your secure, modern gateway to government assistance programs. 
            Apply online, track your applications, and manage documents—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-gov-800 hover:bg-gov-50">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Applications Processed", icon: FileText },
              { value: "5,000+", label: "Citizens Served", icon: Users },
              { value: "50+", label: "Assistance Programs", icon: Heart },
              { value: "99%", label: "Satisfaction Rate", icon: CheckCircle },
            ].map((stat, i) => (
              <Card key={i} className="gov-card text-center">
                <CardContent className="pt-6">
                  <stat.icon className="mx-auto h-8 w-8 text-gov-600 mb-2" />
                  <div className="text-2xl font-bold text-gov-900">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gov-900 mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and streamlined process for accessing government assistance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Register & Verify",
                description: "Create your account with secure verification. Your identity is protected with enterprise-grade security.",
              },
              {
                icon: FileText,
                title: "Apply Online",
                description: "Browse available programs and submit applications with required documents from anywhere, anytime.",
              },
              {
                icon: Clock,
                title: "Track & Claim",
                description: "Monitor your application status in real-time and receive notifications when approved.",
              },
            ].map((feature, i) => (
              <Card key={i} className="gov-card">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-gov-50 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-gov-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gov-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gov-900 mb-4">Available Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive assistance programs designed to support our community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Medical Assistance", desc: "Healthcare support for indigent patients", color: "bg-red-50 text-red-600" },
              { icon: GraduationCap, title: "Educational Support", desc: "Financial aid for students", color: "bg-blue-50 text-blue-600" },
              { icon: AlertTriangle, title: "Disaster Relief", desc: "Emergency assistance for calamities", color: "bg-yellow-50 text-yellow-600" },
              { icon: Briefcase, title: "Livelihood Program", desc: "Business seed capital support", color: "bg-green-50 text-green-600" },
            ].map((program, i) => (
              <Card key={i} className="gov-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`h-12 w-12 rounded-lg ${program.color} flex items-center justify-center mb-4`}>
                    <program.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gov-900 mb-1">{program.title}</h3>
                  <p className="text-sm text-muted-foreground">{program.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gov-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gov-100 mb-8 max-w-xl mx-auto">
            Join thousands of citizens who trust GovAssist Pro for their government assistance needs.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-gov-800 hover:bg-gov-50">
              Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
