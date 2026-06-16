# ZYRA — Full Stack Fashion Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-Backend-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payment-635BFF?style=flat-square&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-Payment-02042B?style=flat-square&logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

<p align="center">
  A production-ready MERN stack e-commerce platform with secure authentication, multi-gateway payments, real-time order tracking, and a dedicated admin dashboard.
</p>

<p align="center">
  <a href="https://zyrafashion.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_ZYRA-111827?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

---

## Overview

ZYRA is a complete fashion e-commerce solution built on the MERN stack. It delivers a polished shopping experience on the customer side while giving administrators full control over products and orders through a dedicated panel.

The platform handles everything from product discovery and cart management to payment processing, order fulfillment, and delivery verification — all in a responsive, performant interface.

---

## 🔗 Quick Links

<p align="center">
  
<a href="https://zyrafashion.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_ZYRA-111827?style=for-the-badge" alt="Live Demo"/>
  </a>
  
<a href="https://admin-zyra.vercel.app/">
  <img src="https://img.shields.io/badge/⚙️_Admin_Dashboard-2563EB?style=for-the-badge" alt="Admin Dashboard"/>
</a>

<a href="https://zyra-backend-tan.vercel.app/">
  <img src="https://img.shields.io/badge/🚀_Backend_API-059669?style=for-the-badge" alt="Backend API"/>
</a>

<a href="https://github.com/venkata-arjun/zyra-platform">
  <img src="https://img.shields.io/badge/📂_GitHub_Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"/>
</a>

</p>

---

## Features

### Customer

- Responsive landing page with latest collections and best sellers
- Product search with category and sub-category filters
- Detailed product pages with related product suggestions
- Shopping cart with quantity management
- Checkout with multiple payment methods
- Order history with real-time status tracking
- Delivery verification code system
- Profile management and password update

### Admin

- Product management — add, edit, delete, and list products
- Multi-image upload via Cloudinary
- Order management with search and filter
- View full customer and shipping details
- Update order status through the delivery pipeline

### Payments

Stripe, Razorpay, and Cash on Delivery (COD) are all supported at checkout.

---

## Tech Stack

### Frontend

- React 19, Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- JWT Authentication
- Multer, Cloudinary

### Payments

- Stripe
- Razorpay

### Deployment

- Vercel (frontend, admin, backend)
- MongoDB Atlas
- Cloudinary

---

## Architecture

```
React Frontend (Customer + Admin)
            |
        Axios REST API
            |
   Express + Node.js Server
            |
   ┌────────┼────────────┐
   |        |            |
MongoDB  Cloudinary  Payment Gateway
                    (Stripe / Razorpay)
```

---

## Order Tracking Pipeline

<p align="center">
  <img
    src="frontend/src/assets/order-tracking.png"
    alt="Order Tracking Pipeline"
    width="50%"
  />
  <br>
  <sub><b>Real-time order lifecycle from placement to successful delivery.</b></sub>
</p>

Each stage includes live status updates, payment status, delivery verification code, shipping address, and a full order summary.

---

## Folder Structure

```
zyra-platform/
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── pages/
│       ├── utils/
│       └── App.jsx
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── admin/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/venkata-arjun/zyra-platform.git
cd zyra-platform
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Admin

```bash
cd admin
npm install
npm run dev
```

---

## Environment Variables

### Frontend — `.env`

```env
VITE_BACKEND_URL=
VITE_RAZORPAY_KEY_ID=
```

### Backend — `.env`

```env
MONGODB_URI=

JWT_SECRET=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET=

STRIPE_SECRET_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

ADMIN_EMAIL=
ADMIN_PASSWORD=
```

---

## Application Flow

```
Home  →  Collections  →  Product Details  →  Cart  →  Checkout  →  Payment  →  Order Confirmation  →  Tracking  →  Delivery
```

### Admin Flow

```
Login  →  Dashboard  →  Products (Add / Edit / Delete)  →  Orders  →  Update Status  →  Customer Delivery
```

---

## Core Functionalities

- JWT-based authentication
- MongoDB data persistence
- Full product CRUD with image upload
- Shopping cart and checkout flow
- Stripe and Razorpay payment integration
- Cash on delivery support
- Order placement and real-time tracking
- Delivery verification code
- Profile and password management
- Admin product and order management

---

## Planned Improvements

- Wishlist functionality
- Product reviews and ratings
- Coupon and discount system
- Email notifications
- Inventory analytics and sales dashboard
- Admin charts
- AI product recommendations
- Dark mode
- Progressive Web App (PWA) support

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git commit -m "Add your feature description"
```

4. Push the branch

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

---

<p align="center"> <b>Rankela Venkata Arjun</b> &nbsp;|&nbsp; Full Stack MERN Developer </p>

<p align="center">
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/Project-ZYRA-0F172A?style=flat-square">
<img src="https://img.shields.io/badge/Live-Demo-111827?style=flat-square&logo=vercel&logoColor=white">
<img src="https://img.shields.io/badge/Admin-Dashboard-2563EB?style=flat-square&logo=vercel&logoColor=white">
<img src="https://img.shields.io/badge/Backend-API-16A34A?style=flat-square&logo=node.js&logoColor=white">
</p>


<p align="center">Built with the MERN Stack and deployed on Vercel.</p>
