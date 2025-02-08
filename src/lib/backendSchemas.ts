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
		id: number;
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

export interface GetAllUsersResponse {
	ok: boolean;
	data: {
		id: number;
		name: string;
		surname: string;
		email: string;
		username: string;
		role: string;
	}[];
}
