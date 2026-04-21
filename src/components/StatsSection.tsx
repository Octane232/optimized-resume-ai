import React from 'react';

const stats = [
  { value: '1,200+', label: 'Job seekers helped' },
  { value: '3,400+', label: 'Resumes optimized' },
  { value: '73%', label: 'Interview callback rate' },
  { value: '4.8/5', label: 'Average user rating' },
];

const StatsSection = () => {
  return (
    <section className="py-14 bg-background border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
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
