import { fetchWhitelist } from './googlesheets';

export const discordOAuth = () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds'
  })
  window.location.href = `https://discord.com/oauth2/authorize?${params}`
}

export const checkWhitelist = async (discordId: string) => {
  const whitelist = await fetchWhitelist();
  return whitelist.includes(discordId);
}
