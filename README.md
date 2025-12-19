# LEARNLINK

LearnLink is a comprehensive platform that connects students with professors for personalized online lessons. It facilitates course discovery, booking, payment processing, and communication between students and educators.

## Features

- **User Authentication**: Secure login and registration for students and professors
- **Professor Profiles**: Detailed profiles showcasing expertise, availability, and reviews
- **Course Management**: Professors can create and manage courses with lessons
- **Booking System**: Students can book lessons based on professor availability
- **Payment Integration**: Secure payment processing for lessons
- **Messaging**: In-app messaging between students and professors
- **Reviews and Ratings**: Students can leave feedback on lessons and professors
- **Dashboard**: Separate dashboards for students and professors to manage their activities

## Tech Stack

### Frontend (Client)
- **React**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Router**: Declarative routing for React
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library

### Backend (Server)
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **Sequelize**: Promise-based Node.js ORM for MySQL
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Swagger**: API documentation
- **Jest**: Testing framework
- **Supertest**: HTTP endpoint testing

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LEARNLINK-1
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up the database**
   - Create a MySQL database
   - Create a `.env` file in the `server` directory with the following variables:
     ```
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=learnlink_db
     JWT_SECRET=your_jwt_secret
     PORT=3000
     ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## Usage

1. **Start the server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the client**
   ```bash
   cd ../client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - API documentation is available at `http://localhost:3000/api-docs`

## Testing

Run tests for the server:
```bash
cd server
npm test
```

## API Endpoints

The API provides endpoints for:
- Authentication (`/api/auth`)
- Users and Profiles (`/api/profile`)
- Professors (`/api/professors`)
- Courses (`/api/courses`)
- Lessons (`/api/lessons`)
- Availability (`/api/availability`)
- Bookings (`/api/bookings`)
- Payments (`/api/payments`)
- Messages (`/api/messages`)
- Reviews (`/api/reviews`)

Detailed API documentation is available via Swagger at `/api-docs`.

## Project Structure

```
LEARNLINK-1/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API service functions
│   │   └── store/          # Context providers
│   └── ...
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   └── config/         # Configuration files
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   └── tests/              # Test files
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
