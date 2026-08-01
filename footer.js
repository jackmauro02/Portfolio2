(() => {
  const FOOTER_VERSION = "2.3";

  async function loadFooter() {
    const placeholder = document.getElementById("footer-placeholder");

    if (!placeholder) {
      console.warn("Footer placeholder not found on this page.");
      return;
    }

    // Prevent the footer loading twice.
    if (placeholder.dataset.footerLoaded === "true") {
      return;
    }

    placeholder.dataset.footerLoaded = "true";

    loadFooterStyles();

    try {
      const response = await fetch(
        `/footer.html?v=${encodeURIComponent(FOOTER_VERSION)}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not load footer.html. Status: ${response.status}`
        );
      }

      placeholder.innerHTML = await response.text();

      highlightCurrentFooterPage(placeholder);
      initialiseFooterTopButton(placeholder);
    } catch (error) {
      console.error("Unable to load portfolio footer:", error);

      placeholder.innerHTML = `
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

  function loadFooterStyles() {
    const existingStyles = document.querySelector(
      'link[data-footer-styles="true"]'
    );

    if (existingStyles) {
      return;
    }

    const footerStyles = document.createElement("link");

    footerStyles.rel = "stylesheet";
    footerStyles.href =
      `/footer.css?v=${encodeURIComponent(FOOTER_VERSION)}`;
    footerStyles.dataset.footerStyles = "true";

    document.head.appendChild(footerStyles);
  }

  function normalisePath(pathname) {
    let path = pathname
      .toLowerCase()
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+$/, "");

    if (path === "" || path === "/") {
      return "/index.html";
    }

    return path;
  }

  function highlightCurrentFooterPage(footer) {
    const currentPath = normalisePath(window.location.pathname);
    const navigationLinks = footer.querySelectorAll(
      ".footer-nav-links a"
    );

    navigationLinks.forEach((link) => {
      const linkURL = new URL(link.href, window.location.origin);
      const linkPath = normalisePath(linkURL.pathname);

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
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFooter, {
      once: true,
    });
  } else {
    loadFooter();
  }
})();