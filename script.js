'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const navLogo = document.querySelector('#logo');
const operations = document.querySelector('.operations__tab-container');
const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const lazyImg = document.querySelectorAll('img[data-src]');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const rightArr = document.querySelector('.slider__btn--right');
const leftArr = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////////////////////
// functions
///////////////////////////////////////////////////////////////////////////////////
// hover links
nav.addEventListener('mouseover', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    // console.log(nav.children);
    navLinks.forEach(link => {
      if (link !== e.target) {
        link.style.opacity = 0.5;
      }
    });
    navLogo.style.opacity = 0.5;
  }
});
nav.addEventListener('mouseout', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    // console.log(nav.children);
    navLinks.forEach(link => {
      if (link !== e.target) {
        link.style.opacity = 1;
      }
    });
    navLogo.style.opacity = 1;
  }
});
// smooth scroll
nav.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const targetID = e.target.getAttribute('href').slice(1);
    console.log(targetID);
    const targetSection = document.getElementById(targetID);
    console.log(targetSection);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
});
// on click
operations.addEventListener('click', e => {
  e.preventDefault();
  const target = e.target.closest('.operations__tab');
  console.log(target);

  if (target) {
    [...operations.children].forEach(btn => {
      const dataTap = btn.getAttribute('data-tab');
      const content = document.querySelector(
        `.operations__content--${dataTap}`
      );
      if (target === btn) {
        btn.classList.add('operations__tab--active');
        content.style.display = 'grid';
      } else {
        btn.classList.remove('operations__tab--active');
        content.style.display = 'none';
      }
    });
  }
});
// header intersection
const headerHeight = nav.getBoundingClientRect().height;

const haederObs = function (enteries) {
  const [entry] = enteries;
  // console.log(entry);
  if (entry.isIntersecting) nav.classList.remove('sticky');
  else nav.classList.add('sticky');
};
const headerObserver = new IntersectionObserver(haederObs, {
  root: null,
  treshold: 0,
  rootMargin: `-${headerHeight}px`,
});

headerObserver.observe(header);
// lazy loading
const imgObs = function (enteries, observer) {
  // console.log(entry, entry.target);
  enteries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // console.log('trigger');
    // load actual img
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(imgObs, {
  root: null,
  treshold: 0,
  rootMargin: '200px',
});

lazyImg.forEach(img => imgObserver.observe(img));

// hidden sections and revealing
const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const secObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  secObserver.observe(section);
  section.classList.add('section--hidden');
});
// slider
let currSlide = 0;
const initSlider = function () {
  currentSlide(currSlide);
  createDots();
  updateDots();
};
const currentSlide = function (index) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - index)}%)`;
  });
  if (dots.querySelector('.dots__dot')) updateDots();
};
const createDots = function () {
  const dotsNum = slides.length;
  for (let i = 0; i < dotsNum; i++) {
    dots.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  }
};
const updateDots = function () {
  slides.forEach((_, i) => {
    dots
      .querySelector(`[data-slide="${i}"]`)
      ?.classList.remove('dots__dot--active');
  });
  dots
    .querySelector(`[data-slide="${currSlide}"]`)
    .classList.add('dots__dot--active');
};
const nextSlide = function () {
  if (currSlide === slides.length - 1) currSlide = 0;
  else currSlide++;
  currentSlide(currSlide);
};
const prevSlide = function () {
  if (currSlide === 0) currSlide = slides.length - 1;
  else currSlide--;
  currentSlide(currSlide);
};
initSlider();
// slider event handlers
rightArr.addEventListener('click', () => {
  clearInterval(sliderLoop);
  nextSlide();
});
leftArr.addEventListener('click', () => {
  clearInterval(sliderLoop);
  prevSlide();
});
window.addEventListener('keyup', e => {
  clearInterval(sliderLoop);
  if (e.key === 'ArrowRight') nextSlide();
  else if (e.key === 'ArrowLeft') prevSlide();
});
dots.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    currSlide = e.target.dataset.slide;
    clearInterval(sliderLoop);
    currentSlide(currSlide);
  }
});
// slider looping
const sliderLoop = setInterval(nextSlide, 2500);
