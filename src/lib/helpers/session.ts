import Cookie from 'js-cookie';

import { SessionResponseBody } from "../../../netlify/functions/session";
import { VerifyResponseBody } from '../../../netlify/functions/verify';
import { COOKIE_ACCESS_KEY, COOKIE_SESSION_PREFIX, RECAPTCHA_SITE_KEY } from '../constants';

export const getAllCurrentSessionData = (): (SessionResponseBody | false)[] => {
  return [1,2,3].reduce((sessions, index) => {
    const data = getSessionTokenFromCookie(index);
    if (null !== data) {
      sessions.push(data);
    }

    return sessions;
  }, []);
}

export const getAccessTokenFromCookie = (): VerifyResponseBody | false => {
  const data = Cookie.get(COOKIE_ACCESS_KEY);
  if (!data || data.length === 0) {
    return false;
  }

  return JSON.parse(data);
}
export const setAccessTokenCookie = (data: VerifyResponseBody, exp: number) => {
  Cookie.set(
    COOKIE_ACCESS_KEY,
    JSON.stringify(data),
    {
      sameSite: 'strict',
      secure: true,
      expires: new Date(Math.floor(exp) * 1000), // convert to miliseconds
    }
  )
}

export const getSessionTokenFromCookie = (index: number): SessionResponseBody | false => {
  const data = Cookie.get(`${COOKIE_SESSION_PREFIX}_${index}`);
  if (!data || data.length === 0) {
    return false;
  }

  return JSON.parse(data);
};
export const setSessionTokenCookie = (data: SessionResponseBody, exp: Date, index: number) => {
  Cookie.set(
    `${COOKIE_SESSION_PREFIX}_${index}`,
    JSON.stringify(data),
    {
      sameSite: 'strict',
      secure: true,
      expires: new Date(exp)
    }
  )
}

export const getRecaptchaToken = async (): Promise<string> => {
  return await window.grecaptcha.execute(
    RECAPTCHA_SITE_KEY,
    { action: "submit" },
    (token: string) => {
      return token;
    }
  );
}
