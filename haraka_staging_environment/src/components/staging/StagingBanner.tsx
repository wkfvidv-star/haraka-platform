import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Info } from 'lucide-react';
import { STAGING_CONFIG, isStaging, getVersionInfo } from '@/config/staging';

const StagingBanner: React.FC = () => {
  if (!isStaging()) return null;

  const versionInfo = getVersionInfo();

  const handleRollback = () => {
    if (confirm('هل تريد العودة للنسخة الرسمية؟')) {
      window.location.href = 'http://localhost:5173'; // النسخة الرسمية
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white text-orange-600">
              بيئة تجريبية
            </Badge>
            <span className="font-medium">
              {STAGING_CONFIG.notices.stagingBanner}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm opacity-90">
            الإصدار: {versionInfo.version}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRollback}
            className="bg-white text-orange-600 hover:bg-orange-50 border-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            العودة للنسخة الرسمية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StagingBanner;