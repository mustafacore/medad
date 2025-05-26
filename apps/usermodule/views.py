import os
import re
import uuid
import base64
import requests
import traceback
import logging

from django.shortcuts import render
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

# Utility to render Arabic text on an image
def create_image_with_text(text, font_path, image_size=(224, 224), initial_font_size=27, min_font_size=10):
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
        raise ValueError(f"Text '{bidi_text}' is too large to fit")
    text_x = (image_size[0] - text_width) // 2
    text_y = (image_size[1] - text_height) // 2
    draw.text((text_x, text_y), bidi_text, font=font, fill=(0, 0, 0))
    return img

logger = logging.getLogger(__name__)

def index(request):
    return render(request, "usermodule/index.html")


def generate_text(request):
    if request.method == "POST":
        user_text = request.POST.get("user_input", "").strip()
        arabic_regex = re.compile(r'^[\u0600-\u06FF\s]+$')

        # Validate Arabic-only input
        if not arabic_regex.match(user_text):
            return render(request, "usermodule/result.html", {
                "processed_image_base64": None,
                "output_text": "❌ يُسمح فقط بإدخال النصوص العربية بدون أرقام أو رموز!"
            })

        # Limit words
        if len(user_text.split()) > 10:
            return render(request, "usermodule/result.html", {
                "processed_image_base64": None,
                "output_text": "⚠️ يُسمح بإدخال 10 كلمات كحد أقصى!"
            })

        font_path = os.path.join(settings.BASE_DIR, "apps", "static", "fonts", "arfonts-arial-bold.ttf")
        try:
            # 1) Generate & save image
            img = create_image_with_text(user_text, font_path)
            unique_id = str(uuid.uuid4())
            filename = f"{unique_id}.png"
            folder = os.path.join(settings.MEDIA_ROOT, "generated_images")
            os.makedirs(folder, exist_ok=True)
            file_path = os.path.join(folder, filename)
            img.save(file_path, format="PNG")

            # 2) Build URL for display
            rel_url = settings.MEDIA_URL + "generated_images/" + filename
            image_url = request.build_absolute_uri(rel_url)

            # 3) POST raw bytes to FastAPI
            with open(file_path, "rb") as f:
                files = {"file": (filename, f, "image/png")}
                resp = requests.post(
                    settings.FASTAPI_URL + "/generate-file",
                    files=files,
                    timeout=120
                )

            # 4) Handle FastAPI response
            if resp.status_code == 200:
                proc_bytes = resp.content
                proc_b64 = base64.b64encode(proc_bytes).decode('utf-8')
                msg = ""
            else:
                logger.error(f"FastAPI error {resp.status_code}: {resp.text}")
                proc_b64 = None
                msg = "❌ خطأ في معالجة الصورة."

            return render(request, "usermodule/result.html", {
                "image_url": image_url,
                "processed_image_base64": proc_b64,
                "output_text": msg,
            })

        except Exception as e:
            tb = traceback.format_exc()
            logger.error("generate_text Exception:\n%s", tb)
            return render(request, "usermodule/result.html", {
                "processed_image_base64": None,
                "output_text": f"❌ حدث خطأ غير متوقع:\n{e}"
            })

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