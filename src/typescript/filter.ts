export const filterVacancies = () => {
  const officeSelect = document.getElementById('office') as HTMLSelectElement;
  const detailsSelect = document.getElementById('details') as HTMLSelectElement;
  const vacancyItems = document.querySelectorAll('.vacancies__item');
  const vacanciesContainer = document.getElementById('vacancies-items') as HTMLElement;

  if (!officeSelect || !detailsSelect || vacancyItems.length === 0 || !vacanciesContainer) return;
  const noResultsMessage = document.createElement('span');

  const createTextEmptyField = () => {
    // Создаем элемент для сообщения о пустом результате
    noResultsMessage.className = 'vacancies__no-results';
    noResultsMessage.textContent = 'Нет подходящих результатов';
    noResultsMessage.style.display = 'none';
    vacanciesContainer.appendChild(noResultsMessage);
  }

  createTextEmptyField()

  const handleFilter = () => {
    const selectedOffice = officeSelect.value;
    const selectedDetails = detailsSelect.value;
    let visibleCount = 0;

    vacancyItems.forEach(item => {
      const office = item.getAttribute('data-office');
      const details = item.getAttribute('data-details');

      // Проверяем соответствие фильтрам
      const officeMatch = selectedOffice === '' || office === selectedOffice;
      const detailsMatch = selectedDetails === '' || details === selectedDetails;

      if (officeMatch && detailsMatch) {
        (item as HTMLElement).style.display = 'block';
        visibleCount++;
      } else {
        (item as HTMLElement).style.display = 'none';
      }
    });
    if (visibleCount === 0) {
      noResultsMessage.style.display = 'block';
    } else {
      noResultsMessage.style.display = 'none';
    }
  }

  officeSelect.addEventListener('change', handleFilter);
  detailsSelect.addEventListener('change', handleFilter);

  handleFilter();
}