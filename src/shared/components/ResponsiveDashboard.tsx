import React, { useEffect, useState } from 'react';
import MemberDashboard from '@/pages/member/Dashboard';
import MobileDashboard from '@/pages/member/MobileDashboard';

const ResponsiveDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Consider mobile if screen width is less than 768px
    };

    // Check on initial load
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div>
      {isMobile ? <MobileDashboard /> : <MemberDashboard />}
    </div>
  );
};

export default ResponsiveDashboard;