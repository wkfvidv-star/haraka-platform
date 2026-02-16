import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Play, Dumbbell, Brain, Coffee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SmartRecommendationsProps {
    energyLevel?: string; // 'high' | 'medium' | 'low'
    mood?: string;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ energyLevel = 'medium', mood }) => {

    const getRecommendations = () => {
        if (energyLevel === 'high') {
            return [
                {
                    id: 1,
                    title: 'تحدي السرعة القصوى',
                    description: 'استغل طاقتك العالية في تمرين HIIT مكثف لمدة 20 دقيقة.',
                    icon: ZapIcon,
                    color: 'text-orange-500',
                    bg: 'bg-orange-100',
                    action: 'ابدأ التحدي',
                    tag: 'موصى به لك 🔥'
                },
                {
                    id: 2,
                    title: 'منافسة مباشرة',
                    description: 'هناك 5 لاعبين نشطين الآن في مستواك، نافسهم!',
                    icon: TrophyIcon,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-100',
                    action: 'انضم للمنافسة',
                    tag: 'شائع الآن'
                }
            ];
        } else if (energyLevel === 'low') {
            return [
                {
                    id: 1,
                    title: 'جلسة يوجا للاسترخاء',
                    description: 'استعد نشاطك مع جلسة إطالة وهدوء لمدة 15 دقيقة.',
                    icon: Coffee,
                    color: 'text-blue-500',
                    bg: 'bg-blue-100',
                    action: 'ابدأ الجلسة',
                    tag: 'استعادة نشاط 🌿'
                },
                {
                    id: 2,
                    title: 'تعلم تكتيك جديد',
                    description: 'شاهد فيديو تعليمي قصير بدلاً من الجهد البدني.',
                    icon: Brain,
                    color: 'text-purple-500',
                    bg: 'bg-purple-100',
                    action: 'شاهد الآن',
                    tag: 'تعليمي'
                }
            ];
        } else {
            return [
                {
                    id: 1,
                    title: 'تمرين القوة المعتدل',
                    description: 'حافظ على لياقتك بتمرين شامل للجسم.',
                    icon: Dumbbell,
                    color: 'text-green-500',
                    bg: 'bg-green-100',
                    action: 'ابدأ التمرين',
                    tag: 'روتين يومي'
                },
                {
                    id: 2,
                    title: 'اختبار المهارات',
                    description: 'قيم مستواك الحالي في دقة التصويب.',
                    icon: TargetIcon,
                    color: 'text-red-500',
                    bg: 'bg-red-100',
                    action: 'بدء الاختبار',
                    tag: 'تطوير مهارات'
                }
            ];
        }
    };

    const recommendations = getRecommendations();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    توصيات ذكية لك
                </h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    عرض الكل <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((item) => (
                    <Card key={item.id} className="group hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary cursor-pointer overflow-hidden relative">
                        <div className="absolute top-0 left-0 p-2">
                            {item.tag && <Badge variant="secondary" className="text-xs font-normal bg-white/80 backdrop-blur-sm shadow-sm">{item.tag}</Badge>}
                        </div>
                        <CardContent className="p-5 flex items-start gap-4">
                            <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                                <Button size="sm" className="w-full sm:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-primary hover:text-primary-foreground">
                                    {item.action} <Play className="mr-2 h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// Helper Icons
const ZapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
