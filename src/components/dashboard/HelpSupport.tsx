import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  BookOpen, 
  Video,
  ExternalLink 
} from "lucide-react";

// Declare Tawk_API type
declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
    };
  }
}

const HelpSupport = () => {
  const openLiveChat = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  const supportOptions = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      action: "View Docs",
      href: "#"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      action: "Watch Videos",
      href: "#"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      action: "Start Chat",
      onClick: openLiveChat
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: "Send Email",
      href: "mailto:support@airesume.com"
    }
  ];

  const faqs = [
    {
      question: "How do I create my first resume?",
      answer: "Click on 'Create Resume' in the sidebar, choose a template, and follow the step-by-step wizard to input your information."
    },
    {
      question: "Can I edit my resume after creating it?",
      answer: "Yes! Go to 'My Resumes', click on any resume, and you can edit it anytime."
    },
    {
      question: "How do I download my resume?",
      answer: "Open your resume and click the 'Download PDF' button at the top right corner."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes 3 resume templates, basic editing features, and PDF downloads."
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "Navigate to the 'Billing' section in the sidebar to view and upgrade your plan."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          We're here to help! Find answers to common questions or reach out to our support team.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {supportOptions.map((option, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {option.onClick ? (
                <Button onClick={option.onClick} variant="outline" className="w-full flex items-center justify-center gap-2">
                  {option.action}
                  <MessageSquare className="w-4 h-4" />
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <a href={option.href} className="flex items-center justify-center gap-2">
                    {option.action}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border last:border-0 pb-4 last:pb-0">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>
            Our support team is available Monday-Friday, 9AM-6PM EST
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <strong>Email:</strong> support@airesume.com
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> 1-800-RESUME-AI
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;