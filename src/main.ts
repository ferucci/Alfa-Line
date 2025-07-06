import { burgerModal } from './typescript/burger';
import { downloadImage } from './typescript/downloadDocs';
import { DropdownManager } from './typescript/dropdown';
import { Gallery } from './typescript/gallery';
import { sliders } from './typescript/sliders';
import { form } from './typescript/validForm';
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

  form();




});
