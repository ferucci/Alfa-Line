export function downloadImage(e: Event) {
  const target = e.currentTarget as HTMLElement;
  const card = target.closest('.certificate-card') as HTMLElement | null;

  if (card) {
    const image = card.querySelector('.certificate-image') as HTMLImageElement | null;

    if (image) {
      const link = document.createElement('a');
      link.href = image.src;
      link.download = 'certificate.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}