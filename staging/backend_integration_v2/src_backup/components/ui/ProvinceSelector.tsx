import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  School, 
  Users, 
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface Province {
  id: number;
  name: string;
  code: string;
  schools: number;
  students: number;
  teachers: number;
  region: 'شمال' | 'وسط' | 'جنوب' | 'شرق' | 'غرب';
}

const algerianProvinces: Province[] = [
  { id: 1, name: 'أدرار', code: '01', schools: 245, students: 45230, teachers: 2150, region: 'جنوب' },
  { id: 2, name: 'الشلف', code: '02', schools: 420, students: 78540, teachers: 3720, region: 'شمال' },
  { id: 3, name: 'الأغواط', code: '03', schools: 315, students: 58920, teachers: 2890, region: 'وسط' },
  { id: 4, name: 'أم البواقي', code: '04', schools: 380, students: 69850, teachers: 3240, region: 'شرق' },
  { id: 5, name: 'باتنة', code: '05', schools: 650, students: 125640, teachers: 5980, region: 'شرق' },
  { id: 6, name: 'بجاية', code: '06', schools: 520, students: 98750, teachers: 4650, region: 'شمال' },
  { id: 7, name: 'بسكرة', code: '07', schools: 450, students: 85630, teachers: 4120, region: 'جنوب' },
  { id: 8, name: 'بشار', code: '08', schools: 280, students: 52340, teachers: 2480, region: 'جنوب' },
  { id: 9, name: 'البليدة', code: '09', schools: 580, students: 112450, teachers: 5320, region: 'وسط' },
  { id: 10, name: 'البويرة', code: '10', schools: 420, students: 78920, teachers: 3740, region: 'وسط' },
  { id: 11, name: 'تمنراست', code: '11', schools: 95, students: 18450, teachers: 890, region: 'جنوب' },
  { id: 12, name: 'تبسة', code: '12', schools: 320, students: 59840, teachers: 2850, region: 'شرق' },
  { id: 13, name: 'تلمسان', code: '13', schools: 480, students: 89650, teachers: 4280, region: 'غرب' },
  { id: 14, name: 'تيارت', code: '14', schools: 410, students: 76230, teachers: 3620, region: 'غرب' },
  { id: 15, name: 'تيزي وزو', code: '15', schools: 550, students: 103840, teachers: 4920, region: 'شمال' },
  { id: 16, name: 'الجزائر', code: '16', schools: 850, students: 165420, teachers: 7850, region: 'وسط' },
  { id: 17, name: 'الجلفة', code: '17', schools: 520, students: 98450, teachers: 4680, region: 'وسط' },
  { id: 18, name: 'جيجل', code: '18', schools: 340, students: 63250, teachers: 3020, region: 'شمال' },
  { id: 19, name: 'سطيف', code: '19', schools: 720, students: 138950, teachers: 6580, region: 'شرق' },
  { id: 20, name: 'سعيدة', code: '20', schools: 290, students: 54320, teachers: 2580, region: 'غرب' },
  { id: 21, name: 'سكيكدة', code: '21', schools: 380, students: 71240, teachers: 3380, region: 'شمال' },
  { id: 22, name: 'سيدي بلعباس', code: '22', schools: 350, students: 65840, teachers: 3120, region: 'غرب' },
  { id: 23, name: 'عنابة', code: '23', schools: 420, students: 79650, teachers: 3780, region: 'شرق' },
  { id: 24, name: 'قالمة', code: '24', schools: 310, students: 58420, teachers: 2780, region: 'شرق' },
  { id: 25, name: 'قسنطينة', code: '25', schools: 580, students: 112340, teachers: 5320, region: 'شرق' },
  { id: 26, name: 'المدية', code: '26', schools: 450, students: 84650, teachers: 4020, region: 'وسط' },
  { id: 27, name: 'مستغانم', code: '27', schools: 380, students: 71450, teachers: 3390, region: 'غرب' },
  { id: 28, name: 'المسيلة', code: '28', schools: 520, students: 97840, teachers: 4650, region: 'وسط' },
  { id: 29, name: 'معسكر', code: '29', schools: 420, students: 78950, teachers: 3750, region: 'غرب' },
  { id: 30, name: 'ورقلة', code: '30', schools: 350, students: 66420, teachers: 3150, region: 'جنوب' },
  { id: 31, name: 'وهران', code: '31', schools: 680, students: 132450, teachers: 6280, region: 'غرب' },
  { id: 32, name: 'البيض', code: '32', schools: 180, students: 33450, teachers: 1590, region: 'غرب' },
  { id: 33, name: 'إليزي', code: '33', schools: 85, students: 16240, teachers: 780, region: 'جنوب' },
  { id: 34, name: 'برج بوعريريج', code: '34', schools: 380, students: 71850, teachers: 3410, region: 'شرق' },
  { id: 35, name: 'بومرداس', code: '35', schools: 420, students: 79450, teachers: 3770, region: 'شمال' },
  { id: 36, name: 'الطارف', code: '36', schools: 240, students: 45320, teachers: 2150, region: 'شرق' },
  { id: 37, name: 'تندوف', code: '37', schools: 65, students: 12450, teachers: 590, region: 'جنوب' },
  { id: 38, name: 'تسمسيلت', code: '38', schools: 220, students: 41250, teachers: 1960, region: 'غرب' },
  { id: 39, name: 'الوادي', code: '39', schools: 380, students: 72450, teachers: 3440, region: 'جنوب' },
  { id: 40, name: 'خنشلة', code: '40', schools: 290, students: 54820, teachers: 2610, region: 'شرق' },
  { id: 41, name: 'سوق أهراس', code: '41', schools: 280, students: 52640, teachers: 2500, region: 'شرق' },
  { id: 42, name: 'تيبازة', code: '42', schools: 380, students: 72150, teachers: 3420, region: 'شمال' },
  { id: 43, name: 'ميلة', code: '43', schools: 420, students: 79250, teachers: 3760, region: 'شرق' },
  { id: 44, name: 'عين الدفلى', code: '44', schools: 450, students: 85420, teachers: 4060, region: 'وسط' },
  { id: 45, name: 'النعامة', code: '45', schools: 150, students: 28450, teachers: 1350, region: 'غرب' },
  { id: 46, name: 'عين تموشنت', code: '46', schools: 220, students: 41850, teachers: 1990, region: 'غرب' },
  { id: 47, name: 'غرداية', code: '47', schools: 280, students: 53240, teachers: 2530, region: 'جنوب' },
  { id: 48, name: 'غليزان', code: '48', schools: 420, students: 79850, teachers: 3790, region: 'غرب' },
  { id: 49, name: 'تيميمون', code: '49', schools: 120, students: 22450, teachers: 1070, region: 'جنوب' },
  { id: 50, name: 'برج باجي مختار', code: '50', schools: 95, students: 18250, teachers: 870, region: 'جنوب' },
  { id: 51, name: 'أولاد جلال', code: '51', schools: 110, students: 20850, teachers: 990, region: 'جنوب' },
  { id: 52, name: 'بني عباس', code: '52', schools: 85, students: 16450, teachers: 780, region: 'جنوب' },
  { id: 53, name: 'إن صالح', code: '53', schools: 75, students: 14250, teachers: 680, region: 'جنوب' },
  { id: 54, name: 'إن قزام', code: '54', schools: 65, students: 12850, teachers: 610, region: 'جنوب' },
  { id: 55, name: 'تقرت', code: '55', schools: 180, students: 34250, teachers: 1630, region: 'جنوب' },
  { id: 56, name: 'جانت', code: '56', schools: 55, students: 10450, teachers: 500, region: 'جنوب' },
  { id: 57, name: 'المغير', code: '57', schools: 95, students: 18450, teachers: 880, region: 'جنوب' },
  { id: 58, name: 'المنيعة', code: '58', schools: 85, students: 16250, teachers: 770, region: 'جنوب' }
];

