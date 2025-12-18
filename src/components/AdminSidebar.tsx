import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  className?: string;
  onClose?: () => void;
};

export default function AdminSidebar({ className = '', onClose }: Props) {
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
    <aside className={`h-full w-full flex flex-col bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-700 shadow-lg relative overflow-hidden ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full filter blur-3xl"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Logo/Brand Section */}
        <div className="p-4 md:p-6 border-b border-white/20">
          <div className="flex items-center justify-center">
            <img
              src="/logo_ACTIVian-removebg-preview.png"
              alt="ACTIVian Logo"
              className="h-10 md:h-12 lg:h-14 w-auto object-contain brightness-0 invert"
            />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 md:p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-white/30 shadow-lg flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face" className="object-cover" />
              <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm truncate">{userName}</div>
              <div className="text-xs text-blue-100 font-medium truncate">{roleLabel}</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 md:p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {nav.map((item) => {
              const active = location.pathname === item.to ||
                (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose?.()}
                  className={`flex flex-col md:flex-row items-center md:gap-3 px-3 py-3 md:px-4 rounded-xl transition-all duration-200 ${active
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                >
                  <span className={`w-6 h-6 md:w-5 md:h-5 mb-1 md:mb-0 ${active ? 'text-blue-600' : 'text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-xs md:text-sm text-center md:text-left">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 md:p-4 border-t border-white/20">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex flex-col md:flex-row items-center md:gap-3 text-white hover:bg-red-500/80 hover:text-white py-3 px-3 md:px-4 rounded-xl justify-center md:justify-start transition-all duration-200 backdrop-blur-sm"
          >
            <FaSignOutAlt className="w-5 h-5 mb-1 md:mb-0" />
            <span className="font-medium text-xs md:text-sm">Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
