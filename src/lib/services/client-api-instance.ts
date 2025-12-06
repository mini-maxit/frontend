import { browser } from '$app/environment';
import { ClientApiService } from './ClientApiService';
import { ClientAuthService } from './ClientAuthService';

/**
 * Global singleton instance of ClientApiService
 * Reused across all client-side services and components
 */
let clientApiInstance: ClientApiService | null = null;

/**
 * Global singleton instance of ClientAuthService
 * Reused across all client-side components
 */
let clientAuthInstance: ClientAuthService | null = null;

/**
 * Get or create the global ClientApiService instance
 * This ensures a single instance is shared across the application
 */
export function getClientApiInstance(): ClientApiService | null {
  if (!browser) {
    return null;
  }

  if (!clientApiInstance) {
    const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL || 'http://localhost:8000/api/v1';
    clientApiInstance = new ClientApiService(apiUrl);
  }

  return clientApiInstance;
}

/**
 * Get or create the global ClientAuthService instance
 * This ensures a single instance is shared across the application
 */
export function getClientAuthInstance(): ClientAuthService | null {
  if (!browser) {
    return null;
  }

  if (!clientAuthInstance) {
    const apiClient = getClientApiInstance();
    if (!apiClient) {
      return null;
    }
    clientAuthInstance = new ClientAuthService(apiClient);
  }

  return clientAuthInstance;
}
