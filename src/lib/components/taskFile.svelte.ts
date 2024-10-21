import JSZip from 'jszip';

let mainFolderPath = $state('');
const inFolderPath = $derived(mainFolderPath + 'in');
const outFolderPath = $derived(mainFolderPath + 'out');
const docFolderPath = $derived(mainFolderPath + 'doc');
const requiredFolders = ['doc', 'in', 'out', 'prog'];

interface TaskDoc {
	pdfFile: string;
	content: Blob;
}

interface TaskIn {
	filepath: string;
	content: string;
}

interface TaskOut {
	filepath: string;
	content: string;
}

interface TaskInOut {
	tasks: Array<[TaskIn, TaskOut]>;
}

export interface Task {
	doc: TaskDoc;
	inOut: TaskInOut;
}

function isValidInFile(root: string, filename: string): boolean {
	return /^\/in\d+\.txt$/.test(filename.replace(root, ''));
}

function isValidOutFile(root: string, filename: string): boolean {
	return /^\/out\d+\.txt$/.test(filename.replace(root, ''));
}

function verifyFolderStructure(loadedZip: JSZip) {
	// JS Moment - split on 'elections/' returns a list of ['elections', '']
	const folders = Object.keys(loadedZip.files).filter((file) => file.split('/').length === 2);

	if (folders.length !== 1) {
		throw new Error('The package should contain exactly one main folder.');
	}

	mainFolderPath = folders[0];

	let nonExistingRequiredFolders = new Set<string>();
	for (const requiredFolder of requiredFolders) {
		if (!loadedZip.files[mainFolderPath + requiredFolder + '/']) {
			nonExistingRequiredFolders.add(requiredFolder);
		}
	}

	if (nonExistingRequiredFolders.size > 0) {
		throw new Error(`Missing folders: ${[...nonExistingRequiredFolders].join(', ')}`);
	}

	if (
		loadedZip.folder(docFolderPath)!.filter((_, file) => file.name.endsWith('.pdf')).length !== 1
	) {
		throw new Error('Documentation should contain exactly one PDF file');
	}

	verifyTaskInOut(loadedZip);
}

function verifyTaskInOut(loadedZip: JSZip) {
	const inFolder = loadedZip.folder(inFolderPath)!;
	const outFolder = loadedZip.folder(outFolderPath)!;

	let inFiles = inFolder.filter((_, file) => isValidInFile(inFolderPath, file.name));
	let outFiles = outFolder.filter((_, file) => isValidOutFile(outFolderPath, file.name));

	if (inFiles.length !== outFiles.length) {
		throw new Error('The number of input and output files is not equal');
	}

	for (let i = 0; i < inFiles.length; i++) {
		const inFileName = inFiles[i].name;
		const outFileName = outFiles.find((file) => file.name === inFileName.replaceAll('in', 'out'));
		if (!outFileName) {
			throw new Error(`Missing output file for input file ${inFileName}`);
		}
	}
}

async function generateTask(loadedZip: JSZip): Promise<Task> {
	const doc = loadedZip.folder(docFolderPath)!.file(/\b\w+\.pdf\b/i)[0];
	const docFile = doc.name;
	const docContent = await doc.async('blob');

	// don't as why, but this is the only way to get the files in the folder
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
		doc: { pdfFile: docFile, content: docContent },
		inOut: { tasks: TaskInOut }
	};
}

export async function loadTask(file: File): Promise<Task> {
	const zip = new JSZip();
	const loadedZip = await zip.loadAsync(file);
	verifyFolderStructure(loadedZip);
	return await generateTask(loadedZip);
}
