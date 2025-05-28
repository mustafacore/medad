import os
import re
import uuid
import threading
import requests
import logging
from urllib.parse import quote_plus
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

# Configure logging
logger = logging.getLogger(__name__)

BASE_DIR = settings.BASE_DIR


def create_image_with_text(text, font_path, image_size=(224, 224), initial_font_size=27, min_font_size=10):
    """Generate an image with Arabic text, adjusting font size to fit."""
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)

    img = Image.new('RGB', image_size, color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    font_size = initial_font_size
    while font_size >= min_font_size:
        font = ImageFont.truetype(font_path, font_size)
        bbox = draw.textbbox((0, 0), bidi_text, font=font)
        width, height = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if width <= image_size[0] and height <= image_size[1]:
            break
        font_size -= 1

    if font_size < min_font_size:
        raise ValueError(f"Text too large to fit in image (min font size {min_font_size}).")

    x = (image_size[0] - width) // 2
    y = (image_size[1] - height) // 2
    draw.text((x, y), bidi_text, font=font, fill=(0, 0, 0))
    return img


def index(request):
    """Render the main input page."""
    return render(request, "usermodule/index.html")


def call_fastapi_and_save(image_url, unique_id):
    """Background task: fetch processed image from FastAPI and save to MEDIA_ROOT."""
    try:
        resp = requests.get(
            settings.FASTAPI_URL,
            params={"url": image_url},
            timeout=(5, 60)
        )
        if resp.status_code == 200:
            folder = os.path.join(settings.MEDIA_ROOT, "generated_images")
            processed_filename = f"proc-{unique_id}.png"
            processed_path = os.path.join(folder, processed_filename)
            with open(processed_path, "wb") as f:
                f.write(resp.content)
        else:
            logger.error(f"FastAPI returned status {resp.status_code} for job {unique_id}")
    except Exception:
        logger.exception(f"Error in background FastAPI call for job {unique_id}")


def generate_text(request):
    """
    Handle POST: generate base image, kick off background processing,
    and immediately render a 'processing' page with job ID.
    """
    if request.method == "POST":
        user_text = request.POST.get("user_input", "").strip()
        arabic_regex = re.compile(r'^[\u0600-\u06FF\s]+$')

        if not arabic_regex.match(user_text):
            return render(request, "usermodule/result.html", {
                "output_text": "❌ يُسمح فقط بإدخال النصوص العربية بدون أرقام أو رموز!"
            })

        words = user_text.split()
        if len(words) > 10:
            return render(request, "usermodule/result.html", {
                "output_text": "⚠️ يُسمح بإدخال 10 كلمات كحد أقصى!"
            })

        font_path = os.path.join(BASE_DIR, "apps", "static", "fonts", "arfonts-arial-bold.ttf")
        try:
            # Generate and save the base image
            image = create_image_with_text(user_text, font_path)
            unique_id = str(uuid.uuid4())
            filename = f"{unique_id}.png"

            folder = os.path.join(settings.MEDIA_ROOT, "generated_images")
            os.makedirs(folder, exist_ok=True)

            orig_path = os.path.join(folder, filename)
            image.save(orig_path, format="PNG")

            # Build public URL for the original image
            relative_url = settings.MEDIA_URL + "generated_images/" + filename
            image_url = request.build_absolute_uri(relative_url)

            # Start background thread to call FastAPI
            thread = threading.Thread(
                target=call_fastapi_and_save,
                args=(image_url, unique_id),
                daemon=True
            )
            thread.start()

            # Immediately render the processing page
            return render(request, "usermodule/result.html", {
                "job_id": unique_id,
                "original_url": image_url,
                # processed_url will be filled in by client-side polling
            })

        except Exception as e:
            logger.exception("Error in generate_text view")
            return render(request, "usermodule/result.html", {
                "output_text": f"❌ خطأ: {e}"
            })

    return render(request, "usermodule/index.html")


def check_status(request, job_id):
    """AJAX endpoint: returns JSON indicating if the processed image is ready."""
    folder = os.path.join(settings.MEDIA_ROOT, "generated_images")
    processed_filename = f"proc-{job_id}.png"
    processed_path = os.path.join(folder, processed_filename)

    if os.path.exists(processed_path):
        url = request.build_absolute_uri(
            settings.MEDIA_URL + "generated_images/" + processed_filename
        )
        return JsonResponse({"done": True, "url": url})

    return JsonResponse({"done": False})


def about(request):
    """Render the about page."""
    return render(request, "usermodule/about.html")


def contact(request):
    """Render the contact page."""
    return render(request, "usermodule/contact.html")


def handler404(request, exception):
    """Custom 404 error handler."""
    return render(request, 'usermodule/404.html', status=404)