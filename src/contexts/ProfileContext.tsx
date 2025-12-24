import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProfileContextType {
  profileCompletion: number;
  formsCompleted: string[];
  totalFormsRequired: number;
  memberType: string;
  isFullyCompleted: boolean;
  upcomingEventsCount: number;
  unreadHelpMessages: number;
  refreshProfile: () => void;
  refreshEvents: () => void;
  refreshHelp: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [formsCompleted, setFormsCompleted] = useState<string[]>([]);
  const [totalFormsRequired, setTotalFormsRequired] = useState(4);
  const [memberType, setMemberType] = useState('Standard');
  const [isFullyCompleted, setIsFullyCompleted] = useState(false);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [unreadHelpMessages, setUnreadHelpMessages] = useState(0);

  const loadProfileCompletion = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const completed: string[] = [];
      let isDoingBusiness = true;
      let totalForms = 4;

      // Check Personal Form
      const personalRes = await fetch('http://localhost:4000/api/personal-form', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (personalRes.ok) {
        const data = await personalRes.json();
        if (data.data && data.data.name) {
          completed.push('Personal Details');
        }
      }

      // Check Business Form
      const businessRes = await fetch('http://localhost:4000/api/business-form', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (businessRes.ok) {
        const data = await businessRes.json();
        if (data.data) {
          completed.push('Business Details');
          isDoingBusiness = data.data.doingBusiness === 'yes';
          if (!isDoingBusiness) {
            totalForms = 3;
          }
        }
      }

      // Check Financial Form (only for business members)
      if (isDoingBusiness) {
        const financialRes = await fetch('http://localhost:4000/api/financial-form', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (financialRes.ok) {
          const data = await financialRes.json();
          if (data.data && data.data.pan) {
            completed.push('Financial Details');
          }
        }
      }

      // Check Declaration Form
      const declarationRes = await fetch('http://localhost:4000/api/declaration-form', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (declarationRes.ok) {
        const data = await declarationRes.json();
        if (data.data && data.data.declarationAccepted) {
          completed.push('Declaration');
        }
      }

      const percentage = Math.round((completed.length / totalForms) * 100);
      const fullyCompleted = percentage === 100;
      
      setProfileCompletion(percentage);
      setFormsCompleted(completed);
      setTotalFormsRequired(totalForms);
      setMemberType(isDoingBusiness ? 'Business' : 'Standard');
      setIsFullyCompleted(fullyCompleted);
      
      localStorage.setItem('profileCompletion', percentage.toString());
      
      console.log('ProfileContext updated:', {
        percentage,
        completed: completed.length,
        totalForms,
        isFullyCompleted: fullyCompleted
      });
    } catch (error) {
      console.error('Error loading profile completion:', error);
    }
  };

  const loadUpcomingEvents = () => {
    // Count upcoming events (mock data - can be replaced with API call)
    const today = new Date();
    const mockEvents = [
      { date: '2025-12-25' },
      { date: '2025-12-28' },
      { date: '2026-01-05' },
    ];
    
    const upcoming = mockEvents.filter(event => new Date(event.date) > today);
    setUpcomingEventsCount(upcoming.length);
    localStorage.setItem('upcomingEventsCount', upcoming.length.toString());
  };

  const loadHelpMessages = () => {
    // Count unread help messages (mock - can be replaced with API call)
    const unread = parseInt(localStorage.getItem('unreadHelpMessages') || '0');
    setUnreadHelpMessages(unread);
  };

  useEffect(() => {
    loadProfileCompletion();
    loadUpcomingEvents();
    loadHelpMessages();

    // Listen for updates
    const handleProfileUpdate = () => loadProfileCompletion();
    const handleEventsUpdate = () => loadUpcomingEvents();
    const handleHelpUpdate = () => loadHelpMessages();

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('formSubmitted', handleProfileUpdate);
    window.addEventListener('eventsUpdated', handleEventsUpdate);
    window.addEventListener('helpUpdated', handleHelpUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('formSubmitted', handleProfileUpdate);
      window.removeEventListener('eventsUpdated', handleEventsUpdate);
      window.removeEventListener('helpUpdated', handleHelpUpdate);
    };
  }, []);

  const value: ProfileContextType = {
    profileCompletion,
    formsCompleted,
    totalFormsRequired,
    memberType,
    isFullyCompleted,
    upcomingEventsCount,
    unreadHelpMessages,
    refreshProfile: loadProfileCompletion,
    refreshEvents: loadUpcomingEvents,
    refreshHelp: loadHelpMessages,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
