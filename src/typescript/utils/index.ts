export const scrollLock = {
  lock() {
    // Получаем ширину скроллбара
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth + 1}px`;
    document.body.classList.add('no-scroll');
  },

  unlock() {
    document.body.style.paddingRight = '';
    document.body.classList.remove('no-scroll');
  }
};