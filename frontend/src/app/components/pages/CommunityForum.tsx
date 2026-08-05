import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Award, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Tag, 
  Clock, 
  HelpCircle, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import API_BASE_URL from '../../config/api';

interface CommunityForumProps {
  onNavigate: (page: string, data?: any) => void;
}

const mockPosts = [
  {
    id: 'p1',
    author: { name: 'Ramesh Patel', role: 'farmer', district: 'Nashik', profileImage: '' },
    title: 'Yellow spot disease on Tomato leaves — what organic spray works best?',
    content: 'Noticed yellow concentric rings on my tomato field leaves since yesterday. Looking for organic or bio-control remedies before applying chemical fungicide.',
    category: 'question',
    cropTags: ['Tomato'],
    tags: ['Organic', 'Disease', 'PestControl'],
    likesCount: 14,
    commentsCount: 6,
    isLiked: false,
    isExpertAnswered: true,
    expertAnswer: {
      expertName: 'Dr. Anita Deshmukh (Agri Expert, MPKV)',
      content: 'This appears to be Early Blight (Alternaria solani). Spray Neem Oil (5ml/L) with Trichoderma harzianum @ 5g/L immediately. If infection exceeds 25%, use Copper Oxychloride 50% WP @ 2.5g/L.',
      answeredAt: '2 hours ago'
    },
    createdAt: '4 hours ago'
  },
  {
    id: 'p2',
    author: { name: 'Suresh Kumar', role: 'farmer', district: 'Ludhiana', profileImage: '' },
    title: 'Drip irrigation water savings in Cotton — 40% reduction in water bill!',
    content: 'Installed sub-surface drip irrigation for 5 acres of cotton this Kharif season. Water consumption reduced significantly while plant height and boll formation look healthier than last year.',
    category: 'discussion',
    cropTags: ['Cotton'],
    tags: ['DripIrrigation', 'WaterManagement', 'Kharif2026'],
    likesCount: 32,
    commentsCount: 9,
    isLiked: true,
    isExpertAnswered: false,
    createdAt: '1 day ago'
  },
  {
    id: 'p3',
    author: { name: 'Vikram Singh', role: 'farmer', district: 'Indore', profileImage: '' },
    title: 'Soybean seed treatment recommendations for upcoming monsoon sowing',
    content: 'Which bio-fertilizers and fungicides are best for seed priming before sowing JS-335 soybean variety?',
    category: 'question',
    cropTags: ['Soybean'],
    tags: ['Seeds', 'Monsoon', 'Sowing'],
    likesCount: 19,
    commentsCount: 4,
    isLiked: false,
    isExpertAnswered: true,
    expertAnswer: {
      expertName: 'Prof. Rajesh Sharma (JNKVV Jabalpur)',
      content: 'Treat seeds with Carboxin + Thiram @ 2g/kg seed followed by Rhizobium culture @ 10g/kg and PSB @ 10g/kg. Allow seeds to dry in shade for 30 mins before sowing.',
      answeredAt: '5 hours ago'
    },
    createdAt: '2 days ago'
  }
];

export function CommunityForum({ onNavigate }: CommunityForumProps) {
  const [posts, setPosts] = useState(mockPosts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('question');
  const [newCrop, setNewCrop] = useState('Wheat');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    try {
      const url = `${API_BASE_URL}/community${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data?.docs?.length > 0) {
        setPosts(data.data.docs.map((p: any) => ({
          id: p._id,
          author: p.author || { name: 'Farmer', role: 'farmer', district: 'Local' },
          title: p.title,
          content: p.content,
          category: p.category || 'discussion',
          cropTags: p.cropTags || [],
          tags: p.tags || [],
          likesCount: p.likeCount || p.likes?.length || 0,
          commentsCount: p.commentsCount || p.comments?.length || 0,
          isLiked: p.isLikedByMe || false,
          isExpertAnswered: p.isExpertAnswered || false,
          expertAnswer: p.expertAnswer ? {
            expertName: p.expertAnswer.expert?.name || 'Agri Expert',
            content: p.expertAnswer.content,
            answeredAt: 'Recently'
          } : undefined,
          createdAt: 'Recently'
        })));
      }
    } catch (e) {
      // Keep mock data
    }
  };

  const handleToggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem = {
      id: 'p-' + Date.now(),
      author: { name: 'You (Farmer)', role: 'farmer', district: 'Nashik' },
      title: newTitle,
      content: newContent,
      category: newCategory,
      cropTags: [newCrop],
      tags: ['FarmingHelp'],
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isExpertAnswered: false,
      createdAt: 'Just now'
    };

    setPosts([newPostItem, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsDialogOpen(false);
  };

  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50">
              🌱 Verified Farmers & Agronomists
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/50">
              Ask Agricultural Experts
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Knowledge Community</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Connect with over 50,000+ farmers, ask crop diagnosis questions, and get verified scientist answers.
          </p>
        </div>

        {/* Create Post Dialog Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shrink-0 gap-2">
              <Plus className="w-5 h-5" />
              Ask a Question / Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Ask Question or Share Knowledge</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Category</label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question">Question (Ask Scientists & Farmers)</SelectItem>
                    <SelectItem value="discussion">General Discussion & Tip</SelectItem>
                    <SelectItem value="disease">Crop Disease Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Crop</label>
                <Select value={newCrop} onValueChange={setNewCrop}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Tomato">Tomato</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
                <Input 
                  placeholder="e.g. Yellow leaf curl on my Tomato crop — what spray to use?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Detailed Description</label>
                <Textarea 
                  placeholder="Describe soil type, symptoms, current stage, and any past treatments applied..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Publish Post</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Button 
              size="sm" 
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
              className={activeCategory === 'all' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              All Topics
            </Button>
            <Button 
              size="sm" 
              variant={activeCategory === 'question' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('question')}
              className={activeCategory === 'question' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1" /> Questions
            </Button>
            <Button 
              size="sm" 
              variant={activeCategory === 'discussion' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('discussion')}
              className={activeCategory === 'discussion' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              Discussions
            </Button>
          </div>

          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search forum topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm bg-slate-50 dark:bg-slate-900"
            />
          </div>
        </CardContent>
      </Card>

      {/* Post Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            No community posts found matching your search.
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-emerald-200 dark:border-emerald-800">
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold">
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{post.author.name}</h4>
                        <Badge variant="outline" className="text-[10px] py-0 border-slate-300">
                          {post.author.district}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {post.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.cropTags.map((crop, idx) => (
                      <Badge key={idx} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs">
                        🌾 {crop}
                      </Badge>
                    ))}
                    {post.isExpertAnswered && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" /> Scientist Answered
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Expert Verified Answer Highlight Box */}
                {post.expertAnswer && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-xs text-amber-900 dark:text-amber-200">
                        {post.expertAnswer.expertName}
                      </span>
                      <Badge className="bg-amber-500 text-white text-[10px] py-0">Verified Agronomist</Badge>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium pl-6 border-l-2 border-amber-400">
                      {post.expertAnswer.content}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleToggleLike(post.id)}
                    className={`gap-1.5 text-xs ${post.isLiked ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950' : ''}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {post.likesCount} Helpful
                  </Button>

                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post.commentsCount} Replies
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400 hover:text-slate-600">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
