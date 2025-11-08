# 🏥 E-Vaccination Admin Dashboard

A comprehensive admin dashboard for managing and monitoring vaccine distribution, predicting wastage using ML, and visualizing vaccination coverage data.

## 🎯 Project Overview

This project provides a complete solution for e-vaccination management with four core features:

1. **Monitor Vaccine Movement** - Track transfers between hubs and centers
2. **Predict Wastage** - ML-powered wastage prediction using data trends
3. **Data Visualization** - Coverage, demographics, and regional insights
4. **Smart Insights** - Automated recommendations using AI/ML models

## 📊 Features

### 1. Vaccine Movement Tracking
- Real-time tracking of vaccine transfers between hubs
- Filter by status (Delivered, In Transit, Delayed)
- View transfer history with batch IDs
- Distance and route information

### 2. Wastage Prediction (ML Model)
- Random Forest model trained on historical data
- 7-day wastage rate prediction
- Feature importance analysis
- Hub-specific predictions available

### 3. Data Visualizations
- Coverage percentage by region and state
- Age group distribution (pie chart)
- Vaccination trends over time
- Wastage reasons breakdown
- Demographics analysis

### 4. Smart Insights & Automation
- Automated high-wastage hub detection
- Low stock alerts
- Coverage analysis vs targets
- Weekend wastage pattern detection
- Actionable recommendations

## 🛠️ Tech Stack

**Backend:**
- Python 3.8+
- Flask (REST API)
- Pandas & NumPy (Data processing)
- Scikit-learn (ML models)
- Flask-CORS (Cross-origin support)

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap 5 (UI framework)
- Chart.js (Data visualization)
- Font Awesome (Icons)

**Data:**
- CSV files (Synthetic dataset)
- 7 different data tables
- 90 days of historical data

**Machine Learning:**
- Random Forest Regressor
- Linear Regression
- Feature engineering
- Time-series analysis

## 📁 Project Structure

```
ml/
├── data/                          # Generated datasets
│   ├── hubs_master.csv
│   ├── vaccine_inventory.csv
│   ├── vaccine_movements.csv
│   ├── vaccination_records.csv
│   ├── wastage_tracking.csv
│   ├── daily_metrics.csv
│   └── demographics_summary.csv
├── backend/                       # Flask API
│   └── app.py
├── frontend/                      # Web dashboard
│   └── index.html
├── models/                        # Trained ML models
│   └── wastage_prediction_model.pkl
├── notebooks/                     # Jupyter notebooks
│   └── wastage_prediction_model.ipynb
├── generate_dataset.py           # Dataset generator
└── requirements.txt              # Python dependencies
```

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Edge)

### Step 1: Install Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### Step 2: Generate Synthetic Dataset

```bash
python generate_dataset.py
```

This will create 7 CSV files in the `data/` directory with realistic vaccination data.

**Generated Data:**
- 30 hubs across 6 states
- 50,000 vaccination records
- 150 vaccine transfers
- 500 wastage incidents
- 90 days of daily metrics

### Step 3: Train ML Model (Optional)

Open and run the Jupyter notebook:

```bash
jupyter notebook notebooks/wastage_prediction_model.ipynb
```

Run all cells to:
- Perform exploratory data analysis
- Train Random Forest model
- Evaluate model performance
- Save model to `models/` directory

**Note:** You can skip this step as the backend will work with basic prediction logic even without the trained model.

### Step 4: Start Backend API

```bash
cd backend
python app.py
```

The API will start on `http://localhost:5000`

**Available Endpoints:**
- `GET /` - Health check
- `GET /api/overview` - Dashboard overview stats
- `GET /api/movements` - Vaccine movement tracking
- `POST /api/wastage/predict` - Wastage prediction
- `GET /api/wastage/stats` - Wastage statistics
- `GET /api/coverage` - Coverage data
- `GET /api/demographics` - Demographics breakdown
- `GET /api/insights` - Smart insights
- `GET /api/hubs` - All hubs with inventory
- `GET /api/hubs/<hub_id>` - Specific hub details

### Step 5: Open Frontend Dashboard

Simply open `frontend/index.html` in your web browser, or use a local server:

```bash
cd frontend
python -m http.server 8080
```

Then visit: `http://localhost:8080`

## 📊 Dataset Schema

### 1. Hubs Master (30 hubs)
- Hub ID, name, type (Distribution Hub, Primary Center, Sub Center)
- Location (state, district, region, coordinates)
- Capacity, storage capacity, staff count
- Operational status, cold chain availability

### 2. Vaccine Inventory
- Inventory ID, hub details
- Vaccine name, batch ID
- Quantities (received, administered, wasted, remaining)
- Dates (received, expiry)
- Storage conditions

### 3. Vaccine Movements (150 transfers)
- Transfer ID, from/to hub
- Vaccine details, quantity
- Transfer dates, delivery status
- Transport mode, distance

### 4. Vaccination Records (50,000 records)
- Vaccination ID, citizen ID (anonymized)
- Hub, vaccine, batch, dose number
- Demographics (age, gender, occupation)
- Comorbidity status

