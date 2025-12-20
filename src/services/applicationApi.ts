// Member Application API Service
const API_BASE_URL = 'http://localhost:4000/api';

interface Application {
  _id: string;
  applicationId: string;
  userId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  state: string;
  district: string;
  block: string;
  memberType: string;
  status: string;
  approvals: {
    block: {
      adminId?: string;
      adminName?: string;
      status: string;
      remarks?: string;
      actionDate?: string;
    };
    district: {
      adminId?: string;
      adminName?: string;
      status: string;
      remarks?: string;
      actionDate?: string;
    };
    state: {
      adminId?: string;
      adminName?: string;
      status: string;
      remarks?: string;
      actionDate?: string;
    };
  };
  submittedAt: string;
  updatedAt: string;
}

// Get user's application status
export const getUserApplication = async (): Promise<Application | null> => {
  const token = localStorage.getItem('token');
  
  console.log('🔐 getUserApplication - Token exists:', !!token);
  
  if (!token) {
    console.log('❌ No token found in localStorage');
    return null;
  }

  try {
    // Try to fetch from backend first
    try {
      console.log('📡 Fetching from:', `${API_BASE_URL}/applications/my-application`);
      const response = await fetch(`${API_BASE_URL}/applications/my-application`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (response.status === 401) {
        console.log('❌ 401 Unauthorized - Token may be invalid');
        // Clear invalid token
        localStorage.removeItem('token');
        return null;
      }
      
      if (response.status === 404) {
        console.log('⚠️ 404 - No application found for this user');
        return null;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Application data received:', data);
        if (data.success && data.data) {
          return data.data;
        }
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.log('❌ API Error:', errorData);
      
    } catch (backendError) {
      console.log('❌ Backend error:', backendError);
    }

    // Fallback: Check localStorage for application submission
    const submissionData = localStorage.getItem('applicationSubmission');
    if (submissionData) {
      const submission = JSON.parse(submissionData);
      
      // Convert localStorage format to Application format
      return {
        _id: submission.applicationId || 'temp-id',
        applicationId: submission.applicationId,
        userId: localStorage.getItem('memberId') || '',
        memberName: submission.userName || localStorage.getItem('userName') || 'Member',
        memberEmail: localStorage.getItem('userEmail') || '',
        memberPhone: '',
        state: submission.state || 'Tamil Nadu',
        district: submission.district || 'Tiruvannamalai',
        block: submission.block || 'Thandrampet',
        memberType: submission.memberType || 'business',
        status: submission.status === 'under_review' ? 'pending_block_approval' : submission.status,
        approvals: {
          block: {
            status: 'pending',
            remarks: '',
          },
          district: {
            status: 'pending',
            remarks: '',
          },
          state: {
            status: 'pending',
            remarks: '',
          }
        },
        submittedAt: submission.submittedAt || new Date().toISOString(),
        updatedAt: submission.submittedAt || new Date().toISOString()
      } as Application;
    }

    // Also check 'applications' array format
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    if (apps.length > 0) {
      const sorted = [...apps].sort((a: any, b: any) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      return sorted[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user application:', error);
    return null;
  }
};

// Check if user has completed their profile
export const checkProfileCompletion = async (): Promise<{
  isComplete: boolean;
  completedForms: string[];
  totalFormsRequired: number;
  memberType: 'business' | 'aspirant';
}> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {
      isComplete: false,
      completedForms: [],
      totalFormsRequired: 4,
      memberType: 'business'
    };
  }

  try {
    const completed: string[] = [];
    let isDoingBusiness = true;
    let totalForms = 4;

    // Check Personal Form
    const personalRes = await fetch(`${API_BASE_URL}/personal-form`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (personalRes.ok) {
      const data = await personalRes.json();
      if (data.data && data.data.isLocked) {
        completed.push('Personal Details');
      }
    }

    // Check Business Form
    const businessRes = await fetch(`${API_BASE_URL}/business-form`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (businessRes.ok) {
      const data = await businessRes.json();
      if (data.data) {
        if (data.data.doingBusiness === 'no') {
          isDoingBusiness = false;
          totalForms = 3;
        }
        if (data.data.doingBusiness) {
          completed.push('Business Information');
        }
      }
    }

    // Check Financial Form (only if doing business)
    if (isDoingBusiness) {
      const financialRes = await fetch(`${API_BASE_URL}/financial-form`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (financialRes.ok) {
        const data = await financialRes.json();
        if (data.data && data.data.pan) {
          completed.push('Financial Details');
        }
      }
    }

    // Check Declaration Form
    const declarationRes = await fetch(`${API_BASE_URL}/declaration-form`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (declarationRes.ok) {
      const data = await declarationRes.json();
      if (data.data && data.data.declarationAccepted) {
        completed.push('Declaration');
      }
    }

    return {
      isComplete: completed.length === totalForms,
      completedForms: completed,
      totalFormsRequired: totalForms,
      memberType: isDoingBusiness ? 'business' : 'aspirant'
    };
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return {
      isComplete: false,
      completedForms: [],
      totalFormsRequired: 4,
      memberType: 'business'
    };
  }
};
