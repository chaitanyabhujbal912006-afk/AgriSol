import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Droplets, 
  Sun, 
  Thermometer,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  Leaf,
  Bug,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface PlantExplorerProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const plantsDatabase = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    category: 'Cereals',
    season: 'Kharif',
    waterNeed: 'High',
    climate: 'Tropical',
    region: 'Pan India',
    duration: '120-150 days',
    yield: '4.5 tons/acre',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    rating: 4.5,
    difficulty: 'Medium',
    profitability: 'High',
    description: 'Rice is a staple cereal crop grown extensively across India, particularly in regions with abundant water supply.',
    overview: {
      family: 'Poaceae',
      lifecycle: 'Annual',
      plantingDepth: '2-3 cm',
      spacing: '20x15 cm',
      soilType: 'Clay loam, well-puddled',
      phRange: '6.0-7.0'
    },
    agronomy: {
      landPreparation: 'Deep ploughing and puddling required',
      seedRate: '20-25 kg/acre',
      fertilizer: 'NPK 120:60:40 kg/acre',
      irrigation: 'Continuous flooding required',
      intercropping: 'Fish farming, duck rearing'
    },
    pests: [
      { name: 'Brown Plant Hopper', severity: 'High', treatment: 'Imidacloprid spray' },
      { name: 'Stem Borer', severity: 'Medium', treatment: 'Chlorpyrifos application' },
      { name: 'Blast Disease', severity: 'High', treatment: 'Tricyclazole fungicide' }
    ],
    marketPrice: '₹1,800-2,200/quintal',
    resources: [
      { title: 'Rice Cultivation Guide', type: 'video', duration: '15 min' },
      { title: 'Water Management in Rice', type: 'article', duration: '8 min read' }
    ]
  },
  {
    id: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereals',
    season: 'Rabi',
    waterNeed: 'Medium',
    climate: 'Temperate',
    region: 'North & Central India',
    duration: '110-130 days',
    yield: '3.2 tons/acre',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    rating: 4.2,
    difficulty: 'Easy',
    profitability: 'Medium',
    description: 'Wheat is a major cereal crop grown during the winter season, primarily in northern and central India.',
    overview: {
      family: 'Poaceae',
      lifecycle: 'Annual',
      plantingDepth: '3-5 cm',
      spacing: 'Broadcasting or 20 cm rows',
      soilType: 'Well-drained loamy soil',
      phRange: '6.0-7.5'
    },
    agronomy: {
      landPreparation: '2-3 ploughings with cultivator',
      seedRate: '40-50 kg/acre',
      fertilizer: 'NPK 120:60:40 kg/acre',
      irrigation: '4-6 irrigations required',
      intercropping: 'Gram, mustard, lentil'
    },
    pests: [
      { name: 'Aphids', severity: 'Medium', treatment: 'Dimethoate spray' },
      { name: 'Rust Disease', severity: 'High', treatment: 'Propiconazole fungicide' },
      { name: 'Termites', severity: 'Low', treatment: 'Chlorpyrifos soil treatment' }
    ],
    marketPrice: '₹2,000-2,400/quintal',
    resources: [
      { title: 'Modern Wheat Farming', type: 'video', duration: '12 min' },
      { title: 'Disease Management in Wheat', type: 'article', duration: '6 min read' }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    season: 'All Season',
    waterNeed: 'Medium',
    climate: 'Temperate',
    region: 'Pan India',
    duration: '90-120 days',
    yield: '15-20 tons/acre',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
    rating: 4.0,
    difficulty: 'Hard',
    profitability: 'Very High',
    description: 'Tomato is a popular vegetable crop that can be grown year-round with proper care and protection.',
    overview: {
      family: 'Solanaceae',
      lifecycle: 'Annual',
      plantingDepth: '1-2 cm',
      spacing: '60x45 cm',
      soilType: 'Well-drained sandy loam',
      phRange: '6.0-6.8'
    },
    agronomy: {
      landPreparation: 'Deep ploughing with organic matter',
      seedRate: '200-250g/acre',
      fertilizer: 'NPK 150:75:75 kg/acre',
      irrigation: 'Drip irrigation preferred',
      intercropping: 'Coriander, onion, garlic'
    },
    pests: [
      { name: 'Late Blight', severity: 'High', treatment: 'Mancozeb spray' },
      { name: 'Whitefly', severity: 'High', treatment: 'Imidacloprid application' },
      { name: 'Fruit Borer', severity: 'Medium', treatment: 'NPV spray' }
    ],
    marketPrice: '₹800-1,500/quintal',
    resources: [
      { title: 'Greenhouse Tomato Production', type: 'video', duration: '18 min' },
      { title: 'Integrated Pest Management', type: 'article', duration: '10 min read' }
    ]
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crops',
    season: 'Perennial',
    waterNeed: 'Very High',
    climate: 'Tropical',
    region: 'Maharashtra, UP, Karnataka',
    duration: '12-18 months',
    yield: '45-60 tons/acre',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
    rating: 3.8,
    difficulty: 'Medium',
    profitability: 'Very High',
    description: 'Sugarcane is a long-duration cash crop that provides excellent returns with proper management.',
    overview: {
      family: 'Poaceae',
      lifecycle: 'Perennial',
      plantingDepth: '5-7 cm',
      spacing: '90-120 cm rows',
      soilType: 'Deep, fertile, well-drained',
      phRange: '6.5-7.5'
    },
    agronomy: {
      landPreparation: 'Deep ploughing and furrow making',
      seedRate: '37,500-50,000 cuttings/acre',
      fertilizer: 'NPK 200:80:80 kg/acre',
      irrigation: 'Heavy irrigation required',
      intercropping: 'Potato, onion, garlic'
    },
    pests: [
      { name: 'Red Rot', severity: 'High', treatment: 'Resistant varieties' },
      { name: 'Early Shoot Borer', severity: 'Medium', treatment: 'Carbofuran application' },
      { name: 'Scale Insects', severity: 'Low', treatment: 'Malathion spray' }
    ],
    marketPrice: '₹280-320/quintal',
    resources: [
      { title: 'Sustainable Sugarcane Production', type: 'video', duration: '20 min' },
      { title: 'Water Management in Sugarcane', type: 'article', duration: '12 min read' }
    ]
  }
];

