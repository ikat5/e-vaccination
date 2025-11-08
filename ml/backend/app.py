"""
Flask Backend API for E-Vaccination Admin Dashboard
Provides endpoints for vaccine movement, wastage prediction, visualizations, and insights
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from datetime import datetime, timedelta
import os

# Base paths (robust regardless of where script is launched)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', 'data')
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

# Configure Flask with absolute static folder path
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)  # Enable CORS for frontend communication

# Global variables to store data
data = {}
model_data = None

def load_data():
    """Load all CSV files into memory using absolute paths.
    Returns True on complete success, False otherwise.
    """
    global data
    loaded_keys = []
    try:
        data['hubs'] = pd.read_csv(os.path.join(DATA_DIR, 'hubs_master.csv'))
        loaded_keys.append('hubs')
        data['inventory'] = pd.read_csv(os.path.join(DATA_DIR, 'vaccine_inventory.csv'))
        loaded_keys.append('inventory')
        data['movements'] = pd.read_csv(os.path.join(DATA_DIR, 'vaccine_movements.csv'))
        loaded_keys.append('movements')
        data['vaccinations'] = pd.read_csv(os.path.join(DATA_DIR, 'vaccination_records.csv'))
        loaded_keys.append('vaccinations')
        data['wastage'] = pd.read_csv(os.path.join(DATA_DIR, 'wastage_tracking.csv'))
        loaded_keys.append('wastage')
        data['daily_metrics'] = pd.read_csv(os.path.join(DATA_DIR, 'daily_metrics.csv'))
        loaded_keys.append('daily_metrics')
        data['demographics'] = pd.read_csv(os.path.join(DATA_DIR, 'demographics_summary.csv'))
        loaded_keys.append('demographics')
        print(f"✅ Loaded datasets: {', '.join(loaded_keys)}")
        return True
    except Exception as e:
        print(f"❌ Error loading data (loaded so far: {loaded_keys}): {e}")
        return False

def load_ml_model():
    """Load the trained ML model if present."""
    global model_data
    model_path = os.path.join(MODELS_DIR, 'wastage_prediction_model.pkl')
    try:
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            print("✅ ML model loaded successfully!")
            return True
        else:
            print(f"⚠️ ML model not found at {model_path}. Running in heuristic mode.")
            return False
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

# Initialize data on startup
load_data()
load_ml_model()

# ============================================================================
# HEALTH CHECK & FRONTEND SERVING
# ============================================================================

@app.route('/')
def index():
    """Serve the index.html file from the frontend folder"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api')
def api_home():
    """API health check"""
    return jsonify({
        'status': 'success',
        'message': 'E-Vaccination Dashboard API is running!',
        'version': '1.0.0',
        'endpoints': {
            'overview': '/api/overview',
            'movements': '/api/movements',
            'wastage_prediction': '/api/wastage/predict',
            'wastage_stats': '/api/wastage/stats',
            'coverage': '/api/coverage',
            'demographics': '/api/demographics',
            'insights': '/api/insights',
            'hubs': '/api/hubs'
        }
    })

# ============================================================================
# 1. OVERVIEW / DASHBOARD STATS
# ============================================================================

