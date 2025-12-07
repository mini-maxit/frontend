import { browser } from '$app/environment';
import { ClientApiService } from '../services/client/ClientApiService';
import { ClientAuthService } from '../services/client/ClientAuthService';
import { ClientUserService } from '../services/client/ClientUserService';

/**
 * Global singleton instance of ClientApiService
 * Reused across all client-side services and components
 */
let clientApiInstance: ClientApiService | null = $state(null);

/**
 * Global singleton instance of ClientAuthService
 * Reused across all client-side components
 */
let clientAuthInstance: ClientAuthService | null = $state(null);

/**
 * Global singleton instance of ClientUserService
 * Reused across all client-side components
 */
let clientUserInstance: ClientUserService | null = $state(null);

/**
 * Get or create the global ClientApiService instance
 * This ensures a single instance is shared across the application
 */
export function getClientApiInstance(): ClientApiService | null {
  if (!browser) {
    return null;
  }

  if (!clientApiInstance) {
    const apiUrl = import.meta.env.PUBLIC_BACKEND_API_URL;
    if (!apiUrl) {
      console.error('PUBLIC_BACKEND_API_URL is not defined');
      return null;
    }
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

/**
 * Get or create the global ClientUserService instance
 * This ensures a single instance is shared across the application
 */
export function getClientUserInstance(): ClientUserService | null {
  if (!browser) {
    return null;
  }

  if (!clientUserInstance) {
    const apiClient = getClientApiInstance();
    if (!apiClient) {
      return null;
    }
    clientUserInstance = new ClientUserService(apiClient);
  }

  return clientUserInstance;
}
