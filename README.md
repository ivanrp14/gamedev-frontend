# gamedev-frontend

Frontend for the **GameDev** association: sign-in, profile, avatar, match stats, and a tutorial. The UI is in Catalan, Spanish, and English.

The previous README only described the Vite skeleton. The app already has pages, a session, and charts.

## Pages

| Code path | What it is |
| --- | --- |
| `pages/Home` | Home |
| `pages/Login` and `pages/Signup` | Sign-in and sign-up |
| `pages/UserProfile` | Profile |
| `pages/ChooseAvatar` | Avatar picker |
| `pages/MyStats` | Stats (`ScoreChart`, podium) |
| `pages/Tutorial` | Tutorial |
| `pages/About` | About |

The session goes through `AuthProvider`, `ProtectedRoute`, and OAuth / GitHub callbacks (`OAuthCallback`, `GithubCallback`). Copy is in `public/locales/{ca,en,es}`.

## Stack

- React and TypeScript
- Vite and SWC
- MUI
- Redux Toolkit
- TanStack Query and Axios
- i18next
- Framer Motion and GSAP

## Commands

```bash
npm install
npm start          # vite --open
npm run lint
npm run format
npm run build
npm run preview
```

`tsconfig` resolves types from `src`. User and video-game models are in `src/interfaces`.
