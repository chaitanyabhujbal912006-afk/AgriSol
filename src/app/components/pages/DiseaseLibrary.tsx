import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Bug, 
  AlertTriangle, 
  Shield, 
  Eye,
  BookOpen,
  Video,
  ChevronRight,
  Leaf,
  Sprout,
  Camera,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface DiseaseLibraryProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const diseaseDatabase = [
  {
    id: 'late-blight-tomato',
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    type: 'Fungal Disease',
    severity: 'High',
    affectedCrops: ['Tomato', 'Potato'],
    region: 'Pan India',
    season: 'Monsoon',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    description: 'A devastating fungal disease that affects tomato and potato crops, causing rapid leaf death and fruit rot.',
    symptoms: [
      'Dark water-soaked spots on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown lesions on stems',
      'Fruit rot with dark patches'
    ],
    causes: [
      'High humidity (>90%)',
      'Cool temperatures (15-25°C)',
      'Moisture on leaves',
      'Dense plant spacing'
    ],
    prevention: [
      'Use resistant varieties',
      'Proper plant spacing',
      'Drip irrigation to avoid leaf wetness',
      'Remove infected plant debris'
    ],
    treatment: [
      'Copper-based fungicides',
      'Mancozeb spray (2g/L)',
      'Chlorothalonil application',
      'Remove and destroy infected plants'
    ],
    economicImpact: 'Can cause 30-80% yield loss',
    identificationTips: 'Look for dark spots with white fuzzy growth on humid days'
  },
  {
    id: 'brown-spot-rice',
    name: 'Brown Spot',
    scientificName: 'Bipolaris oryzae',
    type: 'Fungal Disease',
    severity: 'Medium',
    affectedCrops: ['Rice'],
    region: 'Eastern & Southern India',
    season: 'Kharif',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    description: 'A common fungal disease in rice causing brown spots on leaves and reducing grain quality.',
    symptoms: [
      'Small brown oval spots on leaves',
      'Spots with yellow halos',
      'Lesions on leaf sheaths',
      'Reduced grain filling'
    ],
    causes: [
      'High humidity',
      'Nitrogen deficiency',
      'Drought stress',
      'Poor soil fertility'
    ],
    prevention: [
      'Balanced fertilization',
      'Proper water management',
      'Use healthy seeds',
      'Crop rotation'
    ],
    treatment: [
      'Propiconazole fungicide',
      'Mancozeb spray',
      'Tricyclazole application',
      'Balanced NPK fertilization'
    ],
    economicImpact: 'Can reduce yield by 10-45%',
    identificationTips: 'Brown oval spots with light centers appear first on older leaves'
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    scientificName: 'Erysiphe cichoracearum',
    type: 'Fungal Disease',
    severity: 'Medium',
    affectedCrops: ['Cucumber', 'Pumpkin', 'Watermelon', 'Muskmelon'],
    region: 'North & Western India',
    season: 'Winter',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
    description: 'A fungal disease causing white powdery coating on leaves of cucurbits.',
    symptoms: [
      'White powdery coating on leaves',
      'Yellow patches on upper leaf surface',
      'Premature leaf drop',
      'Reduced fruit quality'
    ],
    causes: [
      'Moderate temperatures (20-25°C)',
      'High humidity at night',
      'Poor air circulation',
      'Excessive nitrogen'
    ],
    prevention: [
      'Proper plant spacing',
      'Good air circulation',
      'Avoid overhead watering',
      'Resistant varieties'
    ],
    treatment: [
      'Sulfur dusting',
      'Potassium bicarbonate spray',
      'Myclobutanil fungicide',
      'Neem oil application'
    ],
    economicImpact: 'Can cause 20-50% yield loss',
    identificationTips: 'White powdery growth appears first on lower leaves'
  },
  {
    id: 'bacterial-wilt',
    name: 'Bacterial Wilt',
    scientificName: 'Ralstonia solanacearum',
    type: 'Bacterial Disease',
    severity: 'High',
    affectedCrops: ['Tomato', 'Brinjal', 'Chili', 'Potato'],
    region: 'South India',
    season: 'Summer',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
    description: 'A soil-borne bacterial disease causing sudden wilting and death of plants.',
    symptoms: [
      'Sudden wilting of plants',
      'Brown discoloration in stem',
      'Bacterial ooze from cut stems',
      'Plant death within days'
    ],
    causes: [
      'Contaminated soil',
      'High soil temperature',
      'Excess moisture',
      'Mechanical injury to roots'
    ],
    prevention: [
      'Use disease-free seeds',
      'Soil solarization',
      'Crop rotation',
      'Avoid waterlogging'
    ],
    treatment: [
      'Remove infected plants',
      'Soil treatment with bleaching powder',
      'Streptocycline spray',
      'Copper oxychloride application'
    ],
    economicImpact: 'Can cause 100% crop loss',
    identificationTips: 'Milky bacterial ooze appears when stem is cut and placed in water'
  }
];

const diseaseTypes = ['All', 'Fungal Disease', 'Bacterial Disease', 'Viral Disease', 'Nematode'];
const severityLevels = ['All', 'Low', 'Medium', 'High'];
const affectedCrops = ['All', 'Rice', 'Wheat', 'Tomato', 'Potato', 'Cotton', 'Sugarcane'];

