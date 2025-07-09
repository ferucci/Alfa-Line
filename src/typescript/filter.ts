export const filterVacancies = () => {

  type Office = 'omsk' | 'moscow' | 'spb';
  type Specialty = string;
  type Vacancy = string;

  type SpecialtyMap = {
    [key in Office]: Specialty[];
  };

  type VacancyData = {
    [key in Office]: {
      [key: Specialty]: Vacancy[];
    };
  };

  // DOM elements
  const select1: HTMLElement | null = document.getElementById('select1');
  const select2: HTMLElement | null = document.getElementById('select2');
  const vacanciesDiv: HTMLElement | null = document.getElementById('vacancies');

  // Data structures
  const specialtiesByOffice: SpecialtyMap = {
    omsk: ['General Director', 'Manager', 'Engineer'],
    moscow: ['Director', 'Analyst', 'Programmer'],
    spb: ['Team Lead', 'Designer', 'Tester']
  };

  const vacanciesData: VacancyData = {
    omsk: {
      'General Director': ['Vacancy 1 Omsk', 'Vacancy 2 Omsk'],
      'Manager': ['Vacancy 3 Omsk'],
      'Engineer': ['Vacancy 4 Omsk']
    },
    moscow: {
      'Director': ['Vacancy 1 Moscow'],
      'Analyst': ['Vacancy 2 Moscow'],
      'Programmer': ['Vacancy 3 Moscow']
    },
    spb: {
      'Team Lead': ['Vacancy 1 SPb'],
      'Designer': ['Vacancy 2 SPb'],
      'Tester': ['Vacancy 3 SPb']
    }
  };

  // State variables
  let selectedOffice: Office | null = null;
  let selectedSpecialty: Specialty | null = null;

  // Собираем все вакансии в единый массив для рандомного показа
  function getAllVacancies(): Array<{ city: Office, specialty: Specialty, vacancy: Vacancy }> {
    const result: Array<{ city: Office, specialty: Specialty, vacancy: Vacancy }> = [];
    (Object.keys(vacanciesData) as Office[]).forEach((city) => {
      Object.entries(vacanciesData[city]).forEach(([specialty, vacancies]) => {
        vacancies.forEach(vacancy => {
          result.push({ city, specialty, vacancy });
        });
      });
    });
    return result;
  }

  // Функция для перемешивания массива (Fisher-Yates)
  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  // Показывает список вакансий (универсально)
  function showVacancies(vacancies: Array<{ city: Office, specialty: Specialty, vacancy: Vacancy }>): void {
    if (!vacanciesDiv) return;
    vacanciesDiv.innerHTML = '';
    vacancies.forEach(({ city, specialty, vacancy }) => {
      const div = document.createElement('div');
      div.textContent = `${vacancy} (${city}, ${specialty})`;
      vacanciesDiv.appendChild(div);
    });
  }

  // Показывает случайные вакансии при загрузке
  function showRandomVacancies(): void {
    const all = getAllVacancies();
    const randomVacancies = shuffle(all).slice(0, 5); // Показываем 5 случайных
    showVacancies(randomVacancies);
  }

  // Фильтрует и показывает вакансии по выбранному городу
  function showVacanciesByOffice(office: Office): void {
    const result: Array<{ city: Office, specialty: Specialty, vacancy: Vacancy }> = [];
    Object.entries(vacanciesData[office]).forEach(([specialty, vacancies]) => {
      vacancies.forEach(vacancy => {
        result.push({ city: office, specialty, vacancy });
      });
    });
    showVacancies(result);
  }

  // Фильтрует и показывает вакансии по городу и специальности
  function showVacanciesByOfficeAndSpecialty(office: Office, specialty: Specialty): void {
    const result: Array<{ city: Office, specialty: Specialty, vacancy: Vacancy }> = [];
    (vacanciesData[office][specialty] || []).forEach(vacancy => {
      result.push({ city: office, specialty, vacancy });
    });
    showVacancies(result);
  }

  // Закрывает все селекты кроме указанного
  function closeAllSelect(except: HTMLElement | null = null): void {
    document.querySelectorAll('.select-items').forEach((el: Element) => {
      if (el !== except) {
        (el as HTMLElement).style.display = 'none';
      }
    });
  }

  // Инициализация селекта городов
  function initializeOfficeSelect(): void {
    if (!select1) return;
    const selectedElement = select1.querySelector('.select-selected');
    if (!selectedElement) return;
    selectedElement.addEventListener('click', () => {
      const items = select1.querySelector('.select-items') as HTMLElement;
      if (!items) return;
      items.style.display = items.style.display === 'block' ? 'none' : 'block';
      closeAllSelect(items);
    });
  }

  // Инициализация селекта специальностей
  function initializeSpecialtySelect(): void {
    if (!select2) return;
    const selectedElement = select2.querySelector('.select-selected');
    if (!selectedElement) return;
    selectedElement.addEventListener('click', () => {
      const items = select2.querySelector('.select-items') as HTMLElement;
      if (!items) return;
      items.style.display = items.style.display === 'block' ? 'none' : 'block';
      closeAllSelect(items);
    });
  }

  // Обновляет селект специальностей при выборе города
  function updateSpecialtiesDropdown(office: Office): void {
    if (!select2) return;
    const specialties = specialtiesByOffice[office] || [];
    const select2Items = select2.querySelector('.select-items');
    if (!select2Items) return;
    select2Items.innerHTML = '';
    specialties.forEach((spec: Specialty) => {
      const div = document.createElement('div');
      div.textContent = spec;
      select2Items.appendChild(div);
      div.addEventListener('click', () => {
        selectedSpecialty = spec;
        const selectedElement = select2.querySelector('.select-selected');
        if (selectedElement) {
          selectedElement.textContent = spec;
        }
        const itemsContainer = select2.querySelector('.select-items') as HTMLElement;
        if (itemsContainer) {
          itemsContainer.style.display = 'none';
        }
        if (selectedOffice && selectedSpecialty) {
          showVacanciesByOfficeAndSpecialty(selectedOffice, selectedSpecialty);
        }
      });
    });

    // Если выбранная специальность не входит в новый список — сбрасываем выбор
    if (selectedSpecialty && !specialties.includes(selectedSpecialty)) {
      selectedSpecialty = null;
      const selectedElement = select2.querySelector('.select-selected');
      if (selectedElement) {
        selectedElement.textContent = 'Select specialty';
      }
    }
  }


  // Сброс селекта специальностей и вакансий при смене города
  // function resetSpecialtySelection(): void {
  //   selectedSpecialty = null;
  //   if (select2) {
  //     const selectedElement = select2.querySelector('.select-selected');
  //     if (selectedElement) {
  //       selectedElement.textContent = 'Select specialty';
  //     }
  //   }
  // }

  // Обработка выбора города
  function setupOfficeSelection(): void {
    if (!select1) return;
    const officeItems = select1.querySelectorAll('.select-items div');
    officeItems.forEach((item: Element) => {
      item.addEventListener('click', () => {
        const office = item.getAttribute('data-value') as Office;
        if (!office) return;

        selectedOffice = office;

        const selectedElement = select1.querySelector('.select-selected');
        if (selectedElement) {
          selectedElement.textContent = item.textContent;
        }

        const itemsContainer = select1.querySelector('.select-items') as HTMLElement;
        if (itemsContainer) {
          itemsContainer.style.display = 'none';
        }

        updateSpecialtiesDropdown(office);

        // Если специальность выбрана — показываем вакансии по городу и специальности
        if (selectedSpecialty) {
          showVacanciesByOfficeAndSpecialty(office, selectedSpecialty);
        } else {
          // Иначе показываем все вакансии выбранного города
          showVacanciesByOffice(office);
        }
      });
    });
  }


  // Закрытие селектов при клике вне
  function setupDocumentClickHandler(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      if (!select1?.contains(e.target as Node) && !select2?.contains(e.target as Node)) {
        closeAllSelect();
      }
    });
  }

  // Инициализация приложения
  function initializeApp(): void {
    initializeOfficeSelect();
    initializeSpecialtySelect();
    setupOfficeSelection();
    setupDocumentClickHandler();
    showRandomVacancies(); // Показываем рандомные вакансии при загрузке
  }

  // Запуск
  initializeApp();

}
