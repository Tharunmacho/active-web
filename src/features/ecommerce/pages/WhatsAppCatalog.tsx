import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Share2,
  Copy,
  Download,
  ExternalLink,
  Check,
  MessageCircle,
  Link as LinkIcon,
  Package,
  Image,
  DollarSign,
  Star
} from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: 'Smart Watch Series 7',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    rating: 4.7,
    inStock: true,
  },
  {
    id: 3,
    name: 'Gaming Keyboard',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200',
    rating: 4.6,
    inStock: true,
  },
];

export default function WhatsAppCatalog() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([1, 2, 3]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [catalogUrl, setCatalogUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const storeName = 'TechGear Official Store';
  const storePhone = '+919876543210';

  const generateCatalogUrl = () => {
    const productList = selectedProducts
      .map(id => products.find(p => p.id === id))
      .filter(Boolean)
      .map(p => `${p!.name} - ₹${p!.price.toLocaleString()}`)
      .join('%0A');

    const message = `🛍️ *${storeName}* Product Catalog%0A%0A${productList}%0A%0A🔗 Shop Now: https://techgear.shop/catalog%0A📞 Contact: ${storePhone}`;
    const url = `https://wa.me/?text=${message}`;
    
    setCatalogUrl(url);
    return url;
  };

  const generateQRCode = async () => {
    const url = generateCatalogUrl();
    try {
      // Use a free QR code API service
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&color=25D366&bgcolor=FFFFFF`;
      setQrCodeUrl(qrApiUrl);
      setQrGenerated(true);
    } catch (err) {
      console.error('QR Code generation error:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = 'whatsapp-catalog-qr.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const toggleProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const shareOnWhatsApp = () => {
    const url = generateCatalogUrl();
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="h-10 w-10" />
            <h1 className="text-4xl font-bold">WhatsApp Catalog Sharing</h1>
          </div>
          <p className="text-green-100 text-lg">Generate shareable links and QR codes for your product catalog</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Selection */}
          <div className="space-y-6">
            {/* Store Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Store Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Store Name</label>
                    <Input value={storeName} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                    <Input value={storePhone} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Select Products</h3>
                  <Badge>{selectedProducts.length} Selected</Badge>
                </div>

                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProducts.includes(product.id)
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProduct(product.id)}
                          className="w-5 h-5"
                        />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-lg font-bold text-green-600">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={product.inStock ? 'default' : 'secondary'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={generateQRCode}
                  disabled={selectedProducts.length === 0}
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  Generate Catalog Link & QR Code
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Content */}
          <div className="space-y-6">
            {/* QR Code Display */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">QR Code</h3>
                
                {qrGenerated ? (
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-xl inline-block shadow-lg mb-4">
                      <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Scan this QR code to open catalog in WhatsApp
                    </p>
                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={downloadQRCode}>
                        <Download className="h-4 w-4 mr-2" />
                        Download QR
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={shareOnWhatsApp}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      Select products and click generate to create your QR code
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shareable Link */}
            {catalogUrl && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Shareable Link</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 break-all">{catalogUrl}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={shareOnWhatsApp}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview */}
            {qrGenerated && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Message Preview</h3>
                  
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-900">WhatsApp Message</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-bold">🛍️ {storeName} Product Catalog</p>
                      <div className="space-y-1">
                        {selectedProducts
                          .map(id => products.find(p => p.id === id))
                          .filter(Boolean)
                          .map(p => (
                            <p key={p!.id} className="text-gray-700">
                              {p!.name} - ₹{p!.price.toLocaleString()}
                            </p>
                          ))}
                      </div>
                      <p className="text-blue-600">🔗 Shop Now: https://techgear.shop/catalog</p>
                      <p className="text-gray-700">📞 Contact: {storePhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Catalog Stats</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{selectedProducts.length}</p>
                    <p className="text-xs text-blue-600">Products Selected</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      ₹{selectedProducts
                        .map(id => products.find(p => p.id === id)?.price || 0)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
