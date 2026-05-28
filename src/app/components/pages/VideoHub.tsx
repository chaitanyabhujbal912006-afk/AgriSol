import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Search, 
  Filter,
  Clock,
  User,
  Star,
  Bookmark,
  Calendar,
  Video,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { videoDatabase, topics, crops, levels, languages, getLevelColor } from '../../data/videoData';

interface VideoHubProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

export function VideoHub({ onNavigate, navigationData, userRole }: VideoHubProps) {
  const [searchQuery, setSearchQuery] = useState(navigationData?.search || '');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const filteredVideos = useMemo(() => {
    return videoDatabase.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTopic = selectedTopic === 'All' || video.topic === selectedTopic;
      const matchesCrop = selectedCrop === 'All' || video.crop === selectedCrop;
      const matchesLevel = selectedLevel === 'All' || video.level === selectedLevel;
      const matchesLanguage = selectedLanguage === 'All' || video.language === selectedLanguage;
      
      return matchesSearch && matchesTopic && matchesCrop && matchesLevel && matchesLanguage;
    });
  }, [searchQuery, selectedTopic, selectedCrop, selectedLevel, selectedLanguage]);

  const selectedVideoData = selectedVideo ? videoDatabase.find(v => v.id === selectedVideo) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Tutorial Video Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Learn modern farming techniques from expert instructors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Videos</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {topics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Crop</label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {crops.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
                setSelectedCrop('All');
                setSelectedLevel('All');
                setSelectedLanguage('All');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!selectedVideo ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Found {filteredVideos.length} tutorial{filteredVideos.length !== 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="crop-card-hover cursor-pointer border-0 shadow-lg overflow-hidden"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <div className="relative h-48 overflow-hidden group">
                      <ImageWithFallback
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-black/60 text-white border-0">
                          {video.duration}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge className={`${getLevelColor(video.level)} backdrop-blur-sm`}>
                          {video.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{video.instructor}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{video.rating}</span>
                          </div>
                          <span>{video.views.toLocaleString()} views</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {video.topic}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            selectedVideoData && (
              <div className="space-y-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVideo(null)}
                  className="mb-4"
                >
                  ← Back to Videos
                </Button>

                {/* Video Player */}
                <Card className="glass-card border-0 overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <ImageWithFallback
                      src={selectedVideoData.thumbnail}
                      alt={selectedVideoData.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Video Info */}
                <Card className="glass-card border-0">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          {selectedVideoData.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{selectedVideoData.views.toLocaleString()} views</span>
                          <span>•</span>
                          <span>Uploaded {new Date(selectedVideoData.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">{selectedVideoData.instructor}</p>
                              <p className="text-sm text-muted-foreground">Instructor</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{selectedVideoData.rating}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-foreground">{selectedVideoData.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedVideoData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => onNavigate('growth-calendar', { activity: `Watch: ${selectedVideoData.title}` })}
                    className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('chatbot', { query: `Tell me more about ${selectedVideoData.title}` })}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ask Questions
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}