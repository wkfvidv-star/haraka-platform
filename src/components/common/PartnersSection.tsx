import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Handshake, ExternalLink, Gift } from 'lucide-react';
import { partners } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

export const PartnersSection = () => {
    const { toast } = useToast();

    const handleClaimOffer = (partnerName: string) => {
        toast({
            title: "تم تفعيل العرض!",
            description: `لقد حصلت على عرض ${partnerName}. راجع بريدك الإلكتروني للتفاصيل.`,
        });
    };

    return (
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border-blue-100 dark:border-blue-900">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Handshake className="h-6 w-6 text-blue-600" />
                            شركاء النجاح
                        </CardTitle>
                        <CardDescription>
                            عروض حصرية ومميزات خاصة من شركائنا
                        </CardDescription>
                    </div>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        كن شريكاً معنا <ExternalLink className="h-4 w-4 mr-2" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg border hover:border-blue-300 transition-colors flex flex-col items-center text-center group"
                        >
                            <div className="h-16 w-full flex items-center justify-center mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                                {/* Placeholder for logo */}
                                <div className="text-xl font-bold text-gray-400 group-hover:text-blue-600">
                                    {partner.name}
                                </div>
                            </div>

                            <Badge variant="secondary" className="mb-2">
                                {partner.type}
                            </Badge>

                            <p className="text-sm text-gray-500 mb-3 min-h-[40px]">
                                {partner.description}
                            </p>

                            <div className="w-full mt-auto pt-3 border-t border-dashed">
                                <div className="flex items-center justify-center gap-1 text-xs font-medium text-green-600 mb-2">
                                    <Gift className="h-3 w-3" />
                                    {partner.offer}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                    onClick={() => handleClaimOffer(partner.name)}
                                >
                                    استفد من العرض
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
