# 💎 JewellerySphere – Shop Management System

### 🔗 Live Demo  
- **Owner Portal**: [https://jewellery-shop-owner.netlify.app/](https://jewellery-shop-owner.netlify.app/)  
- **Customer Portal**: [https://jewellery-shop-consumer.netlify.app/](https://jewellery-shop-consumer.netlify.app/)  
---

## 📌 Overview

**JewellerySphere** is a full-featured, digitized jewellery shop management system built using the **MERN stack**. It provides role-specific interfaces for **owners** and **customers**, focusing on digital workflows, real-time insights, and paperless operations.

---

## ✅ Key Highlights

- 📄 **Digitized Shop Operations**: Handled sales, loans, inventory, and customer records digitally—reducing 90% paper usage.
- 🔐 **Secure Portals with JWT**: Separate Owner and Customer Portals with protected routes and personalized dashboards.
- 🧠 **Smart Features**:
  - Loan and purchase tracking  
  - Real-time inventory control  
  - Detailed customer profiling  
- 🧾 **Clean, Responsive UI**: Built using Tailwind CSS for modern, mobile-friendly interfaces.
- 🔄 **Redux Integration**: For global state management in both portals.
- 📊 **Transparency & Efficiency**: Empowers owners and customers with up-to-date information and seamless workflows.

---

🛠️ Tech Stack
Frontend (Owner & Customer): React.js, Tailwind CSS, Redux Toolkit

Backend: Node.js, Express.js, MongoDB, JWT for Authentication

Deployment: Netlify (Portals), On render (Backend)

📁 Project Structure
JewellerySphere/
│
├── backend/ → Express + MongoDB backend with JWT Auth
├── owner/ → Owner Portal - React + Tailwind + Redux
├── frontend/ → Customer Portal - React + Tailwind + Redux
└── README.md → Project documentation

📦 Install Dependencies
Backend
cd backend
npm install

Owner Portal
cd ../owner
npm install

Customer Portal
cd ../frontend
npm install

▶️ Run the Project
Start Backend Server
cd backend
npm start

Start Owner Portal (React Dev Server)
cd ../owner
npm start

Start Customer Portal (React Dev Server)
cd ../frontend
npm start

🔐 Backend .env Example
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Make sure to place this .env file inside the backend/ folder before starting the server.

- **Frontend (Owner & Customer)**: React.js, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB, JWT for Authentication
- **Deployment**: Netlify (Portals), on render (Backend)

---
