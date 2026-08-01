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

const navbarMount = document.getElementById("navbar");

const currentPage = (
  window.location.pathname.split("/").pop() || "Portfolio.html"
).toLowerCase();

/* =========================================================
   NAVBAR
========================================================= */

function initialiseNavbar() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mainmenu");

  // Mobile menu
  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu?.classList.toggle("open", !isOpen);
  });

  // Highlight the current page
  menu?.querySelectorAll("a").forEach((link) => {
    const linkPage = (
      link.getAttribute("href") || ""
    )
      .split("#")[0]
      .toLowerCase();

    const isHomeAlias =
      ["", "index.html", "portfolio.html"].includes(currentPage) &&
      ["index.html", "portfolio.html"].includes(linkPage);

    if (linkPage === currentPage || isHomeAlias) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    // Close the mobile menu after selecting a link
    link.addEventListener("click", () => {
      toggle?.setAttribute("aria-expanded", "false");
      menu?.classList.remove("open");
    });
  });

  // Change navbar styling after scrolling
  const updateNavbar = () => {
    nav?.classList.toggle("nav-scrolled", window.scrollY > 24);
  };

  updateNavbar();

  window.addEventListener("scroll", updateNavbar, {
    passive: true,
  });
}

// Load the shared navbar
if (navbarMount) {
  fetch("navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Navbar request failed: ${response.status}`
        );
      }

      return response.text();
    })
    .then((html) => {
      navbarMount.innerHTML = html;
      initialiseNavbar();
    })
    .catch((error) => {
      console.warn(
        "Could not load navbar.html. Run the website through Live Server or Netlify.",
        error
      );
    });
}

/* =========================================================
   PAGE ENTRANCE
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });
});

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
  ".project-card, .experience-item, .reveal"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      // A tiny amount only needs to enter the screen
      threshold: 0.01,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}
/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* =========================================================
   PROJECT SLIDER
========================================================= */

const projectTrack = document.getElementById("projectTrack");

document
  .querySelectorAll("[data-slider-direction]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      if (!projectTrack) {
        return;
      }

      const firstCard =
        projectTrack.querySelector(".project-card");

      const gap =
        Number.parseFloat(
          getComputedStyle(projectTrack).gap
        ) || 18;

      const amount = firstCard
        ? firstCard.getBoundingClientRect().width + gap
        : 450;

      const direction =
        Number(button.dataset.sliderDirection) || 1;

      projectTrack.scrollBy({
        left: direction * amount,
        behavior: "smooth",
      });
    });
  });

// Allow keyboard arrows to control the project slider
projectTrack?.addEventListener("keydown", (event) => {
  if (
    !projectTrack ||
    !["ArrowLeft", "ArrowRight"].includes(event.key)
  ) {
    return;
  }

  event.preventDefault();

  const direction =
    event.key === "ArrowRight" ? 1 : -1;

  const firstCard =
    projectTrack.querySelector(".project-card");

  const amount = firstCard
    ? firstCard.getBoundingClientRect().width + 18
    : 450;

  projectTrack.scrollBy({
    left: direction * amount,
    behavior: "smooth",
  });
});

// Compatibility with old inline onclick buttons
function scrollSlider(direction) {
  if (!projectTrack) {
    return;
  }

  const firstCard =
    projectTrack.querySelector(".project-card");

  const gap =
    Number.parseFloat(
      getComputedStyle(projectTrack).gap
    ) || 18;

  const amount = firstCard
    ? firstCard.getBoundingClientRect().width + gap
    : 450;

  projectTrack.scrollBy({
    left: direction * amount,
    behavior: "smooth",
  });
}

window.scrollSlider = scrollSlider;

/* =========================================================
   HERO POINTER SPOTLIGHT
========================================================= */

const hero = document.querySelector(".hero-section");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const hasFinePointer = window.matchMedia(
  "(pointer: fine)"
).matches;

