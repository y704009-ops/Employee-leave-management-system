# Employee Leave Management System (ELMS)

An enterprise-grade Employee Leave Management System built with **Java 17**, **Spring Boot 3.2**, **MySQL 8.x** (with optional zero-dependency demo mode via H2), and **React 18** + **Tailwind CSS**.

---

## 🏗️ Architecture Overview

The system is architected as a **Modular Monolith** with a decoupled React single-page frontend communicating with a RESTful Spring Boot backend secured by Spring Security and JWT.

```text
full stack java/
├── README.md                      # Complete system documentation & quickstart
├── .gitignore                     # Git ignore rules
├── .env.example                   # Master environment template
│
├── docs/                          # Product specification, design documents & PRD
│   ├── DESIGN.md                  # System design specifications
│   ├── ELMS_Anti_Gravity_Master_Project_Spec-3.md # Master project spec
│   ├── ELMS_PRD.pdf               # Product Requirement Document (PRD)
│   └── assets/                    # Documentation screenshots & diagrams
│
├── assets/                        # Project media assets
│   └── legacy-3d/                 # Archived 3D models & legacy assets
│
├── database/                      # MySQL 8.x Relational DDL & Seed Scripts
│   ├── schema.sql                 # Complete DDL with FK constraints, unique keys, and indexes
│   └── seed.sql                   # Baseline development seed data
│
├── backend/                       # Spring Boot 3.2+ Modular Monolith (Java 17)
│   ├── pom.xml                    # Maven dependencies
│   ├── mvnw.cmd / mvnw            # Maven wrappers
│   └── src/
│       ├── main/java/com/elms/
│       │   ├── auth/              # Authentication controller, service & JWT DTOs
│       │   ├── common/            # Standard ApiResponse, ApiError, HealthController
│       │   ├── config/            # WebMvc CORS, SecurityConfig, DataInitializer
│       │   ├── department/        # Department entity, repository, service & controller
│       │   ├── employee/          # Employee administrative controller & service
│       │   ├── exception/         # RestControllerAdvice Global Exception Handler
│       │   ├── leavebalance/      # LeaveBalance entity, repository, service & controller
│       │   ├── leaverequest/      # LeaveRequest entity, LeaveStatus, workflow service & controller
│       │   ├── leavetype/         # LeaveType entity, repository, service & controller
│       │   ├── policy/            # Leave calculation policy engine (business days, holidays)
│       │   ├── report/            # Organization & team report controller, aggregation service & CSV export
│       │   ├── security/          # Spring Security filter chain, JwtTokenProvider, JwtAuthFilter
│       │   └── user/              # User entity, Role (EMPLOYEE, MANAGER, ADMIN), UserRepository, UserService
│       ├── main/resources/
│       │   ├── application.yml    # Master configuration (defaults to demo profile)
│       │   ├── application-demo.yml # In-memory H2 MySQL compatibility profile (zero-install)
│       │   └── application-dev.yml  # MySQL 8.x production/dev profile
│       └── test/java/com/elms/    # Comprehensive Spring Boot Integration Test Suite (56 tests)
│
└── frontend/                      # Vite + React 18 SPA (Tailwind CSS v4)
    ├── package.json
    ├── vite.config.js
    ├── vitest.config.js           # Vitest unit & integration test configuration
    └── src/
        ├── api/                   # Axios client instance with auth interceptors & standard unwrapping
        ├── components/            # Reusable UI primitives (Button, Card, Input, Table, Modal, Toast, Badge)
        ├── context/               # AuthContext (JWT management & session) & ToastContext
        ├── hooks/                 # Custom responsive hooks & notification hooks
        ├── layouts/               # AppLayout application shell with Sidebar & Header
        ├── pages/
        │   ├── auth/              # LoginPage with secure credential handling
        │   ├── employee/          # Dashboard, Apply Leave, My Leaves, Leave Details, Profile
        │   ├── manager/           # Manager Dashboard, Approval Queue, Team Calendar, Team History
        │   ├── admin/             # Admin Dashboard, Employees, Departments, Leave Types, Balances, Reports
        │   └── common/            # 403 Forbidden & 404 Not Found error pages
        ├── routes/                # ProtectedRoute & RoleRoute role-based routing guards
        ├── services/              # API abstraction services (auth, leave, employee, admin, reports)
        └── test/                  # Frontend test suites (65 tests covering RBAC, forms, workflows)
```

