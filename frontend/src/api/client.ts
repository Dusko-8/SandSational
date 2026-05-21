import type { GameState } from '../types/gameState';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<TResponse>(
  path: string,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export const apiClient = {
  getGameState: () => request<GameState>('/game/state'),
  clickMine: () =>
    request<GameState>('/game/click', {
      method: 'POST'
    })
};

