"""
AgriSol AI Service - Disease Detection Placeholder
FastAPI-based ML inference service

In production, replace the mock with actual ML model (TensorFlow/PyTorch)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import time

app = FastAPI(
    title="AgriSol AI Service",
    description="Crop Disease Detection AI Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Disease database (in production: loaded from ML model)
DISEASE_DB = {
    "wheat": [
        {
            "disease_name": "Wheat Rust",
            "disease_name_hi": "गेहूं का रतुआ",
            "disease_name_mr": "गव्हाचा तांबेरा",
            "confidence": 89.5,
            "severity": "high",
            "affected_area": "40-60%",
            "description": "Fungal disease causing orange/brown pustules on leaves and stems.",
            "remedies": [
                "Apply Propiconazole 25% EC at 0.1% concentration",
                "Remove and destroy infected plant material",
                "Improve field drainage"
            ],
            "recommended_pesticides": [
                {
                    "name": "Propiconazole 25% EC",
                    "dosage": "1ml per liter of water",
                    "application_method": "Foliar spray",
                    "safety_period": "14 days",
                    "cost": "₹200-250 per 100ml"
                }
            ],
            "organic_remedies": ["Neem oil spray 3%", "Cow urine spray (diluted 1:10)"],
            "prevention_tips": [
                "Use rust-resistant varieties like HD-2967",
                "Timely sowing",
                "Balanced fertilization"
            ]
        }
    ],
    "rice": [
        {
            "disease_name": "Rice Blast",
            "disease_name_hi": "धान का झुलसा",
            "disease_name_mr": "भाताचा करपा",
            "confidence": 91.2,
            "severity": "high",
            "description": "Fungal disease causing diamond-shaped lesions on leaves.",
            "remedies": [
                "Spray Tricyclazole 75% WP at 0.6g per liter",
                "Avoid excess nitrogen fertilization",
                "Maintain proper water level"
            ],
            "recommended_pesticides": [
                {
                    "name": "Tricyclazole 75% WP",
                    "dosage": "0.6g per liter",
                    "application_method": "Foliar spray",
                    "safety_period": "7 days",
                    "cost": "₹180-220 per 100g"
                }
            ],
            "organic_remedies": ["Pseudomonas fluorescens spray", "Silicon supplementation"],
            "prevention_tips": ["Balanced N:P:K ratio", "Use disease-resistant varieties"]
        }
    ],
    "default": [
        {
            "disease_name": "Leaf Spot",
            "disease_name_hi": "पत्ती धब्बा रोग",
            "disease_name_mr": "पानांवर डाग",
            "confidence": 78.3,
            "severity": "medium",
            "affected_area": "20-35%",
            "description": "Fungal infection causing circular/irregular spots on leaves.",
            "remedies": [
                "Apply Mancozeb 75% WP as foliar spray",
                "Remove infected leaves",
                "Improve air circulation"
            ],
            "recommended_pesticides": [
                {
                    "name": "Mancozeb 75% WP",
                    "dosage": "2.5g per liter of water",
                    "application_method": "Foliar spray",
                    "safety_period": "7 days",
                    "cost": "₹100-150 per kg"
                }
            ],
            "organic_remedies": ["Neem oil 5ml/L", "Trichoderma viride application"],
            "prevention_tips": ["Crop rotation", "Avoid waterlogging", "Proper spacing"]
        }
    ]
}

class DetectionRequest(BaseModel):
    images: List[str]
    crop_name: str
    model_version: Optional[str] = "v1.0"
    language: Optional[str] = "en"

class HealthResponse(BaseModel):
    status: str
    model_version: str
    uptime: float

start_time = time.time()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {
        "status": "ok",
        "model_version": "v1.0-placeholder",
        "uptime": time.time() - start_time
    }

@app.post("/api/detect")
async def detect_disease(request: DetectionRequest):
    """
    Detect crop disease from uploaded image URLs.
    
    In production: 
    1. Download images from URLs
    2. Preprocess (resize, normalize)
    3. Run through CNN model (ResNet50/EfficientNet)
    4. Return predictions with confidence scores
    """
    
    if not request.images:
        raise HTTPException(status_code=400, detail="No images provided")
    
    # Simulate processing time
    time.sleep(random.uniform(1.5, 3.0))
    
    # Get disease data based on crop
    crop_lower = request.crop_name.lower()
    diseases = DISEASE_DB.get(crop_lower, DISEASE_DB["default"])
    
    # Add some randomness to confidence scores
    detections = []
    for disease in diseases:
        d = disease.copy()
        d["confidence"] = round(d["confidence"] + random.uniform(-5, 5), 1)
        d["confidence"] = max(60, min(99, d["confidence"]))
        detections.append(d)
    
    return {
        "status": "success",
        "model_version": "v1.0-placeholder",
        "crop_name": request.crop_name,
        "image_count": len(request.images),
        "processing_time_ms": random.randint(1500, 3000),
        "detections": detections,
        "note": "This is a placeholder response. Connect actual ML model for production."
    }

@app.get("/api/models")
async def list_models():
    return {
        "available_models": [
            {
                "id": "v1.0",
                "name": "AgriSol Disease Detector v1",
                "supported_crops": list(DISEASE_DB.keys()),
                "accuracy": "87.3%",
                "status": "active"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
