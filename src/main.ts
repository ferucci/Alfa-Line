import { scrollAnimation } from './typescript/animation';
import { BackgroundCanvas } from './typescript/animation/canvas';
import { burgerModal } from './typescript/burger';
import { downloadImage } from './typescript/downloadDocs';
import { FAQDropdownManager } from './typescript/dropdown';
import { filterVacancies } from './typescript/filter';
import { Gallery } from './typescript/gallery';
import { sliders } from './typescript/sliders';
import { FormsManager } from './typescript/validForm';
import { vars } from './typescript/vars';

document.addEventListener('DOMContentLoaded', () => {
  const { dropdownItems, downloadCertificateBtns } = vars;

  downloadCertificateBtns?.forEach(btn => {
    btn.addEventListener('click', downloadImage);
  });

  burgerModal()

  // Все слайдеры
  sliders()

  // Слайдер галлереи сертификатов
  Gallery()

  // Анимация появления элементов при скролле
  scrollAnimation()

  // Фильтрация careers
  filterVacancies();

  // FAQ
  new FAQDropdownManager(dropdownItems);

  // Треугольники на фоне
  new BackgroundCanvas('bgCanvas');

  // Инициализация FormsManager ( обе формы )
  const formManager = new FormsManager({
    formId: "contactForm", // ID основной формы
    modalFormId: "modalForm", // ID формы в модальном окне
    successPopupId: "successPopup", // ID попапа успеха
    formPopupId: "formPopup" // ID попапа с формой
  });

  document.querySelectorAll('.header__btn, .mobile-btn').forEach(btn => {
    btn.addEventListener('click', () => formManager.showPopup("formPopup"));
  });

});
