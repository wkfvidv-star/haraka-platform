import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart,
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Tag,
  Image,
  Gift,
  Percent,
  Calendar,
  Search,
  Filter
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'wearables' | 'accessories' | 'supplements' | 'equipment' | 'clothing';
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  images: string[];
  createdDate: string;
  lastUpdated: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_shipping';
  value: number;
  minPurchase?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  usageCount: number;
  maxUsage?: number;
  applicableProducts: string[];
}

export function StoreManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod_1',
      name: 'ساعة ذكية رياضية متقدمة',
      description: 'ساعة ذكية مع مراقبة معدل ضربات القلب وتتبع النشاط وGPS مدمج',
      category: 'wearables',
      price: 25000,
      originalPrice: 30000,
      discount: 17,
      stock: 45,
      sold: 128,
      rating: 4.7,
      reviews: 89,
      status: 'active',
      featured: true,
      images: ['watch1.jpg', 'watch2.jpg'],
      createdDate: '2024-09-15',
      lastUpdated: '2024-10-16'
    },
    {
      id: 'prod_2',
      name: 'سوار اللياقة البدنية الذكي',
      description: 'سوار خفيف الوزن لتتبع الخطوات والسعرات المحروقة ومراقبة النوم',
      category: 'wearables',
      price: 12000,
      stock: 78,
      sold: 234,
      rating: 4.5,
      reviews: 156,
      status: 'active',
      featured: false,
      images: ['band1.jpg'],
      createdDate: '2024-08-20',
      lastUpdated: '2024-10-14'
    },
    {
      id: 'prod_3',
      name: 'مكملات البروتين الطبيعي',
      description: 'مكمل غذائي طبيعي لدعم بناء العضلات والتعافي بعد التمرين',
      category: 'supplements',
      price: 8500,
      stock: 0,
      sold: 67,
      rating: 4.2,
      reviews: 34,
      status: 'out_of_stock',
      featured: false,
      images: ['protein1.jpg'],
      createdDate: '2024-07-10',
      lastUpdated: '2024-10-12'
    }
  ]);

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 'offer_1',
      title: 'خصم 20% على الأجهزة الذكية',
      description: 'خصم خاص على جميع الساعات الذكية وأسوار اللياقة البدنية',
      type: 'percentage',
      value: 20,
      minPurchase: 15000,
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      status: 'active',
      usageCount: 45,
      maxUsage: 100,
      applicableProducts: ['prod_1', 'prod_2']
    },
    {
      id: 'offer_2',
      title: 'شحن مجاني للطلبات فوق 20,000 دج',
      description: 'استمتع بالشحن المجاني عند الشراء بقيمة 20,000 دينار أو أكثر',
      type: 'free_shipping',
      value: 0,
      minPurchase: 20000,
      startDate: '2024-10-15',
      endDate: '2024-11-15',
      status: 'active',
      usageCount: 23,
      applicableProducts: []
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  const categoryOptions = ['الكل', 'أجهزة ذكية', 'إكسسوارات', 'مكملات', 'معدات', 'ملابس'];
  const statusOptions = ['الكل', 'نشط', 'غير نشط', 'نفذ المخزون'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wearables': return 'bg-blue-100 text-blue-800';
      case 'accessories': return 'bg-green-100 text-green-800';
      case 'supplements': return 'bg-purple-100 text-purple-800';
      case 'equipment': return 'bg-orange-100 text-orange-800';
      case 'clothing': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOfferTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-green-100 text-green-800';
      case 'fixed_amount': return 'bg-blue-100 text-blue-800';
      case 'buy_one_get_one': return 'bg-purple-100 text-purple-800';
      case 'free_shipping': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'الكل' ||
                           (filterCategory === 'أجهزة ذكية' && product.category === 'wearables') ||
                           (filterCategory === 'إكسسوارات' && product.category === 'accessories') ||
                           (filterCategory === 'مكملات' && product.category === 'supplements') ||
                           (filterCategory === 'معدات' && product.category === 'equipment') ||
                           (filterCategory === 'ملابس' && product.category === 'clothing');
    
    const matchesStatus = filterStatus === 'الكل' ||
                         (filterStatus === 'نشط' && product.status === 'active') ||
                         (filterStatus === 'غير نشط' && product.status === 'inactive') ||
                         (filterStatus === 'نفذ المخزون' && product.status === 'out_of_stock');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalRevenue = products.reduce((acc, p) => acc + (p.price * p.sold), 0);
  const totalSold = products.reduce((acc, p) => acc + p.sold, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            إدارة المتجر والعروض
          </CardTitle>
          <CardDescription className="text-green-100">
            إدارة شاملة للمنتجات والعروض في متجر الأجهزة الذكية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="text-sm text-green-100">إجمالي المنتجات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{activeProducts}</div>
              <div className="text-sm text-green-100">منتج نشط</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{totalSold}</div>
              <div className="text-sm text-green-100">إجمالي المبيعات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}م</div>
              <div className="text-sm text-green-100">الإيرادات (دج)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">إدارة المنتجات</TabsTrigger>
          <TabsTrigger value="offers">إدارة العروض</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">البحث</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ابحث في المنتجات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">الفئة</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">الحالة</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">إجراءات</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>إضافة منتج جديد</DialogTitle>
                      <DialogDescription>
                        أدخل تفاصيل المنتج الجديد
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">اسم المنتج</Label>
                        <Input id="name" placeholder="أدخل اسم المنتج" />
                      </div>
                      <div>
                        <Label htmlFor="category">الفئة</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wearables">أجهزة ذكية</SelectItem>
                            <SelectItem value="accessories">إكسسوارات</SelectItem>
                            <SelectItem value="supplements">مكملات</SelectItem>
                            <SelectItem value="equipment">معدات</SelectItem>
                            <SelectItem value="clothing">ملابس</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">السعر (دج)</Label>
                        <Input id="price" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="stock">المخزون</Label>
                        <Input id="stock" type="number" placeholder="0" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea id="description" placeholder="وصف المنتج" />
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button className="flex-1">إضافة المنتج</Button>
                        <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(product.category)} size="sm">
                        {product.category === 'wearables' && 'أجهزة ذكية'}
                        {product.category === 'accessories' && 'إكسسوارات'}
                        {product.category === 'supplements' && 'مكملات'}
                        {product.category === 'equipment' && 'معدات'}
                        {product.category === 'clothing' && 'ملابس'}
                      </Badge>
                      {product.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800" size="sm">
                          مميز
                        </Badge>
                      )}
                    </div>
                    <Badge className={getStatusColor(product.status)} size="sm">
                      {product.status === 'active' && 'نشط'}
                      {product.status === 'inactive' && 'غير نشط'}
                      {product.status === 'out_of_stock' && 'نفذ المخزون'}
                    </Badge>
                  </div>

                  <h4 className="font-medium text-lg mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} تقييم)</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          {product.price.toLocaleString()} دج
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toLocaleString()} دج
                          </span>
                        )}
                      </div>
                      {product.discount && (
                        <div className="text-xs text-red-600">خصم {product.discount}%</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs mb-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="font-bold text-blue-600">{product.stock}</div>
                      <div className="text-gray-500">متوفر</div>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="font-bold text-green-600">{product.sold}</div>
                      <div className="text-gray-500">مباع</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {/* Add Offer Button */}
          <div className="flex justify-end">
            <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة عرض جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إضافة عرض جديد</DialogTitle>
                  <DialogDescription>
                    أنشئ عرضاً خاصاً لجذب العملاء
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">عنوان العرض</Label>
                    <Input id="title" placeholder="أدخل عنوان العرض" />
                  </div>
                  <div>
                    <Label htmlFor="type">نوع العرض</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع العرض" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">خصم بالنسبة المئوية</SelectItem>
                        <SelectItem value="fixed_amount">خصم بمبلغ ثابت</SelectItem>
                        <SelectItem value="buy_one_get_one">اشتري واحد واحصل على آخر</SelectItem>
                        <SelectItem value="free_shipping">شحن مجاني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">قيمة الخصم</Label>
                    <Input id="value" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="startDate">تاريخ البداية</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">تاريخ النهاية</Label>
                    <Input id="endDate" type="date" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">وصف العرض</Label>
                    <Textarea id="description" placeholder="وصف تفصيلي للعرض" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button className="flex-1">إنشاء العرض</Button>
                    <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Offers List */}
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg">{offer.title}</h4>
                        <Badge className={getOfferTypeColor(offer.type)} size="sm">
                          {offer.type === 'percentage' && 'خصم نسبي'}
                          {offer.type === 'fixed_amount' && 'خصم ثابت'}
                          {offer.type === 'buy_one_get_one' && 'اشتري واحصل'}
                          {offer.type === 'free_shipping' && 'شحن مجاني'}
                        </Badge>
                        <Badge className={offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} size="sm">
                          {offer.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div className="font-bold text-purple-600">
                            {offer.type === 'percentage' ? `${offer.value}%` : 
                             offer.type === 'fixed_amount' ? `${offer.value} دج` : 
                             offer.type === 'free_shipping' ? 'مجاني' : '1+1'}
                          </div>
                          <div className="text-gray-500">قيمة العرض</div>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="font-bold text-blue-600">{offer.usageCount}</div>
                          <div className="text-gray-500">مرات الاستخدام</div>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="font-bold text-green-600">{offer.startDate}</div>
                          <div className="text-gray-500">تاريخ البداية</div>
                        </div>
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                          <div className="font-bold text-red-600">{offer.endDate}</div>
                          <div className="text-gray-500">تاريخ النهاية</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}