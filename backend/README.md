# Backend API

Express.js REST API for CoSync scheduling application.

## Setup

### 1. Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cosync_db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cosync_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 2. Database Setup

**Option A: Local PostgreSQL**

```bash
# Create database
createdb cosync_db

# Run migrations
npm run seed
```

**Option B: Render PostgreSQL (for production)**

- Create account at [render.com](https://render.com)
- Create PostgreSQL database
- Copy connection string to `DATABASE_URL`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users` - Get all users (Admin/CPPO only)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Schedules
- `GET /api/schedules` - Get all schedules (filtered by role)
- `GET /api/schedules/:userId` - Get user schedule
- `POST /api/schedules` - Create shift
- `PUT /api/schedules/:id` - Update shift
- `DELETE /api/schedules/:id` - Delete shift

### Units
- `GET /api/units` - Get all units
- `POST /api/units` - Create unit (Admin only)

## Deployment to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect to this GitHub repo
4. Add environment variables
5. Deploy

See [Render Documentation](https://render.com/docs)

## Database Schema

See `src/scripts/seed.ts` for schema definition.

## File Structure

```
backend/
├── src/
│   ├── index.ts           # Entry point
│   ├── config/            # Configuration
│   ├── routes/            # API routes
│   ├── controllers/        # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── db/                # Database utilities
│   ├── models/            # Data models/types
│   └── scripts/           # Utility scripts
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```
