import type { GameState } from '../types/gameState';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<TResponse>(
  path: string,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  confirmPassword: string;
}

export interface AuthResponse {
  playerId: string;
  username: string;
}

export const apiClient = {
  login: (payload: AuthRequest) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  register: ({ confirmPassword: _confirmPassword, ...payload }: RegisterRequest) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getGameState: () => request<GameState>('/game/state'),
  clickMine: () =>
    request<GameState>('/game/click', {
      method: 'POST'
    })
};
