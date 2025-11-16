// lib/session.ts
// FIX: Use a direct type import for SessionOptions. This allows TypeScript's module resolver to correctly
// find the 'iron-session' module for augmentation, fixing the "cannot be found" error.
// Switched to a regular import to ensure module context is available for module augmentation, which can fail with type-only imports in some toolchains.
// FIX: Corrected import from 'IronSessionOptions' to 'SessionOptions' as per the library's export.
import { SessionOptions } from 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  id: string;
  username: string;
  avatar: string;
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
    throw new Error('A variável de ambiente SECRET_COOKIE_PASSWORD não está configurada.');
}

// FIX: Corrected type annotation to use 'SessionOptions' instead of 'IronSessionOptions'.
export const sessionOptions: SessionOptions = {
  // FIX: Add 'as string' to satisfy SessionOptions type, as env vars are string | undefined.
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'kimetsu-forge-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Esta é a declaração para o tipo da sessão, usada nas rotas de API
declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionData;
  }
}