if (hero && !reducedMotion && hasFinePointer) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();

    const x =
      ((event.clientX - bounds.left) / bounds.width) *
      100;

    const y =
      ((event.clientY - bounds.top) / bounds.height) *
      100;

    hero.style.setProperty(
      "--pointer-x",
      `${x}%`
    );

    hero.style.setProperty(
      "--pointer-y",
      `${y}%`
    );
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--pointer-x", "70%");
    hero.style.setProperty("--pointer-y", "30%");
  });
}

/* =========================================================
   HERO IMAGE MOVEMENT
========================================================= */

const heroVisual = document.querySelector(".hero-visual");

if (
  heroVisual &&
  !reducedMotion &&
  hasFinePointer
) {
  heroVisual.addEventListener(
    "pointermove",
    (event) => {
      const bounds =
        heroVisual.getBoundingClientRect();

      const centreX =
        bounds.left + bounds.width / 2;

      const centreY =
        bounds.top + bounds.height / 2;

      const rotateY =
        (event.clientX - centreX) / 35;

      const rotateX =
        (centreY - event.clientY) / 35;

      heroVisual.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    }
  );

  heroVisual.addEventListener(
    "pointerleave",
    () => {
      heroVisual.style.transform = `
        perspective(900px)
        rotateX(0deg)
        rotateY(0deg)
      `;
    }
  );
}

/* =========================================================
   SCROLL PROGRESS
========================================================= */

const progressBar = document.querySelector(
  ".scroll-progress"
);

function updateScrollProgress() {
  if (!progressBar) {
    return;
  }

  const pageHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const scrollAmount =
    pageHeight > 0
      ? (window.scrollY / pageHeight) * 100
      : 0;

  progressBar.style.width = `${scrollAmount}%`;
}

updateScrollProgress();

window.addEventListener(
  "scroll",
  updateScrollProgress,
  {
    passive: true,
  }
);

/* =========================================================
   ACTIVE SECTION TRACKING
========================================================= */

const pageSections =
  document.querySelectorAll("main section[id]");

if (
  pageSections.length &&
  "IntersectionObserver" in window
) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const sectionId = entry.target.id;

        document
          .querySelectorAll('.menu a[href^="#"]')
          .forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") ===
                `#${sectionId}`
            );
          });
      });
    },
    {
      threshold: 0.45,
    }
  );

  pageSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================================================
   CARD POINTER EFFECT
========================================================= */

const interactiveCards = document.querySelectorAll(
  ".project-card, .skill-card, .edu-card, .exp-item"
);

if (!reducedMotion && hasFinePointer) {
  interactiveCards.forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const bounds =
          card.getBoundingClientRect();

        const x =
          event.clientX - bounds.left;

        const y =
          event.clientY - bounds.top;

        card.style.setProperty(
          "--card-pointer-x",
          `${x}px`
        );

        card.style.setProperty(
          "--card-pointer-y",
          `${y}px`
        );
      }
    );
  });
}

/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
  document.querySelector(".contact-form");

contactForm?.addEventListener(
  "submit",
  (event) => {
    const submitButton =
      contactForm.querySelector(
        'button[type="submit"]'
      );

    if (!contactForm.checkValidity()) {
      return;
    }

    if (submitButton) {
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
    }
  }
);

/* =========================================================
   COPYRIGHT YEAR
========================================================= */

const year =
  document.getElementById("currentYear");

if (year) {
  year.textContent = String(
    new Date().getFullYear()
  );
}


/* =========================================================
   INTERACTIVE PORTRAIT EASTER EGG
========================================================= */

const portraitFlipCard = document.querySelector(
  ".portrait-flip-card"
);

