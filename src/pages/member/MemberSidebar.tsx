import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    // Priority: Business form organization > Active company organization
    const [organizationName, setOrganizationName] = useState(() =>
        localStorage.getItem("businessFormOrganization") || localStorage.getItem("userOrganization") || ""
    );
    const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem("paymentStatus") || "pending");
    const [hasBusiness, setHasBusiness] = useState(() => localStorage.getItem("hasBusiness") === "true");
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { profileCompletion, upcomingEventsCount, unreadHelpMessages } = useProfile();
    const [cartCount, setCartCount] = useState(0);

    // Debug: Log whenever profilePhoto state changes
    // useEffect(() => {
    //     console.log('🖼️ ProfilePhoto state updated:', profilePhoto ? `${profilePhoto.substring(0, 50)}... (${profilePhoto.length} bytes)` : 'empty');
    // }, [profilePhoto]);

    // Refresh data from localStorage whenever location changes (no API calls)
    useEffect(() => {
        const name = localStorage.getItem('userName') || '';
        const email = localStorage.getItem('userEmail') || '';
        const photo = localStorage.getItem('userProfilePhoto') || '';
        // Priority: Business form organization > Active company organization
        const businessFormOrg = localStorage.getItem('businessFormOrganization') || '';
        const activeCompanyOrg = localStorage.getItem('userOrganization') || '';
        const org = businessFormOrg || activeCompanyOrg;
        const status = localStorage.getItem('paymentStatus') || 'pending';
        const business = localStorage.getItem('hasBusiness') === 'true';

        setUserName(name);
        setUserEmail(email);
        setProfilePhoto(photo);
        setOrganizationName(org);
        setPaymentStatus(status);
        setHasBusiness(business);

        // Force fetch fresh payment status on every location change
        const fetchPaymentStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const appRes = await fetch('http://localhost:4000/api/applications/my-application', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (appRes.ok) {
                    const appResult = await appRes.json();
                    if (appResult.success && appResult.data) {
                        const freshStatus = appResult.data.paymentStatus || 'pending';
                        if (freshStatus !== status) {
                            console.log('🔄 Payment status updated from', status, 'to', freshStatus);
                            setPaymentStatus(freshStatus);
                            localStorage.setItem('paymentStatus', freshStatus);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching payment status:', error);
            }
        };

        fetchPaymentStatus();
    }, [location.pathname]);

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

    useEffect(() => {
        // Fetch user data from backend with caching to avoid repeated calls
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            // Check cache timestamp - only fetch if data is older than 2 minutes
            const lastFetch = localStorage.getItem('userDataLastFetch');
            const now = Date.now();
            const cacheTime = 2 * 60 * 1000; // 2 minutes

            if (lastFetch && (now - parseInt(lastFetch)) < cacheTime) {
                console.log('✅ Using cached user data');
                return; // Use cached data
            }

            console.log('🔄 Fetching fresh user data from API');
            localStorage.setItem('userDataLastFetch', now.toString());

            try {
                // Parallel fetch for better performance
                const [authRes, companyRes, appRes, businessFormRes] = await Promise.all([
                    fetch("http://localhost:4000/api/auth/me", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }),
                    fetch("http://localhost:4000/api/companies/active", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }),
                    fetch("http://localhost:4000/api/applications/my-application", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }),
                    fetch("http://localhost:4000/api/business-form", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    })
                ]);

                // Process auth/user data
                if (authRes.ok) {
                    const result = await authRes.json();
                    if (result.success && result.data) {
                        const fullName = result.data.fullName || "";
                        setUserName(fullName);
                        setUserEmail(result.data.email || "");

                        // Priority: Use localStorage photo if exists (most recent), otherwise API photo
                        const localPhoto = localStorage.getItem("userProfilePhoto");
                        let apiPhoto = result.data.profilePhoto || "";

                        // If API photo is base64 without data URI prefix, add it
                        if (apiPhoto && !apiPhoto.startsWith('data:') && !apiPhoto.startsWith('http')) {
                            apiPhoto = `data:image/png;base64,${apiPhoto}`;
                        }

                        // Only update if we have a photo from either source
                        if (apiPhoto) {
                            setProfilePhoto(apiPhoto);
                            localStorage.setItem("userProfilePhoto", apiPhoto);
                        } else if (localPhoto) {
                            // Photo already set from initial state, don't overwrite
                        }

                        // Update localStorage
                        localStorage.setItem("userName", fullName);
                        localStorage.setItem("userEmail", result.data.email || "");
                    }
                }

                // Process business form data FIRST - this is the permanent organization name
                let businessFormOrganization = "";
                let hasBusinessAccount = false;

                if (businessFormRes.ok) {
                    const businessFormResult = await businessFormRes.json();
                    if (businessFormResult.success && businessFormResult.data) {
                        hasBusinessAccount = businessFormResult.data.doingBusiness === 'yes';
                        businessFormOrganization = businessFormResult.data.organization || "";

                        setHasBusiness(hasBusinessAccount);
                        localStorage.setItem("hasBusiness", hasBusinessAccount.toString());

                        // PRIORITY 1: Business form organization is permanent
                        if (businessFormOrganization) {
                            setOrganizationName(businessFormOrganization);
                            localStorage.setItem("userOrganization", businessFormOrganization);
                            localStorage.setItem("businessFormOrganization", businessFormOrganization);
                        }
                    }
                }

                // Process company data ONLY if no business form organization
                if (!businessFormOrganization && companyRes.ok) {
                    const companyResult = await companyRes.json();
                    if (companyResult.success && companyResult.data && companyResult.data.businessName) {
                        // PRIORITY 2: Active company name (dynamic)
                        setOrganizationName(companyResult.data.businessName);
                        localStorage.setItem("userOrganization", companyResult.data.businessName);
                    }
                }

                // Process application data
                if (appRes.ok) {
                    const appResult = await appRes.json();
                    if (appResult.success && appResult.data) {
                        const status = appResult.data.paymentStatus || "pending";
                        const appName = appResult.data.memberName || "";

                        setPaymentStatus(status);
                        localStorage.setItem("paymentStatus", status);

                        // If auth didn't return name, use application name
                        if (!userName && appName) {
                            setUserName(appName);
                            localStorage.setItem("userName", appName);
                        }
                    }
                } else {
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
                const storedPhoto = localStorage.getItem("userProfilePhoto");
                if (storedUserName) setUserName(storedUserName);
                if (storedUserEmail) setUserEmail(storedUserEmail);
                if (storedOrg) setOrganizationName(storedOrg);
                if (storedStatus) setPaymentStatus(storedStatus);
                if (storedPhoto) setProfilePhoto(storedPhoto);
            }
        };

        fetchUserData();
    }, []);

    // Separate useEffect for event listeners to avoid stale closure issues
    useEffect(() => {
        // Fetch function that can be reused
        const refetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const authRes = await fetch("http://localhost:4000/api/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (authRes.ok) {
                    const result = await authRes.json();
                    if (result.success && result.data) {
                        const fullName = result.data.fullName || "";
                        console.log('🔄 Refetched user data from API:', fullName);
                        setUserName(fullName);
                        setUserEmail(result.data.email || "");

                        const localPhoto = localStorage.getItem("userProfilePhoto");
                        let apiPhoto = result.data.profilePhoto || "";

                        // If API photo is base64 without data URI prefix, add it
                        if (apiPhoto && !apiPhoto.startsWith('data:') && !apiPhoto.startsWith('http')) {
                            apiPhoto = `data:image/png;base64,${apiPhoto}`;
                        }

                        const photoToUse = localPhoto || apiPhoto;
                        setProfilePhoto(photoToUse);

                        // Update localStorage
                        localStorage.setItem("userName", fullName);
                        localStorage.setItem("userEmail", result.data.email || "");
                        if (photoToUse) {
                            localStorage.setItem("userProfilePhoto", photoToUse);
                        }
                    }
                }
            } catch (error) {
                console.error("Error refetching user data:", error);
            }
        };

        // Listen for profile updates
        const handleProfilePhotoUpdate = () => {
            const photo = localStorage.getItem('userProfilePhoto') || '';
            setProfilePhoto(photo);
        };

        const handleUserDataUpdate = () => {
            const name = localStorage.getItem('userName') || '';
            const email = localStorage.getItem('userEmail') || '';
            setUserName(name);
            setUserEmail(email);
            refetchUserData();
        };

        const handleProfileDataUpdate = () => {
            const name = localStorage.getItem('userName') || '';
            const email = localStorage.getItem('userEmail') || '';
            const photo = localStorage.getItem('userProfilePhoto') || '';
            setUserName(name);
            setUserEmail(email);
            setProfilePhoto(photo);
            refetchUserData();
        };

        const handleCompanyUpdate = () => {
            // Check priority: Business form organization > Active company
            const businessFormOrg = localStorage.getItem('businessFormOrganization') || '';
            const activeCompanyOrg = localStorage.getItem('userOrganization') || '';
            const business = localStorage.getItem('hasBusiness') === 'true';

            // Priority 1: Business form organization (permanent)
            if (businessFormOrg) {
                setOrganizationName(businessFormOrg);
            } else if (activeCompanyOrg) {
                // Priority 2: Active company (dynamic)
                setOrganizationName(activeCompanyOrg);
            }

            setHasBusiness(business);
        };

        window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
        window.addEventListener('userDataUpdated', handleUserDataUpdate);
        window.addEventListener('profileDataUpdated', handleProfileDataUpdate);
        window.addEventListener('companyUpdated', handleCompanyUpdate);

        return () => {
            window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
            window.removeEventListener('userDataUpdated', handleUserDataUpdate);
            window.removeEventListener('profileDataUpdated', handleProfileDataUpdate);
            window.removeEventListener('companyUpdated', handleCompanyUpdate);
        };
    }, []);

    const nav = useMemo(() => [
        {
            to: paymentStatus === 'completed' ? '/payment/member-dashboard' : '/member/dashboard',
            label: 'Dashboard',
            icon: <FaHome />,
            requirePayment: false
        },
        { to: '/business/dashboard', label: 'Business Account', icon: <FaBriefcase />, requirePayment: false, hideIfNoBusiness: true },
        { to: '/explore', label: 'Explore', icon: <FaSearch />, requirePayment: true },
        { to: '/member/shopping-cart', label: 'Shopping Cart', icon: <FaShoppingCart />, requirePayment: true, badge: cartCount },
        { to: '/member/notifications', label: 'Notifications', icon: <FaBell />, requirePayment: false },
        { to: '/member/profile-view', label: 'My Profile', icon: <FaUser />, requirePayment: false, badge: profileCompletion < 100 ? `${profileCompletion}%` : null },
        { to: '/member/settings', label: 'Settings', icon: <FaCog />, requirePayment: false },
        { to: '/member/certificate', label: 'Certificate', icon: <FaCertificate />, requirePayment: true },
        { to: '/member/help', label: 'Help', icon: <FaQuestionCircle />, requirePayment: false, badge: unreadHelpMessages || null },
        { to: '/member/events', label: 'Upcoming Events', icon: <FaCalendarAlt />, requirePayment: true, badge: upcomingEventsCount || null },
    ], [paymentStatus, cartCount, profileCompletion, upcomingEventsCount, unreadHelpMessages]);

    // Filter nav items based on payment status and business account
    // Unpayed users: only Dashboard, Notifications, Help, Settings (4 items)
    // Payed users: all 10 items
    const filteredNav = useMemo(() => {
        let items = nav;

        // Filter by payment status
        if (paymentStatus !== 'completed') {
            // Show only Dashboard, Notifications, My Profile, Settings, Help for unpaid users
            const allowedLabels = ['Dashboard', 'Notifications', 'My Profile', 'Settings', 'Help', 'Business Account'];
            items = items.filter(item => allowedLabels.includes(item.label));
        }

        // Filter Business Account based on hasBusiness flag
        items = items.filter(item => {
            if (item.hideIfNoBusiness && !hasBusiness) {
                return false; // Hide Business Account if user doesn't have business
            }
            return true;
        });

        return items;
    }, [nav, paymentStatus, hasBusiness]);

    const handleLogout = () => {
        // Clear all user-related localStorage data
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userProfilePhoto");
        localStorage.removeItem("userOrganization");
        localStorage.removeItem("paymentStatus");
        localStorage.removeItem("hasBusiness");
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
        setHasBusiness(false);

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
                        <div className="text-sm text-muted-foreground">
                            {organizationName || "Member Account"}
                        </div>
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${isLocked
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
