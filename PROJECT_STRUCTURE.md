# Project Structure - Odoo GCET

Complete file and folder structure of the project.

```
odoo-gcet/
│
├── .gitignore                          # Git ignore rules
├── components.json                     # Component configuration
├── eslint.config.mjs                   # ESLint configuration
├── next.config.ts                      # Next.js configuration
├── package-lock.json                   # NPM lock file
├── package.json                        # NPM dependencies and scripts
├── postcss.config.mjs                  # PostCSS configuration
├── README.md                           # Project documentation
├── tsconfig.json                       # TypeScript configuration
│
├── public/                             # Static assets
│   ├── globe.svg
│   ├── hero.png
│   ├── logo.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
└── src/                                # Source code directory
    │
    ├── actions/                        # Server actions
    │   ├── attendance.actions.ts
    │   ├── employee.actions.ts
    │   ├── leave.actions.ts
    │   └── payroll.actions.ts
    │
    ├── app/                            # Next.js App Router
    │   │
    │   ├── (auth)/                     # Auth route group
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── register/
    │   │       └── page.tsx
    │   │
    │   ├── (dashboard)/                # Dashboard route group
    │   │   ├── layout.tsx              # Dashboard layout
    │   │   │
    │   │   ├── admin/                  # Admin dashboard
    │   │   │   ├── attandance/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── departments/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── roles/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── settings/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── users/
    │   │   │       ├── error.tsx
    │   │   │       ├── loading.tsx
    │   │   │       ├── not-found.tsx
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── hr/                     # HR dashboard
    │   │   │   ├── attandance/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── employee/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── leaves/
    │   │   │   │   ├── error.tsx
    │   │   │   │   ├── loading.tsx
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   └── payroll/
    │   │   │       ├── error.tsx
    │   │   │       ├── loading.tsx
    │   │   │       ├── not-found.tsx
    │   │   │       └── page.tsx
    │   │   │
    │   │   └── user/                   # User dashboard
    │   │       ├── attendance/
    │   │       │   ├── error.tsx
    │   │       │   ├── loading.tsx
    │   │       │   ├── not-found.tsx
    │   │       │   └── page.tsx
    │   │       ├── page.tsx
    │   │       ├── paylips/
    │   │       │   ├── error.tsx
    │   │       │   ├── loading.tsx
    │   │       │   ├── not-found.tsx
    │   │       │   └── page.tsx
    │   │       ├── profile/
    │   │       │   ├── error.tsx
    │   │       │   ├── loading.tsx
    │   │       │   ├── not-found.tsx
    │   │       │   └── page.tsx
    │   │       └── requests/
    │   │           ├── error.tsx
    │   │           ├── loading.tsx
    │   │           ├── not-found.tsx
    │   │           └── page.tsx
    │   │
    │   ├── about/                      # About page
    │   │   └── page.tsx
    │   │
    │   ├── api/                        # API routes
    │   │   ├── attendance/
    │   │   │   ├── [employeeId]/      # Dynamic route
    │   │   │   │   └── route.ts
    │   │   │   ├── logs/
    │   │   │   │   └── route.ts
    │   │   │   └── route.ts
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   │   └── route.ts
    │   │   │   ├── logout/
    │   │   │   │   └── route.ts
    │   │   │   ├── refresh/
    │   │   │   │   └── route.ts
    │   │   │   ├── route.tsx
    │   │   │   ├── signup/
    │   │   │   │   └── route.ts
    │   │   │   └── verify-email/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── cron/                   # Cron jobs
    │   │   │   └── attendance/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── employee/
    │   │   │   ├── [id]/              # Dynamic route
    │   │   │   │   └── route.ts
    │   │   │   └── route.ts
    │   │   │
    │   │   ├── health/                 # Health check
    │   │   │   └── route.ts
    │   │   │
    │   │   ├── leaves/
    │   │   │   ├── [id]/              # Dynamic route
    │   │   │   │   └── route.ts
    │   │   │   └── route.ts
    │   │   │
    │   │   ├── payroll/
    │   │   │   ├── route.ts
    │   │   │   └── slip/
    │   │   │       └── [id]/          # Dynamic route
    │   │   │           └── route.ts
    │   │   │
    │   │   └── users/
    │   │       ├── login/
    │   │       │   └── route.ts
    │   │       ├── me/
    │   │       │   └── route.ts
    │   │       └── signup/
    │   │           └── route.ts
    │   │
    │   ├── contact/                    # Contact page
    │   │   └── page.tsx
    │   │
    │   ├── dashboard/                  # Legacy dashboard (deprecated)
    │   │   ├── attendance/
    │   │   │   └── page.tsx
    │   │   ├── data.json
    │   │   ├── employee/
    │   │   │   └── page.tsx
    │   │   ├── leaves/
    │   │   │   └── page.tsx
    │   │   ├── page.tsx
    │   │   ├── payroll/
    │   │   │   └── page.tsx
    │   │   └── profile/
    │   │       └── page.tsx
    │   │
    │   ├── Hero/                       # Hero section
    │   │   └── page.tsx
    │   │
    │   ├── favicon.ico                 # Favicon
    │   ├── globals.css                 # Global styles
    │   ├── layout.tsx                  # Root layout
    │   ├── loading.tsx                 # Loading UI
    │   └── page.tsx                    # Home page
    │
    ├── components/                     # React components
    │   ├── app-sidebar.tsx             # Application sidebar
    │   ├── BlurText.tsx                # Blur text effect component
    │   ├── CardNav.tsx                 # Card navigation component
    │   ├── chart-area-interactive.tsx   # Interactive chart component
    │   ├── data-table.tsx              # Data table component
    │   ├── Delay.tsx                   # Delay component
    │   ├── nav-documents.tsx           # Navigation documents
    │   ├── nav-main.tsx                # Main navigation
    │   ├── nav-secondary.tsx           # Secondary navigation
    │   ├── nav-user.tsx                # User navigation
    │   ├── section-cards.tsx           # Section cards component
    │   ├── site-header.tsx             # Site header component
    │   ├── TextType.tsx                # Typing text effect component
    │   │
    │   ├── shared/                     # Shared components
    │   │   ├── About-Page/
    │   │   │   └── AboutHero.tsx
    │   │   ├── Contact-Page/
    │   │   │   └── ContactCard.tsx
    │   │   ├── Feature/
    │   │   │   └── FetureSection.tsx
    │   │   ├── Footer/
    │   │   │   └── Footer.tsx
    │   │   ├── Hero.tsx
    │   │   ├── herobutton.tsx
    │   │   ├── HomePage/
    │   │   │   └── Herosection.tsx
    │   │   └── Navbar/
    │   │       ├── Navbar.tsx
    │   │       └── Navitem.tsx
    │   │
    │   └── ui/                         # UI components (shadcn/ui)
    │       ├── avatar.tsx
    │       ├── background-boxes.tsx
    │       ├── background-lines.tsx
    │       ├── background-ripple-effect.tsx
    │       ├── badge.tsx
    │       ├── bento-grid.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── card-hover-effect.tsx
    │       ├── card.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── hover-border-gradient.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── loader.tsx
    │       ├── noise-background.tsx
    │       ├── progress.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── sonner.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       └── tooltip.tsx
    │
    ├── config/                         # Configuration files
    │   └── sidebar-data.ts             # Sidebar configuration data
    │
    ├── hooks/                          # Custom React hooks
    │   └── use-mobile.ts               # Mobile detection hook
    │
    ├── lib/                            # Utility libraries
    │   ├── auth.ts                     # Authentication utilities
    │   ├── cleark.ts                   # Clerk integration
    │   ├── db.ts                       # Database utilities
    │   ├── rbac.ts                     # Role-based access control
    │   ├── requireAdmin.ts             # Admin requirement middleware
    │   ├── roles.ts                    # Role management
    │   ├── salarySlip.ts              # Salary slip utilities
    │   └── utils.ts                    # General utilities
    │
    ├── models/                         # Data models
    │   ├── ApprovalLog.ts             # Approval log model
    │   ├── Attendance/                 # Attendance models
    │   │   └── attendance.ts
    │   ├── Attendance.ts               # Attendance model
    │   ├── Employee.ts                 # Employee model
    │   ├── Leave.ts                    # Leave model
    │   ├── Payroll.ts                  # Payroll model
    │   └── User.ts                     # User model
    │
    ├── proxy.ts                        # Proxy configuration
    │
    ├── store/                          # State management (Zustand stores)
    │   ├── useAttendanceStore.ts       # Attendance state
    │   ├── useAuthStore.ts             # Authentication state
    │   ├── useLeaveStore.ts            # Leave state
    │   ├── usePayrollStore.ts          # Payroll state
    │   ├── useUIStore.ts               # UI state
    │   └── useUserStore.ts             # User state
    │
    └── types/                          # TypeScript type definitions
        ├── global.d.ts                 # Global type definitions
        └── navigation.ts               # Navigation types
```

