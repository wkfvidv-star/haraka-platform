import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accessibility } from 'lucide-react';

interface SimplifiedModeToggleProps {
    isSimplified: boolean;
    onToggle: (checked: boolean) => void;
}

export function SimplifiedModeToggle({ isSimplified, onToggle }: SimplifiedModeToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 border shadow-sm">
            <Accessibility className={`w-4 h-4 ${isSimplified ? 'text-blue-600' : 'text-gray-400'}`} />
            <Label htmlFor="simplified-mode" className="text-xs font-medium cursor-pointer select-none">
                الوضع المبسط
            </Label>
            <Switch
                id="simplified-mode"
                checked={isSimplified}
                onCheckedChange={onToggle}
                className="scale-75 data-[state=checked]:bg-blue-600"
            />
        </div>
    );
}
