import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// FIX: Add `URL` and `fileURLToPath` imports to handle path resolution in an ES module context.
import { URL, fileURLToPath } from 'url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
      },
      plugins: [
        react({
          jsxRuntime: 'automatic',
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
        'process.env.SUPABASE_SERVICE_KEY': JSON.stringify(env.SUPABASE_SERVICE_KEY),
        'process.env.TURSO_DATABASE_URL': JSON.stringify(env.TURSO_DATABASE_URL),
        'process.env.TURSO_AUTH_TOKEN': JSON.stringify(env.TURSO_AUTH_TOKEN),
        'process.env.CLOUDINARY_CLOUD_NAME': JSON.stringify(env.CLOUDINARY_CLOUD_NAME),
        'process.env.CLOUDINARY_API_KEY': JSON.stringify(env.CLOUDINARY_API_KEY),
        'process.env.CLOUDINARY_API_SECRET': JSON.stringify(env.CLOUDINARY_API_SECRET),
        'process.env.IMAGEKIT_PUBLIC_KEY': JSON.stringify(env.IMAGEKIT_PUBLIC_KEY),
        'process.env.IMAGEKIT_PRIVATE_KEY': JSON.stringify(env.IMAGEKIT_PRIVATE_KEY),
        'process.env.IMAGEKIT_URL_ENDPOINT': JSON.stringify(env.IMAGEKIT_URL_ENDPOINT),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_CLIENT_EMAIL': JSON.stringify(env.FIREBASE_CLIENT_EMAIL),
        'process.env.FIREBASE_PRIVATE_KEY': JSON.stringify(env.FIREBASE_PRIVATE_KEY),
        'process.env.DISCORD_CLIENT_ID': JSON.stringify(env.DISCORD_CLIENT_ID),
        'process.env.DISCORD_CLIENT_SECRET': JSON.stringify(env.DISCORD_CLIENT_SECRET),
        'process.env.DISCORD_REDIRECT_URI': JSON.stringify(env.DISCORD_REDIRECT_URI),
        'process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL': JSON.stringify(env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
        'process.env.GOOGLE_PRIVATE_KEY': JSON.stringify(env.GOOGLE_PRIVATE_KEY),
        'process.env.GOOGLE_SPREADSHEET_ID': JSON.stringify(env.GOOGLE_SPREADSHEET_ID),
        'process.env.GOOGLE_WHITELIST_SHEET_NAME': JSON.stringify(env.GOOGLE_WHITELIST_SHEET_NAME),
        'process.env.SECRET_COOKIE_PASSWORD': JSON.stringify(env.SECRET_COOKIE_PASSWORD)
      },
      resolve: {
        alias: {
          // FIX: Replaced `__dirname` with `import.meta.url` for compatibility with ES modules.
          '@': fileURLToPath(new URL('.', import.meta.url)),
        },
        dedupe: ['react', 'react-dom']
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime'],
        exclude: []
      },
      build: {
        commonjsOptions: {
          include: [/node_modules/],
          transformMixedEsModules: true
        }
      }
    };
});