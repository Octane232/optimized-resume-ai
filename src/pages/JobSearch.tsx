import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Target, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobSearch = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Job Matching",
      description: "AI-powered algorithm matches you with relevant job opportunities"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Filters",
      description: "Set preferences for location, salary, company size, and more"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Auto Apply",
      description: "Automatically apply to jobs that match your criteria"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Application Tracking",
      description: "Monitor your application status and response rates"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-500/10 to-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                AI Job Search
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Let our AI find and apply to jobs for you. Get matched with opportunities 
                that align with your skills, experience, and career goals.
              </p>
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4">
                <Link to="/auth">Start Your Job Search</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Smart Job Search Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 bg-card border-border">
                  <CardContent className="p-0">
                    <div className="text-emerald-500 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Job Search Success</h2>
              <p className="text-muted-foreground">See how our AI job search helps professionals land their dream jobs</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "500K+", label: "Jobs Available" },
                { number: "3x", label: "More Interviews" },
                { number: "60%", label: "Faster Hiring" },
                { number: "95%", label: "Match Accuracy" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-emerald-500 mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
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

export default JobSearch;
