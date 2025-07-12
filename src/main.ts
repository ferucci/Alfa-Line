import { waitingForLoading } from "./typescript/initializeComponents";


function checkReadyState() {
  if (document.readyState === 'complete') {
    // Страница полностью загружена
    waitingForLoading();
  } else {
    window.addEventListener('load', waitingForLoading);
  }
}


checkReadyState();