// API 服务 - 封装后端接口调用

const API_BASE = '/api';

// 获取存储的 token
const getToken = () => localStorage.getItem('token');

// 通用请求方法
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

// 认证相关
export const authApi = {
  register: (username: string, password: string, nickname?: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, nickname }),
    }),

  login: (username: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getProfile: () => request('/auth/profile'),
};

// 卦象相关
export const hexagramApi = {
  getAll: () => request('/hexagrams'),
  getById: (id: string) => request(`/hexagrams/${id}`),
  getRandom: () => request('/hexagrams/random'),
};

// 占卜历史
export const divinationApi = {
  getAll: () => request('/divinations'),
  create: (hexagramId: string, queryType?: string, question?: string) =>
    request('/divinations', {
      method: 'POST',
      body: JSON.stringify({ hexagramId, queryType, question }),
    }),
  delete: (id: string) =>
    request(`/divinations/${id}`, { method: 'DELETE' }),
};

// 文章相关
export const articleApi = {
  getAll: () => request('/articles'),
  getById: (id: string) => request(`/articles/${id}`),
};

// 收藏相关
export const favoriteApi = {
  getAll: () => request('/favorites'),
  add: (hexagramId: string) =>
    request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ hexagramId }),
    }),
  remove: (id: string) =>
    request(`/favorites/${id}`, { method: 'DELETE' }),
};
