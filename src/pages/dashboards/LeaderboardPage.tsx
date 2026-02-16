import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: "تلميذ" | "معلم" | "مدير" | "ولي أمر" | "شباب" | "مدرب";
  points: number;
  level: number;
  avatar?: string;
}

const users: User[] = [
  { id: "1", name: "أحمد", role: "تلميذ", points: 850, level: 12 },
  { id: "2", name: "سارة", role: "معلم", points: 920, level: 15 },
  { id: "3", name: "يوسف", role: "مدرب", points: 780, level: 10 },
  { id: "4", name: "ليلى", role: "ولي أمر", points: 500, level: 5 },
  { id: "5", name: "محمد", role: "تلميذ", points: 900, level: 14 },
  { id: "6", name: "خالد", role: "مدير", points: 1000, level: 18 },
  { id: "7", name: "نور", role: "شباب", points: 670, level: 8 },
  { id: "8", name: "هدى", role: "معلم", points: 880, level: 13 },
];

export function LeaderboardPage() {
  const [selectedRole, setSelectedRole] = useState<null | string>(null);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const roles = ["الكل", "تلميذ", "معلم", "مدير", "ولي أمر", "شباب", "مدرب"];

  const filteredUsers = selectedRole && selectedRole !== "الكل"
    ? users.filter(u => u.role === selectedRole)
    : users;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.sort((a, b) => b.points - a.points).map(user => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setChatUser(user)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {user.name}
                  <Badge>{user.role}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-2">نقاط الأداء: {user.points}</div>
                <div className="text-sm text-gray-500">المستوى: {user.level}</div>
              </CardContent>
            </Card>
          ))}
        </div>
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
