
import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';

export const sliders = () => {

  function initProductsSlider() {
    const sliderEl = document.querySelector<HTMLElement>('.products-slider');
    if (!sliderEl) return;

    const swiperWrapper = sliderEl.querySelector('.swiper-wrapper');
    const slides = swiperWrapper?.querySelectorAll<HTMLElement>('.swiper-slide');
    if (!slides || slides.length === 0) return;

    const optionsProducts: SwiperOptions = {
      slidesPerView: "auto",
      centeredSlides: false,
      spaceBetween: 15,
      grabCursor: true,
      resistance: true,
      resistanceRatio: 0.85,
      breakpoints: {
        1400: {
          slidesPerView: 4
        }
      }
    };

    // Функция для проверки и обновления loop
    const updateLoopMode = (swiperInstance: Swiper) => {
      const currentSlidesPerView = swiperInstance.params.slidesPerView === 'auto' ?
        Math.ceil(swiperInstance.width / (slides[0].clientWidth + 15)) :
        Number(swiperInstance.params.slidesPerView);

      const minSlidesForLoop = currentSlidesPerView * 2;
      const shouldLoop = slides.length >= minSlidesForLoop;

      if (swiperInstance.params.loop !== shouldLoop) {
        swiperInstance.destroy();
        const newOptions = { ...optionsProducts, loop: shouldLoop };
        Object.assign(swiperInstance, new Swiper(sliderEl, newOptions));
      }
    };

    // Инициализация с первоначальной проверкой
    const initialSlidesPerView = window.innerWidth >= 1400 ? 4 : 'auto';
    const minSlidesForLoop = initialSlidesPerView === 'auto' ?
      Math.ceil(sliderEl.clientWidth / (slides[0].clientWidth + 15)) * 2 :
      initialSlidesPerView * 2;

    const shouldLoopInitially = slides.length >= minSlidesForLoop;
    const swiper = new Swiper(sliderEl, { ...optionsProducts, loop: shouldLoopInitially });

    // Обработчик ресайза
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        updateLoopMode(swiper);
      }, 100);
    });
  }

  initProductsSlider();


  // .. ------------ ..

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

  // .. ------------ ..

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


  const initProductSlider = () => {

    const imagesThumbnails: NodeListOf<HTMLImageElement> = document.querySelectorAll('#product-thumbnails > img')
    imagesThumbnails.forEach((img: HTMLImageElement) => {
      img.addEventListener('click', changeImage)
    })

    function changeImage(e: Event): void {
      const thumbnail = e.target as HTMLImageElement | null;
      if (!thumbnail || thumbnail.tagName !== 'IMG') return;

      // Находим основное изображение
      const mainImg: HTMLImageElement | null = document.getElementById('zoomedImg') as HTMLImageElement;
      if (!mainImg) return;
      if (!mainImg) return;

      mainImg.src = thumbnail.src;

      // Убираем активный класс у всех миниатюр
      imagesThumbnails.forEach(img => {
        img.classList.remove('active');
      });

      // Добавляем активный класс к выбранной миниатюре
      thumbnail.classList.add('active');
    }

  }

  initProductSlider()


}