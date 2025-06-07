
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building, Clock, Bookmark, ExternalLink, Star, DollarSign, Users, Briefcase, Filter, Sparkles, TrendingUp } from 'lucide-react';

const JobFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      logo: '🚀',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$120k - $180k',
      salaryNum: 150000,
      posted: '2 days ago',
      description: 'Join our innovative team building next-generation cloud infrastructure. We\'re looking for passionate engineers who love solving complex problems.',
      tags: ['React', 'Node.js', 'AWS', 'TypeScript'],
      saved: false,
      featured: true,
      companySize: '100-500',
      rating: 4.8,
      applicants: 45,
      matchScore: 95
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      logo: '💡',
      location: 'New York, NY',
      type: 'Hybrid',
      salary: '$100k - $150k',
      salaryNum: 125000,
      posted: '1 week ago',
      description: 'Lead product strategy for our flagship AI platform. Drive product vision and collaborate with engineering teams to deliver exceptional user experiences.',
      tags: ['Product Strategy', 'AI/ML', 'Analytics', 'Agile'],
      saved: true,
      featured: false,
      companySize: '50-200',
      rating: 4.6,
      applicants: 28,
      matchScore: 88
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      logo: '🎨',
      location: 'Austin, TX',
      type: 'On-site',
      salary: '$80k - $120k',
      salaryNum: 100000,
      posted: '3 days ago',
      description: 'Create beautiful, intuitive user experiences for our mobile and web applications. Work closely with product and engineering teams.',
      tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      saved: false,
      featured: true,
      companySize: '20-50',
      rating: 4.9,
      applicants: 67,
      matchScore: 82
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'AI Dynamics',
      logo: '📊',
      location: 'Seattle, WA',
      type: 'Remote',
      salary: '$110k - $160k',
      salaryNum: 135000,
      posted: '5 days ago',
      description: 'Build machine learning models that power our recommendation engine. Work with petabytes of data to derive actionable insights.',
      tags: ['Python', 'TensorFlow', 'SQL', 'Machine Learning'],
      saved: false,
      featured: false,
      companySize: '200-1000',
      rating: 4.7,
      applicants: 34,
      matchScore: 91
    }
  ];

  const stats = [
    { label: 'Active Jobs', value: '2,847', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Companies', value: '456', icon: Building, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Avg. Salary', value: '$125k', icon: DollarSign, color: 'from-purple-500 to-purple-600' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
  ];

  const trendingSearches = ['React Developer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI-Powered Job Matching</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Discover opportunities that perfectly match your skills and career goals with our intelligent job matching system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Search Jobs</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Main Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Button className="h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={salaryRange} onValueChange={setSalaryRange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Salary Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50k">$0 - $50k</SelectItem>
                    <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                    <SelectItem value="150k+">$150k+</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Trending searches:</p>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-full"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recommended for You
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">AI-matched jobs</span>
          </div>
        </div>

        {jobs.map((job) => (
          <Card key={job.id} className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
            {job.featured && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-medium py-2 px-4 text-center">
                ⭐ Featured Job
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${
                          job.type === 'Remote' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : job.type === 'Hybrid'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                        }`}>
                          {job.type}
                        </Badge>
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          <Star className="w-3 h-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                            {job.matchScore}% match
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.companySize} employees
                      </div>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 px-3 py-1 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {job.rating}
                            </span>
                          </div>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {job.applicants} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl ${
                      job.saved ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : ''
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${job.saved ? 'fill-current text-blue-600' : ''}`} />
                    {job.saved ? 'Saved' : 'Save'}
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobFinder;