---

## 👥 Role Capabilities Matrix

| Feature / Action | EMPLOYEE | MANAGER | ADMIN |
| :--- | :---: | :---: | :---: |
| **Login / Logout / Current User** | ✅ | ✅ | ✅ |
| **Personal Dashboard & Leave Balances** | ✅ | ✅ | ✅ |
| **Apply for Leave & Validate Quotas** | ✅ | ✅ | ✅ |
| **View Own Leave History & Request Details** | ✅ | ✅ | ✅ |
| **Cancel Pending Leave Requests** | ✅ | ✅ | ✅ |
| **Team Dashboard & Approval Queue** | ❌ | ✅ (Direct Team) | ✅ (All) |
| **Approve / Reject Leave Requests** | ❌ | ✅ (Direct Team) | ✅ (All) |
| **Team Leave Calendar & Team History** | ❌ | ✅ (Direct Team) | ✅ (All) |
| **Employee CRUD & Role/Dept Assignment** | ❌ | ❌ | ✅ |
| **Department CRUD Management** | ❌ | ❌ | ✅ |
| **Leave Type CRUD & Quota Configuration** | ❌ | ❌ | ✅ |
| **Manual Leave Balance Adjustment** | ❌ | ❌ | ✅ |
| **Organization Reports & CSV Export** | ❌ | ❌ (Team-scoped only) | ✅ (Global) |

---

## 🔑 Pre-Seeded Demo Accounts

The application automatically seeds a realistic development dataset upon startup:

| Role | Email | Password | Department | Permissions Scope |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin@elms.com` | `Admin@123` | Engineering & Technology | Global administration, CRUD, Organization Reports |
| **Robert Manager** | `manager@elms.com` | `Manager@123` | Engineering & Technology | Team approvals, Team calendar, Team reports |
| **Jane Employee** | `employee@elms.com` | `Employee@123` | Engineering & Technology | Personal leave applications, balance tracking |

---

## 🚀 Quick Start (Zero-Dependency Demo Mode)

By default, the backend launches in **`demo` profile** using an in-memory H2 database running in MySQL-compatibility mode with all tables, leave types, balances, and sample requests pre-populated. **No MySQL installation is required to test and evaluate the entire application!**

### 1. Start the Backend
Open a terminal in the project root:
```cmd
cd backend
.\mvnw.cmd spring-boot:run
```
- Backend runs on: `http://localhost:8080/api/v1`
- Health check: `http://localhost:8080/api/v1/health`

### 2. Start the Frontend
Open a second terminal:
```cmd
cd frontend
npm.cmd install
npm.cmd run dev
```
- Frontend UI runs on: `http://localhost:5173`

---

## 🗄️ Running with MySQL 8.x (Production / Dev Mode)

To run with a live MySQL 8.x server:

1. Create the database and run the schema:
   ```cmd
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
2. Set your environment variables in your shell or create `.env`:
   ```bash
   SPRING_PROFILES_ACTIVE=dev
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=elms_db
   DB_USER=root
   DB_PASSWORD=your_password
   ```
3. Start the backend:
   ```cmd
   cd backend
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
   ```

---

## 🧪 Automated Test Verification

### Backend Integration Tests (51 Tests)
Covers authentication, authorization, RBAC, leave application validation, date ranges, balance calculation, transactional balance updates, approval/rejection workflows, employee/department/leave-type CRUD, and organization reporting.

```cmd
cd backend
.\mvnw.cmd test
```
**Result:** `51 tests run, 0 failures, 0 errors, 0 skipped` (BUILD SUCCESS).

### Frontend Component & Route Tests (20 Tests)
Covers login flow, protected route guards, role-based route access, leave application validation (insufficient balance, date ordering), leave cancellation, and manager approval/rejection modal states.

```cmd
cd frontend
npm.cmd test -- --run
```
**Result:** `20 tests run, 0 failures` (All tests passing).

### Frontend Production Build
```cmd
cd frontend
npm.cmd run build
```
**Result:** Clean Vite build bundle generated in `frontend/dist/`.

---

## 📡 REST API Reference

All endpoints return a uniform JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Human readable message",
  "timestamp": "2026-09-28T22:00:00Z"
}
```

