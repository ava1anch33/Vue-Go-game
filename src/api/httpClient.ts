import { useAuthStore } from '@/stores'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type BodyFactory = undefined | null | BodyInit | (() => Promise<BodyInit>)

type JsonBody = Record<string, any>

type RawBody = BodyInit | (() => Promise<BodyInit>)

type JsonBodyFactory = JsonBody | (() => Promise<JsonBody>)

type BaseOptions = Omit<RequestInit, 'body'> & {
	params?: Record<string, string | number | boolean>
}

export type HttpOptions =
	| (BaseOptions & {
			payloadType?: 'json'
			body?: JsonBodyFactory
	  })
	| (BaseOptions & {
			payloadType: 'raw' | 'upload'
			body?: RawBody
	  })

class HttpClient {
	private static instance: HttpClient
	private baseUrl = '/api/v1'

	private isRefreshing = false
	private refreshQueue: Array<() => void> = []

	static getInstance() {
		if (!this.instance) this.instance = new HttpClient()
		return this.instance
	}

	private async request<T>(
		method: HttpMethod,
		url: string,
		options: HttpOptions = {},
		retried = false,
	): Promise<T> {
		const { params, body, payloadType = 'json', headers: customHeaders, ...rest } = options

		let fullUrl = this.baseUrl + (url.startsWith('/') ? url : `/${url}`)
		if (params) {
			const q = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))
			if (q.toString()) fullUrl += `?${q}`
		}

		const headers = new Headers(customHeaders)
		const auth = useAuthStore()

		if (auth.token) {
			headers.set('Authorization', `Bearer ${auth.token}`)
		}

		const apiKey = import.meta.env.VITE_API_KEY
		if (apiKey) {
			headers.set('X-API-Key', apiKey)
		}

		if (payloadType === 'json') {
			headers.set('Content-Type', 'application/json')
		}

		let resolvedBody: any

		if (typeof body === 'function') {
			resolvedBody = await body()
		} else {
			resolvedBody = body
		}

		if (payloadType === 'json' && resolvedBody != null) {
			resolvedBody = JSON.stringify(resolvedBody)
		}

		const config: RequestInit = {
			method,
			headers,
			credentials: 'include',
			body: method === 'GET' || method === 'DELETE' ? undefined : resolvedBody,
			...rest,
		}

		const res = await fetch(fullUrl, config)

		if (res.status === 401 && !retried && !url.includes('/refresh')) {
			return this.handle401<T>(method, url, options)
		}

		if (!res.ok) {
			let err: any
			try {
				err = await res.json()
			} catch {
				err = { message: res.statusText }
			}
			throw new Error(err.message || 'Request failed')
		}

		const ct = res.headers.get('content-type')
		if (ct?.includes('application/json')) {
			const json = await res.json()
			return json.data ?? json
		}

		return res as any
	}

	private async handle401<T>(method: HttpMethod, url: string, options: HttpOptions): Promise<T> {
		if (this.isRefreshing) {
			return new Promise<T>((resolve) => {
				this.refreshQueue.push(() => resolve(this.request(method, url, options, true)))
			})
		}

		this.isRefreshing = true

		try {
			const res = await fetch(`${this.baseUrl}/refresh`, {
				method: 'POST',
				credentials: 'include',
			})

			if (!res.ok) throw new Error('Refresh failed')

			const { accessToken } = await res.json()
			const auth = useAuthStore()
			auth.setToken(accessToken)

			this.refreshQueue.forEach((cb) => cb())
			this.refreshQueue = []

			return this.request(method, url, options, true)
		} catch (e) {
			const auth = useAuthStore()
			auth.clearToken()
			window.location.href = '/login'
			throw e
		} finally {
			this.isRefreshing = false
		}
	}

	get<T>(url: string, options?: HttpOptions) {
		return this.request<T>('GET', url, options)
	}
	post<T>(url: string, options?: HttpOptions) {
		return this.request<T>('POST', url, options)
	}
	put<T>(url: string, options?: HttpOptions) {
		return this.request<T>('PUT', url, options)
	}
	patch<T>(url: string, options?: HttpOptions) {
		return this.request<T>('PATCH', url, options)
	}
	delete<T>(url: string, options?: HttpOptions) {
		return this.request<T>('DELETE', url, options)
	}
}

const http = HttpClient.getInstance()

export const FetchGet = <T>(url: string, opt?: HttpOptions) => http.get<T>(url, opt)

export const FetchPost = <T>(url: string, options?: HttpOptions) => http.post<T>(url, options)
