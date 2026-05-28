import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle,
  Upload,
  Camera,
  BarChart3,
  TrendingUp,
  Users,
  ThumbsUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';

interface FeedbackProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const feedbackTypes = [
  { id: 'ui', label: 'User Interface', icon: <div className="w-4 h-4 bg-blue-500 rounded" />, description: 'App design and usability' },
  { id: 'accuracy', label: 'Recommendation Accuracy', icon: <TrendingUp className="w-4 h-4" />, description: 'AI predictions and suggestions' },
  { id: 'content', label: 'Content Quality', icon: <MessageSquare className="w-4 h-4" />, description: 'Information and tutorials' },
  { id: 'performance', label: 'App Performance', icon: <BarChart3 className="w-4 h-4" />, description: 'Speed and responsiveness' },
  { id: 'feature', label: 'Feature Request', icon: <ThumbsUp className="w-4 h-4" />, description: 'New feature suggestions' },
  { id: 'bug', label: 'Bug Report', icon: <div className="w-4 h-4 bg-red-500 rounded" />, description: 'Issues and problems' }
];

const feedbackStats = [
  { label: 'Total Feedback', value: '1,247', change: '+12%', color: 'text-blue-600' },
  { label: 'Average Rating', value: '4.6', change: '+0.2', color: 'text-green-600' },
  { label: 'Response Rate', value: '89%', change: '+5%', color: 'text-purple-600' },
  { label: 'Feature Requests', value: '156', change: '+23%', color: 'text-orange-600' }
];

export function Feedback({ onNavigate, navigationData, userRole }: FeedbackProps) {
  const [feedbackData, setFeedbackData] = useState({
    type: '',
    rating: 0,
    title: '',
    description: '',
    email: '',
    category: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would submit to backend
    console.log('Feedback submitted:', feedbackData);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFeedbackData({
      type: '',
      rating: 0,
      title: '',
      description: '',
      email: '',
      category: ''
    });
    setIsSubmitted(false);
    setHoveredStar(0);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card border-0 text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Thank You for Your Feedback!
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your feedback has been successfully submitted. We appreciate your input and will review it within 24-48 hours.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
              >
                Submit Another Feedback
              </Button>
              <Button
                onClick={() => onNavigate('dashboard')}
                className="bg-primary-green hover:bg-primary-green/90 text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Feedback & Suggestions
          </h1>
          <p className="text-muted-foreground mt-1">
            Help us improve FarmerAI by sharing your experience and suggestions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Share Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">What type of feedback do you have?</Label>
                  <RadioGroup
                    value={feedbackData.type}
                    onValueChange={(value) => setFeedbackData(prev => ({ ...prev, type: value }))}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {feedbackTypes.map((type) => (
                        <div key={type.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value={type.id} id={type.id} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-muted-foreground">
                              {type.icon}
                            </div>
                            <div>
                              <Label htmlFor={type.id} className="font-medium cursor-pointer">
                                {type.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">How would you rate your overall experience?</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl transition-colors"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => handleStarClick(star)}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredStar || feedbackData.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {feedbackData.rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {feedbackData.rating} out of 5 stars
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label>Feedback Title *</Label>
                  <Input
                    placeholder="Brief summary of your feedback"
                    value={feedbackData.title}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Detailed Description *</Label>
                  <Textarea
                    placeholder="Please provide detailed feedback, including steps to reproduce issues if reporting bugs..."
                    rows={6}
                    value={feedbackData.description}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Related Feature (Optional)</Label>
                  <Select 
                    value={feedbackData.category} 
                    onValueChange={(value) => setFeedbackData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select related feature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop-recommendation">Crop Recommendation</SelectItem>
                      <SelectItem value="soil-prediction">Soil Prediction</SelectItem>
                      <SelectItem value="plant-explorer">Plant Explorer</SelectItem>
                      <SelectItem value="disease-library">Disease Library</SelectItem>
                      <SelectItem value="growth-calendar">Growth Calendar</SelectItem>
                      <SelectItem value="video-hub">Video Hub</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="reports">Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email (Optional)</Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={feedbackData.email}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll only use this to follow up on your feedback if needed
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-2">
                  <Label>Attach Screenshot (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Upload screenshot</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  disabled={!feedbackData.type || !feedbackData.title || !feedbackData.description}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Stats (only show for admin users) */}
          {userRole === 'admin' && (
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Feedback Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Feedback */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm font-medium">Love the crop recommendations!</p>
                  <p className="text-xs text-muted-foreground">The AI suggestions helped increase my yield by 30%.</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-3 h-3 text-gray-300" />
                    </div>
                    <span className="text-xs text-muted-foreground">5 days ago</span>
                  </div>
                  <p className="text-sm font-medium">Great disease detection</p>
                  <p className="text-xs text-muted-foreground">Early detection saved my tomato crop.</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">1 week ago</span>
                  </div>
                  <p className="text-sm font-medium">Excellent video tutorials</p>
                  <p className="text-xs text-muted-foreground">Learning modern farming techniques easily.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('video-hub')}
              >
                View Tutorial Videos
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('chatbot')}
              >
                Ask Support Questions
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('reports')}
              >
                Download User Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}