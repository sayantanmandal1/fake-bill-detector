# Bill Authenticity Detector

## Overview

The Bill Authenticity Detector is a full-stack application designed to detect whether a given bill or receipt image is authentic or fake. The backend is built with FastAPI and PyTorch, serving a ResNet18-based deep learning model for image classification. The frontend is a React interface allowing users to upload bill images and receive authenticity predictions in real time.

---

## Features

- Image upload and preview on frontend
- FastAPI backend API for prediction
- Deep learning model (ResNet18) trained on real and fake bill images
- CORS enabled for seamless frontend-backend interaction
- Confidence score along with prediction label
- Easy deployment setup on Render

---

## Project Structure

```
/backend      # FastAPI backend code and model loader
/frontend     # React frontend code
README.md    # This documentation
```

---

## Backend Details

- **Framework:** FastAPI
- **Model:** PyTorch ResNet18 with custom classifier head
- **Model Download:** The model weights are downloaded at runtime from a Google Drive URL
- **Endpoints:**
  - `POST /predict`: Accepts image file uploads and returns JSON with prediction and confidence

---

## Frontend Details

- **Framework:** React (functional components with hooks)
- **Features:** File upload, preview, prediction display, error handling

---

## Setup Instructions

### Backend

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

The backend will automatically download the latest model weights from the configured Google Drive link.

---

### Frontend

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

This will launch the frontend at `http://localhost:3000`, which communicates with the backend API.

---

## Deployment on Render

- Backend and frontend can be deployed separately.
- Backend uses `uvicorn` to serve the FastAPI app.
- Frontend is a standard React build served as a static site.
- Model files are fetched dynamically at backend startup, so no local model storage required.

---

## API Usage Example

```bash
curl -X POST "http://127.0.0.1:8000/predict" -F "file=@/path/to/bill_image.jpg"
```

Response:

```json
{
  "prediction": "real",
  "confidence": 99.99
}
```

---

## Technologies Used

- Python 3.9+
- FastAPI
- PyTorch & torchvision
- React 18+
- JavaScript (ES6+)
- HTML5 & CSS3

---

## Notes & Future Improvements

- Add GPU support for faster inference
- Improve UI/UX on frontend with progress bars and better error messages
- Extend model to support multi-class classification (e.g., different types of bills)
- Add authentication and user management
- Containerize backend and frontend with Docker for easier deployment

---

## Author

Sayantan Mandal  
Email: sayantan@example.com  
GitHub: [sayantanmandal1](https://github.com/sayantanmandal1)

---

## License

MIT License

---

## Acknowledgements

- Pretrained ResNet18 architecture from torchvision
- FastAPI documentation and tutorials
- React documentation and ecosystem

---
