import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Landmark, 
  Sparkles, 
  ChevronRight, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import API_BASE_URL from '../../config/api';

interface GovernmentSchemesProps {
  onNavigate: (page: string, data?: any) => void;
}

const mockSchemes = [
  {
    id: 's1',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Income Support',
    benefit: '₹6,000 per year in 3 equal installments of ₹2,000 directly to bank account',
    eligibility: 'All landholding farmer families with cultivable land',
    documentsRequired: ['Aadhaar Card', 'Land Ownership Certificate / Khasra', 'Bank Account Passbook'],
    applyUrl: 'https://pmkisan.gov.in',
    isFeatured: true,
    targetStates: ['all']
  },
  {
    id: 's2',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture',
    category: 'Crop Insurance',
    benefit: 'Comprehensive crop insurance coverage against yield loss from natural calamities. Premium: 1.5% for Rabi, 2% for Kharif crops',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops',
    documentsRequired: ['Land Sowing Certificate', 'Aadhaar Card', 'Bank Passbook', 'Crop Sowing Proof'],
    applyUrl: 'https://pmfby.gov.in',
    isFeatured: true,
    targetStates: ['all']
  },
  {
    id: 's3',
    title: 'Kisan Credit Card (KCC) Scheme',
    ministry: 'Reserve Bank of India & NABARD',
    category: 'Credit & Loans',
    benefit: 'Concessional credit up to ₹3 Lakhs at effective interest rate of 4% per annum (with prompt repayment incentive)',
    eligibility: 'Farmers, tenant farmers, oral lessees, self-help groups (SHGs)',
    documentsRequired: ['KCC Application Form', 'Land Record Proof', 'Passport Photo', 'Identity & Address Proof'],
    applyUrl: 'https://myscheme.gov.in',
    isFeatured: true,
    targetStates: ['all']
  },
  {
    id: 's4',
    title: 'Per Drop More Crop (PMKSY - Drip & Sprinkler Subsidy)',
    ministry: 'Department of Agriculture & Farmers Welfare',
    category: 'Irrigation Subsidy',
    benefit: '55% subsidy for small & marginal farmers and 45% for other farmers for micro-irrigation system setup',
    eligibility: 'Farmers owning land with an assured water source',
    documentsRequired: ['Electricity Bill / Water Source Proof', 'Land 7/12 Extraction', 'Bank Details'],
    applyUrl: 'https://pmksy.gov.in',
    isFeatured: false,
    targetStates: ['Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Karnataka', 'Tamil Nadu']
  },
  {
    id: 's5',
    title: 'Soil Health Card Scheme',
    ministry: 'Ministry of Agriculture',
    category: 'Soil Testing',
    benefit: 'Free soil testing & customized fertilizer dose card issued every 2 years',
    eligibility: 'All farmers across India',
    documentsRequired: ['Aadhaar Card', 'Field Coordinates / Survey Number'],
    applyUrl: 'https://soilhealth.dac.gov.in',
    isFeatured: false,
    targetStates: ['all']
  }
];

export function GovernmentSchemes({ onNavigate }: GovernmentSchemesProps) {
  const [schemes, setSchemes] = useState(mockSchemes);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<any>(null);

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedState]);

  const fetchSchemes = async () => {
    try {
      let url = `${API_BASE_URL}/schemes?`;
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (selectedState !== 'all') url += `state=${selectedState}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data?.schemes?.length > 0) {
        setSchemes(data.data.schemes);
      }
    } catch (e) {
      // Keep mock
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50">
              🏛️ Government of India Direct Portal
            </Badge>
            <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50">
              Direct Benefit Transfer (DBT)
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Subsidies & Schemes</h1>
          <p className="text-blue-100 text-sm mt-1">
            Discover central & state agriculture schemes, financial income support, and equipment subsidies.
          </p>
        </div>

        <Button 
          onClick={() => window.open('https://www.myscheme.gov.in/', '_blank')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg shrink-0 gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          myScheme National Portal
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search scheme name (PM-KISAN, PMFBY), subsidy, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-slate-50 dark:bg-slate-900">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Income Support">Income Support</SelectItem>
                <SelectItem value="Crop Insurance">Crop Insurance</SelectItem>
                <SelectItem value="Credit & Loans">Credit & Loans</SelectItem>
                <SelectItem value="Irrigation Subsidy">Irrigation Subsidy</SelectItem>
                <SelectItem value="Soil Testing">Soil Testing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-[160px] bg-slate-50 dark:bg-slate-900">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All India</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className={`border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow ${scheme.isFeatured ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-slate-200 dark:border-slate-800'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs">
                  {scheme.category}
                </Badge>
                {scheme.isFeatured && (
                  <Badge className="bg-emerald-600 text-white text-[10px]">
                    ⭐ Featured Scheme
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-2 leading-snug">
                {scheme.title}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {scheme.ministry}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Financial Benefit</span>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {scheme.benefit}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Eligibility</span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {scheme.eligibility}
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedSchemeForModal(scheme)}
                    className="text-xs gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Required Docs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold">{selectedSchemeForModal?.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <h5 className="font-semibold text-xs text-slate-500 uppercase mb-2">Required Documents</h5>
                      <ul className="space-y-1.5 text-sm">
                        {selectedSchemeForModal?.documentsRequired?.map((doc: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                      💡 Tip: Keep scanned copies of Aadhaar and 7/12 Land Record ready before opening the application portal.
                    </div>

                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      onClick={() => window.open(selectedSchemeForModal?.applyUrl, '_blank')}
                    >
                      Apply via Official Portal <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                size="sm" 
                onClick={() => window.open(scheme.applyUrl, '_blank')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
              >
                Apply Online <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
