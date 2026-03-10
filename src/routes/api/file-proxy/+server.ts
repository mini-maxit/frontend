import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const fileUrl = url.searchParams.get('url');

  if (!fileUrl) {
    throw error(400, 'Missing url parameter');
  }

  const fileStorageUrl = env.FILE_STORAGE_URL;

  if (!fileStorageUrl) {
    throw error(500, 'File storage URL not configured');
  }

  if (!fileUrl.startsWith(fileStorageUrl)) {
    throw error(403, 'URL not allowed');
  }

  let response: Response;
  try {
    response = await fetch(fileUrl);
  } catch {
    throw error(502, 'Failed to connect to file storage');
  }

  if (!response.ok) {
    throw error(
      response.status,
      `Failed to fetch file from storage: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get('Content-Type') ?? 'application/octet-stream';
  const body = await response.arrayBuffer();

  return new Response(body, {
    headers: {
      'Content-Type': contentType
    }
  });
};
