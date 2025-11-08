# E-Vaccination API Testing Guide

## Base URL
```
http://localhost:3000
```

## Import Postman Collection
Import the `E-Vaccination-API.postman_collection.json` file into Postman for easy testing.

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are automatically saved to collection variables after login.

---

## 📋 API Endpoints

### 1. User APIs

#### POST `/api/user/signup`
**Description:** Register a new user

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "fatherName": "John Senior",
  "motherName": "Jane Doe",
  "gender": "Male",
  "BirthId": "BD123456789",
  "nationalId": "NID123456",
  "address": {
    "houseOrHoldingNo": "123",
    "villageOrNeighborhood": "Main Street",
    "upazilaOrMunicipality": "Dhaka",
    "districtOrCityCorporation": "Dhaka",
    "unionOrZone": "Zone 1",
    "wardNo": "5"
  }
}
```

**Response:** 201 Created
```json
{
  "statusCode": 201,
  "data": {
    "user": { ... },
    "vaccineRecord": { ... }
  },
  "message": "User registered successfully",
  "success": true
}
```

---

#### POST `/api/user/login`
**Description:** User login

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:** 200 OK
```json
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

---

#### POST `/api/user/logout`
**Description:** User logout (Protected)

**Headers:**
```
Authorization: Bearer <userToken>
```

**Response:** 200 OK

---

### 2. Admin APIs

