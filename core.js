export const appRoot = document.getElementById('app');

export function $(id) {
  return document.getElementById(id);
}

const ACCOUNT_PREFIX = 'continental_account_';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const THEME_KEY = 'theme_preference';
const LANG_KEY = 'lang_preference';

function accountKey(email) {
  return `${ACCOUNT_PREFIX}${encodeURIComponent(email.toLowerCase())}`;
}

export function getAccount() {
  const user = getCurrentUser();
  if (!user || !user.email) return null;
  const raw = localStorage.getItem(accountKey(user.email));
  return raw ? JSON.parse(raw) : null;
}

export function saveAccount(data) {
  const user = getCurrentUser();
  if (!user || !user.email) return;
  localStorage.setItem(accountKey(user.email), JSON.stringify(data));
}

export function initAccountIfMissing() {
  const user = getCurrentUser();
  if (!user || !user.email) return;
  const key = accountKey(user.email);
  if (!localStorage.getItem(key)) {
    // Initialize a fresh account for new users with zeroed values.
    const starter = {
      balance: 0,
      debt: 0,
      transactions: []
    };
    localStorage.setItem(key, JSON.stringify(starter));
  }
}

// Create an empty account for a specific email regardless of current user.
export function createAccountForEmail(email) {
  if (!email) return;
  const key = accountKey(email);
  if (!localStorage.getItem(key)) {
    const starter = {
      balance: 0,
      debt: 0,
      transactions: []
    };
    localStorage.setItem(key, JSON.stringify(starter));
  }
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function getFirstName() {
  const user = getCurrentUser();
  if (!user || !user.name) return 'Customer';
  return user.name.split(' ')[0];
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Theme helpers: persist user's preference in localStorage and apply it to the document.
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

export function saveTheme(theme) {
  if (!theme) return;
  localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme(theme) {
  if (!theme) return;
  try {
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // ignore when running in non-browser environments
  }
}

export function toggleTheme() {
  const current = getSavedTheme() || document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme(next);
  return next;
}

export function initTheme() {
  const saved = getSavedTheme();
  if (saved) {
    applyTheme(saved);
    return saved;
  }

  // fall back to prefers-color-scheme if available
  try {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    applyTheme(defaultTheme);
    return defaultTheme;
  } catch (e) {
    applyTheme('light');
    return 'light';
  }
}

// Language / i18n helpers
const TRANSLATIONS = {
  en: {
    home: 'Home',
    accounts: 'Accounts',
    exchange: 'Exchange',
    transactions: 'Transactions',
    contact: 'Contact',
    login: 'Login',
    logout: 'Logout',
    hero_heading: 'Your Future, Secured.',
    hero_paragraph: 'Welcome, {name}. At Continental Bank, we provide modern financial solutions that empower your growth, safeguard your assets, and shape a secure tomorrow.',
    hero_login: 'Log In',
    personal_banking_title: 'Personal Banking',
    personal_banking_desc: 'Manage your money easily with flexible accounts and digital banking options built for you.',
    business_solutions: 'Business Solutions',
    business_solutions_desc: 'From small startups to enterprises, we help businesses grow securely with smart financing.',
    investment_plans: 'Investment Plans',
    investment_plans_desc: 'Grow your wealth confidently with expert-guided investment and savings programs.',
    our_story_title: 'Our Story',
    our_story_paragraph: 'Founded with a simple belief — banking should be clear, fair, and built around people. From a small local team to a bank trusted by thousands, our focus remains the same: helping you secure your financial future with modern, human-centered services.',
    our_story_muted: 'We combine decades of industry experience with intuitive digital tools to make managing money effortless.',
    contact_title: 'Contact Us',
    contact_sub: "Have a question or feedback? Send us a short message and we'll get back to you soon.",
    contact_name_placeholder: 'Your name',
    contact_email_placeholder: 'Email address',
    contact_message_placeholder: 'Message',
    send: 'Send',
    contact_saved: 'Thanks — your message was saved locally.',
    contact_error: 'Unable to save message.',
    contact_complete: 'Please complete all fields.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    register_tab: 'Register',
    login_tab: 'Login',
    dont_have_account: 'Don\'t have an account? Register',
    already_have_account: 'Already have an account? Login',
    registration_success: 'Registration successful! You can now log in.',
    passwords_no_match: 'Passwords do not match.',
    email_registered: 'Email already registered.',
    invalid_credentials: 'Invalid email or password.',
    new_tx_heading: 'New Transaction',
    new_tx_subtitle_auth: 'Create a deposit or withdrawal. This will update your balance and appear in your recent transactions.',
    new_tx_subtitle_anon: 'Please log in to create a deposit or withdrawal.',
    log_in_button: 'Log In',
    type_label: 'Type',
    amount_label: 'Amount (USD)',
    description_label: 'Description',
    submit_transaction: 'Submit Transaction',
    current_balance: 'Current balance: {balance}',
    debt_text: 'Debt: {debt}',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    insufficient_balance: 'Insufficient balance for this withdrawal.',
    enter_valid_amount: 'Please enter a valid amount greater than 0.',
    enter_description: 'Please enter a description.',
    tx_success: 'Transaction successful! It is now visible in the Accounts page.'
  },
  al: {
    home: 'Kryefaqja',
    accounts: 'Llogaritë',
    exchange: 'Këmbyes',
    transactions: 'Transaksionet',
    contact: 'Kontakt',
    login: 'Hyrje',
    logout: 'Dil',
    hero_heading: 'E Ardhmja Juaj, e Sigurt.',
    hero_paragraph: 'Mirësevini, {name}. Në Continental Bank ofrojmë zgjidhje financiare moderne që fuqizojnë rritjen tuaj, mbrojnë pasuritë tuaja dhe formësojnë një të ardhme të sigurt.',
    hero_login: 'Hyrje',
    personal_banking_title: 'Bankim Personal',
    personal_banking_desc: 'Menaxhoni paratë tuaja lehtësisht me llogari fleksibile dhe opsione digjitale.',
    business_solutions: 'Zgjidhje Biznesi',
    business_solutions_desc: 'Nga fillestaret te ndërmarrjet, ne ndihmojmë bizneset të rriten sigurt me financime të mençura.',
    investment_plans: 'Planet e Investimeve',
    investment_plans_desc: 'Rritni pasurinë tuaj me programe investimi dhe kursimi.',
    our_story_title: 'Historia Jonë',
    our_story_paragraph: 'Themeluar me një besim të thjeshtë — bankimi duhet të jetë i qartë, i drejtë dhe i ndërtuar rreth njerëzve. Nga një ekip i vogël lokal në një bankë e besuar nga mijëra, fokusi ynë mbetet i njëjtë: t\'ju ndihmojmë të siguroni të ardhmen tuaj financiare.',
    our_story_muted: 'Ne kombinojmë dekada përvoje me mjete dixhitale intuitive për të lehtësuar menaxhimin e parave.',
    contact_title: 'Na Kontaktoni',
    contact_sub: 'Keni pyetje ose komente? Na dërgoni një mesazh të shkurtër dhe ne do t\'ju kthehemi së shpejti.',
    contact_name_placeholder: 'Emri juaj',
    contact_email_placeholder: 'Adresa e email-it',
    contact_message_placeholder: 'Mesazhi',
    send: 'Dërgo',
    contact_saved: 'Faleminderit — mesazhi juaj u ruajt lokalisht.',
    contact_error: 'Nuk mund të ruaj mesazhin.',
    contact_complete: 'Ju lutemi plotësoni të gjitha fushat.',
    privacy: 'Politika e Privatësisë',
    terms: 'Kushtet e Përdorimit',
    register_tab: 'Regjistrohu',
    login_tab: 'Hyrje',
    dont_have_account: 'Nuk keni llogari? Regjistrohu',
    already_have_account: 'Keni llogari? Hyni',
    registration_success: 'Regjistrimi u krye! Tani mund të hyni.',
    passwords_no_match: 'Fjalëkalimet nuk përputhen.',
    email_registered: 'Email-i është regjistruar më parë.',
    invalid_credentials: 'Email ose fjalëkalim i pavlefshëm.',
    new_tx_heading: 'Transaksion i Ri',
    new_tx_subtitle_auth: 'Krijoni depozitë ose tërheqje. Kjo do të përditësojë bilancin tuaj dhe do të shfaqet në transaksionet tuaja të fundit.',
    new_tx_subtitle_anon: 'Ju lutemi identifikohuni për të krijuar depozitë ose tërheqje.',
    log_in_button: 'Hyrje',
    type_label: 'Lloji',
    amount_label: 'Shuma (USD)',
    description_label: 'Përshkrimi',
    submit_transaction: 'Dërgo Transaksionin',
    current_balance: 'Bilanci aktual: {balance}',
    debt_text: 'Borxhi: {debt}',
    deposit: 'Depozitë',
    withdrawal: 'Tërheqje',
    insufficient_balance: 'Bilanc i pamjaftueshëm për këtë tërheqje.',
    enter_valid_amount: 'Ju lutemi vendosni një shumë të vlefshme më të madhe se 0.',
    enter_description: 'Ju lutemi vendosni një përshkrim.',
    tx_success: 'Transaksioni u krye me sukses! Tani shfaqet në faqen Llogaritë.'
  }
};

export function getSavedLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

export function saveLang(lang) {
  if (!lang) return;
  localStorage.setItem(LANG_KEY, lang);
  try { document.documentElement.lang = lang; } catch (e) {}
}

export function applyLang(lang) {
  if (!lang) return;
  try { document.documentElement.lang = lang; } catch (e) {}
}

export function toggleLang() {
  const current = getSavedLang() || 'en';
  const next = current === 'en' ? 'al' : 'en';
  saveLang(next);
  applyLang(next);
  return next;
}

export function initLang() {
  const saved = getSavedLang();
  applyLang(saved);
  return saved;
}

export function t(key, vars = {}) {
  const lang = getSavedLang() || 'en';
  const entry = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['en'][key] || '';
  let out = entry;
  Object.keys(vars).forEach(k => {
    out = out.replace(new RegExp(`\\{\\s*${k}\\s*\\}`, 'g'), vars[k]);
  });
  return out;
}
