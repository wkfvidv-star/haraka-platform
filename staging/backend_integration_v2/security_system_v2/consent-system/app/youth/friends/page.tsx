'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthGuard } from '@/components/auth-guard'
import { 
  Users,
  UserPlus,
  MessageCircle,
  Trophy,
  Target,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Search,
  Filter,
  Heart,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  UserCheck,
  UserX
} from 'lucide-react'

interface Friend {
  id: string
  name: string
  username: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  level: number
  totalScore: number
  streakDays: number
  favoriteExercise: string
  lastActivity: string
  mutualFriends: number
  isFollowing: boolean
  recentAchievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface FriendRequest {
  id: string
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string
  message?: string
  sentAt: string
  status: 'pending' | 'accepted' | 'declined'
}

interface Activity {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: 'achievement' | 'exercise' | 'milestone' | 'challenge'
  description: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

export default function YouthFriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('friends')

  useEffect(() => {
    fetchFriendsData()
  }, [])

  const fetchFriendsData = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockFriends: Friend[] = [
        {
          id: 'friend-001',
          name: 'أحمد محمد',
          username: 'ahmed_sports',
          avatar: '/avatars/ahmed.jpg',
          status: 'online',
          level: 15,
          totalScore: 2450,
          streakDays: 12,
          favoriteExercise: 'كرة القدم',
          lastActivity: '2025-01-08T10:30:00Z',
          mutualFriends: 5,
          isFollowing: true,
          recentAchievements: [
            {
              id: 'ach-001',
              title: 'نجم الأسبوع',
              description: 'حقق أعلى نقاط في الأسبوع',
              icon: 'star',
              earnedAt: '2025-01-07T18:00:00Z',
              rarity: 'rare'
            }
          ]
        },
        {
          id: 'friend-002',
          name: 'فاطمة علي',
          username: 'fatima_fit',
          avatar: '/avatars/fatima.jpg',
          status: 'offline',
          level: 12,
          totalScore: 1890,
          streakDays: 8,
          favoriteExercise: 'سباحة',
          lastActivity: '2025-01-07T20:15:00Z',
          mutualFriends: 3,
          isFollowing: true,
          recentAchievements: [
            {
              id: 'ach-002',
              title: 'سباحة محترفة',
              description: 'أكمل 100 جلسة سباحة',
              icon: 'trophy',
              earnedAt: '2025-01-06T14:30:00Z',
              rarity: 'epic'
            }
          ]
        }
      ]

      const mockRequests: FriendRequest[] = [
        {
          id: 'req-001',
          fromUserId: 'user-003',
          fromUserName: 'سارة أحمد',
          fromUserAvatar: '/avatars/sara.jpg',
          message: 'مرحبا! أحب متابعة تقدمك في الرياضة',
          sentAt: '2025-01-08T09:00:00Z',
          status: 'pending'
        }
      ]

      const mockActivities: Activity[] = [
        {
          id: 'act-001',
          userId: 'friend-001',
          userName: 'أحمد محمد',
          userAvatar: '/avatars/ahmed.jpg',
          type: 'achievement',
          description: 'حصل على إنجاز "نجم الأسبوع"',
          timestamp: '2025-01-08T10:00:00Z',
          likes: 15,
          comments: 3,
          isLiked: false
        },
        {
          id: 'act-002',
          userId: 'friend-002',
          userName: 'فاطمة علي',
          userAvatar: '/avatars/fatima.jpg',
          type: 'exercise',
          description: 'أكملت تمرين سباحة لمدة 45 دقيقة',
          timestamp: '2025-01-07T20:00:00Z',
          likes: 8,
          comments: 1,
          isLiked: true
        }
      ]

