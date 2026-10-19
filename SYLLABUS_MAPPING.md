# RISHI LAL JEWELLERS — Academic Syllabus Mapping & College Viva Guide

This document provides the mandatory academic mapping for **INT252 (Web App Development with ReactJS)** and **INT257 (Modern Web Application Development)**. Each syllabus unit is mapped to exact files, structural explanations, and concise oral viva answers for faculty assessment.

---

## 1. INT252: Web App Development with ReactJS — Syllabus Mapping

| Course & Unit | Syllabus Concept | Exact File / Component | How It Works in Rishi Lal Jewellers | Viva Answer (Say This to the Examiner) |
|---|---|---|---|---|
| **Unit I** | ES6+ Modern JavaScript (Arrow Functions, Destructuring, Spread/Rest, Modules, Immutability) | `frontend/src/context/CartContext.jsx`<br>`frontend/src/services/api.js` | Uses ES6 arrow functions, destructuring props (`{ product, quantity }`), spread operators (`[...prevItems, newItem]`), and pure immutable state updates in React hooks without modifying previous arrays directly. | *"We maintain immutability by using the spread operator to create shallow copies of state arrays before appending or updating cart items, which ensures predictable Virtual DOM diffing."* |
| **Unit I** | Functional Components & JSX Architecture | `frontend/src/components/product/ProductCard.jsx`<br>`frontend/src/components/common/Header.jsx` | 100% written as modern React functional components returning JSX elements with strict semantic tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`). | *"React functional components are JavaScript functions that accept props and return JSX describing what should appear on the screen. JSX compiles into React.createElement calls."* |
| **Unit II** | Component Composition, Reusable Components & Props | `frontend/src/components/common/BrandLogo.jsx`<br>`frontend/src/components/product/ProductCard.jsx` | `BrandLogo` accepts `variant`, `size`, and `showTagline` props to render appropriately across dark emerald headers, light footers, and modal headers. | *"Props allow parent components to pass data and configuration down to reusable child components, enabling modular and DRY UI architecture."* |
| **Unit II** | Conditional Rendering & State Lifting | `frontend/src/components/common/Header.jsx`<br>`frontend/src/components/cart/CartDrawer.jsx` | Conditionally renders user avatar vs. Sign In button, low-stock warnings, and cart items count badges based on state lifted to React Contexts. | *"Conditional rendering uses JavaScript ternary operators or short-circuit evaluation (`&&`) to render specific UI elements only when specific conditions or state flags are true."* |
| **Unit II** | Tailwind CSS & Responsive Breakpoints | `frontend/tailwind.config.js`<br>`frontend/src/app/globals.css` | Custom theme configured with luxury color palettes (`emerald-950`, `gold-500`, `ivory-50`). Breakpoints `sm:`, `md:`, `lg:`, `xl:` ensure flawless mobile and desktop responsiveness. | *"Tailwind CSS is a utility-first CSS framework that compiles directly into optimized CSS classes, utilizing responsive breakpoint modifiers like `md:` and `lg:` for mobile-first layout styling."* |
| **Unit III** | React Hooks: `useState`, `useEffect`, `useCallback`, `useMemo` | `frontend/src/context/CartContext.jsx`<br>`frontend/src/app/(store)/products/page.jsx` | `useState` manages local filter states; `useEffect` synchronizes local storage; `useCallback` memoizes handler functions; `useMemo` caches heavy pricing and 3% GST calculations. | *"`useState` handles reactive component state, `useEffect` executes side effects after render, `useCallback` prevents unnecessary function recreations, and `useMemo` caches computed values to avoid costly recalculations on re-renders."* |
| **Unit III** | Custom Hooks & Context Consumption | `frontend/src/context/AuthContext.jsx`<br>`frontend/src/context/CartContext.jsx`<br>`frontend/src/context/WishlistContext.jsx` | Custom hooks `useAuth()`, `useCart()`, and `useWishlist()` encapsulate Context access with validation throwing descriptive errors if used outside providers. | *"Custom hooks allow us to extract reusable stateful logic and provide clean, encapsulated access to global Context state without prop-drilling."* |
| **Unit IV** | Forms, Controlled Inputs, Client-Side Validation with Zod | `frontend/src/app/(store)/checkout/page.jsx`<br>`frontend/src/app/(auth)/login/page.jsx`<br>`frontend/src/components/common/Footer.jsx` | Built with `react-hook-form` and `@hookform/resolvers/zod`. Validates email formatting, 6-digit Indian PIN codes, 10-digit mobile numbers, and password lengths. | *"React Hook Form reduces re-renders by managing form state uncontrolled under the hood, while Zod defines declarative runtime schema validation with user-friendly error feedback."* |
| **Unit V** | Server State & Data Fetching with TanStack React Query | `frontend/src/context/Providers.jsx`<br>`frontend/src/components/home/FeaturedTabs.jsx`<br>`frontend/src/app/(store)/products/page.jsx` | TanStack Query (`useQuery`, `useMutation`) manages server caching, refetching, background revalidation, loading spinners, and error boundaries. | *"TanStack React Query handles server-state lifecycle: automatic background caching, stale-while-revalidate data fetching, loading flags, and cache invalidation upon mutations."* |
| **Unit VI** | Context API vs. Local State & LocalStorage Persistence | `frontend/src/context/CartContext.jsx`<br>`frontend/src/context/WishlistContext.jsx` | Global state (shopping bag, wishlist, user session) is managed via React Context API and persisted to client `localStorage` across page reloads. | *"Context API eliminates prop-drilling by providing a centralized communication channel for global client state like authenticated user tokens and shopping bags."* |

---

## 2. INT257: Modern Web Application Development — Syllabus Mapping

| Course & Unit | Syllabus Concept | Exact File / Component | How It Works in Rishi Lal Jewellers | Viva Answer (Say This to the Examiner) |
|---|---|---|---|---|
| **Unit I** | Next.js App Router, Nested Layouts & Dynamic Routes | `frontend/src/app/layout.jsx`<br>`frontend/src/app/(store)/layout.jsx`<br>`frontend/src/app/admin/layout.jsx`<br>`frontend/src/app/(store)/products/[id]/page.jsx`<br>`frontend/src/app/(store)/categories/[slug]/page.jsx` | Next.js App Router utilizes directory-based routing. Route groups `(store)` and `(auth)` isolate customer layouts, while `/admin` utilizes a distinct layout with RBAC protection. Dynamic parameters `[id]` and `[slug]` render product and category pages. | *"The Next.js App Router uses file-system routing based on folder hierarchy. Route groups like `(store)` share common layouts without affecting the URL structure, and dynamic folders `[id]` capture URL parameters."* |
| **Unit I** | Loading UI & Error Boundaries | `frontend/src/app/loading.jsx`<br>`frontend/src/app/error.jsx`<br>`frontend/src/app/not-found.jsx` | Next.js App Router automatically wraps route segments in React Suspense boundaries using `loading.jsx` and error boundaries with `error.jsx`. | *"`loading.jsx` creates instant loading skeletons with React Suspense, while `error.jsx` isolates runtime errors to a component boundary without crashing the whole application."* |
| **Unit II** | Server Components vs. Client Components | `frontend/src/app/(store)/page.jsx` (Server)<br>`frontend/src/components/cart/CartDrawer.jsx` (`'use client'`) | Page entry points act as Server Components by default for high performance and SEO, while interactive components requiring hooks and event listeners declare `'use client'`. | *"Server Components execute exclusively on the server, producing zero client JavaScript bundle overhead. Client Components opt-in via `'use client'` when interactivity, browser APIs, or React hooks are needed."* |
| **Unit III** | REST API Architecture & Express.js Endpoints | `backend/server.js`<br>`backend/src/app.js`<br>`backend/src/routes/*`<br>`backend/src/controllers/*` | Dedicated Express server listening on port 5001. Handles standard HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with JSON responses, status codes (`200`, `201`, `400`, `401`, `403`, `404`, `500`), and middleware chaining. | *"REST APIs use standard HTTP verbs to perform idempotent and non-idempotent CRUD actions on database resources, responding with standardized status codes and JSON payloads."* |
| **Unit IV** | JWT Authentication, Bcrypt Password Hashing & RBAC | `backend/src/middleware/auth.js`<br>`backend/src/models/User.js`<br>`backend/src/controllers/authController.js` | Passwords hashed using `bcryptjs` with salt rounds. Tokens signed with JSON Web Token (JWT) containing user ID and expiration. Middleware `protect` verifies token; `requireAdmin` enforces `role === 'admin'`. | *"Passwords are never stored in plaintext; bcrypt creates salted cryptographic one-way hashes. JWTs authenticate stateless sessions via signed bearer tokens in HTTP headers, and RBAC enforces role checks."* |
| **Unit IV** | MongoDB & Mongoose Schemas & Relationships | `backend/src/models/Product.js`<br>`backend/src/models/Order.js`<br>`backend/src/models/User.js`<br>`backend/src/config/db.js` | Mongoose schemas with data types, validators, unique indexes, text search indexes, and relational references (`ref: 'Product'`, `ref: 'User'`). Orders store an immutable historical snapshot of purchased items. | *"Mongoose provides schema-based modeling for MongoDB with schema validation, middleware hooks, and references (`ObjectId`) to link relational documents."* |
| **Unit V** | SEO Optimization, Metadata & Image Optimization | `frontend/src/app/layout.jsx`<br>`frontend/next.config.js`<br>`frontend/src/components/product/ProductCard.jsx` | Open Graph tags, descriptive titles, viewport tags, and Next.js `<Image>` component with responsive `sizes`, automatic WebP conversion, and lazy loading. | *"Next.js `<Image>` optimizes imagery by automatically resizing, converting to WebP, preventing Cumulative Layout Shift (CLS), and lazy-loading offscreen images."* |
| **Unit VI** | Production Architecture, Security & Environment Variables | `backend/src/config/constants.js`<br>`backend/.env`<br>`backend/src/app.js` | Uses Helmet for HTTP headers, CORS whitelisting, express-rate-limit on authentication, input sanitization, and environment variables for secrets. | *"Security best practices include Helmet for HTTP header protection, CORS configuration, rate-limiting against brute force, and storing secrets exclusively in `.env` files outside client bundles."* |

---

## 3. High-Probability College Viva Questions & Model Answers

### Q1: What is the Virtual DOM in React and how does reconciliation work?
**Answer:**
> "The Virtual DOM is a lightweight, in-memory JavaScript representation of the actual DOM. When component state changes, React creates a new Virtual DOM tree, runs the 'diffing algorithm' to calculate the minimal differences between the new and old trees, and batches updates to the real DOM through a process called reconciliation. This minimizes slow direct DOM manipulations."

### Q2: Why did you use Next.js App Router instead of standard React with React Router?
**Answer:**
> "Next.js App Router provides server-side rendering (SSR), static site generation (SSG), automatic code splitting, optimized image processing with `next/image`, and built-in search engine optimization (SEO) via metadata. In traditional Client-Side Rendered (CSR) React, the initial HTML payload is an empty `<div>`, which negatively impacts initial page load time and search engine indexing for an e-commerce platform."

### Q3: Why is server-side price validation mandatory during checkout?
**Answer:**
> "Browsers run on client machines where users can manipulate local state or inspect network payloads. If an application trusted the order total sent from the browser, a malicious user could alter the product price in localStorage or HTTP requests. In our Express backend (`orderController.js`), we fetch the live product price directly from the database and calculate subtotals, 3% GST, and discounts on the server before persisting the order."

### Q4: How does JWT authentication work in your application?
**Answer:**
> "When a user logs in with valid credentials, the server signs a JSON Web Token containing their user ID using a private secret key and sends it back to the client. The client stores this token in localStorage and includes it in the `Authorization: Bearer <token>` header for subsequent requests. The backend `protect` middleware decodes and cryptographically verifies the token on protected routes without needing server session state."

### Q5: How do you prevent an ordinary customer from accessing the Admin Dashboard?
**Answer:**
> "We implement defense-in-depth:
> 1. **Client-side:** The Admin Layout (`frontend/src/app/admin/layout.jsx`) inspects `user.role` from `AuthContext`. If `role !== 'admin'`, it halts rendering and presents an access denied screen.
> 2. **Server-side (Crucial):** All admin API routes (`/api/products`, `/api/orders/admin/*`, `/api/admin/*`) are protected by the `requireAdmin` Express middleware. Even if someone bypassed the client UI, the backend returns HTTP 403 Forbidden."

### Q6: What is the difference between `useCallback` and `useMemo`?
**Answer:**
> - `useMemo` caches the **result** of a calculation to avoid running expensive operations on every render (e.g., computing cart tax and totals in `CartContext.jsx`).
> - `useCallback` caches the **function definition itself** between renders so that passing callback props to child components does not trigger unnecessary re-renders.

### Q7: Why did you store a snapshot of purchased items in the Order model?
**Answer:**
> "If an order simply referenced product IDs, any future price increase, description update, or product deletion by an administrator would silently alter the historical order and invoice records. By saving an immutable snapshot of the product name, SKU, price, weight, and specifications at the moment of checkout, historical receipts remain permanent and legally accurate."

