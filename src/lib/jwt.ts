import { decodeJwt } from 'jose';
import type { JWTClaims } from './dto/jwt';

/**
 * Decode JWT token and extract user information
 * Note: This only decodes the token, it does NOT verify the signature
 * The backend should be the source of truth for token validation
 */
export function decodeAccessToken(token: string): App.Locals['user'] | null {
  try {
    const claims = decodeJwt(token) as unknown as JWTClaims;

    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      console.warn('Token is expired');
      return null;
    }

    if (claims.type !== 'access') {
      console.warn('Token is not an access token');
      return null;
    }

    return {
      userId: claims.user_id,
      role: claims.role
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}
