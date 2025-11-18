FreelanceHub – A Freelance Marketplace Platform

FreelanceHub is a full-stack freelance marketplace that enables clients to post projects, freelancers to bid on them, and users to easily browse projects using searching, sorting, filtering, and pagination.
It provides an end-to-end workflow with authentication, project management, bidding, reviews, and a production-ready deployment setup.

📌 1. Problem Statement

The freelance market is growing rapidly, yet both clients and freelancers struggle due to:

Complex or cluttered UI on existing platforms

Lack of smart project discovery features

Inefficient navigation due to missing search, filter, sort & pagination

Difficulty matching the right freelancers to the right projects

FreelanceHub solves this by offering a clean, intuitive system with a powerful backend and seamless frontend integration.

🏗️ 2. System Architecture
Frontend  →  Backend (REST API)  →  Database

Tech Components

Frontend: React.js, React Router, Axios, TailwindCSS

Backend: Node.js + Express.js

Database: MySQL

Authentication: JWT (JSON Web Token)

Hosting

Frontend → Vercel

Backend → Render / Railway

Database → Aiven / PlanetScale (MySQL Cloud)

⭐ 3. Key Features
Category	Features
Authentication & Authorization	JWT-based login & signup, role-based access (Client / Freelancer)
CRUD Operations	Create, Read, Update, Delete for Projects, Bids & Reviews
Search, Sort, Filter & Pagination	Search by title/skills, filter by category & budget, sort by date/budget, paginate results
Frontend Routing	Home, Login, Signup, Dashboard, Project Details, Profile
Bidding System	Freelancers can submit bids, clients can view/select bids
Reviews & Ratings	Clients & freelancers can rate after project completion
Hosting	Fully deployed frontend + backend + database

🖥️ 4. Tech Stack
Layer	Technologies
Frontend	React.js, React Router, Axios, TailwindCSS
Backend	Node.js, Express.js
Database	MySQL
Authentication	JWT
Hosting Services	Vercel (Frontend), Render/Railway (Backend), Aiven/PlanetScale (Database)


📡 5. API Overview
Auth APIs
Endpoint	Method	Description	Access
/api/auth/signup	POST	Register new user	Public
/api/auth/login	POST	Login + JWT token	Public
Project APIs
Endpoint	Method	Description	Access
/api/projects	GET	Get all projects with search/sort/filter/pagination	Authenticated
/api/projects	POST	Create a new project	Client only
/api/projects/:id	GET	Get project details	Authenticated
/api/projects/:id	PUT	Update project	Client only
/api/projects/:id	DELETE	Delete project	Client only
/api/projects/search	GET	Search projects by keyword	Authenticated
/api/projects/filter	GET	Filter by category, budget, skill	Authenticated
/api/projects/sort	GET	Sort by date/budget	Authenticated
/api/projects/paginate	GET	Pagination	Authenticated
Bid APIs
Endpoint	Method	Description	Access
/api/bids/:projectId	POST	Submit bid	Freelancer only
/api/bids/:projectId	GET	View all bids on project	Client only
Review APIs
Endpoint	Method	Description	Access
/api/reviews/:id	POST	Submit project review	Authenticated
Freelancer APIs
Endpoint	Method	Description	Access
/api/freelancers	GET	List freelancers (with search, sort, filter, pagination)	Authenticated
/api/freelancers/search	GET	Search freelancers by skill/name	Authenticated
/api/freelancers/filter	GET	Filter by rating, category, experience	Authenticated
