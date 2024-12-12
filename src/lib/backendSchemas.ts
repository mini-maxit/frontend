export interface AuthSessionResponse {
	data: {
		id: string;
		expires_at: Date;
	};
}

export interface AuthUserResponse {
	data: {
		id: string;
		user_id: number;
		expires_at: Date;
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
