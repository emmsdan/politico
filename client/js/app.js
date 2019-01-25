window.addEventListener('load', (event) => {
  slider();
  modal();
});

// display random images (as sliders)
const slider = () => {
  const sliderImage = document.querySelector('.slider img');
  if (!sliderImage) return;
  const images = ['./img/nigerians-are-you-ready-to-Vote-in-2015-YouTube.png', './img/nigeria.png',  './img/voting.jpg', './img/nigeriavote.jpg', './img/Voters-Card.jpg', './img/nigerians-are-you-ready-to-Vote-in-2015-YouTube.png'];
  let nextImg = 0;
  const randomImage = (image) => {
    sliderImage.src = image;
    sliderImage.alt = image;
  }
  setInterval(()=> {
    nextImg += 1;
    randomImage(images[nextImg])
    if (nextImg === (images.length - 1)) {
      nextImg = 0
    }
  }, 5000)
}

/**
 *
 */
const modal = () => {
  const button = document.querySelectorAll('[data-target]');
  for (let btn of button) {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(`#${btn.getAttribute('data-target')}`);
      console.log (btn)
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
}

/**
 * toast bar for notification
 */

const toast = (message = 'null') => {
  let toastMessage;
  const toastBox = document.querySelector('.toast');
  if (toastMessage = document.querySelectorAll(`[data-toast]`)){
    for (let tMsg of toastMessage){
      tMsg.addEventListener('click', () => {
        return toast(tMsg.getAttribute('data-toast'));
      });
    }
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
}

/**
 * show & close mobile navigation
 * Responsive mobile nav. bar
*/
const openNavBar = (menu = null) => {
  document.querySelector('header nav ul').classList.toggle ('show');
}


/**
 * load file into page
 */
const loadFile = ()  => {
  const dataAdd = document.querySelectorAll('[data-add-file]');
  for (let files of dataAdd){
    fetch (files.getAttribute('data-add-file'))
    .then ( (response) => {
      if (response.status === 200){

        return response.text();
      }
      throw Error ('file does not exist');
    })
    .then ( (response) => {
      files.removeAttribute('data-add-file');
        return files.innerHTML = response;
    })
    .catch ((error) => {
      files.setAttribute('data-error', error);
      console.log (error);
    })
  }
};

loadFile();
