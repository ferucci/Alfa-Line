import { scrollAnimation } from './animation';
import { BackgroundCanvas } from './animation/canvas';
import { burgerModal } from './burger';
import { downloadImage } from './downloadDocs';
import { FAQDropdownManager } from './dropdown';
import { filterVacancies } from './filter';
import { Gallery } from './gallery';
import { sliders } from './sliders';
import { FormsManager } from './validForm';
import { vars } from './vars';

export const waitingForLoading = () => {

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



}