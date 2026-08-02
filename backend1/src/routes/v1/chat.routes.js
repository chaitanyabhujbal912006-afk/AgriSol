/**
 * Chat Routes
 * Real-time messaging between users + AI adviser chatbot
 */

const express = require('express');
const router = express.Router();
const { ChatMessage } = require('../../models/index');
const { protect } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');

// ── AI Adviser Chatbot ──────────────────────────────────────────────────────
const AGRI_CONTEXT = `You are AgriBot, an expert agricultural adviser for Indian farmers.
You help with: soil health, crop diseases, irrigation, fertilizers, pest control,
government schemes, market prices, and weather-based farming decisions.
Always give practical, actionable advice in simple language.
When possible, mention local Indian crop names and use metric units.
If the user speaks Hindi or Marathi, respond in that language.`;

const AI_PROMPTS = {
  soil: 'What are the best practices for improving soil fertility and health?',
  disease: 'How do I identify and treat common crop diseases?',
  irrigation: 'What is the optimal irrigation schedule for my crops?',
  fertilizer: 'What fertilizers should I use and when?',
  weather: 'How should I adjust farming practices based on the current weather?',
  market: 'What are the current market prices and where should I sell my crops?',
  scheme: 'What government schemes and subsidies am I eligible for?',
  pest: 'How do I identify and control pests affecting my crops?',
};

// Intelligent mock responses for development
const getMockResponse = (message) => {
  const lower = message.toLowerCase();

  if (lower.includes('soil') || lower.includes('mitti') || lower.includes('माती')) {
    return `🌱 **Soil Health Tips:**\n\n• Test your soil every 2-3 years for NPK and pH levels\n• Add organic compost (vermicompost or FYM) to improve soil structure\n• Maintain pH between 6.0-7.5 for most crops\n• Practice crop rotation to prevent nutrient depletion\n• Use green manure crops like dhaincha before main crops\n\n💡 Tip: Alluvial soils in river plains are most fertile. Black cotton soil (regur) holds moisture well for cotton and sorghum.`;
  }

  if (lower.includes('disease') || lower.includes('rog') || lower.includes('रोग')) {
    return `🔬 **Common Crop Disease Management:**\n\n• **Leaf Blight**: Apply Mancozeb 75% WP @ 2.5g/L water\n• **Powdery Mildew**: Use Sulphur 80% WP @ 3g/L or neem oil spray\n• **Rust**: Apply Propiconazole 25% EC @ 1ml/L water\n• **Early Blight (Tomato)**: Copper oxychloride + Carbendazim mixture\n\n🌿 **Organic Options:**\n• Neem oil (5ml/L) for most fungal issues\n• Trichoderma viride for soil-borne diseases\n• Garlic extract spray as preventive measure\n\n⚠️ Always observe 7-14 day safety period before harvest after pesticide application.`;
  }

  if (lower.includes('irrigation') || lower.includes('paani') || lower.includes('पाणी') || lower.includes('पानी')) {
    return `💧 **Smart Irrigation Guidelines:**\n\n• **Rice**: Maintain 2-5cm standing water; drain before harvest\n• **Wheat**: 4-6 irrigations at critical stages (tillering, flowering)\n• **Cotton**: Irrigate every 15-20 days; avoid water stress at flowering\n• **Sugarcane**: Drip irrigation saves 40-50% water\n\n🌡️ **Evapotranspiration Tips:**\n• Water early morning to reduce evaporation losses\n• Mulching reduces water requirement by 30%\n• Drip/sprinkler irrigation increases efficiency by 60-70%`;
  }

  if (lower.includes('fertilizer') || lower.includes('khad') || lower.includes('खाद')) {
    return `🌾 **Fertilizer Recommendations:**\n\n**Basal (Before Sowing):**\n• Phosphorus (SSP or DAP) - Full dose at sowing\n• Potash (MOP) - Full dose at sowing\n• 50% Nitrogen at sowing\n\n**Top Dressing:**\n• Remaining 50% Nitrogen in 2 splits\n• Micronutrients: Zinc sulphate 25kg/acre if deficient\n\n💡 **Organic Options:**\n• Vermicompost: 2-3 tonnes/acre\n• FYM (Farm Yard Manure): 5 tonnes/acre\n• Neem cake: 200kg/acre (controls pests too)\n\n📋 Always soil test before applying fertilizers to avoid wastage.`;
  }

  if (lower.includes('weather') || lower.includes('mausam') || lower.includes('मौसम')) {
    return `🌤️ **Weather-Based Farming Advice:**\n\n• **Pre-monsoon**: Prepare land, apply FYM, check drainage\n• **Kharif Season**: Sow rain-dependent crops (rice, soybean, cotton)\n• **Rabi Season**: Irrigated crops (wheat, mustard, gram)\n• **Zaid Season**: Short duration crops in summer\n\n⚠️ **Extreme Weather Protection:**\n• **Frost**: Cover nurseries, apply smoke, irrigate before frost night\n• **Heat waves**: Increase irrigation frequency, apply mulch\n• **Heavy rain**: Ensure field drainage, avoid spraying pesticides`;
  }

  if (lower.includes('market') || lower.includes('price') || lower.includes('mandi') || lower.includes('भाव')) {
    return `📈 **Market Price Guidance:**\n\n• Check daily APMC mandi rates at agmarknet.gov.in\n• eNAM (National Agriculture Market) connects you to 1000+ mandis\n• MSP (Minimum Support Price) ensures base price from government\n\n**Current Approximate MSP (2024-25):**\n• Paddy (Common): ₹2,300/quintal\n• Wheat: ₹2,275/quintal\n• Cotton (Medium): ₹7,121/quintal\n• Soybean: ₹4,892/quintal\n\n💡 Tip: Store produce in proper storage if mandi prices are low; sell when prices rise.`;
  }

  if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('subsidy') || lower.includes('योजना')) {
    return `🏛️ **Key Government Schemes for Farmers:**\n\n1. **PM-KISAN**: ₹6,000/year direct income support\n2. **PM Fasal Bima Yojana**: Crop insurance at subsidized premium\n3. **Kisan Credit Card**: Low-interest credit up to ₹3 lakhs\n4. **PM Krishi Sinchayee Yojana**: Subsidized drip/sprinkler irrigation\n5. **e-NAM**: Online mandi platform for better price discovery\n6. **Soil Health Card**: Free soil testing and recommendations\n\n📋 Visit your nearest Common Service Centre (CSC) or Block Agriculture Office to apply.`;
  }

  // Default helpful response
  return `🌾 **AgriBot - Your Agricultural Adviser**\n\nI can help you with:\n• 🌱 Soil health & fertility\n• 🔬 Crop disease identification & treatment\n• 💧 Irrigation scheduling\n• 🌾 Fertilizer recommendations\n• 🌤️ Weather-based farming advice\n• 📈 Market prices & selling strategies\n• 🏛️ Government schemes & subsidies\n• 🐛 Pest management\n\nPlease ask me a specific question about your farm or crops, and I'll provide detailed guidance!\n\n**Example questions:**\n• "My tomato leaves are turning yellow, what's wrong?"\n• "When should I apply urea to my wheat crop?"\n• "What is the current MSP for soybean?"`;
};

