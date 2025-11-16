// pages/api/logout.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../lib/session';

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).json({ message: 'Logout bem-sucedido.' });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
