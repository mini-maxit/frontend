/**
 * In-memory token storage for client-side authentication
 * Tokens are stored in memory (not localStorage) for better security against XSS
 * Tokens are lost on page refresh, requiring silent refresh mechanism
 */
class TokenStore {
  private accessToken = $state<string | null>(null);

  /**
   * Set the access token in memory
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Get the current access token from memory
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if a valid token exists
   */
  hasToken(): boolean {
    const has = this.accessToken !== null;
    return has;
  }

  /**
   * Clear the access token (e.g., on logout)
   */
  clearAccessToken(): void {
    this.accessToken = null;
  }
}

/**
 * Singleton instance of TokenStore
 */
export const tokenStore = new TokenStore();
