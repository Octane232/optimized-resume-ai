import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, FileText, Users, Briefcase, DollarSign, BookOpen, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForStudents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-20 bg-gradient-to-br from-emerald-500/10 to-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <GraduationCap className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                For Students
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Launch your career with confidence. Get student-friendly resume templates and entry-level job opportunities.
              </p>
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4">
                <Link to="/auth">Start Your Career Journey</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Student Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Built for Students & Recent Graduates</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Entry-Level Templates",
                  description: "Student-friendly resume templates designed to highlight your education, projects, and potential"
                },
                {
                  icon: <Briefcase className="w-8 h-8" />,
                  title: "Internship & Entry Jobs",
                  description: "Access thousands of internships and entry-level positions perfect for launching your career"
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Career Guidance",
                  description: "Get personalized career advice, interview prep, and tips for first-time job seekers"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-8 hover:shadow-xl transition-shadow bg-card border-border">
                  <CardContent className="p-0">
                    <div className="text-emerald-500 mb-6 flex justify-center">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offers for Students */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Award className="w-12 h-12 text-emerald-500 mb-6" />
                <h2 className="text-4xl font-bold text-foreground mb-6">Student Benefits & Free Resources</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  We believe in supporting the next generation of professionals. That's why we offer special benefits for students.
                </p>
                <ul className="space-y-4">
                  {[
                    "50% discount on Pro plans with valid student ID",
                    "Free resume reviews from career coaches",
                    "Access to student-exclusive webinars and workshops",
                    "Career development resources and guides",
                    "Priority support for job search questions",
                    "Lifetime access to your student portfolio"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 mt-8">
                  <Link to="/auth">Claim Student Discount</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <GraduationCap className="w-6 h-6" />, number: "100K+", label: "Student Users" },
                  { icon: <Briefcase className="w-6 h-6" />, number: "50K+", label: "Internships Posted" },
                  { icon: <Users className="w-6 h-6" />, number: "5K+", label: "Universities" },
                  { icon: <DollarSign className="w-6 h-6" />, number: "50%", label: "Student Discount" }
                ].map((stat, index) => (
                  <Card key={index} className="p-6 text-center bg-card border-border">
                    <CardContent className="p-0">
                      <div className="text-emerald-500 mb-3 flex justify-center">{stat.icon}</div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Started */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Launch Your Career in 3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Create Your Student Profile",
                  description: "Sign up with your .edu email and verify your student status for instant access to discounts"
                },
                {
                  step: "2",
                  title: "Build Your First Resume",
                  description: "Choose from student-friendly templates and let AI help highlight your education and projects"
                },
                {
                  step: "3",
                  title: "Apply to Opportunities",
                  description: "Browse internships and entry-level jobs matched to your major and career interests"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Career Journey?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students and recent graduates who landed their dream jobs with Vaylance.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-4">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
                <Link to="/templates">View Student Templates</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
