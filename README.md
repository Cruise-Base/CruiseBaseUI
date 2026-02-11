# CruiseBase Fintech Dashboard

A premium, high-performance, and secure vehicle asset management platform built with React 18, Vite, TypeScript, and Tailwind CSS (v4).

## 🚀 Key Features

- **Multi-Role Authentication**: JWT-based auth flow for SuperAdmin, Admin, Owner, and Driver roles.
- **Fintech Wallet**:
  - Real-time balance tracking with "hide/show" privacy toggle.
  - Secure withdrawal workflow requiring a 4-digit PIN.
  - Paginated transaction history with status tracking.
- **Contract Progress Tracking**:
  - **Drivers**: Visualized progress towards vehicle ownership (Gross).
  - **Owners**: Visualized progress towards net payout (Total minus 10% commission).
- **Interactive Dashboards**: Role-specific views with fleet metrics (Owner), vehicle details (Driver), and system-wide revenue (Admin).
- **Modern Sleek UI**: Dark mode by default with vibrant Electric Blue and Emerald Green accents, built using Tailwind 4 and Framer Motion for smooth micro-animations.

## 🛠️ Technology Stack

- **Frontend**: React 18 (TypeScript)
- **Styling**: Tailwind CSS v4, Framer Motion
- **State Management**: Zustand (Global UI/Session), TanStack Query (Server State)
- **API Communication**: Axios with Interceptors (Auto-refresh 401 token handling)
- **Forms**: React Hook Form + Zod Validation
- **Icons**: Lucide React

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (Wallet, Vehicles, Layout)
├── hooks/            # Custom React hooks
├── services/         # API services (Auth, Wallet, Vehicle)
├── store/            # Global state (Zustand)
├── pages/            # Role-specific dashboard views and Auth pages
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```

## ⚙️ Setup & Installation

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://cruisebaseapi-production.up.railway.app/
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔒 Security

- **JWT Refresh Logic**: Automatically handles token expiration via Axios interceptors.
- **Protected Routes**: Strict role-based access control.
- **Transaction PIN**: Secure 4-digit verification for all financial withdrawals.
