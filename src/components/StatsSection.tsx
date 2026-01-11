import React from 'react';
import { Users, FileText, TrendingUp, Star } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      color: 'from-primary to-blue-400'
    },
    {
      icon: FileText,
      value: '50,000+',
      label: 'Resumes Built',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Success Rate',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'User Rating',
      color: 'from-amber-500 to-orange-400'
    }
  ];

  return (
    <section className="relative py-16 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
