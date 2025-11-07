
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Eye, Target } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Career Analytics
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Track your job search progress with detailed analytics and insights. 
                Make data-driven decisions to accelerate your career growth.
              </p>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4">
                View Your Analytics
              </Button>
            </div>
          </div>
        </section>

        {/* Analytics Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Analytics Dashboard</h2>
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
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-indigo-600 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
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
