// pages/api/auth/discord/url.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  url?: string;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } = process.env;

  if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
    console.error('Variáveis de ambiente do Discord não configuradas.');
    return res.status(500).json({ message: 'Erro de configuração do servidor.' });
  }

  const scope = ['identify', 'email'].join(' ');
  
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope,
  });

  const authorizationUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

  res.status(200).json({ url: authorizationUrl });
}
