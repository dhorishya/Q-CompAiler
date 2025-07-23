from rest_framework.decorators import api_view
from rest_framework.response import Response
from sentence_transformers import SentenceTransformer
import hdbscan
from sklearn.metrics import pairwise_distances
import re

# Load model once when the server starts
model = SentenceTransformer("all-MiniLM-L6-v2")

@api_view(['POST'])
def cluster_questions(request):
    try:
        questions = request.data.get("questions", [])
        if not questions:
            return Response({"error": "No questions provided"}, status=400)

        # --- Preprocessing ---
        preprocessed = [re.sub(r'[^\w\s]', '', q.lower()).strip() for q in questions]

        # --- Embedding ---
        embeddings = model.encode(preprocessed)

        # --- Clustering ---
        clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1, metric='euclidean', cluster_selection_epsilon=0.5)
        labels = clusterer.fit_predict(embeddings)

        # --- Formatting Output ---
        clustered = {}
        for i, label in enumerate(labels):
            key = f"Cluster {label}" if label != -1 else "Noise"
            clustered.setdefault(key, []).append(questions[i])

        return Response({"clusters": clustered})
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)
