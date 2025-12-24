import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaUser, FaClipboardList, FaCertificate, FaQuestionCircle, FaCalendarAlt, FaSignOutAlt, FaTimes, FaBriefcase, FaCog, FaShoppingCart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useProfile } from '@/contexts/ProfileContext';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function MemberSidebar({ isOpen, onClose }: Props) {
    const location = useLocation();
    // Initialize state with localStorage values immediately to avoid showing default "Member"
    const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "");
    const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem("userProfilePhoto") || "");
    const [organizationName, setOrganizationName] = useState(() => localStorage.getItem("userOrganization") || "");
    const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem("paymentStatus") || "pending");
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { profileCompletion, upcomingEventsCount, unreadHelpMessages } = useProfile();
    const [cartCount, setCartCount] = useState(0);

    // Debug: Log whenever profilePhoto state changes
    useEffect(() => {
        console.log('🖼️ ProfilePhoto state updated:', profilePhoto ? `${profilePhoto.substring(0, 50)}... (${profilePhoto.length} bytes)` : 'empty');
    }, [profilePhoto]);

    // Update cart count from context
    useEffect(() => {
        setCartCount(getCartCount());
        
        // Listen for cart updates
        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [getCartCount]);

    // Refresh data from localStorage whenever location changes (no API calls)
    useEffect(() => {
        const name = localStorage.getItem('userName') || '';
        const email = localStorage.getItem('userEmail') || '';
        const photo = localStorage.getItem('userProfilePhoto') || '';
        const org = localStorage.getItem('userOrganization') || '';
        const status = localStorage.getItem('paymentStatus') || 'pending';
        
        setUserName(name);
        setUserEmail(email);
        setProfilePhoto(photo);
        setOrganizationName(org);
        setPaymentStatus(status);
    }, [location.pathname]);

    useEffect(() => {
        // Fetch user data from backend with caching
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

            // Check cache - only fetch if data is older than 2 minutes
            const lastFetch = localStorage.getItem('userDataLastFetch');
            const now = Date.now();
            const cacheTime = 2 * 60 * 1000; // 2 minutes
            
            if (lastFetch && (now - parseInt(lastFetch)) < cacheTime) {
                return; // Use cached data
            }

            localStorage.setItem('userDataLastFetch', now.toString());

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
                        setUserEmail(result.data.email || "");
                        // Only update photo if API has one, otherwise keep localStorage value
                        if (result.data.profilePhoto) {
                            console.log('📸 API returned photo, updating state');
                            setProfilePhoto(result.data.profilePhoto);
                            localStorage.setItem("userProfilePhoto", result.data.profilePhoto);
                        } else {
                            console.log('📸 API has no photo, keeping localStorage value');
                        }
                        // Update localStorage
                        localStorage.setItem("userName", result.data.fullName || "");
                        localStorage.setItem("userEmail", result.data.email || "");
                    }
                }

                // Fetch active company to get company name
                const companyResponse = await fetch("http://localhost:4000/api/companies/active", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (companyResponse.ok) {
                    const companyResult = await companyResponse.json();
                    if (companyResult.success && companyResult.data && companyResult.data.businessName) {
                        setOrganizationName(companyResult.data.businessName);
                        localStorage.setItem("userOrganization", companyResult.data.businessName);
                    }
                }

                // Fetch application to get payment status
                const appResponse = await fetch("http://localhost:4000/api/applications/my-application", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (appResponse.ok) {
                    const appResult = await appResponse.json();
                    if (appResult.success && appResult.data) {
                        setPaymentStatus(appResult.data.paymentStatus || "pending");
                        localStorage.setItem("paymentStatus", appResult.data.paymentStatus || "pending");
                    }
                } else {
                    // Check localStorage fallback
                    const storedStatus = localStorage.getItem("paymentStatus");
                    if (storedStatus) {
                        setPaymentStatus(storedStatus);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Fallback to localStorage
                const storedUserName = localStorage.getItem("userName");
                const storedUserEmail = localStorage.getItem("userEmail");
                const storedOrg = localStorage.getItem("userOrganization");
                const storedStatus = localStorage.getItem("paymentStatus");
                if (storedUserName) {
                    setUserName(storedUserName);
                }
                if (storedUserEmail) {
                    setUserEmail(storedUserEmail);
                }
                if (storedOrg) {
                    setOrganizationName(storedOrg);
                }
                if (storedStatus) {
                    setPaymentStatus(storedStatus);
                }
            }
        };

        fetchUserData();

        // Listen for profile updates
        const handleProfilePhotoUpdate = () => {
            console.log('📸 Profile photo event received');
            const photo = localStorage.getItem('userProfilePhoto') || '';
            console.log('📸 Updating profile photo:', photo ? 'exists' : 'empty');
            setProfilePhoto(photo);
        };

        const handleUserDataUpdate = () => {
            console.log('👤 User data event received');
            // Update from localStorage immediately
            const name = localStorage.getItem('userName') || '';
            const email = localStorage.getItem('userEmail') || '';
            const photo = localStorage.getItem('userProfilePhoto') || '';
            const org = localStorage.getItem('userOrganization') || '';
            
            console.log('👤 Updating name:', name);
            console.log('📧 Updating email:', email);
            console.log('📸 Updating photo:', photo ? 'exists' : 'empty');
            console.log('🏢 Updating organization:', org);
            
            setUserName(name);
            setUserEmail(email);
            setProfilePhoto(photo);
            setOrganizationName(org);
            // Also refetch from API
            fetchUserData();
        };

        const handleCompanyUpdate = () => {
            console.log('🏢 Company event received');
            const org = localStorage.getItem('userOrganization') || '';
            console.log('🏢 Updating organization:', org);
            setOrganizationName(org);
            // Also refetch from API
            fetchUserData();
        };

        window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
        window.addEventListener('userDataUpdated', handleUserDataUpdate);
        window.addEventListener('companyUpdated', handleCompanyUpdate);

        return () => {
            window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
            window.removeEventListener('userDataUpdated', handleUserDataUpdate);
            window.removeEventListener('companyUpdated', handleCompanyUpdate);
        };
    }, []);

    const nav = [
        { 
            to: paymentStatus === 'completed' ? '/payment/member-dashboard' : '/member/dashboard', 
            label: 'Dashboard', 
            icon: <FaHome />, 
            requirePayment: false 
        },
        { to: '/business/dashboard', label: 'Business Account', icon: <FaBriefcase />, requirePayment: true },
        { to: '/explore', label: 'Explore', icon: <FaSearch />, requirePayment: true },
        { to: '/member/shopping-cart', label: 'Shopping Cart', icon: <FaShoppingCart />, requirePayment: true, badge: cartCount },
        { to: '/notifications', label: 'Notifications', icon: <FaBell />, requirePayment: false },
        { to: '/member/profile-view', label: 'My Profile', icon: <FaUser />, requirePayment: false, badge: profileCompletion < 100 ? `${profileCompletion}%` : null },
        { to: '/member/settings', label: 'Settings', icon: <FaCog />, requirePayment: false },
        { to: '/member/certificate', label: 'Certificate', icon: <FaCertificate />, requirePayment: true },
        { to: '/member/help', label: 'Help', icon: <FaQuestionCircle />, requirePayment: false, badge: unreadHelpMessages || null },
        { to: '/member/events', label: 'Upcoming Events', icon: <FaCalendarAlt />, requirePayment: true, badge: upcomingEventsCount || null },
    ];

    // Filter nav items based on payment status
    // Unpayed users: only Dashboard, Notifications, Help, Settings (4 items)
    // Payed users: all 10 items
    const filteredNav = paymentStatus === 'completed' ? nav : nav.filter(item => !item.requirePayment);
    
    // Debug: Log nav items
    useEffect(() => {
        console.log('📝 Total nav items:', nav.length);
        console.log('📝 Filtered nav items:', filteredNav.length);
        console.log('📝 Nav items:', filteredNav.map(i => i.label));
    }, [nav, filteredNav]);

    const handleLogout = () => {
        // Clear all user-related localStorage data
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userProfilePhoto");
        localStorage.removeItem("userOrganization");
        localStorage.removeItem("paymentStatus");
        localStorage.removeItem("memberId");
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("cart");
        
        // Clear state
        setUserName("");
        setUserEmail("");
        setProfilePhoto("");
        setOrganizationName("");
        setPaymentStatus("pending");
        
        navigate("/login");
        onClose();
    };

    // Sidebar content component (reused for both mobile and desktop)
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                    {/* Close button only visible on mobile */}
                    <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                        <FaTimes className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <Avatar 
                        key={profilePhoto || 'no-photo'} 
                        className="w-12 h-12 ring-2 ring-blue-100 cursor-pointer hover:ring-4 transition-all"
                        onClick={() => {
                            navigate('/member/settings');
                            onClose();
                        }}
                    >
                        {profilePhoto ? (
                            <img 
                                src={profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                    console.error('❌ Direct img failed to load');
                                    console.log('Image src starts with:', profilePhoto.substring(0, 30));
                                }}
                                onLoad={() => console.log('✅ Direct img loaded successfully')}
                            />
                        ) : (
                            <>
                                <AvatarImage 
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face" 
                                    alt="Profile"
                                    className="object-cover w-full h-full" 
                                    style={{ display: 'block', opacity: 1 }}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                                    {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "SD"}
                                </AvatarFallback>
                            </>
                        )}
                    </Avatar>
                    <div>
                        <div className="font-semibold">{userName || "Member"}</div>
                        <div className="text-sm text-muted-foreground">{organizationName || "Member Account"}</div>
                    </div>
                </div>
            </div>

            <nav className="p-2 overflow-y-auto flex-1 min-h-0">
                {filteredNav.map((item: any) => {
                    const active = location.pathname === item.to;
                    const isLocked = item.requirePayment && paymentStatus !== 'completed';
                    return (
                        <Link
                            key={item.to}
                            to={isLocked ? '#' : item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                                isLocked 
                                    ? 'opacity-50 cursor-not-allowed text-gray-400' 
                                    : active
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={(e) => {
                                if (isLocked) {
                                    e.preventDefault();
                                } else {
                                    onClose();
                                }
                            }}
                        >
                            <span className={`w-5 h-5 ${active ? 'text-white' : isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium flex-1">{item.label}</span>
                            {item.badge !== undefined && item.badge !== null && (
                                <Badge 
                                    className={`${active ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} h-5 min-w-5 flex items-center justify-center px-1.5 text-xs font-bold`}
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2 border-t flex-shrink-0">
                <Button variant="ghost" onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-3">
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>Log out</span>
                </Button>
            </div>
        </div>
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
