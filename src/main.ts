document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector<HTMLButtonElement>('.header__burger');
  const nav = document.querySelector<HTMLElement>('.header__nav');
  const overlay = document.querySelector<HTMLElement>('.overlay');

  if (!burger || !nav || !overlay) {
    console.error('Не найдены необходимые элементы меню');
    return;
  }

  burger.addEventListener('click', function (this: HTMLButtonElement) {
    const isOpening = !this.classList.contains('active');

    this.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');

    // Плавное управление оверлеем
    if (isOpening) {
      overlay.style.display = 'block';
      setTimeout(() => overlay.classList.add('active'), 10);
    } else {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (!overlay.classList.contains('active')) {
          overlay.style.display = 'none';
        }
      }, 300); // Должно совпадать с длительностью transition
    }
  });

  // Закрытие при клике на оверлей
  overlay.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    setTimeout(() => overlay.style.display = 'none', 300);
  });
});