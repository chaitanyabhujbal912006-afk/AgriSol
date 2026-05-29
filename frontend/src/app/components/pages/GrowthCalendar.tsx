import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Edit,
  Download,
  Filter,
  Clock,
  Droplets,
  Sprout,
  Scissors,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface GrowthCalendarProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const calendarActivities = [
  {
    id: 1,
    title: 'Sow Rice Seeds - Field A',
    date: new Date(2024, 2, 15),
    type: 'sowing',
    crop: 'Rice',
    field: 'Field A',
    status: 'completed',
    priority: 'high',
    notes: 'Used variety BPT-5204, 25kg seeds per acre',
    duration: '2 hours'
  },
  {
    id: 2,
    title: 'First Irrigation - Field A',
    date: new Date(2024, 2, 20),
    type: 'irrigation',
    crop: 'Rice',
    field: 'Field A',
    status: 'completed',
    priority: 'medium',
    notes: 'Maintained 2-3 cm water level',
    duration: '4 hours'
  },
  {
    id: 3,
    title: 'Apply NPK Fertilizer - Field A',
    date: new Date(2024, 2, 25),
    type: 'fertilizer',
    crop: 'Rice',
    field: 'Field A',
    status: 'pending',
    priority: 'high',
    notes: 'Apply 60kg NPK per acre',
    duration: '3 hours'
  },
  {
    id: 4,
    title: 'Pest Inspection - Field B',
    date: new Date(2024, 2, 26),
    type: 'inspection',
    crop: 'Tomato',
    field: 'Field B',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Check for early blight symptoms',
    duration: '1 hour'
  },
  {
    id: 5,
    title: 'Harvest Wheat - Field C',
    date: new Date(2024, 3, 5),
    type: 'harvest',
    crop: 'Wheat',
    field: 'Field C',
    status: 'scheduled',
    priority: 'high',
    notes: 'Expected yield: 3.5 tons/acre',
    duration: '8 hours'
  },
  {
    id: 6,
    title: 'Weed Management - Field A',
    date: new Date(2024, 3, 10),
    type: 'weeding',
    crop: 'Rice',
    field: 'Field A',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Manual weeding around plants',
    duration: '6 hours'
  }
];

