import React from 'react';

interface VaylanceLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const VaylanceLogo: React.FC<VaylanceLogoProps> = ({ 
  width = 28, 
  height = 28,
  className = ''
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 48 48" 
    fill="none" 
    aria-hidden="true"
    className={className}
  >
    <rect width="48" height="48" rx="11" fill="#1d4ed8"/>
    <circle cx="22" cy="27" r="11" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="22" cy="27" r="6.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.6" fill="none"/>
    <circle cx="22" cy="27" r="2.6" fill="white"/>
    <line x1="29.5" y1="19.5" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="32.5" y1="13" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
    <line x1="36" y1="13" x2="36" y2="16.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
  </svg>
);

export default VaylanceLogo;
