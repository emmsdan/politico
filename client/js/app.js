window.focus();

window.addEventListener('blur', () => {
  window.location.reload();
});

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
  const target = document.querySelector('[data-modal]');
  if (target) {
    const modal = document.querySelector(target.getAttribute('data-modal'));
    const trigger = document.querySelector("[data-modal]");
    const closeButton = document.querySelector(".close");

      function toggleModal() {
          modal.classList.toggle("show");
      }

      const closeOnClick = (event) => {
          if (event.target === modal) {
              toggleModal();
          }
      }
      trigger.addEventListener("click", toggleModal);
      closeButton.addEventListener("click", toggleModal);
      window.addEventListener("click", closeOnClick);
  }
}

/**
 * load file into page
 */
const loadFile = ()  => {
  const dataAdd = document.querySelectorAll('[data-add-file]');
  console.log (dataAdd)
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
