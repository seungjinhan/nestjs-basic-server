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
export class CookieUtil {
  session_key = 'SESSION_KEY';
  set({ res, key, value }: CookieParams) {
    res.cookie(key, value);
  }
  get({ req, key }: CookieParams) {
    return req.cookies[key];
  }

  setSession({ res, value }: CookieParams) {
    res.cookie(this.session_key, value);
  }
  getSession({ req }: CookieParams) {
    return req.cookies[this.session_key];
  }
}
