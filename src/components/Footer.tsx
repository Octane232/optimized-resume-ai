
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';
import logo from '@/assets/pitchsora-logo.png';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Resume Builder', href: '/resume-builder' },
        { label: 'Job Search', href: '/job-search' },
        { label: 'Templates', href: '/templates' },
        { label: 'AI Features', href: '/ai-features' },
        { label: 'Analytics', href: '/analytics' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'For Individuals', href: '/for-individuals' },
        { label: 'For Students', href: '/for-students' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Contact', href: '/contact' }
      ]
    }
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-20 max-w-7xl relative">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Pitchsora" className="h-36 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-base">
              The world's most advanced AI-powered career acceleration platform. 
              Build resumes, find jobs, and accelerate your career growth.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Linkedin, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Github, href: '#' },
                { Icon: Mail, href: '#' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i}
                  href={href} 
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold mb-6 text-white text-lg">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        to={link.href} 
                        className="text-gray-400 hover:text-white transition-all text-base hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => scrollToSection(link.href)}
                        className="text-gray-400 hover:text-white transition-all text-base hover:translate-x-1 text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl relative">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-8">
              <p className="text-gray-400 text-base font-medium">
                © 2024 AI Resume Pro. All rights reserved.
              </p>
              <div className="flex space-x-8 text-base">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-all hover:translate-y-[-2px]">Privacy Policy</Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-all hover:translate-y-[-2px]">Terms of Service</Link>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-all hover:translate-y-[-2px]">Cookie Policy</Link>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
              <span className="text-gray-300 text-sm font-semibold">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
