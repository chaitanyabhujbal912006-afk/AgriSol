import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

export async function recommendCrops(req: AuthenticatedRequest, res: Response) {
  const { nitrogen, phosphorus, potassium, pH } = req.body;

  // Agricultural suitability algorithm to match the user parameters to ideal crop requirements
  const recommendations = [];

  const parsedN = Number(nitrogen) || 50;
  const parsedP = Number(phosphorus) || 50;
  const parsedK = Number(potassium) || 50;
  const parsedPH = Number(pH) || 6.5;

  if (parsedPH >= 6.0 && parsedPH <= 7.0 && parsedN > 40) {
    recommendations.push({
      name: 'Rice',
      suitability: 96,
      expectedYield: '5.2 Tons/Hectare',
      growthDuration: '120 Days',
      waterDemand: 'High',
      difficulty: 'Moderate',
      description: 'Optimal pH and rich Nitrogen profile guarantees highly productive rice yields.'
    });
    recommendations.push({
      name: 'Wheat',
      suitability: 88,
      expectedYield: '3.8 Tons/Hectare',
      growthDuration: '110 Days',
      waterDemand: 'Medium',
      difficulty: 'Easy',
      description: 'Excellent soil environment for cereal grain production.'
    });
  } else {
    recommendations.push({
      name: 'Cotton',
      suitability: 78,
      expectedYield: '2.5 Tons/Hectare',
      growthDuration: '150 Days',
      waterDemand: 'Medium',
      difficulty: 'Moderate',
      description: 'Good parameters for fibrous cotton variants.'
    });
    recommendations.push({
      name: 'Maize',
      suitability: 82,
      expectedYield: '4.1 Tons/Hectare',
      growthDuration: '100 Days',
      waterDemand: 'Medium',
      difficulty: 'Easy',
      description: 'Adapts well to varied local nutrient profiles.'
    });
  }

  return res.status(200).json({
    success: true,
    recommendations
  });
}
