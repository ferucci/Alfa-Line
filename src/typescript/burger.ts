import { scrollLock } from "./utils";
import { vars } from "./vars";

const { burger, nav, overlay } = vars;

export const burgerModal = () => {
  if (!burger || !nav || !overlay) {
    console.error('Не найдены необходимые элементы меню');
    return;
  }


  burger.addEventListener('click', function (this: HTMLButtonElement) {
    const isOpening = !this.classList.contains('active');

    this.classList.toggle('active');
    nav.classList.toggle('active');

    // Плавное управление оверлеем
    if (isOpening) {
      scrollLock.lock();
      overlay.style.display = 'block';
      setTimeout(() => overlay.classList.add('active'), 10);
    } else {
      scrollLock.unlock();
      overlay.classList.remove('active');
      setTimeout(() => {
        if (!overlay.classList.contains('active')) {
          overlay.style.display = 'none';
        }
      }, 300);
    }
  });

  // Закрытие при клике на оверлей
  overlay.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    scrollLock.unlock();
    setTimeout(() => overlay.style.display = 'none', 300);
  });
}