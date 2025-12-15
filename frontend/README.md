# LearnLink Frontend

React + Vite frontend for LearnLink.

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **JavaScript** - Programming language

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx        # Main application component
│   ├── App.css        # App styles
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
└── package.json
```

## Development

The development server includes:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Proxy configuration to backend API at `http://localhost:5000`

All `/api/*` requests are automatically proxied to the backend server.

## Building for Production

```bash
npm run build
```

The optimized production build will be created in the `dist/` directory.

