interface offsetI { top: number, left: number }

export const scrollAnimation = () => {
  const animItems: NodeListOf<HTMLElement> = document.querySelectorAll('.animate');
  if (animItems.length > 0) {
    let activeAnimationsCount = 0;
    let scrollHandlerActive = true;

    window.addEventListener('scroll', animOnScroll);

    function animOnScroll(): void {
      if (!scrollHandlerActive) return;
      requestAnimationFrame(() => {

        for (let index = 0; index < animItems.length; index++) {
          const animItem: HTMLElement = animItems[index];

          // Если анимация уже активирована, пропускаем
          if (animItem.classList.contains('animate-active')) continue;

          const animItemHeight: number = animItem.offsetHeight;
          const animItemOffset: offsetI = offset(animItem);
          const animStart: number = 4;

          let animItemPoint: number = window.innerHeight - animItemHeight / animStart;
          if (animItemHeight > window.innerHeight) {
            animItemPoint = window.innerHeight - window.innerHeight / animStart;
          }

          if ((pageYOffset > animItemOffset.top - animItemPoint) && pageYOffset < (animItemOffset.top + animItemHeight)) {
            animItem.classList.add('animate-active');
            activeAnimationsCount++;

            if (animItem.querySelectorAll('li')) {
              setTimeout(() => {
                const listItems: NodeListOf<HTMLElement> = animItem.querySelectorAll('[data-animate-child]');
                listItems.forEach(item => {
                  item.style.transition = 'all .3s ease-in'
                })
              }, 1000)
            }
          }
        }

        // Если все анимации активированы, отключаем обработчик скролла
        if (activeAnimationsCount === animItems.length) {
          window.removeEventListener('scroll', animOnScroll);
          scrollHandlerActive = false;
        }
      });
    }

    function offset(el: HTMLElement): offsetI {
      const rect: DOMRect = el.getBoundingClientRect();
      const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }

    setTimeout((): void => {
      animOnScroll();
    }, 200);
  }
}