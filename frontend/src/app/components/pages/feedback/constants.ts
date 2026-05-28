export const feedbackTypes = [
  { id: 'ui', label: 'User Interface', icon: '🎨' },
  { id: 'accuracy', label: 'AI Accuracy', icon: '🎯' },
  { id: 'content', label: 'Content Quality', icon: '📚' },
  { id: 'feature', label: 'Feature Request', icon: '💡' },
  { id: 'bug', label: 'Bug Report', icon: '🐛' },
  { id: 'general', label: 'General Feedback', icon: '💬' }
];

export const recentFeedback = [
  {
    id: 1,
    type: 'accuracy',
    rating: 4,
    title: 'Crop recommendation was accurate',
    content: 'The wheat recommendation for my soil type was spot on. Great yield this season!',
    date: '2024-11-10',
    status: 'resolved',
    response: 'Thank you for the positive feedback! We\'re glad our recommendations helped.'
  },
  {
    id: 2,
    type: 'ui',
    rating: 3,
    title: 'Mobile app could be improved',
    content: 'The mobile interface is good but navigation could be more intuitive.',
    date: '2024-11-08',
    status: 'in-progress',
    response: 'We\'re working on mobile UI improvements in the next update.'
  },
  {
    id: 3,
    type: 'feature',
    rating: 5,
    title: 'Love the weather integration',
    content: 'Weather forecasts help me plan irrigation perfectly. Thank you!',
    date: '2024-11-05',
    status: 'resolved',
    response: 'Glad you find the weather feature useful!'
  }
];

export const adminStats = {
  totalFeedback: 1234,
  averageRating: 4.2,
  responseRate: 89,
  categoryBreakdown: {
    ui: 156,
    accuracy: 234,
    content: 189,
    feature: 298,
    bug: 187,
    general: 170
  }
};