## Project Overview

This is a **Next.js 14+** project using the **App Router** architecture with the following key features:

### Technology Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via PostCSS)
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Authentication**: Clerk (based on lib/cleark.ts)

### Key Directories

1. **`src/app/`** - Next.js App Router pages and API routes
   - `(auth)/` - Authentication pages (login, register, forgot-password)
   - `(dashboard)/` - Protected dashboard routes with role-based access
     - `admin/` - Admin-specific pages
     - `hr/` - HR-specific pages
     - `user/` - User-specific pages
   - `api/` - API route handlers

2. **`src/components/`** - React components
   - `ui/` - Reusable UI components (shadcn/ui)
   - `shared/` - Shared application components

3. **`src/store/`** - Zustand state management stores

4. **`src/models/`** - Data models and schemas

5. **`src/lib/`** - Utility functions and helpers

6. **`src/actions/`** - Server actions for data mutations

### Route Structure

- **Public Routes**: `/`, `/about`, `/contact`, `/login`, `/register`, `/forgot-password`
- **Protected Routes**: 
  - `/admin/*` - Admin dashboard
  - `/hr/*` - HR dashboard
  - `/user/*` - User dashboard
- **API Routes**: `/api/*` - RESTful API endpoints

### Notes

- The project uses Next.js route groups `(auth)` and `(dashboard)` for organization
- Each dashboard route has error boundaries (`error.tsx`), loading states (`loading.tsx`), and 404 pages (`not-found.tsx`)
- There's a legacy `dashboard/` directory that appears to be deprecated in favor of the new `(dashboard)/` structure
- The project follows a modular architecture with clear separation of concerns
