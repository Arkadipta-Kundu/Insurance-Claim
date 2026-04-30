🛡️ Insurance Claim Verification System

A Full-Stack Insurance Claim Verification System built using React (Frontend) and Spring Boot (Backend) that enables secure claim submission, biometric-based identity verification, document upload, and automated certificate generation.

🚀 Project Overview

This application is designed to streamline and secure the insurance claim process. It ensures:

🔐 Secure authentication using JWT
👤 Biometric enrollment for user identity verification
📄 Secure document upload for claims
🧾 Automated certificate generation
🧠 Backend validation and verification logic
💻 Modern responsive frontend UI

The goal of this system is to reduce fraud, improve verification speed, and provide a seamless claim experience.

🏗️ Tech Stack
🎨 Frontend
React.js
HTML5
CSS3
JavaScript
Axios (for API calls)
⚙️ Backend
Spring Boot
Java
REST APIs
JWT Authentication
Maven
🗄️ Database
(Mention your database here, e.g., MySQL / PostgreSQL / H2)
📂 Project Structure
Insurance-Claim/
│
├── frontend/                # React Application
│
├── backend/insurance-backend/   # Spring Boot Application
│
└── README.md
✨ Features
✅ User Registration & Login
🔐 JWT-based Authentication & Authorization
👤 Biometric Enrollment System
📤 Secure Claim Document Upload
📑 Claim Status Tracking
🧾 Automated Verification Certificate Generation
🛡️ Backend Validation & Secure APIs
🔧 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/ambapalidatta/Insurance-Claim.git
cd Insurance-Claim
2️⃣ Backend Setup (Spring Boot)
cd backend/insurance-backend
Configure application.properties with your database credentials.
Build the project:
mvn clean install
Run the application:
mvn spring-boot:run

Backend will run on:

http://localhost:8080
3️⃣ Frontend Setup (React)
cd frontend
npm install
npm start

Frontend will run on:

http://localhost:3000
🔐 Authentication Flow
User registers and logs in.
Backend generates a JWT token.
Token is stored on the client side.
All protected API calls include the JWT in headers.
Backend validates token before processing requests.
📸 Screenshots


🧠 System Architecture (High-Level)

Frontend (React)
⬇ REST API Calls
Backend (Spring Boot)
⬇
Database

JWT secures all protected routes.

🛡️ Security Measures

Password encryption
JWT authentication
Role-based access control (if implemented)
Secure file upload validation
📌 Future Improvements
🔔 Email notifications for claim updates
📊 Admin dashboard with analytics
🌐 Deployment on cloud (AWS / Azure)
🤖 AI-based fraud detection

👩‍💻 Author

Ambapali Datta
BTech Computer Science Student
Passionate about Full-Stack Development & Secure Systems

⭐ If You Like This Project

Give it a star ⭐ and feel free to fork and improve!
