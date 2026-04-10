const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BASE_URL = process.env.REACT_APP_API_URL || '';

export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok && res.status !== 401) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async post<T>(url: string, body: Record<string, any> | FormData): Promise<T> {
    const headers: Record<string, string> = { ...getAuthHeader() };
    const opts: RequestInit = { method: 'POST', headers };

    if (body instanceof FormData) {
      opts.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${url}`, opts);
    return res.json();
  },

  async del<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  async put<T>(url: string, body: Record<string, any> | FormData): Promise<T> {
    const headers: Record<string, string> = { ...getAuthHeader() };
    const opts: RequestInit = { method: 'PUT', headers };

    if (body instanceof FormData) {
      opts.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${url}`, opts);
    return res.json();
  },
};

export const formatPrice = (price: string | number): string => {
  const p = parseFloat(String(price));
  if (p === 0) return 'FREE';
  return `LKR ${p.toFixed(2)}`;
};

export const renderStarsText = (rating: string | number): string => {
  const r = Math.round(parseFloat(String(rating)) * 2) / 2;
  let out = '';
  for (let i = 1; i <= 5; i++) {
    if (r >= i) out += '★';
    else if (r >= i - 0.5) out += '⯨';
    else out += '☆';
  }
  return out;
};

export const getParam = (key: string): string | null => {
  return new URLSearchParams(window.location.search).get(key);
};

export const debounce = <T extends (...args: any[]) => void>(fn: T, ms = 300) => {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const toSlug = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

