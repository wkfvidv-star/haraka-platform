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
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Trophy className="h-6 w-6 text-orange-500" />
                            النوادي الرياضية المتميزة
                        </CardTitle>
                        <CardDescription>
                            اكتشف وانضم إلى أفضل النوادي الرياضية في منطقتك
                        </CardDescription>
                    </div>
                    <Button variant="outline" className="hidden sm:flex">
                        عرض الكل
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sportsClubs.map((club) => (
                        <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="h-32 bg-gray-200 relative">
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                    <Badge className="bg-orange-500 hover:bg-orange-600">
                                        {club.category}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors">
                                    {club.name}
                                </h3>
                                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {club.rating}
                                    </span>
                                    <span className="text-xs text-gray-400">({club.members} عضو)</span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{club.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="truncate">{club.nextSession}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={() => handleJoinClub(club.name)}
                                >
                                    انضم الآن
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
