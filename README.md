# Order Processing System

A complete College DBMS Project for managing an Order Processing System using React, Node.js, Express, and Oracle Database.

## Features
- **User Authentication**: Login with JWT.
- **Role-Based Access Control**: Admins and Customers.
- **Product Inventory**: View and manage products.
- **Order Management**: Create new orders, update statuses.
- **Reports**: Generate sales and inventory reports (Admin only).

## Tech Stack
- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: Oracle Database (oracledb)

## Folder Structure
- `/database`: Oracle SQL scripts to initialize tables, triggers, sequences, views, and seed data.
- `/backend`: Node.js Express server.
- `/frontend`: Vite React application.
- `/docs`: Documentation including Swagger API specs.

## Prerequisites
- Node.js (v16+)
- Oracle Database (e.g., Oracle XE or ATP)
- npm or yarn

## Installation & Setup

### 1. Database Setup
1. Log in to your Oracle Database.
2. Execute the scripts in `/database` in this specific order:
   - `01_tables.sql`
   - `02_sequences.sql`
   - `03_constraints.sql`
   - `04_triggers.sql`
   - `05_views.sql`
   - `06_procedures.sql`
   - `07_seed_data.sql`

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your Oracle credentials.
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start the Vite development server: `npm run dev`

## Default Credentials
- **Admin**: `admin` / `admin123`
- **Customer**: `johndoe` / `customer123`

## API Documentation
The API documentation is available in `/docs/swagger.yml`. You can paste it into [Swagger Editor](https://editor.swagger.io/) to view the interactive UI.
