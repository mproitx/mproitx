# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8vqzns7lohkx

# PM - Roit (Personal Manager - Rohit) - Educational Web App

## 📱 एप्लिकेशन विवरण

यह एक Advanced Educational Progressive Web App (PWA) है जो Class 8 से 12 के students के लिए comprehensive study material और AI-powered learning assistance प्रदान करती है।

## ✨ मुख्य विशेषताएं

### 1. Student Dashboard
- **8 Categories**: Notes, PYQ, Important Questions, Reference Books, Mind Maps, Formulas, MCQ Tests, IIT-JEE Questions
- **Class-wise Navigation**: कक्षा 8 से 12 तक
- **Subject & Chapter Organization**: विषय और अध्याय के अनुसार व्यवस्थित
- **Recently Viewed**: हाल ही में देखे गए content
- **Recently Downloaded**: हाल ही में download किए गए content
- **In-app PDF Viewer**: Professional PDF reader with zoom, rotate, fullscreen

### 2. Admin Panel
- **Content Upload**: Multi-file upload, drag-drop, auto-compression, organized storage
- **MCQ Upload**: 4 options (A-D), correct answer marking, difficulty levels
- **Student Management**: View users, search, role management (user/admin)
- **Notifications**: Send announcements to all or specific classes

### 3. AI Helper (PM Roit AI Assistant)
- **Subjects**: Physics, Chemistry, Mathematics
- **Features**: Definitions, formulas, step-by-step solutions, question answering
- **Powered by**: Gemini 2.5 Flash
- **Mobile-Friendly**: Fully responsive chat interface

### 4. User Authentication
- **Login/Signup**: Email और Password
- **Profile Management**: Photo upload, phone number, password change
- **Role-based Access**: User और Admin roles
- **Admin Access**: केवल masumboy141@gmail.com (password: 12/07/2008MP)

### 5. PWA Features
- **Install to Home Screen**: Mobile devices पर install करें
- **Offline Capability**: Service Worker implementation
- **Fast Loading**: Optimized performance
- **Native App Experience**: Standalone display mode

## 🎨 Design Features

- **Modern UI**: Glassmorphic effects, gradient backgrounds
- **Dark Mode**: Day/Night mode toggle
- **Animations**: Smooth transitions, fade-in, pulse-glow effects
- **Responsive**: Mobile (375px+) to Desktop (1920px+)
- **Touch-Friendly**: Optimized for mobile devices

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database + Storage + Auth)
- **AI**: Google Gemini 2.5 Flash API
- **State Management**: React Context + Hooks
- **Routing**: React Router v6

## 📁 Project Structure

```
/workspace/app-8vqzns7lohkx/
├── public/
│   ├── favicon.png              # App icon
│   └── manifest.json            # PWA manifest
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── PDFViewer.tsx   # Professional PDF viewer
│   │   │   └── ...
│   │   ├── layouts/             # Layout components
│   │   └── common/              # Common components
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ContentListPage.tsx
│   │   ├── ContentViewerPage.tsx
│   │   ├── AIHelperPage.tsx
│   │   ├── MCQTestPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminContentUploadPage.tsx
│   │       ├── AdminMCQUploadPage.tsx
│   │       ├── AdminStudentManagementPage.tsx
│   │       └── AdminNotificationsPage.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── db/
│   │   ├── supabase.ts          # Supabase client
│   │   └── api.ts               # API functions
│   ├── lib/
│   │   ├── constants.ts         # Constants and utilities
│   │   └── utils.ts             # Helper functions
│   ├── types/
│   │   └── types.ts             # TypeScript types
│   ├── routes.tsx               # Route configuration
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Global styles
│   └── main.tsx                 # Entry point
├── supabase/
│   └── migrations/              # Database migrations
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🗄️ Database Schema

### Tables:
1. **profiles** - User profiles with role management
2. **content** - Educational content (PDFs, images, etc.)
3. **mcq_questions** - Multiple choice questions
4. **notifications** - System notifications
5. **recently_viewed** - Track viewed content
6. **downloads** - Track downloaded content

### Storage Buckets:
1. **app-8vqzns7lohkx_profile_images** - Profile photos
2. **app-8vqzns7lohkx_content_files** - Educational content files

## 🚀 Setup Instructions

### Prerequisites:
- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### Installation Steps:

1. **Install Dependencies**:
```bash
cd /workspace/app-8vqzns7lohkx
npm install
```

2. **Environment Variables**:
Create `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_ID=app-8vqzns7lohkx
```

3. **Run Development Server**:
```bash
npm run dev
```

4. **Build for Production**:
```bash
npm run build
```

## 👤 Admin Access

- **Email**: masumboy141@gmail.com
- **Password**: 12/07/2008MP

## 📱 Mobile Installation

1. Open app in mobile browser
2. Click "Add to Home Screen"
3. App will install like a native app
4. Works offline after installation

## 🎯 Key Features Implementation

### PDF Viewer:
- Zoom: 50% to 200%
- Rotate: 90° increments
- Fullscreen mode
- Download functionality
- Google Docs fallback for compatibility

### AI Helper:
- Real-time chat interface
- Message history
- Quick question buttons
- Character counter (max 1000)
- Powered by Gemini 2.5 Flash

### Content Upload:
- Multi-file selection
- Drag and drop support
- Auto image compression (under 1MB)
- Progress tracking
- Organized by category/class/subject/chapter

### MCQ System:
- 4 options (A, B, C, D)
- Correct answer marking
- Difficulty levels (easy, medium, hard)
- Explanation field
- Automatic scoring

## 🔒 Security Features

- Secure authentication with Supabase Auth
- Row Level Security (RLS) policies
- Admin-only access control
- Password encryption
- Secure file storage

## 📊 Performance

- Fast loading with Vite
- Code splitting
- Lazy loading of routes
- Image optimization
- Efficient state management

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

- First registered user becomes admin automatically
- Content requires login to download
- PDF viewer works best in Chrome/Edge
- Mobile experience optimized for touch
- Dark mode follows system preference

## 🆘 Support

For issues or questions, contact: masumboy141@gmail.com

---

**Version**: 1.0.0  
**Last Updated**: January 12, 2026  
**License**: Private Educational Use  
**Copyright**: © 2026 PM - Roit (Personal Manager - Rohit)
