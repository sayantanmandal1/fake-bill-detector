import React, { useState } from "react";

function BillDetector() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction("");
    setConfidence(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence?.toFixed(2));
    } catch (err) {
      console.error("Prediction failed:", err);
      setError("Prediction failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Bill Authenticity Detector</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Predict</button>
      {file && <p>File: {file.name}</p>}
      {prediction && (
        <p>
          Prediction: <strong>{prediction}</strong>{" "}
          {confidence !== null && <span>(Confidence: {confidence}%)</span>}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default BillDetector;
