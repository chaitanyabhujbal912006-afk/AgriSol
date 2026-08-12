import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Droplets, 
  Thermometer,
  AlertTriangle,
  CheckCircle2,
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
  TestTube,
  Activity,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
  userRole: 'farmer' | 'admin';
}

const initialTasks = [
  { id: 1, task: 'Apply Fertilizer - Wheat Field A', date: 'Today, 6:00 AM', priority: 'high', status: 'pending', crop: 'Wheat' },
  { id: 2, task: 'Drip Irrigation - Rice Field B', date: 'Today, 4:00 PM', priority: 'medium', status: 'pending', crop: 'Rice' },
  { id: 3, task: 'Pest Inspection - Tomato Greenhouse', date: 'Tomorrow, 8:00 AM', priority: 'high', status: 'pending', crop: 'Tomato' },
  { id: 4, task: 'Harvest Soil Testing - Maize Field C', date: 'Aug 5, 2026', priority: 'low', status: 'pending', crop: 'Maize' }
];

const telemetrySeries = [
  { day: 'Mon', temp: 26, humidity: 72, moisture: 65 },
  { day: 'Tue', temp: 28, humidity: 68, moisture: 62 },
  { day: 'Wed', temp: 30, humidity: 60, moisture: 58 },
  { day: 'Thu', temp: 29, humidity: 64, moisture: 60 },
  { day: 'Fri', temp: 27, humidity: 78, moisture: 74 },
  { day: 'Sat', temp: 25, humidity: 82, moisture: 80 },
  { day: 'Sun', temp: 28, humidity: 70, moisture: 68 },
];

const npkRadarData = [
  { subject: 'Nitrogen (N)', value: 85, fullMark: 100 },
  { subject: 'Phosphorus (P)', value: 68, fullMark: 100 },
  { subject: 'Potassium (K)', value: 92, fullMark: 100 },
  { subject: 'pH Balance', value: 78, fullMark: 100 },
  { subject: 'Organic Matter', value: 88, fullMark: 100 },
  { subject: 'Moisture Index', value: 75, fullMark: 100 },
];

const weatherData = {
  current: {
    temp: '28°C',
    condition: 'Partly Cloudy',
    humidity: '68%',
    rainfall: '12mm',
    icon: <Sun className="w-8 h-8 text-amber-500 animate-pulse" />
  },
  forecast: [
    { day: 'Today', high: '32°', low: '24°', condition: 'Sunny', icon: <Sun className="w-5 h-5 text-amber-500" /> },
    { day: 'Tomorrow', high: '29°', low: '22°', condition: 'Cloudy', icon: <Cloud className="w-5 h-5 text-slate-400" /> },
    { day: 'Thu', high: '31°', low: '25°', condition: 'Sunny', icon: <Sun className="w-5 h-5 text-amber-500" /> },
    { day: 'Fri', high: '27°', low: '21°', condition: 'Rain', icon: <Droplets className="w-5 h-5 text-blue-500" /> }
  ]
};

const cropProgress = [
  { name: 'Wheat (Winter Special)', progress: 75, stage: 'Flowering Stage', acres: 15, status: 'healthy' },
  { name: 'Basmati Rice', progress: 45, stage: 'Vegetative Tillering', acres: 20, status: 'healthy' },
  { name: 'Hybrid Tomato', progress: 60, stage: 'Fruiting Phase', acres: 5, status: 'attention' },
  { name: 'Sweet Corn Maize', progress: 90, stage: 'Near Harvest Maturity', acres: 10, status: 'ready' }
];

