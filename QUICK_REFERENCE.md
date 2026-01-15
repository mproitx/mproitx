# PM - Roit - Quick Reference Guide

## 🎯 Application Location

**Full Path**: `/workspace/app-8vqzns7lohkx/`

## 📋 Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔑 Admin Credentials

- **Email**: masumboy141@gmail.com
- **Password**: 12/07/2008MP

## 📱 Main Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page |
| Dashboard | `/dashboard` | Student dashboard |
| Category | `/category/:category` | Select class |
| Content List | `/content/:category/:class/:subject/:chapter` | View content |
| Content Viewer | `/content/view/:id` | View PDF/Image |
| AI Helper | `/ai-helper` | Chat with AI |
| MCQ Tests | `/mcq-test` | Take tests |
| Profile | `/profile` | User profile |
| Login | `/login` | Login/Signup |
| Admin Dashboard | `/admin` | Admin panel |
| Admin Upload | `/admin/upload` | Upload content |
| Admin MCQ | `/admin/mcq-upload` | Upload MCQ |
| Admin Students | `/admin/students` | Manage students |
| Admin Notifications | `/admin/notifications` | Send notifications |

## 🗂️ Important Files

### Configuration
- `package.json` - Dependencies
- `vite.config.ts` - Build config
- `tailwind.config.js` - Styling
- `tsconfig.json` - TypeScript
- `.env` - Environment variables

### Source Code
- `src/App.tsx` - Main app
- `src/routes.tsx` - Routes
- `src/index.css` - Global styles
- `src/main.tsx` - Entry point

### Components
- `src/components/ui/` - UI components
- `src/components/layouts/` - Layouts
- `src/components/common/` - Common components

### Pages
- `src/pages/` - All pages
- `src/pages/admin/` - Admin pages

### Context & State
- `src/contexts/AuthContext.tsx` - Auth state

### Database
- `src/db/supabase.ts` - Supabase client
- `src/db/api.ts` - API functions

### Types
- `src/types/types.ts` - TypeScript types

### Utilities
- `src/lib/constants.ts` - Constants
- `src/lib/utils.ts` - Helper functions

## 🎨 Design System

### Colors
- **Primary**: Blue gradient
- **Secondary**: Purple gradient
- **Accent**: Orange gradient
- **Background**: Dark/Light mode
- **Text**: Foreground colors

### Breakpoints
- **Mobile**: Default (375px+)
- **Desktop**: xl (1280px+)

### Components
- Cards with glassmorphic effect
- Gradient buttons
- Smooth animations
- Responsive layouts

## 🗄️ Database Tables

1. **profiles** - User data
2. **content** - Educational content
3. **mcq_questions** - MCQ questions
4. **notifications** - Notifications
5. **recently_viewed** - View history
6. **downloads** - Download history

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_APP_ID=app-8vqzns7lohkx
```

## 📦 Key Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **@supabase/supabase-js** - Backend
- **@google/generative-ai** - AI
- **tailwindcss** - Styling
- **lucide-react** - Icons
- **vite** - Build tool

## 🚀 Deployment Options

1. **Vercel** - Recommended
2. **Netlify** - Alternative
3. **Self-hosted** - VPS/Cloud

## 📱 PWA Features

- Install to home screen
- Offline capability
- Fast loading
- Native app feel

## 🔒 Security

- Supabase Auth
- RLS policies
- Admin-only routes
- Secure file storage

## 🎯 Key Features

### Student Features
- Browse content by category
- View PDFs in-app
- Download content
- Take MCQ tests
- Chat with AI
- Track history

### Admin Features
- Upload content
- Create MCQ questions
- Manage students
- Send notifications
- View statistics

## 📊 Content Categories

1. **Notes** - Study notes
2. **PYQ** - Previous year questions
3. **Important Questions** - Key questions
4. **Reference Books** - Book PDFs
5. **Mind Maps** - Visual guides
6. **Formulas** - Formula sheets
7. **MCQ Tests** - Practice tests
8. **IIT-JEE Questions** - Advanced questions

## 🎓 Classes & Subjects

**Classes**: 8, 9, 10, 11, 12

**Subjects**:
- Physics
- Chemistry
- Mathematics
- Biology
- English
- Hindi
- Social Science
- Computer Science

## 💡 Tips

1. **Development**:
   - Use `npm run dev` for hot reload
   - Check console for errors
   - Test on mobile devices

2. **Production**:
   - Always build before deploy
   - Test all features
   - Check environment variables

3. **Debugging**:
   - Check browser console
   - Verify API keys
   - Test database connection

## 📞 Contact

**Developer**: Rohit  
**Email**: masumboy141@gmail.com  
**App Name**: PM - Roit (Personal Manager - Rohit)

---

**Version**: 1.0.0  
**Last Updated**: January 12, 2026
