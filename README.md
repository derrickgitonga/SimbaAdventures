# Simba Adventures 🦁

[![Live Demo](https://img.shields.io/badge/Live%20Demo-simba--adventures.vercel.app-amber?style=for-the-badge)](https://simba-adventures.vercel.app/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

> **A modern e-commerce platform for booking customizable safari and adventure tours in Kenya and East Africa.**

Simba Adventures is a full-stack travel booking application built with React, Node.js, TypeScript, and MongoDB. It enables travelers worldwide to discover, customize, and securely book safari experiences in Kenya's most spectacular destinations — from the iconic Maasai Mara to the peaks of Mount Kenya.

## 🌍 Live Demo

**Website:** [simba-adventures.vercel.app](https://simba-adventures.vercel.app/)

### Interface Gallery

| Feature | Preview |
| --- | --- |
| **Landing Page** | ![Landing Page](https://raw.githubusercontent.com/derrickgitonga/SimbaAdventures/main/docs/landing.png) |
| **Tour Details** | ![Tour Details](https://raw.githubusercontent.com/derrickgitonga/SimbaAdventures/main/docs/tour-details.png) |
| **Booking Flow** | ![Booking Flow](https://raw.githubusercontent.com/derrickgitonga/SimbaAdventures/main/docs/booking.png) |
| **Mobile Experience** | ![Mobile](https://raw.githubusercontent.com/derrickgitonga/SimbaAdventures/main/docs/mobile.png) |

---

## ✨ Key Features

### For Travelers
- **🔍 Dynamic Tour Discovery** — Browse and filter safari packages by destination, duration, difficulty, and price
- **🎨 Custom Itinerary Builder** — Create personalized safaris combining Maasai Mara, Amboseli, Mount Kenya, and more
- **🔒 Secure Online Booking** — SSL-encrypted payments supporting Credit Cards, M-Pesa, PayPal, and bank transfers
- **📱 Fully Responsive** — Optimized experience across desktop, tablet, and mobile devices

### For Administrators
- **📊 Analytics Dashboard** — Track bookings, revenue, and customer inquiries in real-time
- **📝 Content Management** — Manage tours, pricing, and availability through an intuitive admin panel
- **📧 Automated Notifications** — Email confirmations and updates sent automatically

### Technical Highlights
- **⚡ Performance Optimized** — Vite-powered builds with lazy loading and code splitting
- **🔐 Type Safety** — Full TypeScript implementation reducing runtime errors
- **🎯 SEO & GEO Optimized** — Comprehensive structured data (JSON-LD) for search engines and AI models
- **🌐 API-First Architecture** — RESTful backend enabling future mobile app integration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, Lucide Icons |
| **Build Tool** | Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcrypt |
| **Payments** | Stripe, M-Pesa Integration |
| **Deployment** | Vercel (Frontend), Railway (Backend) |
| **Version Control** | Git, GitHub |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **bun** package manager
- **MongoDB** database (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/derrickgitonga/SimbaAdventures.git
   cd SimbaAdventures
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
SimbaAdventures/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React Context providers
│   ├── data/           # Mock data and types
│   └── lib/            # Utility functions
├── server/             # Express.js backend
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── middleware/     # Auth and validation
├── public/             # Static assets
└── api/                # Vercel serverless functions
```

---

## 🎯 Safari Destinations Featured

| Destination | Experience |
|-------------|------------|
| **Maasai Mara** | Walking safaris, Great Migration viewing, cultural experiences |
| **Amboseli** | Elephant photography, Mount Kilimanjaro views |
| **Mount Kenya** | Summit expeditions, alpine trekking |
| **Hell's Gate** | Cycling adventures, gorge exploration |
| **Lake Turkana** | Remote expeditions, tribal cultures |
| **Aberdare** | Waterfall trails, forest wildlife |

---

## 🔒 Security Features

- **SSL/TLS Encryption** — All data transmitted securely
- **PCI DSS Compliance** — Payment processing meets industry standards
- **Input Validation** — Server-side validation on all API endpoints
- **Rate Limiting** — Protection against DDoS and brute force attacks
- **Secure Headers** — Helmet.js implementation for HTTP security

---

## 👨‍💻 Developer

**Derrick Gitonga**

- 🔗 GitHub: [@derrickgitonga](https://github.com/derrickgitonga)
- 💼 LinkedIn: [Derrick Gitonga](https://www.linkedin.com/in/derrickgitonga/)
- 🌐 Portfolio: [derrickgitonga.dev](https://derrickgitonga.dev)

### About the Developer

Full-stack Software Engineer specializing in React, Node.js, and TypeScript. Creator of Simba Adventures — an e-commerce platform enabling secure, customizable safari bookings in Kenya and East Africa. Passionate about building performant, accessible web applications that solve real-world problems.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Wildlife images courtesy of [Unsplash](https://unsplash.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)

---

<p align="center">
  <strong>🦁 Discover Africa's Wild Heart with Simba Adventures</strong>
  <br>
  <a href="https://simba-adventures.vercel.app">Book Your Safari Today →</a>
</p>
