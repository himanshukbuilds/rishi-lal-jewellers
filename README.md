# RISHI LAL JEWELLERS — Haute Joaillerie & Fine Indian Jewelry E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3_Functional_Hooks-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21_REST_API-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.7-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4_Luxury_Design-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

> **Academic Submission:** Full-Stack Web Development Project for **INT252** (Web App Development with ReactJS) & **INT257** (Modern Web Application Development).

---

## 1. Project Overview & Brand Identity

**Rishi Lal Jewellers** is a full-stack luxury jewelry e-commerce platform inspired by the elegance, trust, and shopping heritage of iconic Indian jewelry houses like Tanishq and Kalyan Jewellers. It presents an original identity crafted with warm ivory, deep forest emerald, and champagne gold aesthetics.

### Brand Parameters:
- **Brand Name:** RISHI LAL JEWELLERS
- **Tagline:** *Timeless Elegance. Crafted for You.*
- **Category:** Haute Joaillerie & Fine Indian Jewelry
- **Currency:** Indian Rupees (₹)
- **Primary Market:** India (All 28 States & UTs, 26,000+ PIN Codes)
- **Configurability:** All brand details (name, tagline, logo image, address, phone numbers, social media links, live benchmark gold rates) are centrally managed in `frontend/src/config/brandConfig.js`.

---

## 2. Key Features

### 🛍️ Customer Storefront
- **Luxury Hero & Editorial Layouts:** Grand typography, royal trousseau showcase, and curated jewelry collections.
- **Dynamic Category & Collection Browsing:** Dedicated routes for Gold, Diamond, Bridal, Earrings, Rings, Necklaces, Bangles, and Gifts.
- **Real-Time Search & Multi-Faceted Filters:** Live keyword search, metal purity filters (22K Yellow Gold, 18K Rose/White Gold), price sliders/tiers, and sorting options.
- **Comprehensive Product Details:** Multi-image gallery with zoom, metal weights (gross vs net gold weight), gemstone specifications table, ring/bangle size selectors, care instructions, and 6-digit Indian PIN code delivery estimation checker.
- **Shopping Bag & Coupon Demonstrations:** Dynamic 3% Indian jewellery GST calculation, complimentary insured delivery progress bar, and working demo coupon codes (`RISHILAL10`, `BRIDAL5000`).
- **Luxury Checkout Experience:** Zod-validated shipping address forms, simulated payment options (Credit/Debit Card, UPI / Net Banking, and Cash on Delivery), and order confirmation receipt generation with unique tracking consignments (`IND-EXP-...`).
- **Patron Account & Trousseau Management:** Customer registration, login, profile management, multiple delivery addresses book, past order history with live status trackers, and curated wishlist.

### 👑 Dedicated Admin Portal & Operations
- **Strict Role-Based Access Control (RBAC):** Dedicated admin login page (`/admin/login`) with middleware enforcement; ordinary customer accounts are blocked on both client and backend routes.
- **Executive Operations Dashboard:** Live demo gross revenue counter, total order count, active products count, registered patrons, interactive sales charts, and low-stock depletion alerts.
- **Product Catalog Management (CRUD):** Live search, category filtering, "Add New Creation" modal, "Edit Specifications" modal, and "Delete Creation" confirmation with real-time MongoDB database persistence.
- **Order Fulfillment Operations:** Inspect customer order dossiers, view item snapshots, and live status updating dropdowns (Confirmed → Crafting & Hallmark → In Armored Transit → Delivered) that sync with the database.
- **Patron Directory:** Search registered patrons, inspect order frequency, and view lifetime spend in Indian Rupees.

---

## 3. Technology Stack & Rationale

| Layer | Technologies | Justification |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | Provides Server-Side Rendering (SSR), Static Site Generation (SSG), automatic image optimization, nested layouts, and robust SEO capabilities. |
| **UI & Styling** | **Tailwind CSS 3.4** | Utility-first CSS allowing bespoke luxury design tokens (emerald-950, champagne gold, ivory) without heavy CSS runtime overhead. |
| **Icons & Media** | **Lucide React** | Clean, accessible SVG iconography with consistent line weight matching fine jewelry aesthetics. |
| **Form Management** | **React Hook Form + Zod** | High-performance uncontrolled form state reducing unnecessary re-renders, paired with schema-first validation. |
| **Server State** | **TanStack Query (React Query v5)** | Declarative server-state fetching, background caching, optimistic mutations, and loading/error states. |
| **Client State** | **React Context API** | Dedicated contexts (`AuthContext`, `CartContext`, `WishlistContext`) with `localStorage` persistence. |
| **Backend API** | **Node.js & Express.js** | Fast, decoupled REST API architecture with modular routers, controllers, and middleware. |
| **Database** | **MongoDB & Mongoose 8.7** | Flexible document database for complex hierarchical jewelry specifications and historical order snapshots, featuring an embedded in-memory fallback for reliable demonstration on any machine. |
| **Security & Auth** | **JWT, Bcrypt.js, Helmet, Rate-Limit** | Salted cryptographic password hashing, stateless bearer token authorization, rate-limiting on authentication, and HTTP security headers. |

---

## 4. Architecture & Directory Structure

