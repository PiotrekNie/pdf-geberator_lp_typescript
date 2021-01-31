type RequestBodyJSON =
  | string
  | FormData
  | Document
  | Blob
  | ArrayBufferView
  | ArrayBuffer
  | URLSearchParams
  | ReadableStream<Uint8Array>;

type QueryParams = { [key: string]: string | number | boolean };

export interface RequestOptions {
  ignoreCache?: boolean;
  headers?: { [key: string]: string };
  timeout?: number; // 0 (or negative) to wait forever
}

export interface RequestResult {
  ok: boolean;
  status: number;
  statusText: string;
  data: string;
  json: <T>() => T;
  headers: string;
}

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
  ignoreCache: false,
  headers: {
    Accept: 'application/json, text/javascript, text/plain',
  },
  timeout: 0,
};

export function queryParameters(params: QueryParams = {}): string {
  return Object.keys(params)
    .map((k: string) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}

function withQuery(url: string, params: QueryParams = {}): string {
  const queryString: string = queryParameters(params);
  return queryString ? url + (url.indexOf('?') === -1 ? '?' : '&') + queryString : url;
}

function parseXHRResult(xhr: XMLHttpRequest): RequestResult {
  return {
    ok: xhr.status >= 200 && xhr.status < 300,
    status: xhr.status,
    statusText: xhr.statusText,
    headers: xhr.getAllResponseHeaders(),
    data: xhr.responseText,
    json: <T>(): T => JSON.parse(xhr.responseText) as T,
  };
}

function errorResponse(xhr: XMLHttpRequest, message: string | null = null): RequestResult {
  return {
    ok: false,
    status: xhr.status,
    statusText: xhr.statusText,
    headers: xhr.getAllResponseHeaders(),
    data: message || xhr.statusText,
    json: <T>(): T => JSON.parse(message || xhr.statusText) as T,
  };
}

export function httpRequest(
  method: 'get' | 'post',
  url: string,
  options: RequestOptions = DEFAULT_REQUEST_OPTIONS,
  body: RequestBodyJSON = null,
  queryParams: QueryParams = {}
): Promise<RequestResult> {
  const ignoreCache: boolean = options.ignoreCache || DEFAULT_REQUEST_OPTIONS.ignoreCache;
  const headers: { [key: string]: string } = options.headers || DEFAULT_REQUEST_OPTIONS.headers;
  const timeout: number = options.timeout || DEFAULT_REQUEST_OPTIONS.timeout;

  return new Promise<RequestResult>((resolve: (value?: RequestResult | PromiseLike<RequestResult>) => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open(method, withQuery(url, queryParams));

    if (headers) {
      Object.keys(headers).forEach((key: string) => xhr.setRequestHeader(key, headers[key]));
    }

    if (ignoreCache) {
      xhr.setRequestHeader('Cache-Control', 'no-cache');
    }

    xhr.timeout = timeout;

    xhr.onload = (): void => {
      resolve(parseXHRResult(xhr));
    };

    xhr.onerror = (): void => {
      resolve(errorResponse(xhr, 'Failed to make request.'));
    };

    xhr.ontimeout = (): void => {
      resolve(errorResponse(xhr, 'Request took longer than expected.'));
    };

    if (method === 'post' && body) {
      if (!(body instanceof FormData)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      xhr.send(body);
    } else {
      xhr.send();
    }
  });
}
