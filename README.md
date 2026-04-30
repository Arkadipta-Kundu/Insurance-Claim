# 🛡️ Insurance Claim Verification System

<p align="center">
  <b>A Secure Full-Stack Insurance Claim Management & Verification Platform</b><br>
  Built with React & Spring Boot
</p>

---

## 📌 Problem Statement

Insurance claim processes are often slow, manual, and vulnerable to fraud. This system aims to digitize and secure the claim workflow using authentication, document verification, and biometric identity validation.

---

## 🚀 Project Overview

The **Insurance Claim Verification System** is a full-stack web application that enables users to securely submit insurance claims while ensuring identity validation and backend verification.

### 🎯 Core Objectives

* Reduce fraudulent claims
* Automate verification workflows
* Improve claim processing efficiency
* Ensure secure authentication & authorization

---

## 🏗️ Tech Stack

### 🎨 Frontend

* React.js
* HTML5
* CSS3
* JavaScript (ES6+)
* Axios (API integration)

### ⚙️ Backend

* Spring Boot
* Java
* RESTful APIs
* JWT Authentication
* Maven

### 🗄️ Database

* (Add your database here: MySQL / PostgreSQL / H2)

---

## 📂 Project Structure

```
Insurance-Claim/
│
├── frontend/                    # React Application
│
├── backend/
│   └── insurance-backend/       # Spring Boot Application
│
└── README.md
```

---

## ✨ Key Features

* ✅ User Registration & Secure Login
* 🔐 JWT-Based Authentication & Authorization
* 👤 Biometric Enrollment & Identity Verification
* 📤 Secure Insurance Claim Submission
* 📄 Document Upload & Validation
* 📑 Claim Status Tracking
* 🧾 Automated Certificate Generation
* 🛡️ Backend Input Validation & Secure APIs

---

## 🔄 Application Flow

1. User registers and logs in.
2. Backend authenticates user and generates a JWT token.
3. Token is stored on the client side.
4. Protected API requests include JWT in the Authorization header.
5. Backend validates token before processing.
6. Claims are verified and certificate is generated.

---

## 🧠 System Architecture

```
Frontend (React)
        ↓
   REST API Calls
        ↓
Backend (Spring Boot)
        ↓
     Database
```

JWT secures all protected endpoints.

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ambapalidatta/Insurance-Claim.git
cd Insurance-Claim
```

---

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend/insurance-backend
```

* Configure `application.properties` with database credentials.

Build the project:

```bash
mvn clean install
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔐 Security Measures

* Password encryption
* JWT-based authentication
* Secure file upload validation
* Role-based access control (if implemented)

---

## 📸 Screenshots

(Add application screenshots here for better visualization)

```
/screenshots/login.png
/screenshots/dashboard.png
```

---

## 📌 Future Enhancements

* 🔔 Email notifications for claim updates
* 📊 Admin analytics dashboard
* 🌐 Cloud deployment (AWS / Azure)
* 🤖 AI-based fraud detection system

---

## 👩‍💻 Author

**Ambapali Datta**
BTech Computer Science Student
Full-Stack Development Enthusiast

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Contributions and suggestions are welcome!
