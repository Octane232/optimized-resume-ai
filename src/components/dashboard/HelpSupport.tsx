import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  HelpCircle, 
  Mail, 
  BookOpen, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

interface SupportOption {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  href?: string;
  internal?: boolean;
  onClick?: () => void;
}

const HelpSupport = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const emailAddress = 'support@vaylance.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    toast({
      title: "Email copied!",
      description: "Email address copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const supportOptions: SupportOption[] = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      action: "View Docs",
      href: "/documentation",
      internal: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: "Copy Email",
      onClick: handleCopyEmail
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
                  <Mail className="w-4 h-4" />
                </Button>
              ) : option.internal && option.href ? (
                <Button asChild variant="outline" className="w-full">
                  <Link to={option.href} className="flex items-center justify-center gap-2">
                    {option.action}
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </Button>
              ) : option.href ? (
                <Button asChild variant="outline" className="w-full">
                  <a href={option.href} className="flex items-center justify-center gap-2">
                    {option.action}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              ) : null}
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
      {/* Direct Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Still need help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Email us at:</p>
            <p className="text-lg font-semibold mb-3">{emailAddress}</p>
            <Button onClick={handleCopyEmail} className="w-full gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Email Address
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            We typically respond within 24 hours
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;