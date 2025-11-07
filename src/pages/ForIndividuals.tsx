
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase, TrendingUp, FileText, Search, BarChart3, Zap, Target, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForIndividuals = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                For Individuals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Take control of your career with our comprehensive suite of tools designed for individual job seekers.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Land Your Dream Job</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Professional Resume Builder",
                  description: "Create ATS-optimized resumes with AI-powered suggestions and industry-specific templates"
                },
                {
                  icon: <Search className="w-8 h-8" />,
                  title: "Smart Job Search",
                  description: "AI matches you with relevant opportunities and auto-applies to positions that fit your profile"
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Career Analytics",
                  description: "Track applications, monitor success rates, and optimize your job search strategy"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-8 hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="text-blue-600 mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Why Professionals Choose Pitchsora</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Join thousands of job seekers who have accelerated their career growth with our comprehensive platform.
                </p>
                <ul className="space-y-4">
                  {[
                    "AI-powered resume optimization for better ATS results",
                    "Personalized job recommendations based on your skills",
                    "One-click applications to multiple positions",
                    "Real-time application tracking and analytics",
                    "Interview preparation with AI feedback",
                    "Professional templates trusted by top companies"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "50K+", label: "Active Job Seekers", icon: <User className="w-6 h-6" /> },
                  { number: "3x", label: "More Interviews", icon: <Target className="w-6 h-6" /> },
                  { number: "85%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" /> },
                  { number: "2 Weeks", label: "Avg. Time to Hire", icon: <Zap className="w-6 h-6" /> }
                ].map((stat, index) => (
                  <Card key={index} className="p-6 text-center">
                    <CardContent className="p-0">
                      <div className="text-blue-600 mb-3 flex justify-center">{stat.icon}</div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Accelerate Your Career?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start building your professional resume and applying to jobs today. No credit card required.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
                <Link to="/templates">View Templates</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForIndividuals;
