import type { ApiErrorResponse } from '$lib/backendSchemas';
import * as m from '$lib/paraglide/messages.js';

export const SESSION_COOKIE_NAME = 'auth-session';
export const PARSE_ERROR = 'PARSE_ERROR';

export async function parse_error_response(response: Response): Promise<ApiErrorResponse> {
	try {
		const contentType = response.headers.get('Content-Type');

		if (contentType && contentType.includes('application/json')) {
			return await response.json();
		}

		const responseText = await response.text();

		console.groupCollapsed(`API Error Response [${response.status}]`);
		console.log('Status:', response.status, response.statusText);
		console.log('Content-Type:', contentType);
		console.log('Response URL:', response.url);
		console.log('Response Headers:', Object.fromEntries([...response.headers]));
		console.log('Response Body:', responseText);
		console.groupEnd();

		return {
			ok: false,
			data: {
				code: PARSE_ERROR,
				message: m.error_unexpected_error_message()
			}
		};
	} catch (e) {
		console.error('Failed to parse error response:', e);
		console.error('Original response:', response);

		return {
			ok: false,
			data: {
				code: PARSE_ERROR,
				message: m.error_unexpected_error_message()
			}
		};
	}
}
