# gamedev-frontend

Frontend de la asociación **GameDev**: acceso, perfil, avatar, estadísticas de partidas y un tutorial. La interfaz está en catalán, castellano e inglés.

El README anterior describía solo el esqueleto de Vite. La aplicación ya tiene páginas, sesión y gráficas.

## Páginas

| Ruta de código | Qué es |
| --- | --- |
| `pages/Home` | Inicio |
| `pages/Login` y `pages/Signup` | Acceso y alta |
| `pages/UserProfile` | Perfil |
| `pages/ChooseAvatar` | Elección de avatar |
| `pages/MyStats` | Estadísticas (`ScoreChart`, podio) |
| `pages/Tutorial` | Tutorial |
| `pages/About` | Acerca de |

La sesión pasa por `AuthProvider`, `ProtectedRoute` y callbacks OAuth / GitHub (`OAuthCallback`, `GithubCallback`). Los textos están en `public/locales/{ca,en,es}`.

## Stack

- React y TypeScript
- Vite y SWC
- MUI
- Redux Toolkit
- TanStack Query y Axios
- i18next
- Framer Motion y GSAP

## Comandos

```bash
npm install
npm start          # vite --open
npm run lint
npm run format
npm run build
npm run preview
```

`tsconfig` resuelve tipos desde `src`. Los modelos de usuario y videojuego están en `src/interfaces`.
