export interface TaskDoc {
	name: string;
	content: Blob;
}
export interface TaskDisplayData {
	name: string;
	doc: TaskDoc;
}

// todo: implement this function to work with .tar.gz files
// recommended library: https://www.npmjs.com/package/tar-stream
export function parseFileToTaskDisplayData(file: File): TaskDisplayData {
	throw new Error('Not implemented');
	return {
		name: file.name,
		doc: {
			name: file.name,
			content: file
		}
	};
}
