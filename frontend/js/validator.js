const isPassword = (eventNode, password) => {
  const input = document.querySelector(`#${eventNode.id}`);
  const isPassword = document.querySelector(`#${password.id || password}`);
  if (input.value === null || input.value.length < 8) {
    input.classList.add('invalid');
    input.classList.remove('valid');

    isPassword.classList.add('invalid');
    isPassword.classList.remove('valid');
      return false;
  }

  input.classList.add('valid');
  input.classList.remove('invalid');
};

const isPasswordConfirm = (eventNode, password) => {
  const input = document.querySelector(`#${eventNode.id}`);
  const isPassword = document.querySelector(`#${password}`);
  if (input.value === null || input.value.length < 8 || isPassword.value !== input.value) {
    input.classList.add('invalid');
    input.classList.remove('valid');

    return false;
  }
  input.classList.add('valid');
  input.classList.remove('invalid');
};

const validateEmail = (eventNode) => {
  const input = document.querySelector(`#${eventNode.id}`);
  if (input.value === null || !isEmail(input.value)) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  }

  input.classList.add('valid');
  input.classList.remove('invalid');

}

const validateName = (eventNode) => {
  const input = document.querySelector(`#${eventNode.id}`);
  if (input.value === null || !isName(input.value)) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  }

  input.classList.add('valid');
  input.classList.remove('invalid');
}

const validatePhone = (eventNode) => {
  const input = document.querySelector(`#${eventNode.id}`);
  if (input.value === null || !isInt(input.value) || input.value.length < 7) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  }

  input.classList.add('valid');
  input.classList.remove('invalid');
}

const isAddress = (address) => {
  return address ? (/^[a-zAZ0-9,.-\s]+$/i.test(address)) : false;
}

const isName = (name) => {
  return name ? (/^[A-Za-z\s]+$/.test(name)) : false;
}
const isEmail = (email) => {
  return email ?  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,90})+$/.test(email) : false;
}
const isInt = (string) => {
  return string ? (/^[0-9]+$/i.test(string)) : false;
}

const validatePhoneOREmail = (eventNode) => {
  const input = document.querySelector(`#${eventNode.id}`);
  if (input.value === null || (!isInt(input.value) && !isEmail(input.value))) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  }

  input.classList.add('valid');
  input.classList.remove('invalid');
}