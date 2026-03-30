import React from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface MobileBottomNavProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor?: string; // e.g. 'blue' | 'orange'
}

export function MobileBottomNav({
  items,
  activeTab,
  onTabChange,
  accentColor = 'blue',
}: MobileBottomNavProps) {
  const visibleItems = items.slice(0, 5);

  const activeGrad =
    accentColor === 'orange'
      ? 'from-orange-500 to-rose-500'
      : 'from-blue-600 to-indigo-600';

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-slate-950/95 backdrop-blur-xl border-t border-white/8',
        'flex items-stretch',
        'lg:hidden', // only shown on mobile / tablet
        'safe-area-bottom'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1',
              'transition-all duration-200 relative',
              'min-h-[60px]',
              isActive ? 'text-white' : 'text-slate-500 active:text-slate-300'
            )}
          >
            {isActive && (
              <span
                className={cn(
                  'absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full',
                  `bg-gradient-to-r ${activeGrad}`
                )}
              />
            )}
            <div
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                isActive
                  ? `bg-gradient-to-br ${activeGrad} shadow-lg`
                  : 'bg-transparent'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-500')} />
            </div>
            <span
              className={cn(
                'text-[9px] font-black tracking-wide leading-none',
                isActive ? 'text-white' : 'text-slate-500'
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
