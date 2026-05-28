import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export async function analyzeSoil(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const file = req.file;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Generate a mock response matching the frontend expectations
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

  try {
    const imageUrl = file ? `/uploads/${file.filename}` : 'demo-sample.jpg';

    // Store in Database
    const savedRecord = await prisma.soilAnalysis.create({
      data: {
        userId,
        imageUrl,
        classifiedType: classifiedTypes[0].type,
        confidence: classifiedTypes[0].confidence,
        pH: analysis.pH,
        nitrogen: analysis.nitrogen,
        phosphorus: analysis.phosphorus,
        potassium: analysis.potassium
      }
    });

    return res.status(200).json({
      success: true,
      soilTypes: classifiedTypes,
      analysis,
      savedRecord
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSoilHistory(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const history = await prisma.soilAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, history });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
