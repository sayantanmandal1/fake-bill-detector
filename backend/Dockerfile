# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all project files
COPY . /app

# Install system dependencies required by Pillow and gdown
RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install Python dependencies from requirements.txt (CPU-only)
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt -f https://download.pytorch.org/whl/cpu

# Expose port 8000
EXPOSE 8000

# Start the FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
