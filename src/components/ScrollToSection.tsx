import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScrollToSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sectionMap: { [key: string]: string } = {
      '/features': '#features',
      '/pricing': '#pricing',
      '/enterprise': '#enterprise',
      '/resources': '#resources'
    };

    const hash = sectionMap[location.pathname];
    
    if (hash) {
      // Update URL to include hash
      navigate(`/${hash}`, { replace: true });
      
      // Scroll to section
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname, navigate]);

  return null;
};

export default ScrollToSection;
