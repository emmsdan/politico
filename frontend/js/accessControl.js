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
  if (!isLoggedIn && securePage()) {
    redirect('/access.html?page=signin');
  }
}

/**
 * initialize all the necessary functions
 */
const init = () => {
  isLoggedIn();
  toggleLoginForm();
};

init();