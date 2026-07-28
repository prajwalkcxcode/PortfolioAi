# PortfolioAI Version 2 - Setup Guide

This guide will help you set up the database and run the application with authentication and database integration.

## Prerequisites

- Node.js 18+ installed
- A Supabase project (already created)
- Supabase project URL and Anon Key (already configured in .env)

## Database Setup

### Step 1: Run the SQL Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `oabewgpfmnsozgcyjmvs`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `database/schema.sql` file
6. Paste it into the SQL Editor
7. Click **Run** to execute the SQL

This will create the following tables:
- `users` - User profiles
- `portfolios` - Portfolio data
- `projects` - Project details
- `skills` - Skills information

It will also set up:
- Row Level Security (RLS) policies for data protection
- Indexes for better performance
- Triggers for automatic timestamp updates

### Step 2: Verify Tables

After running the SQL, verify the tables were created:
1. Go to **Database** > **Tables** in the Supabase dashboard
2. You should see: `users`, `portfolios`, `projects`, `skills`
3. Click on each table to verify the structure

## Running the Application

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Application

The application now runs both the frontend (Vite) and backend (Express server) concurrently:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173 (or next available port)
- Backend API: http://localhost:3001

### Step 3: Test the Application

1. Open your browser to the frontend URL
2. Click **Get Started** to register a new account
3. Fill in your name, email, and password
4. After registration, you'll be redirected to the Dashboard
5. Click **Create Portfolio** to build your first portfolio
6. Fill in the multi-step form (Personal Info, Skills, Projects, Template)
7. Preview your portfolio with the selected template

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout user
- `GET /auth/user` - Get current user

### Portfolios
- `GET /portfolios` - Get user's portfolios
- `GET /portfolios/:id` - Get specific portfolio
- `POST /portfolios` - Create new portfolio
- `PUT /portfolios/:id` - Update portfolio
- `DELETE /portfolios/:id` - Delete portfolio

### Projects
- `GET /portfolios/:portfolioId/projects` - Get portfolio projects
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Skills
- `GET /portfolios/:portfolioId/skills` - Get portfolio skills
- `POST /skills` - Create new skill
- `PUT /skills/:id` - Update skill
- `DELETE /skills/:id` - Delete skill

## Environment Variables

The `.env` file contains:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_URL` - Backend Supabase URL
- `SUPABASE_ANON_KEY` - Backend Supabase anon key
- `PORT` - Backend server port (default: 3001)

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify your Supabase URL and Anon Key are correct in `.env`
2. Check that the SQL schema was run successfully
3. Ensure RLS policies are enabled

### Authentication Issues

If login/register doesn't work:
1. Check the browser console for error messages
2. Verify Supabase Auth is enabled in your project
3. Ensure email confirmation is disabled (for testing)

### API Errors

If API calls fail:
1. Ensure the backend server is running on port 3001
2. Check that the session token is being saved to localStorage
3. Verify CORS is configured correctly in the backend

## Development Notes

- The backend server runs on port 3001
- The frontend runs on port 5173 (or next available)
- Session tokens are stored in localStorage as `sb-access-token`
- All API calls require the Bearer token in the Authorization header
- RLS policies ensure users can only access their own data

## Next Steps

After setup is complete:
1. Test the full authentication flow
2. Create a test portfolio
3. Verify data persistence in Supabase
4. Test portfolio preview functionality

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the backend server terminal for API errors
3. Verify the Supabase dashboard for database errors
4. Ensure all dependencies are installed correctly
