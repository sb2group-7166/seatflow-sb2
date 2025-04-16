# SeatFlow Backend

This is the backend server for the SeatFlow application, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/seatflow
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

3. Start MongoDB server

## Development

To run the server in development mode:
```bash
npm run dev
```

## Production

To build and run the server in production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login and get JWT token
- POST `/api/auth/verify` - Verify JWT token

### Students
- GET `/api/students` - Get all students
- GET `/api/students/:id` - Get student by ID
- POST `/api/students` - Create new student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Seats
- GET `/api/seats` - Get all seats
- GET `/api/seats/:id` - Get seat by ID
- POST `/api/seats` - Create new seat
- PUT `/api/seats/:id` - Update seat
- POST `/api/seats/:id/book` - Book a seat
- POST `/api/seats/:id/release` - Release a seat

### Payments
- GET `/api/payments` - Get all payments
- GET `/api/payments/:id` - Get payment by ID
- POST `/api/payments` - Create new payment
- PUT `/api/payments/:id/status` - Update payment status
- GET `/api/payments/student/:studentId` - Get payments by student
- GET `/api/payments/summary/monthly` - Get monthly payment summary

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/verify` require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
``` 