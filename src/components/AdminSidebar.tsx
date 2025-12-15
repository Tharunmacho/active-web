import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  className?: string;
};

export default function AdminSidebar({ className = '' }: Props) {
  const location = useLocation();
  const navigate = useNavigate();


  const role = (typeof window !== 'undefined' ? localStorage.getItem('role') : '') || '';
  const userName = (typeof window !== 'undefined' ? localStorage.getItem('userName') : '') || 'Admin';
  const roleLabel = role === 'block_admin' ? 'Block Admin' : role === 'district_admin' ? 'District Admin' : role === 'state_admin' ? 'State Admin' : role === 'super_admin' ? 'Super Admin' : 'Admin';
  const initials = role === 'block_admin' ? 'BA' : role === 'district_admin' ? 'DA' : role === 'state_admin' ? 'SA' : role === 'super_admin' ? 'SU' : (userName || 'A').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  const nav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
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
    <aside className={`bg-white h-full flex flex-col border-r ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-blue-100">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <div className="font-semibold">{userName}</div>
            <div className="text-sm text-muted-foreground">{roleLabel}</div>
          </div>
        </div>
      </div>

      <nav className="p-2 overflow-y-auto flex-1">
        {nav.map((item) => {
          // Check if current path starts with the nav item path for better matching
          const active = location.pathname === item.to ||
            (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-3 justify-start"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="hidden lg:inline">Log out</span>
        </Button>
      </div>
    </aside>
  );
}
