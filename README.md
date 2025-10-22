Developer Profile Management System
===================================

A complete talent profile management system with REST API backend and web dashboard.

Features
--------

-    RESTful API with full CRUD operations

-    Search and filter developers by skills, location, and availability

-    Pagination for large datasets

-    Input validation and error handling

-    Web dashboard with responsive design

-    SQLite database with Sequelize ORM

-    Comprehensive unit test suite with Jest

-    API documentation and testing

Technology Stack
----------------

-   **Backend**: Node.js, Express.js

-   **Database**: SQLite with Sequelize ORM

-   **Validation**: Joi

-   **Security**: Helmet, CORS, Rate Limiting

-   **Testing**: Jest, Supertest

-   **Frontend**: Vanilla JavaScript, CSS Grid/Flexbox

Project Structure
-----------------

developer-profile-system/
├── src/
│   ├── controllers/      # Route handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── utils/           # Utility functions
├── public/              # Frontend assets
├── tests/               # Test suites
└── database.sqlite      # SQLite database (auto-generated)

Quick Start
-----------

### Prerequisites

-   Node.js (v14 or higher)

-   npm or yarn

### Installation

1.  **Clone or create the project**:


mkdir developer-profile-system
cd developer-profile-system

**Install dependencies**:

npm install

**Set up the database**:

bash

# The database will be automatically created on first run
npm run seed

**Start the development server**:

npm run dev

1.  **Access the application**:

    -   Dashboard: <http://localhost:3000>

    -   API: <http://localhost:3000/api/profiles>

    -   Status: <http://localhost:3000/api/status>

    -   Health: <http://localhost:3000/api/health>

API Endpoints
-------------

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| GET | `/api/profiles` | List all profiles (with pagination) | Public |
| GET | `/api/profiles/:id` | Get specific profile | Public |
| POST | `/api/profiles` | Create new profile | Public |
| PUT | `/api/profiles/:id` | Update profile | Public |
| DELETE | `/api/profiles/:id` | Delete profile | Public |
| GET | `/api/profiles/search` | Search profiles | Public |
| GET | `/api/status` | System status and stats | Public |
| GET | `/api/health` | Health check | Public |

### Query Parameters

**GET /api/profiles**:

-   `page` - Page number (default: 1)

-   `limit` - Items per page (default: 10)

**GET /api/profiles/search**:

-   `skills` - Filter by skills (comma-separated)

-   `location` - Filter by location

-   `availableForWork` - Filter by availability (true/false)

-   `minExperience` - Minimum years of experience

-   `maxHourlyRate` - Maximum hourly rate

-   `page` - Page number

-   `limit` - Items per page

### Request/Response Examples

**Create a Profile**:

curl -X POST http://localhost:3000/api/profiles\
  -H "Content-Type: application/json"\
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "location": "Remote",
    "skills": ["JavaScript", "React", "Node.js"],
    "experienceYears": 5,
    "availableForWork": true,
    "hourlyRate": 85
  }'

**Search Profiles**:

curl "http://localhost:3000/api/profiles/search?skills=React&location=San%20Francisco&availableForWork=true"

Database Configuration
----------------------

### SQLite Setup

The application uses SQLite with Sequelize ORM:

-   **Database File**: `database.sqlite` (created automatically)

-   **ORM**: Sequelize with model definitions

-   **Migrations**: Automatic schema synchronization

### Database Schema

sql

CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(100) NOT NULL,
  skills TEXT NOT NULL,
  experienceYears INTEGER NOT NULL,
  availableForWork BOOLEAN DEFAULT true,
  hourlyRate DECIMAL(10,2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  CHECK (experienceYears >= 0 AND experienceYears <= 50),
  CHECK (hourlyRate >= 0 AND hourlyRate <= 1000)
);

### Data Model

javascript

{
  id: 1,
  name: "Developer Name",
  email: "email@example.com",
  location: "City, Country",
  skills: ["JavaScript", "React", "Node.js"],
  experienceYears: 5,
  availableForWork: true,
  hourlyRate: 85.00,
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z"
}
