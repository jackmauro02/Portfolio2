// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // JavaScript for fade-in animation on scroll
document.addEventListener('scroll', function() {
  const elements = document.querySelectorAll('.fade-in');
  const viewportHeight = window.innerHeight;

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < viewportHeight - 100) {
      element.classList.add('visible');
    }
  });
});

function scrollSlider(direction) {
  const slider = document.querySelector('.project-slider');
  const scrollAmount = 600; // Amount to scroll per click
  slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

