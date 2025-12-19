// Admin API Service - Handles all admin-related API calls
const API_BASE_URL = 'http://localhost:4000/api';

interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: {
    adminId: string;
    email: string;
    fullName: string;
    role: string;
    state?: string;
    district?: string;
    block?: string;
  };
}

interface AdminInfoResponse {
  success: boolean;
  data: {
    _id: string;
    adminId: string;
    email: string;
    fullName: string;
    role: string;
    active: boolean;
    state?: string;
    district?: string;
    block?: string;
    meta?: {
      state?: string;
      district?: string;
      block?: string;
    };
  };
}

interface DashboardStatsResponse {
  success: boolean;
  data: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
    pendingByLevel?: {
      block?: number;
      district?: number;
      state?: number;
    };
  };
}

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

interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: Application[];
}

interface ApplicationResponse {
  success: boolean;
  data: Application;
}

interface ApprovalResponse {
  success: boolean;
  message: string;
  data: Application;
}

// Admin Authentication
export const adminLogin = async (email: string, password: string): Promise<AdminLoginResponse> => {
  console.log('🔐 Calling admin login API:', `${API_BASE_URL}/admin/login`);
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  console.log('📡 Admin login response status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    console.error('❌ Admin login error:', error);
    throw new Error(error.message || 'Login failed');
  }

  const result = await response.json();
  console.log('✅ Admin login successful:', result);
  
  // Store token in localStorage
  if (result.data?.token) {
    localStorage.setItem('adminToken', result.data.token);
    localStorage.setItem('adminData', JSON.stringify(result.data.admin));
  }
  
  return result;
};

// Get current admin info
export const getAdminInfo = async (): Promise<AdminInfoResponse> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to get admin info');
  }

  return response.json();
};

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get dashboard stats');
  }

  return response.json();
};

// Get applications (filtered by admin role and location)
export const getApplications = async (): Promise<ApplicationsResponse> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/applications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get applications');
  }

  return response.json();
};

// Get single application by ID
export const getApplicationById = async (applicationId: string): Promise<ApplicationResponse> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get application');
  }

  return response.json();
};

// Approve application
export const approveApplication = async (
  applicationId: string, 
  remarks?: string
): Promise<ApprovalResponse> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ remarks: remarks || '' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to approve application');
  }

  return response.json();
};

// Reject application
export const rejectApplication = async (
  applicationId: string, 
  reason: string
): Promise<ApprovalResponse> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/reject`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reject application');
  }

  return response.json();
};

// Get application statistics
export const getApplicationStats = async (): Promise<any> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/applications/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get application stats');
  }

  return response.json();
};

// Get members (filtered by admin role and location)
export const getMembers = async (): Promise<any> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No admin token found');
  }

  const response = await fetch(`${API_BASE_URL}/admin/members`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get members');
  }

  return response.json();
};

// Logout admin
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

// Check if admin is logged in
export const isAdminLoggedIn = (): boolean => {
  return !!localStorage.getItem('adminToken');
};

// Get stored admin data
export const getStoredAdminData = () => {
  const data = localStorage.getItem('adminData');
  return data ? JSON.parse(data) : null;
};
