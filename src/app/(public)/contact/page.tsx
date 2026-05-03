"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen">
      <div className="gov-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gov-100 max-w-2xl mx-auto text-lg">
            We're here to help. Reach out to our support team for assistance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gov-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email", info: "support@govassist.local" },
                { icon: Phone, title: "Phone", info: "+63-2-8123-4567" },
                { icon: MapPin, title: "Address", info: "City Hall Building, Main Street, Metro City" },
                { icon: Clock, title: "Office Hours", info: "Monday - Friday, 8:00 AM - 5:00 PM" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gov-50 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-gov-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gov-900">{item.title}</h3>
                    <p className="text-muted-foreground">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="gov-card">
            <CardContent className="pt-6">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gov-900 mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Juan" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Dela Cruz" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your inquiry..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gov-700 hover:bg-gov-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
