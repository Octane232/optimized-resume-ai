import React from 'react';

interface VaylanceLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const VaylanceLogo: React.FC<VaylanceLogoProps> = ({ 
  width = 40, 
  height = 40,
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
    <rect width="48" height="48" rx="10" className="fill-vy-deep" />
    <path d="M9 11.5L21.4 36.5L25.6 27.9L17.5 11.5H9Z" className="fill-vy-text" />
    <path d="M19.2 11.5L27.8 28.8L36.4 11.5H28.2L23.8 20.5L19.2 11.5Z" className="fill-vy-teal" />
    <path d="M27.8 28.8L32 37L39.5 21.9H31.2L27.8 28.8Z" className="fill-vy-glow" />
    <circle cx="39" cy="10" r="3" className="fill-vy-glow" />
    <path d="M34.5 13.8L37.1 11.7" className="stroke-vy-glow" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default VaylanceLogo;
