export const videoDatabase = [
  {
    id: 1,
    title: 'Modern Rice Cultivation Techniques',
    description: 'Learn the latest methods for high-yield rice farming including SRI techniques and water management.',
    thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    duration: '15:32',
    instructor: 'Dr. Rajesh Kumar',
    topic: 'Crop Production',
    crop: 'Rice',
    language: 'English',
    level: 'Intermediate',
    rating: 4.8,
    views: 12500,
    uploadDate: '2024-02-15',
    tags: ['Rice', 'SRI', 'Water Management', 'High Yield']
  },
  {
    id: 2,
    title: 'Organic Fertilizer Preparation',
    description: 'Step-by-step guide to prepare organic compost and bio-fertilizers at home for sustainable farming.',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    duration: '12:18',
    instructor: 'Priya Sharma',
    topic: 'Soil Management',
    crop: 'All Crops',
    language: 'Hindi',
    level: 'Beginner',
    rating: 4.6,
    views: 8900,
    uploadDate: '2024-02-10',
    tags: ['Organic', 'Compost', 'Bio-fertilizer', 'Sustainable']
  },
  {
    id: 3,
    title: 'Tomato Disease Management',
    description: 'Identify and treat common tomato diseases like blight, wilt, and viral infections using IPM approach.',
    thumbnail: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
    duration: '18:45',
    instructor: 'Dr. Meera Patel',
    topic: 'Disease Management',
    crop: 'Tomato',
    language: 'English',
    level: 'Advanced',
    rating: 4.9,
    views: 15600,
    uploadDate: '2024-02-08',
    tags: ['Tomato', 'Disease', 'IPM', 'Blight', 'Treatment']
  },
  {
    id: 4,
    title: 'Drip Irrigation Setup Guide',
    description: 'Complete tutorial on setting up and maintaining drip irrigation systems for water-efficient farming.',
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
    duration: '22:14',
    instructor: 'Ravi Joshi',
    topic: 'Irrigation',
    crop: 'All Crops',
    language: 'Tamil',
    level: 'Intermediate',
    rating: 4.7,
    views: 9800,
    uploadDate: '2024-02-05',
    tags: ['Irrigation', 'Drip System', 'Water Conservation', 'Setup']
  },
  {
    id: 5,
    title: 'Wheat Harvesting Best Practices',
    description: 'Optimal timing and techniques for wheat harvesting to maximize yield and quality.',
    thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    duration: '14:27',
    instructor: 'Suresh Singh',
    topic: 'Harvesting',
    crop: 'Wheat',
    language: 'Hindi',
    level: 'Beginner',
    rating: 4.5,
    views: 7200,
    uploadDate: '2024-01-28',
    tags: ['Wheat', 'Harvesting', 'Timing', 'Quality']
  },
  {
    id: 6,
    title: 'Smart Farming with IoT Sensors',
    description: 'Introduction to precision agriculture using IoT devices for monitoring soil moisture, temperature, and nutrients.',
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
    duration: '25:33',
    instructor: 'Dr. Anita Gupta',
    topic: 'Technology',
    crop: 'All Crops',
    language: 'English',
    level: 'Advanced',
    rating: 4.8,
    views: 11400,
    uploadDate: '2024-01-25',
    tags: ['IoT', 'Smart Farming', 'Sensors', 'Precision Agriculture']
  }
];

export const topics = ['All', 'Crop Production', 'Soil Management', 'Disease Management', 'Irrigation', 'Harvesting', 'Technology'];
export const crops = ['All', 'Rice', 'Wheat', 'Tomato', 'Cotton', 'Sugarcane', 'All Crops'];
export const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
export const languages = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];

export const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};