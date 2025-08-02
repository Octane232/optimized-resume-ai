
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager', 
      company: 'TechCorp',
      content: 'AI Resume Pro helped me land my dream job! The AI-generated resume was perfectly tailored to the position, and I got 3 interviews within a week.',
      rating: 5,
      initials: 'SJ',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      company: 'StartupXYZ', 
      content: 'The ATS optimization really works! I went from getting no responses to multiple interview requests. The templates are clean and professional.',
      rating: 5,
      initials: 'MC',
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Project Manager',
      company: 'Global Industries',
      content: 'I loved how easy it was to customize my resume for different job applications. The AI suggestions helped me highlight the right skills.',
      rating: 5,
      initials: 'ER',
      bgColor: 'bg-emerald-500'
    },
    {
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Analytics Pro',
      content: 'The resume suggestions were spot-on. I received 5 interview calls in 2 weeks. The platform is intuitive and the results speak for themselves.',
      rating: 5,
      initials: 'DK',
      bgColor: 'bg-orange-500'
    },
    {
      name: 'Lisa Park',
      role: 'UX Designer',
      company: 'Design Studio',
      content: 'Finally, a resume builder that understands design! The templates are modern and helped me showcase my portfolio perfectly.',
      rating: 5,
      initials: 'LP',
      bgColor: 'bg-pink-500'
    },
    {
      name: 'James Wilson',
      role: 'Sales Director',
      company: 'Growth Inc',
      content: 'Switched from my old resume and saw immediate results. The AI suggestions for sales metrics were incredibly helpful.',
      rating: 5,
      initials: 'JW',
      bgColor: 'bg-indigo-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Real results from real people
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of professionals who accelerated their careers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-card hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-full px-6 py-3 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold">S</div>
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold">M</div>
              <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold">E</div>
              <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold">+</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">250,000+</span> successful resume builders
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
