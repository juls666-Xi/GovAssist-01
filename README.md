# GovAssist Pro

A secure, modern, full-stack Government Assistance and Document Management System for municipalities, barangays, and local government units.

## 🎯 Overview

GovAssist Pro is a comprehensive digital platform that enables:
- **Citizens** to apply for government assistance online, upload documents, track status, and receive notifications
- **Staff** to review applications, verify documents, approve/reject with remarks, and schedule claims
- **Admins** to manage users, programs, generate reports, view audit logs, and configure system settings

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v5 (Auth.js) |
| **File Uploads** | UploadThing |
| **Charts** | Recharts |
| **Hosting** | Vercel |

## 📁 Project Structure

```
gov-assist-pro/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (dashboard)/       # Dashboard pages
│   │   │   ├── citizen/       # Citizen dashboard
│   │   │   ├── staff/         # Staff dashboard
│   │   │   └── admin/         # Admin dashboard
│   │   ├── (public)/          # Public pages (about, contact)
│   │   ├── api/               # API routes
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── dashboard/         # Dashboard components
│   │   └── forms/             # Form components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   ├── next-auth.d.ts     # NextAuth type extensions
│   │   └── index.ts           # Shared types
│   └── hooks/
│       └── use-toast.ts       # Toast hook
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- (Optional) UploadThing account for file uploads

### 1. Clone & Install

```bash
git clone <repository-url>
cd gov-assist-pro
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gov_assist_pro?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@govassist.local | password123 |
| Staff | staff@govassist.local | password123 |
| Citizen | pedro@email.com | password123 |

## 📊 Database Schema

### Core Tables
- **users** - User accounts with roles (CITIZEN, STAFF, ADMIN)
- **assistance_programs** - Available assistance programs
- **applications** - Citizen applications for programs
- **documents** - Uploaded documents with verification status
- **notifications** - System notifications
- **schedules** - Claim schedules for approved applications
- **audit_logs** - Complete action audit trail
- **system_settings** - Platform configuration

## 🎨 Features

### Citizen Features
- ✅ Account registration & profile management
- ✅ Browse assistance programs
- ✅ Submit applications with document uploads
- ✅ Real-time application status tracking
- ✅ Receive notifications
- ✅ View claim schedules
- ✅ Download approval documents

### Staff Features
- ✅ Dashboard with pending applications
- ✅ Review and verify applications
- ✅ Approve/reject with remarks
- ✅ Document verification
- ✅ Schedule claims
- ✅ Search and filter applicants

### Admin Features
- ✅ Analytics dashboard with charts
- ✅ User management (CRUD + status control)
- ✅ Program management (CRUD)
- ✅ Report generation (PDF/CSV export)
- ✅ Complete audit log viewer
- ✅ System settings configuration

## 🔒 Security

- Input validation with Zod
- SQL injection prevention via Prisma
- Role-based access control middleware
- Secure password hashing (bcrypt)
- Session-based authentication
- Protected API routes
- Audit logging for all actions

## 🌐 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Add build command: `prisma generate && next build`
5. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="production-secret-key"
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset and reseed database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for government and non-government purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Database ORM by [Prisma](https://prisma.io)
- Authentication by [Auth.js](https://authjs.dev)
- File uploads by [UploadThing](https://uploadthing.com)
