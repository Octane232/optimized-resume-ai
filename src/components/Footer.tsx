
import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Careers', href: '#careers' }
      ]
    },
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Templates', href: '#templates' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Integrations', href: '#integrations' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Status', href: '#status' }
      ]
    }
  ];

  const trustedLogos = [
    'Google', 'Microsoft', 'Amazon', 'LinkedIn', 'GitHub', 'Spotify'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trusted By Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <h3 className="text-center text-gray-400 text-sm font-semibold mb-6 uppercase tracking-wider">
            Trusted by professionals at
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {trustedLogos.map((logo, index) => (
              <div 
                key={index} 
                className="text-gray-400 font-semibold hover:text-white transition-colors cursor-pointer"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              AI Resume Pro
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Build professional, ATS-optimized resumes in minutes with the power of AI. 
              Land your dream job faster.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AI Resume Pro. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with ❤️ for job seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
