# Use PyTorch official image with CUDA support if needed, or CPU-only version
FROM pytorch/pytorch:2.2.0-cpu

# Set work directory
WORKDIR /app

# Install system dependencies (only if needed for Pillow/gdown)
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependency files first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 8000

# Start app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
