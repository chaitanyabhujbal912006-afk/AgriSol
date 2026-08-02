/**
 * AI Service Integration
 * Handles calls to the external disease detection AI model.
 * Extracted here to break the circular dependency between
 * diseaseController <-> diseaseDetectionQueue.
 */

const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Call the external AI detection service.
 * Falls back to a rich mock response in development / when the service is unreachable.
 *
 * @param {string[]} imageUrls
 * @param {string} cropName
 * @returns {Promise<object>}
 */
const callAIService = async (imageUrls, cropName) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/detect`,
      {
        images: imageUrls,
        crop_name: cropName,
        model_version: process.env.AI_MODEL_VERSION || 'v1.0',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_SERVICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );
    return response.data;
  } catch (error) {
    logger.warn('AI service unreachable — using mock response:', error.message);

    if (process.env.NODE_ENV !== 'production') {
      return getMockAIResponse(cropName);
    }
    throw error;
  }
};

/**
 * Rich mock response for development / demo mode
 */
const getMockAIResponse = (cropName) => ({
  status: 'success',
  model_version: 'v1.0-mock',
  detections: [
    {
      disease_name: 'Leaf Blight',
      disease_name_hi: 'पत्ती का अंगमारी',
      disease_name_mr: 'पानांचा करपा',
      confidence: 87.3,
      severity: 'medium',
      affected_area: '30-40%',
      description: `A fungal disease affecting ${cropName} crops, causing browning and wilting of leaves.`,
      remedies: [
        'Remove and destroy affected plant parts',
        'Improve air circulation between plants',
        'Avoid overhead irrigation',
        'Apply copper-based fungicide',
      ],
      recommended_pesticides: [
        {
          name: 'Mancozeb 75% WP',
          dosage: '2.5g per liter of water',
          application_method: 'Foliar spray',
          safety_period: '7 days before harvest',
          cost: '₹150-200 per kg',
        },
        {
          name: 'Copper Oxychloride 50% WP',
          dosage: '3g per liter of water',
          application_method: 'Foliar spray',
          safety_period: '10 days before harvest',
          cost: '₹100-150 per kg',
        },
      ],
      organic_remedies: [
        'Neem oil spray (5ml per liter)',
        'Trichoderma-based biocontrol',
        'Garlic-chili extract spray',
      ],
      prevention_tips: [
        'Use disease-resistant varieties',
        'Maintain proper plant spacing',
        'Crop rotation every 2-3 seasons',
        'Regular field scouting',
      ],
    },
  ],
});

module.exports = { callAIService };
