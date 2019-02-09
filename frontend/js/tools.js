/**
 *
 * @param {string} url
 *
const redirect = (url) => {
  window.location.href = url;
}

const securePage = () => {
  const pages = JSON.parse(localStorage.getItem('secure_page'));
  let secure = false;
  pages.forEach(page => {
    if (currentPage().includes(page)) {
      secure = true;
      return;
    }
  });
  return secure;
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
*/
console.log('passed')