      setFriends(mockFriends)
      setFriendRequests(mockRequests)
      setActivities(mockActivities)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching friends data:', error)
      setLoading(false)
    }
  }

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      // Mock API call - in real app: POST /api/friend-requests/${requestId}/${action}
      setFriendRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: action === 'accept' ? 'accepted' : 'declined' }
            : req
        )
      )
    } catch (error) {
      console.error('Error handling friend request:', error)
    }
  }

  const toggleFollow = async (friendId: string) => {
    try {
      // Mock API call - in real app: POST /api/friends/${friendId}/toggle-follow
      setFriends(prev =>
        prev.map(friend =>
          friend.id === friendId
            ? { ...friend, isFollowing: !friend.isFollowing }
            : friend
        )
      )
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const likeActivity = async (activityId: string) => {
    try {
      // Mock API call - in real app: POST /api/activities/${activityId}/like
      setActivities(prev =>
        prev.map(activity =>
          activity.id === activityId
            ? { 
                ...activity, 
                isLiked: !activity.isLiked,
                likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
              }
            : activity
        )
      )
    } catch (error) {
      console.error('Error liking activity:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متصل'
      case 'away': return 'غائب'
      case 'offline': return 'غير متصل'
      default: return 'غير محدد'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800'
      case 'rare': return 'bg-blue-100 text-blue-800'
      case 'epic': return 'bg-purple-100 text-purple-800'
      case 'legendary': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AuthGuard requiredRoles={['student']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الأصدقاء...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRoles={['student']}>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الأصدقاء والمجتمع</h1>
            <p className="text-gray-600">تواصل مع الأصدقاء وشارك إنجازاتك الرياضية</p>
          </div>

          {/* Friend Requests Alert */}
          {friendRequests.filter(req => req.status === 'pending').length > 0 && (
            <Alert className="mb-6">
              <UserPlus className="h-4 w-4" />
              <AlertDescription>
                لديك {friendRequests.filter(req => req.status === 'pending').length} طلب صداقة جديد
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="friends">الأصدقاء ({friends.length})</TabsTrigger>
              <TabsTrigger value="requests">الطلبات ({friendRequests.filter(req => req.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="activity">النشاطات</TabsTrigger>
              <TabsTrigger value="discover">اكتشاف</TabsTrigger>
            </TabsList>

            {/* Friends Tab */}
            <TabsContent value="friends" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      قائمة الأصدقاء
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="البحث عن صديق..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFriends.map((friend) => (
                      <Card key={friend.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{friend.name}</h3>
                              <p className="text-sm text-gray-600">@{friend.username}</p>
                              <p className="text-xs text-gray-500">{getStatusText(friend.status)}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">المستوى:</span>
                              <Badge variant="outline">{friend.level}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">النقاط:</span>
                              <span className="font-medium text-blue-600">{friend.totalScore.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">أيام متتالية:</span>
                              <span className="font-medium text-green-600">{friend.streakDays}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">التمرين المفضل:</span>
                              <span className="font-medium">{friend.favoriteExercise}</span>
                            </div>
                          </div>

                          {/* Recent Achievements */}
                          {friend.recentAchievements.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-xs font-medium text-gray-700 mb-2">آخر الإنجازات:</h4>
                              <div className="space-y-1">
                                {friend.recentAchievements.slice(0, 2).map((achievement) => (
                                  <div key={achievement.id} className="flex items-center gap-2">
                                    <Trophy className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs text-gray-600">{achievement.title}</span>
                                    <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                                      {achievement.rarity}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={friend.isFollowing ? "outline" : "default"}
                              onClick={() => toggleFollow(friend.id)}
                              className="flex-1"
                            >
                              {friend.isFollowing ? (
                                <>
                                  <UserCheck className="h-3 w-3 ml-1" />
                                  متابع
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-3 w-3 ml-1" />
                                  متابعة
                                </>
                              )}
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-3 w-3 ml-1" />
                              رسالة
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Friend Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    طلبات الصداقة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.fromUserAvatar} alt={request.fromUserName} />
                            <AvatarFallback>{request.fromUserName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{request.fromUserName}</h3>
                            {request.message && (
                              <p className="text-sm text-gray-600">{request.message}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(request.sentAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleFriendRequest(request.id, 'accept')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 ml-1" />
                              قبول
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFriendRequest(request.id, 'decline')}
                            >
                              <UserX className="h-3 w-3 ml-1" />
                              رفض
                            </Button>
                          </div>
                        )}
                        
                        {request.status !== 'pending' && (
                          <Badge className={request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {request.status === 'accepted' ? 'تم القبول' : 'تم الرفض'}
                          </Badge>
                        )}
                      </div>
                    ))}
                    
                    {friendRequests.length === 0 && (
                      <div className="text-center py-8">
                        <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد طلبات صداقة حالياً</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Feed Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    نشاطات الأصدقاء
                  </CardTitle>
                  <CardDescription>
                    آخر الأنشطة والإنجازات من الأصدقاء
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                            <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{activity.userName}</span>
                              <Badge variant="outline" className="text-xs">
                                {activity.type === 'achievement' ? 'إنجاز' :
                                 activity.type === 'exercise' ? 'تمرين' :
                                 activity.type === 'milestone' ? 'معلم' : 'تحدي'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(activity.timestamp).toLocaleDateString('ar-SA')}
                              </span>
                              <button
                                onClick={() => likeActivity(activity.id)}
                                className={`flex items-center gap-1 hover:text-red-500 ${
                                  activity.isLiked ? 'text-red-500' : ''
                                }`}
                              >
                                <Heart className={`h-3 w-3 ${activity.isLiked ? 'fill-current' : ''}`} />
                                {activity.likes}
                              </button>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {activity.comments}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {activities.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد أنشطة حديثة</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-orange-600" />
                    اكتشاف أصدقاء جدد
                  </CardTitle>
                  <CardDescription>
                    ابحث عن أصدقاء جدد بناءً على الاهتمامات المشتركة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="البحث بالاسم أو اسم المستخدم..."
                        className="flex-1"
                      />
                      <Button>
                        <Search className="h-4 w-4 ml-1" />
                        بحث
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                        كرة القدم
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                        سباحة
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                        جري
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                        كرة السلة
                      </Badge>
                    </div>
                    
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">ابدأ البحث لاكتشاف أصدقاء جدد</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}