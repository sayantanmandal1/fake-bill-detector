import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import pytesseract
import cv2
from tqdm import tqdm  # <-- added import

input_dir = r"C:\Users\msaya\Downloads\bill detection\ds1\converted_new"
output_dir = r"C:\Users\msaya\Downloads\bill detection\ds1\fake_images"
os.makedirs(output_dir, exist_ok=True)

# Load some alternative fonts to use for font inconsistency
FONTS = [
    ImageFont.load_default(),
    ImageFont.truetype("arial.ttf", 18),
    ImageFont.truetype("cour.ttf", 18),
    # Add paths to more fonts if you want
]

def add_noise(img):
    """Add subtle pixel noise to mimic compression/artifacts"""
    cv_img = np.array(img)
    noise = np.random.normal(0, 5, cv_img.shape).astype(np.uint8)
    noisy_img = cv2.add(cv_img, noise)
    return Image.fromarray(noisy_img)

def tamper_image(image_path):
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)
    
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

    for i in range(len(data['text'])):
        conf = int(data['conf'][i])
        text = data['text'][i].strip()
        if conf > 70 and text:
            x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]

            # Decide randomly which tampering to apply for each detected text box
            choice = random.choices(
                ["erase", "replace", "font_inconsistency", "distort", "blur_noise", "none"],
                weights=[0.2, 0.2, 0.1, 0.2, 0.2, 0.1],
                k=1
            )[0]

            if choice == "erase":
                # Erase (white rectangle over key fields)
                draw.rectangle((x, y, x + w, y + h), fill="white")

            elif choice == "replace":
                # Replace text with random digits (or chars)
                fake_text = ''.join(random.choices("0123456789", k=min(len(text), 5)))
                draw.rectangle((x, y, x + w, y + h), fill="white")
                font = random.choice(FONTS)
                draw.text((x, y), fake_text, fill="black", font=font)

            elif choice == "font_inconsistency":
                # Redraw with a different font
                fake_text = text
                draw.rectangle((x, y, x + w, y + h), fill="white")
                alt_font = random.choice(FONTS)
                draw.text((x, y), fake_text, fill="black", font=alt_font)

            elif choice == "distort":
                # Distort region with affine transform or pixel noise (OpenCV)
                region = image.crop((x, y, x + w, y + h))
                cv_region = np.array(region)

                # Small random warp
                rows, cols, ch = cv_region.shape
                pts1 = np.float32([[0, 0], [cols - 1, 0], [0, rows - 1]])
                pts2 = pts1 + np.random.randint(-2, 3, pts1.shape).astype(np.float32)

                M = cv2.getAffineTransform(pts1, pts2)
                dst = cv2.warpAffine(cv_region, M, (cols, rows))

                distorted = Image.fromarray(dst)
                image.paste(distorted, (x, y))

            elif choice == "blur_noise":
                # Blur + add noise to region
                region = image.crop((x, y, x + w, y + h))
                region = region.filter(ImageFilter.GaussianBlur(radius=1))
                region = add_noise(region)
                image.paste(region, (x, y))

            # else choice == "none" do nothing (skip tampering for this text box)

    return image


# Process all images in input directory with progress bar
image_files = [f for f in os.listdir(input_dir) if f.lower().endswith((".jpg", ".png", ".jpeg"))]

for fname in tqdm(image_files, desc="Processing images"):
    output_path = os.path.join(output_dir, fname)
    if os.path.exists(output_path):
        continue  # Skip already processed
    real_path = os.path.join(input_dir, fname)
    fake_img = tamper_image(real_path)
    fake_img.save(output_path)


print("✅ Fake images generated and saved with multiple tampering methods.")