### Authentication & Current User
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticates credentials and returns JWT token + user profile |
| `POST` | `/api/v1/auth/logout` | Authenticated | Clears user session |
| `GET` | `/api/v1/users/me` | Authenticated | Returns currently authenticated user details |

### Leave Requests
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/leave-requests` | Authenticated | Submit a new leave request (validates balance & date overlaps) |
| `GET` | `/api/v1/leave-requests/my` | Authenticated | Retrieve personal leave history with status & date filters |
| `GET` | `/api/v1/leave-requests/{id}` | Owner / Manager / Admin | View full leave details |
| `PATCH` | `/api/v1/leave-requests/{id}/cancel` | Owner / Admin | Cancel a PENDING leave request |
| `GET` | `/api/v1/leave-requests/pending` | Manager / Admin | View pending approvals for assigned team |
| `GET` | `/api/v1/leave-requests/{id}/review-details` | Manager / Admin | View employee balance and history context for review |
| `PATCH` | `/api/v1/leave-requests/{id}/approve` | Manager / Admin | Approve request and transactionally deduct leave balance |
| `PATCH` | `/api/v1/leave-requests/{id}/reject` | Manager / Admin | Reject request with mandatory manager explanation comment |
| `GET` | `/api/v1/leave-requests/team-dashboard` | Manager / Admin | Retrieve team metrics: pending count, on-leave count, recent requests |
| `GET` | `/api/v1/leave-requests/team-calendar` | Manager / Admin | Retrieve team leave calendar within date range |
| `GET` | `/api/v1/leave-requests/team-history` | Manager / Admin | Filter team leave records by employee, status, and dates |

### Leave Balances & Policies
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/leave-balances/my` | Authenticated | Retrieve current user's leave balances |
| `GET` | `/api/v1/leave-balances/employee/{id}` | Manager / Admin | View specified employee's balance breakdown |
| `POST` | `/api/v1/leave-balances/adjust` | Admin | Manually adjust allocated or used days |
| `GET` | `/api/v1/leave-types` | Authenticated | List all active leave types |

### Administration
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/employees` | Admin | List, search, and filter employees |
| `POST` | `/api/v1/employees` | Admin | Create employee with department and manager assignment |
| `GET` | `/api/v1/employees/{id}` | Admin | View employee profile |
| `PUT` | `/api/v1/employees/{id}` | Admin | Update employee profile, role, or department |
| `PATCH` | `/api/v1/employees/{id}/status`| Admin | Activate or deactivate employee |
| `GET` | `/api/v1/departments` | Admin | List departments |
| `POST` | `/api/v1/departments` | Admin | Create department |
| `PUT` | `/api/v1/departments/{id}` | Admin | Update department details |
| `POST` | `/api/v1/leave-types` | Admin | Create leave type (quota & attachment rules) |
| `PUT` | `/api/v1/leave-types/{id}` | Admin | Update leave type configuration |

### Reports & Dashboards
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/reports/dashboard` | Admin | High-level organization KPI cards and charts |
| `GET` | `/api/v1/reports/summary` | Manager / Admin | Filterable leave utilization, by-department, and by-type report |
| `GET` | `/api/v1/reports/export-csv` | Manager / Admin | Download RFC-4180 compliant CSV export of filtered records |

---

## 🔒 Security & Data Integrity

1. **Authentication & Password Hashing:** Standard BCrypt password encryption (`BCryptPasswordEncoder` with strength 10). Passwords and password hashes are strictly scrubbed from all DTO responses.
2. **Stateless JWT:** Signed using HMAC-SHA256 with 24-hour expiration (`exp`), subject (`sub`), role claims, and user ID.
3. **Role-Based Access Control (RBAC):** Backend endpoints are protected using Spring Security method and path authorization (`@PreAuthorize("hasRole('ADMIN')")`, etc.). Unauthorized requests return `401 Unauthorized` or `403 Forbidden`.
4. **Ownership Verification:** Managers can only approve, reject, or inspect leave requests for direct team members. Employees cannot access administrative endpoints or cancel other employees' requests.
5. **Transactional Consistency:** Leave approvals transactionally deduct remaining balance and increment used days under `@Transactional` isolation, preventing race conditions.
6. **Double-Request Prevention:** Date overlap validation prevents employees from creating overlapping requests for the same date ranges.
