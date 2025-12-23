import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
  Plus,
  Edit,
  Smartphone
} from 'lucide-react';

const savedAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    address: '123, MG Road, Bangalore',
    pincode: '560001',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Office',
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    address: '456, Tech Park, Whitefield, Bangalore',
    pincode: '560066',
    isDefault: false,
  },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, recommended: true },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, recommended: false },
  { id: 'wallet', name: 'Wallets', icon: Wallet, recommended: false },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, recommended: false },
  { id: 'cod', name: 'Cash on Delivery', icon: CheckCircle, recommended: false },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');

  const handlePlaceOrder = () => {
    // Simulate order placement
    navigate('/ecommerce/order-success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="font-semibold text-green-600">Cart</span>
              </div>
              <div className="flex-1 h-0.5 bg-green-600 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="font-semibold text-blue-600">Address & Payment</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-500">Confirmation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold">Delivery Address</h2>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>

                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{address.type}</Badge>
                              {address.isDefault && (
                                <Badge className="bg-blue-100 text-blue-700">Default</Badge>
                              )}
                            </div>
                            <p className="font-semibold mb-1">{address.name}</p>
                            <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                            <p className="text-sm text-gray-600 mb-2">Pincode: {address.pincode}</p>
                            <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                        />
                        <method.icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{method.name}</span>
                        {method.recommended && (
                          <Badge className="ml-auto bg-green-100 text-green-700">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* UPI Input */}
                {selectedPayment === 'upi' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium mb-2">Enter UPI ID</label>
                    <Input 
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      You'll be redirected to your UPI app to complete the payment
                    </p>
                  </div>
                )}

                {/* Card Input */}
                {selectedPayment === 'card' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <Input placeholder="123" type="password" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Price (3 items)</span>
                      <span>₹22,497</span>
                    </div>
                    
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- ₹2,249</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charges</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount</span>
                      <span>₹20,248</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1 text-right">
                      You saved ₹2,249 on this order
                    </p>
                  </div>

                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
