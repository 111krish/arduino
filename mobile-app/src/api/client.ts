import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE_URL = 'https://api.researcher-app.example.com/v1';

async function getBaseUrl(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem('api_base_url');
    return saved ?? DEFAULT_BASE_URL;
  } catch {
    return DEFAULT_BASE_URL;
  }
}

async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const [baseUrl, token] = await Promise.all([getBaseUrl(), getToken()]);
  const url = `${baseUrl}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string };
}

export interface ResearchItem {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'pending' | 'archived';
  category: string;
  created_at: string;
  updated_at: string;
  description: string;
  progress: number;
}

export interface DashboardStats {
  total_studies: number;
  active_studies: number;
  completed_studies: number;
  pending_reviews: number;
  api_health: 'healthy' | 'degraded' | 'down';
}

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/stats');
  },

  async getResearch(page = 1, limit = 20): Promise<ResearchItem[]> {
    return request<ResearchItem[]>(`/research?page=${page}&limit=${limit}`);
  },

  async getResearchById(id: string): Promise<ResearchItem> {
    return request<ResearchItem>(`/research/${id}`);
  },

  async checkHealth(): Promise<{ status: string; version: string }> {
    return request('/health');
  },
};

// Mock data for offline/demo mode
export const MOCK_STATS: DashboardStats = {
  total_studies: 142,
  active_studies: 23,
  completed_studies: 108,
  pending_reviews: 11,
  api_health: 'healthy',
};

export const MOCK_RESEARCH: ResearchItem[] = [
  { id: '1', title: 'Climate Change Impact on Coral Reefs', status: 'active', category: 'Environmental', created_at: '2026-01-15', updated_at: '2026-06-10', description: 'Studying bleaching patterns across Pacific reefs.', progress: 72 },
  { id: '2', title: 'Machine Learning in Drug Discovery', status: 'active', category: 'Biomedical', created_at: '2026-02-01', updated_at: '2026-06-14', description: 'Applying transformer models to protein folding predictions.', progress: 45 },
  { id: '3', title: 'Quantum Error Correction Protocols', status: 'completed', category: 'Physics', created_at: '2025-08-10', updated_at: '2026-03-20', description: 'Surface code implementations on 50-qubit systems.', progress: 100 },
  { id: '4', title: 'Microbiome and Mental Health', status: 'pending', category: 'Neuroscience', created_at: '2026-06-01', updated_at: '2026-06-12', description: 'Gut-brain axis correlation studies in anxiety patients.', progress: 8 },
  { id: '5', title: 'Renewable Energy Grid Stability', status: 'active', category: 'Engineering', created_at: '2026-03-01', updated_at: '2026-06-15', description: 'Frequency regulation in high-penetration solar grids.', progress: 61 },
  { id: '6', title: 'Ancient DNA Sequencing Techniques', status: 'archived', category: 'Archaeology', created_at: '2024-11-01', updated_at: '2025-12-30', description: 'Extracting and analyzing 10,000-year-old samples.', progress: 100 },
];
