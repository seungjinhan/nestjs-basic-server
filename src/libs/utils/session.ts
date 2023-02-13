import { Request, Response } from 'express';
interface CookieParams {
  res?: Response;
  req?: Request;
  key?: string;
  value?: string;
}

/**
 *
 */
export const CookieUtil = {
  sessionKey: 'SESSION_KEY',
  set({ res, key, value }: CookieParams) {
    res.cookie(key, value);
  },
  get: ({ req, key }: CookieParams) => {
    return req.cookies[key];
  },

  setSessionKey: ({ res, value }: CookieParams) => {
    res.cookie(CookieUtil.sessionKey, value);
  },

  getSessionKey({ req }: CookieParams) {
    return req.cookies[`${this.sessionKey}`];
  },
};
