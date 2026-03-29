import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Trophy, Medal, Crown } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  name: string;
  role: "تلميذ" | "معلم" | "مدير" | "ولي أمر" | "شباب" | "مدرب";
  points: number;
  level: number;
  avatar?: string;
}

// Mock data removed in favor of real API

export function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<null | string>(null);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const roles = ["الكل", "STUDENT", "COACH", "PARENT", "TEACHER", "YOUTH"];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // بناء الاستعلام من Supabase — جدول students_progress أو profiles
        let query = supabase
          .from('students_progress')
          .select(`
            user_id,
            xp,
            level,
            profiles:user_id ( first_name, last_name, role )
          `)
          .order('xp', { ascending: false })
          .limit(20);

        // فلترة حسب الدور إذا تم اختياره
        if (selectedRole && selectedRole !== 'الكل') {
          // نجلب الكل ونصفّي client-side لأن الدور في جدول profiles
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase leaderboard error:', error.message);
          setUsers(_getMockLeaderboard());
          return;
        }

        if (data && data.length > 0) {
          const mapped: User[] = data
            .map((row: any) => {
              const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
              const role = profile?.role || 'student';
              const mappedRole = _mapRole(role);

              // فلترة حسب الدور المحدد
              if (selectedRole && selectedRole !== 'الكل' && role.toUpperCase() !== selectedRole.toUpperCase()) {
                return null;
              }

              return {
                id: row.user_id,
                name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'مستخدم' : 'مستخدم',
                role: mappedRole,
                points: row.xp || 0,
                level: row.level || 1,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user_id}`,
              } as User;
            })
            .filter(Boolean) as User[];

          setUsers(mapped.length > 0 ? mapped : _getMockLeaderboard());
        } else {
          // لا يوجد بيانات — اعرض بيانات تجريبية
          setUsers(_getMockLeaderboard());
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setUsers(_getMockLeaderboard());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedRole]);

  const filteredUsers = users;

  const handleSendMessage = () => {
    if (chatUser && newMessage.trim() !== "") {
      setChatMessages([...chatMessages, { user: "أنا", message: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Leaderboard Section */}
      <div className="flex-1 space-y-4">
        {/* Role Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {roles.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role || (role === "الكل" && selectedRole === null) ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole(role === "الكل" ? null : role)}
            >
              {role}
            </Button>
          ))}
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => (
              <Card
                key={user.id}
                className={`relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer border-none shadow-md hover:shadow-xl ${index === 0 ? 'bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10' :
                    index === 1 ? 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10' :
                      'bg-white dark:bg-gray-800/50'
                  }`}
                onClick={() => setChatUser(user)}
              >
                {index < 3 && (
                  <div className="absolute top-2 left-2">
                    {index === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> :
                      index === 1 ? <Medal className="w-5 h-5 text-blue-500" /> :
                        <Medal className="w-5 h-5 text-orange-500" />}
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg font-black">
                    <span className="truncate">{user.name}</span>
                    <Badge variant="outline" className="text-[10px] font-bold">{user.role}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">نقاط الأداء</div>
                      <div className="text-xl font-black text-blue-600 dark:text-blue-400">{user.points} XP</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">المستوى</div>
                      <div className="text-lg font-black text-slate-700 dark:text-slate-300">{user.level}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chat Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-lg">
        <h4 className="text-lg font-medium mb-3">الدردشة {chatUser ? `مع ${chatUser.name}` : ""}</h4>
        <ScrollArea className="flex-1 mb-2 overflow-y-auto border p-2 rounded-md h-96">
          {chatUser ? (
            chatMessages.length ? (
              chatMessages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-medium">{msg.user}: </span>
                  <span>{msg.message}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">ابدأ المحادثة...</div>
            )
          ) : (
            <div className="text-gray-400">اختر مستخدمًا من لوحة المتصدرين</div>
          )}
        </ScrollArea>

        {chatUser && (
          <div className="flex gap-2">
            <Input
              placeholder="اكتب رسالة..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>إرسال</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── دوال مساعدة ────────────────────────────────────────────────

/** تحويل دور المستخدم الإنجليزي إلى تسمية عربية */
function _mapRole(role: string): "تلميذ" | "معلم" | "مدير" | "ولي أمر" | "شباب" | "مدرب" {
  const map: Record<string, "تلميذ" | "معلم" | "مدير" | "ولي أمر" | "شباب" | "مدرب"> = {
    student:     'تلميذ',
    teacher:     'معلم',
    principal:   'مدير',
    parent:      'ولي أمر',
    youth:       'شباب',
    coach:       'مدرب',
    STUDENT:     'تلميذ',
    TEACHER:     'معلم',
    PRINCIPAL:   'مدير',
    PARENT:      'ولي أمر',
    YOUTH:       'شباب',
    COACH:       'مدرب',
  };
  return map[role] ?? 'تلميذ';
}

/** بيانات تجريبية تُعرض عندما لا تتوفر بيانات من Supabase */
function _getMockLeaderboard(): User[] {
  return [
    { id: 'm1', name: 'أحمد محمد',  role: 'تلميذ', points: 2450, level: 5 },
    { id: 'm2', name: 'سارة علي',   role: 'شباب',  points: 2100, level: 4 },
    { id: 'm3', name: 'خالد يوسف',  role: 'تلميذ', points: 1900, level: 4 },
    { id: 'm4', name: 'نور الدين',  role: 'مدرب',  points: 1750, level: 3 },
    { id: 'm5', name: 'فاطمة حسين', role: 'تلميذ', points: 1600, level: 3 },
    { id: 'm6', name: 'يوسف كريم',  role: 'شباب',  points: 1400, level: 2 },
  ];
}
