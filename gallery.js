document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.close');

  // Open lightbox on image click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    });
  });

  // Close lightbox on close button click
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    lightboxImg.alt = '';
  });

  // Optional: close lightbox if background is clicked
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      lightboxImg.alt = '';
    }
  });
});
