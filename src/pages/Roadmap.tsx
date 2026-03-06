import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { CheckCircle, Wrench, Calendar } from 'lucide-react';

const Roadmap = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: '✅ Live Now',
      color: 'from-emerald-500 to-teal-500',
      items: [
        'ATS Resume Scanner & Rewriter',
        'AI Cover Letter (unified with resume)',
        'Interview Coach (text)',
        'Application Tracker',
        'Hidden Job Radar',
        'LinkedIn Optimizer',
        'Skill Gap Analyzer',
      ],
    },
    {
      icon: Wrench,
      title: '🔨 Building Now',
      color: 'from-amber-500 to-orange-500',
      items: [
        'Salary Intelligence',
        'Salary Negotiation Coach',
        'Live Interview Coach (voice)',
      ],
    },
    {
      icon: Calendar,
      title: '📅 Month 3',
      color: 'from-blue-500 to-indigo-500',
      items: [
        'Career Mode (Growth)',
        'First 90 Days Planner',
        'Performance Review Prep',
        'Am I Underpaid Alert',
      ],
    },
    {
      icon: Calendar,
      title: '📅 Month 4-5',
      color: 'from-purple-500 to-pink-500',
      items: [
        'Promotion Roadmap',
        'Network Engine',
        'One-Click Apply Extension',
        'Passive Opportunity Radar',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Vaylance Roadmap – What We're Building Next"
        description="See what's live, what's being built, and what's coming to Vaylance. Your AI career coach is always getting smarter."
        keywords="Vaylance roadmap, career tools roadmap, AI resume features"
        canonical="https://vaylance.com/roadmap"
      />
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-foreground">Product </span>
              <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparency is a core value. Here's exactly what we're building and when. Pro subscribers get early access to everything.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="command-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${section.color}`} />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Roadmap;