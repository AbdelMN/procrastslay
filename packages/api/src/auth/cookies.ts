import { Hono } from 'hono';
import { Context } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';

export function setSessionTokenCookie(
  c: Context,
  token: string,
  expiresAt: Date,
): void {
  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    expires: expiresAt,Ò
    secure: true,
  });
}

export function deleteSessionTokenCookie(c: Context): void {
  deleteCookie(c, 'session', {
    path: '/',
    secure: true,
    maxAge: 0,
    sameSite: 'Lax',
    httpOnly: true,
  });
}
