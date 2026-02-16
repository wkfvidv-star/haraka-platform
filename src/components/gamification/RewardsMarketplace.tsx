import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Lock, Check } from 'lucide-react';

interface RewardItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    image?: string;
    category: 'avatar' | 'theme' | 'real-world';
    unlocked: boolean;
    purchased: boolean;
}

interface RewardsMarketplaceProps {
    items: RewardItem[];
    userCoins: number;
    onPurchase: (itemId: string) => void;
}

export function RewardsMarketplace({ items, userCoins, onPurchase }: RewardsMarketplaceProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl text-white shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold mb-1">متجر الجوائز</h2>
                    <p className="text-yellow-100">استبدل عملاتك بجوائز قيمة</p>
                </div>
                <div className="text-center bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-yellow-100 mb-1">رصيدك الحالي</div>
                    <div className="text-3xl font-bold flex items-center gap-2">
                        {userCoins.toLocaleString()}
                        <span className="text-lg">🪙</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <Card key={item.id} className={`relative overflow-hidden ${item.purchased ? 'border-green-500/50 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                        {item.purchased && (
                            <div className="absolute top-3 right-3 z-10">
                                <Badge className="bg-green-500 hover:bg-green-600">مملوك</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-4xl">
                                {item.image || '🎁'}
                            </div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={item.purchased ? "outline" : "default"}
                                disabled={item.purchased || (!item.unlocked && userCoins < item.cost)}
                                onClick={() => onPurchase(item.id)}
                            >
                                {item.purchased ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        تم الشراء
                                    </>
                                ) : !item.unlocked ? (
                                    <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        مغلق (المستوى المطلوب)
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        شراء ({item.cost} 🪙)
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
