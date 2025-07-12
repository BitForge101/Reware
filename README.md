
# ReWear - Sustainable Fashion Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.1.0-blue)](https://reactjs.org/)
[![Express Version](https://img.shields.io/badge/express-5.1.0-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.3-green)](https://www.mongodb.com/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

ReWear is a modern, full-stack web platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. Built with React 19 and Node.js, our mission is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🛠 Tech Stack

**Frontend:**
- React 19.1.0 with modern hooks and features
- React Router DOM 7.6.3 for navigation
- CSS3 with responsive design
- Create React App for development tooling

**Backend:**
- Node.js with Express 5.1.0
- MongoDB 8.16.3 with Mongoose ODM
- JWT authentication with bcryptjs
- CORS enabled for cross-origin requests

**Development Tools:**
- Nodemon for server auto-reload
- Concurrently for running multiple scripts
- ESLint for code quality

## 🌟 Features

### Core Functionality
- **🔐 User Authentication**: Secure signup and login system with JWT tokens
- **📊 User Dashboard**: Comprehensive profile management and activity tracking
- **👕 Clothing Exchange**: Innovative point-based system for clothing swaps
- **📱 Responsive Design**: Mobile-first, cross-device compatible interface
- **🌱 Sustainability Focus**: Promoting eco-friendly fashion practices

### Technical Features
- **⚡ Modern React**: Built with React 19 and latest hooks
- **🔒 Secure API**: RESTful API with JWT authentication
- **📦 MongoDB Integration**: Efficient data storage and retrieval
- **🚀 Fast Development**: Hot reload and live development servers
- **📋 Error Handling**: Comprehensive error handling and validation

## 🚀 Quick Start

### Prerequisites

- **Node.js** (>= 18.0.0) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or cloud instance like MongoDB Atlas)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BitForge101/Reware.git
   cd Reware
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Server (.env):**
   ```bash
   cd server-reware
   cp .env.example .env
   ```
   
   Edit `server-reware/.env` with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rewearDB
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

   **Client (.env):**
   ```bash
   cd client-reware
   # .env file already exists with proper configuration
   ```

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the server (port 5000) and client (port 3000) concurrently.

### Manual Setup

If you prefer to run the servers separately:

**Terminal 1 - Server:**
```bash
cd server-reware
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client-reware
npm start
```

## 📁 Project Structure

```
Reware/
├── 📄 package.json            # Root package with concurrency scripts
├── 📄 README.md              # Project documentation
├── 📄 LICENSE                # MIT License
├── client-reware/            # 🎨 React Frontend Application
│   ├── public/               # Static assets
│   │   ├── index.html        # Main HTML template
│   │   ├── manifest.json     # PWA manifest
│   │   └── robots.txt        # SEO robots file
│   ├── src/
│   │   ├── 📄 App.js         # Main App component
│   │   ├── 📄 App.css        # Global styles
│   │   ├── 📄 index.js       # React entry point
│   │   ├── 📄 index.css      # Base styles
│   │   ├── components/       # 🧩 Reusable UI components
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/            # 📄 Page components
│   │   │   ├── dashboard.js  # User dashboard
│   │   │   ├── login.js      # Login page
│   │   │   ├── signup.js     # Registration page
│   │   │   └── UserDashboard.js # Enhanced dashboard
│   │   ├── services/         # 🔧 API and utility services
│   │   │   ├── api.js        # API client
│   │   │   └── authService.js # Authentication service
│   │   └── images/           # 🖼️ Static images and assets
│   └── 📄 package.json       # Frontend dependencies
└── server-reware/            # 🚀 Node.js Backend Application
    ├── 📄 app.js             # Express server entry point
    ├── 📄 package.json       # Backend dependencies
    ├── config/               # ⚙️ Configuration files
    │   └── db.js             # Database connection
    ├── controllers/          # 🎮 Route controllers
    │   └── authController.js # Authentication logic
    ├── middleware/           # 🔒 Custom middleware
    │   ├── auth.js           # JWT verification
    │   └── errorHandler.js   # Error handling
    ├── models/               # 📊 Database models
    │   └── user.js           # User schema
    └── routes/               # 🛣️ API routes
        └── authRoutes.js     # Authentication endpoints
```

## 🛠 API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - User registration with email validation
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/profile` - Get user profile (protected route)
- `PUT /api/auth/profile` - Update user profile (protected route)

### Health & Status
- `GET /health` - Server health status and uptime
- `GET /api/status` - API status and version information

### Future Endpoints (Planned)
- `GET /api/clothes` - List available clothing items
- `POST /api/clothes` - Add new clothing item
- `POST /api/swap` - Initiate clothing swap
- `GET /api/points` - Get user points balance

## 🔧 Available Scripts

### Root Directory Commands
- `npm run dev` - 🚀 Start both client and server in development mode
- `npm run server:dev` - 🖥️ Start only the server in development mode  
- `npm run client:dev` - 🎨 Start only the client in development mode
- `npm run server:start` - 🖥️ Start server in production mode
- `npm run client:start` - 🎨 Start client in production mode
- `npm run install:all` - 📦 Install dependencies for all packages
- `npm run build` - 🏗️ Build the client for production

### Client-Specific Commands
```bash
cd client-reware
npm start          # Start development server
npm run build      # Create production build
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Server-Specific Commands
```bash
cd server-reware
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

## 🔒 Environment Variables

### Server Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/rewearDB |
| `JWT_SECRET` | JWT secret key | (required) |
| `NODE_ENV` | Environment | development |

### Client Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000 |
| `REACT_APP_NAME` | Application name | ReWear |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the `MONGO_URI` in your `.env` file

2. **Port Already in Use**
   - Change the `PORT` variable in server `.env`
   - Kill the process using the port: `npx kill-port 5000`

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in server `.env`
   - Clear localStorage in browser if getting auth errors

4. **CORS Issues**
   - Check that client URL is in the CORS whitelist in `server-reware/app.js`

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🚀 Deployment

### Production Build

```bash
# Build the client application
npm run build

# The build folder will contain optimized production files
```

### Deployment Options

#### Option 1: Traditional Hosting
1. Build the client: `npm run build`
2. Deploy the `client-reware/build` folder to your static hosting service
3. Deploy the `server-reware` folder to your Node.js hosting service

#### Option 2: Docker Deployment
```bash
# Create Dockerfiles for both client and server
# Use docker-compose for orchestration
```

#### Option 3: Cloud Platforms
- **Frontend**: Netlify, Vercel, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean App Platform
- **Database**: MongoDB Atlas or AWS DocumentDB

### Environment Setup for Production

1. Set `NODE_ENV=production` in server `.env`
2. Use a strong, randomly generated `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins for your domain
5. Enable HTTPS/SSL certificates
6. Configure environment variables on your hosting platform

## 👥 Team Members

| Name | GitHub |
|------|--------|
| **Shashan Lumbhani** | [@soni-shashan](https://github.com/soni-shashan) |
| **Banti Patel** | [@Bantipatel20](https://github.com/Bantipatel20) |
| **Dhaval Patel** | [@dsp2810](https://github.com/dsp2810) |
| **Prince Lad** | [@Princelad](https://github.com/Princelad) |

## 📧 Contact

- **Primary Contact**: 23cs058@charusat.edu.in
- **GitHub Issues**: [Report bugs or request features](https://github.com/BitForge101/Reware/issues)
- **Discussions**: [Join the conversation](https://github.com/BitForge101/Reware/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **React Team** - For the amazing React 19 framework and ecosystem
- **Express.js Community** - For the robust and flexible web framework
- **MongoDB Team** - For the powerful NoSQL database solution
- **Create React App** - For simplifying React development setup
- **Open Source Community** - For the countless libraries and tools
- **Sustainable Fashion Movement** - For inspiring our mission
- **All Contributors and Supporters** - Thank you for believing in sustainable fashion!

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=BitForge101/Reware&type=Date)](https://star-history.com/#BitForge101/Reware&Date)

---

**🌱 Built with ❤️ for a sustainable future | Making fashion circular, one swap at a time**