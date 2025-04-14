# MetaScribe

A web application for SEO analysis and content optimization that helps users improve their website's search engine visibility.

## 📋 Overview

MetaScribe analyzes web content to provide actionable SEO insights and recommendations. The application scores your content based on various SEO metrics and offers a detailed analysis to improve your search engine ranking.

## 🚀 Features

- **SEO Analysis**: Comprehensive analysis of content for search engine optimization
- **Score Overview**: Quick view of your content's SEO performance
- **Detailed Reports**: In-depth analysis of your content with actionable recommendations
- **Content Preview**: See how your content might appear in search results

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js
- **Database**: In-memory storage (PostgreSQL planned for future implementation)
- **Build Tools**: Vite
- **ORM**: Drizzle (for future PostgreSQL implementation)

## 🏗️ Project Structure

- `client/` - Frontend React application
- `server/` - Backend Node.js API
- `shared/` - Shared types and schemas

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

## 📝 License

This project is not formally licensed. Feel free to use it for personal projects, but please do not distribute or modify without permission.

## 👥 Contributors

Sadeepa Herath
