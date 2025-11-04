import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  HelpCircle, 
  Mail, 
  BookOpen, 
  ExternalLink 
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
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-form", {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setIsContactDialogOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      action: "Send Email",
      onClick: () => setIsContactDialogOpen(true)
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
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>
            Our support team is available to assist you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <strong>Email:</strong> contact-us@pitchsora.com
          </p>
        </CardContent>
      </Card>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Send us a message and we'll respond within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpSupport;