
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
        { label: 'For Students', href: '/for-students' },
        { label: 'For Enterprises', href: '#enterprise' },
        { label: 'For Recruiters', href: '#resources' },
        { label: 'Integrations', href: '#resources' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#resources' },
        { label: 'Career Blog', href: '#resources' },
        { label: 'Resume Examples', href: '#resources' },
        { label: 'Interview Tips', href: '#resources' },
        { label: 'API Documentation', href: '#resources' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Careers', href: '#resources' },
        { label: 'Press Kit', href: '#resources' },
        { label: 'Contact', href: '/contact' },
        { label: 'Security', href: '#resources' }
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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Pitchsora" className="h-36 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              The world's most advanced AI-powered career acceleration platform. 
              Build resumes, find jobs, and accelerate your career growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        to={link.href} 
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => scrollToSection(link.href)}
                        className="text-gray-400 hover:text-white transition-colors text-sm text-left"
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
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 AI Resume Pro. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">SOC 2 Compliant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
