# React + Vite

## Google sign-in setup

Create a Google OAuth client with application type **Web application** in Google Cloud Console. Add `http://localhost:5173` to its authorized JavaScript origins, then put the same client ID in both environment files:

```env
# frontend/.env
VITE_GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com

# backend/.env
GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com
```

Replace the placeholder with the actual client ID. Restart both the Vite frontend and the backend after changing environment variables.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
