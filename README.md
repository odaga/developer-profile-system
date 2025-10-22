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