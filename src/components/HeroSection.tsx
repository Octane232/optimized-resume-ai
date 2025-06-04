
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10 pt-16">
        <div className="max-w-5xl mx-auto">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium mb-8 text-blue-700">
            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
            Trusted by 50,000+ professionals worldwide
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            AI-Powered Career
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Acceleration Platform
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Build ATS-optimized resumes with AI, get matched to perfect jobs, and discover 
            opportunities that match your skills while you focus on interview preparation.
          </p>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3x</div>
              <p className="text-gray-600 text-sm">More Interview Invites</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
              <p className="text-gray-600 text-sm">Faster Job Placement</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600 text-sm">Job Discovery</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              Start 7-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">AI</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Smart Resume Builder</h3>
              <p className="text-xs text-gray-600">ATS-optimized templates</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Job Matching</h3>
              <p className="text-xs text-gray-600">Perfect role discovery</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">🎯</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Job Search</h3>
              <p className="text-xs text-gray-600">Curated opportunities</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">📊</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Analytics</h3>
              <p className="text-xs text-gray-600">Track your progress</p>
            </div>
          </div>
          
          {/* Enterprise Logos */}
          <div className="text-center">
            <p className="text-gray-500 mb-6 text-sm font-medium uppercase tracking-wider">Professionals from top companies trust us</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Google */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              
              {/* Microsoft */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              
              {/* Apple */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              
              {/* Amazon */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.548.41-3.156.615-4.83.615-3.264 0-6.306-.665-9.116-1.994-.292-.138-.49-.234-.604-.29-.226-.14-.31-.284-.174-.48zm21.968.255c-.317-.432-.816-.487-1.49-.16-.673.325-1.735.97-3.184 1.93-.85.56-1.607 1.027-2.267 1.407-.66.38-1.154.665-1.482.855-.328.19-.49.285-.49.285 0-.174.09-.29.27-.348.18-.058.45-.174.81-.348 1.71-.825 3.048-1.605 4.016-2.34.968-.735 1.486-1.26 1.555-1.575.07-.315-.078-.548-.738-.706zm-3.622-2.06c-.433-.432-.867-.648-1.3-.648-.433 0-.867.216-1.3.648-.433.432-.65.865-.65 1.298 0 .433.217.866.65 1.298.433.432.867.648 1.3.648.433 0 .867-.216 1.3-.648.433-.432.65-.865.65-1.298 0-.433-.217-.866-.65-1.298z"/>
              </svg>
              
              {/* Meta */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              
              {/* Netflix */}
              <svg className="h-8 w-auto text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm6.887 0v23.991c.066-.031 2.979-.398 2.979-.398V0zm6.549 0v24c.027-.006 2.979.398 2.979.398V0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;
