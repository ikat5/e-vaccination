import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

// Minimal React port of the ML frontend dashboard (progressive integration).
// This component mounts the original HTML structure and implements a
// lightweight portion of the original JS (backend check + prediction chart).

export default function MlReport() {
  const predictionRef = useRef(null);
  const [backendAvailable, setBackendAvailable] = useState(null);

  // Ensure bootstrap and fontawesome links are present (adds them once)
  useEffect(() => {
    const addLink = (href, rel = 'stylesheet') => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement('link');
        l.rel = rel;
        l.href = href;
        document.head.appendChild(l);
      }
    };

    addLink('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
    addLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  }, []);

  useEffect(() => {
    let chartInstance = null;

    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:5001/', { method: 'GET' });
        setBackendAvailable(res.ok);
        return res.ok;
      } catch (e) {
        setBackendAvailable(false);
        return false;
      }
    }

    async function loadPrediction() {
      try {
        const res = await fetch('http://localhost:5001/api/wastage/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

        if (!res.ok) throw new Error('Prediction request failed');
        const data = await res.json();
        if (data.status !== 'success') throw new Error('Prediction returned error');

        const predictions = data.data.predictions || [];
        const labels = predictions.map(p => new Date(p.date).toLocaleDateString());
        const values = predictions.map(p => p.predicted_wastage_rate);

        if (predictionRef.current) {
          const ctx = predictionRef.current.getContext('2d');
          if (chartInstance) chartInstance.destroy();
          chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Predicted Wastage Rate %',
                data: values,
                borderColor: 'rgba(255, 107, 107, 1)',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
              }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
      } catch (err) {
        console.error('Error loading prediction:', err);
      }
    }

    (async () => {
      const ok = await checkBackend();
      if (ok) await loadPrediction();
    })();

    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, []);

  if (backendAvailable === false) {
    return (
      <div className="p-6">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle" style={{fontSize: '3rem', color: '#ff6b6b'}}></i>
          <h3 className="mt-3">Backend Server Not Running</h3>
          <p>Please start the ML Flask backend (see ml/backend) and retry.</p>
        </div>
      </div>
    );
  }

  // Render a simplified dashboard that keeps the original look & feel.
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="section-card bg-white p-4 rounded shadow-sm">
            <h3 className="section-title">Data Visualizations</h3>
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-center mb-3">Coverage by Division</h5>
                <div className="chart-container" style={{height: 250}}>
                  <canvas id="coverageChart" />
                </div>
              </div>
              <div className="col-md-6">
                <h5 className="text-center mb-3">Age Group Distribution</h5>
                <div className="chart-container" style={{height: 250}}>
                  <canvas id="ageChart" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="section-card bg-white p-4 rounded shadow-sm">
            <h3 className="section-title">Wastage Prediction (Next 7 Days)</h3>
            <div className="chart-container" style={{height: 250}}>
              <canvas ref={predictionRef} id="predictionChart" />
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
                <i className="fas fa-sync-alt me-1"></i>Refresh Prediction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
