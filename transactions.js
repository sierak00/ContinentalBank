import { appRoot, $, getAccount, isAuthenticated, saveAccount, t } from './core.js';
import { renderNavBar, wireNav } from './navbar-home.js';

export function renderTransactionsPage(handlers) {
  const acc = getAccount() || { balance: 0, debt: 0, transactions: [] };

  if (!isAuthenticated()) {
    appRoot.innerHTML = `
      ${renderNavBar()}
      <section class="transactions-page">
        <h2>${t('new_tx_heading')}</h2>
        <p class="subtitle">${t('new_tx_subtitle_anon')}</p>
        <div class="tx-form" style="text-align:center;">
          <button type="button" class="submit-btn" id="txLoginCta">${t('log_in_button')}</button>
        </div>
      </section>
      <footer class="home-footer">
        © 2025 Continental Bank. All rights reserved.<br />
        <a href="#">${t('privacy')}</a> | <a href="#">${t('terms')}</a>
      </footer>
    `;
    wireNav(handlers);
    const txLoginCta = $('txLoginCta');
    if (txLoginCta) {
      txLoginCta.addEventListener('click', () => handlers.toAuth('login'));
    }
    return;
  }

  appRoot.innerHTML = `
    ${renderNavBar()}

    <section class="transactions-page">
      <h2>${t('new_tx_heading')}</h2>
      <p class="subtitle">${t('new_tx_subtitle_auth')}</p>

      <div class="tx-form">
        <div class="field">
          <label for="txType">${t('type_label')}</label>
          <select id="txType">
            <option value="deposit">${t('deposit')}</option>
            <option value="withdrawal">${t('withdrawal')}</option>
          </select>
        </div>

        <div class="field">
          <label for="txAmount">${t('amount_label')}</label>
          <input id="txAmount" type="number" min="0.01" step="0.01" placeholder="e.g. 25.00">
        </div>

        <div class="field">
          <label for="txDesc">${t('description_label')}</label>
          <input id="txDesc" type="text" placeholder="e.g. Grocery Store, Paycheck, etc.">
        </div>

        <button type="button" class="submit-btn" id="txSubmit">${t('submit_transaction')}</button>
        <div class="tx-status" id="txStatus"></div>

        <p style="margin-top:15px; font-size:13px; color:var(--muted);">
          ${t('current_balance', { balance: '$' + acc.balance })} | ${t('debt_text', { debt: '$' + acc.debt })}
        </p>
      </div>
    </section>

    <footer class="home-footer">
      © 2025 Continental Bank. All rights reserved.<br />
      <a href="#">${t('privacy')}</a> | <a href="#">${t('terms')}</a>
    </footer>
  `;

  wireNav(handlers);

  const txSubmit = $('txSubmit');
  const txStatus = $('txStatus');

  if (txSubmit && txStatus) {
    txSubmit.addEventListener('click', () => {
      const type = $('txType').value;
      const amountRaw = $('txAmount').value;
      const desc = $('txDesc').value.trim();
      const amount = parseFloat(amountRaw);

      txStatus.textContent = '';
      txStatus.className = 'tx-status';

      if (!amount || amount <= 0) {
        txStatus.textContent = t('enter_valid_amount');
        txStatus.classList.add('error');
        return;
      }

      if (!desc) {
        txStatus.textContent = t('enter_description');
        txStatus.classList.add('error');
        return;
      }

      let accData = getAccount() || { balance: 0, debt: 0, transactions: [] };

      if (type === 'withdrawal' && amount > accData.balance) {
        txStatus.textContent = t('insufficient_balance');
        txStatus.classList.add('error');
        return;
      }

      if (type === 'deposit') {
        accData.balance += amount;
      } else {
        accData.balance -= amount;
      }

      accData.transactions.unshift({
        type,
        amount: Number(amount.toFixed(2)),
        description: desc
      });

      if (accData.transactions.length > 20) {
        accData.transactions = accData.transactions.slice(0, 20);
      }

      saveAccount(accData);

      txStatus.textContent = t('tx_success');
      txStatus.classList.add('success');

      $('txAmount').value = '';
      $('txDesc').value = '';
    });
  }
}
