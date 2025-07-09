export const animation = () => {

  const animItems: NodeListOf<HTMLElement> = document.querySelectorAll('.animate');
  if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);

    function animOnScroll(): void {
      for (let index = 0; index < animItems.length; index++) {
        const animItem: HTMLElement = animItems[index];
        const animItemHeight: number = animItem.offsetHeight;
        const animItemOffset: { top: number, left: number } = offset(animItem);
        const animStart: number = 4;

        let animItemPoint: number = window.innerHeight - animItemHeight / animStart;
        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }

        if ((pageYOffset > animItemOffset.top - animItemPoint) && pageYOffset < (animItemOffset.top + animItemHeight)) {
          animItem.classList.add('animate-active');
        }
        // else {
        //   if (!animItem.classList.contains('animate-no-hide')) {
        //     animItem.classList.remove('animate-active');
        //   }
        // }
      }
    }

    function offset(el: HTMLElement): { top: number, left: number } {
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