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
  Cloud,
  MessageSquare,
  TestTube
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
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{userName}</span>! 🌾
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">
            Precision farming telemetry logs are online. Here is your farm's state today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('crop-recommendation')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md shadow-emerald-500/10 rounded-xl px-5 h-11 font-semibold text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Recommendation
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('reports')}
            className="rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 h-11 text-sm font-semibold hover:bg-slate-100/50 dark:hover:bg-neutral-900/40"
          >
            <Download className="w-4 h-4 mr-2 text-slate-400" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="glass-card-premium border-0 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800/80 ${kpi.color}`}>
                  {kpi.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">{kpi.value}</p>
                  <p className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400">{kpi.change}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-500 dark:text-neutral-400">{kpi.title}</p>
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
          <Card className="glass-card-premium border-0 overflow-hidden relative bg-gradient-to-br from-blue-500/10 via-amber-500/5 to-emerald-500/5 dark:from-neutral-900/60 dark:via-blue-900/10 dark:to-neutral-900/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                <Thermometer className="w-5 h-5 text-amber-500" />
                Weather & Sensor Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {weatherData.current.icon}
                  <div>
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{weatherData.current.temp}</p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">{weatherData.current.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1.5 rounded-lg">
                      <Droplets className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      <span>{weatherData.current.humidity} Hum</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-800/60 px-2.5 py-1.5 rounded-lg">
                      <Cloud className="w-3.5 h-3.5 text-slate-400" />
                      <span>{weatherData.current.rainfall} Rain</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {weatherData.forecast.map((day) => (
                  <div key={day.day} className="text-center p-3 rounded-xl bg-white/40 dark:bg-neutral-900/40 border border-slate-200/30 dark:border-neutral-800/30 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 mb-2">{day.day}</p>
                    <div className="flex justify-center mb-2 text-slate-500 dark:text-neutral-300">
                      {day.icon}
                    </div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-white">{day.high}</p>
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500">{day.low}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Growth Task Schedule
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('growth-calendar')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg"
              >
                View Calendar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-neutral-900/40 border border-slate-200/20 dark:border-neutral-800/20 hover:border-emerald-500/25 hover:shadow-md transition-all duration-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{task.task}</h4>
                      <Badge className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 border rounded-full ${
                        task.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200/40' :
                        task.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/40' :
                        'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/40'
                      }`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-neutral-500 mt-1.5 font-medium">
                      <span>Due: {task.date}</span>
                      <span>Crop Target: <strong className="text-slate-500 dark:text-neutral-400">{task.crop}</strong></span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-neutral-800 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress & Activity */}
        <div className="space-y-6 opacity-0 animate-fade-in-up animate-stagger-3">
          {/* Crop Progress */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Active Crop Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4.5">
              {cropProgress.map((crop) => (
                <div key={crop.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{crop.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{crop.stage} • {crop.acres} acres</p>
                    </div>
                    <Badge className={`text-[10px] font-extrabold uppercase bg-transparent border border-current px-2.5 rounded-full ${getStatusColor(crop.status)}`}>
                      {crop.status}
                    </Badge>
                  </div>
                  <div className="relative pt-1">
                    <Progress value={crop.progress} className="h-2 bg-slate-100 dark:bg-neutral-800" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 text-right">{crop.progress}% complete</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-800 dark:text-white font-bold text-lg">Telemetry Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <div className="mt-0.5 p-1 rounded-lg bg-slate-100 dark:bg-neutral-800">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-neutral-200">{activity.action}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-800 dark:text-white font-bold text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-12 text-sm font-semibold rounded-xl border border-slate-200/60 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900/60"
                onClick={() => onNavigate('soil-prediction')}
              >
                <div className="w-7 h-7 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center justify-center mr-3 text-blue-500">
                  <TestTube className="w-4 h-4" />
                </div>
                Scan Soil Chemistry
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start h-12 text-sm font-semibold rounded-xl border border-slate-200/60 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900/60"
                onClick={() => onNavigate('plant-explorer')}
              >
                <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center mr-3 text-emerald-500">
                  <Sprout className="w-4 h-4" />
                </div>
                Explore Crop Types
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start h-12 text-sm font-semibold rounded-xl border border-slate-200/60 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900/60"
                onClick={() => onNavigate('chatbot')}
              >
                <div className="w-7 h-7 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex items-center justify-center mr-3 text-amber-500">
                  <MessageSquare className="w-4 h-4" />
                </div>
                Consult Farm AI Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}