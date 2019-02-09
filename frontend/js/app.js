localStorage.setItem('secure_page', '[ "user_dashboard", "admin_dashboard", "office"]');
const baseUrl = '/api/v1';

window.addEventListener('load', (event) => {
  slider();
  modal();
  toggleActiveBar();
  document.querySelector('.load-overlay').style= 'display: none;'
});

// display random images (as sliders)
const slider = () => {
  const sliderImage = document.querySelector('.slider img');
  if (!sliderImage) return;
  const images = [
    './img/nigerians-are-you-ready-to-Vote-in-2015-YouTube.png',
    './img/nigeria.png', './img/voting.jpg',
    './img/nigeriavote.jpg', './img/Voters-Card.jpg',
    './img/nigerians-are-you-ready-to-Vote-in-2015-YouTube.png'
  ];
  let nextImg = 0;
  const randomImage = (image) => {
    sliderImage.src = image;
    sliderImage.alt = image;
  };
  setInterval(() => {
    nextImg += 1;
    randomImage(images[nextImg]);
    if (nextImg === (images.length - 1)) {
      nextImg = 0;
    }
  }, 5000);
};

/**
 *
 */
const modal = () => {
  var button = document.querySelectorAll("[data-target]");
  // eslint-disable-next-line no-restricted-syntax
  for (let btn of button) {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(`#${btn.getAttribute('data-target')}`);
      modal.style.display = "flex";
      modal.querySelectorAll('.close').forEach((elem, ind) => {
        elem.addEventListener('click', () => {
          modal.style.display = "none";
        });
      });
      window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
      });
      function closeModal () {
        modal.style.display = "none";
      }
    });
  }
};

/**
 * toast bar for notification
 */

const toast = (message = 'null') => {
  let toastMessage;
  const toastBox = document.querySelector('.toast');
  // eslint-disable-next-line no-cond-assign
  if (toastMessage = document.querySelectorAll('[data-toast]')) {
    toastMessage.forEach((tMsg) => {
      tMsg.addEventListener('click', () => toast(tMsg.getAttribute('data-toast')));
    });
  }
  const toastMsg = (msg) => {
    toastBox.innerHTML = msg;
    toastBox.classList.toggle('show');
    setTimeout(() => {
      toastBox.classList.remove('show');
    }, 5000);
  };
  if (message !== 'null') {
    toastMsg(message);
  }
};

/**
 * show & close mobile navigation
 * Responsive mobile nav. bar
*/
const openNavBar = (menu = null) => {
  document.querySelector('header nav ul').classList.toggle('show');
};


/**
 * load file into page
 */
const loadFile = () => {
  const dataAdd = document.querySelectorAll('[data-add-file]');
  dataAdd.forEach((files) => {
    fetch(files.getAttribute('data-add-file'))
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        }
        throw Error('file does not exist');
      })
      .then((response) => {
        files.removeAttribute('data-add-file');
        files.innerHTML = response;
        return true;
      })
      .catch((error) => {
        files.setAttribute('data-error', error);
      });
  });
};

const toggleActiveBar = () => {
  const navBar = document.querySelectorAll('nav[role="navigation"] ul li');
  navBar.forEach((li) => {
    const a = li.querySelector('a');
    const link = a.pathname.split('/');
    const href = window.location.href.split('/');

    if (window.location.href.includes(link[(link.length - 1)]) || (link[(link.length - 1)] === href[href.length - 1].split('?')[0])) {
      li.className = 'active';
    }
  });
}


