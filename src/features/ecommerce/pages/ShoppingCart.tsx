import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Shield,
  Truck,
  ArrowRight,
  Gift,
  CreditCard
} from 'lucide-react';

const cartItems = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 5999,
    originalPrice: 8999,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    inStock: true,
    seller: 'TechGear Official Store',
  },
  {
    id: 2,
    name: 'Smart Watch Series 7',
    price: 12999,
    originalPrice: 15999,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    inStock: true,
    seller: 'Smart Devices Co.',
  },
  {
    id: 3,
    name: 'Mechanical Gaming Keyboard',
    price: 3499,
    originalPrice: 4999,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200',
    inStock: true,
    seller: 'Gaming World',
  },
];

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(cartItems);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + change)) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + deliveryCharge;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="ml-2">{items.length} items</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add items to get started</p>
              <Button onClick={() => navigate('/ecommerce/catalog')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Progress Steps */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span className="font-semibold text-blue-600">Cart</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span className="text-gray-500">Address</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <span className="text-gray-500">Payment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Items List */}
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">Sold by: {item.seller}</p>
                            
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-green-600 font-semibold">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                              </span>
                            </div>

                            {/* Delivery Info */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <Truck className="h-4 w-4" />
                              <span>Delivery by Tomorrow, 11 PM</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  disabled={item.quantity >= 10}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Badge variant={item.inStock ? "default" : "destructive"} className="bg-green-100 text-green-700">
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Place Order Button (Mobile) */}
              <Button 
                className="w-full lg:hidden"
                size="lg"
                onClick={() => navigate('/ecommerce/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                {/* Coupon Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Apply Coupon</h3>
                    </div>
                    
                    <div className="flex gap-2 mb-2">
                      <Input 
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <Button variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {appliedCoupon} Applied!
                          </span>
                        </div>
                        <button 
                          onClick={() => setAppliedCoupon(null)}
                          className="text-red-600 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Use code <span className="font-semibold">SAVE10</span> for 10% off
                    </p>
                  </CardContent>
                </Card>

                {/* Price Details */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Price ({items.length} items)</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>- ₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Charges</span>
                        <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                          {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                        </span>
                      </div>

                      {deliveryCharge > 0 && (
                        <p className="text-xs text-gray-500">
                          Add ₹{(500 - subtotal).toLocaleString()} more for FREE delivery
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total Amount</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                      {discount > 0 && (
                        <p className="text-sm text-green-600 mt-1 text-right">
                          You will save ₹{discount.toLocaleString()} on this order
                        </p>
                      )}
                    </div>

                    <Button 
                      className="w-full"
                      size="lg"
                      onClick={() => navigate('/ecommerce/checkout')}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Safe and Secure Payments</p>
                          <p className="text-xs text-gray-500">100% Payment Protection</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Easy Returns</p>
                          <p className="text-xs text-gray-500">7 Days Return Policy</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Multiple Payment Options</p>
                          <p className="text-xs text-gray-500">Cards, UPI, Wallets & More</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
