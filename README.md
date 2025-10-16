# 🚀 Startup Management & Reporting System (SMRS)

A comprehensive web application designed to help founders track their startup journey from ideation to scale. Built with Next.js 14, TypeScript, MongoDB, and Prisma.

## ✨ Features

### ✅ Completed Features

1. **Authentication System**
   - User registration and login with NextAuth.js
   - Secure password hashing with bcryptjs
   - Protected routes with middleware

2. **Startup Profile Management**
   - Create and edit startup profiles
   - Track registration details (SECP, FBR, NTN, Trademark)
   - Brand details (Vision, Mission, Tagline)
   - Contact information
   - Stage tracking (Ideation → Scale)

3. **Weekly Progress Tracker**
   - Log weekly milestones achieved
   - Track new activities and challenges
   - Document actions taken and next goals
   - Request support when needed
   - Dynamic form with add/remove fields

4. **Dashboard Overview**
   - Statistics cards showing key metrics
   - Quick action buttons
   - Recent activity feed
   - Latest mentor feedback display

5. **Responsive UI**
   - Mobile-friendly sidebar navigation
   - Clean, modern design with Tailwind CSS
   - Icon integration with Lucide React

### 🚧 Features To Be Completed

6. **Monthly Tracker** - Similar to weekly tracker but for monthly summaries
7. **KPI Dashboard** - Visualize metrics with Recharts (marketing, sales, product, operations)
8. **Timeline/Milestone Tracker** - Visual progression through startup stages
9. **Document Management** - Upload and categorize files with expiry reminders
10. **Mentor Feedback System** - Log meeting notes, feedback, and progress scores
11. **Report Generation** - Auto-generate PDF reports using jsPDF
12. **Export & Sharing** - Email, download, and cloud sharing options

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts (for KPI visualizations)
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB database (either local or MongoDB Atlas account)
- Git (optional, for cloning)

## 🚀 Getting Started

### 1. Setup MongoDB Database

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Option B: Local MongoDB**

1. Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/
2. Start MongoDB service:
   ```bash
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```
3. Your connection string will be: `mongodb://localhost:27017/startup-mgmt`

### 2. Configure Environment Variables

Update the `.env` file in the project root with your MongoDB connection:

```bash
# MongoDB Connection
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/startup-mgmt?retryWrites=true&w=majority"

# Or for local MongoDB:
# DATABASE_URL="mongodb://localhost:27017/startup-mgmt"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Install Dependencies & Setup Database

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema to MongoDB
npx prisma db push
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### First Time Setup

1. **Register an Account**
   - Go to http://localhost:3000
   - Click "Get Started Free"
   - Fill in your name, email, and password
   - Click "Sign Up"

2. **Login**
   - You'll be redirected to the login page
   - Enter your credentials
   - Click "Sign In"

3. **Create Startup Profile**
   - You'll be prompted to create a startup profile
   - Fill in your startup details:
     - Name, founders, industry, niche
     - Registration details (SECP, FBR, Trademark)
     - Vision, mission, tagline
     - Contact information
   - Click "Create Profile"

4. **Use the Dashboard**
   - **Dashboard**: Overview of your startup stats
   - **Startup Profile**: Edit your startup information
   - **Weekly Tracker**: Log weekly progress
   - **Monthly Tracker**: (To be implemented)
   - **KPI Dashboard**: (To be implemented)
   - **Timeline**: (To be implemented)
   - **Documents**: (To be implemented)
   - **Mentor Feedback**: (To be implemented)

### Logging Weekly Progress

1. Click "Weekly Tracker" in the sidebar
2. Click "New Entry" button
3. Fill in:
   - Week number, month, year
   - Milestones achieved (click "+ Add More" for multiple)
   - New activities
   - Challenges faced
   - Actions taken
   - Next week's goals
   - Support needed
4. Click "Save Weekly Entry"

## 🗂️ Project Structure

```
startup-mgmt-system/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── register/       # User registration
│   │   ├── startup/        # Startup CRUD
│   │   ├── weekly/         # Weekly tracker API
│   │   └── kpi/            # KPI API
│   ├── dashboard/          # Protected dashboard pages
│   │   ├── profile/        # Startup profile page
│   │   ├── weekly/         # Weekly tracker page
│   │   ├── monthly/        # Monthly tracker (TBD)
│   │   ├── kpis/           # KPI dashboard (TBD)
│   │   ├── timeline/       # Timeline view (TBD)
│   │   ├── documents/      # Document management (TBD)
│   │   └── mentor/         # Mentor feedback (TBD)
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   └── AuthProvider.tsx    # NextAuth session provider
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   └── prisma.ts          # Prisma client instance
├── prisma/
│   └── schema.prisma      # Database schema
├── types/
│   └── next-auth.d.ts     # TypeScript type definitions
├── middleware.ts          # Route protection
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 📊 Database Schema

### User
- Authentication credentials
- One-to-many relationship with Startups

### Startup
- Basic info (name, founders, industry, stage)
- Registration details (SECP, FBR, Trademark)
- Brand details (vision, mission, tagline)
- Relations to all tracking data

### WeeklyTracker
- Week-by-week progress logging
- Milestones, activities, challenges, goals

### MonthlyTracker
- Monthly summaries and achievements

### KPI
- Categorized metrics (Marketing, Sales, Product, Operations)
- Time-series data for charts

### Milestone
- Stage-based milestone tracking
- Completion status and dates

### Document
- File metadata and categorization
- Expiry tracking for renewals

### MentorFeedback
- Meeting notes and feedback
- Progress scoring (1-10)
- Assigned tasks

## 🔧 Development Tips

### Adding a New Page

1. Create the page component in `app/dashboard/[page-name]/page.tsx`
2. Add the API route in `app/api/[route-name]/route.ts`
3. Update navigation in `app/dashboard/layout.tsx`

### Viewing Database Records

Use Prisma Studio for a GUI view of your data:
```bash
npx prisma studio
```

Opens at http://localhost:5555

### Common Issues

**1. Database Connection Error**
- Verify your `DATABASE_URL` in `.env`
- Check MongoDB is running (if local)
- Ensure IP is whitelisted in MongoDB Atlas

**2. Authentication Not Working**
- Make sure `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

**3. Prisma Client Not Found**
- Run `npx prisma generate`
- Restart the dev server

## 📝 Next Steps for Development

### 1. Monthly Tracker (Similar to Weekly)
- Create `app/api/monthly/route.ts`
- Create `app/dashboard/monthly/page.tsx`
- Use similar structure as weekly tracker

### 2. KPI Dashboard with Charts
```bash
# Already installed: recharts
```
- Create dynamic charts for each KPI category
- Implement date range filtering
- Add export to CSV functionality

### 3. Timeline Visualization
- Create stage progression UI
- Milestone completion checklist
- Progress percentage calculation

### 4. Document Management
- Implement file upload (consider using Uploadthing or Cloudinary)
- Create expiry reminder system
- Add document preview functionality

### 5. Report Generation
- Design PDF template
- Use jsPDF to generate reports
- Include startup profile + KPIs + summaries
- Add branding/logo support

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel: https://vercel.com/new
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Detect Next.js
- Install dependencies
- Build the project
- Deploy with HTTPS

### MongoDB Atlas for Production
- Use MongoDB Atlas for production database
- Update `DATABASE_URL` in Vercel environment variables
- Add Vercel deployment URL to MongoDB Atlas IP whitelist (or allow all: 0.0.0.0/0)

## 📄 License

MIT License - feel free to use this for your incubation center or startup.

---

**Built for founders, by founders. Track your journey. 🚀**