```text
Jewelry-Shop/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js (MongoDB + Memory fallback), constants.js
│   │   ├── models/          # User.js, Product.js, Category.js, Order.js, Coupon.js
│   │   ├── controllers/     # authController, productController, orderController, etc.
│   │   ├── routes/          # authRoutes, productRoutes, orderRoutes, adminRoutes, etc.
│   │   ├── middleware/      # auth.js (JWT protect & requireAdmin), errorHandler.js
│   │   └── seeds/           # seed.js (16 luxury products, demo accounts, coupons, orders)
│   ├── app.js               # Express app configuration & middleware
│   ├── server.js            # Server entrypoint with auto-seeding
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (store)/     # Customer routes: Home, Products, Categories, Cart, Checkout, Account
│   │   │   ├── (auth)/      # Login, Register, Forgot Password
│   │   │   ├── admin/       # Dedicated Admin Login, Dashboard, Products, Orders, Customers
│   │   │   ├── layout.jsx   # Root layout with fonts, metadata & providers
│   │   │   ├── globals.css  # Luxury design system & typography
│   │   │   ├── error.jsx    # Global error boundary
│   │   │   └── not-found.jsx# 404 handler
│   │   ├── components/      # Common (BrandLogo, Header, Footer), Home, Product, Cart
│   │   ├── context/         # AuthContext, CartContext, WishlistContext, Providers
│   │   ├── services/        # api.js (Express client with bearer token injection)
│   │   └── config/          # brandConfig.js (Central brand identity & settings)
│   ├── public/              # Images, uploaded logo (/images/logo.png)
│   ├── tailwind.config.js   # Emerald, gold, ivory color palettes
│   └── package.json
├── SYLLABUS_MAPPING.md      # Detailed INT252 & INT257 viva mapping guide
├── package.json             # Root workspace runner
└── README.md
```

---

## 5. Demo Credentials

The platform is pre-seeded with two documented accounts:

| Role | Email Address | Password | Privileges |
|---|---|---|---|
| **Administrator** | `admin@rishilaljewellers.demo` | `Admin@123` | Full access to Admin Portal, Product CRUD, Order Status Updates, Customer Directory |
| **Customer Patron** | `customer@rishilaljewellers.demo` | `Customer@123` | Storefront browsing, Wishlist, Bag, Checkout, Order History, Address Book |

*(Note: Legacy evaluation emails `admin@aureliajewels.demo` and `customer@aureliajewels.demo` remain supported as backward-compatible demo aliases).*

> **Security Note:** In production, demo accounts should be disabled, and privileged administrative credentials must be provisioned through secure environment secrets rather than development seed scripts.

---

## 6. Installation & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or later (v24 recommended)
- **NPM**: v9.0.0 or later
- **MongoDB**: (Optional) A local MongoDB service on `mongodb://127.0.0.1:27017`. If MongoDB is not running, the application automatically launches an embedded in-memory demonstration MongoDB instance with zero configuration required!

### Step 1: Clone or Navigate to the Workspace
```bash
cd Jewelry-Shop
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 3: Seed the Database
```bash
cd backend
npm run seed
```
*Seeds 16 luxury jewelry creations, 8 categories, 3 promotional coupons, 3 realistic historical orders, and the demo accounts.*

### Step 4: Launch Backend & Frontend Servers

**Terminal 1 — Express REST API (Port 5001):**
```bash
cd backend
npm run dev
# Server running at: http://localhost:5001
# Health check: http://localhost:5001/api/health
```

**Terminal 2 — Next.js App Router Frontend (Port 3000):**
```bash
cd frontend
npm run dev
# Client running at: http://localhost:3000
```

---

## 7. REST API Endpoints Reference

### Public Customer Endpoints
- `GET /api/health` — API health check and uptime status
- `POST /api/auth/register` — Register a new customer account
- `POST /api/auth/login` — Authenticate customer or admin (returns JWT)
- `GET /api/products` — Filtered, sorted, paginated product catalog
- `GET /api/products/highlights` — Curated bestsellers, new arrivals, and bridal sets
- `GET /api/products/:identifier` — Single product details by slug or ObjectId
- `GET /api/categories` — List all fine jewelry categories
- `POST /api/coupons/validate` — Validate promotional discount codes
- `POST /api/orders` — Create a new order with server-side price validation

### Protected Customer Endpoints (`Authorization: Bearer <token>`)
- `GET /api/auth/me` — Current patron profile & wishlist
- `PUT /api/auth/profile` — Update name or phone number
- `POST /api/auth/address` — Save new delivery address
- `DELETE /api/auth/address/:addressId` — Delete delivery address
- `POST /api/auth/wishlist/toggle` — Toggle product in patron wishlist
- `GET /api/orders/my-orders` — Patron personal order history

### Protected Admin Endpoints (`role: 'admin'`)
- `GET /api/admin/dashboard-stats` — Gross revenue, order counts, charts data, inventory alerts
- `GET /api/admin/customers` — Directory of registered patrons and spend metrics
- `POST /api/products` — Add a new creation to the catalog
- `PUT /api/products/:id` — Update existing product details, stock, or price
- `DELETE /api/products/:id` — Permanently delete a creation
- `GET /api/orders/admin/all` — Inspect all orders across the platform
- `PATCH /api/orders/:id/status` — Update order fulfillment status (`confirmed`, `crafting`, `shipped`, `delivered`, `cancelled`)

---

## 8. College Viva Preparation & Syllabus Alignment

For full course mapping, component locations, and sample viva answers, please refer to:
📄 [**SYLLABUS_MAPPING.md**](./SYLLABUS_MAPPING.md)

