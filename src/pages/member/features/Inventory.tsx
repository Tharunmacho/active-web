import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ArrowLeft, Package, AlertTriangle, TrendingDown, RefreshCw, Plus } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

const inventoryItems = [
    { id: 1, name: "Wireless Headphones", sku: "WH-001", stock: 45, minStock: 10, status: "in_stock" },
    { id: 2, name: "Smart Watch Pro", sku: "SW-002", stock: 8, minStock: 15, status: "low_stock" },
    { id: 3, name: "Cotton T-Shirt", sku: "CT-003", stock: 150, minStock: 20, status: "in_stock" },
    { id: 4, name: "Running Shoes", sku: "RS-004", stock: 3, minStock: 10, status: "critical" },
    { id: 5, name: "LED Desk Lamp", sku: "LD-005", stock: 34, minStock: 15, status: "in_stock" },
    { id: 6, name: "Organic Face Cream", sku: "FC-006", stock: 0, minStock: 10, status: "out_of_stock" },
];

const Inventory = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "in_stock": return "bg-green-100 text-green-700";
            case "low_stock": return "bg-yellow-100 text-yellow-700";
            case "critical": return "bg-orange-100 text-orange-700";
            case "out_of_stock": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6" /></Button>
                    <h1 className="text-xl font-bold">Inventory</h1>
                    <Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-600 text-white">SD</AvatarFallback></Avatar>
                </div>
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')}><ArrowLeft className="h-5 w-5" /></Button>
                                <div><h1 className="text-2xl font-bold">Inventory Tracking</h1><p className="text-gray-500">Stock levels & alerts</p></div>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-green-50 border-0 rounded-xl"><CardContent className="p-4"><Package className="w-8 h-8 text-green-600 mb-2" /><p className="text-2xl font-bold text-green-700">240</p><p className="text-sm text-green-600">In Stock</p></CardContent></Card>
                            <Card className="bg-yellow-50 border-0 rounded-xl"><CardContent className="p-4"><TrendingDown className="w-8 h-8 text-yellow-600 mb-2" /><p className="text-2xl font-bold text-yellow-700">1</p><p className="text-sm text-yellow-600">Low Stock</p></CardContent></Card>
                            <Card className="bg-orange-50 border-0 rounded-xl"><CardContent className="p-4"><AlertTriangle className="w-8 h-8 text-orange-600 mb-2" /><p className="text-2xl font-bold text-orange-700">1</p><p className="text-sm text-orange-600">Critical</p></CardContent></Card>
                            <Card className="bg-red-50 border-0 rounded-xl"><CardContent className="p-4"><Package className="w-8 h-8 text-red-600 mb-2" /><p className="text-2xl font-bold text-red-700">1</p><p className="text-sm text-red-600">Out of Stock</p></CardContent></Card>
                        </div>

                        <Card className="bg-white border shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold">Stock Levels</h3>
                                    <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
                                </div>
                                <div className="space-y-3">
                                    {inventoryItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Package className="w-6 h-6 text-blue-600" /></div>
                                                <div><p className="font-medium">{item.name}</p><p className="text-sm text-gray-500">SKU: {item.sku}</p></div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right"><p className="font-bold">{item.stock} units</p><p className="text-xs text-gray-500">Min: {item.minStock}</p></div>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(item.status)}`}>
                                                    {item.status.replace("_", " ").toUpperCase()}
                                                </span>
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

export default Inventory;
