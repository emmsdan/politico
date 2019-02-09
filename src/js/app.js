const db = new Dexie('Z4bxNb1F');
// Declare tables, IDs and indexes
db.version(1).stores({
  Z4bxNb1F: '++id, uf, ul, uo, ue, up, ui, isL'
});
localStorage.setItem('secure_page', '[ "dashboard", "office"]');

window.addEventListener('load', (event) => {
  slider();
  modal();
  toggleActiveBar();
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

loadFile();
