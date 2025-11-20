import { appRoot, $, getFirstName, isAuthenticated, toggleTheme, getSavedTheme, applyTheme, t, toggleLang, getSavedLang } from './core.js';

export function renderNavBar() {
  const authLink = isAuthenticated()
    ? `<a href="#" id="logoutLink">${t('logout')}</a>`
    : `<a href="#" id="loginLink">${t('login')}</a>`;

  return `
    <div class="navbar">
      <h1>Continental Bank</h1>
      <div class="nav-links">
        <a href="#" id="homeLink">${t('home')}</a>
        <a href="#" id="accountsLink">${t('accounts')}</a>
        <a href="#" id="exchangeLink">${t('exchange')}</a>
        <a href="#" id="transactionsLink">${t('transactions')}</a>
        <a href="#">${t('contact')}</a>
        ${authLink}
        <button id="themeToggle" class="theme-toggle" title="Toggle dark / light mode">🌓</button>
        <button id="langToggle" class="theme-toggle" title="Toggle language">EN</button>
      </div>
    </div>
  `;
}

export function wireNav(handlers) {
  const { toHome, toAccounts, toExchange, toTransactions, toAuth, onLogout } = handlers;

  const homeLink = $('homeLink');
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      toHome();
    });
  }

  const accountsLink = $('accountsLink');
  if (accountsLink) {
    accountsLink.addEventListener('click', (e) => {
      e.preventDefault();
      toAccounts();
    });
  }

  const exchangeLink = $('exchangeLink');
  if (exchangeLink) {
    exchangeLink.addEventListener('click', (e) => {
      e.preventDefault();
      toExchange();
    });
  }

  const txLink = $('transactionsLink');
  if (txLink) {
    txLink.addEventListener('click', (e) => {
      e.preventDefault();
      toTransactions();
    });
  }

  const loginLink = $('loginLink');
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      toAuth('login');
    });
  }

  const logoutLink = $('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      onLogout();
    });
  }

  const themeToggle = $('themeToggle');
  if (themeToggle) {
    // Initialize icon based on current theme
    try {
      const saved = getSavedTheme() || document.documentElement.getAttribute('data-theme') || 'light';
      themeToggle.textContent = saved === 'dark' ? '🌙' : '☀️';
    } catch (e) {}

    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const next = toggleTheme();
      themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  const langToggle = $('langToggle');
  if (langToggle) {
    try {
      const saved = getSavedLang() || 'en';
      langToggle.textContent = saved === 'en' ? 'EN' : 'AL';
    } catch (e) {}

    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const next = toggleLang();
      langToggle.textContent = next === 'en' ? 'EN' : 'AL';
      const activeHome = $('homeLink');
      if (activeHome) {
        activeHome.click();
      }
    });
  }
}

export function renderHomePage(handlers) {
  const firstName = getFirstName();
  const loginCta = isAuthenticated()
    ? ''
    : `<button type="button" class="submit-btn hero-login" id="heroLoginBtn">${t('hero_login')}</button>`;

  appRoot.innerHTML = `
    ${renderNavBar()}

    <section class="hero">
      <div class="hero-grid">
        <div class="hero-copy">
          <h2>${t('hero_heading')}</h2>
          <p>${t('hero_paragraph', { name: firstName })}</p>
          ${loginCta}
        </div>
        <div class="hero-media">
          <img src="images/istockphoto-1347652268-612x612.jpg" alt="Happy team celebrating success in a bank meeting room">
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-box">
        <h3>${t('personal_banking_title')}</h3>
        <p>${t('personal_banking_desc')}</p>
      </div>
      <div class="feature-box">
        <h3>${t('business_solutions')}</h3>
        <p>${t('business_solutions_desc')}</p>
      </div>
      <div class="feature-box">
        <h3>${t('investment_plans')}</h3>
        <p>${t('investment_plans_desc')}</p>
      </div>
    </section>

    <section class="about-section">
      <div class="about-inner">
        <div class="about-copy">
          <h3>${t('our_story_title')}</h3>
          <p>${t('our_story_paragraph')}</p>
          <p class="muted">${t('our_story_muted')}</p>
        </div>

        <div class="about-timeline">
          <div class="about-item">
            <div class="about-year">2010</div>
            <div class="about-event">Launched as a local community bank focused on personal service.</div>
          </div>
          <div class="about-item">
            <div class="about-year">2016</div>
            <div class="about-event">Introduced our first online banking platform.</div>
          </div>
          <div class="about-item">
            <div class="about-year">2022</div>
            <div class="about-event">Expanded services and modernized our digital experience.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="contact-inner">
        <div class="contact-copy">
          <h3>${t('contact_title')}</h3>
          <p class="muted">${t('contact_sub')}</p>
        </div>

        <form id="contactForm" class="contact-form">
          <input id="contactName" type="text" placeholder="${t('contact_name_placeholder')}" required />
          <input id="contactEmail" type="email" placeholder="${t('contact_email_placeholder')}" required />
          <textarea id="contactMessage" rows="3" placeholder="${t('contact_message_placeholder')}" required></textarea>
          <div style="display:flex; gap:10px; align-items:center;">
            <button type="submit" class="submit-btn">${t('send')}</button>
            <div id="contactMsg" style="font-size:14px; color:var(--muted);"></div>
          </div>
        </form>
      </div>
    </section>

    <footer class="home-footer">
      © 2025 Continental Bank. All rights reserved.<br />
      <a href="#">${t('privacy')}</a> | <a href="#">${t('terms')}</a>
    </footer>
  `;

  wireNav(handlers);

  const heroLoginBtn = $('heroLoginBtn');
  if (heroLoginBtn) {
    heroLoginBtn.addEventListener('click', () => handlers.toAuth('login'));
  }

  // Contact form handling
  const contactForm = $('contactForm');
  if (contactForm) {
    const contactMsg = $('contactMsg');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = ($('contactName') && $('contactName').value.trim()) || '';
      const email = ($('contactEmail') && $('contactEmail').value.trim()) || '';
      const message = ($('contactMessage') && $('contactMessage').value.trim()) || '';

      if (!name || !email || !message) {
        if (contactMsg) {
          contactMsg.textContent = t('contact_complete');
          contactMsg.style.color = 'var(--primary, #0a1f44)';
        }
        return;
      }

      try {
        const existing = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        existing.push({ name, email, message, date: new Date().toISOString() });
        localStorage.setItem('contact_messages', JSON.stringify(existing));
        if (contactMsg) {
          contactMsg.textContent = t('contact_saved');
          contactMsg.style.color = 'green';
        }
        contactForm.reset();
      } catch (err) {
        if (contactMsg) {
          contactMsg.textContent = t('contact_error');
          contactMsg.style.color = 'red';
        }
      }
    });
  }
}
