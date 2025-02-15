export interface UserData {
	id: number;
	name: string;
	surname: string;
	email: string;
	username: string;
	role: 'admin' | 'student' | 'teacher';
}

export interface LanguageConfig {
	id: number;
	language: string;
	version: string;
	file_extension: string;
}

interface TaskData {
	id: number;
	title: string;
	description_url: string;
	create_by: number;
}

interface LanguageData {
	language: string;
	version: string;
}

export interface SubmissionData {
	id: number;
	task_id: number;
	user_id: number;
	order: number;
	language_id: number;
	status: 'received' | 'sent for evaluation' | 'evaluated' | 'lost';
	status_message: string;
	submitted_at: string;
	checked_at: string | null;
	language: LanguageData;
	task: TaskData;
	user: UserData;
}

interface ApiResponse {
	ok: boolean;
	data: any;
}

export interface GetAvailableLanguagesResponse extends ApiResponse {
	data: LanguageConfig[];
}

export interface AuthSessionResponse extends ApiResponse {
	data: {
		valid: boolean;
		user: UserData;
	};
}

export interface AuthUserResponse extends ApiResponse {
	data: {
		user_id: number;
		user_role: 'admin' | 'student' | 'teacher';
		session: string;
		expires_at: Date;
	};
}

export interface UploadTaskResponse extends ApiResponse {
	data: {
		id: number;
	};
}

export interface GetTaskResponse extends ApiResponse {
	data: TaskData;
}

export interface GetAllTasksResponse extends ApiResponse {
	data: TaskData[];
}

export interface GetAllUsersResponse extends ApiResponse {
	data: UserData[];
}

export interface GetUserResponse extends ApiResponse {
	data: UserData;
}

export interface GetSubmissionResponse extends ApiResponse {
	data: SubmissionData[];
}
