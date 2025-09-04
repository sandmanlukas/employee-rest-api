# Employee Register API

A RESTful API for managing employee records built with TypeScript, Express.js, and Node.js. This API provides endpoints for creating, retrieving, and deleting employee information with pagination support.

## Features

- Create new employees
- Retrieve employees with pagination
- Delete employees by ID or email
- Input validation and error handling
- Health check endpoint
- Docker support
- Comprehensive test coverage
- TypeScript for type safety
- ESLint and Prettier for code quality

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Security**: Helmet, CORS
- **Containerization**: Docker

## API Endpoints

### Health Check
- `GET /health` - Returns server health status

### Employees
- `GET /api/employees` - Get all employees (with pagination)
- `POST /api/employees` - Create a new employee
- `DELETE /api/employees` - Delete an employee

## API Documentation

### Get Employees
```
GET /api/employees?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Employees fetched successfully"
}
```

### Create Employee
```
POST /api/employees
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Employee created successfully: John Doe"
}
```

### Delete Employee
```
DELETE /api/employees
```

**Request Body:**
```json
{
  "id": "uuid"
}
```

or

```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Employee deleted successfully: John Doe"
}
```

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone git@github.com:sandmanlukas/employee-rest-api.git
cd employee_rest_api
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Build

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Docker

### Build and Run with Docker

1. Build the Docker image:
```bash
docker build -t employee-api .
```

2. Run the container:
```bash
docker run -p 3000:3000 employee-api
```

The API will be available at `http://localhost:3000`

## Environment Variables

- `ALLOWED_ORIGINS` (optional): Comma-separated list of allowed CORS origins (default: "*")
- `PORT` (optional): The port of the application (default: "3000")


## Testing

The project includes comprehensive test coverage for:
- Employee service layer
- Employee repository layer

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Project Structure

```
src/
├── __tests__/           # Test files
│   ├── repositories/    # Repository tests
│   └── services/        # Service tests
├── controllers/         # API controllers
├── repositories/        # Data access layer
├── routes/             # Route definitions
├── services/           # Business logic layer
├── types/              # TypeScript type definitions
├── app.ts              # Express app configuration
└── index.ts            # Application entry point
```

## TODO
* Add a UI, currently it's not very user-friendly
* Add some sort of persistant storage, it's not really ideal to store everything in memory...
* * We could use SQLite or something if we want a simple DB, and then use a ORM such as Prisma or Drizzle to easily handle CRUD operations.
* Add authentication
* * Maybe overkill, but if we want to further develop this app it could be nice to have.


## License

MIT License

## Author

Lukas Sandman