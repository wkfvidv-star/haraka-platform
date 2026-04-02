import React, { useState, useEffect } from 'react';
import { parentDataService, Message } from '@/services/parentDataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail,
  Send,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  User,
  GraduationCap,
  UserCheck,
  Building,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Paperclip,
  Eye,
  EyeOff
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// Mock data moved to parentDataService 

export function MessagingSystem() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(parentDataService.getMessages());
  }, []);

  const [newMessageTo, setNewMessageTo] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [showCompose, setShowCompose] = useState(false);

  const categories = ['الكل', 'رياضي', 'أكاديمي', 'صحي', 'إداري', 'عام'];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <GraduationCap className="h-4 w-4" />;
      case 'principal': return <Building className="h-4 w-4" />;
      case 'coach': return <UserCheck className="h-4 w-4" />;
      case 'ministry': return <Building className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-blue-600';
      case 'principal': return 'text-purple-600';
      case 'coach': return 'text-green-600';
      case 'ministry': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'مهم': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      case 'عادي': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'عاجل': return <AlertTriangle className="h-4 w-4" />;
      case 'مهم': return <Info className="h-4 w-4" />;
      case 'عادي': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || message.category === selectedCategory;
    
    switch (activeTab) {
      case 'inbox': return matchesSearch && matchesCategory;
      case 'starred': return matchesSearch && matchesCategory && message.isStarred;
      case 'unread': return matchesSearch && matchesCategory && !message.isRead;
      default: return matchesSearch && matchesCategory;
    }
  });

  const markAsRead = (messageId: string) => {
    parentDataService.markMessageAsRead(messageId);
    setMessages(parentDataService.getMessages());
  };

  const toggleStar = (messageId: string) => {
    parentDataService.toggleMessageStar(messageId);
    setMessages(parentDataService.getMessages());
  };

  const handleSendMessage = () => {
    if (newMessageSubject && newMessageContent) {
      parentDataService.sendMessage(newMessageTo || 'عام', newMessageSubject, newMessageContent);
      setMessages(parentDataService.getMessages());
      setShowCompose(false);
      setNewMessageTo('');
      setNewMessageSubject('');
      setNewMessageContent('');
    } else {
      alert('الرجاء إدخال الموضوع والمحتوى');
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const starredCount = messages.filter(msg => msg.isStarred).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Mail className="h-6 w-6" />
            صندوق الرسائل
          </CardTitle>
          <CardDescription className="text-blue-100">
            تواصل مع المعلمين والإدارة ومتابعة أخبار أطفالك
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Compose Button */}
          <Button 
            className="w-full" 
            onClick={() => setShowCompose(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            رسالة جديدة
          </Button>

          {/* Navigation */}
          <Card>
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                <TabsList className="grid w-full grid-cols-1 h-auto">
                  <TabsTrigger value="inbox" className="justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    الوارد
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-red-500">{unreadCount}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    المميزة
                    {starredCount > 0 && (
                      <Badge variant="outline" className="ml-auto">{starredCount}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="justify-start">
                    <EyeOff className="h-4 w-4 mr-2" />
                    غير مقروءة
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-orange-500">{unreadCount}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث في الرسائل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">الفئة</label>
                <div className="space-y-1">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {activeTab === 'inbox' && 'صندوق الوارد'}
                {activeTab === 'starred' && 'الرسائل المميزة'}
                {activeTab === 'unread' && 'الرسائل غير المقروءة'}
              </CardTitle>
              <CardDescription>
                {filteredMessages.length} رسالة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !message.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    } ${selectedMessage?.id === message.id ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        markAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={getRoleColor(message.from.role)}>
                          {getRoleIcon(message.from.role)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm ${!message.isRead ? 'font-bold' : ''}`}>
                              {message.from.name}
                            </span>
                            <Badge className={getPriorityColor(message.priority)} size="sm">
                              {getPriorityIcon(message.priority)}
                              <span className="ml-1">{message.priority}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {message.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            <span className="text-xs text-gray-500">
                              {format(new Date(message.timestamp), 'dd/MM HH:mm')}
                            </span>
                          </div>
                        </div>
                        
                        <h4 className={`text-sm mb-1 truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                          {message.subject}
                        </h4>
                        
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {message.content}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" size="sm">
                            {message.category}
                          </Badge>
                          {message.attachments && message.attachments.length > 0 && (
                            <Badge variant="outline" size="sm">
                              <Paperclip className="h-3 w-3 mr-1" />
                              {message.attachments.length}
                            </Badge>
                          )}
                          {message.relatedChild && (
                            <Badge variant="outline" size="sm">
                              <User className="h-3 w-3 mr-1" />
                              طفل
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredMessages.length === 0 && (
                <div className="text-center p-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد رسائل</h3>
                  <p className="text-gray-500">لا توجد رسائل تطابق المعايير المحددة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div>
          {selectedMessage ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={getRoleColor(selectedMessage.from.role)}>
                        {getRoleIcon(selectedMessage.from.role)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.from.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(selectedMessage.timestamp), 'PPP p', { locale: ar })}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStar(selectedMessage.id)}
                    >
                      <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getPriorityColor(selectedMessage.priority)}>
                    {getPriorityIcon(selectedMessage.priority)}
                    <span className="ml-1">{selectedMessage.priority}</span>
                  </Badge>
                  <Badge variant="outline">
                    {selectedMessage.category}
                  </Badge>
                  {selectedMessage.relatedChild && (
                    <Badge variant="outline">
                      <User className="h-3 w-3 mr-1" />
                      متعلق بطفل
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">{selectedMessage.subject}</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>
                
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">المرفقات</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Paperclip className="h-5 w-5 text-gray-500" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{attachment.name}</div>
                            <div className="text-xs text-gray-500">{attachment.size}</div>
                          </div>
                          <Button size="sm" variant="outline">
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    رد
                  </Button>
                  <Button size="sm" variant="outline">
                    <Forward className="h-4 w-4 mr-2" />
                    إعادة توجيه
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    أرشفة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">اختر رسالة لعرضها</h3>
                <p className="text-gray-500">اضغط على رسالة من القائمة لعرض تفاصيلها</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>رسالة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">إلى</label>
                <Input value={newMessageTo} onChange={e => setNewMessageTo(e.target.value)} placeholder="اختر المستقبل..." />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">الموضوع</label>
                <Input value={newMessageSubject} onChange={e => setNewMessageSubject(e.target.value)} placeholder="موضوع الرسالة..." />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">الرسالة</label>
                <Textarea 
                  value={newMessageContent} onChange={e => setNewMessageContent(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">
                  <Paperclip className="h-4 w-4 mr-2" />
                  إرفاق ملف
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCompose(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    إرسال
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}