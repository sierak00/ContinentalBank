import { appRoot, $, getAccount, getFirstName, isAuthenticated, saveAccount } from './core.js';
import { renderNavBar, wireNav } from './navbar-home.js';

export function renderAccountsPage(handlers) {
  const firstName = getFirstName();
  const acc = getAccount() || { balance: 0, debt: 0, transactions: [] };

  if (!isAuthenticated()) {
    appRoot.innerHTML = `
      ${renderNavBar()}
      <section class="accounts-section">
        <h2>Your Account Summary</h2>
        <p class="accounts-subtitle">Please log in to view balances and recent activity.</p>
        <div class="quick-actions" style="max-width:320px; margin:0 auto;">
          <button type="button" class="submit-btn" id="accLoginCta">Log In</button>
        </div>
      </section>
    `;
    wireNav(handlers);
    const accLoginCta = $('accLoginCta');
    if (accLoginCta) {
      accLoginCta.addEventListener('click', () => handlers.toAuth('login'));
    }
    return;
  }

  const txList = acc.transactions.slice(0, 5).map((tx, idx) => {
    const sign = tx.type === 'deposit' ? '+' : '-';
    return `
      <li>
        <span>${tx.description}<span class="type">(${tx.type})</span></span>
        <span class="amount">${sign} $${tx.amount}</span>
        <button type="button" class="tx-delete" data-tx-index="${idx}">Delete</button>
      </li>
    `;
  }).join('') || '<li>No recent transactions.</li>';

  appRoot.innerHTML = `
    ${renderNavBar()}

    <section class="accounts-section">
      <h2>Your Account Summary</h2>
      <p class="accounts-subtitle">Hello, ${firstName}. Here is an overview of your main account.</p>

      <div class="summary-grid">
        <div class="summary-card">
          <span class="summary-label">Balance</span>
          <span class="summary-value">$${acc.balance}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">Debt</span>
          <span class="summary-value">$${acc.debt}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">Credit Limit</span>
          <span class="summary-value">$500</span>
        </div>
      </div>

      <div class="accounts-layout">
        <div class="transactions">
          <h3>Recent Transactions</h3>
          <ul id="txList">
            ${txList}
          </ul>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <button type="button" id="qaToTx">Make a Transaction</button>
          <button type="button">Pay Bills</button>
          <button type="button">View Statements</button>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      © 2025 Continental Bank. All rights reserved.<br />
      <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a>
    </footer>
  `;

  wireNav(handlers);
  const qaToTx = $('qaToTx');
  if (qaToTx) {
    qaToTx.addEventListener('click', () => handlers.toTransactions());
  }

  const txListEl = $('txList');
  if (txListEl) {
    txListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tx-delete');
      if (!btn) return;
      const idx = Number(btn.getAttribute('data-tx-index'));
      if (Number.isNaN(idx)) return;

      const current = getAccount();
      if (!current || !Array.isArray(current.transactions)) return;

      if (idx >= 0 && idx < current.transactions.length) {
        current.transactions.splice(idx, 1);
        saveAccount(current);
        handlers.toAccounts();
      }
    });
  }
}
