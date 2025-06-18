# Medad: Generative Arabic Calligraphy via Image-to-Image Translation

A research‐driven project exploring how modern deep-learning can automate and enhance the art of Arabic calligraphy. Medad takes standard Arabic text (rendered in a common font like Arial) and transforms it into rich, high-fidelity calligraphic images (Thuluth style) using a custom Vision-Transformer-based image-to-image translation model.

---

## 🎨 Motivation

Arabic calligraphy is a centuries-old cultural treasure, traditionally crafted by expert calligraphers (Khattāt). Medad investigates whether generative AI can both preserve those traditional rules and open new creative possibilities—automating the style transfer from plain text to beautiful calligraphic renderings.

---

## ✨ Features

- **High-quality Style Transfer**  
  Converts standard Arabic text into authentic Thuluth calligraphy with structural and artistic fidelity.

- **Multi-word Support**  
  Handles full phrases (4+ words) while preserving proper ligatures, stroke connections, and inter-letter spacing.

- **Web Interface**  
  User-friendly front end built in Django, backed by a FastAPI microservice for inference and image super-resolution.

- **Extensible Architecture**  
  Easily swap in new calligraphy styles or back-end models (e.g., GANs, diffusion) via modular design.

---

## 🏗️ Model & Architecture

1. **Vision Transformer Encoder**  
   - Input images are split into 16×16 patches, linearly embedded, and processed through multi-head self-attention layers.

2. **Upsampling + Residual Blocks**  
   - Three progressive upsampling stages (ConvTranspose2D + residual convolutions + skip-connections) restore full resolution.

3. **Output Layer**  
   - Final 3×3 convolution + tanh activation yields a 224×224 grayscale calligraphy image.

4. **Post-processing**  
   - OpenCV-based denoising and bicubic upscaling to enhance visual quality.

---

## 📚 Dataset

- **Source**: Quran verses, rendered as paired Arial→Thuluth images.  
- **Samples**: 20 000 four-word image pairs (14 000 train / 6 000 test).  
- **Preprocessing**:  
  - Resize to 224×224 px  
  - Convert to single-channel grayscale  
  - Normalize to [−1, 1]  

---

## 📊 Evaluation & Results

| Metric             | Value      |
|--------------------|------------|
| **SSIM**           | 0.957      |
| **PSNR (dB)**      | 26.29 dB   |

> The model consistently produces high-fidelity Thuluth calligraphy, preserving both stroke detail and inter-letter harmony across phrases.  
## 🌐 Web Demo

A live demo is available at:  
**[https://medad.up.railway.app/](https://medad.up.railway.app/)**  

## 📜 License

This project was conducted under the auspices of Qassim University as a Final Year Project and is released under the **MIT License**.  

