// lib/session.ts
import type { IronSessionOptions } from 'iron-session';
// FIX: Add a side-effect import of 'iron-session' to make its types available for module augmentation.
import 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  id: string;
  username: string;
  avatar: string;
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
    throw new Error('A variável de ambiente SECRET_COOKIE_PASSWORD não está configurada.');
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
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
