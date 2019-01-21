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
  const images = ['./img/nigerians-are-you-ready-to-Vote-in-2015-YouTube.png', './img/nigeria.png',  './img/voting.jpg', './img/nigerians-are-you-ready-to-Vote-in-2015-YouTube.png'];
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

const modal = () => {
  const target = document.querySelector('[data-modal]').getAttribute('data-modal');
  const modal = document.querySelector(target);
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
