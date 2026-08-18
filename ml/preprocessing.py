"""
Text Preprocessing Utility for PhishGuard Multilingual ML Classifier
"""
import re
import unicodedata

def preprocess_text(text: str) -> str:
    if not text:
        return ""
    
    # Unicode Normalization (NFKC)
    text = unicodedata.normalize('NFKC', text)
    
    # Remove zero-width characters
    text = re.sub(r'[\u200B-\u200D\uFEFF]', '', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text.lower()
