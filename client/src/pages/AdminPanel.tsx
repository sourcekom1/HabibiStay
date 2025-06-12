import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Home,
  Calendar,
  BarChart3,
  DollarSign,
  Download,
  Eye,
  Edit,
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react";
import Layout from "@/components/Layout";

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.userType === 'admin',
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && user.userType === 'admin',
  });

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
    }
  }, [user, isLoading, toast]);

  if (isLoading || usersLoading || statsLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 rounded-3xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
            <p className="text-center mt-4 text-gray-600 dark:text-gray-300">Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || user.userType !== 'admin') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You need admin privileges to access this page.</p>
            <Button onClick={() => window.history.back()} className="glass-button">
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredUsers = users.filter((u: any) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Background Orbs */}
      <div className="bg-orb w-72 h-72 top-20 right-20 opacity-10" style={{ animationDelay: '1s' }}></div>
      <div className="bg-orb w-48 h-48 bottom-32 left-32 opacity-15" style={{ animationDelay: '6s' }}></div>

      {/* Enhanced Admin Header */}
      <div className={`glass-nav ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="glass-button px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="h-10 w-10 text-brand-blue animate-pulse" />
                  <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-lg opacity-50"></div>
                </div>
                <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Admin Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <Card className="glass-card group cursor-pointer transition-all duration-500 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="glass-button w-16 h-16 rounded-3xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-brand-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Users</p>
                  <p className="text-3xl font-bold gradient-text">
                    {stats.totalUsers || users.length || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card group cursor-pointer transition-all duration-500 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="glass-button w-16 h-16 rounded-3xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-8 w-8 text-green-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Properties</p>
                  <p className="text-3xl font-bold gradient-text">
                    {stats.totalProperties || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card group cursor-pointer transition-all duration-500 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="glass-button w-16 h-16 rounded-3xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-yellow-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Bookings</p>
                  <p className="text-3xl font-bold gradient-text">
                    {stats.totalBookings || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+8%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card group cursor-pointer transition-all duration-500 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="glass-button w-16 h-16 rounded-3xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-purple-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Revenue</p>
                  <p className="text-3xl font-bold gradient-text">
                    ${stats.totalRevenue?.toLocaleString() || '0'}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+23%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Admin Tabs */}
        <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <Tabs defaultValue="users" className="space-y-8">
            <TabsList className="glass-button p-2 rounded-2xl grid w-full grid-cols-4 gap-2">
              <TabsTrigger value="users" className="glass-button rounded-xl transition-all duration-300 data-[state=active]:bg-brand-blue data-[state=active]:text-white">
                Users
              </TabsTrigger>
              <TabsTrigger value="properties" className="glass-button rounded-xl transition-all duration-300 data-[state=active]:bg-brand-blue data-[state=active]:text-white">
                Properties
              </TabsTrigger>
              <TabsTrigger value="bookings" className="glass-button rounded-xl transition-all duration-300 data-[state=active]:bg-brand-blue data-[state=active]:text-white">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="reports" className="glass-button rounded-xl transition-all duration-300 data-[state=active]:bg-brand-blue data-[state=active]:text-white">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold gradient-text">User Management</CardTitle>
                    <div className="flex space-x-3">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 glass-button border-brand-blue/30 rounded-xl"
                      />
                      <Button variant="outline" className="glass-button rounded-xl">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="glass-card p-8 mx-auto max-w-md">
                        <Users className="h-16 w-16 text-brand-blue mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No users found</h3>
                        <p className="text-gray-600 dark:text-gray-400">No users match your search criteria</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-brand-blue/20">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Joined</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user: any) => (
                            <tr key={user.id} className="border-b border-gray-200/30 hover:bg-brand-blue/5 transition-colors duration-300">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    {user.profileImageUrl ? (
                                      <img
                                        className="h-10 w-10 rounded-full ring-2 ring-brand-blue/30"
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full glass-button flex items-center justify-center">
                                        <Users className="h-6 w-6 text-brand-blue" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                      {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  className={`glass-button ${
                                    user.userType === 'host' ? "bg-blue-100 text-blue-800" :
                                    user.userType === 'admin' ? "bg-purple-100 text-purple-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.userType || 'guest'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className="glass-button bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" className="glass-button rounded-xl hover:scale-105">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="glass-button rounded-xl hover:scale-105">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold gradient-text">Property Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="glass-card p-8 mx-auto max-w-md">
                      <Home className="h-16 w-16 text-brand-blue mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Property Management</h3>
                      <p className="text-gray-600 dark:text-gray-400">Advanced property management features coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold gradient-text">Booking Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="glass-card p-8 mx-auto max-w-md">
                      <Calendar className="h-16 w-16 text-brand-blue mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Booking Management</h3>
                      <p className="text-gray-600 dark:text-gray-400">Comprehensive booking management tools coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold gradient-text">Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="glass-card p-8 mx-auto max-w-md">
                      <BarChart3 className="h-16 w-16 text-brand-blue mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Reports & Analytics</h3>
                      <p className="text-gray-600 dark:text-gray-400">Detailed analytics and reporting dashboard coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}