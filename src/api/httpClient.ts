import { useAuthStore } from "@/stores";

// src/utils/http.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HttpOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  body?: any;
  json?: boolean; // auto to json
}

/**
 * base http class handle all public options
 */
class HttpClient {
  private static instance: HttpClient | null = null;
  private baseUrl: string = '/api/v1';
  private isRefreshing = false;
  private failedQueue: Array<() => void> = [];

  private constructor() {}

  /** make sure only one instance in the global this, avoid duplicate new */
  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    options: HttpOptions = {}
  ): Promise<T> {
    const { params, body, json = true, ...fetchOptions } = options;

    // handle query params
    let fullUrl = `${this.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    if (params) {
      const query = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      if (query) fullUrl += `?${query}`;
    }

    const headers = new Headers(fetchOptions.headers);
    if (json && method !== 'GET' && method !== 'DELETE') {
      headers.set('Content-Type', 'application/json');
    }

    const auth = useAuthStore()
    const token = auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      headers.set('X-API-Key', apiKey);
    }

    const config: RequestInit = {
      method,
      headers,
      ...fetchOptions,
      body: json && body ? JSON.stringify(body) : body,
    };

    const response = await fetch(fullUrl, config);

    // if return 401 and not refresh, go refresh
    if (response.status === 401 && !url.includes('/refresh')) {
      if (this.isRefreshing) {
        // already have refresh in queue, wait for the queue
        return new Promise<T>((resolve) => {
          this.failedQueue.push(() => resolve(this.request(method, url, options)));
        });
      }

      this.isRefreshing = true;

      try {
        const refreshResponse = await fetch(
          `${this.baseUrl}/refresh`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (!refreshResponse.ok) {
          throw new Error('Refresh token failed');
        }

        const { accessToken } = await refreshResponse.json();
        auth.setToken(accessToken);

        this.failedQueue.forEach((retry) => retry());
        this.failedQueue = [];

        // re request
        headers.set('Authorization', `Bearer ${accessToken}`);
        return this.request(method, url, options);
      } catch (refreshErr) {
        this.failedQueue = [];
        auth.clearToken()
        window.location.href = '/login';
        throw refreshErr;
      } finally {
        this.isRefreshing = false;
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Network error' };
      }

      throw new Error(
        errorData.message ||
        errorData.error ||
        `Request failed with status ${response.status}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const jsonData = await response.json();
      if (jsonData.success) {
        return jsonData.data ?? jsonData;
      } else {
        throw new Error(jsonData.error || jsonData.message || 'API Error');
      }
    }

    // return if not json
    return response as any;
  }

  get<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request<T>('GET', url, options);
  }

  post<T>(url: string, body?: any, options?: HttpOptions): Promise<T> {
    return this.request<T>('POST', url, { ...options, body });
  }

  put<T>(url: string, body?: any, options?: HttpOptions): Promise<T> {
    return this.request<T>('PUT', url, { ...options, body });
  }

  patch<T>(url: string, body?: any, options?: HttpOptions): Promise<T> {
    return this.request<T>('PATCH', url, { ...options, body });
  }

  delete<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request<T>('DELETE', url, options);
  }
}

const http = HttpClient.getInstance();

export const FetchGet = <T>(url: string, options?: HttpOptions) => http.get<T>(url, options);
export const FetchPost = <T>(url: string, body?: any, options?: HttpOptions) => http.post<T>(url, body, options);
export const FetchPut = <T>(url: string, body?: any, options?: HttpOptions) => http.put<T>(url, body, options);
export const FetchDelete = <T>(url: string, options?: HttpOptions) => http.delete<T>(url, options);