import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Camera, Loader2, Eye, Trash2 } from "lucide-react";

function BillDetector() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPrediction("");
      setConfidence(null);
      setError("");
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://fake-bill-detector.onrender.com/predict", {
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
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setImagePreview(null);
    setPrediction("");
    setConfidence(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #ffffff 50%, #f3e8ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconContainer: {
      padding: '8px',
      backgroundColor: '#e0e7ff',
      borderRadius: '8px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      marginTop: '4px',
      margin: 0
    },
    mainContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px',
      '@media (min-width: 1024px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      border: '1px solid #f3f4f6'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    uploadArea: {
      position: 'relative',
      border: '2px dashed #d1d5db',
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    uploadAreaActive: {
      borderColor: '#6366f1',
      backgroundColor: '#f0f9ff'
    },
    uploadAreaHover: {
      borderColor: '#818cf8',
      backgroundColor: '#f9fafb'
    },
    hiddenInput: {
      display: 'none'
    },
    uploadContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    },
    uploadText: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#374151'
    },
    uploadSubtext: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px'
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#6366f1',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px'
    },
    buttonHover: {
      backgroundColor: '#4f46e5'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    fileInfo: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'left'
    },
    fileName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    fileSize: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    },
    buttonSecondary: {
      flex: 1,
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    buttonDanger: {
      backgroundColor: '#fef2f2',
      color: '#dc2626'
    },
    primaryButton: {
      width: '100%',
      justifyContent: 'center',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      fontSize: '18px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
      marginTop: '24px'
    },
    primaryButtonHover: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)'
    },
    resultsCard: {
      marginTop: '24px'
    },
    resultItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f9fafb'
    },
    resultLabel: {
      fontSize: '14px',
      color: '#6b7280'
    },
    resultValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      textTransform: 'capitalize'
    },
    resultValueReal: {
      color: '#059669'
    },
    resultValueFake: {
      color: '#dc2626'
    },
    confidenceContainer: {
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f9fafb',
      marginTop: '16px'
    },
    confidenceLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    progressBar: {
      flex: 1,
      height: '12px',
      backgroundColor: '#e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '6px',
      transition: 'width 1s ease-in-out'
    },
    progressFillReal: {
      backgroundColor: '#10b981'
    },
    progressFillFake: {
      backgroundColor: '#ef4444'
    },
    confidenceValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#374151'
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca'
    },
    errorLabel: {
      fontSize: '14px',
      color: '#dc2626'
    },
    errorMessage: {
      color: '#991b1b',
      fontWeight: '500'
    },
    previewContainer: {
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
      border: '2px solid #e5e7eb',
      marginBottom: '16px'
    },
    previewImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '384px',
      objectFit: 'contain'
    },
    previewText: {
      textAlign: 'center',
      padding: '48px',
      color: '#9ca3af'
    },
    previewIcon: {
      margin: '0 auto 16px'
    },
    previewTitle: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '4px'
    },
    previewSubtitle: {
      fontSize: '14px'
    },
    infoCard: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f3e8ff 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e0e7ff',
      marginTop: '24px'
    },
    infoTitle: {
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px'
    },
    infoList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    infoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#374151'
    },
    infoBullet: {
      width: '8px',
      height: '8px',
      backgroundColor: '#6366f1',
      borderRadius: '50%',
      marginTop: '8px',
      marginRight: '12px',
      flexShrink: 0
    },
    successSelected: {
      color: '#059669'
    }
  };

  // Responsive styles
  const isLargeScreen = window.innerWidth >= 1024;
  const gridStyle = {
    ...styles.grid,
    ...(isLargeScreen ? { gridTemplateColumns: '1fr 1fr' } : {})
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.iconContainer}>
            <FileText size={32} color="#6366f1" />
          </div>
          <div>
            <h1 style={styles.title}>Bill Authenticity Detector</h1>
            <p style={styles.subtitle}>Upload a bill image to verify its authenticity using AI</p>
          </div>
        </div>
      </div>

      <div style={styles.mainContainer}>
        <div style={gridStyle}>
          {/* Upload Section */}
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <Upload size={20} color="#6366f1" />
                Upload Bill Image
              </h2>
              
              {/* File Upload Area */}
              <div
                style={{
                  ...styles.uploadArea,
                  ...(dragActive ? styles.uploadAreaActive : {}),
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onMouseEnter={(e) => {
                  if (!dragActive) {
                    e.target.style.borderColor = '#818cf8';
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!dragActive) {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  style={styles.hiddenInput}
                />
                
                {!file ? (
                  <div style={styles.uploadContent}>
                    <Camera size={64} color="#9ca3af" />
                    <div>
                      <p style={styles.uploadText}>Drop your bill image here</p>
                      <p style={styles.uploadSubtext}>or click to browse files</p>
                    </div>
                    <button
                      onClick={openFileDialog}
                      style={styles.button}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
                    >
                      <Upload size={16} />
                      Choose File
                    </button>
                  </div>
                ) : (
                  <div style={styles.uploadContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={32} color="#059669" />
                      <span style={{ ...styles.uploadText, ...styles.successSelected }}>File Selected</span>
                    </div>
                    <div style={styles.fileInfo}>
                      <p style={styles.fileName}>{file.name}</p>
                      <p style={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div style={styles.buttonGroup}>
                      <button
                        onClick={openFileDialog}
                        style={{ ...styles.button, ...styles.buttonSecondary }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      >
                        <Upload size={16} />
                        Change File
                      </button>
                      <button
                        onClick={clearFile}
                        style={{ ...styles.button, ...styles.buttonDanger }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#fef2f2'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {file && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(loading ? styles.buttonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
                      e.target.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
                      e.target.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye size={20} />
                      Detect Authenticity
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Results Section */}
            {(prediction || error) && (
              <div style={{ ...styles.card, ...styles.resultsCard }}>
                <h3 style={styles.cardTitle}>Analysis Results</h3>
                
                {prediction && (
                  <div>
                    <div style={styles.resultItem}>
                      {prediction === "real" ? (
                        <CheckCircle size={24} color="#059669" />
                      ) : (
                        <XCircle size={24} color="#dc2626" />
                      )}
                      <div>
                        <p style={styles.resultLabel}>Prediction</p>
                        <p style={{
                          ...styles.resultValue,
                          ...(prediction === "real" ? styles.resultValueReal : styles.resultValueFake)
                        }}>
                          {prediction}
                        </p>
                      </div>
                    </div>
                    
                    {confidence !== null && (
                      <div style={styles.confidenceContainer}>
                        <p style={styles.confidenceLabel}>Confidence Level</p>
                        <div style={styles.progressContainer}>
                          <div style={styles.progressBar}>
                            <div
                              style={{
                                ...styles.progressFill,
                                ...(prediction === "real" ? styles.progressFillReal : styles.progressFillFake),
                                width: `${confidence}%`
                              }}
                            ></div>
                          </div>
                          <span style={styles.confidenceValue}>{confidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div style={styles.errorContainer}>
                    <AlertCircle size={24} color="#dc2626" />
                    <div>
                      <p style={styles.errorLabel}>Error</p>
                      <p style={styles.errorMessage}>{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <Eye size={20} color="#6366f1" />
                Image Preview
              </h3>
              
              {imagePreview ? (
                <div>
                  <div style={styles.previewContainer}>
                    <img
                      src={imagePreview}
                      alt="Bill preview"
                      style={styles.previewImage}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      Image loaded successfully. Click "Detect Authenticity" to analyze.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={styles.previewText}>
                  <div style={styles.previewIcon}>
                    <Camera size={64} color="#9ca3af" />
                  </div>
                  <p style={styles.previewTitle}>No image selected</p>
                  <p style={styles.previewSubtitle}>Upload an image to see preview</p>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>How it works</h4>
              <ul style={styles.infoList}>
                <li style={styles.infoItem}>
                  <span style={styles.infoBullet}></span>
                  Upload a clear image of your bill
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoBullet}></span>
                  Our AI analyzes the image using advanced computer vision
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoBullet}></span>
                  Get instant results with confidence score
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default BillDetector;