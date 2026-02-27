import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: '1,200+', label: 'Job Seekers Helped' },
    { value: '3,400+', label: 'Resumes Optimized' },
    { value: '73%', label: 'Interview Callback Rate' },
    { value: '4.8/5', label: 'Average User Rating' },
  ];

  return (
    <section className="relative py-14 sm:py-16 overflow-hidden bg-background border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
