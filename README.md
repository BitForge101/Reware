
# ReWear - Sustainable Fashion Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%3E%3D18.0.0-blue)](https://reactjs.org/)

ReWear is a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🌟 Features

- **User Authentication**: Secure signup and login system
- **Dashboard**: User profile and activity tracking
- **Clothing Exchange**: Point-based system for clothing swaps
- **Responsive Design**: Mobile-friendly interface
- **Sustainable Fashion Focus**: Promoting eco-friendly practices

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 14.0.0)
- npm or yarn
- MongoDB (local or remote)

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
├── client-reware/          # React frontend application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
├── server-reware/          # Node.js backend application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── package.json
├── package.json            # Root package with scripts
└── README.md
```

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Health Check
- `GET /health` - Server health status

## 🔧 Available Scripts

From the root directory:

- `npm run dev` - Start both client and server in development mode
- `npm run server:dev` - Start only the server in development mode
- `npm run client:dev` - Start only the client in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run build` - Build the client for production

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
npm run build
```

### Environment Setup for Production

1. Set `NODE_ENV=production` in server `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins

## 👥 Team Members

- [Shashan Lumbhani](https://github.com/soni-shashan)
- [Banti Patel](https://github.com/Bantipatel20)
- [Dhaval Patel](https://github.com/dsp2810)
- [Prince Lad](https://github.com/Princelad)

## 📧 Contact

Email: 23cs058@charusat.edu.in

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB team
- All contributors and supporters

---

**Built with ❤️ for a sustainable future**