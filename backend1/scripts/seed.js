/**
 * AgriSol Database Seeder
 * Seeds demo data for development and testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const { Farm, CropSeason } = require('../src/models/Farm');
const { MarketPrice, GovernmentScheme, CommunityPost } = require('../src/models/index');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisol';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Farm.deleteMany({}),
      CropSeason.deleteMany({}),
      MarketPrice.deleteMany({}),
      GovernmentScheme.deleteMany({}),
      CommunityPost.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Create Admin ────────────────────────────
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'AgriSol Admin',
      mobile: '9000000001',
      email: 'admin@agrisol.in',
      passwordHash: adminPassword,
      role: 'admin',
      isVerified: true,
      state: 'Maharashtra',
      district: 'Pune',
      preferredLanguage: 'en',
    });
    console.log('👤 Admin created:', admin.mobile);

    // ── Create Expert ────────────────────────────
    const expertPassword = await bcrypt.hash('Expert@123', 12);
    const expert = await User.create({
      name: 'Dr. Suresh Patil',
      mobile: '9000000002',
      email: 'expert@agrisol.in',
      passwordHash: expertPassword,
      role: 'expert',
      isVerified: true,
      state: 'Maharashtra',
      district: 'Nashik',
      preferredLanguage: 'hi',
      expertProfile: {
        specialization: ['Plant Pathology', 'Soil Science', 'Integrated Pest Management'],
        qualifications: 'Ph.D. Agricultural Sciences, IARI Delhi',
        experience: 15,
        organization: 'ICAR - National Institute of Abiotic Stress Management',
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        rating: 4.8,
        totalRatings: 142,
      },
    });
    console.log('🌿 Expert created:', expert.mobile);

    // ── Create Farmers ────────────────────────────
    const farmerPassword = await bcrypt.hash('Farmer@123', 12);
    const farmers = await User.insertMany([
      {
        name: 'Ramesh Sharma',
        mobile: '9876543210',
        passwordHash: farmerPassword,
        role: 'farmer',
        isVerified: true,
        village: 'Lakhimpur',
        district: 'Nashik',
        state: 'Maharashtra',
        pincode: '422001',
        preferredLanguage: 'hi',
        landSize: { value: 5.5, unit: 'acres' },
        cropsGrown: ['Wheat', 'Onion', 'Soybean'],
        farmingType: 'conventional',
        soilType: 'black',
        irrigationType: 'drip',
      },
      {
        name: 'Sunita Devi',
        mobile: '9876543211',
        passwordHash: farmerPassword,
        role: 'farmer',
        isVerified: true,
        village: 'Sangamner',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        preferredLanguage: 'mr',
        landSize: { value: 3, unit: 'acres' },
        cropsGrown: ['Sugarcane', 'Jowar', 'Cotton'],
        farmingType: 'organic',
        soilType: 'red',
      },
      {
        name: 'Arjun Patel',
        mobile: '9876543212',
        passwordHash: farmerPassword,
        role: 'farmer',
        isVerified: true,
        village: 'Dhule',
        district: 'Dhule',
        state: 'Maharashtra',
        preferredLanguage: 'hi',
        landSize: { value: 8, unit: 'acres' },
        cropsGrown: ['Cotton', 'Soybean', 'Wheat'],
        farmingType: 'mixed',
      },
    ]);
    console.log(`👨‍🌾 ${farmers.length} farmers created`);

    const farmer1 = farmers[0];

    // ── Create Farm ───────────────────────────────
    const farm = await Farm.create({
      farmer: farmer1._id,
      name: 'Sharma North Field',
      location: { village: 'Lakhimpur', district: 'Nashik', state: 'Maharashtra' },
      totalArea: { value: 5.5, unit: 'acres' },
      soilType: 'black',
      irrigationSource: 'drip',
      soilHealth: { ph: 7.2, nitrogen: 240, phosphorus: 45, potassium: 180, organicCarbon: 0.8, lastTestDate: new Date('2024-10-15') },
    });
    console.log('🌾 Farm created');

    // ── Create Crop Season ────────────────────────
    const cropSeason = await CropSeason.create({
      farm: farm._id,
      farmer: farmer1._id,
      cropName: 'Wheat',
      cropVariety: 'HD-2967',
      season: 'rabi',
      year: 2025,
      area: { value: 3, unit: 'acres' },
      sowingDate: new Date('2024-11-15'),
      expectedHarvestDate: new Date('2025-03-20'),
      status: 'growing',
      irrigationSchedule: [
        { scheduledDate: new Date('2025-01-10'), status: 'completed', completedDate: new Date('2025-01-10'), method: 'drip', waterUsed: 1200 },
        { scheduledDate: new Date('2025-01-25'), status: 'pending', method: 'drip' },
        { scheduledDate: new Date('2025-02-10'), status: 'pending', method: 'drip' },
      ],
      fertilizerSchedule: [
        { scheduledDate: new Date('2024-11-15'), status: 'completed', fertilizerName: 'DAP', quantity: 50, unit: 'kg', cost: 1400 },
        { scheduledDate: new Date('2025-01-05'), status: 'completed', fertilizerName: 'Urea', quantity: 30, unit: 'kg', cost: 600 },
        { scheduledDate: new Date('2025-02-01'), status: 'pending', fertilizerName: 'Urea', quantity: 25, unit: 'kg', growthStage: 'grain filling' },
      ],
      expenses: [
        { category: 'seed', description: 'HD-2967 seed', amount: 2400, date: new Date('2024-11-10') },
        { category: 'fertilizer', description: 'DAP 50kg', amount: 1400, date: new Date('2024-11-15') },
        { category: 'labor', description: 'Sowing labor', amount: 800, date: new Date('2024-11-15') },
        { category: 'fertilizer', description: 'Urea 30kg', amount: 600, date: new Date('2025-01-05') },
        { category: 'irrigation', description: 'Drip irrigation electricity', amount: 350, date: new Date('2025-01-10') },
      ],
      expectedYield: { value: 15, unit: 'quintal' },
    });
    console.log('🌱 Crop season created');

    // ── Market Prices ─────────────────────────────
    const crops = [
      { name: 'Wheat', base: 2200 },
      { name: 'Rice', base: 3200 },
      { name: 'Soybean', base: 5000 },
      { name: 'Cotton', base: 7000 },
      { name: 'Onion', base: 1800 },
      { name: 'Tomato', base: 2500 },
      { name: 'Potato', base: 1200 },
      { name: 'Sugarcane', base: 350 },
      { name: 'Jowar', base: 2800 },
      { name: 'Maize', base: 1900 },
    ];

    const markets = [
      { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra' },
      { name: 'Pune APMC', district: 'Pune', state: 'Maharashtra' },
      { name: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra' },
      { name: 'Aurangabad APMC', district: 'Aurangabad', state: 'Maharashtra' },
    ];

    const marketPrices = [];
    for (let day = 0; day < 45; day++) {
      const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
      for (const crop of crops) {
        for (const market of markets.slice(0, 2)) {
          const noise = (Math.random() - 0.5) * crop.base * 0.12;
          const modal = Math.round(crop.base + noise);
          marketPrices.push({
            cropName: crop.name,
            market,
            price: { min: modal - 100, modal, max: modal + 150 },
            arrivals: { quantity: Math.round(Math.random() * 400 + 50) },
            priceDate: date,
          });
        }
      }
    }

    await MarketPrice.insertMany(marketPrices);
    console.log(`📈 ${marketPrices.length} market price records seeded`);

    // ── Government Schemes ────────────────────────
    const schemes = await GovernmentScheme.insertMany([
      {
        title: 'PM-KISAN Samman Nidhi',
        titleHi: 'प्रधानमंत्री किसान सम्मान निधि',
        titleMr: 'पंतप्रधान किसान सन्मान निधी',
        description: 'Direct income support of ₹6000 per year to farmer families in three equal installments.',
        descriptionHi: 'किसान परिवारों को प्रति वर्ष ₹6000 की सीधी आय सहायता तीन समान किस्तों में।',
        category: 'subsidy',
        targetBeneficiaries: { states: ['all'], farmerCategory: ['small', 'marginal'] },
        benefits: { amount: 6000, currency: 'INR', description: '₹2000 every 4 months' },
        eligibility: ['Land holding up to 2 hectares', 'Indian citizen', 'Valid Aadhaar card'],
        requiredDocuments: ['Aadhaar card', 'Land records', 'Bank account details'],
        applicationUrl: 'https://pmkisan.gov.in',
        helplineNumber: '155261',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        isActive: true,
        isFeatured: true,
        postedBy: admin._id,
      },
      {
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        titleHi: 'प्रधानमंत्री फसल बीमा योजना',
        description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss.',
        category: 'insurance',
        targetBeneficiaries: { states: ['all'], crops: ['all'] },
        benefits: { description: 'Up to full sum insured for crop loss due to natural calamities' },
        eligibility: ['All farmers growing notified crops', 'Loanee and non-loanee farmers'],
        requiredDocuments: ['Land records', 'Bank passbook', 'Aadhaar', 'Crop sowing certificate'],
        applicationUrl: 'https://pmfby.gov.in',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        isActive: true,
        isFeatured: true,
        postedBy: admin._id,
      },
      {
        title: 'Kisan Credit Card (KCC)',
        titleHi: 'किसान क्रेडिट कार्ड',
        description: 'Credit facility for farmers to meet their agriculture and allied activities credit requirements.',
        category: 'loan',
        targetBeneficiaries: { states: ['all'], farmerCategory: ['all'] },
        benefits: { description: 'Short-term credit up to ₹3 lakh at 4% interest rate' },
        eligibility: ['All farmers', 'Self Help Groups', 'Joint Liability Groups'],
        applicationUrl: 'https://www.india.gov.in/kisan-credit-card',
        ministry: 'Ministry of Finance',
        isActive: true,
        isFeatured: false,
        postedBy: admin._id,
      },
      {
        title: 'Maharashtra Shetkari Sanman Yojana',
        titleHi: 'महाराष्ट्र शेतकरी सन्मान योजना',
        description: 'Maharashtra state scheme providing financial assistance to small and marginal farmers.',
        category: 'subsidy',
        targetBeneficiaries: { states: ['Maharashtra'], farmerCategory: ['small', 'marginal'] },
        benefits: { amount: 12000, currency: 'INR', description: '₹12000 per year' },
        eligibility: ['Resident of Maharashtra', 'Land holding below 5 acres', 'Valid 7/12 extract'],
        requiredDocuments: ['7/12 Utara', 'Aadhaar', 'Bank details', 'Domicile certificate'],
        ministry: 'Maharashtra Government - Agriculture Dept.',
        isActive: true,
        postedBy: admin._id,
      },
    ]);
    console.log(`🏛️ ${schemes.length} government schemes seeded`);

    // ── Community Posts ───────────────────────────
    const posts = await CommunityPost.insertMany([
      {
        author: farmer1._id,
        title: 'Wheat leaves turning yellow - please help!',
        content: 'My wheat crop leaves are turning yellow from the tips. The crop is 45 days old. Sowed in November. Is this a disease or nutrient deficiency? Please guide.',
        category: 'question',
        tags: ['wheat', 'yellowing', 'help'],
        cropTags: ['Wheat'],
        location: { district: 'Nashik', state: 'Maharashtra' },
        language: 'en',
        isExpertAnswered: true,
        expertAnswer: {
          expert: expert._id,
          content: 'This looks like nitrogen deficiency, which is very common at this growth stage. Apply 25-30 kg urea per acre as top dressing immediately. Also check soil moisture. If the yellowing is starting from older leaves at the bottom, it\'s definitely nitrogen. If it\'s newer leaves, it might be sulfur deficiency - apply gypsum in that case.',
          answeredAt: new Date(),
        },
        likes: [{ user: farmers[1]._id }, { user: farmers[2]._id }],
      },
      {
        author: farmers[1]._id,
        title: 'Drip irrigation increased my yield by 40%!',
        content: 'Sharing my success story. Last season I switched from flood irrigation to drip irrigation for my sugarcane crop. The results were amazing - saved 50% water and yield increased by 40%. Anyone else has experience with drip irrigation?',
        category: 'success_story',
        tags: ['drip-irrigation', 'sugarcane', 'water-saving'],
        cropTags: ['Sugarcane'],
        location: { district: 'Ahmednagar', state: 'Maharashtra' },
        language: 'en',
        views: 234,
        likes: [{ user: farmer1._id }, { user: farmers[2]._id }],
      },
      {
        author: expert._id,
        title: 'Alert: Cotton Pink Bollworm outbreak in Vidarbha',
        content: 'Farmers in Vidarbha region should be alert. We have received reports of Pink Bollworm (Pectinophora gossypiella) outbreak in cotton fields. Recommended action: Spray Chlorpyrifos 20% EC at 2.5ml/L water. Use pheromone traps for monitoring.',
        category: 'alert',
        tags: ['cotton', 'pest-alert', 'vidarbha', 'bollworm'],
        cropTags: ['Cotton'],
        isPinned: true,
        location: { district: 'Nagpur', state: 'Maharashtra' },
        language: 'en',
        views: 891,
        likes: [{ user: farmer1._id }, { user: farmers[1]._id }, { user: farmers[2]._id }],
      },
    ]);
    console.log(`💬 ${posts.length} community posts seeded`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📋 Test Credentials:');
    console.log('   Admin   → Mobile: 9000000001 | Password: Admin@123');
    console.log('   Expert  → Mobile: 9000000002 | Password: Expert@123');
    console.log('   Farmer  → Mobile: 9876543210 | Password: Farmer@123');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seed();
