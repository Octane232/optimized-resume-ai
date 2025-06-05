
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Building, Clock, Bookmark, ExternalLink } from 'lucide-react';

const JobFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$120k - $180k',
      posted: '2 days ago',
      description: 'Looking for an experienced software engineer to join our growing team...',
      saved: false
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      type: 'Hybrid',
      salary: '$100k - $150k',
      posted: '1 week ago',
      description: 'Seeking a strategic product manager to drive our product roadmap...',
      saved: true
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Austin, TX',
      type: 'On-site',
      salary: '$80k - $120k',
      posted: '3 days ago',
      description: 'Join our creative team to design user experiences that delight...',
      saved: false
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Finder</h1>
        <p className="text-slate-600 dark:text-slate-400">Discover opportunities that match your skills and preferences</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Job title or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search Jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-sm mb-3">
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
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-3">{job.description}</p>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {job.salary}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-6">
                  <Button variant="outline" size="sm">
                    <Bookmark className={`w-4 h-4 mr-1 ${job.saved ? 'fill-current' : ''}`} />
                    {job.saved ? 'Saved' : 'Save'}
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="w-4 h-4 mr-1" />
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
