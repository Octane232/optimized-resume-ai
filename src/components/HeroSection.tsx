
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden transition-colors duration-300">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10 pt-16">
        <div className="max-w-5xl mx-auto">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-sm font-medium mb-8 text-blue-700 dark:text-blue-300">
            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
            Trusted by 50,000+ professionals worldwide
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
            AI-Powered Career
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Acceleration Platform
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Build ATS-optimized resumes with AI, get matched to perfect jobs, and discover 
            opportunities that match your skills while you focus on interview preparation.
          </p>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">3x</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">More Interview Invites</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">60%</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Faster Job Placement</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Job Discovery</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              Start 7-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 text-lg group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">AI</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Smart Resume Builder</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">ATS-optimized templates</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Job Matching</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Perfect role discovery</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">🎯</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Job Search</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Curated opportunities</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-sm font-bold">📊</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Track your progress</p>
            </div>
          </div>
          
          {/* Enterprise Logos */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm font-medium uppercase tracking-wider">Professionals from top companies trust us</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Google */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer" viewBox="0 0 272 92" fill="currentColor">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                <path d="M225 3v65h-9.5V3h9.5z"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
              </svg>
              
              {/* Microsoft */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer" viewBox="0 0 108 23" fill="currentColor">
                <path d="M44.836 4.6v13.8h-2.4V7.583L38.119 18.4h-1.588L32.142 7.583V18.4h-2.4V4.6h2.4l4.704 11.976L41.548 4.6h3.288zm8.064 0c2.808 0 4.704 1.896 4.704 4.68v4.44c0 2.784-1.896 4.68-4.704 4.68s-4.704-1.896-4.704-4.68V9.28c0-2.784 1.896-4.68 4.704-4.68zm0 2.256c-1.32 0-2.304.984-2.304 2.424v4.44c0 1.44.984 2.424 2.304 2.424s2.304-.984 2.304-2.424V9.28c0-1.44-.984-2.424-2.304-2.424zm10.8-2.256c2.808 0 4.704 1.896 4.704 4.68v4.44c0 2.784-1.896 4.68-4.704 4.68s-4.704-1.896-4.704-4.68V9.28c0-2.784 1.896-4.68 4.704-4.68zm0 2.256c-1.32 0-2.304.984-2.304 2.424v4.44c0 1.44.984 2.424 2.304 2.424s2.304-.984 2.304-2.424V9.28c0-1.44-.984-2.424-2.304-2.424zm13.2-2.256v13.8h-2.4v-1.944c-.6 1.32-1.968 2.184-3.768 2.184-2.808 0-4.704-1.896-4.704-4.68V9.28c0-2.784 1.896-4.68 4.704-4.68 1.8 0 3.168.864 3.768 2.184V4.6h2.4zm-3.528 2.016c-1.32 0-2.304.984-2.304 2.424v4.44c0 1.44.984 2.424 2.304 2.424s2.304-.984 2.304-2.424V9.04c0-1.44-.984-2.424-2.304-2.424zm10.416-2.016v2.256h-3.048V18.4h-2.4V6.856h-3.048V4.6h8.496zm13.008 0v13.8h-2.4v-1.944c-.6 1.32-1.968 2.184-3.768 2.184-2.808 0-4.704-1.896-4.704-4.68V9.28c0-2.784 1.896-4.68 4.704-4.68 1.8 0 3.168.864 3.768 2.184V4.6h2.4zm-3.528 2.016c-1.32 0-2.304.984-2.304 2.424v4.44c0 1.44.984 2.424 2.304 2.424s2.304-.984 2.304-2.424V9.04c0-1.44-.984-2.424-2.304-2.424z"/>
                <path d="M0 0h10.8v10.8H0V0zm12.6 0h10.8v10.8H12.6V0zM0 12.6h10.8v10.8H0V12.6zm12.6 0h10.8v10.8H12.6V12.6z"/>
              </svg>
              
              {/* Apple */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer" viewBox="0 0 814 1000" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-156.4 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 65.6 0 120.5 43.9 162.7 43.9 40.8 0 103.9-47.8 181.2-47.8 29.6 0 137.6 2.6 196.8 99.2v.1zm-144.4-234.3c35.4-43.4 65.1-104.7 65.1-165.2 0-8.7-.7-17.3-1.9-25.1-62.2 2.5-136.6 41.4-181.2 93.6-35.5 42.4-74 87.9-74 149.6 0 8.1.8 16.9 1.4 19.7 2.2.2 6.2.3 10.2.3 55.7-.1 126.8-37.6 180.4-72.9z"/>
              </svg>
              
              {/* Amazon */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer" viewBox="0 0 603 182" fill="currentColor">
                <path d="M374.7 92.3c-27.5 20.3-67.4 31.1-101.8 31.1-48.2 0-91.7-17.8-124.6-47.4-.9-.8-.1-1.9 1-1.3 12.2 7.1 27.3 13.5 42.9 18.2 15.6 4.7 32.7 7.1 50.1 7.1 28.4 0 59.6-5.9 88.4-18 1.4-.6 2.6.9 1.2 2.1l-.2.2zm11.3-12.9c-3.5-4.5-23.2-2.1-32.1-1.1-2.7.3-3.1-2-.7-3.7 15.7-11 41.4-7.8 44.4-4.1 3 3.7-.8 29.6-15.6 42-.7.6-1.4.3-1.1-.5 3.3-8.3 10.7-26.8 7.2-31.3l-2.1-1.3zm-100.8 55.2V46.9c0-2.3-1.7-3.8-3.8-3.8h-17.1c-2.1 0-3.9 1.6-3.9 3.8v14.7h-.3c-2.6-13.9-13.4-20.9-25.2-20.9-12 0-24.5 4.4-32.4 17.2-6.8 10.9-8.1 29.1-8.1 42.6 0 14 1.6 30.5 8.4 42.2 6.3 10.9 17.3 17.2 29.4 17.2 11.2 0 21.5-4.6 28.1-18.4h.3v15.3c0 2.3 1.8 3.8 3.9 3.8h17.1c2.1 0 3.8-1.5 3.8-3.8l-.2-.1zm-23.2-40.8c0-11.9.5-21.8-4.8-32.3-4.2-8.4-11-13.5-19.8-13.5-7.8 0-16.3 5.1-21.2 13.5-6.2 10.5-7 20.4-7 32.3 0 11.9-.8 21.8 6.7 32.3 5.1 8.4 13.4 13.5 21.5 13.5 8.6 0 15.6-5.1 19.8-13.5 5.3-10.5 4.8-20.4 4.8-32.3zm211.2 40.8V46.9c0-2.3-1.7-3.8-3.8-3.8h-17.1c-2.1 0-3.9 1.6-3.9 3.8v14.7h-.3c-2.6-13.9-13.4-20.9-25.2-20.9-12 0-24.5 4.4-32.4 17.2-6.8 10.9-8.1 29.1-8.1 42.6 0 14 1.6 30.5 8.4 42.2 6.3 10.9 17.3 17.2 29.4 17.2 11.2 0 21.5-4.6 28.1-18.4h.3v15.3c0 2.3 1.8 3.8 3.9 3.8h17.1c2.1 0 3.8-1.5 3.8-3.8l-.2-.1zm-23.2-40.8c0-11.9.5-21.8-4.8-32.3-4.2-8.4-11-13.5-19.8-13.5-7.8 0-16.3 5.1-21.2 13.5-6.2 10.5-7 20.4-7 32.3 0 11.9-.8 21.8 6.7 32.3 5.1 8.4 13.4 13.5 21.5 13.5 8.6 0 15.6-5.1 19.8-13.5 5.3-10.5 4.8-20.4 4.8-32.3zm-124.1 48.3c-1.7 0-3.4-.2-5.2-.8-1.8-.6-3.4-1.5-4.6-3-1.2-1.5-1.8-3.6-1.8-6.1 0-3.6 1.4-6.4 4.1-8.4 2.7-2 6.2-3 10.5-3 3.6 0 7.2.5 10.5 1.5 3.3 1 6.2 2.4 8.7 4.2v-5.8c0-4.2-1.1-7.4-3.4-9.6-2.3-2.2-5.7-3.3-10.2-3.3-6.8 0-13.4 2.1-19.7 6.2-1.2.8-2.7.1-2.7-1.3v-10.3c0-1.2.6-2.3 1.6-2.9 5.1-3.1 11.4-5.5 18.9-7.2 7.5-1.7 15.2-2.5 23.1-2.5 14.8 0 25.7 3.8 32.6 11.5 6.9 7.7 10.4 18.6 10.4 32.7v43.7c0 2.3-1.8 3.8-3.9 3.8h-16.2c-2 0-3.7-1.4-3.9-3.4v-9.8c-3.1 4.9-7.4 8.7-12.9 11.4-5.5 2.7-11.9 4.1-19.2 4.1l.2-.2zm7.8-16.9c6.2 0 11.4-2.1 15.6-6.4 4.2-4.3 6.3-9.7 6.3-16.2v-6.5c-2.1-1.4-4.6-2.6-7.4-3.6-2.8-1-5.8-1.5-9-1.5-5.7 0-10.1 1.2-13.2 3.7-3.1 2.5-4.6 6-4.6 10.5 0 4.2 1.4 7.4 4.2 9.6 2.8 2.2 6.4 3.3 11.2 3.3l-3.1 6.1zm105.9 16.9c-2.3 0-3.9-1.8-3.9-4.1V46.9c0-2.3 1.6-4.1 3.9-4.1h16.5c2.3 0 3.9 1.8 3.9 4.1v87.6c0 2.3-1.6 4.1-3.9 4.1h-16.5zm-8.8-111.2c0-7.8 6.3-14.1 14.1-14.1s14.1 6.3 14.1 14.1-6.3 14.1-14.1 14.1-14.1-6.3-14.1-14.1zm-86.5 111.2c-2.3 0-3.9-1.8-3.9-4.1V46.9c0-2.3 1.6-4.1 3.9-4.1h16.5c2.3 0 3.9 1.8 3.9 4.1v87.6c0 2.3-1.6 4.1-3.9 4.1h-16.5zm-8.8-111.2c0-7.8 6.3-14.1 14.1-14.1s14.1 6.3 14.1 14.1-6.3 14.1-14.1 14.1-14.1-6.3-14.1-14.1z"/>
                <path d="M566.5 156.1c-41.2 30.4-101 46.6-152.2 46.6-72 0-137-26.6-186.1-70.9-3.9-3.5-.4-8.3 4.3-5.6 53.9 31.4 120.4 50.3 189.2 50.3 46.4 0 97.4-9.6 144.4-29.5 7-3 13 4.6 6.1 9.1h-5.7z"/>
              </svg>
              
              {/* Meta */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H230.6V411.9h118.7v381.8zm-59.3-434.1c-38.1 0-69.1-30.9-69.1-69.1s30.9-69.1 69.1-69.1 69.1 30.9 69.1 69.1-30.9 69.1-69.1 69.1zm503.7 434.1H675.1V608.7c0-44.3-.8-101.2-61.7-101.2-61.7 0-71.2 48.2-71.2 98v188.2H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7 120.2 0 142.3 79.1 142.3 181.9v209.4z"/>
              </svg>
              
              {/* Netflix */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer" viewBox="0 0 1024 276" fill="currentColor">
                <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h65.389l40.802 109.156 40.832-109.156h65.389v276.742c-14.02-2.13-27.726-4.27-41.809-6.14v-151.073l-49.458 144.856zm208.013 9.054c-7.677 3.276-15.416 5.676-23.881 7.677 0-5.946.301-12.351.301-19.458v-219.998c0-37.216-16.533-58.148-50.034-58.148-33.441 0-49.975 20.932-49.975 58.148v219.998c0 7.107.331 13.512.331 19.458-8.405-2.001-16.204-4.401-23.881-7.677v-250.786c21.234-4.853 43.559-8.405 65.389-12.351v30.027c14.564-22.656 33.471-39.457 62.25-39.457 49.549 0 82.23 35.713 82.23 92.4v179.965c0 7.107.331 13.512.331 19.458zm219.73 2.162c-7.677 1.891-15.416 3.752-23.551 5.553v-14.565c-16.233 11.459-36.017 21.234-58.608 21.234-50.034 0-82.23-35.743-82.23-92.4v-142.085c0-56.627 32.196-92.4 82.23-92.4 22.591 0 42.375 9.775 58.608 21.234v-30.057c21.234-4.853 43.529-8.405 65.359-12.351v250.756c0 7.107.331 13.512.331 19.458-8.435-2.001-16.204-4.401-23.881-7.677 0-5.946.301-12.351.301-19.458v-14.565l-18.559 14.421zm-23.551-127.52v-142.085c-14.594-11.459-31.079-18.869-49.548-18.869-33.471 0-49.975 20.932-49.975 58.148v142.085c0 37.216 16.504 58.148 49.975 58.148 18.469 0 34.954-7.41 49.548-18.869v-78.558zm219.73 105.107c-7.677 3.276-15.416 5.676-23.881 7.677 0-5.946.301-12.351.301-19.458v-250.756c21.234-4.853 43.529-8.405 65.359-12.351v219.998c0 7.107.331 13.512.331 19.458-8.405-2.001-16.204-4.401-23.881-7.677 0-5.946.301-12.351.301-19.458v-219.998l-18.53 62.25zm219.73-127.52v142.085c0 37.216-16.504 58.148-49.975 58.148-18.469 0-34.954-7.41-49.548-18.869v78.558c0 7.107.331 13.512.331 19.458-8.405-2.001-16.204-4.401-23.881-7.677 0-5.946.301-12.351.301-19.458v-250.756c21.234-4.853 43.529-8.405 65.359-12.351v30.057c16.233-11.459 36.017-21.234 58.608-21.234 50.034 0 82.23 35.743 82.23 92.4v142.085c0 56.627-32.196 92.4-82.23 92.4-22.591 0-42.375-9.775-58.608-21.234 14.594 11.459 31.079 18.869 49.548 18.869 33.471 0 49.975-20.932 49.975-58.148v-142.085c0-37.216-16.504-58.148-49.975-58.148z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;
