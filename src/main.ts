import { animation } from './typescript/animation';
import { BackgroundCanvas } from './typescript/animation/canvas';
import { burgerModal } from './typescript/burger';
import { downloadImage } from './typescript/downloadDocs';
import { DropdownManager } from './typescript/dropdown';
import { Gallery } from './typescript/gallery';
import { sliders } from './typescript/sliders';
import { FormManager } from './typescript/validForm';
import { vars } from './typescript/vars';

document.addEventListener('DOMContentLoaded', () => {
  const { dropdownItems, downloadCertificateBtns } = vars;

  downloadCertificateBtns?.forEach(btn => {
    btn.addEventListener('click', downloadImage);
  });

  burgerModal()

  sliders()
  Gallery()

  new DropdownManager(dropdownItems);

  // Инициализация FormManager
  const formManager = new FormManager({
    formId: "contactForm", // ID основной формы
    modalFormId: "modalForm", // ID формы в модальном окне
    successPopupId: "successPopup", // ID попапа успеха
    formPopupId: "formPopup" // ID попапа с формой
  });

  // открытие формы в модалке
  document.querySelectorAll('.header__btn, .mobile-btn').forEach(btn => {
    btn.addEventListener('click', () => formManager.showPopup("formPopup"));
  });

  animation()

  new BackgroundCanvas('bgCanvas');

});
