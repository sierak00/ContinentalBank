import { appRoot, $, getFirstName } from './core.js';
import { renderNavBar, wireNav } from './navbar-home.js';

export function renderExchangePage(handlers) {
  const firstName = getFirstName();

  appRoot.innerHTML = `
    ${renderNavBar()}

    <section class="exchange-section">
      <h2>Exchange Rates</h2>
      <p class="exchange-subtitle">Hello, ${firstName}. Here are the latest rates for USD, EUR, and GBP (approximate).</p>

      <div class="rate-grid">
        <div class="rate-card">
          <div class="rate-title">US Dollar (USD)</div>
          <div class="rate-main">1 USD ≈ 0.86 EUR</div>
          <div class="rate-sub">
            • 1 USD ≈ 0.76 GBP<br>
            • 100 USD ≈ 86 EUR<br>
            • 100 USD ≈ 76 GBP
          </div>
        </div>

        <div class="rate-card">
          <div class="rate-title">Euro (EUR)</div>
          <div class="rate-main">1 EUR ≈ 1.16 USD</div>
          <div class="rate-sub">
            • 1 EUR ≈ 0.88 GBP<br>
            • 100 EUR ≈ 116 USD<br>
            • 100 EUR ≈ 88 GBP
          </div>
        </div>

        <div class="rate-card">
          <div class="rate-title">British Pound (GBP)</div>
          <div class="rate-main">1 GBP ≈ 1.31 USD</div>
          <div class="rate-sub">
            • 1 GBP ≈ 1.13 EUR<br>
            • 100 GBP ≈ 131 USD<br>
            • 100 GBP ≈ 113 EUR
          </div>
        </div>
      </div>

      <div class="exchange-calc">
        <h3>Currency Calculator</h3>
        <div class="tx-form">
          <div class="field">
            <label for="exFrom">From</label>
            <select id="exFrom">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div class="field">
            <label for="exTo">To</label>
            <select id="exTo">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div class="field">
            <label for="exAmount">Amount</label>
            <input id="exAmount" type="number" min="0.01" step="0.01" placeholder="e.g. 10">
          </div>
          <button type="button" class="submit-btn" id="exConvert">Convert</button>
          <p id="exResult"></p>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      © 2025 Continental Bank. All rights reserved.<br />
      <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a>
    </footer>
  `;

  wireNav(handlers);

  const rateToUSD = {
    USD: 1,
    EUR: 1.16,
    GBP: 1.31
  };

  const exFrom = $('exFrom');
  const exTo = $('exTo');
  const exAmount = $('exAmount');
  const exConvert = $('exConvert');
  const exResult = $('exResult');

  if (exConvert) {
    exConvert.addEventListener('click', () => {
      const from = exFrom.value;
      const to = exTo.value;
      const amount = parseFloat(exAmount.value);

      if (!amount || amount <= 0) {
        exResult.textContent = 'Please enter a valid amount greater than 0.';
        exResult.style.color = '#c62828';
        return;
      }

      if (from === to) {
        exResult.textContent = `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;
        exResult.style.color = '#0a1f44';
        return;
      }

      const fromRate = rateToUSD[from];
      const toRate = rateToUSD[to];
      const inUSD = amount * fromRate;
      const converted = inUSD / toRate;

      exResult.textContent = `${amount.toFixed(2)} ${from} ≈ ${converted.toFixed(2)} ${to}`;
      exResult.style.color = '#0a1f44';
    });
  }
}
