import fetch, { RequestInit, HeadersInit } from 'node-fetch';

import { Debug } from './logger';

export interface RequestOptions extends RequestInit {
  raw?: boolean; // Default false (Controls if _response is returned in the response)
  json?: Object; // JSON data sending (To make it look like less code in the actual service)
}

export async function Fetch(url: string, options?: RequestOptions) {
  try {
    // Handle json data if json object is specified.
    if (options?.json) {
      options.body = JSON.stringify(options.json);
      options.headers = { ...options.headers, 'content-type': 'application/json' };
    }

    // Make request
    let _response = await fetch(url, options);

    // Get the content type from the headers
    let content_type = _response.headers.get('content-type');

    // Decode the body
    let body;
    if (content_type?.includes('application/json')) body = await _response.json();
    else body = await _response.text();

    // Return the body deconstrcuted and the raw response as _response if raw is set
    let res;
    if (options?.raw) res = { ...body, _response };
    else res = body;

    return res;
  } catch (error) {
    Debug('Error with request function', error);
    throw error;
  }
}

export { HeadersInit as Headers };
