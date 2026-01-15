# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8vqzns7lohkx

# 📚 PM - Roit Study Hub

<div align="center">

![PM Roit Logo](public/profile.png)

**Class 8-12 के छात्रों के लिए व्यापक शैक्षिक Progressive Web App**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E.svg)](https://supabase.com/)

</div>

---

## 📖 विवरण

**PM - Roit (Personal Manager - Rohit)** एक Advanced Educational Progressive Web App है जो Class 8 से 12 के students के लिए comprehensive study material और AI-powered learning assistance प्रदान करती है। यह app mobile devices पर install की जा सकती है और offline भी काम करती है।

## ✨ Features

### 🎓 Student Features
- **📝 Study Material**: Notes, PYQ, Important Questions, Reference Books
- **🧠 Mind Maps**: Visual learning aids
- **📐 Formulas**: Subject-wise formula collections
- **✅ MCQ Tests**: Practice tests with automatic scoring and timer
- **🎯 IIT-JEE Questions**: Advanced level questions for competitive exams
- **🤖 AI Helper**: AI-powered assistant for Physics, Chemistry, and Mathematics
- **📱 PWA Support**: Install on mobile devices, works offline
- **🌓 Dark Mode**: Eye-friendly dark theme support
- **📊 Progress Tracking**: View recently viewed and downloaded content

### 👨‍💼 Admin Features
- **📤 Content Upload**: Upload PDFs, images, and other educational materials
- **📋 Content Management**: Edit, delete, and organize uploaded content
- **👥 Student Management**: View registered students and their details
- **📝 MCQ Management**: Create and manage MCQ tests
- **🔔 Notifications**: Send announcements and exam reminders
- **📊 Analytics**: Track content usage and student engagement

### 🔐 Security Features
- **🔒 Secure Authentication**: Email and password-based login system
- **👤 User Profiles**: Profile photo upload, phone number management
- **🛡️ Admin Access Control**: Restricted admin panel access
- **🔐 Data Encryption**: Secure data storage with Supabase

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context + Hooks
- **Routing**: React Router v7
- **Build Tool**: Vite
- **PDF Viewer**: react-pdf
- **PWA**: Service Worker + Web App Manifest

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **Git**
- **Supabase Account** (free tier available)

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pm-roit-study-hub.git
cd pm-roit-study-hub
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public Key

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_APP_ID=your-app-id
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Setup Database

Run the migrations in your Supabase SQL Editor. Copy the SQL from `supabase/migrations/*.sql` files and run them in order.

Or use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 6. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Build the app
pnpm build

# Preview the production build
pnpm preview
```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the website
2. Click the install icon in the address bar
3. Click "Install"

### Mobile (Android)
1. Visit the website in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home screen"
4. Tap "Install"

### Mobile (iOS)
1. Visit the website in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

## 📂 Project Structure

```
pm-roit-study-hub/
├── public/                 # Static assets
│   ├── favicon.png        # App icon
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layouts/      # Layout components
│   │   └── common/       # Common components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   └── student/      # Student pages
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   ├── db/               # Database API functions
│   ├── types/            # TypeScript types
│   └── services/         # External services
├── supabase/             # Supabase configuration
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
└── docs/                 # Documentation
```

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: your-color;
  --secondary: your-color;
}
```

### Change App Name

1. Update `public/manifest.json`
2. Update `index.html` title
3. Update `package.json` name

### Change App Icon

Replace the following files in `public/`:
- `favicon.png`
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`

## 🔧 Configuration

### Admin Email

To change the admin email, update the check in:
- `src/pages/admin/AdminDashboard.tsx`
- `src/contexts/AuthContext.tsx`

### Content Categories

Edit `src/lib/constants.ts` to modify categories.

## 🧪 Testing

```bash
# Run linter
pnpm lint
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [PWA Installation Guide](PWA_INSTALL_HINDI.md)
- [Complete Package Guide](COMPLETE_PACKAGE.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rohit**
- Email: masumboy141@gmail.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Made with ❤️ for Students**

⭐ Star this repo if you find it helpful!

</div>
