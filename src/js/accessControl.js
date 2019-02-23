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
  const isLoggedIn = await db.Z4bxNb1F.get({ isL: 'true' });
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
