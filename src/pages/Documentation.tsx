import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft,
  BookOpen, 
  FileText, 
  Download, 
  Edit, 
  Palette,
  Users,
  CreditCard,
  Search
} from "lucide-react";

const Documentation = () => {
  const sections = [
    {
      icon: FileText,
      title: "Getting Started",
      items: [
        {
          question: "Creating Your First Resume",
          answer: "To create your first resume: 1. Sign in to your account, 2. Click 'Create Resume' from the dashboard, 3. Choose a template that fits your style, 4. Fill in your information step by step, 5. Preview and download your resume as PDF."
        },
        {
          question: "Choosing the Right Template",
          answer: "Vaylance offers multiple template styles: Classic templates for traditional industries, Modern templates for tech and creative fields, Executive templates for senior positions. Browse the template gallery and preview each design before selecting."
        },
        {
          question: "Understanding the Dashboard",
          answer: "Your dashboard is the control center where you can: Create new resumes, View and edit existing resumes, Access templates, Generate cover letters, Find job opportunities, Manage your account settings and billing."
        }
      ]
    },
    {
      icon: Edit,
      title: "Editing Your Resume",
      items: [
        {
          question: "Adding and Editing Sections",
          answer: "Click on any section to edit it. You can add: Personal information, Work experience, Education, Skills, Projects, Certifications. Each section can be reordered by dragging, and you can add multiple entries for experience and education."
        },
        {
          question: "Formatting Text",
          answer: "Use the formatting toolbar to: Make text bold or italic, Create bullet points, Add links, Change font sizes. Keep formatting consistent throughout your resume for a professional look."
        },
        {
          question: "Auto-Save Feature",
          answer: "Your resume automatically saves as you type. Look for the 'Saved' indicator at the top of the editor. All changes are stored securely in the cloud and synced across your devices."
        }
      ]
    },
    {
      icon: Palette,
      title: "Customization",
      items: [
        {
          question: "Changing Colors and Fonts",
          answer: "Premium users can customize: Header colors, Font families, Accent colors, Section spacing. Select a template and click 'Customize' to access advanced styling options."
        },
        {
          question: "Template Switching",
          answer: "You can switch templates at any time without losing your content. Your information will automatically adapt to the new template's layout. Preview the change before confirming."
        },
        {
          question: "Layout Options",
          answer: "Adjust your resume layout: Single or two-column designs, Section ordering, Margin sizes, Page breaks. Experiment with different layouts to find what works best for your content."
        }
      ]
    },
    {
      icon: Download,
      title: "Downloading & Sharing",
      items: [
        {
          question: "Downloading as PDF",
          answer: "To download your resume: 1. Open your resume, 2. Click the 'Download PDF' button, 3. Your resume will be optimized for printing and ATS systems. The PDF maintains all formatting and is ready to submit to employers."
        },
        {
          question: "Sharing Your Resume",
          answer: "Share your resume by: Downloading and emailing the PDF, Generating a shareable link (Premium), Exporting to cloud storage. Keep track of which version you've sent to different employers."
        },
        {
          question: "Multiple Versions",
          answer: "Create multiple versions of your resume: Tailor content for different job types, Maintain industry-specific resumes, Test different templates. Each version is saved separately in your dashboard."
        }
      ]
    },
    {
      icon: Search,
      title: "AI Features",
      items: [
        {
          question: "AI-Powered Suggestions",
          answer: "Vaylance AI helps you: Generate professional bullet points, Suggest skill keywords, Optimize for ATS systems, Improve writing clarity. Click 'AI Suggestions' while editing any section."
        },
        {
          question: "Cover Letter Generator",
          answer: "Generate tailored cover letters: Paste the job description, Vaylance AI creates a customized letter, Edit and personalize the content, Download as PDF. Access from the 'Cover Letter' section in the dashboard."
        },
        {
          question: "Interview Preparation",
          answer: "Use AI interview prep to: Get common interview questions, Practice your responses, Receive feedback on answers, Prepare for specific industries. Available in the Interview Prep section."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Billing & Subscriptions",
      items: [
        {
          question: "Free vs Premium Plans",
          answer: "Free plan includes: 3 basic templates, Standard editing features, PDF downloads. Premium unlocks: All templates, AI features, Custom branding, Priority support, Unlimited resumes."
        },
        {
          question: "Upgrading Your Plan",
          answer: "To upgrade: Go to Dashboard > Billing, Select a plan, Enter payment details, Start using premium features immediately. You can change or cancel your plan anytime."
        },
        {
          question: "Managing Subscriptions",
          answer: "In the Billing section you can: View your current plan, Update payment methods, See billing history, Cancel or downgrade. All changes take effect at the next billing cycle."
        }
      ]
    },
    {
      icon: Users,
      title: "Account Management",
      items: [
        {
          question: "Profile Settings",
          answer: "Update your profile: Personal information, Email preferences, Password changes, Account security. Access Settings from the dashboard sidebar."
        },
        {
          question: "Data Privacy",
          answer: "Your data is: Encrypted in transit and at rest, Never shared with third parties, Backed up regularly, Deletable at any time. Review our Privacy Policy for complete details."
        },
        {
          question: "Deleting Your Account",
          answer: "To delete your account: Go to Settings > Account, Click 'Delete Account', Confirm deletion, All data will be permanently removed. This action cannot be undone."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about using Vaylance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription>
                  Learn about {section.title.toLowerCase()} features and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {/* Support Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                Our support team is here to help you succeed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                <strong>Email Support:</strong> support@vaylance.com
              </p>
              <Link to="/dashboard">
                <Button variant="outline">
                  Go to Help & Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
