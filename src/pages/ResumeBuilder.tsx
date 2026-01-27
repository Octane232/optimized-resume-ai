import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeBuilder = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Writing",
      description: "Our AI suggests compelling content based on your role and industry"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "ATS-Optimized",
      description: "Templates designed to pass Applicant Tracking Systems"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multiple Formats",
      description: "Export as PDF, Word, or plain text formats"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                AI Resume Builder
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Create professional, ATS-optimized resumes in minutes with our intelligent resume builder. 
                Our AI helps you craft compelling content that gets you noticed.
              </p>
              <Button asChild size="lg" className="saas-button px-8 py-4">
                <Link to="/auth">Start Building Your Resume</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Powerful Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-8 bg-card border-border">
                  <CardContent className="p-0">
                    <div className="text-primary mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Choose Template", desc: "Select from professional templates" },
                { step: "2", title: "Add Information", desc: "Input your work experience and skills" },
                { step: "3", title: "AI Enhancement", desc: "Let AI optimize your content" },
                { step: "4", title: "Download", desc: "Get your polished resume instantly" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
