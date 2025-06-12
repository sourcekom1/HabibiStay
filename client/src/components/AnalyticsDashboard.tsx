import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Search, 
  Eye,
  Heart,
  Calendar,
  Download
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsData {
  id: number;
  userId?: string;
  eventType: string;
  eventData: any;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7d');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: analytics = [], isLoading } = useQuery<AnalyticsData[]>({
    queryKey: ['/api/analytics', dateRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      const response = await apiRequest("GET", `/api/admin/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      return response.json();
    },
  });

  // Process analytics data for visualizations
  const processedData = {
    eventsByType: analytics.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    dailyEvents: analytics.reduce((acc, event) => {
      const date = new Date(event.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, searches: 0, views: 0, bookings: 0 };
      }
      if (event.eventType === 'search') acc[date].searches++;
      if (event.eventType === 'property_view') acc[date].views++;
      if (event.eventType === 'booking_attempt') acc[date].bookings++;
      return acc;
    }, {} as Record<string, any>),
    
    popularLocations: analytics
      .filter(a => a.eventType === 'search' && a.eventData?.searchQuery?.location)
      .reduce((acc, event) => {
        const location = event.eventData.searchQuery.location;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  };

  const eventTypeData = Object.entries(processedData.eventsByType).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));

  const dailyEventsData = Object.values(processedData.dailyEvents).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const locationData = Object.entries(processedData.popularLocations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const totalEvents = analytics.length;
  const uniqueUsers = new Set(analytics.map(a => a.userId).filter(Boolean)).size;
  const searchEvents = analytics.filter(a => a.eventType === 'search').length;
  const viewEvents = analytics.filter(a => a.eventType === 'property_view').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h3>
          <p className="text-gray-600">Track user engagement and platform performance</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={dateRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={dateRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={dateRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('90d')}
          >
            90 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Searches</p>
                <p className="text-2xl font-bold text-gray-900">{searchEvents.toLocaleString()}</p>
              </div>
              <Search className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Property Views</p>
                <p className="text-2xl font-bold text-gray-900">{viewEvents.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyEventsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="searches" stroke="#8884d8" name="Searches" />
                <Line type="monotone" dataKey="views" stroke="#82ca9d" name="Views" />
                <Line type="monotone" dataKey="bookings" stroke="#ffc658" name="Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Search Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {analytics.slice(0, 10).map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {event.eventType === 'search' && <Search className="h-4 w-4 text-blue-600" />}
                    {event.eventType === 'property_view' && <Eye className="h-4 w-4 text-green-600" />}
                    {event.eventType === 'favorite_action' && <Heart className="h-4 w-4 text-red-600" />}
                    {event.eventType === 'booking_attempt' && <Calendar className="h-4 w-4 text-purple-600" />}
                    
                    <div>
                      <p className="text-sm font-medium">
                        {event.eventType.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {event.eventData?.resultsCount ? `${event.eventData.resultsCount} results` : 'Action'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}