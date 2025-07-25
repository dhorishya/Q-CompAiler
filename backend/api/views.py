from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from sentence_transformers import SentenceTransformer
import hdbscan
from sklearn.metrics import pairwise_distances
import pytesseract
import re
import os
from PIL import Image
from PyPDF2 import PdfReader
from django.core.files.storage import default_storage
from django.conf import settings

# Path to tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def ocr_scan(request):
    file = request.FILES.get("file")
    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    filename = default_storage.save(file.name, file)
    file_path = os.path.join(settings.MEDIA_ROOT, filename)

    try:
        text = ""
        if file.name.lower().endswith(".pdf"):
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
        else:
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)

        return Response({"text": text.strip()})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@api_view(['POST'])
def cluster_questions(request):
    questions = request.data.get("questions", [])
    if not questions:
        return Response({"error": "No questions provided"}, status=400)

    preprocessed = [re.sub(r'[^\w\s]', '', q.lower()).strip() for q in questions]
    embeddings = model.encode(preprocessed)

    clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1, metric='euclidean', cluster_selection_epsilon=0.5)
    labels = clusterer.fit_predict(embeddings)

    clustered = {}
    for i, label in enumerate(labels):
        key = f"Cluster {label}" if label != -1 else "Noise"
        clustered.setdefault(key, []).append(questions[i])

    return Response({"clusters": clustered})
