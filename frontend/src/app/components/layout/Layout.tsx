import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Sprout, 
  TestTube, 
  BookOpen, 
  Calendar,
  Video,
  MessageSquare,
  FileText,
  CreditCard,
  Bug,
  BarChart3,
  Menu,
  X,
  Search,
  Bell,
  User,
  Globe,
  Settings,
  ChevronDown,
  Check,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string, data?: any) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { id: 'crop-recommendation', label: 'Crop Recommendation', icon: Sprout, path: '/crop-recommendation' },
  { id: 'soil-prediction', label: 'Soil Prediction', icon: TestTube, path: '/soil-prediction' },
  { id: 'plant-explorer', label: 'Plant Explorer', icon: BookOpen, path: '/plant-explorer' },
  { id: 'disease-library', label: 'Disease Library', icon: Bug, path: '/disease-library' },
  { id: 'growth-calendar', label: 'Growth Calendar', icon: Calendar, path: '/growth-calendar' },
  { id: 'chatbot', label: 'AI Adviser', icon: MessageSquare, path: '/chatbot' },
  { id: 'video-hub', label: 'Video Hub', icon: Video, path: '/video-hub' },
  { id: 'feedback', label: 'Feedback', icon: FileText, path: '/feedback' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, path: '/subscription' },
  { id: 'logout', label: 'Logout', icon: X, path: '/logout' },
];

const mobileNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'crop-recommendation', label: 'Crops', icon: Sprout },
  { id: 'plant-explorer', label: 'Plants', icon: BookOpen },
  { id: 'growth-calendar', label: 'Calendar', icon: Calendar },
  { id: 'logout', label: 'Logout', icon: X },
];

const searchCatalog = [
  { title: 'Soil Prediction Tool', category: 'AI Tools', page: 'soil-prediction' },
  { title: 'Crop Recommendation Engine', category: 'AI Tools', page: 'crop-recommendation' },
  { title: 'Plant Disease Identification', category: 'AI Tools', page: 'disease-library' },
  { title: 'AI Farm Adviser Chat', category: 'Assistance', page: 'chatbot' },
  { title: 'Growth Calendar & Schedule', category: 'Planning', page: 'growth-calendar' },
  { title: 'Wheat Growth Guide', category: 'Crop Database', page: 'plant-explorer' },
  { title: 'Rice Cultivation Methods', category: 'Crop Database', page: 'plant-explorer' },
  { title: 'Tomato Early Blight Guide', category: 'Diseases', page: 'disease-library' },
  { title: 'Irrigation Video Tutorials', category: 'Media', page: 'video-hub' },
];

const mockNotifications = [
  { id: 1, title: 'Frost Alert Warning', desc: 'Temperature drops to 3°C expected tonight. Cover sensitive crops.', time: '10m ago', type: 'alert' },
  { id: 2, title: 'Soil Report Ready', desc: 'Field B Alluvial sample analysis completed successfully.', time: '1h ago', type: 'success' },
  { id: 3, title: 'Fertilizer Scheduled', desc: 'Apply NPK 20-20-20 for Wheat Field A today at 4:00 PM.', time: '3h ago', type: 'task' },
];

const locations = [
  { name: 'California Valley, US', code: 'US-CA' },
  { name: 'Midwest Prairie, US', code: 'US-MW' },
  { name: 'Punjab Plains, IN', code: 'IN-PB' },
  { name: 'Rift Valley, KE', code: 'KE-RV' },
];

