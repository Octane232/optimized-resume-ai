import React from 'react';
import vaylanceMark from '@/assets/vaylance-mark.png';

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
  <img
    src={vaylanceMark}
    alt="Vaylance logo"
    width={width}
    height={height}
    className={className}
    draggable={false}
  />
);

export default VaylanceLogo;
