// pages/api/user.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions, SessionData } from '../../lib/session';

type ResponseData = SessionData | { isLoggedIn: false };

async function userRoute(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.session.user && req.session.user.isLoggedIn) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
