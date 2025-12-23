import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaBox, FaCompass, FaChartBar, FaCog, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    disableNavigation?: boolean;
};

export default function BusinessSidebar({ isOpen, onClose, disableNavigation = false }: Props) {
    const location = useLocation();
    const [userName, setUserName] = useState("");
    const [companyName, setCompanyName] = useState<string>("");
    const [companyPhone, setCompanyPhone] = useState<string>("");
    const [companyLogo, setCompanyLogo] = useState<string>("");
    const [companyId, setCompanyId] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        // Get user name from localStorage
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }

        // Fetch active company data
        const fetchActiveCompany = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:4000/api/companies/active', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Active company result:', data);
                    if (data && data.data) {
                        console.log('Setting company data:', data.data.businessName, data.data.mobileNumber);
                        setCompanyName(data.data.businessName || "");
                        setCompanyPhone(data.data.mobileNumber || "");
                        setCompanyLogo(data.data.logo || "");
                        setCompanyId(data.data._id || "");
                    }
                }
            } catch (error) {
                console.error('Error fetching active company:', error);
            }
        };

        fetchActiveCompany();

        // Listen for company data updates
        const handleCompanyUpdate = () => {
            fetchActiveCompany();
        };

        window.addEventListener('companyDataUpdated', handleCompanyUpdate);

        return () => {
            window.removeEventListener('companyDataUpdated', handleCompanyUpdate);
        };
    }, []);

    const nav = [
        { to: '/business/dashboard', label: 'Business', icon: <FaBriefcase /> },
        { to: '/business/products', label: 'Products', icon: <FaBox /> },
        { to: '/business/discover', label: 'Discover', icon: <FaCompass /> },
        { to: '/business/analytics', label: 'Analytics', icon: <FaChartBar /> },
        { to: '/business/settings', label: 'Settings', icon: <FaCog /> },
    ];

    const handleAvatarClick = () => {
        navigate('/business/settings');
        onClose();
    };

    const handleBackToDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Check payment status from backend
            if (token) {
                const response = await fetch("http://localhost:4000/api/payment/status", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    // If user has paid membership, redirect to paid dashboard
                    if (result.success && result.data && result.data.isPaid) {
                        navigate("/payment/member-dashboard");
                        onClose();
                        return;
                    }
                }
            }
            
            // If not paid or no token, redirect to regular member dashboard
            navigate("/member/dashboard");
        } catch (error) {
            console.error("Error checking payment status:", error);
            navigate("/member/dashboard");
        }
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
                    <Avatar 
                        className="w-12 h-12 ring-2 ring-blue-100 cursor-pointer hover:ring-blue-300 transition-all" 
                        onClick={handleAvatarClick}
                    >
                        <AvatarImage src={companyLogo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=96&h=96&fit=crop"} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                            {companyName ? companyName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "BA"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{companyName || "Business Account"}</div>
                        <div className="text-sm text-muted-foreground">{companyPhone || "No phone"}</div>
                    </div>
                </div>
            </div>

            <nav className="p-2 overflow-y-auto flex-1">
                {nav.map((item) => {
                    const active = location.pathname === item.to;
                    const isDisabled = disableNavigation && item.to !== '/business/create-profile';
                    
                    const handleClick = (e: React.MouseEvent) => {
                        if (isDisabled) {
                            e.preventDefault();
                            toast.error("Please complete your business profile first");
                            return;
                        }
                        onClose();
                    };
                    
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                                isDisabled 
                                    ? 'text-gray-400 cursor-not-allowed opacity-50'
                                    : active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={handleClick}
                        >
                            <span className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : active ? 'text-white' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2 border-t">
                <Button variant="ghost" onClick={handleBackToDashboard} className="w-full flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-3">
                    <FaArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
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
