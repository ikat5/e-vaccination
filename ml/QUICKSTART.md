# ⚡ Quick Setup Guide - E-Vaccination Dashboard

## 🚀 Get Started in 5 Minutes

### Option 1: Automated Setup (Recommended)

```bash
cd /home/stoic/Desktop/e-vaccination/ml
chmod +x run.sh
./run.sh
```

This script will:
- ✅ Check Python installation
- ✅ Install all dependencies
- ✅ Generate synthetic dataset
- ✅ Start backend server
- ✅ Open dashboard in browser

---

### Option 2: Manual Setup

#### Step 1: Install Dependencies (1 min)
```bash
cd /home/stoic/Desktop/e-vaccination/ml
pip3 install -r requirements.txt
```

#### Step 2: Generate Data (30 seconds)
```bash
python3 generate_dataset.py
```

Expected output:
```
🚀 Starting synthetic dataset generation...
📍 Generating Hub/Center Master data...
✅ Generated 30 hubs
💉 Generating Vaccine Inventory data...
✅ Generated 180 inventory records
...
🎉 Dataset generation complete!
```

#### Step 3: Start Backend (10 seconds)
```bash
cd backend
python3 app.py
```

You should see:
```
🚀 E-Vaccination Dashboard API Server
📡 Starting server on http://localhost:5000
```

Keep this terminal open!

#### Step 4: Open Dashboard
Open `frontend/index.html` in your browser or:
```bash
# In a new terminal
cd /home/stoic/Desktop/e-vaccination/ml/frontend
python3 -m http.server 8080
# Then visit: http://localhost:8080
```

---

## ✅ Verify Installation

### Test Backend API
```bash
curl http://localhost:5000/
```

Should return:
```json
{
  "status": "success",
  "message": "E-Vaccination Dashboard API is running!",
  "version": "1.0.0"
}
```

### Test Overview Endpoint
```bash
curl http://localhost:5000/api/overview
```

Should return dashboard statistics.

---

## 📁 File Structure Check

After setup, you should have:

```
ml/
├── data/                          ✅ Created by generate_dataset.py
│   ├── hubs_master.csv           
│   ├── vaccine_inventory.csv     
│   ├── vaccine_movements.csv     
│   ├── vaccination_records.csv   
│   ├── wastage_tracking.csv      
│   ├── daily_metrics.csv         
│   └── demographics_summary.csv  
├── backend/
│   └── app.py                    ✅ Flask API
├── frontend/
│   └── index.html                ✅ Dashboard
├── models/                        ⚠️ Created after training
│   └── wastage_prediction_model.pkl
├── notebooks/
│   └── wastage_prediction_model.ipynb  ✅ Jupyter notebook
├── generate_dataset.py            ✅ Data generator
├── requirements.txt               ✅ Dependencies
├── run.sh                        ✅ Auto-setup script
├── README.md                     ✅ Full documentation
├── DEMO_SCRIPT.md                ✅ Presentation guide
└── QUICKSTART.md                 ✅ This file
```

---

## 🎓 Optional: Train ML Model

To get actual ML predictions (recommended but not required):

1. **Install Jupyter**
```bash
pip3 install jupyter
```

2. **Start Jupyter**
```bash
jupyter notebook
```

3. **Open and run the notebook**
- Navigate to `notebooks/wastage_prediction_model.ipynb`
- Click "Cell" → "Run All"
- Wait for all cells to complete (~2-3 minutes)
- Model will be saved to `models/wastage_prediction_model.pkl`

4. **Restart backend** to load the trained model

---

## 🐛 Common Issues

### Issue: "Module not found" error
**Solution:**
```bash
pip3 install pandas numpy scikit-learn flask flask-cors
```

### Issue: Port 5000 already in use
**Solution:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or change port in backend/app.py (last line)
```

### Issue: CORS errors in browser
**Solution:** Make sure backend is running and flask-cors is installed:
```bash
pip3 install flask-cors
```

### Issue: Data files not found
**Solution:** Run dataset generator:
```bash
python3 generate_dataset.py
```

### Issue: Charts not showing
**Solution:** 
1. Check browser console (F12) for errors
2. Verify backend API is accessible: `curl http://localhost:5000/api/overview`
3. Check CORS is enabled in backend

