# PhishGuard ML Microservice (Optional Enhancement)

This directory contains the optional Python FastAPI microservice for machine learning inference.

## Features
- TF-IDF Character N-gram Vectorization suited for Indic and English scripts.
- Multinomial Naive Bayes Classifier trained on multilingual phishing SMS data.
- FastAPI REST endpoint `/predict`.

## Setup & Running

```bash
# 1. Install dependencies
pip install fastapi uvicorn scikit-learn

# 2. Train the model
python train_model.py

# 3. Start the FastAPI server on port 8000
uvicorn app:app --port 8000 --reload
```

> **Note**: PhishGuard functions completely out of the box using its robust, explainable rule-based detection engine even if Python or ML dependencies are not installed.
