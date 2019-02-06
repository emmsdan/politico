const getUserInfo = () => {
  const info = JSON.parse(localStorage.get('user'));
  document.querySelector('#p-name').innerHTML= `${info.uf} ${info.ul}`;
  document.querySelector('#p-email').innerHTML= `${info.ue}`;
  document.querySelector('#p-phone').innerHTML= `${info.up}`;
}
getUserInfo()
