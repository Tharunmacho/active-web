import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Props = {
  className?: string;
};

export default function AdminSidebar({ className = '' }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  

  const role = (typeof window !== 'undefined' ? localStorage.getItem('role') : '') || '';
  const userName = (typeof window !== 'undefined' ? localStorage.getItem('userName') : '') || 'Admin';
  const roleLabel = role === 'block_admin' ? 'Block Admin' : role === 'district_admin' ? 'District Admin' : role === 'state_admin' ? 'State Admin' : role === 'super_admin' ? 'Super Admin' : 'Member';
  const initials = role === 'block_admin' ? 'BA' : role === 'district_admin' ? 'DA' : role === 'state_admin' ? 'SA' : role === 'super_admin' ? 'SU' : (userName || 'A').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();

  const nav = [
    { to: '/admin/dashboard', label: 'Home', icon: <FaHome /> },
    { to: '/admin/approvals', label: 'Approvals', icon: <FaCheckCircle /> },
    { to: '/admin/members', label: 'Members', icon: <FaUsers /> },
    { to: '/admin/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    // Clear all local storage items related to login
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('memberId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminId');
    localStorage.removeItem('sessionStart');
    
    // Navigate to main login page
    navigate('/login');
  };

  return (
    <aside className={`bg-white h-full flex flex-col ${className}`}>
      <div className="p-2 md:p-4 flex-1 flex flex-col">
        <div className="hidden md:flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 md:w-12 md:h-12">
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <div className="font-semibold text-sm md:text-base">{userName}</div>
            <div className="text-xs md:text-sm text-muted-foreground">{roleLabel}</div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {nav.map((item) => {
            // Check if current path starts with the nav item path for better matching
            const active = location.pathname === item.to || 
                          (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to));
            return (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`flex items-center gap-3 px-2 py-2 md:px-3 md:py-2 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                <span className="text-sm hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Logout button below Settings */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 md:px-3 md:py-2 rounded-md text-red-600 hover:bg-red-50"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <FaSignOutAlt className="w-5 h-5" />
            </span>
            <span className="text-sm hidden lg:inline">Log out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
