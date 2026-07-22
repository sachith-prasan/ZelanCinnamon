/**
 * Zelan Cinnamon - Main JavaScript File
 * Handles navbar, scroll animations, contact form validation, quote modal & interactive components
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initContactForm();
  initQuoteModal();
  initSmoothScroll();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Handling
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('nav-sticky', 'py-3');
      navbar?.classList.remove('py-4');
    } else {
      navbar?.classList.remove('nav-sticky');
      navbar?.classList.add('py-4');
      navbar?.classList.remove('py-3');
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   2. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. Contact Form Validation & FormSubmit Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    let isValid = true;

    // Form inputs
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Error helper
    const setError = (element, messageText) => {
      isValid = false;
      const parent = element.closest('.form-group');
      if (parent) {
        let errorEl = parent.querySelector('.error-msg');
        if (!errorEl) {
          errorEl = document.createElement('p');
          errorEl.className = 'error-msg text-red-600 text-xs mt-1 font-medium';
          parent.appendChild(errorEl);
        }
        errorEl.textContent = messageText;
        element.classList.add('border-red-500', 'focus:ring-red-500');
        element.classList.remove('border-gray-300', 'border-cinnamon-300');
      }
    };

    const clearError = (element) => {
      const parent = element.closest('.form-group');
      if (parent) {
        const errorEl = parent.querySelector('.error-msg');
        if (errorEl) errorEl.remove();
        element.classList.remove('border-red-500', 'focus:ring-red-500');
        element.classList.add('border-cinnamon-300');
      }
    };

    // Reset errors
    [fullName, email, phone, subject, message].forEach(el => {
      if (el) clearError(el);
    });

    // Validate Full Name
    if (!fullName || fullName.value.trim().length < 2) {
      setError(fullName, 'Please enter your full name (minimum 2 characters).');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
    }

    // Validate Phone Number
    const phoneRegex = /^[\d\+\-\s\(\)]{7,20}$/;
    if (!phone || !phoneRegex.test(phone.value.trim())) {
      setError(phone, 'Please enter a valid phone number (e.g. 0720801611 or +94 72 080 1611).');
    }

    // Validate Subject
    if (!subject || subject.value.trim().length < 3) {
      setError(subject, 'Please enter a subject (minimum 3 characters).');
    }

    // Validate Message
    if (!message || message.value.trim().length < 10) {
      setError(message, 'Please enter your message (minimum 10 characters).');
    }

    if (!isValid) {
      e.preventDefault();
      if (formFeedback) {
        formFeedback.innerHTML = `
          <div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded shadow-sm">
            <p class="font-bold">Form Submission Error</p>
            <p>Please fix the highlighted fields above before submitting.</p>
          </div>
        `;
        formFeedback.classList.remove('hidden');
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      // If valid, FormSubmit will handle sending the email
      if (formFeedback) {
        formFeedback.innerHTML = `
          <div class="p-4 bg-green-50 border-l-4 border-green-600 text-green-800 text-sm rounded shadow-sm flex items-center gap-3">
            <svg class="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div>
              <p class="font-bold">Submitting your message...</p>
              <p>Connecting to export sales team via FormSubmit.</p>
            </div>
          </div>
        `;
        formFeedback.classList.remove('hidden');
      }
    }
  });
}

/* ==========================================================================
   4. B2B Export Quote Modal
   ========================================================================== */
function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const openBtns = document.querySelectorAll('.open-quote-modal');
  const closeBtns = document.querySelectorAll('.close-quote-modal');
  const productSelect = document.getElementById('modal-product-select');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product') || 'Ceylon Cinnamon Sticks';
      if (productSelect) {
        for (let option of productSelect.options) {
          if (option.value.toLowerCase().includes(productName.toLowerCase())) {
            option.selected = true;
            break;
          }
        }
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    });
  });

  // Close on outer backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
  });
}

/* ==========================================================================
   5. Smooth Scroll Helper
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
