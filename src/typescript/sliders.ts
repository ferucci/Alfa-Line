
import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';

export const sliders = () => {

  const optionsProducts: SwiperOptions = {
    slidesPerView: "auto",
    loop: true,
    centeredSlides: false,
    spaceBetween: 15,
    grabCursor: true,
    resistance: true, // Сопротивление при прокрутке
    resistanceRatio: 0.85,

    breakpoints: {
      1400: {
        slidesPerView: 4
      }
    }
  }
  new Swiper('.products-slider', optionsProducts)

  const optionsSpheres: SwiperOptions = {
    slidesPerView: "auto",
    loop: false,
    centeredSlides: false,
    spaceBetween: 15,
    grabCursor: true,
    resistance: true,
    resistanceRatio: 0.85,
  }

  new Swiper('.spheres-slider', optionsSpheres);

  const optionsDocs: SwiperOptions = {
    slidesPerView: "auto",
    loop: false,
    centeredSlides: false,
    spaceBetween: 15,
    grabCursor: true,
    resistance: true,
    resistanceRatio: 0.85,

    on: {
      sliderMove: () => {
        document.body.style.userSelect = 'none';
      },
      touchEnd: () => {
        document.body.style.userSelect = 'auto';
      },
    },

  }

  new Swiper('.docs-slider', optionsDocs);
}