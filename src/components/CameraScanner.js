// src/components/CameraScanner.js
import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import '../styles/CameraScanner.css';

const CameraScanner = ({ onScan }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [scannedText, setScannedText] = useState(null);

  const handleScan = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    setImageSrc(screenshot);
    setLoading(true);
    setError(null);

    Tesseract.recognize(
      screenshot,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    )
      .then(({ data: { text } }) => {
        console.log('Texte extrait :', text);
        setLoading(false);
        setScannedText(text);
      })
      .catch((err) => {
        setLoading(false);
        setError('Erreur lors de la reconnaissance du texte');
        console.error(err);
      });
  }, []);

  const handleRetake = () => {
    setImageSrc(null);
    setScannedText(null);
    setError(null);
  };

  const handleAnalyze = () => {
    if (scannedText) {
      onScan(scannedText);
    }
  };

  return (
    <div>
      {imageSrc ? (
        <div>
          <img src={imageSrc} alt="Scanned" width="100%" height="100%" />
          <div className="button-container">
            <button onClick={handleRetake}>Reprendre</button>
            <button onClick={handleAnalyze} disabled={loading}>
              {loading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              )}
              Analyser
            </button>
          </div>
        </div>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          height="100%"
        />
      )}
      {!imageSrc && (
        <div className="button-container">
          <button onClick={handleScan} disabled={loading}>
            {loading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
            Scan
          </button>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CameraScanner;