// interface CountryData {
//   dialCode: string;
//   iso2: string;
//   name: string;
// }

interface FormData {
  name: string;
  phone: string;
  message: string;
}

interface FormManagerOptions {
  formId: string;
  modalFormId?: string;
  successPopupId: string;
  formPopupId?: string;
}

export class FormManager {
  private phoneInput: HTMLInputElement | null;
  private phoneInputs: Map<HTMLInputElement, any> = new Map(); // Хранит инстансы iti для каждого поля
  private nameError: HTMLElement | null;
  private phoneError: HTMLElement | null;
  private privacyError: HTMLElement | null;
  private iti: any;
  private isNameDirty: boolean = false;
  private isPhoneDirty: boolean = false;
  private isPrivacyDirty: boolean = false;
  private options: FormManagerOptions;

  constructor(options: FormManagerOptions) {
    this.options = options;

    // Инициализация элементов основной формы
    this.phoneInput = document.querySelector<HTMLInputElement>("#phone");
    this.nameError = document.getElementById("nameError");
    this.phoneError = document.getElementById("phoneError");
    this.privacyError = document.getElementById("privacyError");

    // Инициализация модальных окон
    this.initPopups();
    this.initForms();

    // Инициализация intl-tel-input если есть поле телефона
    if (this.phoneInput) {
      this.initPhoneInput();
    }
  }

  private initPhoneInput(): void {
    this.iti = (window as any).intlTelInput(this.phoneInput, {
      initialCountry: "ru",
      separateDialCode: true,
      preferredCountries: ["ru", "us", "gb", "de", "fr"],
      nationalMode: false
    });

    // Скрываем ошибки при загрузке
    if (this.nameError) this.nameError.style.display = "none";
    if (this.phoneError) this.phoneError.style.display = "none";
    if (this.privacyError) this.privacyError.style.display = "none";
  }

  private initPopups(): void {
    const { formPopupId, successPopupId } = this.options;

    // Обработчики закрытия попапов
    const closeFormBtn = document.getElementById("closeFormPopupBtn");
    const closeSuccessBtn = document.getElementById("closePopupBtn");

    if (closeFormBtn && formPopupId) {
      closeFormBtn.addEventListener("click", () => this.hidePopup(formPopupId));
    }

    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", () => this.hidePopup(successPopupId));
    }

    // Обработчики клика по оверлею
    if (formPopupId) {
      const formPopup = document.getElementById(formPopupId);
      if (formPopup) {
        formPopup.addEventListener("click", (e) => {
          if (e.target === formPopup) this.hidePopup(formPopupId);
        });
      }
    }

