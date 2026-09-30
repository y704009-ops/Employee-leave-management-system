# Employee Leave Management System — Agent Execution Specification

> **Purpose:** This Markdown file is the master execution plan for an AI coding agent/IDE agent such as an Antigravity-style development environment. Give this entire file to the agent as the project's source-of-truth specification.
>
> **Important:** The agent must not blindly implement missing business policies. If a requirement is marked configurable or an assumption is required, record the assumption and keep the implementation configurable.

---

# 0. PROJECT IDENTITY

**Project Name:** Employee Leave Management System (ELMS)

**Project Type:** Full-stack web application

**Frontend:** React.js

**Backend:** Java + Spring Boot

**API:** REST

**Database:** MySQL

**Authentication:** Spring Security + JWT

**Testing:** JUnit/Mockito where appropriate + Postman/API tests

**Version Control:** Git + GitHub

**Architecture:** Modular monolith

---

# 1. AGENT MISSION

Build the Employee Leave Management System from this specification.

The agent should:

1. Understand the complete requirements before changing code.
2. Inspect the existing workspace before creating files.
3. Create a clean frontend/backend project structure if the workspace is empty.
4. Implement the backend API first enough to establish stable contracts.
5. Implement the database/entity model.
6. Implement authentication and authorization.
7. Implement the React frontend against the REST APIs.
8. Integrate frontend and backend.
9. Test every major workflow.
10. Fix errors before moving to the next milestone.
11. Keep documentation synchronized with the implementation.
12. Avoid unnecessary features outside the MVP.
13. Never claim a feature is complete without testing it.

---

# 2. EXECUTION RULES

## Rule 1 — Inspect First

Before making changes:

- Inspect the workspace.
- Identify existing frontend/backend/database files.
- Detect package managers and build tools.
- Check whether React, Spring Boot, Maven, Gradle, or configuration already exists.
- Reuse valid existing structure where possible.
- Do not overwrite working code unnecessarily.

## Rule 2 — Plan Before Coding

Create or update an implementation checklist.

Recommended order:

```text
Requirements
   ↓
Architecture
   ↓
Database Model
   ↓
Backend Project
   ↓
Security
   ↓
REST APIs
   ↓
Backend Tests
   ↓
React Project
   ↓
Frontend Screens
   ↓
API Integration
   ↓
End-to-End Testing
   ↓
Documentation
```

## Rule 3 — Small Verified Steps

Do not generate the entire project blindly in one step.

After each major milestone:

- Build
- Run tests
- Inspect errors
- Fix errors
- Continue

## Rule 4 — Source of Truth

This file is the source of truth unless a later approved requirement explicitly changes it.

If requirements conflict:
1. Identify the conflict.
2. Prefer the newer explicit requirement.
3. Do not silently choose an organization-specific policy.
4. Record the decision in the project documentation.

---

# 3. RECOMMENDED PROJECT STRUCTURE

```text
employee-leave-management/
│
├── README.md
├── PRD.md
├── AGENT_EXECUTION_PLAN.md
├── .gitignore
│
├── backend/
│   ├── pom.xml
│   └── src/
│
├── frontend/
│   ├── package.json
│   └── src/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   └── TESTING.md
│
└── postman/
    └── ELMS.postman_collection.json
```

If the agent environment uses a different standard structure, keep the same logical separation.

---

# 4. USER ROLES

## Employee

Can:

- Login
- View dashboard
- View profile
- View leave balance
- Apply for leave
- View own leave history
- View leave details/status
- Cancel eligible pending requests

Cannot:

- Approve own leave
- View another employee's private leave information unless explicitly authorized
- Manage users

## Manager

Can:

- Login
- View manager dashboard
- View assigned team leave requests
- View team leave information
- Approve requests
- Reject requests
- Add rejection/comment
- View team leave history/calendar

Cannot:

- Modify system-wide policies unless given HR/Admin permission

## HR/Admin

Can:

- Manage employees
- Manage departments
- Manage leave types
- Configure leave allocation/policies
- View all leave requests
- Manage balances where authorized
- View reports
- Perform administrative actions

---

# 5. MVP FEATURE SET

## MUST HAVE

