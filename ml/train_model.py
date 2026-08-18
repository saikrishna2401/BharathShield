"""
Multilingual Phishing SMS Model Trainer for PhishGuard
Trains a TF-IDF + Multinomial Naive Bayes Model on Multilingual Dataset (EN, TE, HI, TA)
"""
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from preprocessing import preprocess_text

# Sample Multilingual Training Corpus
TRAINING_DATA = [
    # Safe Examples
    ("Your OTP for net banking is 483921. Do not share with anyone.", 0),
    ("Your account balance is Rs 5,420. Thank you for banking with us.", 0),
    ("మీ ఖాతాలో ₹5,000 డిపాజిట్ చేయబడింది.", 0),
    ("आपका ओटीपी 849201 है। शेयर न करें।", 0),
    ("உங்கள் கணக்கில் பணம் செலுத்தப்பட்டது.", 0),
    
    # Phishing Examples
    ("Congratulations! You won Rs 25,00,000 lottery reward. Click link immediately: http://sbi-kyc.xyz", 1),
    ("Your account is blocked today. Click link to complete KYC: http://secure-login.top", 1),
    ("మీ బ్యాంక్ ఖాతా ఈరోజు బ్లాక్ అవుతుంది. వెంటనే ఈ లింక్పై క్లిక్ చేయండి: http://bank-kyc.site", 1),
    ("बधाई हो! आपने 10 लाख रुपये जीते हैं। तुरंत इस लिंक पर क्लिक करें: http://prize-claim.xyz", 1),
    ("வாழ்த்துகள்! நீங்கள் ₹10,00,000 வென்றுள்ளீர்கள். லிங்க் கிளிக் செய்யவும்: http://bank-update.top", 1)
]

def train_and_save():
    texts, labels = zip(*TRAINING_DATA)
    clean_texts = [preprocess_text(t) for t in texts]
    
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), analyzer='char_wb')
    X = vectorizer.fit_transform(clean_texts)
    
    clf = MultinomialNB()
    clf.fit(X, labels)
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(clf, f)
        
    with open('vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)
        
    print("✅ PhishGuard ML Model & Vectorizer trained and saved successfully.")

if __name__ == '__main__':
    train_and_save()
