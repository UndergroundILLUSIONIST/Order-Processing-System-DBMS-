-- 01_tables.sql
-- Create Tables for Order Processing System

CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(20) DEFAULT 'CUSTOMER' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    customer_id NUMBER PRIMARY KEY,
    user_id NUMBER UNIQUE,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    phone VARCHAR2(20),
    address VARCHAR2(255),
    city VARCHAR2(100),
    state VARCHAR2(100),
    zip_code VARCHAR2(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    supplier_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    contact_name VARCHAR2(100),
    email VARCHAR2(100),
    phone VARCHAR2(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id NUMBER PRIMARY KEY,
    supplier_id NUMBER,
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    price NUMBER(10, 2) NOT NULL,
    stock_quantity NUMBER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id NUMBER PRIMARY KEY,
    customer_id NUMBER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    total_amount NUMBER(12, 2) DEFAULT 0 NOT NULL
);

CREATE TABLE order_items (
    order_item_id NUMBER PRIMARY KEY,
    order_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL,
    unit_price NUMBER(10, 2) NOT NULL,
    subtotal NUMBER(12, 2) NOT NULL
);
