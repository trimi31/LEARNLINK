# LearnLink Backend

Node.js + Express + Sequelize backend API for LearnLink.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM for MySQL
- **MySQL** - Database
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # Sequelize database connection
│   │   └── config.json     # Sequelize CLI configuration
│   ├── middleware/
│   │   └── errorHandler.js # Error handling middleware
│   ├── migrations/         # Database migrations
│   ├── models/             # Sequelize models
│   ├── routes/
│   │   └── index.js        # API routes
│   ├── seeders/            # Database seeders
│   ├── app.js              # Express app configuration
│   └── server.js           # Server entry point
├── .sequelizerc            # Sequelize CLI configuration
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learnlink_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 3. Create Database

Make sure MySQL is running, then create the database:

```bash
npm run db:create
```

### 4. Run Migrations (when available)

```bash
npm run db:migrate
```

### 5. Seed Database (optional)

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Available Endpoints

### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

### Database Connection Test
```
GET /api/db-ping
Response: { "status": "ok", "message": "Database connection successful" }
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:create` - Create database
- `npm run db:drop` - Drop database
- `npm run db:migrate` - Run all pending migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:migrate:undo:all` - Undo all migrations
- `npm run db:seed` - Run all seeders
- `npm run db:seed:undo` - Undo all seeders

## Sequelize CLI Commands

### Create a new migration

```bash
npx sequelize migration:generate --name migration-name
```

### Create a new seeder

```bash
npx sequelize seed:generate --name seeder-name
```

### Create a new model

```bash
npx sequelize model:generate --name ModelName --attributes field1:string,field2:integer
```

## Error Handling

All API errors are returned in the following JSON format:

```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "stack": "Stack trace (development only)"
  }
}
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment (development/production) | development |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | learnlink_db |
| JWT_SECRET | JWT signing secret | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

