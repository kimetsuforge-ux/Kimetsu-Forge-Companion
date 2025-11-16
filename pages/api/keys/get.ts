// pages/api/keys/get.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiResponse } from 'next';
import { sessionOptions } from '../../../lib/session';
import { supabase, supabaseInitializationError } from '../../../lib/supabase';

// FIX: The handler is now an inline async function passed directly to `withIronSessionApiRoute`.
// This allows TypeScript to correctly infer the type of `req` and include the `session` property.
export default withIronSessionApiRoute(async function getKeysRoute(req, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
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
        const { data, error } = await supabase
            .from('user_api_keys')
            .select('gemini_api_key, openai_api_key, deepseek_api_key')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore 'PGRST116' (no rows found)
            console.error('Erro ao buscar chaves no Supabase:', error);
            throw new Error('Falha ao buscar as chaves no banco de dados.');
        }

        res.status(200).json({
            geminiApiKey: data?.gemini_api_key || '',
            openaiApiKey: data?.openai_api_key || '',
            deepseekApiKey: data?.deepseek_api_key || '',
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Ocorreu um erro interno.' });
    }
}, sessionOptions);
