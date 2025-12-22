import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ArrowLeft, ShoppingCart, Trash2, Plus, Minus, CreditCard, Truck, Shield } from "lucide-react";
import MemberSidebar from "../MemberSidebar";
import { useNavigate } from "react-router-dom";

// Dummy cart data
const initialCartItems = [
    { id: 1, name: "Wireless Bluetooth Headphones", price: 2499, quantity: 1, image: "🎧" },
    { id: 2, name: "Smart Watch Pro", price: 4999, quantity: 2, image: "⌚" },
    { id: 3, name: "Running Shoes Elite", price: 3499, quantity: 1, image: "👟" },
];

const Cart = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState(initialCartItems);
    const navigate = useNavigate();

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items => items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen flex bg-white">
            <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-800">Cart</h1>
                    <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">SD</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-white">
                    <div className="w-full max-w-6xl mx-auto">

                        {/* Back Button & Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/payment/member-dashboard')} className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                                <p className="text-gray-500">{cartItems.length} items in your cart</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.length === 0 ? (
                                    <Card className="bg-white border shadow-sm rounded-xl">
                                        <CardContent className="p-8 text-center">
                                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                                            <p className="text-gray-500 mb-4">Looks like you haven't added anything yet.</p>
                                            <Button onClick={() => navigate('/member/catalog')} className="bg-blue-600 hover:bg-blue-700">
                                                Browse Catalog
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    cartItems.map((item) => (
                                        <Card key={item.id} className="bg-white border shadow-sm rounded-xl">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                                                        {item.image}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                        <p className="text-lg font-bold text-blue-600 mt-1">₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8">
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8">
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4">
                                <Card className="bg-white border shadow-sm rounded-xl">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span>₹{subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Shipping</span>
                                                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tax (18% GST)</span>
                                                <span>₹{tax.toLocaleString()}</span>
                                            </div>
                                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                                <span>Total</span>
                                                <span className="text-blue-600">₹{total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3">
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Proceed to Checkout
                                        </Button>
                                        {subtotal < 5000 && (
                                            <p className="text-xs text-gray-500 text-center mt-3">
                                                Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping!
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Trust Badges */}
                                <Card className="bg-gray-50 border shadow-sm rounded-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                            <Truck className="w-5 h-5 text-blue-600" />
                                            <span>Free shipping on orders above ₹5,000</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Shield className="w-5 h-5 text-green-600" />
                                            <span>Secure checkout with 256-bit encryption</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
