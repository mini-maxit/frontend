import { browser } from '$app/environment';
import { ClientApiService } from './ClientApiService';

/**
 * Global singleton instance of ClientApiService
 * Reused across all client-side services and components
 */
let clientApiInstance: ClientApiService | null = null;

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
