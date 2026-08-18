"""
FastAPI Microservice for PhishGuard ML Inference Engine
"""
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os
from preprocessing import preprocess_text

app = FastAPI(title="PhishGuard ML Service", version="2.0.0")

model = None
vectorizer = None

if os.path.exists('model.pkl') and os.path.exists('vectorizer.pkl'):
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)

class PredictRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PhishGuard ML Microservice",
        "modelLoaded": model is not None
    }

@app.post("/predict")
def predict(payload: PredictRequest):
    if not model or not vectorizer:
        return {"status": "unavailable", "probability": 0.5, "message": "ML Model not loaded."}
    
    clean_text = preprocess_text(payload.message)
    features = vectorizer.transform([clean_text])
    proba = model.predict_proba(features)[0][1]
    
    return {
        "status": "ok",
        "probability": float(proba),
        "prediction": "PHISHING" if proba >= 0.5 else "SAFE"
    }
