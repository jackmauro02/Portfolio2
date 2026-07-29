(() => {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  const setMenuState = (open) => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navLinks.classList.toggle("open", open);
  };

  navToggle?.addEventListener("click", () => {
    setMenuState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-inner")) setMenuState(false);
  });

  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkFile = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    const projectsMatch =
      currentFile === "gallery.html" && linkFile === "projects2.html";

    if (linkFile === currentFile || projectsMatch) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const filters = Array.from(document.querySelectorAll("[data-project-filter]"));
  const projectCards = Array.from(document.querySelectorAll("[data-project-category]"));
  const filterStatus = document.querySelector("[data-filter-status]");

  const updateProjects = (filter) => {
    let visibleCount = 0;

    filters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.projectFilter === filter));
    });

    projectCards.forEach((card) => {
      const categories = (card.dataset.projectCategory || "").split(" ");
      const visible = filter === "all" || categories.includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (filterStatus) {
      filterStatus.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "s"} shown`;
    }
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      updateProjects(button.dataset.projectFilter || "all");
    });
  });

  if (filters.length && projectCards.length) updateProjects("all");

  const galleryButtons = Array.from(document.querySelectorAll("[data-gallery-item]"));
  const lightbox = document.querySelector("[data-lightbox]");

  if (
    galleryButtons.length &&
    typeof HTMLDialogElement !== "undefined" &&
    lightbox instanceof HTMLDialogElement
  ) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    const lightboxCount = lightbox.querySelector("[data-lightbox-count]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const previousButton = lightbox.querySelector("[data-lightbox-previous]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    let activeIndex = 0;

    const showGalleryItem = (index) => {
      activeIndex = (index + galleryButtons.length) % galleryButtons.length;
      const button = galleryButtons[activeIndex];
      const image = button.querySelector("img");
      if (!image || !lightboxImage) return;

      lightboxImage.src = button.dataset.gallerySrc || image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      if (lightboxCaption) {
        lightboxCaption.textContent =
          button.dataset.galleryTitle || image.alt || "Photoshop artwork";
      }
      if (lightboxCount) {
        lightboxCount.textContent = `${activeIndex + 1} / ${galleryButtons.length}`;
      }
    };

    galleryButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        showGalleryItem(index);
        lightbox.showModal();
      });
    });

    closeButton?.addEventListener("click", () => lightbox.close());
    previousButton?.addEventListener("click", () => showGalleryItem(activeIndex - 1));
    nextButton?.addEventListener("click", () => showGalleryItem(activeIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showGalleryItem(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showGalleryItem(activeIndex + 1);
      }
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "Portfolio enquiry").trim();
    const message = String(formData.get("message") || "").trim();
    const status = contactForm.querySelector("[data-form-status]");

    const emailBody = [
      `Hi Jack,`,
      "",
      message,
      "",
      `From: ${name}`,
      `Reply to: ${email}`,
    ].join("\n");

    if (status) status.textContent = "Opening your email app…";

    window.location.href =
      `mailto:jackmauro02@gmail.com?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;
  });

  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const originalText = button.textContent;
      try {
        await navigator.clipboard.writeText("jackmauro02@gmail.com");
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy unavailable";
      }
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1800);
    });
  });
})();
