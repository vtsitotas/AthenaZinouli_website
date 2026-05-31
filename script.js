// Sidebar Toggle Functionality
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("overlay");

  // Toggle sidebar
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      sidebarToggle.classList.toggle("active");
    });
  }

  // Close sidebar when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      sidebarToggle.classList.remove("active");
    });
  }

  // Close sidebar when clicking a link
  const sidebarLinks = document.querySelectorAll("#sidebar .nav-link");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      sidebar.classList.remove("active");
      sidebarToggle.classList.remove("active");
    });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Fade-in animation on scroll
  const fadeElements = document.querySelectorAll(".fade-in");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((element) => {
    fadeObserver.observe(element);
  });

  // Add active class to navigation based on scroll position
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(
    ".header-nav .nav-link, #sidebar .nav-link",
  );

  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  // Header shadow on scroll
  const header = document.querySelector(".main-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
    }
  });

  // ===== LIGHTBOX FUNCTIONALITY =====
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const galleryItems = document.querySelectorAll(
    ".gallery-item[data-lightbox]",
  );

  let currentIndex = 0;
  const galleryData = [];

  // Collect gallery data
  galleryItems.forEach((item, index) => {
    galleryData.push({
      src: item.getAttribute("data-lightbox"),
      title: item.getAttribute("data-title") || "",
    });

    // Click to open lightbox
    item.addEventListener("click", function () {
      currentIndex = index;
      openLightbox();
    });
  });

  // Open lightbox function
  function openLightbox() {
    if (galleryData.length === 0) return;

    const data = galleryData[currentIndex];
    lightboxImg.src = data.src;
    lightboxCaption.textContent = data.title;
    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");

    // Update navigation visibility
    updateNavigation();
  }

  // Close lightbox function
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");
  }

  // Navigate to previous image
  function prevImage() {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightboxImage();
    }
  }

  // Navigate to next image
  function nextImage() {
    if (currentIndex < galleryData.length - 1) {
      currentIndex++;
      updateLightboxImage();
    }
  }

  // Update lightbox image
  function updateLightboxImage() {
    const data = galleryData[currentIndex];

    // Add zoom animation
    lightboxImg.style.opacity = "0";
    lightboxImg.style.transform = "scale(0.8)";

    setTimeout(() => {
      lightboxImg.src = data.src;
      lightboxCaption.textContent = data.title;
      lightboxImg.style.opacity = "1";
      lightboxImg.style.transform = "scale(1)";
    }, 150);

    updateNavigation();
  }

  // Update navigation buttons visibility
  function updateNavigation() {
    lightboxPrev.style.opacity = currentIndex > 0 ? "0.7" : "0.3";
    lightboxPrev.style.cursor = currentIndex > 0 ? "pointer" : "default";
    lightboxNext.style.opacity =
      currentIndex < galleryData.length - 1 ? "0.7" : "0.3";
    lightboxNext.style.cursor =
      currentIndex < galleryData.length - 1 ? "pointer" : "default";
  }

  // Event listeners for lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", prevImage);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", nextImage);
  }

  // Close on background click
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
    }
  });

  // Add transition styles for smooth image changes
  if (lightboxImg) {
    lightboxImg.style.transition = "opacity 0.15s ease, transform 0.15s ease";
  }

  // ===== COUNT-UP STATS =====
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const isPlain = el.getAttribute("data-plain") === "true"; // e.g. a year, no thousands separator

    if (reduceMotion) {
      el.textContent =
        (isPlain ? target : target.toLocaleString("el-GR")) + suffix;
      return;
    }

    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent =
        (isPlain ? value : value.toLocaleString("el-GR")) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    statNumbers.forEach((el) => statsObserver.observe(el));
  }

  // ===== STAGGERED CARD REVEAL =====
  const staggerContainers = document.querySelectorAll(
    ".services .row, .dental-tips .row, .gallery-section .row, .about-features",
  );

  staggerContainers.forEach((container) => {
    const items = container.children;
    Array.from(items).forEach((item, i) => {
      item.classList.add("stagger-item");
      item.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`;
    });
  });

  if (staggerContainers.length && !reduceMotion) {
    const staggerObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((item) =>
              item.classList.add("stagger-in"),
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    staggerContainers.forEach((c) => staggerObserver.observe(c));
  } else {
    staggerContainers.forEach((c) =>
      Array.from(c.children).forEach((item) =>
        item.classList.add("stagger-in"),
      ),
    );
  }

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
});
