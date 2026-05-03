import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, Lock, Zap, Globe } from "lucide-react";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="gov-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About GovAssist Pro</h1>
          <p className="text-gov-100 max-w-2xl mx-auto text-lg">
            Modernizing government assistance delivery through secure, accessible digital services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gov-900 mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              GovAssist Pro is designed to bridge the gap between government services and citizens. 
              We believe that accessing government assistance should be simple, transparent, and dignified.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform serves municipalities, barangays, and local government units by providing 
              a comprehensive digital infrastructure for managing assistance programs, applications, 
              and document verification.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "Secure", desc: "Enterprise-grade security" },
              { icon: Heart, title: "Accessible", desc: "Designed for everyone" },
              { icon: Users, title: "Community", desc: "Serving our people" },
              { icon: Lock, title: "Private", desc: "Your data is protected" },
            ].map((item, i) => (
              <Card key={i} className="gov-card">
                <CardContent className="pt-6 text-center">
                  <item.icon className="mx-auto h-8 w-8 text-gov-600 mb-2" />
                  <h3 className="font-semibold text-gov-900">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gov-900 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Fast Processing",
                description: "Digital workflows reduce application processing time from weeks to days.",
              },
              {
                icon: Globe,
                title: "24/7 Access",
                description: "Apply and track applications anytime, anywhere from any device.",
              },
              {
                icon: Lock,
                title: "Document Security",
                description: "Encrypted document storage with role-based access controls.",
              },
              {
                icon: Users,
                title: "Multi-Role Support",
                description: "Tailored interfaces for citizens, staff, and administrators.",
              },
              {
                icon: Shield,
                title: "Audit Trail",
                description: "Complete logging of all actions for transparency and accountability.",
              },
              {
                icon: Heart,
                title: "Citizen-Centric",
                description: "Designed with accessibility and ease-of-use as top priorities.",
              },
            ].map((feature, i) => (
              <Card key={i} className="gov-card">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-gov-50 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-gov-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gov-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
