import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Building2, Users } from 'lucide-react';

interface Province {
  id: string;
  name: string;
  arabicName: string;
  schools: number;
  students: number;
  teachers: number;
}

const algerianProvinces: Province[] = [
  { id: '01', name: 'Adrar', arabicName: 'أدرار', schools: 245, students: 45230, teachers: 2150 },
  { id: '02', name: 'Chlef', arabicName: 'الشلف', schools: 320, students: 78450, teachers: 3420 },
  { id: '03', name: 'Laghouat', arabicName: 'الأغواط', schools: 180, students: 32150, teachers: 1850 },
  { id: '04', name: 'Oum El Bouaghi', arabicName: 'أم البواقي', schools: 280, students: 56780, teachers: 2680 },
  { id: '05', name: 'Batna', arabicName: 'باتنة', schools: 450, students: 98320, teachers: 4250 },
  { id: '06', name: 'Béjaïa', arabicName: 'بجاية', schools: 380, students: 85670, teachers: 3890 },
  { id: '07', name: 'Biskra', arabicName: 'بسكرة', schools: 290, students: 67890, teachers: 3120 },
  { id: '08', name: 'Béchar', arabicName: 'بشار', schools: 160, students: 28450, teachers: 1650 },
  { id: '09', name: 'Blida', arabicName: 'البليدة', schools: 420, students: 92340, teachers: 4180 },
  { id: '10', name: 'Bouira', arabicName: 'البويرة', schools: 310, students: 71230, teachers: 3290 },
  { id: '11', name: 'Tamanrasset', arabicName: 'تمنراست', schools: 85, students: 15670, teachers: 890 },
  { id: '12', name: 'Tébessa', arabicName: 'تبسة', schools: 220, students: 48950, teachers: 2340 },
  { id: '13', name: 'Tlemcen', arabicName: 'تلمسان', schools: 350, students: 78920, teachers: 3650 },
  { id: '14', name: 'Tiaret', arabicName: 'تيارت', schools: 380, students: 84560, teachers: 3820 },
  { id: '15', name: 'Tizi Ouzou', arabicName: 'تيزي وزو', schools: 450, students: 95780, teachers: 4350 },
  { id: '16', name: 'Alger', arabicName: 'الجزائر', schools: 680, students: 156780, teachers: 7250 },
  { id: '17', name: 'Djelfa', arabicName: 'الجلفة', schools: 420, students: 89340, teachers: 4120 },
  { id: '18', name: 'Jijel', arabicName: 'جيجل', schools: 280, students: 62450, teachers: 2890 },
  { id: '19', name: 'Sétif', arabicName: 'سطيف', schools: 520, students: 112340, teachers: 5180 },
  { id: '20', name: 'Saïda', arabicName: 'سعيدة', schools: 190, students: 42780, teachers: 2050 },
  { id: '21', name: 'Skikda', arabicName: 'سكيكدة', schools: 340, students: 76890, teachers: 3540 },
  { id: '22', name: 'Sidi Bel Abbès', arabicName: 'سيدي بلعباس', schools: 280, students: 63450, teachers: 2980 },
  { id: '23', name: 'Annaba', arabicName: 'عنابة', schools: 290, students: 68920, teachers: 3190 },
  { id: '24', name: 'Guelma', arabicName: 'قالمة', schools: 220, students: 51230, teachers: 2420 },
  { id: '25', name: 'Constantine', arabicName: 'قسنطينة', schools: 480, students: 105670, teachers: 4890 },
  { id: '26', name: 'Médéa', arabicName: 'المدية', schools: 360, students: 82340, teachers: 3780 },
  { id: '27', name: 'Mostaganem', arabicName: 'مستغانم', schools: 320, students: 74560, teachers: 3420 },
  { id: '28', name: 'M\'Sila', arabicName: 'المسيلة', schools: 410, students: 89780, teachers: 4150 },
  { id: '29', name: 'Mascara', arabicName: 'معسكر', schools: 340, students: 78450, teachers: 3620 },
  { id: '30', name: 'Ouargla', arabicName: 'ورقلة', schools: 180, students: 38920, teachers: 1890 },
  { id: '31', name: 'Oran', arabicName: 'وهران', schools: 580, students: 128340, teachers: 5940 },
  { id: '32', name: 'El Bayadh', arabicName: 'البيض', schools: 120, students: 26780, teachers: 1340 },
  { id: '33', name: 'Illizi', arabicName: 'إليزي', schools: 45, students: 9450, teachers: 520 },
  { id: '34', name: 'Bordj Bou Arréridj', arabicName: 'برج بوعريريج', schools: 280, students: 64230, teachers: 2980 },
  { id: '35', name: 'Boumerdès', arabicName: 'بومرداس', schools: 350, students: 78920, teachers: 3650 },
  { id: '36', name: 'El Tarf', arabicName: 'الطارف', schools: 180, students: 41230, teachers: 1920 },
  { id: '37', name: 'Tindouf', arabicName: 'تندوف', schools: 35, students: 7890, teachers: 420 },
  { id: '38', name: 'Tissemsilt', arabicName: 'تسمسيلت', schools: 140, students: 32450, teachers: 1580 },
  { id: '39', name: 'El Oued', arabicName: 'الوادي', schools: 290, students: 65780, teachers: 3120 },
  { id: '40', name: 'Khenchela', arabicName: 'خنشلة', schools: 180, students: 41890, teachers: 1980 },
  { id: '41', name: 'Souk Ahras', arabicName: 'سوق أهراس', schools: 210, students: 48670, teachers: 2290 },
  { id: '42', name: 'Tipaza', arabicName: 'تيبازة', schools: 280, students: 63450, teachers: 2940 },
  { id: '43', name: 'Mila', arabicName: 'ميلة', schools: 340, students: 76890, teachers: 3520 },
  { id: '44', name: 'Aïn Defla', arabicName: 'عين الدفلى', schools: 320, students: 72340, teachers: 3380 },
  { id: '45', name: 'Naâma', arabicName: 'النعامة', schools: 85, students: 19450, teachers: 980 },
  { id: '46', name: 'Aïn Témouchent', arabicName: 'عين تموشنت', schools: 180, students: 42780, teachers: 2050 },
  { id: '47', name: 'Ghardaïa', arabicName: 'غرداية', schools: 160, students: 36890, teachers: 1780 },
  { id: '48', name: 'Relizane', arabicName: 'غليزان', schools: 320, students: 74560, teachers: 3420 },
  { id: '49', name: 'Timimoun', arabicName: 'تيميمون', schools: 65, students: 14230, teachers: 720 },
  { id: '50', name: 'Bordj Badji Mokhtar', arabicName: 'برج باجي مختار', schools: 25, students: 5670, teachers: 310 },
  { id: '51', name: 'Ouled Djellal', arabicName: 'أولاد جلال', schools: 45, students: 10890, teachers: 580 },
  { id: '52', name: 'Béni Abbès', arabicName: 'بني عباس', schools: 35, students: 7890, teachers: 420 },
  { id: '53', name: 'In Salah', arabicName: 'إن صالح', schools: 40, students: 8950, teachers: 480 },
  { id: '54', name: 'In Guezzam', arabicName: 'إن قزام', schools: 20, students: 4560, teachers: 250 },
  { id: '55', name: 'Touggourt', arabicName: 'تقرت', schools: 85, students: 19670, teachers: 980 },
  { id: '56', name: 'Djanet', arabicName: 'جانت', schools: 30, students: 6780, teachers: 360 },
  { id: '57', name: 'El M\'Ghair', arabicName: 'المغير', schools: 55, students: 12450, teachers: 650 },
  { id: '58', name: 'El Meniaa', arabicName: 'المنيعة', schools: 45, students: 10230, teachers: 540 }
];

