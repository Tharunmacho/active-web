import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Bell,
  Plus,
  Edit,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Archive
} from 'lucide-react';

const inventoryItems = [
  {
    id: 1,
    sku: 'WH-001',
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    stock: 45,
    minStock: 20,
    maxStock: 100,
    price: 5999,
    lastUpdated: '2 hours ago',
    status: 'healthy',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
  },
  {
    id: 2,
    sku: 'SW-002',
    name: 'Smart Watch Series 7',
    category: 'Electronics',
    stock: 28,
    minStock: 25,
    maxStock: 75,
    price: 12999,
    lastUpdated: '1 day ago',
    status: 'warning',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
  },
  {
    id: 3,
    sku: 'GK-003',
    name: 'Gaming Keyboard',
    category: 'Electronics',
    stock: 8,
    minStock: 15,
    maxStock: 50,
    price: 3499,
    lastUpdated: '3 hours ago',
    status: 'critical',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100',
  },
  {
    id: 4,
    sku: 'RS-004',
    name: 'Running Shoes',
    category: 'Fashion',
    stock: 67,
    minStock: 30,
    maxStock: 100,
    price: 2999,
    lastUpdated: '5 hours ago',
    status: 'healthy',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
  },
  {
    id: 5,
    sku: 'WB-005',
    name: 'Water Bottle',
    category: 'Home & Kitchen',
    stock: 3,
    minStock: 10,
    maxStock: 50,
    price: 599,
    lastUpdated: '30 mins ago',
    status: 'critical',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
  },
];

const alerts = [
  { id: 1, type: 'critical', message: 'Water Bottle (WB-005) - Stock critically low: 3 units', time: '30 mins ago' },
  { id: 2, type: 'warning', message: 'Gaming Keyboard (GK-003) - Below minimum stock level', time: '3 hours ago' },
  { id: 3, type: 'info', message: 'Smart Watch (SW-002) - Approaching minimum stock', time: '1 day ago' },
];

export default function InventoryTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <TrendingDown className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const criticalItems = inventoryItems.filter(item => item.status === 'critical').length;
  const warningItems = inventoryItems.filter(item => item.status === 'warning').length;

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Inventory Tracking</h1>
          </div>
          <p className="text-indigo-100 text-lg">Monitor stock levels and manage inventory alerts in real-time</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
              <p className="text-sm text-gray-600">Total Units in Stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{(totalValue / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-600">Total Stock Value</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <Badge className="bg-red-100 text-red-700">Urgent</Badge>
              </div>
              <p className="text-3xl font-bold text-gray-900">{criticalItems}</p>
              <p className="text-sm text-gray-600">Critical Stock Items</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Alerts</Badge>
              </div>
              <p className="text-3xl font-bold text-gray-900">{warningItems}</p>
              <p className="text-sm text-gray-600">Low Stock Warnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by name or SKU..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const statusColors = getStatusColor(item.status);
                const stockPercentage = (item.stock / item.maxStock) * 100;
                
                return (
                  <Card key={item.id} className={`border-2 ${statusColors.border}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-500">SKU: {item.sku} • {item.category}</p>
                            </div>
                            <Badge className={`${statusColors.bg} ${statusColors.text}`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(item.status)}
                                <span className="capitalize">{item.status}</span>
                              </div>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Current Stock</p>
                              <p className="text-xl font-bold">{item.stock}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Min / Max</p>
                              <p className="text-sm font-semibold">{item.minStock} / {item.maxStock}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Unit Price</p>
                              <p className="text-sm font-semibold">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Stock Value</p>
                              <p className="text-sm font-semibold">₹{(item.stock * item.price).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Stock Level Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Stock Level</span>
                              <span>{stockPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.status === 'critical' ? 'bg-red-600' :
                                  item.status === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
                                }`}
                                style={{ width: `${stockPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Updated {item.lastUpdated}</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Restock
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Alerts Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Alerts */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Stock Alerts</h3>
                    <Badge className="bg-red-100 text-red-700">{alerts.length}</Badge>
                  </div>

                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.type === 'critical' ? 'bg-red-50 border-red-600' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-600' :
                          'bg-blue-50 border-blue-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {alert.type === 'critical' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          ) : alert.type === 'warning' ? (
                            <Bell className="h-4 w-4 text-yellow-600 mt-0.5" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Bulk Update Stock
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Items
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Category Filter */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  
                  <div className="space-y-2">
                    {['All', 'Electronics', 'Fashion', 'Home & Kitchen'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat
                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
