import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, CreditCard, Globe, LogOut, Settings as SettingsIcon, Save } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
    });

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        toast.success("Logged out successfully");
    };

    return (
        <div className="min-h-screen flex" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Glassmorphism Header */}
                <div className="p-6 backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
                        <p className="text-white/80">Manage your account and preferences</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Account Settings */}
                        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-blue-100">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Account Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Business Name</Label>
                                        <Input
                                            placeholder="Enter business name"
                                            className="rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</Label>
                                        <Input
                                            type="email"
                                            placeholder="business@example.com"
                                            className="rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</Label>
                                        <Input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Location</Label>
                                        <Input
                                            placeholder="City, State"
                                            className="rounded-xl border-2 border-gray-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-purple-100">
                                    <Bell className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { key: "email", label: "Email Notifications", description: "Receive updates via email" },
                                    { key: "push", label: "Push Notifications", description: "Get instant alerts on your device" },
                                    { key: "sms", label: "SMS Notifications", description: "Receive text message alerts" },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.label}</p>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        </div>
                                        <Switch
                                            checked={notifications[item.key as keyof typeof notifications]}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, [item.key]: checked })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Privacy & Security */}
                        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-green-100">
                                    <Shield className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Privacy & Security</h3>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start rounded-xl border-2 border-gray-200 hover:bg-gray-50 h-14"
                                >
                                    <Shield className="h-5 w-5 mr-3 text-green-600" />
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800">Change Password</p>
                                        <p className="text-xs text-gray-500">Update your account password</p>
                                    </div>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start rounded-xl border-2 border-gray-200 hover:bg-gray-50 h-14"
                                >
                                    <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800">Payment Methods</p>
                                        <p className="text-xs text-gray-500">Manage your billing information</p>
                                    </div>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start rounded-xl border-2 border-gray-200 hover:bg-gray-50 h-14"
                                >
                                    <Globe className="h-5 w-5 mr-3 text-purple-600" />
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800">Language & Region</p>
                                        <p className="text-xs text-gray-500">Customize your preferences</p>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                onClick={handleSave}
                                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="h-12 px-6 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