- Login
- JWT authentication
- Role-based access
- Employee dashboard
- Manager dashboard
- Admin dashboard
- Employee management
- Department management
- Leave type management
- Leave balance
- Apply leave
- Leave history
- Leave approval
- Leave rejection
- Rejection reason
- Leave cancellation
- REST APIs
- MySQL persistence
- Input validation
- Error handling
- Responsive UI

## SHOULD HAVE

- Team leave calendar
- Search/filter
- Pagination
- Dashboard statistics
- Email/in-app notification abstraction
- API documentation

## COULD HAVE

- File attachments
- Export reports
- Advanced analytics
- Holiday calendar
- Half-day leave

## FUTURE / OUT OF SCOPE FOR MVP

- Microservices
- Complex payroll integration
- SSO
- Multi-organization tenancy
- AI-based leave prediction
- Enterprise workflow engine

---

# 6. LEAVE REQUEST STATE MACHINE

Use:

```text
             ┌──────────────┐
             │    PENDING   │
             └──────┬───────┘
                ┌───┴────┐
                ↓        ↓
          ┌──────────┐ ┌──────────┐
          │ APPROVED │ │ REJECTED │
          └──────────┘ └──────────┘
                ↑
                │
             CANCELLED
```

More precisely:

```text
PENDING → APPROVED
PENDING → REJECTED
PENDING → CANCELLED
```

Only valid state transitions may be performed.

An employee can cancel only an eligible pending request.

A manager cannot approve an already rejected/cancelled request.

---

# 7. BUSINESS RULES

Implement these rules:

1. Start date cannot be after end date.
2. Requested duration must be positive.
3. Employee must be active to apply for leave.
4. Employee must have an eligible leave type.
5. Available balance must be validated.
6. Relevant overlapping leave requests must be detected.
7. New requests start as `PENDING`.
8. Only authorized managers/HR/Admin users can approve/reject.
9. Rejection requires a reason/comment.
10. Approved leave updates the balance according to the configured balance policy.
11. Rejected leave does not permanently consume leave balance.
12. Cancelled pending leave does not permanently consume leave balance.
13. Important actions must have timestamps.
14. Unauthorized users must receive appropriate HTTP errors.

### Configurable policies

Do not hard-code assumptions for:

- Weekend counting
- Public holidays
- Half-day rules
- Carry-forward
- Negative balances
- Advance notice
- Maximum consecutive days
- Attachment requirements

Represent these as configurable rules or clearly document the MVP assumption.

---

# 8. DATABASE SPECIFICATION

## users

```text
id
name
email
password_hash
role
department_id
manager_id
active
created_at
updated_at
```

## departments

```text
id
name
description
created_at
updated_at
```

## leave_types

```text
id
name
description
annual_allocation
active
created_at
updated_at
```

## leave_balances

```text
id
employee_id
leave_type_id
allocated_days
used_days
remaining_days
year
created_at
updated_at
```

## leave_requests

```text
id
employee_id
leave_type_id
start_date
end_date
requested_days
reason
status
manager_comment
approved_by
approved_at
created_at
updated_at
```

Add constraints, indexes, and foreign keys required for data integrity.

Use appropriate Java types and SQL types.

---

# 9. BACKEND IMPLEMENTATION

Create:

```text
controller/
service/
repository/
entity/
dto/
security/
exception/
config/
```

## Required backend layers

### Controllers

- AuthController
- EmployeeController
- DepartmentController
- LeaveTypeController
- LeaveController
- ManagerController
- AdminController

Controllers should remain thin.

Business logic belongs in services.

### Services

Examples:

- AuthService
- EmployeeService
- DepartmentService
- LeaveTypeService
- LeaveService
- LeaveBalanceService

### Repositories

Use Spring Data JPA.

### DTOs

Do not expose entities directly when an API DTO is more appropriate.

Create request/response DTOs.

### Exception Handling

Implement global exception handling.

Return consistent errors such as:

```json
{
  "timestamp": "2026-01-01T10:00:00Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Start date cannot be after end date",
  "path": "/api/leaves"
}
```

---

# 10. AUTHENTICATION

Implement:

```text
POST /api/auth/login
POST /api/auth/register
```

Use:

- Password hashing
- JWT generation
- JWT validation
- Security filter
- Role authorization
- Protected endpoints

Never return password hashes.

---

# 11. REST API CONTRACT

