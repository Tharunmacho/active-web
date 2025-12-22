import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ArrowLeft, Share2, QrCode, Copy, ExternalLink, MessageCircle } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

const catalogLinks = [
    { id: 1, name: "Full Product Catalog", url: "https://catalog.techcorp.com/all", views: 234, shares: 45 },
    { id: 2, name: "Electronics Collection", url: "https://catalog.techcorp.com/electronics", views: 156, shares: 28 },
    { id: 3, name: "New Arrivals", url: "https://catalog.techcorp.com/new", views: 89, shares: 12 },
];

const WhatsAppCatalog = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6" /></Button>
                    <h1 className="text-xl font-bold">WhatsApp Catalog</h1>
                    <Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-600 text-white">SD</AvatarFallback></Avatar>
                </div>
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')}><ArrowLeft className="h-5 w-5" /></Button>
                            <div><h1 className="text-2xl font-bold">WhatsApp Catalog Sharing</h1><p className="text-gray-500">Share your catalog via WhatsApp</p></div>
                        </div>

                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <MessageCircle className="w-12 h-12" />
                                    <div><h2 className="text-xl font-bold">Connect with Customers</h2><p className="opacity-90">Share product catalogs directly on WhatsApp</p></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4">Generate QR Code</h3>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <QrCode className="w-24 h-24 text-gray-400" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-gray-600 mb-4">Scan this QR code to view your product catalog on WhatsApp</p>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            <Button className="bg-green-600 hover:bg-green-700"><Share2 className="w-4 h-4 mr-2" />Share</Button>
                                            <Button variant="outline"><Copy className="w-4 h-4 mr-2" />Copy Link</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4">Your Catalog Links</h3>
                                <div className="space-y-3">
                                    {catalogLinks.map((link) => (
                                        <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div><p className="font-medium">{link.name}</p><p className="text-sm text-gray-500">{link.views} views • {link.shares} shares</p></div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
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

export default WhatsAppCatalog;
