window.focus();

window.addEventListener('blur', () => {
  window.location.reload();
});