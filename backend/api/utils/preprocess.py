import cv2
import numpy as np
from PIL import Image
import io

def preprocess_image(image_path):
    # Read image using OpenCV
    image = cv2.imread(image_path)

    # Convert to Grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Denoise the image
    denoised = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)

    # Apply adaptive thresholding (binarization)
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # Save to memory (PIL Image to feed into EasyOCR if needed)
    pil_img = Image.fromarray(thresh)
    return pil_img
