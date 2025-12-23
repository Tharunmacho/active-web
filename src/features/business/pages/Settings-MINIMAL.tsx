import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BusinessSidebar from "./BusinessSidebar";

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/");
        toast.success("Logged out successfully");
    };

    return (
        <div className="min-h-screen flex bg-white">
            <BusinessSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Settings</h1>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="mb-4">Settings page is temporarily simplified for debugging.</p>
                        <Button onClick={handleLogout} variant="outline">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