At minimum implement:

```text
POST   /api/auth/login

GET    /api/employees
GET    /api/employees/{id}
POST   /api/employees
PUT    /api/employees/{id}
PATCH  /api/employees/{id}/status

GET    /api/departments
POST   /api/departments
PUT    /api/departments/{id}

GET    /api/leave-types
POST   /api/leave-types
PUT    /api/leave-types/{id}

GET    /api/leaves/my
POST   /api/leaves
GET    /api/leaves/{id}
PUT    /api/leaves/{id}/cancel

GET    /api/leaves/pending
PUT    /api/leaves/{id}/approve
PUT    /api/leaves/{id}/reject

GET    /api/leaves/balance/{employeeId}
```

The exact endpoint design may be refined for REST consistency, but frontend and backend must use one consistent contract.

---

# 12. FRONTEND IMPLEMENTATION

Use React.

Recommended:

```text
src/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
├── context/
├── utils/
├── routes/
└── App.jsx
```

## Pages

```text
Login
EmployeeDashboard
ManagerDashboard
AdminDashboard
Profile
ApplyLeave
MyLeaves
LeaveDetails
ApprovalQueue
TeamCalendar
Employees
Departments
LeaveTypes
LeaveBalances
Reports
```

---

# 13. FRONTEND UI REQUIREMENTS

## Login

Fields:

- Email
- Password

Actions:

- Login

States:

- Loading
- Invalid credentials
- Server error

## Employee Dashboard

Show:

- Remaining leave
- Used leave
- Pending requests
- Recent requests
- Quick Apply Leave action

## Apply Leave

Fields:

- Leave type
- Start date
- End date
- Reason

Show:

- Requested days
- Available balance
- Validation errors

## My Leaves

Columns:

- Leave type
- Start date
- End date
- Days
- Status
- Submitted date
- Actions

## Manager Approval Queue

Columns:

- Employee
- Leave type
- Dates
- Days
- Reason
- Status
- Actions

Actions:

- Approve
- Reject

Reject must request a reason.

## Admin

Provide management interfaces for:

- Employees
- Departments
- Leave types
- Balances
- Requests

---

# 14. FRONTEND SECURITY

Implement:

- Authentication state
- Token handling
- Protected routes
- Role-based routes
- Automatic logout/redirect on invalid authentication
- No sensitive credentials in UI/local source code
- API errors shown safely

Do not rely only on frontend authorization. Backend authorization is mandatory.

---

# 15. API INTEGRATION

Create an API service layer.

Example logical structure:

```text
services/
├── authService
├── employeeService
├── leaveService
├── departmentService
└── leaveTypeService
```

Do not scatter raw API URLs throughout components.

Use environment configuration for backend base URL.

---

# 16. VALIDATION

Frontend validation improves UX.

Backend validation is authoritative.

Validate:

- Required fields
- Email format
- Date range
- Leave balance
- Request state
- Authorization
- Duplicate/overlapping requests
- Employee active status

---

# 17. TESTING PLAN

## Backend Unit Tests

Test:

- Leave duration
- Balance validation
- Overlap validation
- Approval
- Rejection
- Cancellation
- Authorization
- State transitions

## API Tests

Test:

- Login
- Protected endpoint
- Employee leave creation
- Manager approval
- Manager rejection
- Cancellation
- Admin CRUD

## Frontend Tests

Test important:

- Login flow
- Protected routes
- Leave form validation
- Dashboard rendering
- Approval actions

## Manual End-to-End Test

Scenario:

```text
Create Employee
      ↓
Assign Manager
      ↓
Assign Leave Balance
      ↓
Employee Login
      ↓
Apply Leave
      ↓
Manager Login
      ↓
Approve Leave
      ↓
Check Employee Balance
      ↓
Verify Leave History
```

---

# 18. DEVELOPMENT PHASES

## Phase 1 — Workspace & Architecture

Tasks:

- Inspect repository
- Create folder structure
- Create README
- Create environment configuration strategy
- Initialize Git

Exit criteria:

- Project structure exists
- README explains how to run the project

---

## Phase 2 — Database

Tasks:

- Create entities
- Define relationships
- Create migrations/schema
- Seed development data

Exit criteria:

- Database starts correctly
- Relationships work
- Seed data can be loaded

