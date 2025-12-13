import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Menu, ShieldCheck, Globe, Eye, Lock, Bell } from "lucide-react";
import BusinessSidebar from "./BusinessSidebar";

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settings, setSettings] = useState({
        publicProfile: true,
        showProducts: true,
        privateAnalytics: false,
        profileViews: true,
        productUpdates: false,
        messages: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-purple-50">
            {/* Business Sidebar */}
            <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 bg-white border-b">
                    <div className="flex items-center gap-3 mb-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
                    </div>
                    <p className="text-gray-600 text-sm md:ml-12">Manage your account preferences</p>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className="max-w-2xl mx-auto space-y-4">
                        {/* Business Verification */}
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">Business Verification</h3>
                                        <p className="text-sm text-gray-600">Get verified to build trust and increase visibility</p>
                                    </div>
                                </div>
                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded">
                                    Pending Review
                                </span>
                                <Button
                                    variant="outline"
                                    className="w-full mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    Check Verification Status
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Visibility & Privacy */}
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-4">Visibility & Privacy</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Globe className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Public Profile</div>
                                                <div className="text-sm text-gray-600">Make your profile searchable</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.publicProfile}
                                            onCheckedChange={() => toggleSetting("publicProfile")}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Eye className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Show Products Publicly</div>
                                                <div className="text-sm text-gray-600">Display products in search</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.showProducts}
                                            onCheckedChange={() => toggleSetting("showProducts")}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Lock className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Private Analytics</div>
                                                <div className="text-sm text-gray-600">Hide view counts from others</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.privateAnalytics}
                                            onCheckedChange={() => toggleSetting("privateAnalytics")}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-4">Notifications</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Profile Views</div>
                                                <div className="text-sm text-gray-600">Get notified of new views</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.profileViews}
                                            onCheckedChange={() => toggleSetting("profileViews")}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Product Updates</div>
                                                <div className="text-sm text-gray-600">Notifications about your products</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.productUpdates}
                                            onCheckedChange={() => toggleSetting("productUpdates")}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Messages</div>
                                                <div className="text-sm text-gray-600">Customer inquiries and messages</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.messages}
                                            onCheckedChange={() => toggleSetting("messages")}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
