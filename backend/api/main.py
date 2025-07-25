from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import hdbscan
import re
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app
app = FastAPI()

# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Pydantic model for request body
class QuestionText(BaseModel):
    text: str

@app.post("/cluster_questions")
async def cluster_questions(data: QuestionText):
    try:
        raw_text = data.text
        if not raw_text:
            return {"error": "No input text provided"}

        # --- Step 1: Split by newlines only ---
        questions = [q.strip() for q in raw_text.splitlines() if q.strip()]
        
        if not questions:
            return {"error": "No valid questions extracted from text"}

        # --- Step 2: Preprocess ---
        preprocessed = [re.sub(r'[^\w\s]', '', q.lower()).strip() for q in questions]

        # --- Step 3: Embed ---
        embeddings = model.encode(preprocessed)

        # --- Step 4: Cluster ---
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=2, 
            min_samples=1, 
            metric='euclidean', 
            cluster_selection_epsilon=0.5
        )
        labels = clusterer.fit_predict(embeddings)

        # --- Step 5: Format Output ---
        clustered = {}
        for i, label in enumerate(labels):
            key = f"Cluster {label}" if label != -1 else "Noise"
            clustered.setdefault(key, []).append(questions[i])

        return {"clusters": clustered}

    except Exception as e:
        return {"error": str(e)}