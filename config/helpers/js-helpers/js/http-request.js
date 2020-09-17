/**
 * @interface RequestResult
 * ok: boolean;
 * status: number;
 * statusText: string;
 * data: string;
 * json: <T>() => T;
 * headers: string;
 */

export const DEFAULT_REQUEST_OPTIONS = {
  ignoreCache: false,
  headers: {
    Accept: 'application/json, text/javascript, text/plain',
  },
  timeout: 0,
};

/**
 * Convert parameters to string
 * @param {object} params
 * @return {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function queryParameters(params = {}) {
  return Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}

/**
 * Create query
 * @param {string} url
 * @param {object} params
 * @return {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withQuery(url, params = {}) {
  const queryString = queryParameters(params);
  return queryString ? url + (url.indexOf('?') === -1 ? '?' : '&') + queryString : url;
}

/**
 * Parse XHR Results
 * @param {XMLHttpRequest} xhr
 * @return {RequestResult}
 */
function parseXHRResult(xhr) {
  return {
    ok: xhr.status >= 200 && xhr.status < 300,
    status: xhr.status,
    statusText: xhr.statusText,
    headers: xhr.getAllResponseHeaders(),
    data: xhr.responseText,
    json: () => JSON.parse(xhr.responseText),
  };
}

/**
 * Error response
 * @param {XMLHttpRequest} xhr
 * @param {string | null} message
 * @return {RequestResult}
 */
function errorResponse(xhr, message = null) {
  return {
    ok: false,
    status: xhr.status,
    statusText: xhr.statusText,
    headers: xhr.getAllResponseHeaders(),
    data: message || xhr.statusText,
    json: () => JSON.parse(message || xhr.statusText),
  };
}

/**
 * Create XMLHttpRequest
 * @param {'get' | 'post'} method
 * @param {string} url
 * @param {RequestOptions} options
 * @param {object} body
 * @param {object} queryParams
 * @return {Promise<RequestResult>}
 */
export function httpRequest(
  method,
  url,
  options = DEFAULT_REQUEST_OPTIONS,
  body = null,
  queryParams = {} // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const ignoreCache = options.ignoreCache || DEFAULT_REQUEST_OPTIONS.ignoreCache;
  const headers = options.headers || DEFAULT_REQUEST_OPTIONS.headers;
  const timeout = options.timeout || DEFAULT_REQUEST_OPTIONS.timeout;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, withQuery(url, queryParams));

    if (headers) {
      Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));
    }

    if (ignoreCache) {
      xhr.setRequestHeader('Cache-Control', 'no-cache');
    }

    xhr.timeout = timeout;

    xhr.onload = () => {
      resolve(parseXHRResult(xhr));
    };

    xhr.onerror = () => {
      resolve(errorResponse(xhr, 'Failed to make request.'));
    };

    xhr.ontimeout = () => {
      resolve(errorResponse(xhr, 'Request took longer than expected.'));
    };

    if (method === 'post' && body) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
  });
}
