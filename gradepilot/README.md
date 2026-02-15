# GradePilot

![GradePilot](https://img.shields.io/badge/Grade-Tracking-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue)

**Smart Grade Tracking & Forecasting Dashboard**

GradePilot is an intelligent grade tracking application that helps students monitor their academic performance, forecast final grades, and plan their study strategy with precision.

## ✨ Features

### 🎯 Grade Forecasting
- **What-If Simulator**: Interactive slider to see how different scores affect your final grade
- **Safety Margin**: Know exactly how many points you can afford to lose before dropping a letter grade
- **Required Average**: Calculate what you need on remaining assignments to hit your target
- **Best/Worst Case**: See your grade range based on possible scenarios

### 📊 Smart Analytics
- **Weighted Categories**: Organize assignments by category with custom weights
- **Real-time Calculations**: Instant updates as you enter grades
- **Performance Tracking**: Visual badges showing your academic standing
- **Progress Indicators**: Setup progress cards and visual cues

### 🎨 Beautiful UI
- **Modern Design**: Clean Uber-inspired design system
- **Responsive Layout**: 3-column grid that adapts to any screen size
- **Conditional Coloring**: Grades change color based on performance (<70% orange, >90% green)
- **Smooth Animations**: Hover effects, transitions, and loading skeletons
- **Inline Editing**: Click any value to edit in place

### 🔐 Secure & Private
- **User Authentication**: Email/password and Google OAuth
- **Private Data**: Row Level Security ensures your grades are yours alone
- **Cloud Sync**: Data persists across devices via Supabase
- **Error Handling**: Graceful error boundaries and user-friendly messages

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- A Supabase account (free tier works great)

### Installation

1. **Clone and Install**
   ```bash
   cd gradepilot
   npm install
   ```

2. **Set Up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL migration (see [SETUP_GUIDE.md](./SETUP_GUIDE.md))
   - Enable Email and/or Google authentication

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:5173`

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## 🎮 How to Use

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Add Categories**: Create categories for your course components (e.g., "Exams 40%", "Homework 30%")
3. **Add Assignments**: Click the `+` button to add assignments to each category
4. **Enter Grades**: Click any score to edit. Leave blank for ungraded work
5. **Set Target**: Use the Grade Forecast panel to set your target grade
6. **Explore What-If**: Use the slider to simulate different scores
7. **Check Safety Margin**: See how much wiggle room you have

## 🏗️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email + OAuth)

## 📁 Project Structure

```
gradepilot/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Supabase client & utilities
│   ├── App.jsx          # Root component
│   └── index.css        # Global styles
├── supabase-migration.sql  # Database schema
├── .env.example         # Environment template
└── package.json         # Dependencies
```

## 🎨 UI Highlights

- **3-Column Responsive Grid**: Stats, categories, and forecast
- **Large Grade Display**: text-5xl font with circular progress ring
- **Setup Progress Card**: Soft blue/amber info theme instead of error red
- **Enhanced Welcome Screen**: Three feature cards explaining capabilities
- **Hover Effects**: Subtle shadows and transitions on category cards
- **Icon Buttons**: Minimalist `+` button for adding assignments
- **Outline Buttons**: Primary outline style for "Add Category"

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- User data isolation via `auth.uid()`
- Secure password requirements
- OAuth 2.0 for Google sign-in
- Environment variable protection

## 🧪 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Database Schema

### Tables
- **categories**: Course categories with weights
- **assignments**: Individual assignments with scores
- **user_settings**: User preferences and grade scale

All tables include:
- Row Level Security policies
- Automatic timestamp updates
- Foreign key relationships
- Data validation constraints

## 🤝 Contributing

This is a personal grade tracking tool, but you're welcome to fork and customize it for your needs!

## 📄 License

MIT License - feel free to use this for your own grade tracking needs.

## 🙏 Acknowledgments

- Design inspired by Uber's Base Design System
- Icons by Lucide
- Database and auth powered by Supabase
- Built with React and Vite

## 📞 Support

Need help? Check out:
- [Setup Guide](./SETUP_GUIDE.md) for detailed instructions
- [Supabase Docs](https://supabase.com/docs) for database help
- Browser console for debugging errors

---

**Made with ❤️ for students who like to stay on top of their grades**