---

## Phase 3 — Backend Foundation

Tasks:

- Spring Boot setup
- JPA
- MySQL connection
- DTOs
- Validation
- Exception handling

Exit criteria:

- Backend starts successfully
- Database connection works

---

## Phase 4 — Authentication & Security

Tasks:

- User authentication
- Password hashing
- JWT
- Security filter
- Role authorization

Exit criteria:

- Employee/Manager/Admin access is correctly separated

---

## Phase 5 — Leave APIs

Tasks:

- Apply leave
- Get own leaves
- Get balance
- Cancel
- Manager pending requests
- Approve
- Reject

Exit criteria:

- Core leave lifecycle works through REST APIs

---

## Phase 6 — Admin APIs

Tasks:

- Employee CRUD
- Department CRUD
- Leave type CRUD
- Balance management

Exit criteria:

- Admin can manage required resources

---

## Phase 7 — Backend Testing

Tasks:

- Unit tests
- Integration/API tests
- Security tests
- Validation tests

Exit criteria:

- Critical backend workflows are tested

---

## Phase 8 — React Foundation

Tasks:

- React setup
- Routing
- Layouts
- API client
- Authentication state

Exit criteria:

- User can login and reach correct dashboard

---

## Phase 9 — React Features

Implement in this order:

1. Employee dashboard
2. Apply leave
3. My leaves
4. Leave details
5. Manager dashboard
6. Approval queue
7. Admin dashboard
8. Employee management
9. Department management
10. Leave type management
11. Balance management
12. Reports/calendar if included in MVP

---

## Phase 10 — Integration

Verify:

- Frontend API calls
- JWT handling
- Error handling
- Loading states
- Authorization
- Database updates

---

## Phase 11 — Final QA

Run:

- Backend build
- Frontend build
- Unit tests
- API tests
- End-to-end manual flow
- Responsive UI check
- Security/authorization check

---

# 19. DEFINITION OF DONE

A feature is complete only when:

- Code exists
- Backend/frontend integration works
- Validation exists
- Authorization is correct
- Error states are handled
- Tests exist where appropriate
- Build succeeds
- Feature is manually verified
- Documentation is updated

---

# 20. GIT WORKFLOW

Recommended branches:

```text
main
develop
feature/auth
feature/leave-management
feature/admin
feature/frontend
```

Commit examples:

```text
feat: add JWT authentication
feat: implement leave request API
feat: add manager approval workflow
feat: add employee dashboard
fix: validate overlapping leave requests
test: add leave service tests
docs: update API documentation
```

Do not commit:

- Passwords
- JWT secrets
- Database passwords
- API keys
- `.env` secrets

---

# 21. ENVIRONMENT CONFIGURATION

Use environment variables/configuration for:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
JWT_EXPIRATION
BACKEND_URL
FRONTEND_URL
```

Provide a safe example configuration such as:

```text
.env.example
```

Never place real secrets in Git.

---

# 22. SAMPLE DEVELOPMENT DATA

Create development-only seed data for:

### Admin
- One admin account

### Manager
- One manager account

### Employees
- At least two employees

### Departments
- At least two departments

### Leave Types
- At least two leave types

### Balances
- Test balances for employees

Clearly mark development credentials as non-production.

---

# 23. REQUIRED DOCUMENTATION

The agent should maintain:

## README.md

Include:

- Project overview
- Architecture
- Prerequisites
- Setup
- Database setup
- Backend setup
- Frontend setup
- Running the application
- Test commands

## API.md

Document:

- Authentication
- Endpoints
- Request examples
- Response examples
- Error codes

## DATABASE.md

Document:

- Tables
- Relationships
- Constraints
- Seed data

## TESTING.md

Document:

- Unit tests
- API tests
- Manual test cases
- Known limitations

---

# 24. UI/UX QUALITY BAR

The application should look like a real modern business application.

Requirements:

- Responsive layout
- Consistent spacing
- Clear navigation
- Accessible labels
- Clear status badges
- Confirmation before destructive actions
- Empty states
- Loading states
- Error states
- Success feedback
- Mobile-friendly tables/cards
- Consistent date formatting
- Clear role-specific dashboards

Do not prioritize visual complexity over usability.

---

# 25. ERROR HANDLING

Handle at least:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error where appropriate
500 Internal Server Error
```

