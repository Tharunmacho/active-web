import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaUser, FaClipboardList, FaCertificate, FaQuestionCircle, FaCalendarAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function MemberSidebar({ isOpen, onClose }: Props) {
    const location = useLocation();
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from backend
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                // Fallback to localStorage if no token
                const storedUserName = localStorage.getItem("userName");
                if (storedUserName) {
                    setUserName(storedUserName);
                }
                return;
            }

            try {
                const response = await fetch("http://localhost:4000/api/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setUserName(result.data.fullName || "");
                        // Update localStorage
                        localStorage.setItem("userName", result.data.fullName || "");
                    }
                } else {
                    // Fallback to localStorage
                    const storedUserName = localStorage.getItem("userName");
                    if (storedUserName) {
                        setUserName(storedUserName);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Fallback to localStorage
                const storedUserName = localStorage.getItem("userName");
                if (storedUserName) {
                    setUserName(storedUserName);
                }
            }
        };

        fetchUserData();
    }, []);

    const nav = [
        { to: '/payment/member-dashboard', label: 'Dashboard', icon: <FaHome /> },
        { to: '/explore', label: 'Explore', icon: <FaSearch /> },
        { to: '/notifications', label: 'Notifications', icon: <FaBell /> },
        { to: '/member/profile', label: 'My Profile', icon: <FaUser /> },
        { to: '/member/certificate', label: 'Certificate', icon: <FaCertificate /> },
        { to: '/member/help', label: 'Help', icon: <FaQuestionCircle /> },
        { to: '/member/events', label: 'Upcoming Events', icon: <FaCalendarAlt /> },
    ];

    const handleLogout = () => {
        // clear session and user info
        localStorage.removeItem("userName");
        localStorage.removeItem("memberId");
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
        onClose();
    };

    // Sidebar content component (reused for both mobile and desktop)
    const SidebarContent = () => (
        <>
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    {/* Close button only visible on mobile */}
                    <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                        <FaTimes className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face" className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                            {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "SD"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{userName || "Member"}</div>
                        <div className="text-sm text-muted-foreground">TechCorp Solution</div>
                    </div>
                </div>
            </div>

            <nav className="p-2 overflow-y-auto flex-1">
                {nav.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${active
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onClick={onClose}
                        >
                            <span className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2 border-t">
                <Button variant="ghost" onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-3">
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>Log out</span>
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop/Tablet: Permanent Sidebar - Always visible on md screens and above */}
            <div className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-white border-r h-screen sticky top-0">
                <SidebarContent />
            </div>

            {/* Mobile: Slide-out Menu - Only on small screens */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
                    <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white flex flex-col">
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
}
