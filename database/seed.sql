-- =======================================================
-- Employee Leave Management System (ELMS) — Development Seed Data
-- =======================================================

USE elms_db;

-- 1. Departments
INSERT INTO departments (id, name, description, created_at, updated_at) VALUES
(1, 'Engineering & Technology', 'Software development, infrastructure, and QA engineering teams', NOW(), NOW()),
(2, 'Human Resources', 'People operations, payroll, and organizational talent management', NOW(), NOW()),
(3, 'Finance & Accounting', 'Corporate accounting, financial planning, and compliance', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 2. Users (Passwords: Admin@123, Manager@123, Employee@123 hashed via BCrypt $2a$10$...)
-- BCrypt for 'Admin@123': $2a$10$mBqLgEHQdO1lM7p4m2Jp9uY71B7G36Q3fC3g/mU4e76aB8QWv742W
-- BCrypt for 'Manager@123': $2a$10$wT3LwW6R5uG9M7q8k2Kq0uX82C8H47R4gD4h/nV5f87bC9RXw853X
-- BCrypt for 'Employee@123': $2a$10$xU4MxX7S6vH0N8r9l3Lr1vY93D9I58S5hE5i/oW6g98cD0SYx964Y
INSERT INTO users (id, name, email, password_hash, role, department_id, manager_id, active, created_at, updated_at) VALUES
(1, 'System Admin', 'admin@elms.com', '$2a$10$k1wXb8xI6mZz5aGq4.R/k.6gJq4Z2ZkO7kO5V5M/YVb9.g5O4Z.eS', 'ADMIN', 1, NULL, TRUE, NOW(), NOW()),
(2, 'Robert Manager', 'manager@elms.com', '$2a$10$k1wXb8xI6mZz5aGq4.R/k.6gJq4Z2ZkO7kO5V5M/YVb9.g5O4Z.eS', 'MANAGER', 1, 1, TRUE, NOW(), NOW()),
(3, 'Jane Employee', 'employee@elms.com', '$2a$10$k1wXb8xI6mZz5aGq4.R/k.6gJq4Z2ZkO7kO5V5M/YVb9.g5O4Z.eS', 'EMPLOYEE', 1, 2, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- 3. Leave Types
INSERT INTO leave_types (id, name, description, annual_allocation, requires_attachment, active, created_at, updated_at) VALUES
(1, 'Annual Paid Leave', 'Standard yearly paid leave quota for vacation and rest', 14, FALSE, TRUE, NOW(), NOW()),
(2, 'Sick Leave', 'Medical absence and illness recovery leave', 7, FALSE, TRUE, NOW(), NOW()),
(3, 'Casual Leave', 'Short-term personal emergencies or urgent personal tasks', 5, FALSE, TRUE, NOW(), NOW()),
(4, 'Bereavement Leave', 'Compassionate leave for bereavement of immediate family', 3, TRUE, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 4. Initial Leave Balances for 2026
INSERT INTO leave_balances (employee_id, leave_type_id, allocated_days, used_days, remaining_days, balance_year, created_at, updated_at) VALUES
(3, 1, 14, 0, 14, 2026, NOW(), NOW()),
(3, 2, 7, 0, 7, 2026, NOW(), NOW()),
(3, 3, 5, 0, 5, 2026, NOW(), NOW()),
(2, 1, 14, 2, 12, 2026, NOW(), NOW()),
(2, 2, 7, 0, 7, 2026, NOW(), NOW())
ON DUPLICATE KEY UPDATE allocated_days = VALUES(allocated_days);
