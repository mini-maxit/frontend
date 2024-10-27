export async function blobToBase64(blob: Blob): Promise<string> {
	const buffer = Buffer.from(await blob.arrayBuffer());
	return buffer.toString('base64');
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
	const buffer = Buffer.from(base64, 'base64');
	return new Blob([buffer], { type: mimeType });
}
