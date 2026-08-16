import * as m from '$lib/paraglide/messages';
import { toast } from 'svelte-sonner';

/**
 * Maps backend error codes (see backend/package/errors/errors.go) to localized messages.
 * Codes are designed by the backend for frontend internationalization.
 */
const BACKEND_ERROR_MESSAGES: Record<string, () => string> = {
  ERR_ACCESS_ALREADY_EXISTS: () => m.backend_error_access_already_exists(),
  ERR_ALREADY_PARTICIPANT: () => m.backend_error_already_participant(),
  ERR_ALREADY_REGISTERED: () => m.backend_error_already_registered(),
  ERR_CANNOT_ASSIGN_OWNER: () => m.backend_error_cannot_assign_owner(),
  ERR_CONTEST_ENDED: () => m.backend_error_contest_ended(),
  ERR_CONTEST_NOT_STARTED: () => m.backend_error_contest_not_started(),
  ERR_CONTEST_REGISTRATION_CLOSED: () => m.backend_error_contest_registration_closed(),
  ERR_CONTEST_SUBMISSION_CLOSED: () => m.backend_error_contest_submission_closed(),
  ERR_COPY_FILE: () => m.backend_error_copy_file(),
  ERR_CORS_NOT_ALLOWED: () => m.backend_error_cors_not_allowed(),
  ERR_CREATE_FORM_FILE: () => m.backend_error_create_form_file(),
  ERR_DATABASE_CONNECTION: () => m.backend_error_database_connection(),
  ERR_DECOMPRESS_ARCHIVE: () => m.backend_error_decompress_archive(),
  ERR_END_BEFORE_START: () => m.backend_error_end_before_start(),
  ERR_EXPECTED_STRUCT: () => m.backend_error_expected_struct(),
  ERR_FILE_OPEN: () => m.backend_error_file_open(),
  ERR_FORBIDDEN: () => m.backend_error_forbidden(),
  ERR_GROUP_ALREADY_ASSIGNED_TO_CONTEST: () => m.backend_error_group_already_assigned_to_contest(),
  ERR_GROUP_NOT_ASSIGNED_TO_CONTEST: () => m.backend_error_group_not_assigned_to_contest(),
  ERR_GROUP_NOT_FOUND: () => m.backend_error_group_not_found(),
  ERR_INPUT_CONTAINS_DIR: () => m.backend_error_input_contains_dir(),
  ERR_INTERNAL_ERROR: () => m.backend_error_internal_error(),
  ERR_INVALID_ARCHIVE: () => m.backend_error_invalid_archive(),
  ERR_INVALID_CREDENTIALS: () => m.backend_error_invalid_credentials(),
  ERR_INVALID_DATA: () => m.backend_error_invalid_data(),
  ERR_INVALID_IN_EXTENSION: () => m.backend_error_invalid_in_extension(),
  ERR_INVALID_INPUT_OUTPUT: () => m.backend_error_invalid_input_output(),
  ERR_INVALID_LANGUAGE: () => m.backend_error_invalid_language(),
  ERR_INVALID_LIMIT_PARAM: () => m.backend_error_invalid_limit_param(),
  ERR_INVALID_OFFSET_PARAM: () => m.backend_error_invalid_offset_param(),
  ERR_INVALID_OUT_EXTENSION: () => m.backend_error_invalid_out_extension(),
  ERR_INVALID_TOKEN: () => m.backend_error_invalid_token(),
  ERR_INVALID_TOKEN_TYPE: () => m.backend_error_invalid_token_type(),
  ERR_IO_COUNT_MISMATCH: () => m.backend_error_io_count_mismatch(),
  ERR_NO_INPUT_DIRECTORY: () => m.backend_error_no_input_directory(),
  ERR_NO_OUTPUT_DIRECTORY: () => m.backend_error_no_output_directory(),
  ERR_NO_PENDING_REGISTRATION: () => m.backend_error_no_pending_registration(),
  ERR_NOT_ALLOWED: () => m.backend_error_not_allowed(),
  ERR_NOT_AUTHORIZED: () => m.backend_error_not_authorized(),
  ERR_NOT_CONTEST_PARTICIPANT: () => m.backend_error_not_contest_participant(),
  ERR_NOT_FOUND: () => m.backend_error_not_found(),
  ERR_OUTPUT_CONTAINS_DIR: () => m.backend_error_output_contains_dir(),
  ERR_PERMISSION_DENIED: () => m.backend_error_permission_denied(),
  ERR_QUEUE_NOT_CONNECTED: () => m.backend_error_queue_not_connected(),
  ERR_READ_RESPONSE: () => m.backend_error_read_response(),
  ERR_RESPONSE_FROM_FILE_STORAGE: () => m.backend_error_response_from_file_storage(),
  ERR_SEND_REQUEST: () => m.backend_error_send_request(),
  ERR_SESSION_EXPIRED: () => m.backend_error_session_expired(),
  ERR_SESSION_NOT_FOUND: () => m.backend_error_session_not_found(),
  ERR_SESSION_REFRESH: () => m.backend_error_session_refresh(),
  ERR_SESSION_USER_NOT_FOUND: () => m.backend_error_session_user_not_found(),
  ERR_TASK_ALREADY_ASSIGNED: () => m.backend_error_task_already_assigned(),
  ERR_TASK_EXISTS: () => m.backend_error_task_exists(),
  ERR_TASK_NOT_ASSIGNED_GROUP: () => m.backend_error_task_not_assigned_group(),
  ERR_TASK_NOT_ASSIGNED_USER: () => m.backend_error_task_not_assigned_user(),
  ERR_TASK_NOT_FOUND: () => m.backend_error_task_not_found(),
  ERR_TASK_NOT_IN_CONTEST: () => m.backend_error_task_not_in_contest(),
  ERR_TASK_NOT_STARTED: () => m.backend_error_task_not_started(),
  ERR_TASK_SUBMISSION_CLOSED: () => m.backend_error_task_submission_closed(),
  ERR_TASK_SUBMISSION_ENDED: () => m.backend_error_task_submission_ended(),
  ERR_TEMP_DIR_CREATE: () => m.backend_error_temp_dir_create(),
  ERR_TIMEOUT: () => m.backend_error_timeout(),
  ERR_TOKEN_EXPIRED: () => m.backend_error_token_expired(),
  ERR_TOKEN_USER_NOT_FOUND: () => m.backend_error_token_user_not_found(),
  ERR_USER_ALREADY_EXISTS: () => m.backend_error_user_already_exists(),
  ERR_USER_NOT_FOUND: () => m.backend_error_user_not_found(),
  ERR_WRITE_OVERWRITE: () => m.backend_error_write_overwrite(),
  ERR_WRITE_TASK_ID: () => m.backend_error_write_task_id()
};

