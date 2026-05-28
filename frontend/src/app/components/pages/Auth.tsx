import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  User, 
  Sprout, 
  Shield, 
  ArrowRight,
  Check,
  Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface AuthProps {
  onNavigate: (page: string, data?: any) => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export function Auth({ onNavigate }: AuthProps) {
  const [authStep, setAuthStep] = useState('signin'); // signin, signup, verify, role, language, details, success
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    state: '',
    landSize: '',
    farmType: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign in - in real app would validate credentials
    onNavigate('dashboard');
  };

  const handleGoogleSignIn = () => {
    // Mock Google sign in - in real app would integrate with Google OAuth
    console.log('Google Sign In initiated');
    // Simulate successful Google authentication
    onNavigate('dashboard');
  };

  const handleGoogleSignUp = () => {
    // Mock Google sign up - in real app would integrate with Google OAuth
    console.log('Google Sign Up initiated');
    // For new users, might want to collect additional info
    setAuthStep('role');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('verify');
  };

  const handleVerification = () => {
    setAuthStep('role');
  };

  const handleRoleSelection = () => {
    setAuthStep('language');
  };

  const handleLanguageSelection = () => {
    setAuthStep('details');
  };

  const handleDetailsSubmission = () => {
    setAuthStep('success');
  };

  const handleSuccess = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop"
          alt="Agricultural field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-green/20 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary-green rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">FarmerAI</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {/* Sign In / Sign Up */}
            {authStep === 'signin' && (
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <div className="space-y-4">
                    {/* Google Sign In Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border-white/20"
                      onClick={handleGoogleSignIn}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <Separator className="bg-white/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-transparent px-4 text-sm text-white/60">or</span>
                      </div>
                    </div>

                    {/* Traditional Sign In Form */}
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Email or Phone</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Enter email or phone number"
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={setRememberMe}
                          />
                          <Label htmlFor="remember" className="text-sm text-white">
                            Remember me
                          </Label>
                        </div>
                        <Button variant="link" className="text-harvest-yellow hover:text-harvest-yellow/80 p-0 h-auto text-sm">
                          Forgot password?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white">
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-white/80">
                        Don't have an account?{' '}
                        <Button
                          variant="link"
                          className="text-harvest-yellow hover:text-harvest-yellow/80 p-0 h-auto"
                          onClick={() => setAuthStep('signup')}
                        >
                          Sign up here
                        </Button>
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="space-y-4">
                    {/* Google Sign Up Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border-white/20"
                      onClick={handleGoogleSignUp}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign up with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <Separator className="bg-white/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-transparent px-4 text-sm text-white/60">or</span>
                      </div>
                    </div>

                    {/* Traditional Sign Up Form */}
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">First Name</Label>
                          <Input
                            placeholder="First name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Last Name</Label>
                          <Input
                            placeholder="Last name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-white/60">
                          Password must be at least 8 characters long
                        </p>
                      </div>

                      <Button type="submit" className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white">
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-white/80">
                        Already have an account?{' '}
                        <Button
                          variant="link"
                          className="text-harvest-yellow hover:text-harvest-yellow/80 p-0 h-auto"
                          onClick={() => setAuthStep('signin')}
                        >
                          Sign in here
                        </Button>
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Email/OTP Verification */}
            {authStep === 'verify' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-harvest-yellow rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Verify Your Email</h3>
                  <p className="text-white/80 text-sm">
                    We've sent a verification code to your email address. 
                    Please enter the 6-digit code below.
                  </p>
                </div>
                
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/10 border-white/20 text-white"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handleVerification}
                    className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  >
                    Verify Email
                  </Button>
                  
                  <p className="text-sm text-white/60">
                    Didn't receive the code?{' '}
                    <Button variant="link" className="text-harvest-yellow hover:text-harvest-yellow/80 p-0 h-auto text-sm">
                      Resend Code
                    </Button>
                  </p>
                </div>
              </div>
            )}

            {/* Role Selection */}
            {authStep === 'role' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Select Your Role</h3>
                  <p className="text-white/80 text-sm">
                    Choose your role to customize your FarmerAI experience
                  </p>
                </div>

                <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                      <RadioGroupItem value="farmer" id="farmer" />
                      <div className="flex items-center space-x-3">
                        <User className="w-8 h-8 text-harvest-yellow" />
                        <div>
                          <Label htmlFor="farmer" className="text-white font-medium cursor-pointer">
                            Farmer
                          </Label>
                          <p className="text-sm text-white/60">
                            Individual farmer or small-scale agricultural operations
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                      <RadioGroupItem value="admin" id="admin" />
                      <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-primary-green" />
                        <div>
                          <Label htmlFor="admin" className="text-white font-medium cursor-pointer">
                            Agricultural Expert / Admin
                          </Label>
                          <p className="text-sm text-white/60">
                            Agricultural consultant, researcher, or system administrator
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={handleRoleSelection}
                  disabled={!selectedRole}
                  className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Language Selection */}
            {authStep === 'language' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-harvest-yellow mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Choose Your Language</h3>
                  <p className="text-white/80 text-sm">
                    Select your preferred language for the best experience
                  </p>
                </div>

                <div className="space-y-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        selectedLanguage === lang.code
                          ? 'border-primary-green bg-primary-green/20'
                          : 'border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-white font-medium">{lang.name}</span>
                      </div>
                      {selectedLanguage === lang.code && (
                        <Check className="w-5 h-5 text-primary-green" />
                      )}
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleLanguageSelection}
                  className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Farm Details (Optional) */}
            {authStep === 'details' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Farm Details</h3>
                  <p className="text-white/80 text-sm">
                    Help us personalize your experience (optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">State/Region</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Land Size (Acres)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5.5"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      value={formData.landSize}
                      onChange={(e) => handleInputChange('landSize', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Primary Farm Type</Label>
                    <Select value={formData.farmType} onValueChange={(value) => handleInputChange('farmType', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select farm type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop">Crop Farming</SelectItem>
                        <SelectItem value="dairy">Dairy Farming</SelectItem>
                        <SelectItem value="poultry">Poultry Farming</SelectItem>
                        <SelectItem value="mixed">Mixed Farming</SelectItem>
                        <SelectItem value="organic">Organic Farming</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={handleDetailsSubmission}
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Skip for Now
                  </Button>
                  <Button 
                    onClick={handleDetailsSubmission}
                    className="flex-1 clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}

            {/* Success */}
            {authStep === 'success' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Welcome to FarmerAI!</h3>
                  <p className="text-white/80 text-sm">
                    Your account has been successfully created. You're ready to start your smart farming journey.
                  </p>
                </div>

                <div className="space-y-3">
                  <Badge variant="outline" className="border-harvest-yellow text-harvest-yellow">
                    Role: {selectedRole === 'farmer' ? 'Farmer' : 'Agricultural Expert'}
                  </Badge>
                  <Badge variant="outline" className="border-primary-green text-primary-green">
                    Language: {languages.find(l => l.code === selectedLanguage)?.name}
                  </Badge>
                </div>

                <Button 
                  onClick={handleSuccess}
                  className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                >
                  Start Farming Smart
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}