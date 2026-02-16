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
  Filter,
  Save,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'wearables' | 'accessories' | 'tools' | 'supplements';
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
  specifications: Record<string, string>;
  createdDate: string;
  lastUpdated: string;
}

interface PromotionalOffer {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_shipping' | 'bundle';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  usageCount: number;
  maxUsage?: number;
  applicableProducts: string[];
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'coaches';
  priority: 'low' | 'medium' | 'high';
}

export function EnhancedStoreManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod_1',
      name: 'ساعة ذكية رياضية Pro X1',
      description: 'ساعة ذكية متطورة مع مراقبة معدل ضربات القلب وتتبع النشاط وGPS مدمج ومقاومة للماء',
      category: 'wearables',
      price: 28000,
      originalPrice: 35000,
      discount: 20,
      stock: 45,
      sold: 128,
      rating: 4.7,
      reviews: 89,
      status: 'active',
      featured: true,
      images: ['watch1.jpg', 'watch2.jpg', 'watch3.jpg'],
      specifications: {
        'البطارية': '7 أيام',
        'المقاومة': 'IP68',
        'الشاشة': '1.4 بوصة AMOLED',
        'التوافق': 'Android/iOS'
      },
      createdDate: '2025-09-15',
      lastUpdated: '2025-10-16'
    },
    {
      id: 'prod_2',
      name: 'سوار اللياقة البدنية الذكي FitBand Pro',
      description: 'سوار خفيف الوزن لتتبع الخطوات والسعرات المحروقة ومراقبة النوم مع إشعارات ذكية',
      category: 'wearables',
      price: 15000,
      originalPrice: 18000,
      discount: 17,
      stock: 78,
      sold: 234,
      rating: 4.5,
      reviews: 156,
      status: 'active',
      featured: false,
      images: ['band1.jpg', 'band2.jpg'],
      specifications: {
        'البطارية': '14 يوم',
        'المقاومة': '5ATM',
        'الوزن': '25 جرام',
        'الألوان': '5 ألوان متاحة'
      },
      createdDate: '2025-08-20',
      lastUpdated: '2025-10-14'
    },
    {
      id: 'prod_3',
      name: 'جهاز قياس ضغط الدم الذكي',
      description: 'جهاز قياس ضغط الدم الرقمي مع اتصال بلوتوث وتطبيق مخصص لتتبع القراءات',
      category: 'tools',
      price: 12500,
      stock: 32,
      sold: 67,
      rating: 4.3,
      reviews: 34,
      status: 'active',
      featured: false,
      images: ['bp_monitor1.jpg'],
      specifications: {
        'الدقة': '±3 mmHg',
        'الذاكرة': '120 قراءة',
        'البطارية': 'AAA x4',
        'الضمان': 'سنتان'
      },
      createdDate: '2025-07-10',
      lastUpdated: '2025-10-12'
    },
    {
      id: 'prod_4',
      name: 'ميزان ذكي لتحليل الجسم',
      description: 'ميزان رقمي ذكي لقياس الوزن ونسبة الدهون والعضلات مع تطبيق مجاني',
      category: 'tools',
      price: 8500,
      stock: 0,
      sold: 45,
      rating: 4.1,
      reviews: 28,
      status: 'out_of_stock',
      featured: false,
      images: ['scale1.jpg'],
      specifications: {
        'السعة': '180 كيلو',
        'المستخدمين': '8 ملفات شخصية',
        'التحليل': '13 مؤشر صحي',
        'التوافق': 'WiFi + Bluetooth'
      },
      createdDate: '2025-06-05',
      lastUpdated: '2025-10-10'
    }
  ]);

  const [promotionalOffers, setPromotionalOffers] = useState<PromotionalOffer[]>([
    {
      id: 'offer_1',
      title: 'خصم العودة المدرسية - 25% على جميع الأساور الذكية',
      description: 'خصم خاص بمناسبة العودة المدرسية على جميع أساور اللياقة البدنية الذكية',
      type: 'percentage',
      value: 25,
      minPurchase: 10000,
      maxDiscount: 5000,
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      status: 'active',
      usageCount: 45,
      maxUsage: 100,
      applicableProducts: ['prod_2'],
      targetAudience: 'students',
      priority: 'high'
    },
    {
      id: 'offer_2',
      title: 'عرض الحزمة الصحية الشاملة',
      description: 'احصل على ساعة ذكية + جهاز قياس ضغط + ميزان ذكي بسعر مخفض',
      type: 'bundle',
      value: 15000,
      startDate: '2025-10-15',
      endDate: '2025-11-15',
      status: 'active',
      usageCount: 12,
      maxUsage: 50,
      applicableProducts: ['prod_1', 'prod_3', 'prod_4'],
      targetAudience: 'teachers',
      priority: 'medium'
    },
    {
      id: 'offer_3',
      title: 'شحن مجاني للطلبات فوق 20,000 دج',
      description: 'استمتع بالشحن المجاني عند الشراء بقيمة 20,000 دينار أو أكثر',
      type: 'free_shipping',
      value: 0,
      minPurchase: 20000,
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      status: 'active',
      usageCount: 78,
      applicableProducts: [],
      targetAudience: 'all',
      priority: 'low'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<PromotionalOffer | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  const categoryOptions = ['الكل', 'أجهزة قابلة للارتداء', 'إكسسوارات', 'أدوات طبية', 'مكملات'];
  const statusOptions = ['الكل', 'نشط', 'غير نشط', 'نفذ المخزون'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wearables': return 'bg-blue-100 text-blue-800';
      case 'accessories': return 'bg-green-100 text-green-800';
      case 'tools': return 'bg-purple-100 text-purple-800';
      case 'supplements': return 'bg-orange-100 text-orange-800';
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

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'الكل' ||
                           (filterCategory === 'أجهزة قابلة للارتداء' && product.category === 'wearables') ||
                           (filterCategory === 'إكسسوارات' && product.category === 'accessories') ||
                           (filterCategory === 'أدوات طبية' && product.category === 'tools') ||
                           (filterCategory === 'مكملات' && product.category === 'supplements');
    
    const matchesStatus = filterStatus === 'الكل' ||
                         (filterStatus === 'نشط' && product.status === 'active') ||
                         (filterStatus === 'غير نشط' && product.status === 'inactive') ||
                         (filterStatus === 'نفذ المخزون' && product.status === 'out_of_stock');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleProductSave = () => {
    // Logic to save product
    setShowProductDialog(false);
    setEditMode(false);
    setSelectedProduct(null);
  };

  const handleProductDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleOfferSave = () => {
    // Logic to save offer
    setShowOfferDialog(false);
    setEditMode(false);
    setSelectedOffer(null);
  };

  const handleOfferDelete = (offerId: string) => {
    setPromotionalOffers(prev => prev.filter(o => o.id !== offerId));
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalRevenue = products.reduce((acc, p) => acc + (p.price * p.sold), 0);
  const totalSold = products.reduce((acc, p) => acc + p.sold, 0);
  const activeOffers = promotionalOffers.filter(o => o.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            إدارة المتجر والمنتجات
          </CardTitle>
          <CardDescription className="text-emerald-100">
            إدارة شاملة للمنتجات والأدوات المرتبطة والعروض الترويجية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="text-sm text-emerald-100">إجمالي المنتجات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{activeProducts}</div>
              <div className="text-sm text-emerald-100">منتج نشط</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{totalSold}</div>
              <div className="text-sm text-emerald-100">قطعة مباعة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}م</div>
              <div className="text-sm text-emerald-100">الإيرادات (دج)</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{activeOffers}</div>
              <div className="text-sm text-emerald-100">عرض نشط</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">إدارة المنتجات</TabsTrigger>
          <TabsTrigger value="offers">العروض الترويجية</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Product Filters and Actions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <CardTitle className="text-sm">استيراد/تصدير</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Upload className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">إضافة منتج</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => {
                      setSelectedProduct(null);
                      setEditMode(false);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                      </DialogTitle>
                      <DialogDescription>
                        أدخل تفاصيل المنتج والمواصفات التقنية
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">اسم المنتج *</Label>
                        <Input id="name" placeholder="أدخل اسم المنتج" />
                      </div>
                      <div>
                        <Label htmlFor="category">الفئة *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wearables">أجهزة قابلة للارتداء</SelectItem>
                            <SelectItem value="accessories">إكسسوارات</SelectItem>
                            <SelectItem value="tools">أدوات طبية</SelectItem>
                            <SelectItem value="supplements">مكملات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">السعر (دج) *</Label>
                        <Input id="price" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">السعر الأصلي (دج)</Label>
                        <Input id="originalPrice" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="stock">المخزون *</Label>
                        <Input id="stock" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="status">الحالة</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="inactive">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">الوصف *</Label>
                        <Textarea id="description" placeholder="وصف تفصيلي للمنتج" rows={3} />
                      </div>
                      <div className="col-span-2">
                        <Label>المواصفات التقنية</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Input placeholder="المواصفة (مثل: البطارية)" />
                          <Input placeholder="القيمة (مثل: 7 أيام)" />
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          إضافة مواصفة
                        </Button>
                      </div>
                      <div className="col-span-2">
                        <Label>الصور</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">اسحب الصور هنا أو انقر للتحديد</p>
                        </div>
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button className="flex-1" onClick={handleProductSave}>
                          <Save className="h-4 w-4 mr-2" />
                          {editMode ? 'حفظ التعديلات' : 'إضافة المنتج'}
                        </Button>
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
                        {product.category === 'wearables' && 'قابل للارتداء'}
                        {product.category === 'accessories' && 'إكسسوارات'}
                        {product.category === 'tools' && 'أدوات طبية'}
                        {product.category === 'supplements' && 'مكملات'}
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

                  <h4 className="font-medium text-lg mb-2 line-clamp-2">{product.name}</h4>
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

                  {/* Specifications Preview */}
                  {Object.keys(product.specifications).length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">المواصفات الرئيسية:</div>
                      <div className="text-xs space-y-1">
                        {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditMode(true);
                        setShowProductDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => handleProductDelete(product.id)}
                    >
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
                <Button onClick={() => {
                  setSelectedOffer(null);
                  setEditMode(false);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة عرض ترويجي
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    {editMode ? 'تعديل العرض الترويجي' : 'إضافة عرض ترويجي جديد'}
                  </DialogTitle>
                  <DialogDescription>
                    أنشئ عرضاً ترويجياً جذاباً لزيادة المبيعات
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">عنوان العرض *</Label>
                    <Input id="title" placeholder="أدخل عنوان العرض الترويجي" />
                  </div>
                  <div>
                    <Label htmlFor="type">نوع العرض *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع العرض" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">خصم بالنسبة المئوية</SelectItem>
                        <SelectItem value="fixed_amount">خصم بمبلغ ثابت</SelectItem>
                        <SelectItem value="buy_one_get_one">اشتري واحد واحصل على آخر</SelectItem>
                        <SelectItem value="free_shipping">شحن مجاني</SelectItem>
                        <SelectItem value="bundle">عرض حزمة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">قيمة الخصم *</Label>
                    <Input id="value" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="minPurchase">الحد الأدنى للشراء (دج)</Label>
                    <Input id="minPurchase" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="maxDiscount">الحد الأقصى للخصم (دج)</Label>
                    <Input id="maxDiscount" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="startDate">تاريخ البداية *</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">تاريخ النهاية *</Label>
                    <Input id="endDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">الجمهور المستهدف</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجمهور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الجميع</SelectItem>
                        <SelectItem value="students">الطلاب</SelectItem>
                        <SelectItem value="teachers">المعلمون</SelectItem>
                        <SelectItem value="parents">أولياء الأمور</SelectItem>
                        <SelectItem value="coaches">المدربون</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">الأولوية</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الأولوية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">عالية</SelectItem>
                        <SelectItem value="medium">متوسطة</SelectItem>
                        <SelectItem value="low">منخفضة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxUsage">الحد الأقصى للاستخدام</Label>
                    <Input id="maxUsage" type="number" placeholder="غير محدود" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">وصف العرض *</Label>
                    <Textarea id="description" placeholder="وصف تفصيلي للعرض الترويجي" rows={3} />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button className="flex-1" onClick={handleOfferSave}>
                      <Save className="h-4 w-4 mr-2" />
                      {editMode ? 'حفظ التعديلات' : 'إنشاء العرض'}
                    </Button>
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
            {promotionalOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg">{offer.title}</h4>
                        <Badge className={getOfferStatusColor(offer.status)} size="sm">
                          {offer.status === 'active' && 'نشط'}
                          {offer.status === 'inactive' && 'غير نشط'}
                          {offer.status === 'expired' && 'منتهي'}
                          {offer.status === 'scheduled' && 'مجدول'}
                        </Badge>
                        <Badge className={getPriorityColor(offer.priority)} size="sm">
                          {offer.priority === 'high' && 'عالية'}
                          {offer.priority === 'medium' && 'متوسطة'}
                          {offer.priority === 'low' && 'منخفضة'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs mb-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div className="font-bold text-purple-600">
                            {offer.type === 'percentage' ? `${offer.value}%` : 
                             offer.type === 'fixed_amount' ? `${offer.value} دج` : 
                             offer.type === 'free_shipping' ? 'مجاني' : 
                             offer.type === 'bundle' ? `${offer.value} دج` : '1+1'}
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
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <div className="font-bold text-orange-600">
                            {offer.targetAudience === 'all' ? 'الجميع' :
                             offer.targetAudience === 'students' ? 'طلاب' :
                             offer.targetAudience === 'teachers' ? 'معلمون' :
                             offer.targetAudience === 'parents' ? 'أولياء أمور' : 'مدربون'}
                          </div>
                          <div className="text-gray-500">الجمهور المستهدف</div>
                        </div>
                      </div>

                      {offer.minPurchase && (
                        <div className="text-xs text-blue-600 mb-2">
                          الحد الأدنى للشراء: {offer.minPurchase.toLocaleString()} دج
                        </div>
                      )}

                      {offer.maxUsage && (
                        <div className="text-xs text-gray-500">
                          الحد الأقصى للاستخدام: {offer.maxUsage} مرة
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        عرض
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedOffer(offer);
                          setEditMode(true);
                          setShowOfferDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600"
                        onClick={() => handleOfferDelete(offer.id)}
                      >
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