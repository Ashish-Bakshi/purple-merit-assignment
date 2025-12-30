# Purple Merit Assignment – Full Stack Application

## Project Overview & Purpose

This project is a full-stack web application built as part of an assignment to demonstrate practical skills in backend development, authentication, role-based access control, frontend UI/UX, and testing.

The application supports:
- User authentication using cookies
- Role-based access (USER / ADMIN)
- Profile management
- Admin user management (activate/deactivate users)
- Clean, responsive UI with proper feedback
- Backend unit and integration testing

The goal was to build a **realistic, production-style application** with clear separation of concerns, proper validation, and test coverage.

---

## 1. Tech Stack Used

### Frontend
- React
- TypeScript
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

### Authentication & Security
- JWT (stored in HTTP-only cookies)
- bcrypt for password hashing
- Role-based authorization middleware

### Testing
- Jest
- ts-jest
- Supertest (integration tests)

---

## 2. Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database
- npm

---

### Backend Setup

Navigate to backend folder and install dependencies:

```bash
cd backend
npm install
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```


Start the backend server:

```bash
npm run dev
```

Backend Runs on : http://localhost:5000


---

### Frontend Setup

Navigate to frontend folder and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend server:

```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## 3. Environment Variables

### Backend (`backend/.env`)

- DATABASE_URL=
- JWT_SECRET=
- PORT=
- CLIENT_URL


### Frontend (`frontend/.env`)

- VITE_API_URL=

## 4. Deployment Instructions

### Backend Deployment
1. Deploy PostgreSQL (Neon, Supabase, Railway, or Render)
2. Configure environment variables on the hosting platform
3. Run Prisma migrations on the deployed database
4. Build and start the server:
    - npm run build
    - npm start


### Frontend Deployment
1. Set `VITE_API_URL` to the deployed backend URL
2. Build the frontend:
3. Deploy the build output to Vercel or Netlify

## 5. API Documentation

### Postman collection 

- JSON - [Link](Purple_Merit_Assignment.postman_collection.json)

- Direct Postman Link - [Link](https://web.postman.co/workspace/My-Workspace~0731191d-8c05-4edf-8d2f-dea60bc32b5e/collection/39234312-4b86a061-10fc-44f8-ace1-be92595a8576?action=share&source=copy-link&creator=39234312)

### Authentication Routes

#### Signup

POST /auth/signup

Request Body :
```bash 
{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Password123"
}
```
Response :
```bash 
{
    "message": "User created successfully"
}
```

---

#### Login

POST /auth/login

Request Body :
```bash 
{
    "email": "test@example.com",
    "password": "Password123"
}
```
Response :
```bash 
{
    "message": "Login successful"
}
```
JWT is stored in an HTTP-only cookie.

---

#### Get Current User

GET /auth/me

```bash 
{
    "user": {
        "id": "uuid",
        "fullName": "Test User",
        "email": "test@example.com",
        "role": "USER"
    }
}
```

---
### User Routes


#### Update Profile

PUT /users/me

Request body:

```bash 
{
    "fullName": "Updated Name",
    "email": "updated@example.com"
}
```
---

#### Change Password

PUT /users/me/password

Request body:

```bash 
{
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword123"
}
```

---

### Admin Routes (ADMIN only)

#### List Users

GET /admin/users?page=1

Response:

```bash 
{
    "data": [
        {
            "id": "uuid",
            "email": "user@example.com",
            "role": "USER",
            "status": "ACTIVE"
        }
    ]
}
```

---

#### Activate / Deactivate User

PATCH /admin/users/:id/activate

PATCH /admin/users/:id/deactivate


---

## Testing

### Backend Unit Tests

- Implemented 5 unit tests validating:
  - Password hashing
  - Password comparison
  - Input validation
  - Role-based access control

Run tests:

```bash 
cd backend 
npm test
```

### Integration Test (Bonus)

- End-to-end authentication flow tested using Supertest:
  - Signup → Login → Authenticated `/auth/me`

---

## Final Notes

- Fully responsive UI (desktop & mobile)
- Clear feedback using loaders, toasts, and modals
- Clean separation of frontend, backend, and business logic
- Follows real-world project structure and best practices

---
