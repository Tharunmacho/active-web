import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  Package,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';

// Dummy Products Data
const dummyProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    price: 5999,
    originalPrice: 8999,
    rating: 4.5,
    reviews: 2345,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    badge: 'Best Seller',
    inStock: true,
    b2bPrice: 4999,
  },
  {
    id: 2,
    name: 'Smart Watch Series 7',
    category: 'Electronics',
    price: 12999,
    originalPrice: 15999,
    rating: 4.7,
    reviews: 1890,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    badge: 'Hot Deal',
    inStock: true,
    b2bPrice: 10999,
  },
  {
    id: 3,
    name: 'Professional DSLR Camera',
    category: 'Electronics',
    price: 45999,
    originalPrice: 54999,
    rating: 4.8,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    badge: 'Premium',
    inStock: true,
    b2bPrice: 42999,
  },
  {
    id: 4,
    name: 'Leather Office Chair',
    category: 'Furniture',
    price: 8999,
    originalPrice: 12999,
    rating: 4.3,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500',
    badge: null,
    inStock: true,
    b2bPrice: 7499,
  },
  {
    id: 5,
    name: 'Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    badge: 'Best Seller',
    inStock: true,
    b2bPrice: 2999,
  },
  {
    id: 6,
    name: 'Running Shoes - Sports Edition',
    category: 'Fashion',
    price: 2999,
    originalPrice: 4499,
    rating: 4.4,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    badge: null,
    inStock: true,
    b2bPrice: 2499,
  },
  {
    id: 7,
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Kitchen',
    price: 599,
    originalPrice: 999,
    rating: 4.2,
    reviews: 4567,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    badge: 'Eco Friendly',
    inStock: true,
    b2bPrice: 449,
  },
  {
    id: 8,
    name: 'Yoga Mat with Carry Bag',
    category: 'Sports & Fitness',
    price: 1299,
    originalPrice: 1999,
    rating: 4.5,
    reviews: 789,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    badge: null,
    inStock: true,
    b2bPrice: 999,
  },
];

const categories = [
  { name: 'All Products', count: 234, icon: Package },
  { name: 'Electronics', count: 89, icon: Zap },
  { name: 'Fashion', count: 67, icon: TrendingUp },
  { name: 'Home & Kitchen', count: 45, icon: Award },
  { name: 'Sports & Fitness', count: 33, icon: Star },
];

export default function ProductCatalog() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showB2BPrices, setShowB2BPrices] = useState(false);

  const handleAddToCart = (product: typeof dummyProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: showB2BPrices ? product.b2bPrice : product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.image,
      inStock: product.inStock,
      seller: 'Official Store',
    });
    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = dummyProducts.filter(product => {
    if (selectedCategory !== 'All Products' && product.category !== selectedCategory) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const ProductCard = ({ product }: any) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={() => navigate(`/ecommerce/product/${product.id}`)}
        />
        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-orange-500">
            {product.badge}
          </Badge>
        )}
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-xs text-gray-500">{product.category}</p>
          <h3 
            className="font-semibold text-sm mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer"
            onClick={() => navigate(`/ecommerce/product/${product.id}`)}
          >
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-xs">
            <Star className="h-3 w-3 mr-1 fill-white" />
            {product.rating}
          </div>
          <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹{showB2BPrices ? product.b2bPrice.toLocaleString() : product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            <span className="text-sm text-green-600 font-semibold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
            </span>
          </div>
          {showB2BPrices && (
            <p className="text-xs text-blue-600 mt-1">B2B Bulk Price</p>
          )}
        </div>

        <Button 
          className="w-full"
          onClick={() => handleAddToCart(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-blue-100">Discover our wide range of quality products</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search for products, brands and more..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center justify-between">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors ${
                          selectedCategory === cat.name ? 'bg-blue-50 text-blue-600 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          <span className="text-sm">{cat.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'All Prices', value: 'all' },
                      { label: 'Under ₹1,000', value: '0-1000' },
                      { label: '₹1,000 - ₹5,000', value: '1000-5000' },
                      { label: '₹5,000 - ₹10,000', value: '5000-10000' },
                      { label: 'Above ₹10,000', value: '10000-plus' },
                    ].map((range) => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={priceRange === range.value}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* B2B Toggle */}
                <div className="border-t pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showB2BPrices}
                      onChange={(e) => setShowB2BPrices(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Show B2B Bulk Prices</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    View discounted prices for bulk orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </p>
              <select 
                className="border rounded-lg px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