### 5. Wastage Tracking (500 incidents)
- Wastage ID, hub details
- Quantity wasted, date
- Reason (Expired, Breakage, Temperature Breach, etc.)
- Cost impact

### 6. Daily Metrics (2,700 records - 90 days × 30 hubs)
- Hub, date
- Stock levels (opening, closing)
- Operations (received, administered, wasted)
- Rates (wastage %, utilization %)
- Environmental factors (temperature, power outage)
- Temporal features (day of week, holidays)

### 7. Demographics Summary
- Region, state
- Population statistics
- Coverage percentages
- Age and gender distributions

## 🤖 Machine Learning Model

### Model Details
- **Algorithm:** Random Forest Regressor
- **Target Variable:** Wastage Rate (%)
- **Features:** 40+ features including:
  - Stock levels (opening, closing)
  - Operational metrics (utilization, administered)
  - Environmental (temperature, power outages)
  - Temporal (day of week, month, holidays)
  - Categorical (hub type, state, region, weather)

### Model Performance
- Trained on 80% of data (2,160 records)
- Tested on 20% of data (540 records)
- Metrics tracked: MAE, RMSE, R²
- Feature importance analysis included

### Prediction Capabilities
- 7-day wastage rate forecast
- Hub-specific predictions
- Confidence intervals
- Trend analysis

## 📸 Dashboard Features

### Overview Cards
- Total vaccines supplied
- Total administered
- Wastage rate
- Active hubs

### Vaccine Movement Table
- Searchable and filterable
- Status indicators (color-coded)
- Date range filtering
- Real-time updates

### Charts & Visualizations
1. **Coverage by Region** - Bar chart
2. **Age Group Distribution** - Doughnut chart
3. **Wastage Reasons** - Pie chart
4. **Vaccination Trend** - Line chart
5. **Wastage Prediction** - Time-series forecast

### Smart Insights Panel
- High wastage alerts
- Low stock warnings
- Coverage analysis
- Weekend pattern detection
- Automated recommendations

## 🎓 Student Project Notes

This project was designed to be completed by a student within 4 weeks. It demonstrates:

✅ **Data Engineering** - Synthetic dataset generation with realistic patterns
✅ **Machine Learning** - Model training, evaluation, and deployment
✅ **Backend Development** - RESTful API with Flask
✅ **Frontend Development** - Responsive dashboard with visualizations
✅ **Full-Stack Integration** - Complete working system

### What's Included (Realistic for Students)
- Working ML model with predictions
- Clean, professional dashboard
- All 4 core requirements met
- Synthetic but realistic data
- Good documentation

### What's Simplified
- Used SQLite/CSV instead of PostgreSQL
- No authentication/authorization
- Single-page dashboard (no complex routing)
- Basic error handling
- No Docker/CI/CD
- Local deployment only

## 🚧 Future Enhancements

- [ ] User authentication & role-based access
- [ ] PostgreSQL/MongoDB integration
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced forecasting models (LSTM, Prophet)
- [ ] Interactive maps for hub locations
- [ ] Automated report generation (PDF export)
- [ ] Email alerts for critical events
- [ ] Multi-language support
- [ ] Docker containerization

## 🐛 Troubleshooting

### Issue: Backend can't find data files
**Solution:** Make sure you've run `generate_dataset.py` first and the `data/` directory exists.

### Issue: CORS errors in browser
**Solution:** Make sure Flask-CORS is installed and the backend is running.

### Issue: Charts not displaying
**Solution:** Check browser console for errors. Ensure backend API is accessible at `http://localhost:5000`.

### Issue: Model predictions not working
**Solution:** Train the model using the Jupyter notebook or the backend will use simple averaging instead.

## 📝 API Usage Examples

### Get Overview Stats
```bash
curl http://localhost:5000/api/overview
```

### Get Vaccine Movements (Filtered)
```bash
curl "http://localhost:5000/api/movements?status=In_Transit"
```

### Predict Wastage
```bash
curl -X POST http://localhost:5000/api/wastage/predict \
  -H "Content-Type: application/json" \
  -d '{"hub_id": "HUB_001"}'
```

### Get Smart Insights
```bash
curl http://localhost:5000/api/insights
```

## 📚 Learning Resources

- **Flask Documentation:** https://flask.palletsprojects.com/
- **Scikit-learn Guide:** https://scikit-learn.org/stable/
- **Chart.js Documentation:** https://www.chartjs.org/docs/
- **Bootstrap 5:** https://getbootstrap.com/docs/5.3/

## 👨‍💻 Author

Student Project - E-Vaccination Admin Dashboard
Created as part of software engineering coursework

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Synthetic data patterns inspired by real-world vaccination programs
- UI design inspired by modern admin dashboards
- ML approach based on standard forecasting techniques

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the code comments
3. Check browser developer console for errors
4. Verify all dependencies are installed

---

**⭐ If this project helped you, please star it on GitHub!**

## Quick Start Commands

```bash
# Setup
pip install -r requirements.txt

# Generate data
python generate_dataset.py

# Start backend
cd backend && python app.py

# Open frontend
# Open frontend/index.html in browser
```

**That's it! Your E-Vaccination Dashboard is ready! 🎉**