const sendServerRequest = (data, viewer='app-view') => {
  const { method, url } = data;
  const formData = {}
  Object.keys(data['formData']).forEach((key) => {
    formData[key] = data['formData'][key];
  })
  return fetch(apiNavigations(url), {
    method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'x-access-token': localStorage.getItem('token') || 'null'
    },
    body: JSON.stringify(formData)
  })
    .then((serverResponse) => {
      return serverResponse.json()
        .then((jsonResponse) => {
          if (jsonResponse.error) {
            throw Error(jsonResponse.error);
          }
          if (!['signup', 'signin'].includes(url)) {
            if (jsonResponse.data[0].hqaddress) {
              redirect(`party.html?id=${jsonResponse.data[0].id}`)
            } 
            throwError(jsonResponse.data[0].message, '.response');
            toast(jsonResponse.data[0].message);
            return;
          }
          localStorage.setItem('token', jsonResponse.data[0].token)
          localStorage.setItem('user', JSON.stringify({
            token: jsonResponse.data[0].token,
            id: 1,
            uf: jsonResponse.data[0].user.firstName,
            ul: jsonResponse.data[0].user.lastName,
            uo: jsonResponse.data[0].user.otherName,
            ue: jsonResponse.data[0].user.email,
            up: jsonResponse.data[0].user.phoneNumber,
            ui: jsonResponse.data[0].user.id,
            isL: true
          }));
          if (jsonResponse.data[0].user.isAdmin) {
            return redirect('/pages/admin_dashboard.html');
          }
          redirect('/pages/user_dashboard.html');
        })
    })
    .catch((serverError) => {
      console.log (serverError)
      throwError(serverError, '.response');
      toast(serverError);
    })
}

const uploadImage = (event, placeholder='party_logoUrl') => {
  const imageFile = document.querySelector(`#${event.id}`).files[0];
  var formData  = new FormData();
  formData.append('logoUrl', imageFile, imageFile.name);
  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then((response) => {
    return response.json().then((resp) => {
      document.querySelector(`#${placeholder}`).value = resp.url;
    })
  }).catch((response) => {
    console.log(response)
 })
};

const searchStudent = (e) => {
  let searchData = document.querySelector(".search-data");;
  let filter;
  let ul;
      let li;
      let h; let span; let a;
      let i;
  filter = searchData.value.toUpperCase();
  ul = document.querySelector(".viewStudentsList");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      span = li[i].getElementsByTagName("span")[0];
      h = li[i].getElementsByTagName("h5")[0];
      a = li[i].getElementsByTagName("a")[0];
      if (span.innerHTML.toUpperCase().indexOf(filter) > -1 ||
       h.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style = "display: block !important; color: #f00;";
      } else {
          li[i].style = "display: none !important";

      }
  }
}

const serverRequestArray = (url) => {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let ruu = (xhttp.responseText);
  return ruu;
    }
    return false;
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

const searchResult = (e, ty='tr') => {
  let searchData = document.querySelector(".search-data");;
  let filter;
  let ul;
      let li;
      let h; let span; let a;
      let i;
  filter = searchData.value.toUpperCase();
  ul = document.querySelector(".searchList");
    li = ul.getElementsByTagName(ty);
  for (i = 0; i < li.length; i++){
      span = li[i].querySelectorAll("small")[0];
      h = li[i].querySelectorAll("h5")[0];
     // a = li[i].querySelectorAll("td")[0];
      if (span.innerHTML.toUpperCase().indexOf(filter) > -1 ||
       h.innerHTML.toUpperCase().indexOf(filter) > -1 /*  ||
        /* a.innerHTML.toUpperCase().indexOf(filter) > -1 */) {
          li[i].classList.add('show')
          li[i].classList.add('red-text')
          li[i].classList.remove('hide')

        } else {
        li[i].classList.add('hide')
        li[i].classList.remove('red-text')
        li[i].classList.remove('show')
      }
  }
}

const sendServer = (event) => {

}

const submitForm = (event) => {
  const formFields = document.querySelectorAll(`#${event.id} input`);
  let field = { method : event.method, url : event.getAttribute('action') };
  let $tp ='.response';
  let $error = false;
  let inputs = {};
  formFields.forEach((input) => {
    if(input.classList.contains('invalid')){
      input.focus();
      throwError('correct this field', `.error[for='${input.id}'`);
      $error = true;
    }
    inputs[input.id.split('_')[1]] = input.value;
  });
  if ($error) return false;
  field.formData = inputs;
  sendServerRequest(field, $tp);
  return false;
}

loadFile();
