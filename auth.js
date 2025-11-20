import { appRoot, $, clearCurrentUser, getUsers, initAccountIfMissing, saveUsers, setCurrentUser, createAccountForEmail, t } from './core.js';

export function renderAuthPage(defaultTab = 'login', handlers) {
  appRoot.innerHTML = `
    <div class="auth-page" id="authPage">
      <div class="container" id="authBox">
        <div class="alt-link" style="text-align:right; margin-bottom:10px;">
          <a href="#" id="backHome">← Back to site</a>
        </div>
        <h2>Continental Bank</h2>

        <div class="tabs">
          <button id="loginTab" class="active">${t('login_tab')}</button>
          <button id="registerTab">${t('register_tab')}</button>
        </div>

        <form id="loginForm">
          <input id="loginEmail" type="email" placeholder="Email" required>
          <input id="loginPassword" type="password" placeholder="Password" required>
          <button type="submit" class="submit-btn">${t('login')}</button>
          <div class="alt-link">${t('dont_have_account').replace('Register', `<a href="#" id="goRegister">${t('register_tab')}</a>`)}</div>
          <p class="message" id="loginMsg"></p>
        </form>

        <form id="registerForm" style="display: none;">
          <input id="regName" type="text" placeholder="Full Name" required>
          <input id="regEmail" type="email" placeholder="Email Address" required>
          <input id="regPassword" type="password" placeholder="Create Password" required>
          <input id="regConfirm" type="password" placeholder="Confirm Password" required>
          <button type="submit" class="submit-btn">${t('register_tab')}</button>
          <div class="alt-link">${t('already_have_account').replace('Login', `<a href="#" id="goLogin">${t('login_tab')}</a>`)}</div>
          <p class="message" id="registerMsg"></p>
        </form>
      </div>
    </div>

    <footer class="auth-footer">© 2025 Continental Bank. All rights reserved.</footer>
  `;

  setupAuthHandlers(defaultTab, handlers);
}

function setupAuthHandlers(defaultTab, handlers) {
  const loginForm = $('loginForm');
  const registerForm = $('registerForm');
  const loginTab = $('loginTab');
  const registerTab = $('registerTab');
  const goRegister = $('goRegister');
  const goLogin = $('goLogin');
  const backHome = $('backHome');

  function showForm(form) {
    if (!loginForm || !registerForm || !loginTab || !registerTab) return;

    if (form === 'login') {
      loginForm.style.display = 'flex';
      registerForm.style.display = 'none';
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'flex';
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
    }
  }

  if (loginTab) {
    loginTab.addEventListener('click', () => showForm('login'));
  }
  if (registerTab) {
    registerTab.addEventListener('click', () => showForm('register'));
  }
  if (goRegister) {
    goRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showForm('register');
    });
  }
  if (goLogin) {
    goLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showForm('login');
    });
  }
  if (backHome) {
    backHome.addEventListener('click', (e) => {
      e.preventDefault();
      handlers.toHome();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('regName').value.trim();
      const email = $('regEmail').value.trim();
      const password = $('regPassword').value;
      const confirm = $('regConfirm').value;
      const msg = $('registerMsg');

      if (password !== confirm) {
        msg.textContent = t('passwords_no_match');
        msg.style.color = 'red';
        return;
      }

      const users = getUsers();
      if (users.find(u => u.email === email)) {
        msg.textContent = t('email_registered');
        msg.style.color = 'red';
        return;
      }

      users.push({ name, email, password });
      saveUsers(users);
      // Create an empty account for the new user (balance: 0, debt: 0).
      createAccountForEmail(email);
      msg.textContent = t('registration_success');
      msg.style.color = 'green';
      registerForm.reset();
      showForm('login');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = $('loginEmail').value.trim();
      const password = $('loginPassword').value;
      const msg = $('loginMsg');
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        clearCurrentUser();
        setCurrentUser(user);
        initAccountIfMissing();
        handlers.toHome();
      } else {
        msg.textContent = t('invalid_credentials');
        msg.style.color = 'red';
      }
    });
  }

  showForm(defaultTab);
}
