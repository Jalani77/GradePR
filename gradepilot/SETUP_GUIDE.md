# GradePilot Setup Guide

This guide will help you set up GradePilot with Supabase authentication and database integration.

## Prerequisites

- Node.js 16+ installed
- A Supabase account (free tier works fine)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and fill in:
   - Project name: `gradepilot` (or any name you prefer)
   - Database password: Choose a strong password
   - Region: Select the closest region to you
4. Click "Create new project" and wait for setup to complete (~2 minutes)

## Step 2: Run the Database Migration

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-migration.sql` from this repository
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see a success message

This creates:
- `categories` table with Row Level Security (RLS)
- `assignments` table with RLS
- `user_settings` table with RLS
- All necessary policies for user data isolation
- Triggers for automatic timestamp updates

## Step 3: Configure Authentication

### Enable Email/Password Authentication

1. In Supabase dashboard, go to **Authentication > Providers**
2. Make sure **Email** is enabled (it's enabled by default)
3. Under **Email Auth**, you can configure:
   - Confirm email: Toggle based on your needs
   - Secure password change: Recommended to keep enabled

### Enable Google OAuth (Optional)

1. In Supabase dashboard, go to **Authentication > Providers**
2. Find **Google** and click to expand
3. Toggle "Enable Sign in with Google"
4. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client ID
   - Set authorized redirect URI to: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
5. Paste the Client ID and Client Secret into Supabase
6. Save the configuration

## Step 4: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings > API**
2. You'll need two values:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this (a long JWT token)

## Step 5: Configure Environment Variables

1. In the `gradepilot` directory, create a `.env` file
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit your `.env` file to version control!

## Step 6: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)
- @supabase/supabase-js (Supabase client)

## Step 7: Run the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## Step 8: Test the Application

1. **Sign Up**: Create a new account with email/password or Google
2. **Create Categories**: Add your first course category
3. **Add Assignments**: Add assignments to categories
4. **See Forecast**: Use the What-If simulator and Safety Margin calculator
5. **Test Persistence**: Refresh the page - your data should persist!

## Features Included

### Authentication
- ✅ Email/password authentication
- ✅ Google OAuth sign-in
- ✅ Automatic session management
- ✅ Protected routes
- ✅ Sign out functionality

### UI Improvements
- ✅ 3-column responsive grid layout
- ✅ Large, prominent Current Grade card (text-5xl) with progress ring
- ✅ Setup Progress card (replaces red error banner)
- ✅ Enhanced Welcome screen with feature cards
- ✅ Hover effects on category cards
- ✅ Conditional grade coloring (orange <70%, green >90%)
- ✅ Outline-style "Add Category" button
- ✅ Icon-based "Add Assignment" button (+)

### Grade Forecast Enhancements
- ✅ What-If slider for real-time scenario testing
- ✅ Safety Margin calculation
- ✅ Required on Remaining percentage
- ✅ Best/worst case projections

### Data Management
- ✅ Supabase integration for all CRUD operations
- ✅ Real-time data persistence
- ✅ Loading skeletons for better UX
- ✅ Error boundary for graceful error handling
- ✅ Row Level Security (RLS) for data privacy

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after changing `.env`

### "Row Level Security policy violation"
- Make sure you ran the entire migration SQL script
- Check that RLS policies were created successfully in Supabase > Database > Policies

### Google OAuth not working
- Verify the redirect URI is correct in Google Cloud Console
- Make sure you've enabled Google provider in Supabase
- Check that Client ID and Secret are correct

### Data not persisting
- Open browser DevTools > Console to check for errors
- Verify you're logged in (check if you see the logout button)
- Check Supabase > Table Editor to see if data is being saved

## Architecture

### File Structure
```
gradepilot/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── CategoryCard.jsx       # Category/assignment cards
│   │   ├── GradeForecast.jsx      # Grade forecast widget
│   │   ├── LoginPage.jsx          # Authentication page
│   │   ├── LoadingSkeleton.jsx    # Loading states
│   │   └── ErrorBoundary.jsx      # Error handling
│   ├── hooks/
│   │   ├── useAuth.js             # Auth context/hooks
│   │   ├── useSupabaseData.js     # Data fetching hooks
│   │   ├── useGradeLogic.js       # Grade calculations
│   │   └── usePersistentState.js  # (Legacy localStorage)
│   ├── utils/
│   │   └── supabase/
│   │       └── client.js          # Supabase client config
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── supabase-migration.sql         # Database schema
├── .env.example                   # Environment template
└── package.json                   # Dependencies
```

### Database Schema

**categories**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (TEXT)
- `weight` (DECIMAL)
- `created_at` / `updated_at` (TIMESTAMP)

**assignments**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `category_id` (UUID, Foreign Key to categories)
- `name` (TEXT)
- `points_earned` (DECIMAL, nullable)
- `points_possible` (DECIMAL)
- `created_at` / `updated_at` (TIMESTAMP)

**user_settings**
- `user_id` (UUID, Primary Key, Foreign Key to auth.users)
- `target_grade` (DECIMAL)
- `grade_scale_a/b/c/d` (DECIMAL)
- `created_at` / `updated_at` (TIMESTAMP)

## Security

- All tables have Row Level Security (RLS) enabled
- Users can only access their own data via `auth.uid()` policies
- API keys are environment variables (never committed)
- Supabase handles all authentication securely

## Next Steps

1. Customize the grade scale to match your institution
2. Add more categories and assignments
3. Explore the What-If simulator
4. Invite others to use it (each user has isolated data)

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the code comments in the source files
- Check browser console for specific error messages
