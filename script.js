// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('overlay');

    // Toggle sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            sidebarToggle.classList.toggle('active');
        });
    }

    // Close sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            sidebarToggle.classList.remove('active');
        });
    }

    // Close sidebar when clicking a link
    const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            sidebar.classList.remove('active');
            sidebarToggle.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Add active class to navigation based on scroll position
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.header-nav .nav-link, #sidebar .nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Header shadow on scroll
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
    });

    // ===== LIGHTBOX FUNCTIONALITY =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');

    let currentIndex = 0;
    const galleryData = [];

    // Collect gallery data
    galleryItems.forEach((item, index) => {
        galleryData.push({
            src: item.getAttribute('data-lightbox'),
            title: item.getAttribute('data-title') || ''
        });

        // Click to open lightbox
        item.addEventListener('click', function () {
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
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');

        // Update navigation visibility
        updateNavigation();
    }

    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
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
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.8)';

        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxCaption.textContent = data.title;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 150);

        updateNavigation();
    }

    // Update navigation buttons visibility
    function updateNavigation() {
        lightboxPrev.style.opacity = currentIndex > 0 ? '0.7' : '0.3';
        lightboxPrev.style.cursor = currentIndex > 0 ? 'pointer' : 'default';
        lightboxNext.style.opacity = currentIndex < galleryData.length - 1 ? '0.7' : '0.3';
        lightboxNext.style.cursor = currentIndex < galleryData.length - 1 ? 'pointer' : 'default';
    }

    // Event listeners for lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Add transition styles for smooth image changes
    if (lightboxImg) {
        lightboxImg.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    }

    // ===== APPOINTMENT FORM =====
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();

            if (!name || !phone) {
                document.getElementById('form-name').reportValidity();
                document.getElementById('form-phone').reportValidity();
                return;
            }

            const date = document.getElementById('form-date').value;
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value.trim();

            const subject = encodeURIComponent('Αίτηση Ραντεβού - ' + name);
            let body = `Ονοματεπώνυμο: ${name}\nΤηλέφωνο: ${phone}`;
            if (date) body += `\nΕπιθυμητή Ημερομηνία: ${date}`;
            if (service) body += `\nΥπηρεσία: ${service}`;
            if (message) body += `\nΜήνυμα: ${message}`;

            window.location.href = `mailto:azinouli@yahoo.gr?subject=${subject}&body=${encodeURIComponent(body)}`;

            appointmentForm.reset();
            const successMsg = document.getElementById('form-success');
            successMsg.classList.remove('d-none');
            setTimeout(() => successMsg.classList.add('d-none'), 5000);
        });
    }
});