if (portraitFlipCard) {
  const portraitVisual =
    portraitFlipCard.closest(".hero-visual");

  let portraitIsAnimating = false;

  function togglePortraitSkills() {
    // Prevent repeated clicks interrupting the spin
    if (portraitIsAnimating) {
      return;
    }

    portraitIsAnimating = true;

    const isCurrentlyFlipped =
      portraitFlipCard.classList.contains("is-flipped");

    const willBeFlipped = !isCurrentlyFlipped;

    portraitFlipCard.classList.toggle(
      "is-flipped",
      willBeFlipped
    );

    portraitVisual?.classList.toggle(
      "skills-revealed",
      willBeFlipped
    );

    portraitFlipCard.setAttribute(
      "aria-pressed",
      String(willBeFlipped)
    );

    portraitFlipCard.setAttribute(
      "aria-label",
      willBeFlipped
        ? "Hide Jack Mauro's skills"
        : "Reveal Jack Mauro's skills"
    );

    // Brief orbit burst each time the card is clicked
    portraitVisual?.classList.remove(
      "portrait-activated"
    );

    // Restart the CSS animation
    void portraitVisual?.offsetWidth;

    portraitVisual?.classList.add(
      "portrait-activated"
    );

    window.setTimeout(() => {
      portraitVisual?.classList.remove(
        "portrait-activated"
      );
    }, 950);

    window.setTimeout(() => {
      portraitIsAnimating = false;
    }, 1000);
  }

  portraitFlipCard.addEventListener(
    "click",
    togglePortraitSkills
  );

  // Keyboard accessibility
  portraitFlipCard.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();
      togglePortraitSkills();
    }
  );
}

async function loadFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (!footerPlaceholder) {
    return;
  }

  // Change this number whenever footer.html or footer.css is updated.
  const footerVersion = "2.1";

  // Automatically load the footer stylesheet once.
  if (!document.querySelector('link[data-footer-styles]')) {
    const footerStyles = document.createElement("link");

    footerStyles.rel = "stylesheet";
    footerStyles.href = `/footer.css?v=${footerVersion}`;
    footerStyles.dataset.footerStyles = "true";

    document.head.appendChild(footerStyles);
  }

  try {
    const response = await fetch(`/footer.html?v=${footerVersion}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Footer request failed: ${response.status}`);
    }

    const footerHTML = await response.text();

    footerPlaceholder.innerHTML = footerHTML;

    highlightCurrentFooterPage(footerPlaceholder);
    initialiseFooterTopButton(footerPlaceholder);
  } catch (error) {
    console.error("Unable to load the portfolio footer:", error);

    footerPlaceholder.innerHTML = `
      <footer
        style="
          padding: 2rem;
          color: #aaa;
          text-align: center;
          background: #050505;
          border-top: 1px solid #e50914;
        "
      >
        <p>© 2026 Jack Mauro. All rights reserved.</p>
      </footer>
    `;
  }
}

function normaliseFooterPath(pathname) {
  let path = pathname.toLowerCase();

  // Remove query strings and hashes if supplied.
  path = path.split("?")[0].split("#")[0];

  // Treat the root URL as the homepage.
  if (path === "/" || path === "") {
    return "/index.html";
  }

  // Remove trailing slashes.
  path = path.replace(/\/+$/, "");

  return path || "/index.html";
}

function highlightCurrentFooterPage(footer) {
  const currentPath = normaliseFooterPath(window.location.pathname);
  const footerLinks = footer.querySelectorAll(".footer-nav-links a");

  footerLinks.forEach((link) => {
    const linkURL = new URL(link.href, window.location.origin);
    const linkPath = normaliseFooterPath(linkURL.pathname);

    link.classList.remove("is-active");
    link.removeAttribute("aria-current");

    if (linkPath === currentPath) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function initialiseFooterTopButton(footer) {
  const topButton = footer.querySelector("[data-footer-top]");

  if (!topButton) {
    return;
  }

  topButton.addEventListener("click", () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
}

function initialiseFooter() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFooter, {
      once: true,
    });
  } else {
    loadFooter();
  }
}

initialiseFooter();