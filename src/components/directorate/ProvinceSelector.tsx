import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, MapPin } from 'lucide-react';

interface Province {
  id: string;
  name: string;
  arabicName: string;
  region: 'Center' | 'West' | 'East' | 'South';
  schools: number;
  students: number;
  teachers: number;
  performance: number;
}

interface ProvinceSelectorProps {
  onProvinceSelect: (province: Province) => void;
  onBack?: () => void;
}

export function ProvinceSelector({ onProvinceSelect, onBack }: ProvinceSelectorProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');

  // Full list of 58 Algerian Provinces (Wilayas)
  const provinces: Province[] = [
    { id: '1', name: 'Adrar', arabicName: 'أدرار', region: 'South', schools: 120, students: 25000, teachers: 1200, performance: 81.5 },
    { id: '2', name: 'Chlef', arabicName: 'الشلف', region: 'West', schools: 410, students: 85000, teachers: 4200, performance: 84.8 },
    { id: '3', name: 'Laghouat', arabicName: 'الأغواط', region: 'South', schools: 180, students: 35000, teachers: 1800, performance: 82.3 },
    { id: '4', name: 'Oum El Bouaghi', arabicName: 'أم البواقي', region: 'East', schools: 250, students: 50000, teachers: 2500, performance: 83.1 },
    { id: '5', name: 'Batna', arabicName: 'باتنة', region: 'East', schools: 480, students: 95000, teachers: 5500, performance: 85.6 },
    { id: '6', name: 'Béjaïa', arabicName: 'بجاية', region: 'Center', schools: 410, students: 88900, teachers: 4500, performance: 86.9 },
    { id: '7', name: 'Biskra', arabicName: 'بسكرة', region: 'South', schools: 290, students: 60000, teachers: 3200, performance: 84.2 },
    { id: '8', name: 'Béchar', arabicName: 'بشار', region: 'South', schools: 150, students: 32100, teachers: 1900, performance: 83.5 },
    { id: '9', name: 'Blida', arabicName: 'البليدة', region: 'Center', schools: 420, students: 92000, teachers: 4800, performance: 87.5 },
    { id: '10', name: 'Bouira', arabicName: 'البويرة', region: 'Center', schools: 340, students: 75000, teachers: 3800, performance: 84.2 },
    { id: '11', name: 'Tamanrasset', arabicName: 'تمنراست', region: 'South', schools: 90, students: 18000, teachers: 900, performance: 80.5 },
    { id: '12', name: 'Tébessa', arabicName: 'تبسة', region: 'East', schools: 320, students: 68000, teachers: 3600, performance: 83.8 },
    { id: '13', name: 'Tlemcen', arabicName: 'تلمسان', region: 'West', schools: 390, students: 82400, teachers: 4100, performance: 85.5 },
    { id: '14', name: 'Tiaret', arabicName: 'تيارت', region: 'West', schools: 400, students: 88000, teachers: 4300, performance: 84.7 },
    { id: '15', name: 'Tizi Ouzou', arabicName: 'تيزي وزو', region: 'Center', schools: 550, students: 115000, teachers: 6500, performance: 88.1 },
    { id: '16', name: 'Alger', arabicName: 'الجزائر', region: 'Center', schools: 680, students: 156780, teachers: 7250, performance: 88.5 },
    { id: '17', name: 'Djelfa', arabicName: 'الجلفة', region: 'Center', schools: 450, students: 98000, teachers: 4900, performance: 83.9 },
    { id: '18', name: 'Jijel', arabicName: 'جيجل', region: 'East', schools: 280, students: 58000, teachers: 3100, performance: 86.4 },
    { id: '19', name: 'Setif', arabicName: 'سطيف', region: 'East', schools: 520, students: 112500, teachers: 6100, performance: 85.8 },
    { id: '20', name: 'Saïda', arabicName: 'سعيدة', region: 'West', schools: 180, students: 38000, teachers: 1900, performance: 83.2 },
    { id: '21', name: 'Skikda', arabicName: 'سكيكدة', region: 'East', schools: 380, students: 82000, teachers: 4100, performance: 85.9 },
    { id: '22', name: 'Sidi Bel Abbès', arabicName: 'سيدي بلعباس', region: 'West', schools: 310, students: 65000, teachers: 3400, performance: 85.3 },
    { id: '23', name: 'Annaba', arabicName: 'عنابة', region: 'East', schools: 290, students: 62000, teachers: 3200, performance: 87.2 },
    { id: '24', name: 'Guelma', arabicName: 'قالمة', region: 'East', schools: 260, students: 54000, teachers: 2800, performance: 86.7 },
    { id: '25', name: 'Constantine', arabicName: 'قسنطينة', region: 'East', schools: 380, students: 85200, teachers: 4200, performance: 87.1 },
    { id: '26', name: 'Médéa', arabicName: 'المدية', region: 'Center', schools: 390, students: 81000, teachers: 4000, performance: 84.5 },
    { id: '27', name: 'Mostaganem', arabicName: 'مستغانم', region: 'West', schools: 340, students: 72000, teachers: 3700, performance: 85.1 },
    { id: '28', name: 'M\'Sila', arabicName: 'المسيلة', region: 'East', schools: 430, students: 94000, teachers: 4600, performance: 84.1 },
    { id: '29', name: 'Mascara', arabicName: 'معسكر', region: 'West', schools: 360, students: 78000, teachers: 3900, performance: 84.9 },
    { id: '30', name: 'Ouargla', arabicName: 'ورقلة', region: 'South', schools: 210, students: 45600, teachers: 2800, performance: 82.4 },
    { id: '31', name: 'Oran', arabicName: 'وهران', region: 'West', schools: 450, students: 98400, teachers: 5100, performance: 86.2 },
    { id: '32', name: 'El Bayadh', arabicName: 'البيض', region: 'South', schools: 140, students: 30000, teachers: 1600, performance: 82.8 },
    { id: '33', name: 'Illizi', arabicName: 'إليزي', region: 'South', schools: 60, students: 12000, teachers: 600, performance: 81.2 },
    { id: '34', name: 'Bordj Bou Arréridj', arabicName: 'برج بوعريريج', region: 'East', schools: 310, students: 66000, teachers: 3300, performance: 85.7 },
    { id: '35', name: 'Boumerdès', arabicName: 'بومرداس', region: 'Center', schools: 380, students: 84000, teachers: 4100, performance: 86.8 },
    { id: '36', name: 'El Tarf', arabicName: 'الطارف', region: 'East', schools: 190, students: 40000, teachers: 2100, performance: 83.6 },
    { id: '37', name: 'Tindouf', arabicName: 'تندوف', region: 'South', schools: 40, students: 8000, teachers: 400, performance: 80.8 },
    { id: '38', name: 'Tissemsilt', arabicName: 'تيسمسيلت', region: 'West', schools: 150, students: 32000, teachers: 1700, performance: 83.4 },
    { id: '39', name: 'El Oued', arabicName: 'الوادي', region: 'South', schools: 280, students: 64000, teachers: 3000, performance: 82.9 },
    { id: '40', name: 'Khenchela', arabicName: 'خنشلة', region: 'East', schools: 180, students: 41000, teachers: 2000, performance: 84.3 },
    { id: '41', name: 'Souk Ahras', arabicName: 'سوق أهراس', region: 'East', schools: 200, students: 44000, teachers: 2300, performance: 85.2 },
    { id: '42', name: 'Tipaza', arabicName: 'تيبازة', region: 'Center', schools: 320, students: 70000, teachers: 3500, performance: 86.5 },
    { id: '43', name: 'Mila', arabicName: 'ميلة', region: 'East', schools: 350, students: 76000, teachers: 3800, performance: 85.4 },
    { id: '44', name: 'Aïn Defla', arabicName: 'عين الدفلى', region: 'Center', schools: 370, students: 79000, teachers: 3900, performance: 84.6 },
    { id: '45', name: 'Naâma', arabicName: 'النعامة', region: 'South', schools: 110, students: 24000, teachers: 1300, performance: 82.7 },
    { id: '46', name: 'Aïn Témouchent', arabicName: 'عين تموشنت', region: 'West', schools: 170, students: 37000, teachers: 1900, performance: 85.8 },
    { id: '47', name: 'Ghardaïa', arabicName: 'غرداية', region: 'South', schools: 160, students: 36000, teachers: 1800, performance: 83.7 },
    { id: '48', name: 'Relizane', arabicName: 'غليزان', region: 'West', schools: 330, students: 74000, teachers: 3600, performance: 84.4 },
    { id: '49', name: 'Timimoun', arabicName: 'تيميمون', region: 'South', schools: 80, students: 16000, teachers: 800, performance: 81.0 },
    { id: '50', name: 'Bordj Badji Mokhtar', arabicName: 'برج باجي مختار', region: 'South', schools: 30, students: 5000, teachers: 300, performance: 79.5 },
    { id: '51', name: 'Ouled Djellal', arabicName: 'أولاد جلال', region: 'South', schools: 90, students: 19000, teachers: 950, performance: 81.8 },
    { id: '52', name: 'Béni Abbès', arabicName: 'بني عباس', region: 'South', schools: 50, students: 10000, teachers: 550, performance: 80.9 },
    { id: '53', name: 'In Salah', arabicName: 'عين صالح', region: 'South', schools: 45, students: 9500, teachers: 500, performance: 81.1 },
    { id: '54', name: 'In Guezzam', arabicName: 'عين قزام', region: 'South', schools: 25, students: 4500, teachers: 280, performance: 79.2 },
    { id: '55', name: 'Touggourt', arabicName: 'تقرت', region: 'South', schools: 100, students: 22000, teachers: 1100, performance: 82.5 },
    { id: '56', name: 'Djanet', arabicName: 'جانت', region: 'South', schools: 35, students: 6000, teachers: 350, performance: 80.7 },
    { id: '57', name: 'El M\'Ghair', arabicName: 'المغير', region: 'South', schools: 55, students: 11500, teachers: 600, performance: 81.6 },
    { id: '58', name: 'El Menia', arabicName: 'المنيعة', region: 'South', schools: 45, students: 9000, teachers: 500, performance: 81.3 }
  ];

  const handleEnterDashboard = () => {
    const province = provinces.find(p => p.id === selectedProvinceId);
    if (province) {
      onProvinceSelect(province);
    }
  };

  return (
    <div className="expert-dashboard-root flex flex-col items-center justify-center p-6" dir="rtl">
      {/* Background Image with Deep Overlay */}
      <div
        className="expert-bg-image"
        style={{ backgroundImage: 'url(/images/admin_school_play_bg.png)' }}
      />
      <div className="expert-bg-overlay" />

      {/* Ambient Branding Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Main Card */}
        <Card className="glass-card border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
          <CardHeader className="text-center pt-16 pb-8 flex flex-col items-center">
            {/* Logo Circle */}
            <div className="w-24 h-24 rounded-3xl bg-[#3b82f6]/20 backdrop-blur-xl border border-[#3b82f6]/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              <Building2 className="w-12 h-12 text-[#3b82f6]" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              قطاع مديريات التربية والتعليم
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-xl font-medium">
              الجمهورية الجزائرية الديمقراطية الشعبية
            </p>
          </CardHeader>

          <CardContent className="px-12 pb-16 space-y-10">
            {/* Description */}
            <div className="text-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-slate-300 font-bold">يرجى اختيار مديرية التربية المختصة للوصول إلى مركز البيانات الاستراتيجي</p>
            </div>

            {/* Dropdown Section */}
            <div className="space-y-3">
              <div className="text-sm text-slate-500 font-black pr-2 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3b82f6]" />
                اختر الولاية (المدرية)
              </div>
              <Select onValueChange={setSelectedProvinceId} value={selectedProvinceId}>
                <SelectTrigger className="h-16 text-right text-xl bg-white/5 border-white/10 focus:ring-[#3b82f6] rounded-2xl px-6 text-white placeholder:text-slate-600">
                  <SelectValue placeholder="...قائمة ولايات الوطن" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-white/10 text-white max-h-[400px]">
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id} className="text-right flex-row-reverse focus:bg-[#3b82f6] focus:text-white py-3">
                      <span className="ml-3 font-black text-[#3b82f6] w-10 text-center">{province.id.padStart(2, '0')}</span>
                      <span className="font-bold">{province.arabicName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Button */}
            <Button
              className="w-full h-20 text-2xl font-black rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-2xl shadow-blue-900/40 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
              onClick={handleEnterDashboard}
              disabled={!selectedProvinceId}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                <span>دخول إلى لوحة التحكم</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/5 text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            نظام المتابعة الرقمي - وزارة التربية الوطنية
          </div>
        </div>
      </div>
    </div>
  );
}