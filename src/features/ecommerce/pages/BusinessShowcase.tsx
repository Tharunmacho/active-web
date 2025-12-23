import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Award,
  Users,
  Package,
  Truck,
  Shield,
  ThumbsUp,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const storeInfo = {
  name: 'TechGear Official Store',
  tagline: 'Your Trusted Electronics Partner Since 2010',
  rating: 4.8,
  totalReviews: 15234,
  totalOrders: 50000,
  responseRate: 98,
  logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200',
  banner: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=1200',
};

const contactInfo = {
  address: '123, Tech Park, MG Road, Bangalore - 560001, Karnataka, India',
  phone: '+91 9876543210',
  email: 'contact@techgear.com',
  website: 'www.techgear.com',
  hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
};

const features = [
  { icon: Shield, title: '100% Authentic', description: 'Genuine products only' },
  { icon: Truck, title: 'Fast Delivery', description: '2-3 days shipping' },
  { icon: Award, title: 'Quality Assured', description: 'Premium quality guaranteed' },
  { icon: ThumbsUp, title: 'Easy Returns', description: '7-day return policy' },
];

const topProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    rating: 4.5,
    sold: 2500,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    rating: 4.7,
    sold: 1800,
  },
  {
    id: 3,
    name: 'Gaming Keyboard',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300',
    rating: 4.6,
    sold: 3200,
  },
];

const reviews = [
  {
    id: 1,
    name: 'Rahul Kumar',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent products and fast delivery. Highly recommend this store!',
    product: 'Wireless Headphones',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 4,
    date: '1 week ago',
    comment: 'Good quality products. Customer service was very helpful.',
    product: 'Smart Watch',
  },
  {
    id: 3,
    name: 'Amit Verma',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Amazing store! All products are genuine and authentic.',
    product: 'Gaming Keyboard',
  },
];

export default function BusinessShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${storeInfo.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Store Header */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={storeInfo.logo}
                alt={storeInfo.name}
                className="w-32 h-32 rounded-lg border-4 border-white shadow-lg object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{storeInfo.name}</h1>
                    <p className="text-gray-600 mb-3">{storeInfo.tagline}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                        <Star className="h-5 w-5 fill-green-600 text-green-600" />
                        <span className="font-bold text-green-700">{storeInfo.rating}</span>
                        <span className="text-sm text-gray-600">
                          ({storeInfo.totalReviews.toLocaleString()} reviews)
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        Verified Seller
                      </Badge>
                    </div>
                  </div>

                  <Button size="lg">
                    <Store className="h-5 w-5 mr-2" />
                    Visit Store
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Package className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold">{storeInfo.totalOrders.toLocaleString()}+</p>
                    <p className="text-sm text-gray-600">Orders Completed</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
                    <p className="text-2xl font-bold">{storeInfo.responseRate}%</p>
                    <p className="text-sm text-gray-600">Response Rate</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                    <p className="text-2xl font-bold">10+</p>
                    <p className="text-sm text-gray-600">Years in Business</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Top Products</h2>
                  <Button variant="outline" size="sm">
                    View All
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.sold} sold)</span>
                      </div>
                      <p className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  <Button variant="outline" size="sm">Write Review</Button>
                </div>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                      <Badge variant="secondary" className="text-xs">
                        {review.product}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Contact Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Address</p>
                        <p className="text-sm text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Phone</p>
                        <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Email</p>
                        <p className="text-sm text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Website</p>
                        <a href={`https://${contactInfo.website}`} className="text-sm text-blue-600 hover:underline">
                          {contactInfo.website}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Business Hours</p>
                        <p className="text-sm text-gray-600">{contactInfo.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Facebook className="h-5 w-5 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Twitter className="h-5 w-5 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Instagram className="h-5 w-5 mr-2" />
                      Instagram
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Linkedin className="h-5 w-5 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card>
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.7742534268835!2d77.59578631482128!3d12.971598990859257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1635849387892!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
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
