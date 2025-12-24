import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Tag,
  ChevronLeft,
  Check,
  Zap,
  Award
} from 'lucide-react';

const productData = {
  id: 1,
  name: 'Premium Wireless Headphones with Active Noise Cancellation',
  brand: 'TechAudio Pro',
  price: 5999,
  originalPrice: 8999,
  rating: 4.5,
  reviews: 2345,
  inStock: true,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
  ],
  specifications: {
    'Brand': 'TechAudio Pro',
    'Model': 'TAP-WH3000',
    'Connectivity': 'Bluetooth 5.0',
    'Battery Life': '30 hours',
    'Charging Time': '2 hours',
    'Weight': '250g',
    'Color': 'Black',
    'Warranty': '1 Year',
  },
  features: [
    'Active Noise Cancellation (ANC)',
    'Premium Sound Quality with Deep Bass',
    'Wireless Bluetooth 5.0 Connectivity',
    '30-Hour Battery Life',
    'Fast Charging Support',
    'Comfortable Over-Ear Design',
    'Built-in Microphone for Calls',
    'Foldable & Portable Design',
  ],
  highlights: [
    { icon: Truck, text: 'Free Delivery', subtext: '2-3 days' },
    { icon: Shield, text: '1 Year Warranty', subtext: 'Manufacturer warranty' },
    { icon: RotateCcw, text: '7-Day Returns', subtext: 'Easy returns' },
    { icon: Tag, text: 'Best Price', subtext: 'Guaranteed' },
  ],
};

const reviews = [
  {
    id: 1,
    name: 'Rahul Kumar',
    rating: 5,
    date: '2 days ago',
    verified: true,
    comment: 'Excellent sound quality! The noise cancellation is amazing. Worth every penny.',
    helpful: 234,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 4,
    date: '1 week ago',
    verified: true,
    comment: 'Good product but could be more comfortable for long hours. Sound quality is great though.',
    helpful: 156,
  },
  {
    id: 3,
    name: 'Amit Verma',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    comment: 'Best headphones in this price range. Battery life is impressive!',
    helpful: 189,
  },
];

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      originalPrice: productData.originalPrice,
      quantity: quantity,
      image: productData.images[0],
      inStock: productData.inStock,
      seller: productData.brand,
    });
    toast.success(`${productData.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/ecommerce/catalog')} className="text-blue-600 hover:underline">
              <ChevronLeft className="h-4 w-4 inline" />
              Back to Catalog
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Electronics</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Headphones</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden mb-4">
              <CardContent className="p-0">
                <div className="relative bg-white">
                  <img
                    src={productData.images[selectedImage]}
                    alt={productData.name}
                    className="w-full h-[500px] object-contain"
                  />
                  {!productData.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Out of Stock</span>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Badge className="absolute top-4 left-4 bg-red-600">
                    {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-1 border-2 rounded-lg overflow-hidden ${
                    selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">{productData.brand}</p>
              <h1 className="text-3xl font-bold mb-3">{productData.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="font-semibold">{productData.rating}</span>
                </div>
                <span className="text-gray-600">
                  {productData.reviews.toLocaleString()} ratings & reviews
                </span>
              </div>

              <Badge className="bg-green-100 text-green-700 mb-4">
                <Zap className="h-3 w-3 mr-1" />
                Best Seller
              </Badge>
            </div>

            {/* Price */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold">₹{productData.price.toLocaleString()}</span>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{productData.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-green-600 font-semibold">
                    {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% off
                  </span>
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {productData.highlights.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <item.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm">{item.text}</p>
                      <p className="text-xs text-gray-500">{item.subtext}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    handleAddToCart();
                    navigate('/ecommerce/checkout');
                  }}
                >
                  Buy Now
                </Button>
              </div>

              <Button variant="ghost" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Product
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="font-semibold">TechGear Official Store</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <ul className="space-y-3">
                  {productData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <Button variant="outline">Write a Review</Button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{review.name}</p>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
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
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        👍 Helpful ({review.helpful})
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Delivery Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Delivery Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Free Delivery</p>
                        <p className="text-xs text-gray-600">Delivered in 2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Secure Transaction</p>
                        <p className="text-xs text-gray-600">Safe & encrypted payments</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">7-Day Returns</p>
                        <p className="text-xs text-gray-600">Easy return policy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Products */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Similar Products</h3>
                  <p className="text-sm text-gray-600">Coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