#### POST `/api/admin/signup`
**Description:** Register a new admin

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone_number": "+1234567891",
  "password": "admin123"
}
```

**Response:** 201 Created

---

#### POST `/api/admin/login`
**Description:** Admin login

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:** 200 OK

---

#### POST `/api/admin/logout`
**Description:** Admin logout (Protected)

**Headers:**
```
Authorization: Bearer <adminToken>
```

---

#### POST `/api/admin/create-staff`
**Description:** Create a new staff member (Protected - Admin only)

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Request Body:**
```json
{
  "name": "Staff Member",
  "phone_number": "+1234567892",
  "email": "staff@example.com",
  "password": "staff123",
  "address": "123 Staff Street"
}
```

**Response:** 201 Created

---

#### POST `/api/admin/update-stock`
**Description:** Add or update vaccine stock (Protected - Admin only)

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Request Body:**
```json
{
  "vaccine_name": "BCG",
  "quantity": 100
}
```

**Response:** 200 OK
```json
{
  "statusCode": 200,
  "data": [
    {
      "vaccine_name": "BCG",
      "total_quantity": 100
    }
  ],
  "message": "Vaccine stock updated successfully",
  "success": true
}
```

---

#### POST `/api/admin/assign-vaccine`
**Description:** Assign vaccine to staff (Protected - Admin only)

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Request Body:**
```json
{
  "staffId": "STAFF_ID_HERE",
  "vaccine_name": "BCG",
  "quantity": 50
}
```

**Response:** 200 OK

---

### 3. Staff APIs

#### POST `/api/staff/login`
**Description:** Staff login

**Request Body:**
```json
{
  "email": "staff@example.com",
  "password": "staff123"
}
```

**Response:** 200 OK

---

#### POST `/api/staff/logout`
**Description:** Staff logout (Protected)

**Headers:**
```
Authorization: Bearer <staffToken>
```

---

#### GET `/api/staff/assigned`
**Description:** Get assigned vaccine information (Protected - Staff only)

**Headers:**
```
Authorization: Bearer <staffToken>
```

**Response:** 200 OK
```json
{
  "statusCode": 200,
  "data": {
    "vaccine_name": "BCG",
    "assigned_quantity": 50,
    "remaining_quantity": 45,
    "wastage_rate": 10,
    "previous_quantity": 50
  },
  "message": "Assigned vaccine details fetched",
  "success": true
}
```

---

#### PATCH `/api/staff/update-quantity`
**Description:** Update remaining vaccine quantity (Protected - Staff only)

**Headers:**
```
Authorization: Bearer <staffToken>
```

**Request Body:**
```json
{
  "newQuantity": 45
}
```

**Response:** 200 OK

---

#### POST `/api/staff/administer`
**Description:** Administer vaccine to a user (Protected - Staff only)

**Headers:**
```
Authorization: Bearer <staffToken>
```

**Request Body:**
```json
{
  "birthId": "BD123456789",
  "vaccine_name": "BCG",
  "date_taken": "2024-01-15",
  "place": "Health Center A",
  "next_dose_date": "2024-02-15"
}
```

**Response:** 200 OK

---

#### GET `/api/staff/stats`
**Description:** Get staff vaccination statistics (Protected - Staff only)

**Headers:**
```
Authorization: Bearer <staffToken>
```

**Response:** 200 OK
```json
{
  "statusCode": 200,
  "data": {
    "vaccine_name": "BCG",
    "total_assigned": 50,
    "remaining": 45,
    "vaccinated_users": 5,
    "wastage_percentage": "10.00%"
  },
  "message": "Staff vaccination stats fetched successfully",
  "success": true
}
```

---

### 4. Vaccine APIs

#### POST `/api/vaccine/first-dose`
**Description:** Schedule first vaccine dose (Protected - User only)

**Headers:**
```
Authorization: Bearer <userToken>
```

**Request Body:**
```json
{
  "birthId": "BD123456789",
  "vaccine_name": "BCG",
  "date_taken": "2024-01-15",
  "place": "Health Center A"
}
```

**Response:** 200 OK

---

#### POST `/api/vaccine/next-dose`
**Description:** Schedule next vaccine dose (Protected - User only)

**Headers:**
```
Authorization: Bearer <userToken>
```

**Request Body:**
```json
{
  "birthId": "BD123456789",
  "vaccine_name": "BCG",
  "next_dose_date": "2024-02-15",
  "place": "Health Center A"
}
```

**Response:** 200 OK

---

## 🧪 Testing Workflow

### 1. Setup
1. Start the server: `npm run dev`
2. Ensure MongoDB is connected
3. Import Postman collection

### 2. Test User Flow
1. **User Signup** → Get user account
2. **User Login** → Token saved automatically
3. **Schedule First Dose** → User schedules vaccination
4. **Schedule Next Dose** → User schedules follow-up
5. **User Logout** → End session

### 3. Test Admin Flow
1. **Admin Signup** → Create admin account
2. **Admin Login** → Token saved automatically
3. **Update Vaccine Stock** → Add vaccines to inventory
4. **Create Staff** → Create staff member
5. **Assign Vaccine to Staff** → Distribute vaccines to staff
6. **Admin Logout** → End session

### 4. Test Staff Flow
1. **Staff Login** → Token saved automatically
2. **Get Assigned Vaccine** → View assigned vaccines
3. **Administer Vaccine** → Record vaccination
4. **Update Remaining Quantity** → Update stock
5. **Get Staff Stats** → View statistics
6. **Staff Logout** → End session

---

## ⚠️ Common Errors

### 401 Unauthorized
- Missing or invalid token
- Token expired
- **Solution:** Login again to get a new token

### 400 Bad Request
- Missing required fields
- Invalid data format
- **Solution:** Check request body matches the schema

### 404 Not Found
- Resource doesn't exist
- **Solution:** Verify IDs and data exist in database

### 500 Internal Server Error
- Server-side error
- **Solution:** Check server logs and database connection

---

## 📝 Notes

- All dates should be in ISO format: `YYYY-MM-DD`
- Tokens are automatically saved to Postman collection variables
- Use the saved tokens in Authorization headers for protected routes
- Ensure MongoDB is running and connected
- Check `.env` file for required environment variables:
  - `MONGO_DB_URI`
  - `ACCESS_TOKEN_SECRET`
  - `REFRESH_TOKEN_SECRET`
  - `ACCESS_TOKEN_EXPIRY`
  - `REFRESH_TOKEN_EXPIRY`
  - `PORT` (optional, defaults to 3000)

---

## ✅ Success Response Format
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

## ❌ Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

