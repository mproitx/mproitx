# 🚀 PM - Roit Study Hub - Complete Setup Guide

यह guide आपको step-by-step बताएगी कि कैसे इस project को GitHub से download करके अपने system पर run करें।

## 📋 Prerequisites (पहले से Install होना चाहिए)

### 1. Node.js Install करें
- [Node.js Download](https://nodejs.org/) से LTS version download करें
- Install करने के बाद verify करें:
  ```bash
  node --version  # v18 या higher होना चाहिए
  npm --version
  ```

### 2. pnpm Install करें
```bash
npm install -g pnpm
pnpm --version  # v8 या higher होना चाहिए
```

### 3. Git Install करें
- [Git Download](https://git-scm.com/downloads) से install करें
- Verify करें:
  ```bash
  git --version
  ```

## 🔧 Step-by-Step Setup

### Step 1: Repository Clone करें

```bash
# GitHub से clone करें
git clone https://github.com/your-username/pm-roit-study-hub.git

# Project folder में जाएं
cd pm-roit-study-hub
```

### Step 2: Dependencies Install करें

```bash
pnpm install
```

यह command सभी required packages install करेगा। इसमें 2-5 minutes लग सकते हैं।

### Step 3: Supabase Setup करें

#### 3.1 Supabase Account बनाएं
1. [Supabase](https://app.supabase.com) पर जाएं
2. "Start your project" click करें
3. GitHub/Google से sign up करें (Free है)

#### 3.2 New Project बनाएं
1. "New Project" button click करें
2. Project details भरें:
   - **Name**: PM Roit Study Hub
   - **Database Password**: एक strong password (save कर लें)
   - **Region**: अपने नजदीकी region select करें
3. "Create new project" click करें
4. Project create होने में 2-3 minutes लगेंगे

#### 3.3 API Keys Copy करें
1. Project dashboard में जाएं
2. Left sidebar में "Settings" click करें
3. "API" section में जाएं
4. निम्नलिखित copy करें:
   - **Project URL** (जैसे: `https://xxxxx.supabase.co`)
   - **anon public key** (लंबी string)

### Step 4: Environment Variables Setup करें

```bash
# .env.example को .env में copy करें
cp .env.example .env
```

अब `.env` file को text editor में खोलें और अपनी values भरें:

```env
VITE_APP_ID=pm-roit-study-hub
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
VITE_APP_ID=pm-roit-study-hub
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Database Setup करें

#### Option A: Supabase SQL Editor से (Recommended)

1. Supabase dashboard में "SQL Editor" पर जाएं
2. `supabase/migrations` folder में सभी `.sql` files को order में run करें:
   - File खोलें
   - Content copy करें
   - SQL Editor में paste करें
   - "Run" button click करें
   - सभी migrations के लिए repeat करें

#### Option B: Supabase CLI से

```bash
# Supabase CLI install करें
npm install -g supabase

# Project से link करें
supabase link --project-ref your-project-ref

# Migrations push करें
supabase db push
```

### Step 6: Development Server Run करें

```bash
pnpm dev
```

✅ Server start हो जाएगा! Browser में खोलें: `http://localhost:5173`

## 🎉 First Time Setup

### Admin Account Setup
Default admin credentials:
- **Email**: `masumboy141@gmail.com`
- **Password**: `12/07/2008MP`

⚠️ **Security**: Production में deploy करने से पहले admin email और password change कर लें!

### Student Account बनाएं
1. "साइन अप करें" पर click करें
2. Email और password enter करें
3. Account create हो जाएगा

## 🏗️ Production Build

```bash
# Build करें
pnpm build

# Build को locally test करें
pnpm preview
```

Build files `dist/` folder में generate होंगी।

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. [Vercel](https://vercel.com) पर account बनाएं
2. "New Project" click करें
3. GitHub repository import करें
4. Environment variables add करें:
   - `VITE_APP_ID`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. "Deploy" click करें

### Option 2: Netlify

1. [Netlify](https://netlify.com) पर account बनाएं
2. "Add new site" → "Import an existing project"
3. GitHub repository select करें
4. Build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. Environment variables add करें
6. "Deploy site" click करें

### Option 3: GitHub Pages

```bash
# gh-pages package install करें
pnpm add -D gh-pages

# package.json में add करें:
# "homepage": "https://your-username.github.io/pm-roit-study-hub",
# "scripts": {
#   "predeploy": "pnpm build",
#   "deploy": "gh-pages -d dist"
# }

# Deploy करें
pnpm deploy
```

## 🔧 Troubleshooting

### Problem: `pnpm install` fail हो रहा है
**Solution**: 
```bash
# Cache clear करें
pnpm store prune
# फिर से try करें
pnpm install
```

### Problem: Port 5173 already in use
**Solution**:
```bash
# Different port use करें
pnpm dev --port 3000
```

### Problem: Supabase connection error
**Solution**:
- `.env` file में URLs check करें
- Supabase project running है verify करें
- API keys सही हैं confirm करें

### Problem: Build errors
**Solution**:
```bash
# Dependencies reinstall करें
rm -rf node_modules
pnpm install
# फिर build करें
pnpm build
```

## 📱 PWA Testing

### Desktop पर test करें:
1. `pnpm dev` run करें
2. Chrome DevTools खोलें (F12)
3. "Application" tab → "Manifest" check करें
4. "Service Workers" check करें

### Mobile पर test करें:
1. Local network पर access करें:
   ```bash
   pnpm dev --host
   ```
2. Mobile browser में `http://your-ip:5173` खोलें
3. Install prompt test करें

## 🎨 Customization

### App Name Change करें
1. `public/manifest.json` में name update करें
2. `index.html` में title update करें
3. `package.json` में name update करें

### App Icon Change करें
1. `public/` folder में अपने icons replace करें:
   - `favicon.png`
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
2. Service worker cache update करें (`public/sw.js`)

### Theme Colors Change करें
`src/index.css` file में colors update करें:
```css
:root {
  --primary: 210 100% 50%;  /* Your color */
  --secondary: 220 90% 45%; /* Your color */
}
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## 🆘 Need Help?

- **Issues**: GitHub repository में issue create करें
- **Email**: masumboy141@gmail.com
- **Documentation**: `docs/` folder में additional guides देखें

## ✅ Checklist

Setup complete होने के बाद verify करें:

- [ ] Node.js और pnpm installed
- [ ] Repository cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] Supabase project created
- [ ] `.env` file configured
- [ ] Database migrations run
- [ ] Development server running (`pnpm dev`)
- [ ] App browser में खुल रहा है
- [ ] Login/Signup working
- [ ] Admin panel accessible

---

**Happy Coding! 🚀**

अगर कोई problem आए तो GitHub पर issue create करें या email करें।
