import os
import re
import io
import base64
from django.shortcuts import render
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

def create_image_with_text(text, font_path, image_size=(256, 256), initial_font_size=70, min_font_size=10):
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

# View to handle text and image generation
def generate_text(request):
    if request.method == "POST":
        user_text = request.POST.get("user_input", "").strip()
        arabic_regex = re.compile(r'^[\u0600-\u06FF\s]+$')

        # Validate that the text is Arabic
        if not arabic_regex.match(user_text):
            return render(request, "usermodule/result.html", {"output_text": "❌ يُسمح فقط بإدخال النصوص العربية بدون أرقام أو رموز!"})

        # Limit input to 10 words
        words = user_text.split()
        if len(words) > 10:
            return render(request, "usermodule/result.html", {"output_text": "⚠️ يُسمح بإدخال 10 كلمات كحد أقصى!"})

        # Path to the Arabic font file (Make sure the path is correct)
        font_path = os.path.join("apps", "static", "fonts", "arfonts-arial-bold.ttf")
        
        try:
            # Generate the image
            image = create_image_with_text(user_text, font_path)

            # Convert the image to a base64-encoded string
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            buffer.seek(0)
            img_data = buffer.read()
            img_base64 = base64.b64encode(img_data).decode('utf-8')  # Convert to Base64 string

            # Return the result page with the Base64 image data
            return render(request, "usermodule/result.html", {"image_data": img_base64})

        except Exception as e:
            return render(request, "usermodule/result.html", {"output_text": f"❌ خطأ: {str(e)}"})

    return render(request, "usermodule/index.html")  