export function Dashboard({ onNavigate, userRole }: DashboardProps) {
  const [userName, setUserName] = useState('Farmer');
  const [tasks, setTasks] = useState(initialTasks);

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

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t, 
      status: t.status === 'completed' ? 'pending' : 'completed'
    } : t));
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold text-xs rounded-full">
              ✨ AgriSol Telemetry v2.4 Active
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 break-words leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent inline-block max-w-full truncate align-bottom">{userName}</span>! 🌾
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-xs sm:text-sm mt-1">
            Real-time IoT sensors and satellite telemetry online. Here is your digital farm report today.
          </p>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
          <Button
            onClick={() => onNavigate('soil-prediction')}
            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/20 rounded-xl px-4 sm:px-5 h-10 sm:h-11 font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02]"
          >
            <TestTube className="w-4 h-4 mr-1.5 sm:mr-2" />
            Scan Soil Chemistry
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('crop-recommendation')}
            className="flex-1 sm:flex-none rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 h-10 sm:h-11 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-neutral-900"
          >
            <Sprout className="w-4 h-4 mr-1.5 sm:mr-2 text-emerald-500" />
            Crop Advisor
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up animate-stagger-1">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right min-w-0 flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight truncate">12</p>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate">+3 recommended</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 mt-3 truncate">Active Recommended Crops</p>
          </CardContent>
        </Card>

        <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up animate-stagger-2">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right min-w-0 flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight truncate">50.0</p>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">Acres Managed</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 mt-3 truncate">Cultivated Farmland</p>
          </CardContent>
        </Card>

        <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up animate-stagger-3">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right min-w-0 flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight truncate">{pendingCount}</p>
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 truncate">{completedCount} completed today</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 mt-3 truncate">Pending Tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up animate-stagger-4">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 shrink-0">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right min-w-0 flex-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight truncate">88%</p>
                <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 truncate">Optimal Fertility</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 mt-3 truncate">Soil Health Index</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols) - Recharts Analytics & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weather & Soil Telemetry Line Chart */}
          <Card className="glass-card-premium border-0 p-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Weekly Soil & Climate Telemetry
                </CardTitle>
                <p className="text-xs text-slate-400">7-Day moisture, temperature & ambient humidity tracking</p>
              </div>
              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
                Live IoT Feed
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetrySeries}>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} 
                    />
                    <Line type="monotone" dataKey="moisture" name="Soil Moisture %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="temp" name="Temperature °C" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Growth Schedule */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  Farm Task Schedule
                </CardTitle>
                <p className="text-xs text-slate-400">Click checkmark to toggle task completion status</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('growth-calendar')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl"
              >
                Calendar View
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((t) => (
                <div 
                  key={t.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    t.status === 'completed' 
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30 opacity-70' 
                      : 'bg-white/60 dark:bg-neutral-900/60 border-slate-200/50 dark:border-neutral-800/50 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskCompletion(t.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        t.status === 'completed' 
                          ? 'bg-emerald-500 text-white' 
                          : 'border-2 border-slate-300 dark:border-neutral-700 hover:border-emerald-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <h4 className={`font-bold text-sm ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                        {t.task}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        Due: {t.date} • Crop: <strong className="text-slate-600 dark:text-neutral-300">{t.crop}</strong>
                      </p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                    t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                    t.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}>
                    {t.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col) - Radar Chart & Crop Stages */}
        <div className="space-y-6">
          
          {/* NPK Nutrient Radar Balance Chart */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                Soil NPK Chemistry Balance
              </CardTitle>
              <p className="text-xs text-slate-400">Nutrient profile diagnostic rating</p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={npkRadarData}>
                    <PolarGrid stroke="#475569" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                    <Radar name="Soil Rating" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Active Crop Development Progress */}
          <Card className="glass-card-premium border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                Crop Growth Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cropProgress.map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-white font-bold">{c.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-2 bg-slate-100 dark:bg-neutral-800" />
                  <p className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{c.stage}</span>
                    <span>{c.acres} Acres</span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Direct AI Adviser CTA */}
          <Card className="glass-card-premium border-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Ask AgriSol AI Adviser</h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Get instant agronomic solutions 24/7</p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('chatbot')}
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9"
            >
              Start AI Chat
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
}