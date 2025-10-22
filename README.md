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


### Total Development Time: 9 hours

**Breakdown by Phase:**

-   Planning & Architecture: 1 hour

-   Backend Development: 5 hours

-   Frontend Development: 3 hours


## Quick Start
### Prerequisites
* Node.js (v14 or higher)
* npm or yarn

### Installation
1.  **Clone or create the project**:
    ```bash
    mkdir developer-profile-system
    cd developer-profile-system
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up the database**:
    ```bash
    # The database will be automatically created and seeded on first run
    npm run seed
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
5.  **Access the application**:
    * Dashboard: `http://localhost:3000`
    * API: `http://localhost:3000/api/profiles`
    * Status: `http://localhost:3000/api/status`
    * Health: `http://localhost:3000/api/health`

---

## API Endpoints
| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
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
* `page` - Page number (default: 1)
* `limit` - Items per page (default: 10)

**GET /api/profiles/search**:
* `skills` - Filter by skills (comma-separated)
* `location` - Filter by location
* `availableForWork` - Filter by availability (true/false)
* `minExperience` - Minimum years of experience
* `maxHourlyRate` - Maximum hourly rate
* `page` - Page number
* `limit` - Items per page

### Request/Response Examples
**Create a Profile**:
```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "location": "Remote",
    "skills": ["JavaScript", "React", "Node.js"],
    "experienceYears": 5,
    "availableForWork": true,
    "hourlyRate": 85
  }'
  ```
Database Configuration
----------------------

### SQLite Setup

The application uses SQLite with Sequelize ORM:

-   **Database File**: `database.sqlite` (created automatically)

-   **ORM**: Sequelize with model definitions

-   **Migrations**: Automatic schema synchronization

### Database Schema

```

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
```

### Data Model

```

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
  updatedAt: "2023-01-01T00:00:00.000Z
}
```
   
Technical Considerations
------------------------

### Security

1.  **Input Validation**: All inputs are validated using Joi schema validation

2.  **SQL Injection Prevention**: Sequelize ORM uses parameterized queries

3.  **Rate Limiting**: Express rate limiter prevents API abuse (100 requests per 15 minutes)

4.  **Security Headers**: Helmet.js sets secure HTTP headers

5.  **CORS**: Configured for cross-origin requests

### Performance

1.  **Pagination**: All list endpoints support pagination to handle large datasets

2.  **Database Indexing**: Email field is indexed for fast lookups

3.  **Efficient Queries**: Sequelize optimizes database queries

4.  **Response Compression**: Consider adding compression middleware for production

### Error Handling

-   Consistent error response format

-   Proper HTTP status codes

-   Detailed validation error messages

-   Graceful database error handling
