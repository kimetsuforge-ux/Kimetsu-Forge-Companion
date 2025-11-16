import { google } from 'googleapis';

const getAuth = () => {
    // AVISO DE SEGURANÇA: Expor chaves de conta de serviço no lado do cliente
    // é extremamente inseguro e não é recomendado para produção.
    // Esta implementação segue estritamente a especificação do prompt do usuário.
    const privateKey = (import.meta.env.VITE_GOOGLE_KEY || '').replace(/\\n/g, '\n');
    if (!import.meta.env.VITE_GOOGLE_EMAIL || !privateKey) {
        console.error("Credenciais da conta de serviço Google (VITE_GOOGLE_EMAIL, VITE_GOOGLE_KEY) estão ausentes no .env.");
        return null;
    }
    
    // O uso de `GoogleAuth` no cliente é incomum. A biblioteca `gapi-script` ou chamadas de API via backend são mais comuns.
    // Esta abordagem pode ter limitações ou problemas de compatibilidade no navegador.
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: import.meta.env.VITE_GOOGLE_EMAIL,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });
}

export const fetchWhitelist = async (): Promise<string[]> => {
    const auth = getAuth();
    if (!auth) {
        throw new Error("Autenticação com Google Sheets falhou. Verifique as credenciais.");
    }
    
    try {
        const sheets = google.sheets({ version: 'v4', auth });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: import.meta.env.VITE_SHEET_ID,
            range: 'Whitelist!A2:A'
        });
        return res.data.values?.flat() || [];
    } catch (error) {
        console.error("Erro ao buscar dados da planilha Google Sheets:", error);
        return [];
    }
}