Frontend should display user-friendly messages.

Backend should log useful diagnostic information without logging secrets.

---

# 26. FINAL ACCEPTANCE TESTS

The following scenarios must pass.

### Test 1 — Login

Given valid credentials  
When the user logs in  
Then a valid authenticated session/token is created  
And the user reaches the correct role dashboard.

### Test 2 — Invalid Login

Given invalid credentials  
When login is attempted  
Then authentication fails  
And a safe error is shown.

### Test 3 — Apply Leave

Given an active employee with sufficient balance  
When a valid leave request is submitted  
Then the request is created as `PENDING`.

### Test 4 — Invalid Dates

Given start date after end date  
When the request is submitted  
Then the request is rejected with validation feedback.

### Test 5 — Insufficient Balance

Given insufficient available leave  
When the employee requests more leave than permitted  
Then the request is rejected.

### Test 6 — Manager Approval

Given a pending request belonging to the manager's team  
When the manager approves it  
Then the request becomes `APPROVED`  
And the balance is updated according to the configured policy.

### Test 7 — Manager Rejection

Given a pending request  
When the manager rejects it with a reason  
Then the request becomes `REJECTED`  
And the rejection reason is stored.

### Test 8 — Cancellation

Given an eligible pending request  
When the employee cancels it  
Then it becomes `CANCELLED`.

### Test 9 — Unauthorized Access

Given an employee account  
When it attempts an admin-only operation  
Then the backend returns `403 Forbidden`.

### Test 10 — Data Persistence

Given a successful leave operation  
When the database is queried  
Then the expected request/balance data is persisted consistently.

---

# 27. AGENT CHECKPOINT FORMAT

After each major phase, report:

```text
PHASE:
STATUS: COMPLETE / BLOCKED

COMPLETED:
- ...

FILES CREATED/CHANGED:
- ...

TESTS RUN:
- ...

TEST RESULTS:
- ...

ISSUES:
- ...

DECISIONS/ASSUMPTIONS:
- ...

NEXT PHASE:
- ...
```

Do not proceed past a blocked dependency without resolving it or explicitly documenting the blocker.

---

# 28. FINAL PROJECT CHECKLIST

## Product
- [ ] PRD exists
- [ ] Roles defined
- [ ] User stories defined
- [ ] Acceptance criteria defined
- [ ] MVP scope defined

## Backend
- [ ] Spring Boot builds
- [ ] MySQL connection works
- [ ] Entities implemented
- [ ] Repositories implemented
- [ ] Services implemented
- [ ] REST controllers implemented
- [ ] DTOs implemented
- [ ] Validation implemented
- [ ] Exception handling implemented
- [ ] JWT implemented
- [ ] Role authorization implemented

## Frontend
- [ ] React builds
- [ ] Routing works
- [ ] Login works
- [ ] Protected routes work
- [ ] Employee dashboard works
- [ ] Manager dashboard works
- [ ] Admin dashboard works
- [ ] Leave form works
- [ ] Leave history works
- [ ] Approval workflow works
- [ ] Admin CRUD works
- [ ] Error/loading/empty states work

## Database
- [ ] Schema created
- [ ] Foreign keys correct
- [ ] Constraints correct
- [ ] Seed data works
- [ ] Transactions considered

## Testing
- [ ] Unit tests
- [ ] API tests
- [ ] Security tests
- [ ] End-to-end workflow
- [ ] Build verification

## Documentation
- [ ] README
- [ ] API docs
- [ ] Database docs
- [ ] Testing docs
- [ ] Setup instructions

---

# 29. FINAL INSTRUCTION TO THE AI AGENT

You are not merely generating code snippets.

You are executing a complete software project.

Work incrementally.

Inspect before editing.

Plan before implementing.

Keep frontend, backend, API, database, security, and documentation consistent.

Test each milestone.

Do not invent business policies.

Do not skip authentication or backend authorization.

Do not mark a feature complete until it has been implemented and verified.

When all MVP acceptance tests pass, provide a final project report containing:

1. What was implemented
2. Project structure
3. Technologies used
4. API summary
5. Database summary
6. Authentication model
7. Tests completed
8. Known limitations
9. How to run the project
10. Suggested future improvements
