import { z } from 'zod';
import JSZip from 'jszip';
import * as m from '$lib/paraglide/messages.js';

export const uploadTaskSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(3).max(50),
	archive: z
		.instanceof(File, { message: m.task_form_invalid_type() })
		.refine((file) => {
			return file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
		}, m.task_form_invalid_encoding())
		.superRefine(async (file, ctx) => {
			try {
				await verifyFolderStructure(await file.arrayBuffer());
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.addIssue({ code: z.ZodIssueCode.custom, message: e.message });
				}
				return false;
			}
			return true;
		})
});

const requiredFolders = ['input', 'output'];
const inFileRegex = /^\/\d+.in$/;
const outFileRegex = /^\/\d+.out$/;

function isValidInFile(root: string, filename: string): boolean {
	return inFileRegex.test(filename.replace(root, ''));
}

function isValidOutFile(root: string, filename: string): boolean {
	return outFileRegex.test(filename.replace(root, ''));
}

async function verifyFolderStructure(file: ArrayBuffer) {
	const zip = new JSZip();
	const loadedZip = await zip.loadAsync(file);

	const folders = Object.keys(loadedZip.files).filter((file) => file.split('/').length === 2).filter((f) => f.endsWith('/'));

	if (folders.length !== 1) {
		throw new Error('The package should contain exactly one main folder.');
	}

	const mainFolderPath = folders[0];

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
		loadedZip.folder(mainFolderPath)!.filter((_, file) => file.name.endsWith('.pdf')).length !== 1
	) {
		throw new Error('Documentation should contain exactly one PDF file');
	}

	verifyTaskInOut(loadedZip, mainFolderPath);
}

function verifyTaskInOut(loadedZip: JSZip, mainFolderPath: string) {
	const inFolderPath = mainFolderPath + 'in';
	const outFolderPath = mainFolderPath + 'out';

	const inFolder = loadedZip.folder(inFolderPath)!;
	const outFolder = loadedZip.folder(outFolderPath)!;

	let inFiles = inFolder.filter((_, file) => isValidInFile(inFolderPath, file.name));
	let outFiles = outFolder.filter((_, file) => isValidOutFile(outFolderPath, file.name));

	if (inFiles.length !== outFiles.length) {
		throw new Error('The number of input and output files is not equal');
	}

	for (let i = 0; i < inFiles.length; i++) {
		const inFileName = inFiles[i].name.replace(mainFolderPath, '');
		const outFileName = outFiles.find(
			(file) => file.name.replace(mainFolderPath, '') === inFileName.replaceAll('in', 'out')
		);
		if (!outFileName) {
			throw new Error(`Missing output file for input file ${inFileName}`);
		}
	}
}

export type UploadTaskSchema = typeof uploadTaskSchema;