    const successPopup = document.getElementById(successPopupId);
    if (successPopup) {
      successPopup.addEventListener("click", (e) => {
        if (e.target === successPopup) this.hidePopup(successPopupId);
      });
    }
  }

  private initForms(): void {
    // Основная форма
    const mainForm = document.getElementById(this.options.formId);
    if (mainForm) {
      this.setupForm(mainForm as HTMLFormElement, true);
    }

    // Модальная форма
    if (this.options.modalFormId) {
      const modalForm = document.getElementById(this.options.modalFormId);
      if (modalForm) {
        this.setupForm(modalForm as HTMLFormElement, false);
      }
    }
  }

  private setupForm(form: HTMLFormElement, hasPrivacy: boolean): void {
    form.addEventListener("submit", (e) => this.handleSubmit(e, form, hasPrivacy));

    // Инициализация полей имени
    const nameInput = form.querySelector<HTMLInputElement>("input[name='name'], #name");
    if (nameInput) {
      nameInput.addEventListener("focus", () => this.isNameDirty = true);
      nameInput.addEventListener("input", () => {
        if (this.isNameDirty) this.validateName(nameInput);
      });
    }

    // Инициализация полей телефона с intl-tel-input
    const phoneInput = form.querySelector<HTMLInputElement>("input[type='tel']");
    if (phoneInput && !this.phoneInputs.has(phoneInput)) {
      const iti = (window as any).intlTelInput(phoneInput, {
        initialCountry: "ru",
        separateDialCode: true,
        preferredCountries: ["ru", "us", "gb", "de", "fr"],
        nationalMode: false
      });
      this.phoneInputs.set(phoneInput, iti);

      phoneInput.addEventListener("focus", () => this.isPhoneDirty = true);
      phoneInput.addEventListener("input", (e) => this.handlePhoneInput(e as Event));
      phoneInput.addEventListener("blur", () => {
        if (this.isPhoneDirty) this.validatePhoneNumber(phoneInput.value, phoneInput);
      });
    }

    // Инициализация чекбокса приватности (только для основной формы)
    if (hasPrivacy) {
      const privacyCheck = form.querySelector<HTMLInputElement>("input[name='privacy'], #privacyCheck");
      if (privacyCheck) {
        privacyCheck.addEventListener("change", () => {
          this.isPrivacyDirty = true;
          this.validatePrivacy(privacyCheck);
        });
      }
    }
  }

  private handleSubmit(e: Event, form: HTMLFormElement, hasPrivacy: boolean): void {
    e.preventDefault();

    this.isNameDirty = true;
    this.isPhoneDirty = true;
    this.isPrivacyDirty = hasPrivacy;

    if (this.validateForm(form, hasPrivacy)) {
      const formData = this.getFormData(form);
      console.log("Данные формы:", formData);

      if (this.options.formPopupId && form.id === this.options.modalFormId) {
        this.hidePopup(this.options.formPopupId);
      }

      this.showPopup(this.options.successPopupId);

      // Изменено: передаем только form
      this.resetForm(form);
    }
  }

  private formatPhoneNumber(value: string): string {
    if (!value) return "";

    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    const parts = [
      limited.slice(0, 3),
      limited.slice(3, 6),
      limited.slice(6, 8),
      limited.slice(8, 10)
    ].filter(part => part.length > 0);

    if (parts.length === 0) return "";

    let formatted = "";
    if (parts[0]) formatted += `(${parts[0]}`;
    if (parts[1]) formatted += `) ${parts[1]}`;
    if (parts[2]) formatted += `-${parts[2]}`;
    if (parts[3]) formatted += `-${parts[3]}`;

    return formatted;
  }

  private handlePhoneInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    const inputValue = target.value;

    const formatted = this.formatPhoneNumber(inputValue);
    target.value = formatted;

    const diff = formatted.length - inputValue.length;
    const newPosition = cursorPosition + diff;
    target.setSelectionRange(newPosition, newPosition);

    if (this.isPhoneDirty) {
      this.validatePhoneNumber(formatted, target); // Передаем target
    }
  }

  private validatePhoneNumber(phoneNumber: string, inputElement: HTMLInputElement): boolean {
    const digits = phoneNumber.replace(/\D/g, "");
    const isValid = digits.length === 10;

    // Находим ближайшее сообщение об ошибке относительно inputElement
    const errorElement = inputElement.nextElementSibling as HTMLElement;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.style.display = (this.isPhoneDirty && !isValid) ? "block" : "none";
    }

    // Устанавливаем стиль для input
    inputElement.style.outline = (this.isPhoneDirty && !isValid) ?
      '1px solid rgba(208, 23, 27, 1)' : '1px solid rgba(26, 198, 60, 1)';

    return isValid;
  }

  private validateName(nameInput: HTMLInputElement): boolean {
    const isValid = !!nameInput.value.trim();

    if (this.nameError) {
      this.nameError.style.display = (this.isNameDirty && !isValid) ? "block" : "none";
    }

    if (nameInput) {
      nameInput.style.outline = (this.isNameDirty && !isValid) ?
        '1px solid rgba(208, 23, 27, 1)' : '1px solid rgba(26, 198, 60, 1)';
    }

    return isValid;
  }

  private validatePrivacy(privacyCheck: HTMLInputElement): boolean {
    const isValid = privacyCheck.checked;

    if (this.privacyError) {
      this.privacyError.style.display = (this.isPrivacyDirty && !isValid) ? "block" : "none";
    }

    return isValid;
  }

  private validateForm(form: HTMLFormElement, hasPrivacy: boolean): boolean {
    const nameInput = form.querySelector<HTMLInputElement>("input[name='name'], #name");
    const phoneInput = form.querySelector<HTMLInputElement>("input[type='tel']");
    let isValid = true;

    // Валидация имени
    if (nameInput) {
      const nameIsValid = this.validateName(nameInput);
      isValid = isValid && nameIsValid;
    }

    // Валидация телефона
    if (phoneInput) {
      const phoneIsValid = this.validatePhoneNumber(phoneInput.value, phoneInput);
      isValid = isValid && phoneIsValid;
    }

    // Валидация чекбокса (только если есть в форме)
    if (hasPrivacy) {
      const privacyCheck = form.querySelector<HTMLInputElement>("input[name='privacy'], #privacyCheck");
      if (privacyCheck) {
        const privacyIsValid = this.validatePrivacy(privacyCheck);
        isValid = isValid && privacyIsValid;
      }
    }

    return isValid;
  }

  private getFormData(form: HTMLFormElement): FormData {
    console.log(form)
    const nameInput = form.querySelector("input[name='name'], #name") as HTMLInputElement;
    const phoneInput = form.querySelector("input[type='tel']") as HTMLInputElement;
    const messageInput = form.querySelector("textarea[name='message'], #message") as HTMLTextAreaElement;

    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    let phoneFormatted = phoneDigits;

    if (this.iti) {
      const countryData = this.iti.getSelectedCountryData();
      phoneFormatted = `+${countryData.dialCode} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 8)}-${phoneDigits.slice(8, 10)}`;
    }

    return {
      name: nameInput?.value.trim() || "",
      phone: phoneFormatted,
      message: messageInput?.value.trim() || ""
    };
  }

  private resetForm(form: HTMLFormElement): void {
    form.reset();

    // Сбрасываем все поля телефона в форме
    const phoneInputs = form.querySelectorAll<HTMLInputElement>("input[type='tel'], .phone-input");
    phoneInputs.forEach(input => {
      if (this.phoneInputs.has(input)) {
        this.phoneInputs.get(input).setNumber("");
      }
      input.style.outline = '';
    });

    // Скрываем ошибки
    const errorMessages = form.querySelectorAll<HTMLElement>(".error-message");
    errorMessages.forEach(msg => msg.style.display = "none");

    this.isNameDirty = false;
    this.isPhoneDirty = false;
    this.isPrivacyDirty = false;
  }

  public showPopup(id: string): void {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = 'flex';
  }

  public hidePopup(id: string): void {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = 'none';
  }
}