import type { AuthTokenData } from './dto/auth';
import type { Cookies } from '@sveltejs/kit';

export const ACCESS_TOKEN_KEY = 'access_token';

/**
 * Get cookie options for storing the access token
 * @param expiresAt - ISO string of token expiration date
 */
export function getTokenCookieOptions(expiresAt: string) {
  return {
    httpOnly: true, // Secure - JavaScript cannot access
    secure: import.meta.env.PROD,
    sameSite: 'strict' as const,
    path: '/',
    expires: new Date(expiresAt)
  };
}

/**
 * Server-side token manager
 * Works with SvelteKit's Cookies API for secure HTTP-only cookie storage
 */
export class TokenManager {
  /**
   * Set access token in HTTP-only cookie (server-side)
   */
  static setAccessToken(cookies: Cookies, data: AuthTokenData): void {
    cookies.set(ACCESS_TOKEN_KEY, data.accessToken, getTokenCookieOptions(data.expiresAt));
  }

  /**
   * Get access token from cookie (server-side)
   */
  static getAccessToken(cookies: Cookies): string | null {
    return cookies.get(ACCESS_TOKEN_KEY) || null;
  }

  /**
   * Check if valid token exists (server-side)
   */
  static hasValidToken(cookies: Cookies): boolean {
    return this.getAccessToken(cookies) !== null;
  }

  /**
   * Clear access token (server-side)
   */
  static clearTokens(cookies: Cookies): void {
    cookies.delete(ACCESS_TOKEN_KEY, { path: '/' });
  }
}
