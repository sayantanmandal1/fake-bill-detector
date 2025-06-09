import os
from pathlib import Path
from PIL import Image
from tqdm import tqdm

base_dir = r"C:\Users\msaya\Downloads\bill detection\ds1"
images_base = os.path.join(base_dir, "images")
output_dir = os.path.join(base_dir, "converted_new")
os.makedirs(output_dir, exist_ok=True)

train_file = os.path.join(base_dir, "train.txt")

converted_count = 0
missing_files = []

with open(train_file, "r") as f:
    lines = f.readlines()

for line in tqdm(lines, desc="Converting invoices"):
    rel_path = line.strip().split()[0]
    tif_path = os.path.join(images_base, rel_path)

    if not os.path.exists(tif_path):
        missing_files.append(tif_path)
        continue

    try:
        img = Image.open(tif_path)
        img = img.convert("RGB")
        # Use a flat filename to avoid folder complexity
        flat_name = rel_path.replace("/", "_").replace("\\", "_").replace(".tif", ".jpg")
        out_path = os.path.join(output_dir, flat_name)
        img.save(out_path, "JPEG")
        converted_count += 1
    except Exception as e:
        print(f"❌ Failed to convert {tif_path}: {e}")

print(f"\n✅ Converted {converted_count} invoice .tif files to .jpg")
if missing_files:
    print(f"\n❌ {len(missing_files)} missing .tif files (not found):")
    for m in missing_files[:10]:
        print(f"  {m}")
