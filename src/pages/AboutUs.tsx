
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/logo-icon.png';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28">
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                About Pitchsora
              </h1>
              <p className="text-lg text-gray-600">
                We help job seekers create better resumes and get more interviews. That's it.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold mb-4">Why we built this</h2>
                <p className="text-lg text-gray-600 mb-4">
                  Job hunting is already stressful. Your resume shouldn't add to that stress.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  We built Pitchsora because we were tired of resume builders that either looked terrible or cost way too much. 
                  Most of them make promises they can't keep about "guaranteed interviews" or "AI magic."
                </p>
                <p className="text-lg text-gray-600">
                  We focus on what actually matters: clean templates that pass ATS systems, simple editing tools, 
                  and helpful suggestions when you need them. No BS.
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
                    icon: <img src={logoIcon} alt="Pitchsora" className="w-24 h-24" />,
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
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: "1,200+", label: "Users", icon: <Users className="w-6 h-6" /> },
                { number: "3,400+", label: "Resumes Created", icon: <TrendingUp className="w-6 h-6" /> },
                { number: "4.6★", label: "Average Rating", icon: <Award className="w-6 h-6" /> }
              ].map((stat, index) => (
                <Card key={index} className="p-6 text-center">
                  <CardContent className="p-0">
                    <div className="text-blue-600 mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
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
