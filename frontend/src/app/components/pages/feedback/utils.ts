import { feedbackTypes } from './constants';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTypeEmoji = (type: string) => {
  return feedbackTypes.find(t => t.id === type)?.icon || '💬';
};