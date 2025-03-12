# 🚜 Farmlink - Local Farm Marketplace (Demo Version)

**Farmlink** is a web application that connects local farmers and butchers with urban consumers looking for fresh, locally sourced food. This demo version provides a simple, intuitive platform to browse products, place orders, and manage listings.

## 🚀 Deployment

You can test out the Farmlink demo here[]

# FarmLink 🚀

A platform connecting local farmers with consumers.

## Deployment Instructions

### Backend (Render Web Service)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use these settings:
   - Environment: Node
   - Build Command: `cd server && npm install --include=dev && npm run build`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: production
     - `PORT`: 8080

### Frontend (Render Static Site)
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Use these settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: Your backend service URL

### After Deployment
1. Update `src/config.ts` with your backend URL
2. Update `server/src/index.ts` with your frontend URL
3. Commit and push changes to trigger redeployment

## Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
3. Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   ```
4. Start the development servers:
   ```bash
   # Terminal 1 (Frontend)
   npm run dev
   
   # Terminal 2 (Backend)
   cd server && npm run dev
   ```

## Features
- Browse local farms and their products
- User authentication
- Product management for farmers
- Shopping cart functionality
- Review system