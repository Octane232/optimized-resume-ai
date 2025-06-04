
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
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      company: 'StartupXYZ',
      content: 'The ATS optimization really works! I went from getting no responses to multiple interview requests. The templates are clean and professional.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Project Manager',
      company: 'Global Industries',
      content: 'I loved how easy it was to customize my resume for different job applications. The AI suggestions helped me highlight the right skills.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of professionals who landed their dream jobs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
