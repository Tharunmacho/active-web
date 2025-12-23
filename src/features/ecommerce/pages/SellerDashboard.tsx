import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MessageSquare,
  BarChart3,
  Calendar
} from 'lucide-react';

const orders = [
  {
    id: 'ORD-2024-1234',
    customer: 'Rahul Kumar',
    product: 'Wireless Headphones',
    quantity: 1,
    amount: 5999,
    status: 'delivered',
    date: '2024-12-20',
    paymentStatus: 'paid',
  },
  {
    id: 'ORD-2024-1235',
    customer: 'Priya Sharma',
    product: 'Smart Watch',
    quantity: 2,
    amount: 25998,
    status: 'shipped',
    date: '2024-12-21',
    paymentStatus: 'paid',
  },
  {
    id: 'ORD-2024-1236',
    customer: 'Amit Verma',
    product: 'Gaming Keyboard',
    quantity: 1,
    amount: 3499,
    status: 'processing',
    date: '2024-12-22',
    paymentStatus: 'paid',
  },
  {
    id: 'ORD-2024-1237',
    customer: 'Neha Patel',
    product: 'Running Shoes',
    quantity: 1,
    amount: 2999,
    status: 'pending',
    date: '2024-12-22',
    paymentStatus: 'pending',
  },
];

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    sku: 'WH-001',
    price: 5999,
    stock: 45,
    sold: 234,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
  },
  {
    id: 2,
    name: 'Smart Watch',
    sku: 'SW-002',
    price: 12999,
    stock: 28,
    sold: 189,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
  },
  {
    id: 3,
    name: 'Gaming Keyboard',
    sku: 'GK-003',
    price: 3499,
    stock: 8,
    sold: 342,
    status: 'low-stock',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100',
  },
];

const reviews = [
  {
    id: 1,
    customer: 'Rahul Kumar',
    product: 'Wireless Headphones',
    rating: 5,
    comment: 'Excellent product! Great sound quality.',
    date: '2024-12-20',
    status: 'published',
  },
  {
    id: 2,
    customer: 'Priya Sharma',
    product: 'Smart Watch',
    rating: 4,
    comment: 'Good product but delivery was delayed.',
    date: '2024-12-19',
    status: 'pending',
  },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'reviews'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': case 'paid': case 'published': return 'bg-green-100 text-green-700';
      case 'shipped': case 'processing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'low-stock': return 'bg-orange-100 text-orange-700';
      case 'active': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-blue-100">Manage your products, orders, and inventory</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <p className="text-2xl font-bold mb-1">156</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+8%</Badge>
              </div>
              <p className="text-2xl font-bold mb-1">₹2,45,678</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-red-100 text-red-700">-3%</Badge>
              </div>
              <p className="text-2xl font-bold mb-1">28</p>
              <p className="text-sm text-gray-600">Products Listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+0.2</Badge>
              </div>
              <p className="text-2xl font-bold mb-1">4.6</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="flex border-b">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'products', label: 'Products', icon: Eye },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Sales Analytics</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Sales chart visualization</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order Delivered</p>
                        <p className="text-xs text-gray-500">ORD-2024-1234</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Review Received</p>
                        <p className="text-xs text-gray-500">5-star rating</p>
                        <p className="text-xs text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Order Placed</p>
                        <p className="text-xs text-gray-500">ORD-2024-1237</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Order Management</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search orders..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-sm">Order ID</th>
                      <th className="text-left p-4 font-semibold text-sm">Customer</th>
                      <th className="text-left p-4 font-semibold text-sm">Product</th>
                      <th className="text-left p-4 font-semibold text-sm">Amount</th>
                      <th className="text-left p-4 font-semibold text-sm">Status</th>
                      <th className="text-left p-4 font-semibold text-sm">Date</th>
                      <th className="text-left p-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-sm">{order.id}</td>
                        <td className="p-4 text-sm">{order.customer}</td>
                        <td className="p-4 text-sm">
                          {order.product} x{order.quantity}
                        </td>
                        <td className="p-4 text-sm font-semibold">₹{order.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              <span className="text-xs capitalize">{order.status}</span>
                            </div>
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{order.date}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'products' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Product Inventory</h3>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stock</p>
                          <p className="font-semibold">{product.stock} units</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Sold</p>
                          <p className="font-semibold">{product.sold} units</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reviews' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Customer Reviews</h3>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold mb-1">{review.customer}</p>
                        <p className="text-sm text-gray-600 mb-2">{review.product}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">Approve</Button>
                          <Button size="sm" variant="outline" className="text-red-600">Reject</Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost">Reply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
