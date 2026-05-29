import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Droplets, 
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  Download,
  Plus,
  ArrowRight,
  Sprout,
  Sun,
  Cloud
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
  userRole: 'farmer' | 'admin';
}

const kpiCards = [
  {
    title: 'Recommended Crops',
    value: '12',
    change: '+3 this month',
    trend: 'up',
    icon: <Sprout className="w-5 h-5" />,
    color: 'text-green-600'
  },
  {
    title: 'Planned Acres',
    value: '45.5',
    change: '+5.2 acres',
    trend: 'up',
    icon: <MapPin className="w-5 h-5" />,
    color: 'text-blue-600'
  },
  {
    title: 'Upcoming Tasks',
    value: '8',
    change: '3 due today',
    trend: 'neutral',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-orange-600'
  },
  {
    title: 'Soil Health Score',
    value: '85%',
    change: '+5% improved',
    trend: 'up',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-green-600'
  }
];

const upcomingTasks = [
  {
    id: 1,
    task: 'Apply Fertilizer - Wheat Field A',
    date: 'Today, 6:00 AM',
    priority: 'high',
    status: 'pending',
    crop: 'Wheat'
  },
  {
    id: 2,
    task: 'Irrigation - Rice Field B',
    date: 'Today, 4:00 PM',
    priority: 'medium',
    status: 'pending',
    crop: 'Rice'
  },
  {
    id: 3,
    task: 'Pest Inspection - Tomato Greenhouse',
    date: 'Tomorrow, 8:00 AM',
    priority: 'high',
    status: 'scheduled',
    crop: 'Tomato'
  },
  {
    id: 4,
    task: 'Harvest - Maize Field C',
    date: 'Jan 25, 2024',
    priority: 'low',
    status: 'scheduled',
    crop: 'Maize'
  }
];

const weatherData = {
  current: {
    temp: '28°C',
    condition: 'Partly Cloudy',
    humidity: '68%',
    rainfall: '12mm',
    icon: <Sun className="w-8 h-8 text-yellow-500" />
  },
  forecast: [
    { day: 'Today', high: '32°', low: '24°', condition: 'Sunny', icon: <Sun className="w-5 h-5" /> },
    { day: 'Tomorrow', high: '29°', low: '22°', condition: 'Cloudy', icon: <Cloud className="w-5 h-5" /> },
    { day: 'Thu', high: '31°', low: '25°', condition: 'Sunny', icon: <Sun className="w-5 h-5" /> },
    { day: 'Fri', high: '27°', low: '21°', condition: 'Rain', icon: <Droplets className="w-5 h-5" /> }
  ]
};

const cropProgress = [
  { name: 'Wheat', progress: 75, stage: 'Flowering', acres: 15, status: 'healthy' },
  { name: 'Rice', progress: 45, stage: 'Vegetative', acres: 20, status: 'healthy' },
  { name: 'Tomato', progress: 60, stage: 'Fruiting', acres: 5, status: 'attention' },
  { name: 'Maize', progress: 90, stage: 'Maturity', acres: 10, status: 'ready' }
];

const recentActivity = [
  {
    id: 1,
    action: 'Soil test completed for Field A',
    time: '2 hours ago',
    type: 'test',
    icon: <CheckCircle className="w-4 h-4 text-green-500" />
  },
  {
    id: 2,
    action: 'New crop recommendation: Sugarcane',
    time: '4 hours ago',
    type: 'recommendation',
    icon: <Sprout className="w-4 h-4 text-blue-500" />
  },
  {
    id: 3,
    action: 'Weather alert: Heavy rain expected',
    time: '6 hours ago',
    type: 'alert',
    icon: <AlertTriangle className="w-4 h-4 text-orange-500" />
  },
  {
    id: 4,
    action: 'Fertilizer application scheduled',
    time: '1 day ago',
    type: 'schedule',
    icon: <Calendar className="w-4 h-4 text-purple-500" />
  }
];

export function Dashboard({ onNavigate, userRole }: DashboardProps) {
  const [userName, setUserName] = useState('Farmer');

  useEffect(() => {
    const userStr = localStorage.getItem('agrisol_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const email = user.email || '';
        const namePart = email.split('@')[0] || 'Farmer';
        setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      } catch {}
    }
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'attention': return 'text-yellow-600';
      case 'ready': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground">
            Welcome back, <span className="text-gradient">{userName}</span>! 🌾
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening on your farm today
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('crop-recommendation')}
            className="bg-primary-green hover:bg-primary-green/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Recommendation
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('reports')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="glass-card border-0 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-white/10 ${kpi.color}`}>
                  {kpi.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.change}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks & Weather */}
        <div className="lg:col-span-2 space-y-6 opacity-0 animate-fade-in-up animate-stagger-2">
          {/* Weather Card */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Thermometer className="w-5 h-5" />
                Weather Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {weatherData.current.icon}
                  <div>
                    <p className="text-2xl font-bold text-foreground">{weatherData.current.temp}</p>
                    <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{weatherData.current.humidity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cloud className="w-4 h-4 text-gray-500" />
                      <span>{weatherData.current.rainfall}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {weatherData.forecast.map((day) => (
                  <div key={day.day} className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
                    <div className="flex justify-center mb-2 text-muted-foreground">
                      {day.icon}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{day.high}</p>
                    <p className="text-xs text-muted-foreground">{day.low}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calendar className="w-5 h-5" />
                Upcoming Tasks
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('growth-calendar')}
                className="text-primary-green hover:text-primary-green/80"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{task.task}</h4>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.date}</p>
                    <p className="text-xs text-muted-foreground">Crop: {task.crop}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary-green">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress & Activity */}
        <div className="space-y-6 opacity-0 animate-fade-in-up animate-stagger-3">
          {/* Crop Progress */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5" />
                Crop Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cropProgress.map((crop) => (
                <div key={crop.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{crop.name}</p>
                      <p className="text-xs text-muted-foreground">{crop.stage} • {crop.acres} acres</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(crop.status)} bg-transparent border-current`}>
                      {crop.status}
                    </Badge>
                  </div>
                  <Progress value={crop.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{crop.progress}% Complete</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="mt-1">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('soil-prediction')}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                </div>
                Test Soil Quality
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('plant-explorer')}
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Sprout className="w-4 h-4 text-green-500" />
                </div>
                Explore Plants
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('chatbot')}
              >
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full" />
                </div>
                Ask Farm Advisor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}