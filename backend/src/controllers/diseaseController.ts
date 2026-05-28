import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

export async function diagnoseDisease(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const file = req.file;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Plant health mock classification matching the disease library expectations
  const mockDiagnosis = {
    diagnosedDisease: 'Tomato Early Blight',
    confidence: 94.8,
    cause: 'Alternaria solani fungus',
    symptoms: [
      'Dark brown spots on older leaves first',
      'Concentric target-like rings inside spot zones',
      'Stem spots causing dry rot'
    ],
    treatments: {
      organic: 'Apply copper-based organic copper spray treatments and remove lower infected foliage immediately.',
      chemical: 'Spray with chlorothalonil, mancozeb or azoxystrobin fungicides under dry weather conditions.'
    }
  };

  return res.status(200).json({
    success: true,
    diagnosis: mockDiagnosis,
    imageUrl: file ? `/uploads/${file.filename}` : 'demo-leaf.jpg'
  });
}
