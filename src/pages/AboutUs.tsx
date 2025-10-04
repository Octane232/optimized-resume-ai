
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Heart, Zap, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                About Pitchsora
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're revolutionizing the job search experience with AI-powered tools that help professionals 
                build better resumes, find perfect jobs, and accelerate their careers.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  At Pitchsora, we believe that everyone deserves access to tools that help them showcase their talents 
                  and find meaningful work. Our mission is to democratize career advancement by making professional 
                  resume building and job searching accessible, intelligent, and effective for everyone.
                </p>
                <p className="text-lg text-gray-600">
                  We combine cutting-edge AI technology with human-centered design to create a platform that not only 
                  helps you land interviews but guides you through your entire career journey.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "Precision",
                    description: "AI-powered matching that connects the right talent with the right opportunities"
                  },
                  {
                    icon: <Heart className="w-8 h-8" />,
                    title: "Empathy",
                    description: "Understanding the challenges of job searching and career transitions"
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Innovation",
                    description: "Continuously improving our platform with latest technology"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Community",
                    description: "Building a supportive network of professionals helping each other succeed"
                  }
                ].map((value, index) => (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="text-blue-600 mb-4 flex justify-center">{value.icon}</div>
                      <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Trusted by Professionals Worldwide</h2>
              <p className="text-gray-600 text-lg">Join thousands who have transformed their careers with Pitchsora</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "150K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
                { number: "2M+", label: "Resumes Created", icon: <TrendingUp className="w-6 h-6" /> },
                { number: "5M+", label: "Job Applications", icon: <Target className="w-6 h-6" /> },
                { number: "95%", label: "Success Rate", icon: <Award className="w-6 h-6" /> }
              ].map((stat, index) => (
                <Card key={index} className="p-8 text-center">
                  <CardContent className="p-0">
                    <div className="text-blue-600 mb-3 flex justify-center">{stat.icon}</div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">What Makes Pitchsora Different</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "AI-Powered Intelligence",
                    description: "Our advanced AI doesn't just format your resume—it optimizes content, suggests improvements, and matches you with jobs that truly fit your profile."
                  },
                  {
                    title: "ATS-Optimized by Default",
                    description: "Every template is designed to pass Applicant Tracking Systems, ensuring your resume reaches human eyes."
                  },
                  {
                    title: "Comprehensive Career Platform",
                    description: "Beyond resumes—we offer job search, application tracking, interview prep, and career analytics all in one place."
                  },
                  {
                    title: "Privacy & Security First",
                    description: "Your data is encrypted and never shared without your permission. We're SOC 2 compliant and take your privacy seriously."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of professionals and start building your future today.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
