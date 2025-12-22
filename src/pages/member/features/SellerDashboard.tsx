import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ArrowLeft, BarChart3, TrendingUp, Package, ShoppingCart, Star, DollarSign } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

const orders = [
    { id: "ORD-001", customer: "Rahul S.", product: "Wireless Headphones", amount: 2499, status: "delivered", date: "Dec 22" },
    { id: "ORD-002", customer: "Priya P.", product: "Smart Watch Pro", amount: 4999, status: "shipped", date: "Dec 21" },
    { id: "ORD-003", customer: "Amit K.", product: "LED Desk Lamp", amount: 1299, status: "processing", date: "Dec 21" },
    { id: "ORD-004", customer: "Sneha R.", product: "Running Shoes", amount: 3499, status: "delivered", date: "Dec 20" },
];

const reviews = [
    { id: 1, customer: "Rahul Sharma", rating: 5, comment: "Excellent product! Fast delivery.", date: "Dec 22" },
    { id: 2, customer: "Priya Patel", rating: 4, comment: "Good quality, slightly delayed.", date: "Dec 21" },
    { id: 3, customer: "Amit Kumar", rating: 5, comment: "Perfect! Will order again.", date: "Dec 20" },
];

const SellerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6" /></Button>
                    <h1 className="text-xl font-bold">Seller Dashboard</h1>
                    <Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-600 text-white">SD</AvatarFallback></Avatar>
                </div>
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')}><ArrowLeft className="h-5 w-5" /></Button>
                            <div><h1 className="text-2xl font-bold">Seller Dashboard</h1><p className="text-gray-500">Orders, reviews & updates</p></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-blue-50 border-0 rounded-xl"><CardContent className="p-4"><DollarSign className="w-8 h-8 text-blue-600 mb-2" /><p className="text-2xl font-bold text-blue-700">₹45,890</p><p className="text-sm text-blue-600">Revenue</p></CardContent></Card>
                            <Card className="bg-green-50 border-0 rounded-xl"><CardContent className="p-4"><ShoppingCart className="w-8 h-8 text-green-600 mb-2" /><p className="text-2xl font-bold text-green-700">89</p><p className="text-sm text-green-600">Orders</p></CardContent></Card>
                            <Card className="bg-purple-50 border-0 rounded-xl"><CardContent className="p-4"><Package className="w-8 h-8 text-purple-600 mb-2" /><p className="text-2xl font-bold text-purple-700">24</p><p className="text-sm text-purple-600">Products</p></CardContent></Card>
                            <Card className="bg-yellow-50 border-0 rounded-xl"><CardContent className="p-4"><Star className="w-8 h-8 text-yellow-600 mb-2" /><p className="text-2xl font-bold text-yellow-700">4.8</p><p className="text-sm text-yellow-600">Rating</p></CardContent></Card>
                        </div>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div><p className="font-medium">{order.product}</p><p className="text-sm text-gray-500">{order.customer} • {order.id}</p></div>
                                            <div className="text-right"><p className="font-bold">₹{order.amount}</p><span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4">Recent Reviews</h3>
                                <div className="space-y-3">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1"><span className="font-medium">{review.customer}</span><div className="flex">{[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div></div>
                                            <p className="text-sm text-gray-600">{review.comment}</p>
                                            <p className="text-xs text-gray-400 mt-1">{review.date}</p>
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

export default SellerDashboard;
