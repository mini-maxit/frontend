export async function clientSideBlobToBase64(blob: Blob): Promise<string> {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = () => {
			reject(reader.error);
		};
		reader.readAsDataURL(blob);
	});
}

export function clientSideBase64ToBlob(base64: string, mimeType: string): Blob {
	const byteCharacters = atob(base64);
	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);

	const blob = new Blob([byteArray], { type: mimeType });

	return blob;
}
