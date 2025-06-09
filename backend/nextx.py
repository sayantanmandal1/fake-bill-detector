import os
import torch
import random
import shutil
import numpy as np
from tqdm import tqdm
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader, random_split
import torch.nn as nn
import torch.optim as optim

# Config
DATA_DIR = r"C:\Users\msaya\Downloads\bill detection\ds1"
REAL_DIR = os.path.join(DATA_DIR, "converted_new")
FAKE_DIR = os.path.join(DATA_DIR, "fake_images")
BATCH_SIZE = 64
IMG_SIZE = 224
NUM_EPOCHS = 50
LEARNING_RATE = 1e-4
CHECKPOINT_PATH = "latest_checkpoint.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SEED = 42

# Seed setup
torch.manual_seed(SEED)
np.random.seed(SEED)
random.seed(SEED)

# Transforms
train_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
    transforms.RandomAffine(5, translate=(0.02, 0.02)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

val_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

# Temporary ImageFolder-compatible directory
temp_dir = os.path.join(DATA_DIR, "combined_dataset")
if not os.path.exists(temp_dir):
    os.makedirs(os.path.join(temp_dir, "real"), exist_ok=True)
    os.makedirs(os.path.join(temp_dir, "fake"), exist_ok=True)

    print("🔄 Copying images to structured dataset...")
    for fname in tqdm(os.listdir(REAL_DIR)):
        if fname.lower().endswith((".jpg", ".jpeg")):
            shutil.copy(os.path.join(REAL_DIR, fname), os.path.join(temp_dir, "real", fname))

    for fname in tqdm(os.listdir(FAKE_DIR)):
        if fname.lower().endswith((".jpg", ".jpeg")):
            shutil.copy(os.path.join(FAKE_DIR, fname), os.path.join(temp_dir, "fake", fname))

# All your imports, configs, transforms, and dataset setup above remain unchanged...

def main():
    global best_val_acc
    # Load dataset
    full_dataset = datasets.ImageFolder(temp_dir, transform=train_transforms)
    val_size = int(0.15 * len(full_dataset))
    train_size = len(full_dataset) - val_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    val_dataset.dataset.transform = val_transforms

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

    # Model
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.fc = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.fc.in_features, 2)
    )
    model = model.to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=15, gamma=0.5)

    # Resume logic
    start_epoch = 0
    best_val_acc = 0.0
    if os.path.exists(CHECKPOINT_PATH):
        checkpoint = torch.load(CHECKPOINT_PATH, map_location=DEVICE)
        model.load_state_dict(checkpoint['model_state_dict'])
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        start_epoch = checkpoint['epoch'] + 1
        best_val_acc = checkpoint.get('best_val_acc', 0.0)
        print(f"✅ Resumed from epoch {start_epoch}")

    # Training
    for epoch in range(start_epoch, NUM_EPOCHS):
        model.train()
        total_loss = 0
        correct = 0
        total = 0

        for imgs, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{NUM_EPOCHS} - Training"):
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = correct / total
        avg_loss = total_loss / len(train_loader)

        # Validation
        model.eval()
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
                outputs = model(imgs)
                _, preds = torch.max(outputs, 1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_acc = val_correct / val_total
        scheduler.step()

        print(f"📊 Epoch {epoch+1}: Train Loss = {avg_loss:.4f}, Train Acc = {train_acc:.4f}, Val Acc = {val_acc:.4f}")

        # Save checkpoint
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'best_val_acc': best_val_acc
        }, CHECKPOINT_PATH)

        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), "best_model.pth")
            print("🧠 Best model updated.")

    print("🎯 Training complete.")

# Required for Windows multiprocessing
if __name__ == "__main__":
    import multiprocessing
    multiprocessing.freeze_support()
    main()
