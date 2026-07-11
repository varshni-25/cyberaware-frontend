# 🛡️ CyberAware — Frontend

**A cybersecurity awareness platform for students — reimagined as a secured, full-stack application.**

🔗 **Live:** [cyberaware-hub.netlify.app](https://cyberaware-hub.netlify.app)
🔗 **Backend repo:** [cyberaware-backend](https://github.com/varshni-25/cyberaware-backend)

---

## What is this?

CyberAware started as a frontend-only prototype — 18 interactive lessons, quizzes, XP, badges, and a "Digital Cyber ID." It looked complete, but every quiz answer lived in the browser's JavaScript, visible to anyone via dev tools.

This repo is the React frontend, now wired to a real Flask backend (see the linked repo above) instead of holding all the logic — and the answers — itself.

## What changed

- 🔐 Real login/register UI, connected to JWT-based backend auth
- ✅ Quizzes fetched from the backend with **no answers ever sent to the browser**
- 📊 XP, badges, and streaks pulled from a real account, not local state
- 📧 A working contact form that sends real email
- 🎨 Fully redesigned login/register screen, polished dark cybersecurity UI throughout

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React + TypeScript (Vite) |
| Styling | Tailwind, custom glassmorphism design system |
| Auth | JWT tokens via the CyberAware backend API |
| Hosting | Netlify |

## Run it locally

```bash
npm install
npm run dev
```

> Requires the [backend](https://github.com/varshni-25/cyberaware-backend) running (or deployed) and `API_URL` in `src/app/lib/api.ts` pointed at it.

---

*Built as a learning project — from prototype to production, security gaps and all.*
  
  