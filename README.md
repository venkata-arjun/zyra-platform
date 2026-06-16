# ZYRA — Fashion Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=flat-square&logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

<p align="center">
  A production-ready full stack fashion e-commerce platform built with the MERN stack.<br/>
  Secure authentication, multi-gateway payments, real-time order tracking, and a dedicated admin dashboard.
</p>

<p align="center">
  <a href="https://zyrafashion.vercel.app/"><img src="https://img.shields.io/badge/Customer Store-111827?style=flat-square&logo=vercel&logoColor=white" /></a>
  &nbsp;
  <a href="https://admin-zyra.vercel.app/"><img src="https://img.shields.io/badge/Admin Dashboard-2563EB?style=flat-square&logo=vercel&logoColor=white" /></a>
  &nbsp;
  <a href="https://zyra-server.vercel.app/"><img src="https://img.shields.io/badge/Backend API-16A34A?style=flat-square&logo=node.js&logoColor=white" /></a>
  &nbsp;
  <a href="https://github.com/venkata-arjun/zyra-platform"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" /></a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Live Links](#live-links)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Order Tracking](#order-tracking)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Application Flow](#application-flow)
- [Contributing](#contributing)
- [Developer](#developer)

---

## Overview

ZYRA is a complete fashion e-commerce solution built on the MERN stack. It provides a seamless shopping experience for customers and full operational control for administrators through a separate admin panel.

The platform covers the entire e-commerce lifecycle — from product discovery and cart management to payment processing, order fulfillment, and verified delivery — across a fully responsive interface.

---

## Live Links

| Service | URL |
|---|---|
| Customer Store | https://zyrafashion.vercel.app |
| Admin Dashboard | https://admin-zyra.vercel.app |
| Backend API | https://zyra-server.vercel.app |
| GitHub | https://github.com/venkata-arjun/zyra-platform |

---

## Features

### Customer

- Responsive landing page with latest collections and best sellers
- Product search with category and sub-category filters
- Product detail pages with related product suggestions
- Shopping cart with quantity management
- Secure checkout with multiple payment options
- Order history with real-time status tracking
- Delivery verification code on each order
- Profile management and password update

### Admin

- Add, edit, delete, and list products
- Multi-image upload per product via Cloudinary
- Order management with search and status filters
- View full customer details and shipping addresses
- Update order status at every stage of the delivery pipeline

### Payments

Three payment methods supported at checkout — Stripe, Razorpay, and Cash on Delivery (COD).

---

## Tech Stack

**Frontend**

| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| Tailwind CSS | Utility-first styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Lucide React | Icon library |

**Backend**

| Tool | Purpose |
|---|---|
| Node.js + Express.js | Server and REST API |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication |
| Multer + Cloudinary | File upload and image storage |

**Payments**

| Gateway | Type |
|---|---|
| Stripe | Card payments |
| Razorpay | UPI, cards, netbanking |
| Cash on Delivery | Offline payment |

**Deployment**

| Service | Usage |
|---|---|
| Vercel | Frontend, Admin, Backend |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN |

---

## Architecture

```
┌──────────────────────────────────┐
│   React Frontend  (Customer)     │
│   React Frontend  (Admin)        │
└─────────────────┬────────────────┘
                  │  Axios  REST API
┌─────────────────▼────────────────┐
│   Express + Node.js  Server      │
└──────┬──────────────────┬────────┘
       │                  │
  ┌────▼──────┐   ┌───────▼──────────────┐
  │  MongoDB  │   │  Cloudinary           │
  │  Atlas    │   │  (Image Storage)      │
  └───────────┘   └──────────────────────┘
       │
┌──────▼─────────────────────┐
│  Payment Gateways           │
│  Stripe / Razorpay / COD   │
└────────────────────────────┘
```

---

## Order Tracking

Every order moves through the following stages in real time:

```
Order Placed  →  Packed  →  Shipped  →  Out for Delivery  →  Delivered
```

Each stage displays live status, payment status, a delivery verification code, the shipping address, and a full order summary.

---

## Folder Structure

```
zyra-platform/
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── pages/
│       ├── utils/
│       └── App.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── admin/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
│
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/venkata-arjun/zyra-platform.git
cd zyra-platform
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend

```bash
cd ../backend
npm install
npm run dev
```

### 4. Admin Panel

```bash
cd ../admin
npm install
npm run dev
```

The frontend and admin panels each run on their own Vite dev server. The backend runs as a separate Node process. Make sure all environment variables are configured before starting.

---

## Environment Variables

### Frontend — `frontend/.env`

```env
VITE_BACKEND_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Backend — `backend/.env`

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

---

## Application Flow

**Customer journey**

```
Home  →  Collections  →  Product Details  →  Add to Cart  →  Checkout  →  Payment  →  Order Confirmation  →  Order Tracking  →  Delivery
```

**Admin journey**

```
Login  →  Dashboard  →  Manage Products (Add / Edit / Delete)  →  Manage Orders  →  Update Order Status  →  Delivery Confirmed
```

---

## Planned Improvements

- Wishlist and saved items
- Product reviews and ratings
- Coupon and discount system
- Email notifications for orders
- Sales analytics dashboard with charts
- AI-powered product recommendations
- Dark mode
- Progressive Web App (PWA) support

---

## Contributing

Contributions are welcome. Please follow the steps below.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git commit -m "Add: brief description of the change"
```

4. Push your branch

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request on GitHub with a clear description of what was changed and why.

---

## Developer

**Rankela Venkata Arjun** — Full Stack MERN Developer

| | |
|---|---|
| GitHub | https://github.com/venkata-arjun |
| Repository | https://github.com/venkata-arjun/zyra-platform |
| Live Store | https://zyrafashion.vercel.app |
| Admin Panel | https://admin-zyra.vercel.app |
| Backend API | https://zyra-server.vercel.app |

---

<p align="center">Built with the MERN Stack — React, Express, MongoDB, Node.js — and deployed on Vercel.</p>
