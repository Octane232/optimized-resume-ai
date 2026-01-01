import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface FixItItem {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'suggestion';
  fixed?: boolean;
}

interface FixItChecklistProps {
  items: FixItItem[];
  onFixItem?: (id: string) => void;
}

const FixItChecklist = ({ items, onFixItem }: FixItChecklistProps) => {
  const criticalItems = items.filter(i => i.severity === 'critical' && !i.fixed);
  const warningItems = items.filter(i => i.severity === 'warning' && !i.fixed);
  const suggestionItems = items.filter(i => i.severity === 'suggestion' && !i.fixed);
  const fixedItems = items.filter(i => i.fixed);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/20',
          icon: 'text-destructive',
          text: 'text-destructive'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          icon: 'text-amber-500',
          text: 'text-amber-500'
        };
      default:
        return {
          bg: 'bg-muted/50',
          border: 'border-border',
          icon: 'text-muted-foreground',
          text: 'text-foreground'
        };
    }
  };

  const renderItem = (item: FixItItem, index: number) => {
    const styles = getSeverityStyles(item.severity);
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`group flex items-start gap-3 p-3 rounded-lg border ${styles.bg} ${styles.border} ${
          item.fixed ? 'opacity-50' : ''
        } hover:bg-opacity-80 transition-all cursor-pointer`}
        onClick={() => !item.fixed && onFixItem?.(item.id)}
      >
        <div className="shrink-0 mt-0.5">
          {item.fixed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : item.severity === 'critical' ? (
            <AlertTriangle className={`w-4 h-4 ${styles.icon}`} />
          ) : (
            <Circle className={`w-4 h-4 ${styles.icon}`} />
          )}
        </div>
        <p className={`text-sm flex-1 ${item.fixed ? 'line-through text-muted-foreground' : styles.text}`}>
          {item.message}
        </p>
        {!item.fixed && (
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </motion.div>
    );
  };

  if (items.length === 0) {
    return null;
  }

  const hasIssues = criticalItems.length > 0 || warningItems.length > 0 || suggestionItems.length > 0;

  return (
    <div className="command-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Fix-It Checklist</h3>
        {fixedItems.length > 0 && (
          <span className="text-xs text-emerald-500 font-medium">
            {fixedItems.length}/{items.length} Fixed
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Critical errors first */}
        {criticalItems.map((item, i) => renderItem(item, i))}
        
        {/* Then warnings */}
        {warningItems.map((item, i) => renderItem(item, criticalItems.length + i))}
        
        {/* Then suggestions */}
        {suggestionItems.map((item, i) => renderItem(item, criticalItems.length + warningItems.length + i))}
        
        {/* Fixed items at bottom */}
        {fixedItems.map((item, i) => renderItem(item, criticalItems.length + warningItems.length + suggestionItems.length + i))}
      </div>

      {!hasIssues && fixedItems.length === items.length && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <p className="text-sm text-emerald-500 font-medium">All issues resolved!</p>
        </motion.div>
      )}
    </div>
  );
};

export default FixItChecklist;
