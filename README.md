# FreelanceHub – A Freelance Marketplace Platform

FreelanceHub is a comprehensive full-stack freelance marketplace that empowers clients to post projects and allows freelancers to bid on them. Users can efficiently browse projects and freelancers utilizing advanced searching, sorting, filtering, and pagination functionalities.
It offers an end-to-end workflow, ensuring a robust platform for project management, application bidding, and authentication.

## 📌 Problem Statement

The freelance market is expanding rapidly, but users often face challenges such as:
- Complex or poorly structured user interfaces on existing platforms
- Lack of intelligent project discovery and matching features
- Inefficient navigation missing flexible search, filter, sort & pagination capabilities
- Difficulty finding the right freelancers for specific project requirements

FreelanceHub addresses these issues by offering a clean, intuitive, and feature-rich system backed by a robust REST API and an interactive frontend.

## 📊 Database Entity-Relationship Diagram

*This ER Diagram illustrates the relationships between Users (Clients, Freelancers, Admins), Projects, and Applications.*

![ER Diagram](./diagram/er_diagram.png)

## 🏗️ System Architecture & Tech Stack

**Frontend** → **Backend (REST API)** → **Database**

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (v19), React Router, Axios, Custom CSS (Light/Dark Mode) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | JWT (JSON Web Token), bcrypt |

## ⭐ Key Features

| Category | Features |
| :--- | :--- |
| **Authentication & Authorization** | JWT login/signup, role-based access (Client/Freelancer/Admin) |
| **Project Management** | Create, Read, Update, Delete for Projects. Search, filter, and apply |
| **Advanced Discovery** | Search projects/freelancers, filter by categories/skills, sort by budget/date, and pagination |
| **Application & Bidding** | Freelancers can submit bids/cover letters, clients can manage applications |
| **Modern Aesthetics** | Fully featured custom UI with responsive design and theme support |

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or above recommended)
- PostgreSQL Database
- npm or pnpm

### 1. Clone the repository
```bash
git clone <repository_url>
cd freelancehub
```

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:
```env
# Server Configuration
SERVER_PORT=5001

# Frontend URLs
FRONTEND_LOCAL_URL=http://localhost:3000
FRONTEND_SERVER_URL=https://your-frontend.com

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/freelancehub"

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

Run Prisma migrations/generate:
```bash
npx prisma generate
npx prisma db push
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory based on `.env.example`:
```env
REACT_APP_BACKEND_LOCAL_URL=http://localhost:5001
REACT_APP_BACKEND_SERVER_URL=https://freelancehub-1efa.onrender.com

REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_FRONTEND_SERVER_URL=https://freelancehub-uhtv.vercel.app/
```

Start the frontend application:
```bash
npm start
```

## 📡 API Overview (Sample Routes)

### Auth APIs
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Project APIs
- `GET /api/projects` - Get all projects (supports search, sort, filter, pagination)
- `POST /api/projects` - Create a new project (Client only)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (Client only)
- `DELETE /api/projects/:id` - Delete project (Client only)

### Application APIs
- `POST /api/applications` - Submit an application with a bid amount (Freelancer only)
- `GET /api/applications/project/:projectId` - View applications for a project (Client only)

*(Note: API routes are modularly separated and protected using middleware in the backend codebase).*
