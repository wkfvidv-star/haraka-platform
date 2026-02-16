import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'blue',
  trend
}: StatsCardProps) {
  const colorSchemes = {
    blue: {
      bg: 'bg-white dark:bg-blue-950/80',
      icon: 'bg-blue-600 text-white shadow-blue-500/20',
      border: 'border-blue-100 dark:border-blue-500/30',
      text: 'text-blue-700 dark:text-blue-300'
    },
    green: {
      bg: 'bg-white dark:bg-emerald-950/80',
      icon: 'bg-emerald-600 text-white shadow-emerald-500/20',
      border: 'border-green-100 dark:border-green-500/30',
      text: 'text-green-700 dark:text-green-300'
    },
    orange: {
      bg: 'bg-white dark:bg-orange-950/80',
      icon: 'bg-orange-600 text-white shadow-orange-500/20',
      border: 'border-orange-100 dark:border-orange-500/30',
      text: 'text-orange-700 dark:text-orange-300'
    },
    purple: {
      bg: 'bg-white dark:bg-purple-950/80',
      icon: 'bg-purple-600 text-white shadow-purple-500/20',
      border: 'border-purple-100 dark:border-purple-500/30',
      text: 'text-purple-700 dark:text-purple-300'
    },
    red: {
      bg: 'bg-white dark:bg-red-950/80',
      icon: 'bg-red-600 text-white shadow-red-500/20',
      border: 'border-red-100 dark:border-red-500/30',
      text: 'text-red-700 dark:text-red-300'
    },
    yellow: {
      bg: 'bg-white dark:bg-yellow-950/80',
      icon: 'bg-yellow-600 text-white shadow-yellow-500/20',
      border: 'border-yellow-100 dark:border-yellow-500/30',
      text: 'text-yellow-700 dark:text-yellow-300'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={`overflow-hidden border-2 ${scheme.border} ${scheme.bg} backdrop-blur-xl shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 rounded-[2rem]`}>
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-black text-gray-500 dark:text-gray-300 uppercase tracking-[0.2em] mb-3">
                {title}
              </p>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                  {value}
                </p>
                {trend && (
                  <Badge className={`flex items-center text-xs font-black px-2 py-0.5 rounded-lg border-none ${trend.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {trend.isPositive ? '↑' : '↓'} {trend.value}%
                  </Badge>
                )}
              </div>
              {description && (
                <p className="mt-3 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 opacity-90">
                  {description}
                </p>
              )}
            </div>
            <div className={`
              flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center shadow-2xl transform rotate-3 transition-transform group-hover:rotate-0
              ${scheme.icon}
            `}>
              <Icon className="h-8 w-8 sm:h-10 sm:w-10 stroke-[2.5]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
