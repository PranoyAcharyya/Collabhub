# CollabHub SaaS

## Overview

CollabHub is a modern SaaS collaboration platform that allows teams to create workspaces, manage documents, and collaborate efficiently. The application includes authentication, workspace-based access control, document management, and subscription billing using Stripe.

The goal of this project was to build a production-style SaaS architecture using modern web technologies while implementing real-world patterns such as multi-tenancy, subscription gating, and secure server-side operations.

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Shad Cn
* Magic Ui

### Backend

* Next.js API Routes
* Supabase (PostgreSQL)

### Infrastructure

* Supabase Auth
* Supabase Storage
* Supabase Row Level Security (RLS)

### Payments

* Stripe Checkout
* Stripe Webhooks

---

## Core Features

### Authentication

Users can register and log in securely using Supabase Authentication. The system manages user sessions and ensures protected routes are accessible only to authenticated users.

Features:

* Email/password authentication
* Secure session management
* Protected routes

---

### User Profiles

Each user has a profile stored in the database containing:

* Name
* Avatar
* Subscription plan
* Subscription status

Users can update their profile information through the Account page.

Avatar uploads are stored in Supabase Storage and updated securely using a service role on the server.

---

### Workspaces (Multi-Tenant Architecture)

CollabHub is designed with a multi-tenant architecture.

Each workspace represents a collaborative environment where users can create and manage documents.

Workspace features:

* Workspace creation
* Member-based access
* Isolation between different workspaces

Access control is enforced using Supabase Row Level Security policies.

---

### Document Management

Users can create, view, and manage documents inside a workspace.

Document features:

* Create new documents
* View document list
* Organized by workspace

The system ensures users can only access documents belonging to workspaces they are members of.

---

### Subscription System

CollabHub includes a subscription model with Free and Pro plans.

Free Plan:

* Limited number of documents

Pro Plan:

* Higher document limits

Subscription upgrades are handled using Stripe Checkout.

---

### Stripe Billing Integration

Stripe is used to manage subscription payments.

The payment flow:

1. User selects upgrade
2. Stripe Checkout session is created
3. User completes payment
4. Stripe sends webhook event
5. Backend verifies webhook
6. User subscription is updated in the database

This ensures subscription data remains synchronized with Stripe.

---

### Webhook Processing

Stripe webhooks are used to handle subscription updates.

Key responsibilities:

* Verify Stripe webhook signature
* Retrieve subscription details
* Update user plan in Supabase

The webhook uses a Supabase service role to bypass RLS since the event originates from Stripe servers.

---

### Billing Page

Users can manage their subscription from the billing page.

Features:

* Upgrade to Pro plan
* View current subscription status

---

### Account Management

Users can update:

* Display name
* Password
* Avatar image

All sensitive updates are handled securely on the server.

---

### Sidebar Navigation

The application includes a sidebar for quick navigation between:

* Workspaces
* Documents
* Billing
* Account settings

The sidebar also includes profile information and logout functionality.

---

## Security

Security was an important consideration during development.

Measures implemented:

* Supabase Row Level Security for database protection
* Secure Stripe webhook verification
* Server-side validation for subscription gating
* Service role usage only in backend environments

---

## Production Considerations

While this project was built as an MVP, several improvements could be implemented for production environments:

* Add rate limiting for API routes
* Implement audit logging
* Add monitoring and error tracking
* Improve database indexing for performance
* Implement soft deletes instead of hard deletes

---

## Environment Variables

The application requires the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Running the Project

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build production version:

```
npm run build
```

Start production server:

```
npm run start
```

---

## Learning Outcomes

This project helped implement several real-world SaaS concepts:

* Multi-tenant architecture
* Secure authentication systems
* Subscription-based billing
* Webhook handling
* Server-side validation

It also provided experience working with production-style tools such as Next.js App Router, Supabase, and Stripe.

---

## Future Improvements

Potential improvements for the platform include:

* Real-time collaboration
* Role-based workspace permissions
* Activity logs
* Notifications system
* Advanced analytics dashboard

---

## Author

Pranoy Acharyya

This project was built as part of learning and practicing modern SaaS architecture using Next.js and Supabase.
