import JSZip from 'jszip';
import { type SuperValidated } from 'sveltekit-superforms';

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
	name: string;
	mainFolderPath: string;
	doc: TaskDoc;
	inOut: TaskInOut;
}

export interface TaskPageLoadDoc {
	pdfFile: string;
	contentBase64: string;
}

export interface TaskPageLoad {
	name: string;
	mainFolderPath: string;
	doc: TaskPageLoadDoc;
	inOut: TaskInOut;
}

export async function parseFormToTask(
	form: SuperValidated<{
		taskName: string;
		taskFile: File;
	}>
): Promise<Task> {
	const zip = new JSZip();
	const loadedZip = await zip.loadAsync(await form.data.taskFile.arrayBuffer());
	const folders = Object.keys(loadedZip.files).filter((file) => file.split('/').length === 2);

	const mainFolderPath = folders[0];
	const docFolderPath = mainFolderPath + 'doc';
	const inFolderPath = mainFolderPath + 'in';

	const doc = loadedZip.folder(docFolderPath)!.file(/\b\w+\.pdf\b/i)[0];
	const docFile = doc.name;
	const docContent = await doc.async('blob');

	let inFiles = loadedZip.folder(inFolderPath)!.filter((_, __) => {
		return true;
	});

	const TaskInOut: Array<[TaskIn, TaskOut]> = [];

	for (let i = 0; i < inFiles.length; i++) {
		const inFileName = inFiles[i].name;
		const outFileName = inFileName.replaceAll('in', 'out');
		const inFile = loadedZip.file(inFileName)!;
		const outFile = loadedZip.file(outFileName)!;
		const inContent = await inFile.async('text');
		const outContent = await outFile.async('text');
		const taskIn: TaskIn = { filepath: inFileName, content: inContent };
		const taskOut: TaskOut = { filepath: outFileName, content: outContent };
		TaskInOut.push([taskIn, taskOut]);
	}

	return {
		name: form.data.taskName,
		mainFolderPath,
		doc: { pdfFile: docFile, content: docContent },
		inOut: { tasks: TaskInOut }
	};
}
