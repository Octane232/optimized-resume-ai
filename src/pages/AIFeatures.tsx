import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, FileText, Target, BarChart3, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIFeatures = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Content Generation",
      description: "AI writes compelling bullet points and summaries tailored to your industry",
      benefits: ["Industry-specific language", "ATS-optimized keywords", "Compelling action words"]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Job Matching AI",
      description: "Advanced algorithms match you with perfect job opportunities",
      benefits: ["98% accuracy rate", "Real-time job alerts", "Personalized recommendations"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Track your application success and optimize your job search strategy",
      benefits: ["Application tracking", "Response rate analysis", "Improvement suggestions"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Auto-Apply Technology",
      description: "Automatically apply to relevant positions while you focus on interviews",
      benefits: ["24/7 job applications", "Custom cover letters", "Application tracking"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-500/10 to-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                AI-Powered Features
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Experience the future of career advancement with our cutting-edge AI technology. 
                From resume writing to job applications, our AI does the heavy lifting.
              </p>
              <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4">
                <Link to="/auth">Explore AI Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* AI Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <Card key={index} className="p-8 bg-card border-border shadow-lg">
                  <CardContent className="p-0">
                    <div className="text-purple-500 mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                          <span className="text-foreground/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Experience AI-Powered Career Growth?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with our AI technology.
            </p>
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4">
              <Link to="/auth">Start Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIFeatures;
