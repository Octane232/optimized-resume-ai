import React from 'react';
import { motion } from 'framer-motion';
import { Database, Sparkles, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface VaultDataIndicatorProps {
  hasResume: boolean;
  skillsCount: number;
  certificationsCount: number;
  projectsCount: number;
  isLoading?: boolean;
  onNavigateToVault?: () => void;
}

const VaultDataIndicator: React.FC<VaultDataIndicatorProps> = ({
  hasResume,
  skillsCount,
  certificationsCount,
  projectsCount,
  isLoading = false,
  onNavigateToVault
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const totalItems = skillsCount + certificationsCount + projectsCount;
  const dataQuality = totalItems >= 10 ? 'excellent' : totalItems >= 5 ? 'good' : totalItems > 0 ? 'basic' : 'empty';
  
  const qualityConfig = {
    excellent: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Excellent Data', icon: CheckCircle2 },
    good: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Good Data', icon: CheckCircle2 },
    basic: { color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Basic Data', icon: AlertCircle },
    empty: { color: 'text-muted-foreground', bg: 'bg-muted/50', label: 'No Data', icon: AlertCircle }
  };
  
  const config = qualityConfig[dataQuality];
  const QualityIcon = config.icon;

  if (isLoading) {
    return (
      <Card className="border-border bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}
              >
                <Database className={`w-5 h-5 ${config.color}`} />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">Analysis Data Source</h3>
                  <Badge variant="outline" className={`text-xs ${config.color} border-current`}>
                    <QualityIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  AI insights are powered by your Master Vault data
                </p>
              </div>
            </div>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              {/* Data Sources Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <DataSourceItem 
                  label="Resume" 
                  value={hasResume ? 'Connected' : 'Not uploaded'} 
                  isActive={hasResume}
                />
                <DataSourceItem 
                  label="Skills" 
                  value={`${skillsCount} skills`} 
                  isActive={skillsCount > 0}
                />
                <DataSourceItem 
                  label="Certifications" 
                  value={`${certificationsCount} certs`} 
                  isActive={certificationsCount > 0}
                />
                <DataSourceItem 
                  label="Projects" 
                  value={`${projectsCount} projects`} 
                  isActive={projectsCount > 0}
                />
              </div>

              {/* How It Works */}
              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">How insights are generated:</span>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Your resume content is analyzed for structure and keywords</li>
                      <li>Vault skills, certifications, and projects are combined for a complete profile</li>
                      <li>AI compares your profile against job requirements for match scoring</li>
                      <li>More Vault data = more accurate and personalized insights</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA to add more data */}
              {dataQuality !== 'excellent' && (
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Improve your insights:</span>
                    {' '}Add more skills, certifications, and projects to your Vault
                  </div>
                  {onNavigateToVault && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onNavigateToVault}
                      className="text-xs h-7"
                    >
                      Open Vault
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

const DataSourceItem: React.FC<{ label: string; value: string; isActive: boolean }> = ({ 
  label, 
  value, 
  isActive 
}) => (
  <div className={`p-2 rounded-lg border ${isActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'}`}>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
      {value}
    </div>
  </div>
);

export default VaultDataIndicator;
