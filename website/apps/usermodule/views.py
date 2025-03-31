import os
import re
import uuid
import io
import base64
import requests
from urllib.parse import quote_plus
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
import json
import logging
from django.http import JsonResponse
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

BASE_DIR = settings.BASE_DIR

def create_image_with_text(text, font_path, image_size=(224, 224), initial_font_size=27, min_font_size=10):
    """Generate an image with Arabic text using the specified font, dynamically adjusting font size to fit."""
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)

    img = Image.new('RGB', image_size, color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    font_size = initial_font_size
    while font_size >= min_font_size:
        font = ImageFont.truetype(font_path, font_size)
        text_bbox = draw.textbbox((0, 0), bidi_text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]

        if text_width <= image_size[0] and text_height <= image_size[1]:
            break
        font_size -= 1

    if font_size < min_font_size:
        raise ValueError(f"Text '{bidi_text}' is too large to fit in the image even with the smallest font size ({min_font_size}).")

    text_x = (image_size[0] - text_width) // 2
    text_y = (image_size[1] - text_height) // 2

    draw.text((text_x, text_y), bidi_text, font=font, fill=(0, 0, 0))
    return img

def index(request):
    return render(request, "usermodule/index.html")

def generate_text(request):
    """
    Processes the POST request with Arabic text, generates an image, saves it with a GUID filename,
    sends the image URL to FastAPI for processing, and returns a result page.
    """
    if request.method == "POST":
        user_text = request.POST.get("user_input", "").strip()
        arabic_regex = re.compile(r'^[\u0600-\u06FF\s]+$')

        # Validate that the text is Arabic
        if not arabic_regex.match(user_text):
            return render(request, "usermodule/result.html", {
                "output_text": "❌ يُسمح فقط بإدخال النصوص العربية بدون أرقام أو رموز!"
            })

        # Limit input to 10 words
        words = user_text.split()
        if len(words) > 10:
            return render(request, "usermodule/result.html", {
                "output_text": "⚠️ يُسمح بإدخال 10 كلمات كحد أقصى!"
            })

        # Path to the Arabic font file (ensure the path is correct)
        font_path = os.path.join(BASE_DIR, "apps", "static", "fonts", "arfonts-arial-bold.ttf")
        
        try:
            # Generate the image
            image = create_image_with_text(user_text, font_path)
            
            # Generate a unique GUID for the image
            unique_id = str(uuid.uuid4())
            filename = f"{unique_id}.png"
            
            # Define the folder to store generated images under MEDIA_ROOT
            image_folder = os.path.join(settings.MEDIA_ROOT, "generated_images")
            if not os.path.exists(image_folder):
                os.makedirs(image_folder)
            
            # Save the image file
            file_path = os.path.join(image_folder, filename)
            image.save(file_path, format="PNG")
            
            # Build the absolute URL for the image
            relative_url = settings.MEDIA_URL + "generated_images/" + filename
            image_url = request.build_absolute_uri(relative_url)
            
            # Call the FastAPI endpoint with the image URL as a parameter
            fastapi_url = "http://127.0.0.1:8001/generate"
            params = {"url": image_url}
            fastapi_response = requests.get(fastapi_url, params=params)
            
            if fastapi_response.status_code == 200:
                # Convert FastAPI returned binary image to Base64 string
                processed_image_data = fastapi_response.content
                processed_image_base64 = base64.b64encode(processed_image_data).decode('utf-8')
            else:
                processed_image_base64 = None

            # Render the result page with both the generated image URL and the processed image
            context = {
                "image_url": image_url,  # Original generated image
                "processed_image_base64": processed_image_base64,  # Processed image from FastAPI
            }
            
            return render(request, "usermodule/result.html", context)
        except Exception as e:
            return render(request, "usermodule/result.html", {"output_text": f"❌ خطأ: {str(e)}"})

    return render(request, "usermodule/index.html")

def about(request):
    """Render the about page."""
    return render(request, "usermodule/about.html")

def contact(request):
    """Render the contact page."""
    return render(request, "usermodule/contact.html")

def handler404(request, exception):
    """Custom 404 error handler"""
    return render(request, 'usermodule/404.html', status=404)


logger = logging.getLogger(__name__)

def send_contact_email(request):
    if request.method == 'POST':
        # Simply return a success message without actually sending an email.
        return JsonResponse({'status': 'success', 'message': 'تم استقبال رسالتك (وظيفة الإرسال معلقة حتى يتم تفعيلها لاحقاً)'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)