import torch
import uvicorn
import io
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
import torch.nn as nn
from torchvision import models, transforms
from fastapi.middleware.cors import CORSMiddleware
import gdown

DEVICE = torch.device("cpu")
# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = "best_model.pth"
GDRIVE_FILE_ID = "1lvB_e-pyDXoKNJvetR3bcVzNTLaTXDIj"

def download_model():
    if not os.path.exists(MODEL_PATH):
        url = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"
        print("Downloading model from Google Drive...")
        gdown.download(url, MODEL_PATH, quiet=False)
    else:
        print("Model already downloaded.")

# Download model on startup
download_model()

# Load model
model = models.resnet18(pretrained=False)
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.fc.in_features, 2)
)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model = model.to(DEVICE)
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = transform(image).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            output = model(tensor)
            probabilities = torch.softmax(output, dim=1)[0]
            predicted_class = torch.argmax(probabilities).item()
            confidence = probabilities[predicted_class].item()

        label = "real" if predicted_class == 1 else "fake"
        return JSONResponse({
            "prediction": label,
            "confidence": round(confidence * 100, 2)
        })

    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
