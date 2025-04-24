# MetaScribe

A web application for SEO analysis and content optimization that helps users improve their website's search engine visibility.

## 📋 Overview

MetaScribe analyzes web content to provide actionable SEO insights and recommendations. The application scores your content based on various SEO metrics and offers a detailed analysis to improve your search engine ranking.

## 🚀 Features

- **SEO Analysis**: Comprehensive analysis of meta tags with scoring in multiple categories:
  - Required Tags (title, description, viewport)
  - Social Media Tags (Open Graph, Twitter Cards)
  - SEO Best Practices (canonical URLs, language settings, robots)
- **Score Overview**: Visual scoring dashboard with 0-100 ratings for each category
- **Detailed Reports**: In-depth analysis of meta tags with specific recommendations and code snippets
- **Content Preview**: Visual previews of how content appears in search results and social media platforms
- **Raw HTML Analysis**: View and copy raw meta tag HTML from analyzed pages

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js
- **UI Components**: Custom components built with Radix UI and shadcn/ui
- **Serverless API**: Vercel Functions
- **Storage**: In-memory storage (PostgreSQL planned for future implementation)
- **Build Tools**: Vite
- **ORM**: Drizzle (for future PostgreSQL implementation)

## 🏗️ Project Structure

- `client/` - Frontend React application
- `server/` - Backend Node.js API (for local development)
- `api/` - Serverless API functions for Vercel deployment
- `shared/` - Shared types and schemas

## ✅ Meta Tags Analyzed

MetaScribe analyzes the following meta tags and HTML elements:

- **Essential Tags**:
  - `<title>` - Page title
  - `<meta name="description">` - Page description
  - `<meta name="viewport">` - Mobile viewport settings

- **Social Media Tags**:
  - Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
  - Twitter Cards: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

- **SEO Best Practices**:
  - `<link rel="canonical">` - Canonical URL
  - `<meta name="robots">` - Robots directives
  - `<html lang="">` - Language declaration
  - Optimal content lengths for titles and descriptions

## 📸 Screenshots

### Analysis Dashboard light mod
![screencapture-localhost-5000-2025-04-14-20_41_41](https://github.com/user-attachments/assets/d4bbdc19-d8be-4046-868d-1dc3489a43a9)

### Analysis Dashboard dark mod
![screencapture-localhost-5000-2025-04-14-20_41_21](https://github.com/user-attachments/assets/8a1bfae2-2300-4461-b94a-81f93e6060b1)

## 🚦 Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn
- PostgreSQL 16 (for future database implementation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SadeepaNHerath/MetaScribe
   cd MetaScribe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create a `.env` file)

### Database Setup

**Current Implementation**: The application currently uses in-memory storage which requires no additional setup. All data will be lost when the server restarts.

**Future PostgreSQL Implementation**: 
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE metascribe;
   ```

2. Configure database connection in your `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/metascribe
   ```

3. Run database migrations:
   ```bash
   npm run migrate
   ```

### Running the Application

- For development:
  ```bash
  npm run dev
  ```

- For production:
  ```bash
  npm run build
  npm run start
  ```

- For client-only development:
  ```bash
  npm run dev:client
  ```

- For server-only development:
  ```bash
  npm run dev:server
  ```

The application will be available at [http://localhost:5000](http://localhost:5000)

## 🌐 Deployment

### Vercel Deployment

The application is configured for deployment on Vercel with serverless API functions.

1. Make sure your Vercel account is set up and connected to your GitHub repository
2. Deploy using the Vercel CLI or GitHub integration:
   ```bash
   vercel
   ```

3. The deployment uses:
   - Static site hosting for the React frontend
   - Serverless functions for the API endpoints

### API Architecture

- **Local Development**: Uses Express server in `server/` directory
- **Production**: Uses serverless functions in `api/` directory
- **Storage**: Currently in-memory (non-persistent in production)
- **Routes**: Main endpoint is `/api/analyze` for SEO analysis

## 📝 License

This project is not formally licensed. Feel free to use it for personal projects, but please do not distribute or modify without permission.

## 👥 Contributors

Sadeepa Herath
