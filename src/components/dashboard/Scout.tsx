import React from 'react';
import { Telescope, Search, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Scout: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Telescope className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scout</h1>
          <p className="text-sm text-muted-foreground">Discover curated job opportunities</p>
        </div>
      </div>

      {/* Search Bar Placeholder */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search jobs by title, company, or skills..." 
          className="pl-10 bg-muted/50"
          disabled
        />
      </div>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Jobs Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            Your personalized job feed is being curated. Fresh opportunities scraped from top sources will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scout;
