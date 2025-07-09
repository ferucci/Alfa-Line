
// Определяем тип для объекта изображения
type GalleryImage = {
  src: string;
  alt: string;
};

import { scrollLock } from './utils';

export const Gallery = () => {

  // Получаем элементы с проверкой на null
  const galleryItems: NodeListOf<HTMLElement> = document.querySelectorAll('.certificate-card__image');
  const galleryOverlay: HTMLElement | null = document.getElementById('galleryOverlay');
  const galleryImage: HTMLImageElement | null = document.getElementById('galleryImage') as HTMLImageElement;
  const galleryPrev: HTMLButtonElement | null = document.getElementById('galleryPrev') as HTMLButtonElement;
  const galleryNext: HTMLButtonElement | null = document.getElementById('galleryNext') as HTMLButtonElement;
  const galleryClose: HTMLButtonElement | null = document.getElementById('galleryClose') as HTMLButtonElement;

  // Проверяем, что все необходимые элементы существуют
  if (!galleryOverlay || !galleryImage || !galleryPrev || !galleryNext || !galleryClose) {
    return;
  }

  let currentIndex: number = 0;
  const images: GalleryImage[] = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
      src: img?.src ?? '',
      alt: img?.alt ?? ''
    };
  }).filter(img => img.src); // Фильтруем изображения без src

  // Функция обновления изображения с анимацией
  function updateGalleryImage(direction?: 'prev' | 'next'): void {
    if (!galleryImage) return;

    galleryImage.classList.remove('slide-active');

    if (direction === 'next') {
      galleryImage.classList.add('slide-next');
    } else if (direction === 'prev') {
      galleryImage.classList.add('slide-prev');
    }

    setTimeout(() => {
      if (!galleryImage || !images[currentIndex]) return;

      galleryImage.src = images[currentIndex].src;
      galleryImage.alt = images[currentIndex].alt;

      galleryImage.classList.remove('slide-next', 'slide-prev');
      galleryImage.classList.add('slide-active');
    }, 300);
  }

  // Обработчики событий с проверкой элементов
  function setupEventListeners(): void {
    // Открытие галереи
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e: MouseEvent) => {
        if (!galleryOverlay || !galleryImage) return;

        const target = e.target as HTMLElement;
        if (target.closest('.download-button')) return;

        currentIndex = index;
        galleryImage.classList.add('slide-active');
        galleryImage.src = images[currentIndex].src;
        galleryImage.alt = images[currentIndex].alt;
        galleryOverlay.style.display = 'flex';
        scrollLock.lock();
      });
    });

    // Добавляем обработчики hover для половин изображения
    if (galleryImage) {
      galleryImage.addEventListener('mousemove', (e: MouseEvent) => {
        if (!galleryPrev || !galleryNext) return;

        const rect = galleryImage.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const halfWidth = rect.width / 2;

        // Левая половина - показываем кнопку "назад"
        if (mouseX < halfWidth) {
          galleryPrev.style.opacity = '1';
          galleryNext.style.opacity = '0.1';
        }
        // Правая половина - показываем кнопку "вперед"
        else {
          galleryPrev.style.opacity = '0.1';
          galleryNext.style.opacity = '1';
        }
      });

      // При уходе курсора - возвращаем прозрачность
      galleryImage.addEventListener('mouseleave', () => {
        if (galleryPrev && galleryNext) {
          galleryPrev.style.opacity = '0.1';
          galleryNext.style.opacity = '0.1';
        }
      });
    }

    // Обработчик клика по изображению
    galleryImage?.addEventListener('click', (e: MouseEvent) => {
      if (!galleryImage) return;

      // Получаем координаты клика относительно изображения
      const rect = galleryImage.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const imageWidth = rect.width;

      // Определяем, в какой половине был клик
      if (clickX < imageWidth / 2) {
        // Левая половина - предыдущий слайд
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGalleryImage('prev');
      } else {
        // Правая половина - следующий слайд
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateGalleryImage('next');
      }
    });

    // Навигация
    galleryPrev?.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateGalleryImage('prev');
    });

    galleryNext?.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      updateGalleryImage('next');
    });

    // Закрытие галереи
    galleryClose?.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      closeGallery();
    });

    galleryOverlay?.addEventListener('click', () => {
      closeGallery();
    });

    // Навигация с клавиатуры
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!galleryOverlay || galleryOverlay.style.display !== 'flex') return;

      switch (e.key) {
        case 'Escape':
          closeGallery();
          break;
        case 'ArrowLeft':
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          updateGalleryImage('prev');
          break;
        case 'ArrowRight':
          currentIndex = (currentIndex + 1) % images.length;
          updateGalleryImage('next');
          break;
      }
    });
  }

  function closeGallery(): void {
    if (!galleryOverlay) return;

    galleryOverlay.style.display = 'none';
    scrollLock.unlock();
  }
  setupEventListeners();
}