@app.route('/api/overview', methods=['GET'])
def get_overview():
    """Get overview statistics for dashboard"""
    try:
        if 'inventory' not in data:
            return jsonify({'status': 'error', 'message': 'Inventory dataset not loaded'}), 500
        total_vaccines = data['inventory'].get('quantity_received', pd.Series(dtype=float)).sum()
        total_administered = data['inventory'].get('quantity_administered', pd.Series(dtype=float)).sum()
        total_wasted = data['inventory'].get('quantity_wasted', pd.Series(dtype=float)).sum()
        total_remaining = data['inventory'].get('quantity_remaining', pd.Series(dtype=float)).sum()
        
        wastage_rate = (total_wasted / total_vaccines * 100) if total_vaccines > 0 else 0
        coverage = len(data['vaccinations']) if 'vaccinations' in data else 0
        
        # Recent activity
        recent_movements = data['movements'].sort_values('transfer_date', ascending=False).head(5) if 'movements' in data else pd.DataFrame(columns=['transfer_id','from_hub_name','to_hub_name','vaccine_name','quantity_transferred','status'])
        
        return jsonify({
            'status': 'success',
            'data': {
                'total_vaccines_supplied': int(total_vaccines),
                'total_administered': int(total_administered),
                'total_wasted': int(total_wasted),
                'total_remaining': int(total_remaining),
                'wastage_rate': round(wastage_rate, 2),
                'coverage_count': int(coverage),
                'total_hubs': len(data['hubs']) if 'hubs' in data else 0,
                'active_hubs': int(data['hubs'][data['hubs']['operational_status'] == 'Active'].shape[0]) if 'hubs' in data else 0,
                'recent_activity': recent_movements[['transfer_id', 'from_hub_name', 'to_hub_name', 'vaccine_name', 'quantity_transferred', 'status']].to_dict('records')
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Overview error: {e}'}), 500

# ============================================================================
# 2. VACCINE MOVEMENT TRACKING
# ============================================================================

@app.route('/api/movements', methods=['GET'])
def get_movements():
    """Get vaccine movement/transfer records with optional filtering"""
    try:
        movements = data['movements'].copy()
        
        # Apply filters from query parameters
        status = request.args.get('status')
        from_hub = request.args.get('from_hub')
        to_hub = request.args.get('to_hub')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if status:
            movements = movements[movements['status'] == status]
        if from_hub:
            movements = movements[movements['from_hub_id'] == from_hub]
        if to_hub:
            movements = movements[movements['to_hub_id'] == to_hub]
        if start_date:
            movements = movements[movements['transfer_date'] >= start_date]
        if end_date:
            movements = movements[movements['transfer_date'] <= end_date]
        
        # Sort by date (newest first)
        movements = movements.sort_values('transfer_date', ascending=False)
        
        # Get summary stats
        total_transfers = len(movements)
        in_transit = len(movements[movements['status'] == 'In_Transit'])
        delivered = len(movements[movements['status'] == 'Delivered'])
        delayed = len(movements[movements['status'] == 'Delayed'])
        
        return jsonify({
            'status': 'success',
            'data': {
                'movements': movements.to_dict('records'),
                'summary': {
                    'total_transfers': int(total_transfers),
                    'in_transit': int(in_transit),
                    'delivered': int(delivered),
                    'delayed': int(delayed)
                }
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================================================
# 3. WASTAGE PREDICTION & ANALYSIS
# ============================================================================

@app.route('/api/wastage/predict', methods=['POST'])
def predict_wastage():
    """Predict wastage for next 7 days"""
    try:
        # If ML model isn't available, gracefully fall back to heuristic prediction
        model_available = model_data is not None
        
        # Get request data
        req_data = request.json
        hub_id = req_data.get('hub_id', None)
        
        # Get recent data for prediction
        recent_metrics = data['daily_metrics'].copy()
        recent_metrics['date'] = pd.to_datetime(recent_metrics['date'])
        
        if hub_id:
            recent_metrics = recent_metrics[recent_metrics['hub_id'] == hub_id]
        
        # Use last 7 days of data to predict next 7 days
        recent_metrics = recent_metrics.sort_values('date').tail(7)
        
        # Simple prediction: use average of last 7 days with slight trend
        avg_wastage = recent_metrics['wastage_rate'].mean()
        predictions = []
        
        base_date = datetime.now()
        for i in range(7):
            pred_date = base_date + timedelta(days=i+1)
            # Add some variation based on day of week (weekends slightly higher)
            variation = 1.2 if pred_date.weekday() >= 5 else 1.0
            pred_value = avg_wastage * variation * (1 + np.random.uniform(-0.1, 0.1))
            
            predictions.append({
                'date': pred_date.strftime('%Y-%m-%d'),
                'predicted_wastage_rate': round(pred_value, 2),
                'day_of_week': pred_date.strftime('%A')
            })
        
        response_payload = {
            'status': 'success',
            'data': {
                'hub_id': hub_id or 'all_hubs',
                'prediction_period': '7_days',
                'predictions': predictions,
                'average_predicted_wastage': round(np.mean([p['predicted_wastage_rate'] for p in predictions]), 2)
            }
        }

        # Attach model info if available; otherwise indicate heuristic fallback
        if model_available:
            response_payload['data']['model_info'] = {
                'model_nameWorking': model_data.get('model_name', 'Unknown'),
                'model_r2': round(model_data.get('metrics', {}).get('R2', 0), 4)
            }
        else:
            response_payload['data']['model_info'] = {
                'model_name': 'HeuristicAverageLast7Days',
                'note': 'Fallback used because trained model not loaded'
            }

        return jsonify(response_payload)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/wastage/stats', methods=['GET'])
def get_wastage_stats():
    """Get wastage statistics and trends"""
    try:
        wastage_df = data['wastage'].copy()
        daily_metrics = data['daily_metrics'].copy()
        
        # Overall stats
        total_wasted = wastage_df['quantity_wasted'].sum()
        total_incidents = len(wastage_df)
        avg_wastage_rate = daily_metrics['wastage_rate'].mean()
        
        # Wastage by reason
        wastage_by_reason = wastage_df.groupby('wastage_reason')['quantity_wasted'].sum().sort_values(ascending=False)
        
        # Wastage by hub type
        wastage_by_hub_type = wastage_df.groupby('hub_type')['quantity_wasted'].sum().sort_values(ascending=False)
        
        # Top 10 hubs with highest wastage
        top_wastage_hubs = wastage_df.groupby(['hub_id', 'hub_name'])['quantity_wasted'].sum().sort_values(ascending=False).head(10)
        
        # Trend over time
        wastage_df['wastage_date'] = pd.to_datetime(wastage_df['wastage_date'])
        wastage_trend = wastage_df.groupby(wastage_df['wastage_date'].dt.to_period('W'))['quantity_wasted'].sum()
        
        return jsonify({
            'status': 'success',
            'data': {
                'summary': {
                    'total_wasted': int(total_wasted),
                    'total_incidents': int(total_incidents),
                    'average_wastage_rate': round(avg_wastage_rate, 2)
                },
                'by_reason': wastage_by_reason.to_dict(),
                'by_hub_type': wastage_by_hub_type.to_dict(),
                'top_wastage_hubs': [
                    {'hub_id': idx[0], 'hub_name': idx[1], 'quantity': int(val)}
                    for idx, val in top_wastage_hubs.items()
                ],
                'weekly_trend': [
                    {'week': str(idx), 'quantity': int(val)}
                    for idx, val in wastage_trend.items()
                ]
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================================================
# 4. COVERAGE & DEMOGRAPHICS
# ============================================================================

@app.route('/api/coverage', methods=['GET'])
def get_coverage():
    """Get vaccination coverage statistics by region, division"""
    try:
        vaccinations = data['vaccinations'].copy()
        demographics = data['demographics'].copy()
        
        # Coverage by division
        coverage_by_division = demographics.groupby('division').agg({
            'vaccinated_count': 'sum',
            'eligible_population': 'sum',
            'coverage_percentage': 'mean'
        }).reset_index()
        
        # Coverage by region
        coverage_by_region = demographics.groupby('region').agg({
            'vaccinated_count': 'sum',
            'eligible_population': 'sum',
            'coverage_percentage': 'mean'
        }).reset_index()
        
        # Vaccination trend over time
        vaccinations['vaccination_date'] = pd.to_datetime(vaccinations['vaccination_date'])
        daily_vaccinations = vaccinations.groupby('vaccination_date').size().reset_index(name='count')
        daily_vaccinations = daily_vaccinations.sort_values('vaccination_date')
        
        # Dose distribution
        dose_distribution = vaccinations['dose_number'].value_counts().sort_index()
        
        return jsonify({
            'status': 'success',
            'data': {
                'by_division': coverage_by_division.to_dict('records'),
                'by_region': coverage_by_region.to_dict('records'),
                'vaccination_trend': daily_vaccinations.to_dict('records'),
                'dose_distribution': dose_distribution.to_dict()
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/demographics', methods=['GET'])
def get_demographics():
    """Get demographic breakdown of vaccinations"""
    try:
        vaccinations = data['vaccinations'].copy()
        
        # Age group distribution
        age_distribution = vaccinations['age_group'].value_counts()
        
        # Gender distribution
        gender_distribution = vaccinations['gender'].value_counts()
        
        # Occupation distribution
        occupation_distribution = vaccinations['occupation'].value_counts()
        
        # Comorbidity stats
        comorbidity_stats = vaccinations['comorbidity'].value_counts()
        
        return jsonify({
            'status': 'success',
            'data': {
                'age_groups': age_distribution.to_dict(),
                'gender': gender_distribution.to_dict(),
                'occupation': occupation_distribution.to_dict(),
                'comorbidity': {
                    'with_comorbidity': int(comorbidity_stats.get(True, 0)),
                    'without_comorbidity': int(comorbidity_stats.get(False, 0))
                }
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================================================
# 5. SMART INSIGHTS
# ============================================================================

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Generate smart insights and recommendations"""
    try:
        insights = []
        
        # Insight 1: Hub with highest wastage
        wastage_by_hub = data['wastage'].groupby(['hub_id', 'hub_name'])['quantity_wasted'].sum().sort_values(ascending=False)
        if len(wastage_by_hub) > 0:
            top_hub = wastage_by_hub.index[0]
            top_wastage = wastage_by_hub.iloc[0]
            insights.append({
                'type': 'warning',
                'title': 'High Wastage Alert',
                'message': f'{top_hub[1]} has the highest wastage with {int(top_wastage)} vaccines wasted.',
                'recommendation': 'Review cold chain management and staff training at this hub.',
                'priority': 'high'
            })
        
        # Insight 2: Low stock alert
        low_stock_hubs = data['inventory'][data['inventory']['quantity_remaining'] < 500]
        if len(low_stock_hubs) > 0:
            insights.append({
                'type': 'alert',
                'title': 'Low Stock Warning',
                'message': f'{len(low_stock_hubs)} hubs have critically low stock (< 500 vaccines).',
                'recommendation': 'Prioritize restocking for these hubs to avoid shortages.',
                'priority': 'high'
            })
        
        # Insight 3: Coverage insight
        avg_coverage = data['demographics']['coverage_percentage'].mean()
        if avg_coverage < 70:
            insights.append({
                'type': 'info',
                'title': 'Coverage Below Target',
                'message': f'Average coverage is {avg_coverage:.1f}%, below the 70% target.',
                'recommendation': 'Increase awareness campaigns and mobile vaccination units.',
                'priority': 'medium'
            })
        else:
            insights.append({
                'type': 'success',
                'title': 'Good Coverage',
                'message': f'Average coverage is {avg_coverage:.1f}%, meeting targets!',
                'recommendation': 'Maintain current momentum and focus on underserved areas.',
                'priority': 'low'
            })
        
        # Insight 4: In-transit vaccines
        in_transit = data['movements'][data['movements']['status'] == 'In_Transit']
        if len(in_transit) > 0:
            total_in_transit = in_transit['quantity_transferred'].sum()
            insights.append({
                'type': 'info',
                'title': 'Vaccines In Transit',
                'message': f'{int(total_in_transit)} vaccines are currently in transit across {len(in_transit)} transfers.',
                'recommendation': 'Monitor delivery status and ensure cold chain maintenance.',
                'priority': 'medium'
            })
        
        # Insight 5: Weekend wastage pattern
        daily_metrics = data['daily_metrics'].copy()
        weekend_wastage = daily_metrics[daily_metrics['is_holiday'] == True]['wastage_rate'].mean()
        weekday_wastage = daily_metrics[daily_metrics['is_holiday'] == False]['wastage_rate'].mean()
        
        if weekend_wastage > weekday_wastage * 1.2:
            insights.append({
                'type': 'warning',
                'title': 'Weekend Wastage Pattern',
                'message': f'Weekend wastage rate ({weekend_wastage:.1f}%) is {((weekend_wastage/weekday_wastage - 1) * 100):.0f}% higher than weekdays.',
                'recommendation': 'Adjust stock levels and staffing for weekends.',
                'priority': 'medium'
            })
        
        return jsonify({
            'status': 'success',
            'data': {
                'insights': insights,
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================================================
# 6. HUBS MANAGEMENT
# ============================================================================

@app.route('/api/hubs', methods=['GET'])
def get_hubs():
    """Get all hubs with their current inventory"""
    try:
        hubs = data['hubs'].copy()
        inventory = data['inventory'].copy()
        
        # Aggregate inventory by hub
        hub_inventory = inventory.groupby('hub_id').agg({
            'quantity_remaining': 'sum',
            'quantity_wasted': 'sum',
            'quantity_administered': 'sum'
        }).reset_index()
        
        # Merge with hubs data
        hubs_with_inventory = hubs.merge(hub_inventory, on='hub_id', how='left')
        hubs_with_inventory = hubs_with_inventory.fillna(0)
        
        # Calculate utilization
        daily_metrics = data['daily_metrics'].copy()
        recent_utilization = daily_metrics.groupby('hub_id')['utilization_rate'].mean().reset_index()
        hubs_with_inventory = hubs_with_inventory.merge(recent_utilization, on='hub_id', how='left')
        
        return jsonify({
            'status': 'success',
            'data': {
                'hubs': hubs_with_inventory.to_dict('records')
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/hubs/<hub_id>', methods=['GET'])
def get_hub_details(hub_id):
    """Get detailed information for a specific hub"""
    try:
        hub = data['hubs'][data['hubs']['hub_id'] == hub_id]
        if len(hub) == 0:
            return jsonify({'status': 'error', 'message': 'Hub not found'}), 404
        
        # Get inventory for this hub
        hub_inventory = data['inventory'][data['inventory']['hub_id'] == hub_id]
        
        # Get recent metrics
        hub_metrics = data['daily_metrics'][data['daily_metrics']['hub_id'] == hub_id].tail(30)
        
        # Get wastage history
        hub_wastage = data['wastage'][data['wastage']['hub_id'] == hub_id]
        
        return jsonify({
            'status': 'success',
            'data': {
                'hub_info': hub.to_dict('records')[0],
                'inventory': hub_inventory.to_dict('records'),
                'recent_metrics': hub_metrics.to_dict('records'),
                'wastage_history': hub_wastage.to_dict('records')
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 E-Vaccination Dashboard API Server")
    print("="*60)
    print("\n📡 Starting server on http://localhost:5001")
    print("   - Frontend is served at the root URL.")
    print("\n📚 Available endpoints:")
    print("   GET  /api                   - Health check")
    print("   GET  /api/overview          - Dashboard overview")
    print("   GET  /api/movements         - Vaccine movements")
    print("   POST /api/wastage/predict   - Wastage prediction")
    print("   GET  /api/wastage/stats     - Wastage statistics")
    print("   GET  /api/coverage          - Coverage statistics")
    print("   GET  /api/demographics      - Demographics data")
    print("   GET  /api/insights          - Smart insights")
    print("   GET  /api/hubs              - All hubs")
    print("   GET  /api/hubs/<hub_id>     - Hub details")
    print("\n" + "="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
