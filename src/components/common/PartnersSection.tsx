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
        <Card className="bg-[#030712]/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden overflow-x-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mt-32" />
            <CardHeader className="px-8 pt-8">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-3xl font-black text-white tracking-tighter">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                                <Handshake className="h-6 w-6 text-blue-500" />
                            </div>
                            شركاء النجاح الاستراتيجيون
                        </CardTitle>
                        <CardDescription className="text-white/50 font-bold mt-2">
                            عروض حصرية ودعم متميز من شركائنا لرحلتك الرياضية
                        </CardDescription>
                    </div>
                    <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-white/5 font-bold rounded-xl hidden sm:flex">
                        كن شريكاً معنا <ExternalLink className="h-4 w-4 mr-2" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="glass-card p-6 rounded-[2rem] border-white/5 transition-all duration-500 flex flex-col items-center text-center group/partner"
                        >
                            <div className="h-20 w-full flex items-center justify-center mb-6 grayscale opacity-60 group-hover/partner:grayscale-0 group-hover/partner:opacity-100 transition-all duration-500 bg-white/5 rounded-2xl p-4">
                                <div className="text-2xl font-black text-white/80 group-hover/partner:text-blue-500 tracking-tighter">
                                    {partner.name}
                                </div>
                            </div>
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase mb-4 tracking-widest">
                                {partner.type}
                            </Badge>
                            <p className="text-sm font-bold text-white/50 mb-6 min-h-[48px] leading-relaxed">
                                {partner.description}
                            </p>
                            <div className="w-full mt-auto pt-6 border-t border-white/10 border-dashed">
                                <div className="flex items-center justify-center gap-2 text-xs font-black text-emerald-400 mb-4 bg-emerald-500/5 py-2 rounded-xl border border-emerald-500/10">
                                    <Gift className="h-4 w-4" />
                                    {partner.offer}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-500 hover:text-white rounded-xl h-11 font-black transition-all active:scale-95"
                                    onClick={() => handleClaimOffer(partner.name)}
                                >
                                    احصل على العرض
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
