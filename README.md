# 🚗 Car Value API

A REST API for car price estimation built with **NestJS**, **TypeORM**, and **SQLite**.

## 📋 Description

This application allows users to:
- 👥 **Register and authenticate** with cookie-based sessions
- 📊 **Create car sale reports** with details (make, model, year, price, location, mileage)
- 🔍 **Get price estimates** based on similar reports
- 👨‍💼 **Manage reports** (only administrators can approve reports)

## 🏗️ Architecture and NestJS Concepts

### 🏢 **Modules**
```
AppModule (root)
├── UserModule (authentication and users)
└── ReportModule (vehicle reports)
```

### 🎯 **Implemented NestJS Concepts**

#### **1. Dependency Injection**
- Services injected into controllers
- Repository pattern with TypeORM
- ConfigService for configuration

#### **2. Validation Decorators**

#### **3. Guards**
- `AuthGuard`: Protects routes that require authentication
- `AdminGuard`: Restricts access to administrators only

#### **4. Interceptors**
- `SerializeInterceptor`: Transforms responses using DTOs
- `CurrentUserInterceptor`: Injects current user into requests

#### **5. Pipes**
- Global `ValidationPipe` for automatic DTO validation

#### **6. Middleware**
- `cookie-session` for session management
- `CurrentUserMiddleware` to identify logged-in user

#### **7. Custom Decorators**
- `@CurrentUser()`: Extracts current user from request

## 🔍 Estimation Algorithm

Price estimation works with these criteria:
1. **Same make and model**
2. **Location**: ±5 degrees latitude/longitude
3. **Year**: ±3 years from queried vehicle
4. **Only approved reports**
5. **Order**: By mileage proximity
6. **Average**: Of the 3 closest reports

```sql
SELECT AVG(price) 
FROM reports 
WHERE make = ? AND model = ?
  AND lat BETWEEN (lat-5) AND (lat+5)
  AND lng BETWEEN (lng-5) AND (lng+5)  
  AND year BETWEEN (year-3) AND (year+3)
  AND approved = true
ORDER BY ABS(mileage - ?) 
LIMIT 3
```

## 🚀 Installation and Usage

### **Prerequisites**
- Node.js 20.x
- npm

### **Installation**
```bash
# Clone repository
git clone <repo-url>
cd car-value

# Install dependencies
npm install

# Run migrations
npm run migration:run

# Start in development
npm run start:dev
```

### **Available Scripts**
```bash
# Development
npm run start:dev      # Watch mode
npm run start:debug    # With debugger

# Testing
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage

# Database
npm run migration:generate -- --name=<name>
npm run migration:run

# Build
npm run build
npm start             # Production
```

## 🧪 Testing

- **Unit tests**: Jest for services and controllers
- **E2E tests**: Supertest for complete flows
- **CI/CD**: GitHub Actions runs tests automatically

## 🔐 API Endpoints

### **Authentication** (`/auth`)
```http
POST /auth/signup     # Register
POST /auth/signin     # Login  
POST /auth/signout    # Logout
GET  /auth/whoami     # Current user
GET  /auth/:id        # User by ID
PATCH /auth/:id       # Update user
DELETE /auth/:id      # Delete user
```

### **Reports** (`/reports`)
```http
POST /reports         # Create report
PATCH /reports/:id    # Approve report (admin)
GET /reports?make=...&model=...&year=...&lat=...&lng=...&mileage=...  # Estimation
```

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Database**: SQLite + TypeORM
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest
- **Authentication**: cookie-session
- **CI/CD**: GitHub Actions
