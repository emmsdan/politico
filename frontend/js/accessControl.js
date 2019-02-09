const apiNavigations = (path) => {
  const paths = {
    "signup": '/auth/signup',
    "register": '/auth/signup',
    "login": '/auth/login',
    "signin": '/auth/login',
    "reset": '/auth/reset',
    "reset_password": '/auth/reset',
    "allparty": '/parties',
    "party": '/parties',
    "create_party": '/parties',
    "allOffices": '/offices',
    "office": '/offices',
  }
  return baseUrl + paths[path];
}

/**
 * select sign in/ sign up page
 * @returns string
 */
const toggleLoginForm = () => {
  const addressbar = window.location.href.split('.html?page=')[1] || window.location.href.split('/')[1];
  if (addressbar.startsWith('sign')) {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      if (form.id.toLowerCase() !== addressbar.toLowerCase()) {
        form.innerHTML = 'po';
        form.classList.add('hide');
      } else {
        form.classList.remove('hide');
      }
    });
  }
};

/**
 * check if user is logged in
 */
async function isLoggedIn() {
  const isLoggedIn = JSON.parse(localStorage.getItem('user'));
  if (!isLoggedIn && securePage().secure) {
    redirect('/access.html?page=signin');
  }
  if (isLoggedIn && securePage().sPage) {
    alert('Welcome to Politico');
  }
}
/**
 *
 * @param {string} url
 */
const redirect = (url) => {
  window.location.href = url;
}

const securePage = () => {
  const pages = JSON.parse(localStorage.getItem('secure_page'));
  let secure = false;
  let sPage = '';
  pages.forEach(page => {
    if (currentPage().includes(page)) {
      sPage = page;
      secure = true;
      return;
    }
  });
  return { secure, sPage };
}

const currentPage = (path = 'full') => {
  const href = window.location.href;
  if (path === 'file') {
    let ihref = window.location.href.split('/');
    return ihref[ihref.length - 1]
  }
  return href;
}

const throwError = (message, placeholder) => {
  document.querySelector(placeholder).innerHTML = message;
}
/**
 * initialize all the necessary functions
 */
const init = () => {
  isLoggedIn();
  toggleLoginForm();
};

init();
