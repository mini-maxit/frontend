export interface TaskDoc {
	pdfFile: string;
	content: Blob;
}

export interface TaskIn {
	filepath: string;
	content: string;
}

export interface TaskOut {
	filepath: string;
	content: string;
}

export interface TaskInOut {
	tasks: Array<[TaskIn, TaskOut]>;
}

export interface Task {
	mainFolderPath: string;
	doc: TaskDoc;
	inOut: TaskInOut;
}

export interface TaskPageLoadDoc {
	pdfFile: string;
	contentBase64: string;
}

export interface TaskPageLoad {
	mainFolderPath: string;
	doc: TaskPageLoadDoc;
	inOut: TaskInOut;
}