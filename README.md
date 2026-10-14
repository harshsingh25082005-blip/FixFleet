<div align="center">

# FixFleet 🚀

### Reliable local home-service professionals, one booking away.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Team](https://img.shields.io/badge/team-FixFleet-blue)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)
![Docs](https://img.shields.io/badge/docs-available-informational)

**[Problem Statement](problem-statement.md)** · **[Documentation](docs)** · **[Report a Bug or Request a Feature](https://github.com/harshsingh25082005-blip/FixFleet/issues)**

</div>

---

## 📖 About

**FixFleet** is a platform that connects customers with trusted local home-service professionals such as **plumbers, electricians, carpenters, cleaners, painters, and appliance technicians**.

Finding a good service provider is often slow, unreliable, and unclear on pricing. FixFleet makes the whole journey (search, booking, payment, and review) **faster, safer, and more transparent**, while helping skilled workers find and manage more service opportunities.

## 📑 Table of Contents

- [About](#-about)
- [Objectives](#-objectives)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Booking Lifecycle](#-booking-lifecycle)
- [User Roles](#-user-roles)
- [Services Offered](#-services-offered)
- [Screenshots](#-screenshots)
- [Proposed Tech Stack](#-proposed-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [API Overview](#-api-overview)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Security and Privacy](#-security-and-privacy)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)
- [Acknowledgements](#-acknowledgements)
- [Project Status](#-project-status)

## 🎯 Objectives

- Make discovering trustworthy local professionals quick and simple
- Bring price, experience, and ratings into one transparent view
- Reduce no-shows and confusion through confirmed time slots and booking updates
- Give skilled workers a steady flow of jobs and a digital identity
- Protect both sides with provider verification, secure payments, and complaint handling

## ✨ Features

### For Customers
- 🔍 Find nearby service professionals
- 🎚️ Filter providers by service type, rating, price, and availability
- 👤 View profiles, skills, experience, ratings, and charges
- 📅 Book services based on provider availability
- 💳 Make secure payments
- 🔔 Receive booking and service updates
- 🧾 Track booking history and past payments
- ⭐ Rate and review professionals after service
- 📢 Raise a complaint if something goes wrong

### For Service Providers
- 🧾 Create and manage a professional profile
- 🛠️ List the services offered along with charges
- 🕒 Set availability and working hours
- 📥 Accept, reschedule, or decline bookings
- 💰 View earnings and payment status
- 📈 Build reputation through ratings and reviews

### For Admins
- 🛡️ Verify service providers before they go live
- 📬 Handle complaints and disputes
- 👥 Manage customers, providers, and service categories
- 📊 Monitor platform activity
- 🧹 Keep the platform safe and trustworthy

## 🔄 How It Works

```
Customer → Search Service → Choose Provider → Book → Pay → Service → Review
```

1. **Search** for the service you need near you.
2. **Compare** providers by ratings, experience, and charges.
3. **Book** a convenient time slot.
4. **Pay** securely through the platform.
5. **Get the job done** by a verified professional.
6. **Review** the provider to help others decide.

## 📊 Booking Lifecycle

Every booking moves through a clear set of statuses so that customers and providers always know where things stand.

```
Pending → Confirmed → In Progress → Completed → Reviewed
   ↓          ↓
Rejected   Cancelled
```

| Status | Meaning |
| --- | --- |
| **Pending** | The customer has requested a booking and is waiting for the provider |
| **Confirmed** | The provider accepted the booking and the time slot is reserved |
| **In Progress** | The provider has started the work |
| **Completed** | The work is finished and the payment is settled |
| **Reviewed** | The customer has rated and reviewed the provider |
| **Rejected** | The provider declined the request |
| **Cancelled** | The booking was cancelled by the customer or the provider |

## 👥 User Roles

| Role | What they can do |
| --- | --- |
| **Customer** | Search, book, pay, track, and review services |
| **Service Provider** | Manage profile, availability, and bookings |
| **Admin** | Verify providers, resolve complaints, moderate the platform |

## 🧰 Services Offered

| Service | Examples |
| --- | --- |
| 🚰 Plumbing | Leaks, pipe fitting, tap and drain repair |
| 💡 Electrical | Wiring, switches, fans, lighting |
| 🪚 Carpentry | Furniture repair, fittings, woodwork |
| 🧼 Cleaning | Home, kitchen, and bathroom cleaning |
| 🎨 Painting | Interior and exterior painting |
| 🔧 Appliance Repair | AC, refrigerator, washing machine, and more |

## 📸 Screenshots

Screenshots and a live demo will be added here once the user interface is ready.

## 🧱 Proposed Tech Stack

> **Note:** This is the proposed stack and may change as the team finalizes its decisions.

| Layer | Proposed Technology |
| --- | --- |
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB or PostgreSQL |
| Authentication | JWT, bcrypt |
| Payments | Razorpay or Stripe (test mode during development) |
| Maps and Location | Google Maps API or OpenStreetMap |
| Notifications | Email (Nodemailer), SMS, in-app alerts |
| Hosting | Vercel (frontend), Render (backend) |
| Version Control | Git and GitHub |

## 🧩 System Architecture

> **Note:** This describes the planned high-level design.

```
Web App (Customer / Provider / Admin)
        │
        │  HTTPS (JSON)
        ▼
REST API (Auth · Search · Booking · Payments · Reviews · Admin)
        │
        ├──────────────▶ Database
        │
        └──────────────▶ External services (Payments · Maps · Email/SMS)
```

## 💾 Database Design

> **Note:** This is the proposed data model and may change during development.

| Entity | Key Fields |
| --- | --- |
| **users** | id, name, email, phone, password_hash, role, created_at |
| **provider_profiles** | id, user_id, skills, experience_years, charges, bio, verification_status, average_rating |
| **services** | id, name, category, description |
| **availability** | id, provider_id, day, start_time, end_time |
| **bookings** | id, customer_id, provider_id, service_id, address, scheduled_at, status, amount |
| **payments** | id, booking_id, amount, method, status, transaction_ref, paid_at |
| **reviews** | id, booking_id, customer_id, provider_id, rating, comment, created_at |
| **complaints** | id, booking_id, raised_by, description, status, resolved_by |
| **notifications** | id, user_id, type, message, is_read, created_at |

**Relationships**

```
User (1) ──── (0..1) ProviderProfile
Customer (1) ──── (N) Booking (N) ──── (1) Provider
Booking (1) ──── (0..1) Payment
Booking (1) ──── (0..1) Review
Booking (1) ──── (0..N) Complaint
```

## 📡 API Overview

> **Note:** These are planned endpoints and may change during development.

| Area | Method | Endpoint | Description |
| --- | --- | --- | --- |
| Auth | POST | `/api/auth/register` | Create a new account |
| Auth | POST | `/api/auth/login` | Log in and receive a token |
| Providers | GET | `/api/providers` | Search providers by service, location, and rating |
| Providers | GET | `/api/providers/:id` | View a provider's profile |
| Providers | PUT | `/api/providers/me` | Update the logged-in provider's profile |
| Bookings | POST | `/api/bookings` | Create a booking |
| Bookings | GET | `/api/bookings` | List the user's bookings |
| Bookings | PATCH | `/api/bookings/:id/status` | Accept, reject, start, complete, or cancel a booking |
| Payments | POST | `/api/payments/checkout` | Start a payment for a booking |
| Payments | POST | `/api/payments/verify` | Verify a completed payment |
| Reviews | POST | `/api/reviews` | Submit a review for a completed booking |
| Reviews | GET | `/api/providers/:id/reviews` | List a provider's reviews |
| Admin | PATCH | `/api/admin/providers/:id/verify` | Approve or reject a provider |
| Admin | GET | `/api/admin/complaints` | List complaints |
| Admin | PATCH | `/api/admin/complaints/:id` | Update or resolve a complaint |

## 📂 Project Structure

**Current**

```
FixFleet/
├── docs/                  # Project documentation
├── problem-statement.md   # Problem definition and project scope
└── README.md              # You are here
```

**Planned (once development begins)**

```
FixFleet/
├── client/                # Frontend (customer, provider, and admin UI)
├── server/                # Backend REST API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── docs/                  # Project documentation
├── .env.example           # Sample environment variables
├── problem-statement.md
└── README.md
```

## 🚀 Getting Started

The project is currently in the planning and documentation phase, so there is no application to run yet.

### Prerequisites

- [Git](https://git-scm.com/downloads)
- A code editor such as [VS Code](https://code.visualstudio.com/)
- Runtime and database requirements will be listed here once the stack is finalized

### Clone the Repository

```bash
git clone https://github.com/harshsingh25082005-blip/FixFleet.git
cd FixFleet
```

### Run the Project (coming soon)

```bash
# Install dependencies
# npm install

# Create your environment file
# cp .env.example .env

# Start the development server
# npm run dev
```

### Environment Variables (planned)

```env
# Server
PORT=5000

# Database
DATABASE_URL=your_database_connection_string

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Payments (use test keys during development)
PAYMENT_KEY_ID=your_payment_key_id
PAYMENT_KEY_SECRET=your_payment_key_secret

# Maps and location
MAPS_API_KEY=your_maps_api_key

# Email notifications
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

> Never commit real keys or passwords. Keep your `.env` file out of Git by adding it to `.gitignore`.

## 🔐 Security and Privacy

- Passwords are stored as secure hashes, never as plain text
- Role-based access control separates customer, provider, and admin actions
- Payments go through a trusted payment gateway, and card details are never stored by FixFleet
- All traffic is served over HTTPS
- Provider profiles are verified by an admin before they go live
- User input is validated and sanitized on the server
- Contact details are shared only after a booking is confirmed
- Rate limiting protects the API against abuse

## 🧪 Testing

The following will be set up as development progresses:

- [ ] Unit tests for core business logic
- [ ] API tests for every endpoint
- [ ] Manual test checklist for the full booking flow (search, book, pay, review)
- [ ] Role-based access tests (customer, provider, admin)
- [ ] Responsive checks on mobile, tablet, and desktop

## 🧭 Roadmap

### Phase 1: Planning
- [x] Define the problem statement
- [x] Prepare project documentation

### Phase 2: Design
- [ ] UI/UX wireframes
- [ ] Database schema
- [ ] API design

### Phase 3: Core Development
- [ ] Authentication for customers, providers, and admins
- [ ] Provider profiles and service listings
- [ ] Search and filters (service, location, rating, price)
- [ ] Availability and booking management

### Phase 4: Payments and Trust
- [ ] Secure payment integration
- [ ] Notifications and booking updates
- [ ] Ratings and reviews
- [ ] Admin dashboard for verification and complaints

### Phase 5: Launch
- [ ] Testing and bug fixes
- [ ] Deployment
- [ ] Feedback and improvements

### Future Ideas
- In-app chat between customers and providers
- Live tracking of the provider's arrival
- Multi-language support
- Mobile app for Android and iOS
- Coupons, offers, and service packages
- Emergency and same-day bookings

## ❓ FAQ

<details>
<summary><b>Is FixFleet live yet?</b></summary>

Not yet. The project is currently in development, and this repository holds the planning and documentation.

</details>

<details>
<summary><b>Who can become a service provider?</b></summary>

Any skilled professional in a supported category can register as a provider. Profiles go live after an admin verifies them.

</details>

<details>
<summary><b>How will providers be verified?</b></summary>

An admin will review the details submitted by the provider before approving the profile.

</details>

<details>
<summary><b>Are payments secure?</b></summary>

Payments are planned through a trusted payment gateway. FixFleet will not store card details.

</details>

<details>
<summary><b>What if I am unhappy with a service?</b></summary>

Customers can raise a complaint on the booking, and an admin will review and resolve it.

</details>

<details>
<summary><b>How can I contribute?</b></summary>

See the [Contributing](#-contributing) section below.

</details>

## 🤝 Contributing

Contributions, ideas, and suggestions are welcome!

### Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Branch Naming

| Prefix | Use for |
| --- | --- |
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code cleanup without behavior changes |

### Commit Messages

| Type | Use for |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting changes with no logic change |
| `refactor` | Code restructuring |
| `test` | Adding or updating tests |
| `chore` | Maintenance and tooling |

### Pull Request Checklist

- [ ] My branch is up to date with `main`
- [ ] I have tested my changes
- [ ] I have updated the documentation if needed
- [ ] My commit messages follow the convention above

### Ground Rules

- Be respectful and kind to everyone
- Give constructive feedback
- Keep discussions focused on the project

## 📜 License

A license has not been added yet and will be announced here once chosen.

## 🙌 Team

Built with ❤️ by **Team FixFleet**.

Repository owner: [@harshsingh25082005-blip](https://github.com/harshsingh25082005-blip)

## 🙏 Acknowledgements

- Badges by [Shields.io](https://shields.io/)
- The skilled plumbers, electricians, carpenters, cleaners, painters, and technicians whose everyday work inspired this project

## 🚧 Project Status

**Currently in development.** Stay tuned for updates!

---

<div align="center">

⭐ If you like this project, consider giving it a star!

</div>