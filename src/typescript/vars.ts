export const vars = {
  dropdownItems: document.querySelectorAll<HTMLElement>('li[data-dropdown] > .dropdown__title'),
  burger: document.querySelector<HTMLButtonElement>('.header__burger'),
  nav: document.querySelector<HTMLElement>('.header__nav'),
  overlay: document.querySelector<HTMLElement>('.overlay'),
  downloadCertificateBtns: document.querySelectorAll('.download-button')
}