import React, { useState } from 'react';
import { Star, Upload, Camera, CheckCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { feedbackTypes } from './constants';

interface FeedbackFormProps {
  onNavigate: (page: string, data?: any) => void;
}

export function FeedbackForm({ onNavigate }: FeedbackFormProps) {
  const [feedbackForm, setFeedbackForm] = useState({
    type: '',
    rating: 0,
    title: '',
    content: '',
    screenshot: null as File | null
  });
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeedbackForm(prev => ({ ...prev, screenshot: e.target.files![0] }));
    }
  };

  if (submitted) {
    return (
      <Card className="glass-card border-0 max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-6">
            Your feedback has been submitted successfully. We appreciate your input and will review it soon.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
          >
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Share Your Feedback</CardTitle>
          <p className="text-muted-foreground">
            Help us improve FarmerAI by sharing your thoughts and experiences
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Feedback Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackForm(prev => ({ ...prev, type: type.id }))}
                    className={`
                      p-4 rounded-lg border text-center transition-colors
                      ${feedbackForm.type === type.id
                        ? 'border-primary-green bg-primary-green/10 text-primary-green'
                        : 'border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <p className="text-sm font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Overall Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || feedbackForm.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {feedbackForm.rating > 0 && (
                    `${feedbackForm.rating}/5 star${feedbackForm.rating !== 1 ? 's' : ''}`
                  )}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Feedback Title</Label>
              <Input
                id="title"
                placeholder="Brief title for your feedback"
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                className="bg-input-background"
                required
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Detailed Feedback</Label>
              <Textarea
                id="content"
                placeholder="Please share your detailed feedback, suggestions, or issues you've encountered..."
                value={feedbackForm.content}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, content: e.target.value }))}
                className="bg-input-background min-h-32"
                required
              />
            </div>

            {/* Screenshot Upload */}
            <div>
              <Label>Screenshot (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    {feedbackForm.screenshot ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <p className="text-sm font-medium text-green-600">
                          {feedbackForm.screenshot.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Click to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Upload Screenshot</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
              disabled={!feedbackForm.type || !feedbackForm.title || !feedbackForm.content}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}