---

## 📊 What Should You See?

### Dashboard Overview (Top)
- **4 colored stat cards** with:
  - Total Vaccines Supplied (purple gradient)
  - Total Administered (pink gradient)
  - Wastage Rate % (blue gradient)
  - Active Hubs count (green gradient)

### Main Section (Left)
- **Vaccine Movement Table** with:
  - Sortable columns
  - Status badges (colored)
  - Filter dropdowns
  - 20 most recent transfers

- **4 Charts**:
  - Coverage by Region (bar chart)
  - Age Group Distribution (doughnut)
  - Wastage Reasons (pie chart)
  - Vaccination Trend (line chart)

### Sidebar (Right)
- **Smart Insights Panel** with:
  - 4-5 colored insight cards
  - Recommendations for each

- **Wastage Prediction Chart**:
  - 7-day forecast line chart
  - Refresh button

---

## 🎯 Quick Feature Test

### Test 1: Filter Movements
1. In movements table, select "In_Transit" from dropdown
2. Click "Apply Filter"
3. Table should show only in-transit vaccines

### Test 2: Refresh Prediction
1. Click "Refresh Prediction" button
2. Chart should update with new forecast

### Test 3: Hover Charts
1. Hover over any chart
2. Should show tooltip with details

### Test 4: API Direct Access
Visit in browser:
- http://localhost:5000/
- http://localhost:5000/api/overview
- http://localhost:5000/api/insights

---

## 📱 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:5000 | REST API endpoints |
| API Health | http://localhost:5000/ | Check if API is running |
| Dashboard | file:///.../frontend/index.html | Main dashboard |
| Alternative | http://localhost:8080 | If using http.server |

---

## 🎬 Ready to Demo?

1. ✅ Backend running on port 5000
2. ✅ Dashboard open in browser
3. ✅ All charts loading correctly
4. ✅ Data showing in tables
5. ✅ Insights displaying
6. ✅ No console errors (press F12)

### Pre-Demo Checklist:
- [ ] Fresh data generated (run `generate_dataset.py`)
- [ ] Backend server running
- [ ] Dashboard loads without errors
- [ ] All 4 stat cards show numbers
- [ ] Movement table has data
- [ ] All 5 charts display
- [ ] Insights panel shows 4-5 cards
- [ ] Prediction chart shows forecast
- [ ] Filters work in movement table
- [ ] Refresh prediction button works

---

## 💡 Performance Tips

### Speed up data generation:
- Reduce `NUM_HUBS` in generate_dataset.py (default: 30)
- Reduce `NUM_DAYS` (default: 90)
- Reduce vaccination records count (default: 50,000)

### Speed up dashboard loading:
- Backend already caches data in memory
- Charts are optimized with Chart.js
- Tables show only first 20 rows by default

---

## 🆘 Need Help?

1. **Check README.md** - Comprehensive documentation
2. **Check DEMO_SCRIPT.md** - Presentation guidance
3. **Browser Console** (F12) - Check for JavaScript errors
4. **Terminal Output** - Check backend logs for errors
5. **Test API** - Use curl or browser to test endpoints

---

## 🎉 Success Checklist

- [x] Dependencies installed
- [x] Dataset generated (7 CSV files in `data/`)
- [x] Backend running (http://localhost:5000)
- [x] Dashboard showing all features
- [x] Charts rendering correctly
- [x] No errors in console
- [x] API responding to requests

---

**🚀 You're all set! Time to impress with your demo!**

**Questions? Check README.md or DEMO_SCRIPT.md**

---

## 📞 Emergency Demo Mode

If something breaks during demo:

1. **Show the code** - proves you built it
2. **Show the notebook** - shows ML work
3. **Show screenshots** - prepare these beforehand
4. **Explain the concept** - describe what it should do
5. **Show data files** - proves data exists

**Remember: Professors know things can go wrong. Your understanding matters more than perfect execution!**

---

**Last updated:** November 2025
**Project:** E-Vaccination Admin Dashboard
**Status:** Ready for Demo ✅