const categories = ['All', 'Cereals', 'Vegetables', 'Cash Crops', 'Pulses', 'Oil Seeds'];
const seasons = ['All', 'Kharif', 'Rabi', 'Zaid', 'All Season', 'Perennial'];
const waterNeeds = ['All', 'Low', 'Medium', 'High', 'Very High'];
const climates = ['All', 'Tropical', 'Temperate', 'Arid', 'Semi-Arid'];

export function PlantExplorer({ onNavigate, navigationData, userRole }: PlantExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedWaterNeed, setSelectedWaterNeed] = useState('All');
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [selectedPlant, setSelectedPlant] = useState<string | null>(navigationData?.crop || null);

  const filteredPlants = useMemo(() => {
    return plantsDatabase.filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
      const matchesSeason = selectedSeason === 'All' || plant.season === selectedSeason;
      const matchesWaterNeed = selectedWaterNeed === 'All' || plant.waterNeed === selectedWaterNeed;
      const matchesClimate = selectedClimate === 'All' || plant.climate === selectedClimate;
      
      return matchesSearch && matchesCategory && matchesSeason && matchesWaterNeed && matchesClimate;
    });
  }, [searchQuery, selectedCategory, selectedSeason, selectedWaterNeed, selectedClimate]);

  const selectedPlantData = selectedPlant ? plantsDatabase.find(p => p.id === selectedPlant) : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'Very High': return 'bg-green-600';
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Plant Info Explorer
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive database of crop information, growing guidelines, and best practices
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
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Plants</label>
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

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Season</label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season}>{season}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Water Need */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Water Need</label>
              <Select value={selectedWaterNeed} onValueChange={setSelectedWaterNeed}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {waterNeeds.map(need => (
                    <SelectItem key={need} value={need}>{need}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Climate */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Climate</label>
              <Select value={selectedClimate} onValueChange={setSelectedClimate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {climates.map(climate => (
                    <SelectItem key={climate} value={climate}>{climate}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSeason('All');
                setSelectedWaterNeed('All');
                setSelectedClimate('All');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {!selectedPlant ? (
            /* Plant Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Found {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlants.map((plant) => (
                  <Card
                    key={plant.id}
                    className="crop-card-hover cursor-pointer border-0 shadow-lg overflow-hidden"
                    onClick={() => setSelectedPlant(plant.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={plant.image}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute top-3 right-3 space-y-1">
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          {plant.season}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {plant.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-medium">{plant.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{plant.name}</h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <p className="text-xs italic text-muted-foreground mb-2">{plant.scientificName}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{plant.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span>{plant.waterNeed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span>{plant.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span>{plant.yield}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={`text-xs ${getDifficultyColor(plant.difficulty)} px-2 py-0`}>
                            {plant.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Plant Detail View */
            selectedPlantData && (
              <div className="space-y-6">
                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlant(null)}
                  className="mb-4"
                >
                  ← Back to Plants
                </Button>

                {/* Plant Header */}
                <Card className="glass-card border-0 overflow-hidden">
                  <div className="relative h-64 lg:h-80">
                    <ImageWithFallback
                      src={selectedPlantData.image}
                      alt={selectedPlantData.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                            {selectedPlantData.name}
                          </h1>
                          <p className="text-lg italic text-white/80 mb-2">
                            {selectedPlantData.scientificName}
                          </p>
                          <p className="text-white/90 max-w-2xl">
                            {selectedPlantData.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white font-medium">{selectedPlantData.rating}</span>
                          </div>
                          <Badge className={`${getDifficultyColor(selectedPlantData.difficulty)} backdrop-blur-sm`}>
                            {selectedPlantData.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{selectedPlantData.duration}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Expected Yield</p>
                    <p className="font-semibold">{selectedPlantData.yield}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Droplets className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Water Need</p>
                    <p className="font-semibold">{selectedPlantData.waterNeed}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Sun className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Climate</p>
                    <p className="font-semibold">{selectedPlantData.climate}</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <div className={`w-8 h-8 ${getProfitabilityColor(selectedPlantData.profitability)} rounded mx-auto mb-2`} />
                    <p className="text-sm text-muted-foreground">Profitability</p>
                    <p className="font-semibold">{selectedPlantData.profitability}</p>
                  </Card>
                </div>

                {/* Detailed Information Tabs */}
                <Card className="glass-card border-0">
                  <CardContent className="p-6">
                    <Tabs defaultValue="overview" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="agronomy">Agronomy</TabsTrigger>
                        <TabsTrigger value="pests">Pests & Diseases</TabsTrigger>
                        <TabsTrigger value="market">Market Info</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Plant Characteristics</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Family</p>
                                <p className="font-medium">{selectedPlantData.overview.family}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Lifecycle</p>
                                <p className="font-medium">{selectedPlantData.overview.lifecycle}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Planting Depth</p>
                                <p className="font-medium">{selectedPlantData.overview.plantingDepth}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Spacing</p>
                                <p className="font-medium">{selectedPlantData.overview.spacing}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Soil Requirements</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Soil Type</p>
                                <p className="font-medium">{selectedPlantData.overview.soilType}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">pH Range</p>
                                <p className="font-medium">{selectedPlantData.overview.phRange}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Region</p>
                                <p className="font-medium">{selectedPlantData.region}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Season</p>
                                <p className="font-medium">{selectedPlantData.season}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="agronomy" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Field Preparation</h3>
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Land Preparation</p>
                                <p className="font-medium">{selectedPlantData.agronomy.landPreparation}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Seed Rate</p>
                                <p className="font-medium">{selectedPlantData.agronomy.seedRate}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Crop Management</h3>
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Fertilizer</p>
                                <p className="font-medium">{selectedPlantData.agronomy.fertilizer}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Irrigation</p>
                                <p className="font-medium">{selectedPlantData.agronomy.irrigation}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Intercropping</p>
                                <p className="font-medium">{selectedPlantData.agronomy.intercropping}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="pests" className="space-y-6">
                        <div className="space-y-4">
                          {selectedPlantData.pests.map((pest, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <Bug className="w-4 h-4" />
                                  {pest.name}
                                </h4>
                                <Badge className={`${
                                  pest.severity === 'High' ? 'bg-red-100 text-red-800' :
                                  pest.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {pest.severity} Risk
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                <strong>Treatment:</strong> {pest.treatment}
                              </p>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="market" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <DollarSign className="w-6 h-6 text-green-500" />
                              <div>
                                <h3 className="font-semibold text-foreground">Market Price</h3>
                                <p className="text-sm text-muted-foreground">Current market rate</p>
                              </div>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{selectedPlantData.marketPrice}</p>
                          </Card>
                          
                          <Card className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <BookOpen className="w-6 h-6 text-blue-500" />
                              <div>
                                <h3 className="font-semibold text-foreground">Resources</h3>
                                <p className="text-sm text-muted-foreground">Learning materials</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {selectedPlantData.resources.map((resource, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                                  <div>
                                    <p className="font-medium text-sm">{resource.title}</p>
                                    <p className="text-xs text-muted-foreground">{resource.duration}</p>
                                  </div>
                                  <Badge variant="outline">{resource.type}</Badge>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => onNavigate('growth-calendar', { plant: selectedPlantData })}
                    className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Plan in Calendar
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('chatbot', { query: `Tell me more about growing ${selectedPlantData.name}` })}
                  >
                    Ask Chatbot About This Plant
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