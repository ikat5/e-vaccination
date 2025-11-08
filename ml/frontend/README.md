# E-Vaccination Admin Dashboard - Frontend

## 🎨 New Unified Dashboard (November 7, 2025)

A modern, clean admin dashboard with **authoritative green** and **critical red** color scheme for the national e-Vaccination portal.

### ✨ Features

#### Visual Design
- **Green** (#1e8449): Positive indicators, completed actions, good metrics
- **Red** (#c0392b): Critical alerts, wastage, warnings, low stock
- Clean white backgrounds with soft gray accents
- Professional medical aesthetic
- Responsive grid layouts

#### Dashboard Components

1. **Stat Cards** (Top Row)
   - Total Vaccines Supplied (green)
   - Total Administered (green)
   - Wastage Rate (red - critical monitoring)
   - Active Hubs (blue - informational)

2. **Interactive Charts** (Grid Layout)
   - **Coverage by Division**: Bar chart showing vaccination coverage %
   - **Age Group Distribution**: Doughnut chart of demographics
   - **Wastage Reasons**: Pie chart analyzing wastage causes
   - **Vaccination Trend**: Line graph of last 30 days
   - **Smart Insights**: AI-powered recommendations with color-coded alerts
   - **Wastage Prediction**: 7-day forecast with ML model

3. **Data Table**
   - Recent vaccine movements between hubs
   - Status badges (delivered/in-transit/delayed)
   - Real-time updates

#### Left Sidebar Navigation
- Dashboard Overview (active)
- Center & Slots
- Vaccine Inventory
- Staff Administration

#### Top Header
- Global search bar (green focus state)
- Notification bell (flashing red when critical alerts exist)

### 🚀 Usage

1. **Start Backend**:
   ```bash
   cd /home/stoic/Desktop/e-vaccination
   python3 ml/backend/app.py
   ```

2. **Access Dashboard**:
   - Open browser: `http://localhost:5001`
   - All charts load automatically
   - Data refreshes from Flask API

### 📊 API Integration

The dashboard fetches data from these endpoints:
- `GET /api/overview` - Main statistics
- `GET /api/coverage` - Coverage by division & trends
- `GET /api/demographics` - Age/gender distribution
- `GET /api/wastage/stats` - Wastage analysis
- `POST /api/wastage/predict` - ML predictions
- `GET /api/insights` - Smart recommendations
- `GET /api/movements` - Vaccine transfers

### 🎨 Color Semantics

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#1e8449` | Success, positive metrics, active states |
| Green Light | `#d5f4e6` | Hover states, backgrounds |
| Critical Red | `#c0392b` | Warnings, wastage, alerts |
| Red Light | `#fadbd8` | Alert backgrounds |
| Info Blue | `#3498db` | Informational stats |
| Soft Gray | `#f8f9fa` | Backgrounds, borders |

### 📁 Files

- `index.html` - Main dashboard (NEW - November 7, 2025)
- `index-old-backup.html` - Previous version (backup)
- `dashboard-legacy-backup.html` - Original analytics dashboard (backup)

### 🔧 Key Improvements

1. **Unified Design**: Single page with all functionality
2. **Working Charts**: All 6 charts render with real data
3. **Color Consistency**: Green/red theme throughout
4. **Port Fix**: Configured for port 5001 (matches backend)
5. **Hover Effects**: Cards lift and shadow on hover
6. **Responsive**: Works on different screen sizes
7. **Loading States**: Smooth spinners while data loads

### 🎯 Status Indicators

- **Green Border/Text**: Positive/successful/active
- **Red Border/Text**: Critical/warning/needs attention
- **Blue Border/Text**: Informational/neutral

### ⚡ Performance

- Charts render in ~200ms
- API calls parallelized
- Smooth animations (CSS transitions)
- Minimal dependencies (only Chart.js)

---

**Note**: Old files are preserved as backups. The new `index.html` is the active dashboard served at the root URL.
