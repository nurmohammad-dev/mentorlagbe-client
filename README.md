# MentorLagbe — Smart Tuition & Academic Mentorship Platform

**MentorLagbe** is a full-stack tuition discovery, enrollment, and mentorship management platform connecting students with verified academic tutors across online and offline learning modes.

## Live Deployments

- **Frontend (Live App):** [https://mentorlagbe-client-zeta.vercel.app](https://mentorlagbe-client-zeta.vercel.app)
- **Backend API:** [https://mentorlagbe-server-ten.vercel.app](https://mentorlagbe-server-ten.vercel.app)

---

## Key Features

### 1. Authentication & Role-Based Access Control
- Powered by **Better Auth** supporting **Email/Password** registration and **Google OAuth** sign-in.
- Real-time password strength validation (minimum 8 characters, uppercase letter, number, and special character) with confirmation matching.
- Protected routes and authenticated API requests (`authFetch`) across three distinct user roles: **Student**, **Tutor**, and **Admin**.

### 2. Tuition Discovery & Filtering
- **Browse Approved Tuitions:** Server-side keyword search (by title, subject, tutor, or location) combined with multi-criteria filtering by **Subject**, **Class Level**, and **Learning Mode** (`Online` / `Offline`).
- **Sorting & Pagination:** Sort listings by newest or monthly fee (low-to-high / high-to-low) with server-side pagination.
- **Protected Tuition Details:** Authenticated detail view featuring batch schedules, mentor contact info, and an interactive enrollment application modal.

### 3. Role-Based Dashboards
- **Student Dashboard:** Track submitted tuition applications, view approval statuses, and manage subscription plans.
- **Tutor Dashboard:** Publish and manage tuition batches, review incoming student applications, and accept or reject enrollment requests.
- **Admin Dashboard:** Approve or moderate tuition listings, manage platform users and roles, and monitor platform-wide activity.

### 4. Freemium & Stripe Pro Subscriptions
- **Free Tier:** Up to 2 active tuition posts for Tutors and up to 5 tuition applications for Students.
- **Pro Tier ($10):** Unlimited tuition batch posts/applications, verified Pro status badge, and secure checkout via **Stripe**.

---

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide React
- **Authentication:** Better Auth (Session & Google OAuth)
- **Payments:** Stripe Checkout Integration
- **Deployment:** Vercel

---

## Project Structure

```text
src/
├── app/
│   ├── (auth)/          # Sign In & Sign Up pages
│   ├── (dashboard)/     # Protected Student, Tutor & Admin dashboards
│   └── (root)/          # Public & browsing routes (Home, Browse Tuitions, Tuition Details, Pricing, About)
├── components/
│   ├── shared/          # Reusable components (Navbar, Footer, TuitionCard)
│   └── ui/              # shadcn/ui primitives (Button, Input, Toast, etc.)
└── lib/
    ├── auth-client.ts   # Better Auth client configuration
    ├── auth-fetch.ts    # Authenticated fetch wrapper with API base URL
    └── utils.ts         # Utility helpers
```

---

## Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
NEXT_PUBLIC_API_URL=[https://mentorlagbe-server-ten.vercel.app](https://mentorlagbe-server-ten.vercel.app)
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

---

## Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-frontend-repo-url>
   cd mentorlagbe-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Add your `.env.local` file using the template above.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
