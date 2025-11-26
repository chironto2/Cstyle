# Cstyle - A Modern E-Commerce Platform for Fashion

## Project Description

Cstyle is a modern, AI-powered e-commerce platform designed for fashion retail. Built with Next.js, TypeScript, and MongoDB, it features a stylish storefront, a robust admin dashboard, and an AI stylist to help users find the perfect look. Cstyle aims to deliver a seamless shopping and management experience for both customers and store admins.

## Setup & Installation

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)
- (Optional) [Google Cloud SDK](https://cloud.google.com/sdk) for Genkit AI features

### 1. Clone the Repository

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
MONGODB_URI=mongodb://127.0.0.1:27017/Cstyle
MONGODB_DB_NAME=Cstyle
JWT_SECRET=your_jwt_secret_change_this_in_production
GENKIT_API_KEY=your_google_genkit_api_key
GENKIT_PROJECT_ID=your_gcp_project_id
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Open your browser and go to [http://localhost:3000](http://localhost:3000).

### 5. (Optional) Enable Genkit AI Features

If you want to use the AI stylist features, run:

```bash
npx genkit dev
```

Make sure Genkit is properly configured.

---

Thank you for checking out Cstyle
# Cstyle
# Cstyle
