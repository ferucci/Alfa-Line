export class DropdownManager {
  private items: NodeListOf<HTMLElement>;

  constructor(items: NodeListOf<HTMLElement>) {
    this.items = items;
    this.init();
  }

  private init(): void {
    this.items.forEach((item) => {
      item.addEventListener('click', this.handleItemClick.bind(this));
    });
  }

  private handleItemClick(event: Event): void {
    event.preventDefault();

    const target = event.currentTarget as HTMLElement;
    const dropdownId = target.parentElement?.getAttribute('data-dropdown');

    if (!dropdownId) return;

    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    if (!target.classList.contains('active')) {
      this.closeAllActiveItems();
    }

    this.toggleItem(target, dropdown);
  }

  private toggleItem(target: HTMLElement, dropdown: HTMLElement): void {
    target.classList.toggle('active');
    dropdown.classList.toggle('show');
    const paddingY = 30;
    // Плавное раскрытие/закрытие с динамической высотой
    if (dropdown.classList.contains('show')) {
      dropdown.style.maxHeight = `${dropdown.scrollHeight + paddingY}px`;
    } else {
      dropdown.style.maxHeight = '0';
    }
  }

  private closeAllActiveItems(): void {
    const activeItems = document.querySelectorAll<HTMLElement>('.dropdown__title.active');

    activeItems.forEach((item) => {
      item.classList.remove('active');
      const parent = item.parentElement;
      const dropdown = parent?.querySelector<HTMLElement>('.dropdown__item');

      if (dropdown) {
        dropdown.classList.remove('show');
        dropdown.style.maxHeight = '0';
      }
    });
  }
}