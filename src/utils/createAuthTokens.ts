import { db } from '@api/db/prisma';
import { isDeployed } from '@api/utils/isDeployed';
import { User } from '@prisma/client';
import { CookieOptions, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const PREFIX = 'PETS_V1';

export const ACCESS_TOKEN_COOKIE = `${PREFIX}_id`;

export interface AccessTokenData {
  userId: string;
}

interface AuthTokenResult {
  accessToken: string;
}

const createAuthToken = (user: User): AuthTokenResult => {
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '30d',
    },
  );
  return {
    accessToken,
  };
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isDeployed,
  sameSite: 'lax',
  path: '/',
  domain: isDeployed ? `.${process.env.COOKIE_DOMAIN}` : undefined,
  // maxAge:
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
} as const;

export const sendAuthTokens = (res: Response, user: User): void => {
  const { accessToken } = createAuthToken(user);
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions);
};

export const checkToken = async (accessToken: string) => {
  try {
    const data = <AccessTokenData>(
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    );

    const u = await db.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    // get userId from token data
    return {
      userId: data.userId,
      user: u,
    };
  } catch {
    // token is expired or signed with a different secret
    return undefined;
  }
};
