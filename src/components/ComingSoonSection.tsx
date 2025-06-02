
import React from 'react';
import { Linkedin } from 'lucide-react';

const ComingSoonSection = () => {
  const platforms = [
    { name: 'LinkedIn', logo: Linkedin },
    { name: 'Indeed', logo: null },
    { name: 'Glassdoor', logo: null },
    { name: 'Monster', logo: null },
    { name: 'ZipRecruiter', logo: null }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-navy-600 to-navy-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center text-white">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-semibold">Coming Soon</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apply to Jobs with One Click
          </h2>
          
          <p className="text-xl text-navy-100 max-w-2xl mx-auto mb-8">
            Soon you'll be able to apply directly to thousands of jobs across all major platforms 
            with your AI-optimized resume.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {platforms.map((platform, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {platform.logo && <platform.logo className="h-5 w-5" />}
                <span className="font-medium">{platform.name}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Get notified when it's ready!</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-navy-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