/**
 * POST /api/v1/chat/message
 * AI agricultural adviser chatbot
 */
router.post('/message', protect, catchAsync(async (req, res) => {
  const { message, category } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  // In production this would call an LLM API (Gemini, GPT, etc.)
  // For now use intelligent mock responses
  const response = getMockResponse(message);

  logger.info(`AI chat: user ${req.user._id} - "${message.substring(0, 50)}..."`);

  res.json({
    success: true,
    data: {
      message: response,
      category: category || 'general',
      timestamp: new Date().toISOString(),
      model: 'agribot-v1',
    },
  });
}));

// ── Get conversation history (farmer-to-farmer) ─────────────────────────────
router.get('/conversation/:userId', protect, catchAsync(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const myId = req.user._id.toString();
  const otherId = req.params.userId;
  const conversationId = [myId, otherId].sort().join('_');

  const messages = await ChatMessage.find({ conversationId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .populate('sender', 'name profileImage role');

  res.json({ success: true, data: messages.reverse() });
}));

// ── Get all my conversations ────────────────────────────────────────────────
router.get('/conversations', protect, catchAsync(async (req, res) => {
  const conversations = await ChatMessage.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        isDeleted: false,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        messageCount: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$isRead', false] }, { $eq: ['$receiver', req.user._id] }] }, 1, 0],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
    { $limit: 30 },
  ]);

  res.json({ success: true, data: conversations });
}));

module.exports = router;
