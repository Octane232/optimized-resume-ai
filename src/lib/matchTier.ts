export type MatchTier = 'strong' | 'moderate' | 'weak';

/** 3-tier match scale: strong 60%+, moderate 30-59%, weak under 30%. */
export const getMatchTier = (score: number): MatchTier =>
  score >= 60 ? 'strong' : score >= 30 ? 'moderate' : 'weak';

export const matchText: Record<MatchTier, string> = {
  strong: 'text-match-strong',
  moderate: 'text-match-moderate',
  weak: 'text-match-weak',
};

export const matchBadge: Record<MatchTier, string> = {
  strong: 'bg-match-strong/10 text-match-strong border-match-strong/25',
  moderate: 'bg-match-moderate/10 text-match-moderate border-match-moderate/25',
  weak: 'bg-match-weak/10 text-match-weak border-match-weak/25',
};

export const matchTextClass = (score: number) => matchText[getMatchTier(score)];
export const matchBadgeClass = (score: number) => matchBadge[getMatchTier(score)];
