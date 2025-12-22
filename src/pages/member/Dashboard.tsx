import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, Briefcase, ShoppingCart, Package, MessageSquare, Store, BarChart3, Share2, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import MemberSidebar from "./MemberSidebar";
import { useNavigate } from "react-router-dom";

// Upcoming features data
const upcomingFeatures = {
  stage2: [
    { id: 1, title: "B2C & B2B Catalog", description: "Listing, categories, images, pricing", icon: Package, route: "/member/catalog" },
    { id: 2, title: "Shopping Cart & Checkout", description: "Orders, basic payment flow", icon: ShoppingCart, route: "/member/cart" },
    { id: 3, title: "B2B Inquiry Form", description: "Inquiry submission, lead inbox", icon: MessageSquare, route: "/member/inquiry" },
    { id: 4, title: "Business Showcase", description: "Store info, links, location", icon: Store, route: "/member/showcase" },
    { id: 5, title: "Seller Dashboard", description: "Orders, reviews, updates", icon: BarChart3, route: "/member/seller-dashboard" },
  ],
  stage3: [
    { id: 1, title: "WhatsApp Catalog Sharing", description: "Link/QR creation for product list", icon: Share2, route: "/member/whatsapp-catalog" },
    { id: 2, title: "Inventory Tracking", description: "Stock level, alerts", icon: Package, route: "/member/inventory" },
  ]
};

const MemberDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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
            localStorage.setItem("userName", result.data.fullName || "");
            setUserName(result.data.fullName || "");
          }
        } else {
          const storedUserName = localStorage.getItem("userName");
          if (storedUserName) {
            setUserName(storedUserName);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
          setUserName(storedUserName);
        }
      }
    };

    fetchUserData();

    const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard");
    if (hasVisitedBefore) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem("hasVisitedDashboard", "true");
    }
  }, []);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [formsCompleted, setFormsCompleted] = useState<string[]>([]);
  const [isFullyCompleted, setIsFullyCompleted] = useState(false);
  const [totalFormsRequired, setTotalFormsRequired] = useState(4);

  useEffect(() => {
    const loadProfileCompletion = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const completed: string[] = [];
        let isDoingBusiness = true;
        let totalForms = 4;

        const personalRes = await fetch("http://localhost:4000/api/personal-form", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (personalRes.ok) {
          const data = await personalRes.json();
          if (data.data && data.data.isLocked) {
            completed.push("Personal Details");
          }
        }

        const businessRes = await fetch("http://localhost:4000/api/business-form", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (businessRes.ok) {
          const data = await businessRes.json();
          if (data.data) {
            if (data.data.doingBusiness === "no") {
              isDoingBusiness = false;
              totalForms = 3;
            }
            if (data.data.doingBusiness) {
              completed.push("Business Information");
            }
          }
        }

        if (isDoingBusiness) {
          const financialRes = await fetch("http://localhost:4000/api/financial-form", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (financialRes.ok) {
            const data = await financialRes.json();
            if (data.data && data.data.pan) {
              completed.push("Financial Details");
            }
          }
        }

        const declarationRes = await fetch("http://localhost:4000/api/declaration-form", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (declarationRes.ok) {
          const data = await declarationRes.json();
          if (data.data && data.data.declarationAccepted) {
            completed.push("Declaration");
          }
        }

        const percentage = Math.round((completed.length / totalForms) * 100);
        setCompletionPercentage(percentage);
        setFormsCompleted(completed);
        setTotalFormsRequired(totalForms);
        setIsFullyCompleted(percentage === 100);
      } catch (error) {
        console.error("Error loading profile completion:", error);
      }
    };

    loadProfileCompletion();

    const handleFormUpdate = () => {
      loadProfileCompletion();
    };

    window.addEventListener('formSubmitted', handleFormUpdate);
    window.addEventListener('profileUpdated', handleFormUpdate);

    return () => {
      window.removeEventListener('formSubmitted', handleFormUpdate);
      window.removeEventListener('profileUpdated', handleFormUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-white">
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <Avatar className="w-10 h-10 ring-2 ring-blue-100">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "SD"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-white">
          <div className="w-full max-w-6xl mx-auto space-y-6">

            {/* Welcome Section */}
            <Card className="bg-white border shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-4 ring-blue-100 shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold">
                      {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "SD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {isFirstVisit ? "Welcome" : "Welcome back"}, {userName || "Member"}!
                    </h2>
                    <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion Card */}
            {isFullyCompleted ? (
              <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-6 h-6" />
                        <span className="text-sm font-semibold bg-white/20 rounded-full px-3 py-1">Completed</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">Application Submitted</h3>
                      <p className="text-sm opacity-90 mb-4">Your membership application is currently under review.</p>
                      <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-2 shadow-lg" onClick={() => navigate('/member/application-status')}>
                        View Status
                      </Button>
                    </div>
                    <div className="hidden md:flex w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center">
                      <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">Complete Your Profile</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                            <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="8" fill="none" strokeDasharray={`${(completionPercentage / 100) * 226} 226`} strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">{completionPercentage}%</span>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Profile completion</p>
                          <p className="text-xs opacity-75 mt-1">{formsCompleted.length} of {totalFormsRequired} forms completed</p>
                        </div>
                      </div>
                      <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-2 shadow-lg" onClick={() => navigate('/member/profile')}>
                        Complete Profile
                      </Button>
                    </div>
                    <div className="hidden md:flex w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center">
                      <User className="w-14 h-14 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Account Card */}
            <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-row items-center gap-4 md:gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">Your Business Account</h3>
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2">
                        <Clock className="w-3 h-3" />
                        Pending Setup
                      </span>
                    </div>
                    <p className="text-sm opacity-90 mb-4">View and manage your business profile and settings</p>
                    <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-2 shadow-lg" onClick={() => navigate('/business/create-profile')}>
                      Create Account
                    </Button>
                  </div>
                  <div className="hidden sm:flex w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center flex-shrink-0">
                    <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Features - Stage 2 */}
            <Card className="bg-white border shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Upcoming Features</h3>
                    <p className="text-sm text-gray-500">Coming Soon</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingFeatures.stage2.map((feature) => (
                    <div
                      key={feature.id}
                      className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(feature.route)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                          <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stage 3 Features */}
            <Card className="bg-white border shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">STAGE 3</h3>
                    <p className="text-sm text-gray-500">Future Features</p>
                  </div>
                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 rounded-full px-3 py-1">In Planning</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingFeatures.stage3.map((feature) => (
                    <div
                      key={feature.id}
                      className="group p-4 bg-purple-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-100 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(feature.route)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                          <feature.icon className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                          <span className="inline-block mt-2 text-xs font-medium text-purple-600 bg-purple-100 rounded px-2 py-0.5">
                            {feature.id === 1 ? "Coming Soon" : "Planned"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
