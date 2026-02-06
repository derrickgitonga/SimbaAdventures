# Simba Adventures

A modern e-commerce platform for booking customizable safari and adventure tours in Kenya and East Africa.

## Overview

Simba Adventures is a full-stack travel booking application built with React, Node.js, TypeScript, and MongoDB. It enables travelers worldwide to discover, customize, and securely book safari experiences in Kenya's most spectacular destinations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Lucide Icons |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Clerk (Customer), JWT (Admin) |
| Deployment | Vercel (Frontend), Railway (Backend) |

## Features

### Customer Features
- Dynamic tour discovery with filtering by destination, duration, difficulty, and price
- Custom itinerary builder for personalized safaris
- Secure online booking with multiple payment options
- Fully responsive design for all devices
- User authentication and booking management

### Admin Features
- Real-time analytics dashboard
- Point of Sale (POS) system for walk-in bookings
- Tour and booking management
- Activity logging and audit trails
- Content management system

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or bun package manager
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/derrickgitonga/SimbaAdventures.git
   cd SimbaAdventures
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   
   Copy the example file and add your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   MONGODB_URI=your_mongodb_connection_string
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   JWT_SECRET=your_jwt_secret_key
   ADMIN_PASSWORD=your_admin_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

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
│   └── server.js       # Main server file
├── public/             # Static assets
└── api/                # Vercel serverless functions
```

## Admin Access

The admin dashboard is accessible at `/admin/login` and includes:
- Real-time dashboard and analytics
- Point of Sale (POS) for walk-in bookings
- Activity logging and audit trails
- Tour and booking management

Configure admin credentials via the `ADMIN_PASSWORD` environment variable.

## Security Features

- SSL/TLS encryption for all data transmission
- Secure authentication with Clerk and JWT
- Input validation on all API endpoints
- Rate limiting protection
- Secure HTTP headers implementation

## License

This project is licensed under the MIT License.

## Acknowledgments

- Wildlife images courtesy of Unsplash
- UI components from shadcn/ui
- Icons by Lucide