export function Layout({ children, currentPage = 'dashboard', onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(3);
  const [userDisplay, setUserDisplay] = useState({ name: 'Farmer', initials: 'F', role: 'farmer' });

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('agrisol_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const email = user.email || '';
        const namePart = email.split('@')[0] || 'Farmer';
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const initials = displayName.slice(0, 2).toUpperCase();
        setUserDisplay({ name: displayName, initials, role: user.role || 'farmer' });
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const filteredSearch = searchQuery.trim() === '' 
    ? searchCatalog.slice(0, 4) 
    : searchCatalog.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchResultClick = (page: string) => {
    setSearchQuery('');
    setSearchFocused(false);
    if (onNavigate) onNavigate(page);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-neutral-800/60
        transform transition-transform duration-300 ease-in-out shadow-xl shadow-slate-100/50 dark:shadow-none
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white flex items-center gap-1">
                Agri<span className="text-emerald-500">Sol</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase block">AI Ecosystem</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800"
            onClick={toggleSidebar}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-85px)]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onNavigate) onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 font-semibold text-sm group
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transform scale-[1.01]' 
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100/70 dark:hover:bg-neutral-800/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-neutral-800/50 px-4 lg:px-8 py-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side: Mobile Menu & Search */}
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-600 dark:text-neutral-300"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Global Interactive Search Bar */}
              <div className="relative max-w-md w-full hidden sm:block" ref={searchRef}>
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search AI diagnostics, crops, diseases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="pl-10 h-10 w-full bg-slate-100/60 dark:bg-neutral-900/60 border border-slate-200/60 dark:border-neutral-800/60 focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-xl text-sm"
                />
                
                {/* Search Autocomplete Popover */}
                {searchFocused && (
                  <div className="absolute top-12 left-0 right-0 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 animate-fade-in-up">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-neutral-500 uppercase px-3 py-1.5">
                      {searchQuery ? 'Search Results' : 'Suggested Quick Access'}
                    </p>
                    <div className="space-y-1">
                      {filteredSearch.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchResultClick(item.page)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-neutral-800 flex items-center justify-between text-xs font-semibold group transition-colors"
                        >
                          <span className="text-slate-800 dark:text-neutral-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {item.title}
                          </span>
                          <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-neutral-700">
                            {item.category}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {/* Region Selector */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowLocationSelect(!showLocationSelect)}
                  className="gap-2 text-slate-700 dark:text-neutral-300 font-semibold text-xs rounded-xl bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800/40 h-9"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden md:inline">{selectedLocation.name}</span>
                  <span className="md:hidden">{selectedLocation.code}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </Button>

                {showLocationSelect && (
                  <div className="absolute right-0 top-11 w-48 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 p-1.5 animate-fade-in-up">
                    <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">Select Farm Region</p>
                    {locations.map(loc => (
                      <button
                        key={loc.code}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationSelect(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                          selectedLocation.code === loc.code ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span>{loc.name}</span>
                        {selectedLocation.code === loc.code && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Center Popover */}
              <div className="relative" ref={notifRef}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-slate-700 dark:text-neutral-300 w-9 h-9 p-0 rounded-xl bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800/40"
                >
                  <Bell className="w-4 h-4 text-slate-600 dark:text-neutral-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-4 animate-fade-in-up">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-sm text-slate-800 dark:text-white">Telemetry & Farm Alerts</span>
                      </div>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 mt-3 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-center py-6 text-slate-400">All alerts clear! Farm is operating smoothly.</p>
                      ) : (
                        notifications.map(item => (
                          <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-200/30 dark:border-neutral-800/40 flex items-start gap-2.5">
                            <div className="mt-0.5">
                              {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                              {item.type === 'success' && <Check className="w-4 h-4 text-emerald-500" />}
                              {item.type === 'task' && <Clock className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</h4>
                                <span className="text-[9px] text-slate-400 font-medium">{item.time}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Info */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-neutral-800">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight">{userDisplay.name}</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold capitalize bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                    {userDisplay.role}
                  </span>
                </div>
                <Avatar className="w-9 h-9 ring-2 ring-emerald-500/20 shadow-md">
                  <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs">
                    {userDisplay.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-slate-200/50 dark:border-neutral-800/50 z-40">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg
                  transition-colors duration-200
                  ${isActive ? 'text-emerald-500 font-semibold' : 'text-slate-500 dark:text-neutral-400'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in-up"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}