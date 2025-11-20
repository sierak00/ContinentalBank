import { clearCurrentUser, initTheme } from './core.js';
import { renderAccountsPage } from './accounts.js';
import { renderAuthPage } from './auth.js';
import { renderExchangePage } from './exchange.js';
import { renderHomePage } from './navbar-home.js';
import { renderTransactionsPage } from './transactions.js';

const navHandlers = {
  toHome: () => {},
  toAccounts: () => {},
  toExchange: () => {},
  toTransactions: () => {},
  toAuth: () => {},
  onLogout: () => {}
};

navHandlers.toHome = () => renderHomePage(navHandlers);
navHandlers.toAccounts = () => renderAccountsPage(navHandlers);
navHandlers.toExchange = () => renderExchangePage(navHandlers);
navHandlers.toTransactions = () => renderTransactionsPage(navHandlers);
navHandlers.toAuth = (tab = 'login') => renderAuthPage(tab, navHandlers);
navHandlers.onLogout = () => {
  clearCurrentUser();
  navHandlers.toHome();
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme (applies saved preference) before rendering UI.
  initTheme();
  navHandlers.toHome();
});
