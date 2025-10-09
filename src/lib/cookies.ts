export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export class CookieManager {
  private static defaultOptions: CookieOptions = {
    path: '/',
    secure: import.meta.env.PROD,
    sameSite: 'Strict'
  };

  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return; // SSR guard

    const mergedOptions = { ...this.defaultOptions, ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (mergedOptions.expires) {
      cookieString += `; expires=${mergedOptions.expires.toUTCString()}`;
    }

    if (mergedOptions.maxAge) {
      cookieString += `; max-age=${mergedOptions.maxAge}`;
    }

    if (mergedOptions.path) {
      cookieString += `; path=${mergedOptions.path}`;
    }

    if (mergedOptions.domain) {
      cookieString += `; domain=${mergedOptions.domain}`;
    }

    if (mergedOptions.secure) {
      cookieString += '; secure';
    }

    if (mergedOptions.httpOnly) {
      cookieString += '; httponly';
    }

    if (mergedOptions.sameSite) {
      cookieString += `; samesite=${mergedOptions.sameSite}`;
    }

    document.cookie = cookieString;
  }

  static get(name: string): string | null {
    if (typeof document === 'undefined') return null; // SSR guard

    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  static remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
      maxAge: -1
    });
  }
}
