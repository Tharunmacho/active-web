import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import MemberSidebar from "./MemberSidebar";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [latestApplication, setLatestApplication] = useState<any | null>(null);
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
            // Update localStorage with fresh data
            localStorage.setItem("userName", result.data.fullName || "");
            localStorage.setItem("userEmail", result.data.email || "");
            localStorage.setItem("userId", result.data.userId || "");
            
            setUserName(result.data.fullName || "");
          }
        } else {
          // Fallback to localStorage if API fails
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

    const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard");
    if (hasVisitedBefore) {
      setIsFirstVisit(false);
    } else {
      // Mark first visit as complete
      localStorage.setItem("hasVisitedDashboard", "true");
    }
  }, []);

  // Load latest application from backend (fallback to localStorage)
  useEffect(() => {
    async function loadApplications() {
      let apps: any[] = [];
      // Get applications from local storage
      try {
        apps = JSON.parse(localStorage.getItem('applications') || '[]');
      } catch (_) {
        apps = [];
      }
      
      if (apps.length) {
        const sorted = [...apps].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setLatestApplication(sorted[0]);
      } else {
        setLatestApplication(null);
      }
    }
    loadApplications();
  }, []);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [formsCompleted, setFormsCompleted] = useState<string[]>([]);
  const [isFullyCompleted, setIsFullyCompleted] = useState(false);
  const [totalFormsRequired, setTotalFormsRequired] = useState(4);
  const [memberType, setMemberType] = useState<'business' | 'aspirant'>('business');

  // Load profile completion from backend
  useEffect(() => {
    const loadProfileCompletion = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const completed: string[] = [];
        let isDoingBusiness = true;
        let totalForms = 4; // Default: Personal, Business, Financial, Declaration

        // Check Personal Form
        const personalRes = await fetch("http://localhost:4000/api/personal-form", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (personalRes.ok) {
          const data = await personalRes.json();
          console.log("📋 Personal Form Data:", data.data);
          console.log("🔒 isLocked:", data.data?.isLocked);
          if (data.data && data.data.isLocked) {
            completed.push("Personal Details");
            console.log("✅ Personal Details marked as complete");
          } else if (data.data) {
            console.log("⚠️ Personal form exists but not locked");
          } else {
            console.log("❌ No personal form data found");
          }
        } else {
          console.log("⚠️ Personal form API error:", personalRes.status);
        }

        // Check Business Form
        const businessRes = await fetch("http://localhost:4000/api/business-form", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (businessRes.ok) {
          const data = await businessRes.json();
          console.log("📊 Business Form Data:", data.data);
          if (data.data) {
            console.log("🔍 doingBusiness value:", data.data.doingBusiness);
            
            // Check if user said "no" to doing business (aspirant)
            if (data.data.doingBusiness === "no") {
              console.log("✅ User is an ASPIRANT - totalForms = 3");
              isDoingBusiness = false;
              totalForms = 3; // Personal, Business (No), Declaration only
            } else {
              console.log("💼 User is DOING BUSINESS - totalForms = 4");
            }
            
            // Count as complete if doingBusiness field is set
            if (data.data.doingBusiness) {
              completed.push("Business Information");
              console.log("✓ Business Information marked as complete");
            }
          }
        } else {
          console.log("⚠️ Business form not found or error:", businessRes.status);
        }

        // Check Financial Form (only if doing business)
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

        // Check Declaration Form
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
        
        console.log("📈 Dashboard Calculation:");
        console.log("  - Completed forms:", completed);
        console.log("  - Total forms required:", totalForms);
        console.log("  - Member type:", isDoingBusiness ? 'business' : 'aspirant');
        console.log("  - Percentage:", percentage + "%");
        
        setCompletionPercentage(percentage);
        setFormsCompleted(completed);
        setTotalFormsRequired(totalForms);
        setMemberType(isDoingBusiness ? 'business' : 'aspirant');
        
        const fullyCompleted = percentage === 100;
        setIsFullyCompleted(fullyCompleted);

        // If 100% and not yet submitted, create submission record
        if (fullyCompleted && !localStorage.getItem("applicationSubmission")) {
          const userName = localStorage.getItem("userName") || "Member";
          const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          // Get location from personal form data if available
          let state = "Tamil Nadu";
          let district = "Tiruvannamalai";
          let block = "Thandrampet";
          
          try {
            const personalFormRes = await fetch("http://localhost:4000/api/personal-form", {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (personalFormRes.ok) {
              const personalData = await personalFormRes.json();
              if (personalData.data) {
                state = personalData.data.state || state;
                district = personalData.data.district || district;
                block = personalData.data.block || block;
              }
            }
          } catch (error) {
            console.log("Could not fetch location from personal form");
          }
          
          const submissionData = {
            applicationId,
            userName,
            submittedAt: new Date().toISOString(),
            status: "under_review",
            formsCompleted: completed,
            memberType: isDoingBusiness ? "business" : "aspirant",
            state,
            district,
            block
          };
          
          localStorage.setItem("applicationSubmission", JSON.stringify(submissionData));
        }
      } catch (error) {
        console.error("Error loading profile completion:", error);
      }
    };

    loadProfileCompletion();

    // Listen for form submissions to update percentage dynamically
    const handleFormUpdate = () => {
      console.log("🔄 Form updated, reloading profile completion...");
      loadProfileCompletion();
    };

    window.addEventListener('formSubmitted', handleFormUpdate);
    window.addEventListener('profileUpdated', handleFormUpdate);

    return () => {
      window.removeEventListener('formSubmitted', handleFormUpdate);
      window.removeEventListener('profileUpdated', handleFormUpdate);
    };
  }, []);

  let business: any = {};
  try {
    const businessRaw = localStorage.getItem("userProfileDetails");
    business = businessRaw ? JSON.parse(businessRaw) : {};
  } catch (_) {
    business = {} as any;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar menu for all screen sizes */}
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header with menu button - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "SD"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto bg-white">
          <div className="w-full max-w-6xl mx-auto">
            {/* Welcome section */}
            <div className="mb-6">

              <div className="flex items-center gap-4 mt-4">
                <Avatar className="w-16 h-16 ring-4 ring-blue-100">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold">
                    {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase() : "SD"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold md:text-2xl text-gray-800">
                    {isFirstVisit ? "Welcome" : "Welcome back"}, {userName || "Member"}
                  </h2>
                  <p className="text-gray-500">TechCorp Solution</p>
                </div>
              </div>
            </div>

            {/* Application Status or Profile Completion Card */}
            {isFullyCompleted ? (
              <Card className="shadow-lg border-0 w-full mb-6 bg-green-600 text-white">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">Application Submitted</h3>
                      <p className="text-sm opacity-90 mb-4">
                        Your membership application is currently under review. Track your approval progress.
                      </p>
                      <div className="mt-4">
                        <Button 
                          className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-2" 
                          onClick={() => navigate('/member/application-status')}
                        >
                          View Status
                        </Button>
                      </div>
                    </div>
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 md:w-16 md:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 w-full mb-6 bg-blue-600 text-white">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">Complete Your Profile</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl font-bold">{completionPercentage}%</div>
                        <span className="text-sm opacity-90">completed</span>
                      </div>
                      <p className="text-sm opacity-90 mb-4">Unlock all features by completing your profile.</p>
                      <div className="mt-4">
                        <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-2" onClick={() => navigate('/member/profile')}>
                          Complete Profile
                        </Button>
                      </div>
                    </div>
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 md:w-16 md:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Your Business Account Card - Professional Purple */}
            <Card className="shadow-lg border-0 w-full mb-4 md:mb-6 bg-purple-600 text-white">
              <CardContent className="p-5 md:p-8">
                <div className="flex flex-row items-center gap-4 md:gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">Your Business Account</h3>
                    <div className="mb-2 md:mb-3">
                      <span className="inline-block text-xs md:text-sm font-semibold bg-white bg-opacity-20 rounded-full px-3 md:px-4 py-1.5 md:py-2">Pending</span>
                    </div>
                    <p className="text-sm opacity-90 mb-4">View and manage your business profile and settings</p>
                    <div className="mt-4">
                      <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-2" onClick={() => navigate('/business/create-profile')}>
                        Create Account
                      </Button>
                    </div>
                  </div>
                  <div className="hidden sm:flex w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-xl items-center justify-center shadow-lg flex-shrink-0">
                    <Briefcase className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Profile Status Card */}            {/* Membership card and documents after membership */}
            {latestApplication?.payment?.status === 'Completed' && (
              <>
                <Card className="w-full mb-6 border-0 shadow-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold bg-white/20 rounded-full px-2 py-0.5">{(latestApplication.payment.plan || 'annual').toString().toUpperCase()}</span>
                          <span className="text-xs font-semibold bg-green-500 rounded-full px-2 py-0.5">Active</span>
                        </div>
                        <div className="text-sm opacity-90">Member since</div>
                        <div className="text-xl font-bold">
                          {latestApplication.payment.paidAt ? new Date(latestApplication.payment.paidAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </div>
                        <div className="text-sm mt-1 opacity-90">Member ID: <span className="font-semibold">{latestApplication.id}</span></div>
                      </div>
                      <div className="hidden md:block w-10 h-10 rounded-full bg-white/30" />
                    </div>
                  </CardContent>
                </Card>

                <div className="mb-3">
                  <h3 className="text-xl font-semibold">Official Documents</h3>
                  <p className="text-sm text-muted-foreground">Access and download essential documents related to your account</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-blue-100 text-blue-900"
                    onClick={() => navigate('/member/certificate')}
                  >
                    <span className="font-medium">Download Membership Certificate</span>
                    <span>⬇️</span>
                  </button>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-green-100 text-green-900"
                    onClick={() => {
                      const blob = new Blob([`Tax Exemption CertificateMember: ${userName || 'Member'}Member ID: ${latestApplication.id}Date: ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Tax-Exemption-${latestApplication.id}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <span className="font-medium">Download Tax Exemption Certificate</span>
                    <span>⬇️</span>
                  </button>
                </div>
              </>
            )}

            {/* Quick actions grid - mobile optimized (single set, clickable) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Removed ADF Form, Certificate, Help Center, Events cards */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;


