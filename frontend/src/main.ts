import './styles.css';
import { apiClient, type AuthRequest, type RegisterRequest } from './api/client';
import { createGame } from './game/createGame';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app root element');
}

const root = app;

type AuthMode = 'login' | 'register';

let authMode: AuthMode = 'login';
const skipAuthForLocalDevelopment = true;

function renderAuthScreen(): void {
  root.innerHTML = `
    <main class="terminal-shell" aria-labelledby="auth-title">
      <section class="terminal-panel">
        <div class="terminal-bar" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="terminal-output">
          <p>> booting sandsational_client.exe</p>
          <p>> establishing secure session intent</p>
          <p>> backend authority: required</p>
        </div>

        <h1 id="auth-title">SANDSATIONAL ACCESS</h1>

        <div class="mode-switch" role="tablist" aria-label="Authentication mode">
          <button class="mode-button ${authMode === 'login' ? 'active' : ''}" type="button" data-mode="login">
            LOGIN
          </button>
          <button class="mode-button ${authMode === 'register' ? 'active' : ''}" type="button" data-mode="register">
            REGISTER
          </button>
        </div>

        <form id="auth-form" class="auth-form" autocomplete="on">
          <label>
            <span>USERNAME</span>
            <input
              name="username"
              type="text"
              autocomplete="username"
              minlength="3"
              maxlength="32"
              required
            />
          </label>

          <label>
            <span>PASSWORD</span>
            <input
              name="password"
              type="password"
              autocomplete="${authMode === 'login' ? 'current-password' : 'new-password'}"
              minlength="8"
              required
            />
          </label>

          ${
            authMode === 'register'
              ? `
                <label>
                  <span>CONFIRM PASSWORD</span>
                  <input
                    name="confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    minlength="8"
                    required
                  />
                </label>
              `
              : ''
          }

          <button class="submit-button" type="submit">
            > ${authMode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p id="auth-status" class="auth-status" role="status" aria-live="polite">
          Awaiting credentials.
        </p>
      </section>
    </main>
  `;

  bindAuthScreen();
}

function bindAuthScreen(): void {
  const form = document.querySelector<HTMLFormElement>('#auth-form');
  const status = document.querySelector<HTMLParagraphElement>('#auth-status');
  const modeButtons = document.querySelectorAll<HTMLButtonElement>('.mode-button');

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      authMode = button.dataset.mode === 'register' ? 'register' : 'login';
      renderAuthScreen();
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!status) {
      return;
    }

    const formData = new FormData(form);
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');
    const usernamePattern = /^[A-Za-z0-9_-]+$/u;

    if (!usernamePattern.test(username)) {
      status.textContent = 'ERROR: username can use letters, numbers, _ and - only.';
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      status.textContent = 'ERROR: password confirmation does not match.';
      return;
    }

    status.textContent = `Sending ${authMode} request to backend...`;

    try {
      if (authMode === 'login') {
        const payload: AuthRequest = { username, password };
        await apiClient.login(payload);
      } else {
        const payload: RegisterRequest = { username, password, confirmPassword };
        await apiClient.register(payload);
      }

      status.textContent = 'ACCESS GRANTED. Loading particle field...';
      setTimeout(startGame, 350);
    } catch {
      status.textContent = 'BACKEND OFFLINE: entering local frontend preview...';
      setTimeout(startGame, 650);
    } finally {
      form.reset();
    }
  });
}

function startGame(): void {
  root.innerHTML = '';
  createGame(root);
}

if (skipAuthForLocalDevelopment) {
  startGame();
} else {
  renderAuthScreen();
}
