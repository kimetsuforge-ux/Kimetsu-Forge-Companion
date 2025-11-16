import { createClient } from '@libsql/client';

const tursoUrl = import.meta.env.VITE_TURSO_URL;
const tursoToken = import.meta.env.VITE_TURSO_TOKEN;

if (!tursoUrl || !tursoToken) {
    throw new Error("Variáveis de ambiente do Turso (VITE_TURSO_URL, VITE_TURSO_TOKEN) não estão definidas.");
}

export const turso = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});
