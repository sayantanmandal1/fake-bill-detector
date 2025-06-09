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
Download the entire dataset from 
[here](https://cdn-lfs.hf.co/repos/bc/74/bc740ae3a30f888b2afc5e71529305715513436a3a7e4c6cdabea99b4d4b0640/3577e655813922098cd776422479017be37612ec17a65076b1b62199bf8b28a2?response-content-disposition=attachment%3B+filename*%3DUTF-8%27%27rvl-cdip.tar.gz%3B+filename%3D%22rvl-cdip.tar.gz%22%3B&response-content-type=application%2Fgzip&Expires=1749145983&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0OTE0NTk4M319LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2RuLWxmcy5oZi5jby9yZXBvcy9iYy83NC9iYzc0MGFlM2EzMGY4ODhiMmFmYzVlNzE1MjkzMDU3MTU1MTM0MzZhM2E3ZTRjNmNkYWJlYTk5YjRkNGIwNjQwLzM1NzdlNjU1ODEzOTIyMDk4Y2Q3NzY0MjI0NzkwMTdiZTM3NjEyZWMxN2E2NTA3NmIxYjYyMTk5YmY4YjI4YTI%7EcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj0qJnJlc3BvbnNlLWNvbnRlbnQtdHlwZT0qIn1dfQ__&Signature=ekVkjCCof84O46TEhUH6RGZhug8ZpcZxZ-gmhM72KsUeFswgOPB1jgmP5F2lCaImB7X3M1CKRH4Ri1IrAavHqKvLIcMi90TXrZdGd41j2ixgpTmnFtlGFJUwtoZLgCplQcNmJyPERgLC%7ENBs9PIptTuqHQjRzqh%7EaiP5GXnWUIokF7XDxTZMb8fMlMpNw8PT%7E80IRjxPiNz0jVALzucxOy9tGqXIhSOK1VYdrzpg7AP7mbajapItgFHWR0Vmmyfmwu4%7EVeBcw2TPLCwVkg%7E2poipbSz3Mbm-RDB3RKLyR1sQUMEKE5jd-GkgRYlZq3oKfEFKaQnvfFQgPDpk4-YNNg__&Key-Pair-Id=K3RPWS32NSSJCE)
[and here](https://takeout-download-drive.usercontent.google.com/download/0325updated.task2train(626p)-20250605T165712Z-1-001.zip?j=e5e37825-ecc8-47dd-b65f-7895deca45c9&i=0&user=615530877896&authuser=0)

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