interface ProvinceSelectorProps {
  onProvinceSelect: (province: Province) => void;
}

export function ProvinceSelector({ onProvinceSelect }: ProvinceSelectorProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    const province = algerianProvinces.find(p => p.id === provinceId);
    if (province) {
      onProvinceSelect(province);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            مديرية التعليم - الجمهورية الجزائرية الديمقراطية الشعبية
          </CardTitle>
          <CardDescription className="text-lg">
            اختر الولاية للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              اختر الولاية
            </label>
            <Select value={selectedProvinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="اختر ولايتك من القائمة..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {algerianProvinces.map((province) => (
                  <SelectItem key={province.id} value={province.id} className="text-right">
                    <div className="flex items-center gap-3 w-full">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{province.arabicName}</span>
                      <span className="text-sm text-gray-500">({province.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvinceId && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-center">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                  معلومات الولاية المختارة
                </h3>
                {(() => {
                  const province = algerianProvinces.find(p => p.id === selectedProvinceId);
                  if (!province) return null;
                  
                  return (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{province.schools}</div>
                        <div className="text-sm text-gray-600">مدرسة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{province.students.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">طالب</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{province.teachers}</div>
                        <div className="text-sm text-gray-600">معلم</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <Button 
            className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={!selectedProvinceId}
            onClick={() => {
              const province = algerianProvinces.find(p => p.id === selectedProvinceId);
              if (province) onProvinceSelect(province);
            }}
          >
            <Building2 className="h-5 w-5 mr-2" />
            دخول إلى لوحة التحكم
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>وزارة التربية الوطنية - الجمهورية الجزائرية الديمقراطية الشعبية</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}