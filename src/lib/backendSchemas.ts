export enum UserRole {
	Admin = 'admin',
	Student = 'student',
	Teacher = 'teacher'
}

export interface UserData {
	id: number;
	name: string;
	surname: string;
	email: string;
	username: string;
	role: UserRole;
}

export interface LanguageConfig {
	id: number;
	language: string;
	version: string;
	file_extension: string;
}

export interface TaskData {
	id: number;
	title: string;
	description_url: string;
	created_by: number;
}

interface LanguageData {
	language: string;
	version: string;
}

export enum SubmissionStatus {
	Received = 'received',
	SentForEvaluation = 'sent for evaluation',
	Evaluated = 'evaluated',
	Lost = 'lost'
}

export interface SubmissionData {
	id: number;
	task_id: number;
	user_id: number;
	order: number;
	language_id: number;
	status: SubmissionStatus;
	status_message: string;
	submitted_at: string;
	checked_at: string;
	language: LanguageData;
	task: TaskData;
	user: UserData;
	result: SubmissionResultData | null;
}

export interface GroupData {
	id: number;
	name: string;
	created_by: number;
	created_at: string;
	updated_at: string;
}

interface TestResultData {
	id: number;
	submission_result_id: number;
	input_output_id: number;
	passed: boolean;
}

export interface SubmissionResultData {
	id: number;
	submission_id: number;
	code: string;
	message: string;
	created_at: string;
	test_results: TestResultData[];
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
		user_role: UserRole;
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

export interface GetAllSubmissionsResponse extends ApiResponse {
	data: SubmissionData[];
}

export interface GetAllGroupsResponse extends ApiResponse {
	data: GroupData[];
}
