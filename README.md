# CoSync - Team Scheduler

A full-stack team scheduling application built with React, Node.js, and PostgreSQL.

## Project Structure

```
.
├── backend/              # Express API server
├── frontend/             # React application
├── docs/                 # Documentation
└── package.json          # Monorepo configuration
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Deployment**: Vercel (frontend), Render (backend), Render PostgreSQL (database)

## Features

- ✅ User authentication with role-based access control
- ✅ Three roles: Admin, CPPO (Manager), PPO (Staff)
- ✅ Staff build and manage their own schedules
- ✅ View all team member schedules
- ✅ Persistent data storage
- ✅ Responsive design

## Roles

- **Admin**: Full system access, manage users and roles
- **CPPO** (Chief Probation and Parole Officer): Managers, can view all schedules
- **PPO** (Probation and Parole Officer): Staff, can only edit their own schedule

## Getting Started

### Local Development

**Prerequisites**: Node.js 16+, PostgreSQL 12+

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup database** (see `backend/README.md`)

3. **Backend**
   ```bash
   cd backend
   npm run dev
   ```

4. **Frontend** (in new terminal)
   ```bash
   cd frontend
   npm start
   ```

### Deployment

See individual README files in `backend/` and `frontend/` directories.

## Environment Variables

See `.env.example` files in `backend/` and `frontend/` directories.

## Development Status

- [x] Project structure
- [ ] Database schema
- [ ] Backend API
- [ ] Frontend components
- [ ] Authentication
- [ ] Deployment

---

For detailed documentation, see the README files in each directory.
