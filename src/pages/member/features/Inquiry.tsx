import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ArrowLeft, MessageSquare, Send, Clock, CheckCircle, AlertCircle, Building, Mail, Phone } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

const inquiries = [
    { id: 1, company: "Tech Solutions Pvt Ltd", contact: "Rahul Sharma", email: "rahul@techsolutions.com", phone: "+91 98765 43210", product: "Bulk Cotton Fabric", quantity: "500 meters", message: "Interested in bulk order.", status: "new", date: "2024-12-22" },
    { id: 2, company: "Fashion Hub", contact: "Priya Patel", email: "priya@fashionhub.in", phone: "+91 87654 32109", product: "Cotton T-Shirt", quantity: "1000 units", message: "Looking for wholesale pricing.", status: "replied", date: "2024-12-21" },
    { id: 3, company: "Home Decor Ltd", contact: "Amit Kumar", email: "amit@homedecor.com", phone: "+91 76543 21098", product: "LED Desk Lamp", quantity: "200 units", message: "Need bulk order for lamps.", status: "pending", date: "2024-12-20" },
];

const Inquiry = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6" /></Button>
                    <h1 className="text-xl font-bold">Inquiries</h1>
                    <Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-600 text-white">SD</AvatarFallback></Avatar>
                </div>
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')}><ArrowLeft className="h-5 w-5" /></Button>
                            <div><h1 className="text-2xl font-bold">B2B Inquiry Inbox</h1><p className="text-gray-500">Manage your leads</p></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-blue-50 border-0"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-700">1</p><p className="text-sm text-blue-600">New</p></CardContent></Card>
                            <Card className="bg-yellow-50 border-0"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-700">1</p><p className="text-sm text-yellow-600">Pending</p></CardContent></Card>
                            <Card className="bg-green-50 border-0"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-700">1</p><p className="text-sm text-green-600">Replied</p></CardContent></Card>
                        </div>
                        <div className="space-y-4">
                            {inquiries.map((inq) => (
                                <Card key={inq.id} className="bg-white border shadow-sm rounded-xl">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Building className="w-8 h-8 text-purple-600 bg-purple-100 rounded-full p-1.5" />
                                                <div><h3 className="font-semibold">{inq.company}</h3><p className="text-sm text-gray-500">{inq.contact}</p></div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${inq.status === 'new' ? 'bg-blue-100 text-blue-700' : inq.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{inq.status}</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg mb-2"><p className="text-sm font-medium">{inq.product}</p><p className="text-xs text-gray-500">Qty: {inq.quantity}</p></div>
                                        <p className="text-sm text-gray-600 mb-2">{inq.message}</p>
                                        <div className="flex justify-between text-xs text-gray-400"><span>{inq.date}</span><div className="flex gap-2"><Mail className="w-4 h-4" /><Phone className="w-4 h-4" /></div></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inquiry;
