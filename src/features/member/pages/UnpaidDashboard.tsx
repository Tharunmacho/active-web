import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, CheckCircle, Clock, AlertCircle, FileText, User, Briefcase, DollarSign, ArrowRight } from "lucide-react";
import MemberSidebar from "./MemberSidebar";
import { toast } from "sonner";

const UnpaidDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [applicationData, setApplicationData] = useState<any>(null);
    const [formsCompleted, setFormsCompleted] = useState({
        personal: false,
        business: false,
        financial: false,
        declaration: false
    });

    // Add a state to track if profile is completed
    const [profileCompleted, setProfileCompleted] = useState(false);
    const [hasBusinessAccount, setHasBusinessAccount] = useState(false);

    useEffect(() => {
        loadApplicationData();
        checkBusinessAccount();
    }, []);

    // Check profile completion (dummy logic, replace with real check)
    useEffect(() => {
        // You should replace this with a real API call or logic
        // For now, check localStorage or applicationData for profile completion
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (userProfile && userProfile.profileCompleted) {
            setProfileCompleted(true);
        } else {
            setProfileCompleted(false);
        }
    }, [applicationData]);

    const loadApplicationData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            // Load application status
            const appResponse = await fetch("http://localhost:4000/api/applications/my-application", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (appResponse.ok) {
                const appResult = await appResponse.json();
                setApplicationData(appResult.data);
            }

            // Check which forms are completed
            const personalRes = await fetch("http://localhost:4000/api/personal-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const businessRes = await fetch("http://localhost:4000/api/business-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const financialRes = await fetch("http://localhost:4000/api/financial-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const declarationRes = await fetch("http://localhost:4000/api/declaration-form", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            setFormsCompleted({
                personal: personalRes.ok && (await personalRes.json()).data,
                business: businessRes.ok && (await businessRes.json()).data,
                financial: financialRes.ok && (await financialRes.json()).data,
                declaration: declarationRes.ok && (await declarationRes.json()).data
            });

        } catch (error) {
            console.error("Error loading application data:", error);
            toast.error("Failed to load application data");
        } finally {
            setLoading(false);
        }
    };

    const checkBusinessAccount = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch("http://localhost:4000/api/companies/active", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setHasBusinessAccount(true);
                    console.log('✅ Business account found:', result.data.businessName);
                }
            }
        } catch (error) {
            console.error("Error checking business account:", error);
        }
    };

    const allFormsCompleted = Object.values(formsCompleted).every(completed => completed);
    const allApproved = applicationData?.approvals?.personal === 'approved' &&
        applicationData?.approvals?.business === 'approved' &&
        applicationData?.approvals?.declaration === 'approved';

    const handleCompleteFormsClick = () => {
        // Navigate to first incomplete form
        if (!formsCompleted.personal) {
            navigate("/member/forms/personal");
        } else if (!formsCompleted.business) {
            navigate("/member/forms/business");
        } else if (!formsCompleted.financial) {
            navigate("/member/forms/financial");
        } else if (!formsCompleted.declaration) {
            navigate("/member/forms/declaration");
        } else {
            navigate("/member/application-status");
        }
    };

    const handlePaymentClick = () => {
        if (allApproved) {
            navigate("/member/application-status");
        } else {
            toast.info("Please wait for admin approvals before proceeding to payment");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                                <p className="text-sm text-gray-600 mt-1">Complete your profile to unlock all features</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto flex items-start justify-start">
                    <div className="w-full max-w-4xl space-y-10 mt-12 ml-12">
                        {/* Show only profile and business cards if profile not completed */}
                        {!profileCompleted && (
                            <>
                                <Card className="bg-blue-600 text-white shadow-xl" style={{ minHeight: '180px', fontSize: '1.25rem' }}>
                                    <CardContent className="p-10 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold mb-3">Complete Your Profile</h2>
                                            <p className="text-white/80 mb-6 text-lg">Unlock all features by completing your profile.</p>
                                            <Button onClick={() => navigate('/member/profile')} className="bg-white text-blue-600 font-semibold text-lg px-8 py-3">Complete Profile</Button>
                                        </div>
                                        <User className="h-24 w-24 opacity-30" />
                                    </CardContent>
                                </Card>
                                <Card className="bg-purple-600 text-white shadow-xl" style={{ minHeight: '180px', fontSize: '1.25rem' }}>
                                    <CardContent className="p-10 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold mb-3">
                                                {hasBusinessAccount ? 'Your Business Account' : 'Create Business Account'}
                                            </h2>
                                            <p className="text-white/80 mb-6 text-lg">
                                                {hasBusinessAccount
                                                    ? 'View and manage your business profile and settings'
                                                    : 'Set up your business profile to unlock business features'}
                                            </p>
                                            <Button
                                                onClick={() => navigate(hasBusinessAccount ? '/business/dashboard' : '/business/create-profile')}
                                                className="bg-white text-purple-600 font-semibold text-lg px-8 py-3"
                                            >
                                                {hasBusinessAccount ? 'View Status' : 'Create Account'}
                                            </Button>
                                        </div>
                                        <Briefcase className="h-24 w-24 opacity-30" />
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Show application forms only if profile is completed */}
                        {profileCompleted && (
                            <>
                                {/* Application Progress Card */}
                                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-bold">Your Application Progress</h2>
                                            <div className="bg-white/20 px-4 py-2 rounded-full">
                                                <span className="font-semibold">
                                                    {Object.values(formsCompleted).filter(Boolean).length} / 4 Forms
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-blue-100 mb-4">
                                            Complete all forms and get admin approval to proceed with payment
                                        </p>
                                        <div className="w-full bg-white/20 rounded-full h-3">
                                            <div
                                                className="bg-white rounded-full h-3 transition-all duration-500"
                                                style={{ width: `${(Object.values(formsCompleted).filter(Boolean).length / 4) * 100}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Forms Checklist */}
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Application Forms</h3>
                                        <div className="space-y-3">
                                            <FormStatusItem
                                                icon={<User className="h-5 w-5" />}
                                                title="Personal Information"
                                                completed={formsCompleted.personal}
                                                onClick={() => navigate("/member/personal-form")}
                                            />
                                            <FormStatusItem
                                                icon={<Briefcase className="h-5 w-5" />}
                                                title="Business Information"
                                                completed={formsCompleted.business}
                                                onClick={() => navigate("/member/business-form")}
                                            />
                                            <FormStatusItem
                                                icon={<DollarSign className="h-5 w-5" />}
                                                title="Financial Information"
                                                completed={formsCompleted.financial}
                                                onClick={() => navigate("/member/financial-form")}
                                            />
                                            <FormStatusItem
                                                icon={<FileText className="h-5 w-5" />}
                                                title="Declaration"
                                                completed={formsCompleted.declaration}
                                                onClick={() => navigate("/member/declaration-form")}
                                            />
                                        </div>

                                        {!allFormsCompleted && (
                                            <Button
                                                onClick={handleCompleteFormsClick}
                                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                                            >
                                                Continue Application
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Approval Status */}
                                {allFormsCompleted && (
                                    <Card>
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4">Approval Status</h3>
                                            <div className="space-y-3">
                                                <ApprovalStatusItem
                                                    title="Personal Form"
                                                    status={applicationData?.approvals?.personal || 'pending'}
                                                />
                                                <ApprovalStatusItem
                                                    title="Business Form"
                                                    status={applicationData?.approvals?.business || 'pending'}
                                                />
                                                <ApprovalStatusItem
                                                    title="Declaration Form"
                                                    status={applicationData?.approvals?.declaration || 'pending'}
                                                />
                                            </div>

                                            {allApproved ? (
                                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                                        <CheckCircle className="h-5 w-5" />
                                                        <span className="font-semibold">All Forms Approved!</span>
                                                    </div>
                                                    <p className="text-sm text-green-600 mb-3">
                                                        Congratulations! Your application has been approved. Proceed to payment to activate your membership.
                                                    </p>
                                                    <Button
                                                        onClick={handlePaymentClick}
                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                    >
                                                        Proceed to Payment
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                    <div className="flex items-center gap-2 text-amber-700">
                                                        <Clock className="h-5 w-5" />
                                                        <span className="font-semibold">Awaiting Admin Approval</span>
                                                    </div>
                                                    <p className="text-sm text-amber-600 mt-2">
                                                        Your forms are under review. You'll be notified once approved.
                                                    </p>
                                                </div>
                                            )}

                                            <Button
                                                onClick={() => navigate("/member/application-status")}
                                                variant="outline"
                                                className="w-full mt-4"
                                            >
                                                View Detailed Status
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const FormStatusItem = ({ icon, title, completed, onClick }: any) => (
    <div
        onClick={onClick}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                {icon}
            </div>
            <span className="font-medium text-gray-800">{title}</span>
        </div>
        {completed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
        )}
    </div>
);

const ApprovalStatusItem = ({ title, status }: any) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="font-medium text-gray-700">{title}</span>
        <div className="flex items-center gap-2">
            {status === 'approved' ? (
                <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Approved</span>
                </>
            ) : status === 'rejected' ? (
                <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Rejected</span>
                </>
            ) : (
                <>
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600">Pending</span>
                </>
            )}
        </div>
    </div>
);

export default UnpaidDashboard;
