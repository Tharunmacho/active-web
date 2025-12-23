import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';

const inquiries = [
  {
    id: 'INQ-2024-001',
    company: 'Tech Solutions Pvt Ltd',
    contact: 'Amit Sharma',
    email: 'amit@techsolutions.com',
    phone: '+91 9876543210',
    product: 'Premium Wireless Headphones',
    quantity: 500,
    message: 'Looking for bulk purchase of 500 units for corporate gifting.',
    status: 'pending',
    date: '2024-12-20',
  },
  {
    id: 'INQ-2024-002',
    company: 'Global Enterprises',
    contact: 'Priya Verma',
    email: 'priya@global.com',
    phone: '+91 9765432108',
    product: 'Smart Watch Series 7',
    quantity: 200,
    message: 'Need quotation for 200 smartwatches for employee benefits program.',
    status: 'responded',
    date: '2024-12-19',
  },
  {
    id: 'INQ-2024-003',
    company: 'Retail Chain Co.',
    contact: 'Rajesh Kumar',
    email: 'rajesh@retailchain.com',
    phone: '+91 9654321078',
    product: 'Mechanical Gaming Keyboard',
    quantity: 1000,
    message: 'Looking to stock in our retail stores across India.',
    status: 'closed',
    date: '2024-12-18',
  },
];

export default function B2BInquiryForm() {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    product: '',
    quantity: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'responded': return 'bg-blue-100 text-blue-700';
      case 'closed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'responded': return <Mail className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">B2B Inquiry Center</h1>
          <p className="text-purple-100 text-lg">Submit your bulk order inquiries and track responses</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            {showForm ? (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Submit B2B Inquiry</h2>
                      <p className="text-gray-600">Fill out the form for bulk purchase inquiries</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            required
                            placeholder="Enter company name"
                            className="pl-10"
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            required
                            placeholder="Full name"
                            className="pl-10"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            required
                            type="email"
                            placeholder="company@example.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            required
                            type="tel"
                            placeholder="+91 9876543210"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Product Interest <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            required
                            placeholder="Product name"
                            className="pl-10"
                            value={formData.product}
                            onChange={(e) => setFormData({...formData, product: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Required Quantity <span className="text-red-500">*</span>
                        </label>
                        <Input
                          required
                          type="number"
                          min="1"
                          placeholder="e.g., 100"
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Describe your requirements, delivery timeline, or any special requests..."
                        className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    {submitted && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-700">Inquiry Submitted Successfully!</p>
                          <p className="text-sm text-green-600">We'll respond within 24 hours.</p>
                        </div>
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={submitted}>
                      <Send className="h-5 w-5 mr-2" />
                      {submitted ? 'Submitting...' : 'Submit Inquiry'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Inquiry Submitted!</h2>
                  <p className="text-gray-600 mb-6">
                    Your inquiry has been received. Our B2B team will contact you within 24 hours.
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    Submit Another Inquiry
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Quick Response</h3>
                  <p className="text-sm text-gray-600">24-hour response time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Bulk Discounts</h3>
                  <p className="text-sm text-gray-600">Special B2B pricing</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Dedicated Support</h3>
                  <p className="text-sm text-gray-600">Personal account manager</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Inquiry Inbox */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Inquiry Inbox</h3>
                  <Badge>{inquiries.length}</Badge>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search inquiries..." className="pl-10" />
                </div>

                {/* Inquiries List */}
                <div className="space-y-3">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1">{inquiry.company}</p>
                          <p className="text-xs text-gray-500">{inquiry.id}</p>
                        </div>
                        <Badge className={getStatusColor(inquiry.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(inquiry.status)}
                            <span className="text-xs">{inquiry.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-xs text-gray-600">
                          <Package className="inline h-3 w-3 mr-1" />
                          {inquiry.product} (Qty: {inquiry.quantity})
                        </p>
                        <p className="text-xs text-gray-600">
                          <User className="inline h-3 w-3 mr-1" />
                          {inquiry.contact}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {inquiry.message}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{inquiry.date}</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          View Details
                        </Button>
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
}
