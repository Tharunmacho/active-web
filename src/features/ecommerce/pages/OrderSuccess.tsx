import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Package, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-500 mb-8">
            Order ID: <span className="font-semibold">ORD-2024-{Math.floor(Math.random() * 10000)}</span>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-6 w-6 text-blue-600" />
              <p className="font-semibold text-lg">Expected Delivery</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">Order Amount</p>
                <p className="text-xl font-bold">₹20,248</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <p className="text-xl font-bold text-green-600">Paid</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => navigate('/ecommerce/catalog')}>
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Invoice
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            You will receive an email confirmation shortly with order details
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
