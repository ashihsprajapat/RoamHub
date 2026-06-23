# 🏠 RoamHub – Full Stack Accommodation Booking Platform

RoamHub is a modern Airbnb-inspired accommodation booking platform built using the MERN stack. It enables travelers to discover properties, make secure bookings, complete online payments, and leave reviews, while hosts can efficiently manage listings and monitor business performance through an interactive dashboard.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure user registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Protected routes and role-based access control

### 🏡 Property Listings Management

* Create, update, delete, and manage listings
* Upload and optimize property images using Cloudinary
* View detailed listing information
* Host-specific listing management

### 📅 Smart Booking System

* Real-time property booking
* Availability checking before reservation
* Custom date validation to prevent invalid bookings
* Check-in and check-out date verification

### 💳 Secure Online Payments

* Razorpay payment gateway integration
* Secure booking transactions
* Payment verification and transaction tracking

### ⭐ Reviews & Ratings

* Guests can submit reviews and ratings
* Property review aggregation
* Improved trust and transparency for travelers

### 📊 Host Dashboard

* Manage all property listings
* Create, edit, and delete listings
* View upcoming bookings
* Monitor booking activity
* Revenue and booking analytics
* Interactive graphs and charts for insights

### ⚡ Performance Optimization

* Redis caching for low-latency responses
* Faster property retrieval
* Reduced database load
* Improved user experience

### ✅ Backend Data Validation

* Zod schema validation
* Request payload validation
* Secure API input handling
* Consistent data integrity across endpoints

---

## 🏗️ Architecture

### MongoDB

Used for storing:

* Property Listings
* Property Details
* Images Metadata
* Search & Listing Information

### PostgreSQL

Used for storing:

* Users
* Bookings
* Transactions
* Reviews
* Ratings
* Dashboard Analytics Data

### Prisma ORM

* Type-safe database access
* Query optimization
* PostgreSQL schema management
* Database migrations

### Redis

* Frequently accessed data caching
* Low latency responses
* Improved API performance

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* PostgreSQL
* Prisma ORM
* Redis
* JWT Authentication
* bcrypt
* Zod
* dotenv
* CORS

### Third-Party Services

* Razorpay (Payment Gateway)
* Cloudinary (Image Storage)

---

## 📊 Dashboard Analytics

The host dashboard provides:

* Total Listings
* Total Bookings
* Upcoming Reservations
* Revenue Overview
* Booking Trends
* Property Performance Metrics
* Graph-Based Analytics

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing with bcrypt
* Protected API Routes
* Zod Input Validation
* Payment Verification
* Environment Variable Management

---

## 🌐 API Features

* RESTful API Architecture
* Modular Controller Structure
* Scalable Service Layer
* Redis Caching Layer
* Error Handling Middleware
* Centralized Validation System

---

## 📸 Media Management

Cloudinary integration enables:

* Secure Image Uploads
* Image Optimization
* Fast Content Delivery
* Property Gallery Management

---

## 🎯 Key Highlights

* Full Stack MERN Architecture
* MongoDB + PostgreSQL Hybrid Database Design
* Prisma ORM Integration
* Redis Caching for High Performance
* Razorpay Payment Integration
* Interactive Host Dashboard
* Real-Time Booking Management
* Zod-Based Backend Validation
* Cloudinary Media Storage
* Scalable REST API Design

---

## 🚀 Future Enhancements

* Email Notifications
* Push Notifications
* Elasticsearch-Based Search
* Real-Time Chat
* Wishlist Functionality
* AI-Powered Property Recommendations

---

### Built with ❤️ using MERN Stack, PostgreSQL, Prisma, Redis, Razorpay, Cloudinary, and Zod.
