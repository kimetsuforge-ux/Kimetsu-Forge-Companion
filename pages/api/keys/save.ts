// pages/api/keys/save.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiResponse } from 'next';
import { sessionOptions } from '../../../lib/session';
import { supabase, supabaseInitializationError } from '../../../lib/supabase';

// FIX: The handler is now an inline async function passed directly to `withIronSessionApiRoute`.
// This allows TypeScript to correctly infer the type of `req` and include the `session` property.
export default withIronSessionApiRoute(async function saveKeysRoute(req, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = req.session.user;
    if (!user || !user.isLoggedIn) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }

    if (supabaseInitializationError || !supabase) {
        console.error('Erro de conexão com o Supabase:', supabaseInitializationError);
        return res.status(500).json({ message: 'Erro de configuração do banco de dados.' });
    }

    try {
        const { geminiApiKey, openaiApiKey, deepseekApiKey } = req.body;

        const { data, error } = await supabase
            .from('user_api_keys')
            .upsert({
                user_id: user.id,
                gemini_api_key: geminiApiKey,
                openai_api_key: openaiApiKey,
                deepseek_api_key: deepseekApiKey,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao salvar chaves no Supabase:', error);
            throw new Error('Falha ao salvar as chaves no banco de dados.');
        }

        res.status(200).json({ message: 'Chaves salvas com sucesso.', data });

    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Ocorreu um erro interno.' });
    }
}, sessionOptions);
