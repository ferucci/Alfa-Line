interface CountryData {
  dialCode: string;
  iso2: string;
  name: string;
}

interface FormData {
  name: string;
  phone: string;
  message: string;
}

export const form = (): void => {
  // Элементы DOM
  const phoneInput = document.querySelector<HTMLInputElement>("#phone");
  const contactForm = document.getElementById("contactForm") as HTMLFormElement;
  const nameError = document.getElementById("nameError") as HTMLElement;
  const phoneError = document.getElementById("phoneError") as HTMLElement;
  const privacyError = document.getElementById("privacyError") as HTMLElement;
  const nameInput = document.getElementById("name") as HTMLInputElement;
  const privacyCheck = document.getElementById("privacyCheck") as HTMLInputElement;

  // Проверка существования элементов
  if (!phoneInput || !contactForm || !nameError || !phoneError || !privacyError || !nameInput || !privacyCheck) {
    console.error("Не удалось найти необходимые элементы DOM");
    return;
  }

  // Скрываем ошибки при загрузке
  nameError.style.display = "none";
  phoneError.style.display = "none";
  privacyError.style.display = "none";

  // Флаги для отслеживания взаимодействия
  let isNameDirty = false;
  let isPhoneDirty = false;
  let isPrivacyDirty = false;

  // Инициализация intl-tel-input
  const iti = (window as any).intlTelInput(phoneInput, {
    initialCountry: "ru",
    separateDialCode: true,
    preferredCountries: ["ru", "us", "gb", "de", "fr"],
    // utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    nationalMode: false
  }) as {
    getSelectedCountryData: () => CountryData;
    setNumber: (number: string) => void;
    destroy: () => void;
  };

  /**
   * Форматирует номер телефона в формате (999) 999-99-99
   */
  const formatPhoneNumber = (value: string): string => {
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
  };

  /**
   * Обработчик ввода телефона
   */
  const handlePhoneInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    const inputValue = target.value;

    const formatted = formatPhoneNumber(inputValue);
    target.value = formatted;

    const diff = formatted.length - inputValue.length;
    const newPosition = cursorPosition + diff;
    target.setSelectionRange(newPosition, newPosition);

    if (isPhoneDirty) {
      validatePhoneNumber(formatted);
    }
  };

  /**
   * Валидация номера телефона
   */
  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const digits = phoneNumber.replace(/\D/g, "");
    const isValid = digits.length === 10;
    phoneError.style.display = (isPhoneDirty && !isValid) ? "block" : "none";
    return isValid;
  };

  /**
   * Валидация имени
   */
  const validateName = (): boolean => {
    const isValid = !!nameInput.value.trim();
    nameError.style.display = (isNameDirty && !isValid) ? "block" : "none";
    return isValid;
  };

  /**
   * Валидация чекбокса
   */
  const validatePrivacy = (): boolean => {
    const isValid = privacyCheck.checked;
    privacyError.style.display = (isPrivacyDirty && !isValid) ? "block" : "none";
    return isValid;
  };

  /**
   * Валидация всей формы
   */
  const validateForm = (): boolean => {
    return validateName() && validatePhoneNumber(phoneInput.value) && validatePrivacy();
  };

  /**
   * Получение данных формы
   */
  const getFormData = (): FormData => {
    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    const countryData = iti.getSelectedCountryData();

    return {
      name: nameInput.value.trim(),
      phone: `+${countryData.dialCode} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 8)}-${phoneDigits.slice(8, 10)}`,
      message: (document.getElementById("message") as HTMLTextAreaElement).value.trim()
    };
  };

  /**
   * Сброс формы
   */
  const resetForm = (): void => {
    contactForm.reset();
    iti.setNumber("");
    nameError.style.display = "none";
    phoneError.style.display = "none";
    privacyError.style.display = "none";
    isNameDirty = false;
    isPhoneDirty = false;
    isPrivacyDirty = false;
  };

  // Обработчики событий
  nameInput.addEventListener("focus", () => {
    isNameDirty = true;
  });

  nameInput.addEventListener("input", () => {
    if (isNameDirty) validateName();
  });

  phoneInput.addEventListener("focus", () => {
    isPhoneDirty = true;
  });

  phoneInput.addEventListener("input", handlePhoneInput);

  privacyCheck.addEventListener("change", () => {
    isPrivacyDirty = true;
    validatePrivacy();
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Помечаем все поля как "грязные" при отправке
    isNameDirty = true;
    isPhoneDirty = true;
    isPrivacyDirty = true;

    if (validateForm()) {
      const formData = getFormData();
      console.log("Данные формы:", formData);
      alert("Форма успешно отправлена!");
      resetForm();
    }
  });

  // Валидация при потере фокуса
  phoneInput.addEventListener("blur", () => {
    if (isPhoneDirty) validatePhoneNumber(phoneInput.value);
  });
};