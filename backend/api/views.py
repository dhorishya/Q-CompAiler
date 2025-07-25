from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from sentence_transformers import SentenceTransformer
import hdbscan
import easyocr
import cv2
import numpy as np
import os
import re
from PyPDF2 import PdfReader
from PIL import Image
from django.core.files.storage import default_storage
from django.conf import settings

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'], gpu=False)

# Load Sentence Transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")


# -----------------------
# Image Preprocessing
# -----------------------
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Unable to read image file.")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)           # Grayscale
    blur = cv2.GaussianBlur(gray, (5, 5), 0)               # Noise removal
    thresh = cv2.adaptiveThreshold(blur, 255,
                                   cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)  # Binarization
    return thresh


# -----------------------
# OCR Endpoint
# -----------------------
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
            pdf_reader = PdfReader(file_path)
            for i, page in enumerate(pdf_reader.pages):
                extracted_text = page.extract_text()
                if extracted_text:
                    text += extracted_text + "\n"

        else:
            # Preprocess and read text from image
            processed = preprocess_image(file_path)
            results = reader.readtext(processed, detail=0)
            text = "\n".join(results)

        return Response({"text": text.strip()})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# -----------------------
# Clustering Endpoint
# -----------------------
@api_view(['POST'])
def cluster_questions(request):
    questions = request.data.get("questions", [])
    if not questions:
        return Response({"error": "No questions provided"}, status=400)

    preprocessed = [re.sub(r'[^\w\s]', '', q.lower()).strip() for q in questions]
    embeddings = model.encode(preprocessed)

    clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1,
                                metric='euclidean', cluster_selection_epsilon=0.5)
    labels = clusterer.fit_predict(embeddings)

    clustered = {}
    for i, label in enumerate(labels):
        key = f"Cluster {label}" if label != -1 else "Noise"
        clustered.setdefault(key, []).append(questions[i])

    return Response({"clusters": clustered})
