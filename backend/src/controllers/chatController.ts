import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

export async function handleChatMessage(req: AuthenticatedRequest, res: Response) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  // Expert agricultural responses mapping standard farmer inquiries
  const lowerMsg = message.toLowerCase();
  let reply = 'Thank you for reaching out to AgriSol Support. How can I help you improve crop yields today?';

  if (lowerMsg.includes('ph') || lowerMsg.includes('soil')) {
    reply = 'Soil pH determines nutrient availability. A standard range between 6.0 and 7.0 is ideal for most commercial crops like rice, wheat, and vegetables. Let me know if you would like me to analyze a soil report for you.';
  } else if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nitrogen') || lowerMsg.includes('npk')) {
    reply = 'Applying Nitrogen-Phosphorus-Potassium (NPK) fertilizers should align with your specific soil diagnostic type. Nitrogen promotes leafy foliage, phosphorus feeds root development, and potassium secures plant cell wall strength.';
  } else if (lowerMsg.includes('water') || lowerMsg.includes('irrigation') || lowerMsg.includes('rain')) {
    reply = 'Smart drip irrigation systems reduce evaporation losses and guarantee targeted moisture profiles directly in the root zones. Always inspect your local soil moisture index before scheduling secondary irrigations.';
  } else if (lowerMsg.includes('tomato') || lowerMsg.includes('disease') || lowerMsg.includes('blight')) {
    reply = 'Tomato Early Blight is standard in warm, humid weather. You can diagnose it by searching for dark target-like concentric rings on older bottom leaves. Applying copper-based fungicides works beautifully.';
  }

  return res.status(200).json({
    success: true,
    reply,
    timestamp: new Date().toISOString()
  });
}