const activityTypes = {
  sowing: { icon: <Sprout className="w-4 h-4" />, color: 'bg-green-500', label: 'Sowing' },
  irrigation: { icon: <Droplets className="w-4 h-4" />, color: 'bg-blue-500', label: 'Irrigation' },
  fertilizer: { icon: <div className="w-4 h-4 bg-yellow-600 rounded" />, color: 'bg-yellow-500', label: 'Fertilizer' },
  harvest: { icon: <Scissors className="w-4 h-4" />, color: 'bg-orange-500', label: 'Harvest' },
  inspection: { icon: <AlertCircle className="w-4 h-4" />, color: 'bg-purple-500', label: 'Inspection' },
  weeding: { icon: <div className="w-4 h-4 bg-brown-600 rounded" />, color: 'bg-amber-600', label: 'Weeding' }
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface BackendEvent {
  id: string;
  cropName: string;
  action: string;
  eventDate: string;
  completed: boolean;
}

export function GrowthCalendar({ onNavigate, navigationData, userRole }: GrowthCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'timeline' | 'tasks'>('month');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    date: '',
    type: '',
    crop: '',
    field: '',
    priority: 'medium',
    notes: '',
    duration: ''
  });
  const [backendEvents, setBackendEvents] = useState<BackendEvent[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('agrisol_token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/v1/calendar/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.events) {
          setBackendEvents(data.events);
        }
      } catch {
        // Backend offline – static data will show
      }
    };
    fetchEvents();
  }, []);

  // Merge backend events into the calendar activity shape for display
  const allActivities = [
    ...calendarActivities,
    ...backendEvents.map(ev => ({
      id: ev.id as any,
      title: `${ev.action} - ${ev.cropName}`,
      date: new Date(ev.eventDate),
      type: ev.action.toLowerCase().includes('irrigat') ? 'irrigation'
           : ev.action.toLowerCase().includes('harvest') ? 'harvest'
           : ev.action.toLowerCase().includes('fertil') ? 'fertilizer'
           : 'sowing',
      crop: ev.cropName,
      field: 'My Field',
      status: ev.completed ? 'completed' : 'scheduled',
      priority: 'medium',
      notes: '',
      duration: ''
    }))
  ];

  const getActivitiesForDate = (date: Date) => {
    return allActivities.filter(activity => 
      activity.date.toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.title || !newActivity.date || !newActivity.crop) {
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('agrisol_token');
      const res = await fetch('http://localhost:5000/api/v1/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          cropName: newActivity.crop,
          action: newActivity.title || newActivity.type || 'Activity',
          eventDate: newActivity.date
        })
      });
      const data = await res.json();
      if (data.success && data.event) {
        setBackendEvents(prev => [...prev, data.event]);
      }
    } catch {
      // Backend offline – activity will not persist, but UX carries on
    } finally {
      setIsSaving(false);
    }
    setShowAddDialog(false);
    setNewActivity({
      title: '',
      date: '',
      type: '',
      crop: '',
      field: '',
      priority: 'medium',
      notes: '',
      duration: ''
    });
  };

  const handleToggleComplete = async (eventId: string) => {
    setTogglingId(eventId);
    try {
      const token = localStorage.getItem('agrisol_token');
      const res = await fetch(`http://localhost:5000/api/v1/calendar/events/${eventId}/toggle`, {
        method: 'PATCH',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (data.success && data.event) {
        setBackendEvents(prev =>
          prev.map(ev => ev.id === eventId ? { ...ev, completed: data.event.completed } : ev)
        );
      }
    } catch {
      // Backend offline
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Growth Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and track your farming activities throughout the crop cycle
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Activity Title</Label>
                  <Input
                    placeholder="e.g., Apply fertilizer to Field A"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g., 2 hours"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Activity Type</Label>
                    <Select value={newActivity.type} onValueChange={(value) => setNewActivity(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(activityTypes).map(([key, type]) => (
                          <SelectItem key={key} value={key}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newActivity.priority} onValueChange={(value) => setNewActivity(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Crop</Label>
                    <Input
                      placeholder="e.g., Rice, Wheat"
                      value={newActivity.crop}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, crop: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Field</Label>
                    <Input
                      placeholder="e.g., Field A"
                      value={newActivity.field}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, field: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes or instructions..."
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity} className="bg-primary-green hover:bg-primary-green/90 text-white" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Add Activity'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Calendar
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'month' | 'timeline' | 'tasks')}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="month">Month View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tasks">Task List</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="glass-card border-0 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  className="rounded-md border-0"
                />
              </CardContent>
            </Card>

            {/* Daily Activities */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>
                  {selectedDate ? `Activities - ${selectedDate.toLocaleDateString()}` : 'Select a Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    {getActivitiesForDate(selectedDate).map((activity) => (
                      <div key={activity.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-1 rounded ${activityTypes[activity.type as keyof typeof activityTypes]?.color} text-white`}>
                            {activityTypes[activity.type as keyof typeof activityTypes]?.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <p className="text-xs text-muted-foreground">{activity.crop} • {activity.field}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.duration}
                          </span>
                        </div>
                        {activity.notes && (
                          <p className="text-xs text-muted-foreground mt-2">{activity.notes}</p>
                        )}
                      </div>
                    ))}
                    {getActivitiesForDate(selectedDate).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No activities scheduled for this date
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Click on a date to see activities
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${activityTypes[activity.type as keyof typeof activityTypes]?.color} text-white`}>
                        {activityTypes[activity.type as keyof typeof activityTypes]?.icon}
                      </div>
                      {index < calendarActivities.length - 1 && (
                        <div className="w-px h-16 bg-border mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{activity.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {activity.date.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{activity.crop}</span>
                        <span>•</span>
                        <span>{activity.field}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration}
                        </span>
                      </div>
                      
                      {activity.notes && (
                        <p className="text-sm text-muted-foreground">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['pending', 'scheduled', 'completed'].map((status) => (
              <Card key={status} className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    {status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {status === 'pending' && <Clock className="w-5 h-5 text-yellow-500" />}
                    {status === 'scheduled' && <CalendarIcon className="w-5 h-5 text-blue-500" />}
                    {status} Tasks
                    <Badge className="ml-auto">
                      {allActivities.filter(a => a.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allActivities
                      .filter(activity => activity.status === status)
                      .map((activity) => (
                        <div key={activity.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-1 rounded ${activityTypes[activity.type as keyof typeof activityTypes]?.color} text-white`}>
                              {activityTypes[activity.type as keyof typeof activityTypes]?.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{activity.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {activity.date.toLocaleDateString()} • {activity.crop}
                              </p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`} />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            {typeof activity.id === 'string' && backendEvents.find(e => e.id === activity.id) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleComplete(activity.id as string)}
                                disabled={togglingId === activity.id}
                                className="text-xs"
                              >
                                {togglingId === activity.id ? '...' : activity.status === 'completed' ? 'Undo' : 'Done'}
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}