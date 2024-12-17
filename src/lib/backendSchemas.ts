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
		id: string;
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
