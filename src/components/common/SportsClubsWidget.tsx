import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Star, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { sportsClubs } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

export const SportsClubsWidget = () => {
    const { toast } = useToast();

    const handleJoinClub = (clubName: string) => {
        toast({
            title: "تم إرسال طلب الانضمام",
            description: `لقد قمت بطلب الانضمام إلى ${clubName} بنجاح. سيتم التواصل معك قريباً.`,
        });
    };

    return (
        <Card className="w-full bg-[#030712]/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="px-8 pt-8">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-3xl font-black text-white tracking-tighter">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                                <Trophy className="h-6 w-6 text-orange-500" />
                            </div>
                            النوادي الرياضية المتميزة
                        </CardTitle>
                        <CardDescription className="text-white/50 font-bold mt-2">
                            اكتشف وانضم إلى أفضل النوادي الرياضية في منطقتك
                        </CardDescription>
                    </div>
                    <Button variant="outline" className="hidden sm:flex bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl px-6 h-12 font-bold">
                        عرض جميع النوادي
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {sportsClubs.map((club) => (
                        <Card key={club.id} className="glass-card border-white/5 shadow-2xl relative overflow-hidden group/club rounded-3xl transition-all duration-500">
                            <div className="h-40 relative">
                                <img
                                    src={club.image || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"}
                                    alt={club.name}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover/club:grayscale-0 group-hover/club:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent flex items-end p-4">
                                    <Badge className="bg-orange-500 text-white border-none shadow-lg px-4 py-1 rounded-full font-black text-[10px] uppercase">
                                        {club.category}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="font-black text-xl text-white mb-2 group-hover/club:text-orange-500 transition-colors">
                                    {club.name}
                                </h3>
                                <div className="flex items-center gap-2 text-yellow-400 mb-4 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-xs font-black">
                                        {club.rating}
                                    </span>
                                    <span className="text-[10px] text-white/40 font-bold uppercase">({club.members} عضو)</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-white/60">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold truncate">{club.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/60">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-green-500" />
                                        </div>
                                        <span className="text-sm font-bold truncate">{club.nextSession}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-orange-600 hover:bg-orange-500 text-white h-12 rounded-xl font-black shadow-lg shadow-orange-900/40 transition-all active:scale-95"
                                    onClick={() => handleJoinClub(club.name)}
                                >
                                    طلب الانضمام
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-4 sm:hidden">
                    عرض جميع النوادي
                </Button>
            </CardContent>
        </Card>
    );
};
