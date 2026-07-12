const views = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to your account',
    submitLabel: 'Log in',
    showPassword: true,
    showEmail: true,
    secondaryLink: true,
    switchText: 'Don\'t have an account?',
    switchAction: 'Create one',
    switchTarget: 'register',
    secondaryTarget: 'forgot-password',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Join CarzzyApps today',
    submitLabel: 'Create account',
    showPassword: true,
    showEmail: true,
    secondaryLink: false,
    switchText: 'Already have an account?',
    switchAction: 'Log in',
    switchTarget: 'login',
  },
  'forgot-password': {
    title: 'Reset your password',
    subtitle: 'Enter your email to receive a reset link',
    submitLabel: 'Send reset link',
    showPassword: false,
    showEmail: true,
    secondaryLink: false,
    switchText: 'Remembered your password?',
    switchAction: 'Log in',
    switchTarget: 'login',
  },
};

const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const submitButton = document.getElementById('submit-button');
const secondaryLinks = document.getElementById('secondary-links');
const switchText = document.getElementById('switch-text');
const statusBox = document.getElementById('status-box');
const emailField = document.getElementById('email-field');
const passwordField = document.getElementById('password-field');
const googleButton = document.getElementById('google-button');

function setView(viewName) {
  const view = views[viewName] || views.login;
  formTitle.textContent = view.title;
  formSubtitle.textContent = view.subtitle;
  submitButton.textContent = view.submitLabel;

  emailField.style.display = view.showEmail ? 'grid' : 'none';
  passwordField.style.display = view.showPassword ? 'grid' : 'none';
  secondaryLinks.style.display = view.secondaryLink ? 'block' : 'none';

  switchText.innerHTML = `${view.switchText} <a href="#${view.switchTarget}" data-view="${view.switchTarget}">${view.switchAction}</a>`;
  statusBox.textContent = '';
}

function getCurrentView() {
  const hash = window.location.hash.replace('#', '');
  return views[hash] ? hash : 'login';
}

async function handleSubmit(event) {
  event.preventDefault();
  const viewName = getCurrentView();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  statusBox.textContent = 'Working…';

  try {
    if (!email) {
      throw new Error('Please enter your email address.');
    }

    if (viewName !== 'forgot-password' && !password) {
      throw new Error('Please enter your password.');
    }

    if (viewName === 'login') {
      await auth.signInWithEmailAndPassword(email, password);
      statusBox.textContent = 'Login successful.';
    } else if (viewName === 'register') {
      await auth.createUserWithEmailAndPassword(email, password);
      statusBox.textContent = 'Account created successfully.';
    } else if (viewName === 'forgot-password') {
      await auth.sendPasswordResetEmail(email);
      statusBox.textContent = 'Password reset email sent.';
    }
  } catch (error) {
    statusBox.textContent = error.message || 'Unable to complete the request.';
  }
}

async function handleGoogleLogin() {
  statusBox.textContent = 'Signing in with Google…';

  try {
    await auth.signInWithPopup(provider);
    statusBox.textContent = 'Google sign-in successful.';
  } catch (error) {
    statusBox.textContent = error.message || 'Google sign-in failed.';
  }
}

authForm.addEventListener('submit', handleSubmit);
googleButton.addEventListener('click', handleGoogleLogin);
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-view]');
  if (!link) {
    return;
  }
  event.preventDefault();
  const nextView = link.getAttribute('data-view');
  window.location.hash = nextView;
  setView(nextView);
});

window.addEventListener('hashchange', () => {
  setView(getCurrentView());
});

setView(getCurrentView());
