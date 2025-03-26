import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

def upscale_with_denoise_base64(processed_image_base64, scale_factor=8, method='bicubic', 
                                denoise_strength=10, sharpen=True):
    """
    Upscale a black and white image while removing noise, using base64 input.

    Parameters:
    processed_image_base64 (str): Base64 encoded input image.
    scale_factor (int): How much to increase the resolution.
    method (str): Interpolation method ('nearest', 'bilinear', 'bicubic', or 'lanczos').
    denoise_strength (int): Strength of noise reduction (5-30 recommended).
    sharpen (bool): Whether to apply sharpening after denoising.

    Returns:
    str: Base64 encoded upscaled image.
    """
    # Choose interpolation method
    interpolation_methods = {
        'nearest': cv2.INTER_NEAREST,
        'bilinear': cv2.INTER_LINEAR,
        'bicubic': cv2.INTER_CUBIC,
        'lanczos': cv2.INTER_LANCZOS4
    }
    
    # Decode base64 image
    image_data = base64.b64decode(processed_image_base64)
    np_arr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        raise ValueError("Could not decode base64 image")

    # Get original dimensions
    height, width = img.shape
    print(f"Original dimensions: {width}x{height}")

    # Apply noise reduction
    print("Applying noise reduction...")
    denoised = cv2.fastNlMeansDenoising(img, None, denoise_strength, 7, 21)

    # Resize image with chosen interpolation method
    new_width = int(width * scale_factor)
    new_height = int(height * scale_factor)

    print("Upscaling...")
    upscaled = cv2.resize(denoised, (new_width, new_height), 
                          interpolation=interpolation_methods.get(method, cv2.INTER_CUBIC))

    # Optional sharpening
    if sharpen:
        print("Applying sharpening...")
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        upscaled = cv2.filter2D(upscaled, -1, kernel)

    print(f"Final dimensions: {new_width}x{new_height}")

    # Convert back to base64
    _, buffer = cv2.imencode('.png', upscaled)
    upscaled_base64 = base64.b64encode(buffer).decode('utf-8')

    return upscaled_base64