interface ProvinceSelectorProps {
  onProvinceSelect: (province: Province) => void;
  selectedProvince?: Province | null;
}

export function ProvinceSelector({ onProvinceSelect, selectedProvince }: ProvinceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const regions = ['شمال', 'وسط', 'جنوب', 'شرق', 'غرب'];

  const filteredProvinces = algerianProvinces.filter(province => {
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === '' || province.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getRegionColor = (region: string) => {
    const colors = {
      'شمال': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'وسط': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'جنوب': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'شرق': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'غرب': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          اختيار الولاية
        </CardTitle>
        <CardDescription>
          اختر الولاية التي تريد إدارة مديرية التعليم الخاصة بها
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن الولاية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedRegion === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion('')}
            >
              جميع المناطق
            </Button>
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>

        {/* الولاية المختارة */}
        {selectedProvince && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800 dark:text-green-200">
                الولاية المختارة: {selectedProvince.name}
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-green-600" />
                <span>{selectedProvince.schools} مدرسة</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span>{selectedProvince.students.toLocaleString()} تلميذ</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span>{selectedProvince.teachers.toLocaleString()} معلم</span>
              </div>
            </div>
          </div>
        )}

        {/* قائمة الولايات */}
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProvinces.map((province) => (
              <div
                key={province.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedProvince?.id === province.id 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onProvinceSelect(province)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{province.name}</h4>
                  <Badge className={`text-xs ${getRegionColor(province.region)}`}>
                    {province.region}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>المدارس:</span>
                    <span>{province.schools}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التلاميذ:</span>
                    <span>{province.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المعلمون:</span>
                    <span>{province.teachers.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProvinces.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>لا توجد ولايات تطابق البحث</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}