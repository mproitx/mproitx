# PM - Roit - Deployment Guide

## 📦 कैसे Copy/Deploy करें

### Option 1: Direct Copy (Recommended)

आपका पूरा application यहाँ है:
```
/workspace/app-8vqzns7lohkx/
```

इसे copy करने के लिए:

1. **सभी files download करें**:
   - पूरा `/workspace/app-8vqzns7lohkx/` folder copy करें
   - या zip file बनाएं और download करें

2. **Important Files और Folders**:
   ```
   ✅ src/              (सभी source code)
   ✅ public/           (icons, manifest)
   ✅ supabase/         (database migrations)
   ✅ package.json      (dependencies)
   ✅ vite.config.ts    (build configuration)
   ✅ tailwind.config.js (styling)
   ✅ tsconfig.json     (TypeScript config)
   ✅ index.html        (entry HTML)
   ✅ .env              (environment variables)
   ```

### Option 2: Git Repository

अगर आप Git use करते हैं:

```bash
cd /workspace/app-8vqzns7lohkx
git init
git add .
git commit -m "Initial commit - PM Roit Educational App"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Option 3: Deploy to Vercel

1. **Vercel Account बनाएं**: https://vercel.com

2. **Project Import करें**:
   - "New Project" click करें
   - GitHub repository select करें (या folder upload करें)
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables Add करें**:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_APP_ID=app-8vqzns7lohkx
   ```

4. **Deploy करें**: "Deploy" button click करें

### Option 4: Deploy to Netlify

1. **Netlify Account बनाएं**: https://netlify.com

2. **Drag & Drop Deployment**:
   - Build करें: `npm run build`
   - `dist` folder को Netlify पर drag करें

3. **या Git से Deploy**:
   - "New site from Git" select करें
   - Repository connect करें
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

4. **Environment Variables**:
   - Site settings → Environment variables
   - सभी VITE_ variables add करें

## 🔧 Local Setup (अपने Computer पर Run करें)

### Step 1: Prerequisites Install करें

1. **Node.js Install करें**:
   - Download: https://nodejs.org/
   - Version: 18 या higher
   - Check: `node --version`

2. **Code Editor Install करें**:
   - VS Code (Recommended): https://code.visualstudio.com/

### Step 2: Project Setup

1. **Folder Open करें**:
   ```bash
   cd /workspace/app-8vqzns7lohkx
   ```

2. **Dependencies Install करें**:
   ```bash
   npm install
   ```

3. **Environment Variables Setup**:
   - `.env` file बनाएं root folder में
   - ये variables add करें:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_APP_ID=app-8vqzns7lohkx
   ```

### Step 3: Supabase Setup

1. **Supabase Account बनाएं**: https://supabase.com

2. **New Project बनाएं**:
   - Project name: PM-Roit
   - Database password: save करें
   - Region: closest to you

3. **Database Migrations Run करें**:
   - Supabase Dashboard → SQL Editor
   - `supabase/migrations/` folder में सभी SQL files को copy-paste करें
   - एक-एक करके run करें

4. **API Keys Copy करें**:
   - Settings → API
   - Project URL और anon key copy करें
   - `.env` file में paste करें

5. **Storage Buckets बनाएं**:
   - Storage → New bucket
   - Bucket 1: `app-8vqzns7lohkx_profile_images` (public)
   - Bucket 2: `app-8vqzns7lohkx_content_files` (public)

### Step 4: Gemini API Setup

1. **Google AI Studio Open करें**: https://aistudio.google.com/

2. **API Key Generate करें**:
   - "Get API Key" click करें
   - Key copy करें
   - `.env` में `VITE_GEMINI_API_KEY` में paste करें

### Step 5: Run Application

1. **Development Mode**:
   ```bash
   npm run dev
   ```
   - Browser में open करें: http://localhost:5173

2. **Production Build**:
   ```bash
   npm run build
   ```
   - Build files `dist/` folder में बनेंगी

3. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 📱 Mobile पर Test करें

### Local Network पर Access:

1. **Development server start करें**:
   ```bash
   npm run dev -- --host
   ```

2. **अपना Local IP पता करें**:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

3. **Mobile browser में open करें**:
   ```
   http://YOUR_LOCAL_IP:5173
   ```

4. **Add to Home Screen**:
   - Browser menu → "Add to Home Screen"
   - App install हो जाएगा

## 🗂️ Files को Copy करने का तरीका

### सभी Important Files:

```bash
# Create a zip file
cd /workspace
zip -r pm-roit-app.zip app-8vqzns7lohkx/ \
  -x "*/node_modules/*" \
  -x "*/.git/*" \
  -x "*/dist/*"
```

### या Manually Copy:

1. **Source Code** (`src/` folder):
   - सभी `.tsx`, `.ts`, `.css` files
   - Components, pages, contexts, db, lib, types

2. **Configuration Files**:
   - `package.json`
   - `vite.config.ts`
   - `tailwind.config.js`
   - `tsconfig.json`
   - `index.html`

3. **Public Assets**:
   - `public/favicon.png`
   - `public/manifest.json`

4. **Database**:
   - `supabase/migrations/` folder

5. **Environment**:
   - `.env` file (अपनी keys के साथ)

## 🚀 Production Deployment Checklist

- [ ] सभी environment variables set हैं
- [ ] Supabase database migrations run हो गए
- [ ] Storage buckets बन गए हैं
- [ ] Gemini API key valid है
- [ ] Admin account (masumboy141@gmail.com) test किया
- [ ] Mobile पर test किया
- [ ] PDF viewer काम कर रहा है
- [ ] AI Helper respond कर रहा है
- [ ] File upload काम कर रहा है
- [ ] Authentication काम कर रहा है

## 🔐 Security Notes

1. **Environment Variables**:
   - कभी भी `.env` file को public repository में न डालें
   - Production में proper secrets management use करें

2. **Admin Credentials**:
   - Default admin password change करें
   - Strong password use करें

3. **API Keys**:
   - Gemini API key को secure रखें
   - Rate limiting enable करें

4. **Database**:
   - RLS policies enable हैं
   - Backup regularly लें

## 📞 Support

अगर कोई problem हो तो:
- Email: masumboy141@gmail.com
- सभी error messages screenshot के साथ भेजें
- Browser console errors check करें

---

**Happy Coding! 🎉**
