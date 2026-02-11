import React from 'react';
import { Users, FileText, TrendingUp, Star } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '1,200+',
      label: 'Active Users',
      color: 'from-primary to-blue-400'
    },
    {
      icon: FileText,
      value: '3,400+',
      label: 'Resumes Created',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      icon: TrendingUp,
      value: '73%',
      label: 'Interview Rate',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: Star,
      value: '4.6/5',
      label: 'User Rating',
      color: 'from-amber-500 to-orange-400'
    }
  ];

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black gradient-text mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium text-xs sm:text-base">
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
