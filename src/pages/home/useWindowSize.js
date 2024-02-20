import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth < 1233);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isPhone;
};
