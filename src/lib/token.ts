import { CookieManager } from './cookies';

export const ACCESS_TOKEN_KEY = 'access_token';

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = ACCESS_TOKEN_KEY;

  static setAccessToken(token: string, expiresIn: number): void {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);

    CookieManager.set(this.ACCESS_TOKEN_KEY, token, {
      expires: expiryDate,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });
  }

  static getAccessToken(): string | null {
    return CookieManager.get(this.ACCESS_TOKEN_KEY);
  }

  static hasValidToken(): boolean {
    return this.getAccessToken() !== null;
  }

  static clearTokens(): void {
    CookieManager.remove(this.ACCESS_TOKEN_KEY);
  }
}
