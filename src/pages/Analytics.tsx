import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Eye, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-500/10 to-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Career Analytics
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Track your job search progress with detailed analytics and insights. 
                Make data-driven decisions to accelerate your career growth.
              </p>
              <Button asChild size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4">
                <Link to="/auth">View Your Analytics</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Analytics Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Analytics Dashboard</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Application Tracking",
                  description: "Monitor all your job applications in one place"
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Response Rates",
                  description: "Track interview invitations and callback rates"
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Resume Views",
                  description: "See how often recruiters view your profile"
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Success Metrics",
                  description: "Measure your job search effectiveness"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-6 bg-card border-border">
                  <CardContent className="p-0">
                    <div className="text-indigo-500 mb-4 flex justify-center">
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
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
