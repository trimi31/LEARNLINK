# LearnLink Monorepo

A full-stack learning management platform built with React and Node.js.

## 🏗️ Architecture

This is a monorepo containing:

- **Backend**: Node.js + Express + Sequelize (MySQL)
- **Frontend**: React + Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) 
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LEARNLINK
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Set Up MySQL Database

Make sure MySQL is running on your machine. Create a database user if needed:

```sql
CREATE DATABASE learnlink_db;
```

### 4. Configure Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
```

Create `.env` with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=learnlink_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:5173
```

**Important**: Replace `your_mysql_password` with your actual MySQL password.

### 5. Create the Database

From the backend directory:

```bash
npm run db:create
```

### 6. Start the Development Servers

#### Option A: Start Both Servers Simultaneously (from root)

```bash
# From the root directory
npm run dev
```

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Verify Installation

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health
- **DB Ping**: http://localhost:5000/api/db-ping

The frontend will display the health status and database connection status.

## 📁 Project Structure

```
LEARNLINK/
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js        # Sequelize connection
│   │   │   └── config.json  # Sequelize CLI config
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # Sequelize models
│   │   ├── routes/
│   │   │   └── index.js     # API routes
│   │   ├── seeders/         # Database seeders
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables (create this)
│   ├── .sequelizerc         # Sequelize CLI config
│   ├── package.json
│   └── README.md
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css
│   │   ├── main.jsx         # Entry point
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js       # Vite configuration
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── package.json             # Root package.json (workspaces)
└── README.md                # This file
```

## 🛠️ Available Scripts

### Root Level

- `npm run dev` - Run both backend and frontend concurrently
- `npm run dev:backend` - Run backend only
- `npm run dev:frontend` - Run frontend only

### Backend Scripts

```bash
cd backend

# Development
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server

# Database Operations
npm run db:create        # Create database
npm run db:drop          # Drop database
npm run db:migrate       # Run migrations
npm run db:migrate:undo  # Undo last migration
npm run db:seed          # Run seeders
npm run db:seed:undo     # Undo seeders
```

### Frontend Scripts

```bash
cd frontend

npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health

Response:
{
  "status": "ok"
}
```

### Database Connection Test
```
GET /api/db-ping

Response:
{
  "status": "ok",
  "message": "Database connection successful"
}
```

## 🗄️ Database Management

### Creating Migrations

```bash
cd backend
npx sequelize migration:generate --name create-users-table
```

### Creating Models

```bash
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```

### Creating Seeders

```bash
npx sequelize seed:generate --name demo-users
```

## 🔒 Environment Variables

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Backend server port | 5000 | No |
| NODE_ENV | Environment mode | development | No |
| DB_HOST | MySQL host | localhost | Yes |
| DB_PORT | MySQL port | 3306 | Yes |
| DB_USER | MySQL username | root | Yes |
| DB_PASSWORD | MySQL password | - | Yes |
| DB_NAME | Database name | learnlink_db | Yes |
| JWT_SECRET | JWT signing secret | - | Yes |
| CORS_ORIGIN | Allowed origin for CORS | http://localhost:5173 | No |

## 🧪 Testing the Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Database Connection:**
   ```bash
   curl http://localhost:5000/api/db-ping
   ```

3. **Frontend:**
   Open http://localhost:5173 in your browser. You should see the LearnLink page displaying both API health and database connection status.

## 🐛 Troubleshooting

### MySQL Connection Issues

If you get a database connection error:

1. Verify MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo systemctl status mysql
   ```

2. Check your `.env` credentials match your MySQL setup
3. Ensure the database exists:
   ```bash
   cd backend
   npm run db:create
   ```

### Port Already in Use

If port 5000 or 5173 is already in use:

1. Change the PORT in `backend/.env`
2. Change the port in `frontend/vite.config.js`
3. Update CORS_ORIGIN accordingly

### Cannot Find Module Errors

If you get module not found errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Next Steps

Now that your skeleton is set up, you can:

1. **Create database models** using Sequelize
2. **Add API routes** for your features
3. **Build React components** for your UI
4. **Implement authentication** using JWT
5. **Add migrations** for your database schema
6. **Create seeders** for test data

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Express Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

This is a skeleton project. Build your features on top of this foundation!

## 📄 License

MIT

