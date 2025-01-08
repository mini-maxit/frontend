export interface AuthSessionResponse {
	data: {
		id: string;
		expires_at: Date;
	};
}

export interface AuthUserResponse {
	ok: boolean;
	data: {
		user_id: number;
		session: string;
		expires_at: Date;
	};
}

export interface UploadTaskResponse {
	ok: boolean;
	data: {
		taskId: number;
	};
}

export interface GetTaskResponse {
	ok: boolean;
	data: {
		id: number;
		title: string;
		description_url: string;
		create_by: number;
	};
}

export interface GetAllTasksResponse {
	ok: boolean;
	data: {
		id: number;
		title: string;
		created_by: number;
		created_at: string;
	}[];
}
