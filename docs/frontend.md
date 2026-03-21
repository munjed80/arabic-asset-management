# Frontend Guide

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- RTL layout — `<html lang="ar" dir="rtl">`

## Directory Structure

```
frontend/src/
├── app/
│   ├── (auth)/login/page.tsx      # Public login page
│   ├── dashboard/page.tsx
│   ├── assets/
│   │   ├── page.tsx               # Assets list
│   │   └── [id]/page.tsx          # Asset detail
│   ├── movements/page.tsx
│   ├── maintenance/page.tsx
│   ├── audits/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx                 # Root layout (RTL, Arabic)
│   └── globals.css                # Tailwind base styles
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   └── ui/                        # Reusable UI primitives (to be added)
├── lib/
│   └── api.ts                     # Fetch wrapper
├── hooks/                         # Custom React hooks (to be added)
└── types/
    └── index.ts                   # Shared TypeScript types
```

## Development

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

## Conventions

- All UI text must be in **Arabic**.
- All file names, component names, variables, and imports must be in **English**.
- Use Tailwind utility classes; avoid inline styles.
- Use `dir="rtl"` (set at root `<html>`) — do not override per-component unless necessary.

## Adding a New Page

1. Create `src/app/<route>/page.tsx`
2. Add the route to the `navLinks` array in `src/components/layout/Sidebar.tsx`
3. Use Arabic labels for all visible text
