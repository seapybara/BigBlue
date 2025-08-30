# BigBlue 🤿

A scuba diving buddy finder application built with React and Node.js.

🌊 **[Live Demo](https://seapybara.github.io/BigBlue/)** 🌊

## Features

- Find dive buddies near you
- Explore dive sites worldwide
- Track your dives
- User authentication

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB database (local or Atlas)
- Mapbox API token

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/BigBlue.git
   cd BigBlue
   ```

2. **Set up environment variables:**
   ```bash
   # Copy example files
   cp bigblue/server/.env.example bigblue/server/.env
   cp bigblue/client/.env.example bigblue/client/.env
   ```
   
   **Edit the .env files with your actual values:**
   - `bigblue/server/.env`: Add your MongoDB URI and JWT secret
   - `bigblue/client/.env`: Add your Mapbox token

3. **Install dependencies:**
   ```bash
   # Install server dependencies
   cd bigblue/server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

4. **Start the development servers:**
   ```bash
   # Terminal 1 - Backend (from bigblue/server)
   npm run dev
   
   # Terminal 2 - Frontend (from bigblue/client)  
   npm start
   ```

5. **Visit `http://localhost:3000`** to view the app.

### Environment Variables

**Server (.env):**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

**Client (.env):**
- `REACT_APP_MAPBOX_TOKEN`: Your Mapbox public API token
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Project Structure

- `bigblue/client/` - React frontend
- `bigblue/server/` - Node.js API
- `docs/` - GitHub Pages deployment