# Use official Python image
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Copy backend code
COPY ./backend /app

# Install system dependencies for Pillow and gdown
RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install torch torchvision fastapi uvicorn pillow gdown

# Expose port (Render uses 10000 by default, but your app may use 8000)
EXPOSE 8000

# Start command: run uvicorn with your main app module (adjust if your file is named differently)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
