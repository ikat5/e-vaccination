"""
Synthetic Dataset Generator for E-Vaccination Admin Dashboard
Generates realistic vaccination data including hubs, inventory, movements, vaccinations, and wastage
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import uuid

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Configuration
NUM_HUBS = 30
NUM_DAYS = 90  # 3 months of data
START_DATE = datetime(2024, 8, 1)
END_DATE = START_DATE + timedelta(days=NUM_DAYS)

# Constants - Bangladesh Context
DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh']
DISTRICTS = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Manikganj'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Comilla', 'Feni', 'Noakhali'],
    'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Natore', 'Sirajganj'],
    'Khulna': ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Kushtia'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Barisal': ['Barisal', 'Patuakhali', 'Barguna', 'Jhalokati', 'Pirojpur'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Thakurgaon', 'Panchagarh', 'Nilphamari'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
}
VACCINE_TYPES = ['Covishield', 'Sinopharm', 'Moderna', 'Pfizer']  # Vaccines used in Bangladesh
HUB_TYPES = ['Division_Hub', 'District_Center', 'Upazila_Health_Complex', 'Community_Clinic']
WASTAGE_REASONS = ['Expired', 'Breakage', 'Load_Shedding', 'Open_Vial_Wastage', 'Contamination', 'Flood_Damage']
AGE_GROUPS = ['18-30', '30-45', '45-60', '60+']
GENDERS = ['Male', 'Female', 'Other']
OCCUPATIONS = ['Healthcare', 'RMG_Worker', 'Farmer', 'Teacher', 'Student', 'Rickshaw_Puller', 'Other']
REGIONS = ['North', 'South', 'East', 'West', 'Central']

print("🚀 Starting synthetic dataset generation...")

# ============================================================================
# 1. HUB/CENTER MASTER TABLE
# ============================================================================
print("\n📍 Generating Hub/Center Master data...")

hubs = []
for i in range(NUM_HUBS):
    division = random.choice(DIVISIONS)
    district = random.choice(DISTRICTS[division])
    hub_type = random.choice(HUB_TYPES)
    
    # Division hubs have higher capacity
    if hub_type == 'Division_Hub':
        capacity = random.randint(800, 1500)
        storage = random.randint(20000, 80000)
    elif hub_type == 'District_Center':
        capacity = random.randint(300, 800)
        storage = random.randint(8000, 20000)
    elif hub_type == 'Upazila_Health_Complex':
        capacity = random.randint(100, 300)
        storage = random.randint(2000, 8000)
    else:  # Community_Clinic
        capacity = random.randint(30, 100)
        storage = random.randint(500, 2000)
    
    hub = {
        'hub_id': f'HUB_{i+1:03d}',
        'hub_name': f'{district} {hub_type} {i+1}',
        'hub_type': hub_type,
        'division': division,
        'district': district,
        'region': random.choice(REGIONS),
        'capacity_per_day': capacity,
        'storage_capacity': storage,
        'population_coverage': random.randint(20000, 200000),
        'latitude': round(random.uniform(20.5, 26.6), 6),  # Bangladesh latitude range
        'longitude': round(random.uniform(88.0, 92.7), 6),  # Bangladesh longitude range
        'operational_status': random.choice(['Active', 'Active', 'Active', 'Inactive']),  # 75% active
        'staff_count': random.randint(3, 25),
        'cold_chain_available': random.choice([True, True, False, False]),  # 50% have cold chain (realistic for Bangladesh)
        'backup_generator': random.choice([True, True, False])  # Load shedding is common
    }
    hubs.append(hub)

hubs_df = pd.DataFrame(hubs)
print(f"✅ Generated {len(hubs_df)} hubs")

# ============================================================================
# 2. VACCINE INVENTORY TABLE
# ============================================================================
print("\n💉 Generating Vaccine Inventory data...")

inventory = []
for hub in hubs:
    # Each hub has 2-3 vaccine types
    num_vaccines = random.randint(2, 3)
    selected_vaccines = random.sample(VACCINE_TYPES, num_vaccines)
    
    for vaccine in selected_vaccines:
        # Generate 2-3 batches per vaccine per hub
        for batch in range(random.randint(2, 3)):
            received_date = START_DATE + timedelta(days=random.randint(0, 60))
            quantity_received = random.randint(1000, 10000)
            quantity_administered = random.randint(int(quantity_received * 0.5), int(quantity_received * 0.8))
            quantity_wasted = random.randint(int(quantity_received * 0.02), int(quantity_received * 0.1))
            quantity_remaining = quantity_received - quantity_administered - quantity_wasted
            
            inv = {
                'inventory_id': str(uuid.uuid4())[:8],
                'hub_id': hub['hub_id'],
                'hub_name': hub['hub_name'],
                'hub_type': hub['hub_type'],
                'region': hub['region'],
                'division': hub['division'],
                'district': hub['district'],
                'vaccine_name': vaccine,
                'vaccine_batch_id': f'BATCH_{vaccine[:3].upper()}_{random.randint(1000, 9999)}',
                'quantity_received': quantity_received,
                'quantity_remaining': max(0, quantity_remaining),
                'quantity_wasted': quantity_wasted,
                'quantity_administered': quantity_administered,
                'received_date': received_date.strftime('%Y-%m-%d'),
                'expiry_date': (received_date + timedelta(days=random.randint(180, 365))).strftime('%Y-%m-%d'),
                'storage_temperature': round(random.uniform(2.0, 8.0), 1),
                'last_updated': (END_DATE - timedelta(days=random.randint(0, 7))).strftime('%Y-%m-%d %H:%M:%S')
            }
            inventory.append(inv)

inventory_df = pd.DataFrame(inventory)
print(f"✅ Generated {len(inventory_df)} inventory records")

# ============================================================================
# 3. VACCINE MOVEMENT/TRANSFER TABLE
# ============================================================================
print("\n🚚 Generating Vaccine Movement data...")

movements = []
distribution_hubs = [h for h in hubs if h['hub_type'] == 'Division_Hub']
other_centers = [h for h in hubs if h['hub_type'] != 'Division_Hub']

# Generate transfers from division hubs to centers
for _ in range(150):  # 150 transfers over 3 months
    from_hub = random.choice(distribution_hubs)
    to_hub = random.choice(other_centers)
    
    # Prefer same division transfers (common in Bangladesh)
    if random.random() < 0.7:
        to_hub = random.choice([h for h in other_centers if h['division'] == from_hub['division']] or other_centers)
    
    transfer_date = START_DATE + timedelta(days=random.randint(0, NUM_DAYS - 10))
    expected_delivery = transfer_date + timedelta(days=random.randint(1, 3))
    
    # 80% delivered on time, 15% delayed, 5% in transit
    status_rand = random.random()
    if status_rand < 0.80:
        status = 'Delivered'
        actual_delivery = expected_delivery + timedelta(days=random.randint(-1, 1))
    elif status_rand < 0.95:
        status = 'Delayed'
        actual_delivery = expected_delivery + timedelta(days=random.randint(2, 7))
    else:
        status = 'In_Transit'
        actual_delivery = None
    
    movement = {
        'transfer_id': str(uuid.uuid4())[:8],
        'from_hub_id': from_hub['hub_id'],
        'from_hub_name': from_hub['hub_name'],
        'to_hub_id': to_hub['hub_id'],
        'to_hub_name': to_hub['hub_name'],
        'vaccine_name': random.choice(VACCINE_TYPES),
        'batch_id': f'BATCH_{random.choice(VACCINE_TYPES)[:3].upper()}_{random.randint(1000, 9999)}',
        'quantity_transferred': random.randint(500, 5000),
        'transfer_date': transfer_date.strftime('%Y-%m-%d'),
        'expected_delivery_date': expected_delivery.strftime('%Y-%m-%d'),
        'actual_delivery_date': actual_delivery.strftime('%Y-%m-%d') if actual_delivery else None,
        'status': status,
        'transport_mode': random.choice(['Cold_Chain_Truck', 'Cold_Chain_Truck', 'Air']),
        'distance_km': round(random.uniform(10, 500), 2)
    }
    movements.append(movement)

movements_df = pd.DataFrame(movements)
print(f"✅ Generated {len(movements_df)} movement records")

# ============================================================================
# 4. VACCINATION RECORDS TABLE
# ============================================================================
print("\n💉 Generating Vaccination Records...")

vaccinations = []
# Generate 50,000 vaccination records
for _ in range(50000):
    hub = random.choice(hubs)
    vaccination_date = START_DATE + timedelta(days=random.randint(0, NUM_DAYS))
    
    vax = {
        'vaccination_id': str(uuid.uuid4())[:8],
        'citizen_id': f'CIT_{random.randint(100000, 999999)}',
        'hub_id': hub['hub_id'],
        'hub_name': hub['hub_name'],
        'vaccine_name': random.choice(VACCINE_TYPES),
        'batch_id': f'BATCH_{random.choice(VACCINE_TYPES)[:3].upper()}_{random.randint(1000, 9999)}',
        'dose_number': random.choice([1, 1, 1, 2, 2, 3]),  # More dose 1 & 2
        'vaccination_date': vaccination_date.strftime('%Y-%m-%d'),
        'age_group': random.choice(AGE_GROUPS),
        'gender': random.choice(GENDERS),
        'occupation': random.choice(OCCUPATIONS),
        'comorbidity': random.choice([True, False, False, False]),  # 25% have comorbidity
        'vaccination_status': random.choice(['Completed', 'Completed', 'Partial'])
    }
    vaccinations.append(vax)

vaccinations_df = pd.DataFrame(vaccinations)
print(f"✅ Generated {len(vaccinations_df)} vaccination records")

# ============================================================================
# 5. WASTAGE TRACKING TABLE
# ============================================================================
print("\n🗑️  Generating Wastage Tracking data...")

wastages = []
for _ in range(500):  # 500 wastage incidents
    hub = random.choice(hubs)
    wastage_date = START_DATE + timedelta(days=random.randint(0, NUM_DAYS))
    
    wastage = {
        'wastage_id': str(uuid.uuid4())[:8],
        'hub_id': hub['hub_id'],
        'hub_name': hub['hub_name'],
        'hub_type': hub['hub_type'],
        'vaccine_name': random.choice(VACCINE_TYPES),
        'batch_id': f'BATCH_{random.choice(VACCINE_TYPES)[:3].upper()}_{random.randint(1000, 9999)}',
        'quantity_wasted': random.randint(10, 500),
        'wastage_date': wastage_date.strftime('%Y-%m-%d'),
        'wastage_reason': random.choice(WASTAGE_REASONS),
        'reported_by': f'Staff_{random.randint(1, 100)}',
        'prevention_possible': random.choice([True, False]),
        'cost_impact': round(random.uniform(100, 5000), 2)
    }
    wastages.append(wastage)

wastages_df = pd.DataFrame(wastages)
print(f"✅ Generated {len(wastages_df)} wastage records")

# ============================================================================
# 6. DAILY METRICS TABLE (For ML Training)
# ============================================================================
print("\n📊 Generating Daily Metrics data...")

daily_metrics = []
for hub in hubs:
    current_date = START_DATE
    opening_stock = random.randint(1000, 5000)
    
    while current_date <= END_DATE:
        # Simulate realistic daily operations
        received = random.randint(0, 1000) if random.random() < 0.3 else 0  # Receive stock 30% of days
        
        # Calculate administered quantity (ensure we have enough stock)
        available_stock = opening_stock + received
        max_administered = min(available_stock, hub['capacity_per_day'])
        administered = random.randint(1, max(1, max_administered)) if max_administered > 0 else 0
        
        # Wastage patterns: higher on weekends, higher if no cold chain, load shedding impact
        base_wastage = administered * 0.05  # 5% base wastage rate
        if current_date.weekday() >= 5:  # Weekend
            base_wastage *= 1.5
        if not hub['cold_chain_available']:
            base_wastage *= 2.5  # Higher impact in Bangladesh due to climate
        if not hub.get('backup_generator', False):
            base_wastage *= 1.3  # Load shedding impact
        
        wasted = int(base_wastage + random.randint(-5, 10))
        wasted = max(0, min(wasted, opening_stock + received - administered))
        
        closing_stock = opening_stock + received - administered - wasted
        closing_stock = max(0, closing_stock)
        
        metric = {
            'metric_id': str(uuid.uuid4())[:8],
            'hub_id': hub['hub_id'],
            'hub_name': hub['hub_name'],
            'hub_type': hub['hub_type'],
            'division': hub['division'],
            'district': hub['district'],
            'region': hub['region'],
            'date': current_date.strftime('%Y-%m-%d'),
            'opening_stock': opening_stock,
            'received_quantity': received,
            'administered_quantity': administered,
            'wasted_quantity': wasted,
            'closing_stock': closing_stock,
            'wastage_rate': round(wasted / (administered + wasted) * 100 if (administered + wasted) > 0 else 0, 2),
            'utilization_rate': round(administered / hub['capacity_per_day'] * 100, 2),
            'footfall': administered + random.randint(-10, 20),
            'appointment_count': int(administered * random.uniform(0.6, 0.8)),
            'walk_in_count': int(administered * random.uniform(0.2, 0.4)),
            'temperature_avg': round(random.uniform(25.0, 35.0), 1),  # Bangladesh temperature (Celsius)
            'humidity_avg': round(random.uniform(60, 90), 1),  # High humidity in Bangladesh
            'power_outage_hours': round(random.uniform(0, 4) if random.random() < 0.3 else 0, 1),  # Load shedding
            'day_of_week': current_date.strftime('%A'),
            'is_holiday': current_date.weekday() >= 5,
            'weather_condition': random.choice(['Clear', 'Clear', 'Rainy', 'Rainy', 'Monsoon', 'Extreme_Heat'])  # Bangladesh weather
        }
        daily_metrics.append(metric)
        
        opening_stock = closing_stock
        current_date += timedelta(days=1)

daily_metrics_df = pd.DataFrame(daily_metrics)
print(f"✅ Generated {len(daily_metrics_df)} daily metric records")

# ============================================================================
# 7. DEMOGRAPHICS SUMMARY TABLE
# ============================================================================
print("\n👥 Generating Demographics Summary...")

demographics = []
for division in DIVISIONS:
    for region in REGIONS:
        total_pop = random.randint(1000000, 5000000)  # Bangladesh has higher population density
        eligible = int(total_pop * 0.70)  # 70% eligible for vaccination
        vaccinated = int(eligible * random.uniform(0.5, 0.85))  # 50-85% coverage
        
        demo = {
            'summary_id': str(uuid.uuid4())[:8],
            'division': division,
            'region': region,
            'date': END_DATE.strftime('%Y-%m-%d'),
            'total_population': total_pop,
            'eligible_population': eligible,
            'vaccinated_count': vaccinated,
            'coverage_percentage': round(vaccinated / eligible * 100, 2),
            'age_18_30_pct': round(random.uniform(30, 40), 2),  # Younger population
            'age_30_45_pct': round(random.uniform(25, 35), 2),
            'age_45_60_pct': round(random.uniform(15, 25), 2),
            'age_60_plus_pct': round(random.uniform(10, 15), 2),
            'male_pct': round(random.uniform(49, 52), 2),
            'female_pct': round(random.uniform(47, 50), 2),
            'other_pct': round(random.uniform(0.5, 1.5), 2)
        }
        demographics.append(demo)

demographics_df = pd.DataFrame(demographics)
print(f"✅ Generated {len(demographics_df)} demographic records")

# ============================================================================
# SAVE ALL DATASETS TO CSV
# ============================================================================
print("\n💾 Saving datasets to CSV files...")

import os
os.makedirs('data', exist_ok=True)

hubs_df.to_csv('data/hubs_master.csv', index=False)
inventory_df.to_csv('data/vaccine_inventory.csv', index=False)
movements_df.to_csv('data/vaccine_movements.csv', index=False)
vaccinations_df.to_csv('data/vaccination_records.csv', index=False)
wastages_df.to_csv('data/wastage_tracking.csv', index=False)
daily_metrics_df.to_csv('data/daily_metrics.csv', index=False)
demographics_df.to_csv('data/demographics_summary.csv', index=False)

print("\n✅ All datasets saved successfully!")
print("\n📁 Generated files:")
print("   - data/hubs_master.csv")
print("   - data/vaccine_inventory.csv")
print("   - data/vaccine_movements.csv")
print("   - data/vaccination_records.csv")
print("   - data/wastage_tracking.csv")
print("   - data/daily_metrics.csv")
print("   - data/demographics_summary.csv")

# Print summary statistics
print("\n📈 Dataset Summary:")
print(f"   Total Hubs: {len(hubs_df)}")
print(f"   Total Inventory Records: {len(inventory_df)}")
print(f"   Total Vaccine Movements: {len(movements_df)}")
print(f"   Total Vaccinations: {len(vaccinations_df)}")
print(f"   Total Wastage Incidents: {len(wastages_df)}")
print(f"   Total Daily Metrics: {len(daily_metrics_df)}")
print(f"   Total Demographics Records: {len(demographics_df)}")
print("\n🎉 Dataset generation complete!")