/** Duck-typed shape of ApiError so this module stays dependency-free. */
interface ApiErrorLike {
  status: number;
  code?: string;
  message?: string;
}

function isApiErrorLike(err: unknown): err is ApiErrorLike {
  return (
    typeof err === 'object' &&
    err !== null &&
    typeof (err as { status?: unknown }).status === 'number'
  );
}

export { isApiErrorLike };

function getStatusGroupMessage(status: number): string | null {
  switch (status) {
    case 401:
      return m.error_unauthorized();
    case 403:
      return m.error_forbidden();
    case 404:
      return m.error_not_found();
    case 409:
      return m.error_conflict();
    case 400:
      return m.error_invalid_data();
    case 408:
    case 504:
      return m.error_timeout();
    case 502:
    case 503:
      return m.error_bad_gateway();
    default:
      return status >= 500 ? m.error_internal() : null;
  }
}

/**
 * Resolve an error to a user-facing, localized message.
 * Precedence: known backend code -> HTTP status group -> network failure -> fallback -> default.
 */
export function resolveErrorMessage(err: unknown, fallback?: string): string {
  if (isApiErrorLike(err)) {
    if (err.code && BACKEND_ERROR_MESSAGES[err.code]) {
      return BACKEND_ERROR_MESSAGES[err.code]();
    }
    if (err.status) {
      const groupMessage = getStatusGroupMessage(err.status);
      if (groupMessage) return groupMessage;
    }
  }

  if (err instanceof TypeError) {
    return m.error_network();
  }

  return fallback ?? m.error_default_message();
}

/**
 * Show an error as a localized toast. Used in form/action catch blocks.
 */
export function showApiError(err: unknown, fallback?: string): void {
  toast.error(resolveErrorMessage(err, fallback));
}
