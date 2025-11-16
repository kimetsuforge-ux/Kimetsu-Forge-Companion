// pages/api/auth/discord/callback.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../../lib/session';
import { exchangeCodeForToken, getUserProfile, constructAvatarUrl } from '../../../../lib/discord';
import { isUserWhitelisted } from '../../../../lib/googleSheets';

async function discordCallbackRoute(req: NextApiRequest, res: NextApiResponse) {
  const { code, error } = req.query;

  if (error === 'access_denied' || !code || typeof code !== 'string') {
    return res.redirect('/?error=discord_login_failed');
  }

  try {
    const tokenResponse = await exchangeCodeForToken(code);
    const userProfile = await getUserProfile(tokenResponse.access_token);

    const isAuthorized = await isUserWhitelisted(userProfile.id);
    if (!isAuthorized) {
        console.warn(`Acesso negado para usuário não-whitelisted: ${userProfile.username} (${userProfile.id})`);
        return res.redirect('/?error=not_whitelisted');
    }

    req.session.user = {
      isLoggedIn: true,
      id: userProfile.id,
      username: userProfile.global_name || userProfile.username,
      avatar: constructAvatarUrl(userProfile.id, userProfile.avatar),
    };
    await req.session.save();

    res.redirect('/');

  } catch (err: any) {
    console.error('Erro no callback do Discord:', err);
    res.redirect(`/?error=${encodeURIComponent(err.message)}`);
  }
}

export default withIronSessionApiRoute(discordCallbackRoute, sessionOptions);
