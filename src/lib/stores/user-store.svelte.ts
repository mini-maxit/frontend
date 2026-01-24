import type { User } from '$lib/dto/user';

/**
 * In-memory user storage for client-side authentication
 * User data is stored in memory using Svelte 5 runes for reactivity
 * Data is lost on page refresh, requiring refetch from API
 */
class UserStore {
  private user = $state<User | null>(null);
  private loading = $state<boolean>(false);

  /**
   * Set the current user in memory
   */
  setUser(user: User): void {
    this.user = user;
  }

  /**
   * Get the current user from memory
   */
  tryGetUser(): User | null {
    return this.user;
  }

  /**
   * Get the current user from memory (unsafe - assumes user exists)
   * Use only in contexts where you're certain the user is logged in
   */
  getUserUnsafe(): User {
    return this.user!;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.user !== null;
  }

  /**
   * Clear the user (e.g., on logout)
   */
  clearUser(): void {
    this.user = null;
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  /**
   * Get loading state
   */
  isLoading(): boolean {
    return this.loading;
  }
}

/**
 * Singleton instance of UserStore
 */
export const userStore = new UserStore();