export function DiseaseLibrary({ onNavigate, navigationData, userRole }: DiseaseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedDisease, setSelectedDisease] = useState<string | null>(navigationData?.disease || null);

  const filteredDiseases = useMemo(() => {
    return diseaseDatabase.filter(disease => {
      const matchesSearch = disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          disease.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || disease.type === selectedType;
      const matchesSeverity = selectedSeverity === 'All' || disease.severity === selectedSeverity;
      const matchesCrop = selectedCrop === 'All' || disease.affectedCrops.includes(selectedCrop);
      
      return matchesSearch && matchesType && matchesSeverity && matchesCrop;
    });
  }, [searchQuery, selectedType, selectedSeverity, selectedCrop]);

  const selectedDiseaseData = selectedDisease ? diseaseDatabase.find(d => d.id === selectedDisease) : null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Fungal')) return <Leaf className="w-4 h-4" />;
    if (type.includes('Bacterial')) return <Bug className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Disease Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive database of crop diseases with identification, prevention, and treatment guides
          </p>
        </div>
        
        <Alert className="lg:max-w-md border-blue-200 bg-blue-50">
          <Camera className="w-4 h-4" />
          <AlertDescription className="text-blue-800">
            <strong>Coming Soon:</strong> AI-powered disease identification through image upload
          </AlertDescription>
        </Alert>
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
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Diseases</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Disease Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Disease Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diseaseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity Level</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map(severity => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Affected Crops */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Affected Crops</label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {affectedCrops.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedSeverity('All');
                setSelectedCrop('All');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!selectedDisease ? (
            /* Disease Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Found {filteredDiseases.length} disease{filteredDiseases.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDiseases.map((disease) => (
                  <Card
                    key={disease.id}
                    className="crop-card-hover cursor-pointer border-0 shadow-lg overflow-hidden"
                    onClick={() => setSelectedDisease(disease.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={disease.image}
                        alt={disease.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute top-3 right-3 space-y-1">
                        <Badge className={`${getSeverityColor(disease.severity)} backdrop-blur-sm`}>
                          {disease.severity} Risk
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          {disease.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {getTypeIcon(disease.type)}
                          {disease.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <p className="text-xs italic text-muted-foreground mb-2">{disease.scientificName}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{disease.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Affected Crops: </span>
                          <span className="font-medium">{disease.affectedCrops.join(', ')}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Season: </span>
                          <span className="font-medium">{disease.season}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Economic Impact: </span>
                          <span className="font-medium text-red-600">{disease.economicImpact}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Disease Detail View */
            selectedDiseaseData && (
              <div className="space-y-6">
                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedDisease(null)}
                  className="mb-4"
                >
                  ← Back to Disease Library
                </Button>

                {/* Disease Header */}
                <Card className="glass-card border-0 overflow-hidden">
                  <div className="relative h-64">
                    <ImageWithFallback
                      src={selectedDiseaseData.image}
                      alt={selectedDiseaseData.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            {getTypeIcon(selectedDiseaseData.type)}
                            {selectedDiseaseData.name}
                          </h1>
                          <p className="text-lg italic text-white/80 mb-2">
                            {selectedDiseaseData.scientificName}
                          </p>
                          <p className="text-white/90 max-w-2xl">
                            {selectedDiseaseData.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={`${getSeverityColor(selectedDiseaseData.severity)} backdrop-blur-sm`}>
                            {selectedDiseaseData.severity} Risk
                          </Badge>
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {selectedDiseaseData.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Sprout className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Affected Crops</p>
                    <p className="font-semibold text-sm">{selectedDiseaseData.affectedCrops.join(', ')}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Severity</p>
                    <p className="font-semibold">{selectedDiseaseData.severity}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded" />
                    </div>
                    <p className="text-sm text-muted-foreground">Season</p>
                    <p className="font-semibold">{selectedDiseaseData.season}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <div className="w-8 h-8 bg-red-500 rounded mx-auto mb-2 flex items-center justify-center text-white">
                      ₹
                    </div>
                    <p className="text-sm text-muted-foreground">Economic Impact</p>
                    <p className="font-semibold text-red-600 text-sm">{selectedDiseaseData.economicImpact}</p>
                  </Card>
                </div>

                {/* Detailed Information */}
                <Card className="glass-card border-0">
                  <CardContent className="p-6">
                    <Tabs defaultValue="symptoms" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                        <TabsTrigger value="causes">Causes</TabsTrigger>
                        <TabsTrigger value="prevention">Prevention</TabsTrigger>
                        <TabsTrigger value="treatment">Treatment</TabsTrigger>
                      </TabsList>

                      <TabsContent value="symptoms" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Eye className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold text-foreground">Disease Symptoms</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedDiseaseData.symptoms.map((symptom, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-sm text-blue-800">{symptom}</p>
                              </div>
                            ))}
                          </div>
                          
                          <Alert className="border-yellow-200 bg-yellow-50">
                            <Info className="w-4 h-4" />
                            <AlertDescription className="text-yellow-800">
                              <strong>Identification Tip:</strong> {selectedDiseaseData.identificationTips}
                            </AlertDescription>
                          </Alert>
                        </div>
                      </TabsContent>

                      <TabsContent value="causes" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-foreground">Disease Causes</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedDiseaseData.causes.map((cause, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-sm text-orange-800">{cause}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="prevention" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-foreground">Prevention Methods</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedDiseaseData.prevention.map((method, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-sm text-green-800">{method}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="treatment" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded" />
                            </div>
                            <h3 className="font-semibold text-foreground">Treatment Options</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedDiseaseData.treatment.map((treatment, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-sm text-red-800">{treatment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => onNavigate('video-hub', { search: selectedDiseaseData.name })}
                    className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    See Tutorial Videos
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('chatbot', { query: `How to treat ${selectedDiseaseData.name} in my crops?` })}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ask Expert
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