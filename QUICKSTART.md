# 🚀 Quick Start Guide - PM Roit Study Hub

## For Developers (GitHub से Download करने के बाद)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/pm-roit-study-hub.git
cd pm-roit-study-hub
pnpm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env and add your Supabase credentials
```

### 3. Run
```bash
pnpm dev
```

## Important Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `SETUP_GUIDE.md` | Detailed Hindi setup guide |
| `DEPLOYMENT.md` | Deployment instructions |
| `.env.example` | Environment variables template |
| `CONTRIBUTING.md` | How to contribute |

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run linter

# Deployment
pnpm build            # Build first
# Then deploy dist/ folder to your hosting
```

## Environment Variables Required

```env
VITE_APP_ID=your-app-id
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

## Default Admin Credentials

- Email: `masumboy141@gmail.com`
- Password: `12/07/2008MP`

⚠️ Change these in production!

## Tech Stack

- React 18.3.1 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Backend)
- Vite (Build tool)
- PWA Support

## Support

- 📧 Email: masumboy141@gmail.com
- 📝 Issues: GitHub Issues
- 📚 Docs: See `docs/` folder

---

**For detailed instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**
