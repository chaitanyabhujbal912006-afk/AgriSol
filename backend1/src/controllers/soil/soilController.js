/**
 * Soil Prediction Controller
 * Handles soil analysis and history
 */

const { SoilAnalysis } = require('../../models/index');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');

exports.analyzeSoil = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const file = req.file;

  // Mock analysis logic matching old soilController
  const classifiedTypes = [
    {
      type: 'Alluvial Soil',
      confidence: 89,
      description: 'Rich in nutrients, ideal for crop cultivation',
      characteristics: ['High fertility', 'Good water retention', 'Rich in potash'],
      suitableCrops: ['Rice', 'Wheat', 'Sugarcane', 'Cotton']
    },
    {
      type: 'Red Soil',
      confidence: 65,
      description: 'Iron-rich soil, good drainage properties',
      characteristics: ['Iron oxide content', 'Good drainage', 'Moderate fertility'],
      suitableCrops: ['Groundnut', 'Cotton', 'Wheat', 'Pulses']
    }
  ];

  const analysis = {
    pH: 6.8,
    nitrogen: 'Medium',
    phosphorus: 'High',
    potassium: 'Medium',
    organicMatter: 'High',
    salinity: 'Low'
  };

  const imageUrl = file ? `/uploads/${file.filename}` : 'demo-sample.jpg';

  const savedRecord = await SoilAnalysis.create({
    farmer: userId,
    imageUrl,
    classifiedType: classifiedTypes[0].type,
    confidence: classifiedTypes[0].confidence,
    pH: analysis.pH,
    nitrogen: analysis.nitrogen,
    phosphorus: analysis.phosphorus,
    potassium: analysis.potassium
  });

  res.status(200).json({
    success: true,
    soilTypes: classifiedTypes,
    analysis,
    savedRecord
  });
});

exports.getSoilHistory = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const history = await SoilAnalysis.find({ farmer: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    history
  });
});
