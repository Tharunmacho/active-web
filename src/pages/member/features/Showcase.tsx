import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ArrowLeft, Store, MapPin, Clock, Phone, Globe, Star, Edit } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

const businessData = {
    name: "TechCorp Solutions",
    tagline: "Innovative Technology Solutions",
    description: "We provide cutting-edge technology solutions for businesses of all sizes. Our expertise spans software development, cloud services, and digital transformation.",
    address: "123 Tech Park, Bangalore, Karnataka 560001",
    phone: "+91 98765 43210",
    email: "contact@techcorp.com",
    website: "www.techcorp.com",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    rating: 4.8,
    reviews: 156,
    products: 24,
    orders: 89
};

const Showcase = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6" /></Button>
                    <h1 className="text-xl font-bold">Showcase</h1>
                    <Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-600 text-white">SD</AvatarFallback></Avatar>
                </div>
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')}><ArrowLeft className="h-5 w-5" /></Button>
                            <div><h1 className="text-2xl font-bold">Business Showcase</h1><p className="text-gray-500">Your public store profile</p></div>
                        </div>

                        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center"><Store className="w-10 h-10 text-blue-600" /></div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{businessData.name}</h2>
                                        <p className="opacity-90">{businessData.tagline}</p>
                                        <div className="flex items-center gap-1 mt-2"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{businessData.rating}</span><span className="text-sm opacity-75">({businessData.reviews} reviews)</span></div>
                                    </div>
                                    <Button className="bg-white text-blue-600 hover:bg-gray-100"><Edit className="w-4 h-4 mr-2" />Edit</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-blue-50 border-0 rounded-xl"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-700">{businessData.products}</p><p className="text-sm text-blue-600">Products</p></CardContent></Card>
                            <Card className="bg-green-50 border-0 rounded-xl"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-700">{businessData.orders}</p><p className="text-sm text-green-600">Orders</p></CardContent></Card>
                            <Card className="bg-purple-50 border-0 rounded-xl"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-700">{businessData.reviews}</p><p className="text-sm text-purple-600">Reviews</p></CardContent></Card>
                        </div>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4">About Us</h3>
                                <p className="text-gray-600">{businessData.description}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-lg font-bold">Contact Information</h3>
                                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /><span>{businessData.address}</span></div>
                                <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><span>{businessData.phone}</span></div>
                                <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-gray-400" /><span>{businessData.website}</span></div>
                                <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-gray-400" /><span>{businessData.hours}</span></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Showcase;
