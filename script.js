document.addEventListener('DOMContentLoaded', () => {
  // Initialize Themes, Scroll progress, mobile navigation, and typing animations
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initTypingEffect();
  initProjectFilters();
  initContactForm();

  // 3D Interactive Enhancements
  init3DTilt();
  initParallaxScroll();
  initHeroInteractive3D();
});

/* ==========================================
   THEME TOGGLE SYSTEM
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  if (!themeToggleBtn) return;

  // Determine current theme setting from localStorage or system preference
  if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon?.classList.remove('hidden');
    themeToggleDarkIcon?.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleLightIcon?.classList.add('hidden');
    themeToggleDarkIcon?.classList.remove('hidden');
  }

  // Event listener for theme toggle button
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    
    if (document.documentElement.classList.contains('dark')) {
      themeToggleLightIcon?.classList.remove('hidden');
      themeToggleDarkIcon?.classList.add('hidden');
      localStorage.setItem('color-theme', 'dark');
      showToast('Switched to Dark Mode', 'info');
    } else {
      themeToggleLightIcon?.classList.add('hidden');
      themeToggleDarkIcon?.classList.remove('hidden');
      localStorage.setItem('color-theme', 'light');
      showToast('Switched to Light Mode', 'info');
    }
  });
}

/* ==========================================
   SCROLL EFFECTS (Header shadow, Active Nav, Progress Bar, Back-To-Top)
   ========================================== */
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // 1. Header background elevation
    if (header) {
      if (scrollY > 50) {
        header.classList.add('shadow-lg', 'backdrop-blur-xl', 'py-3');
        header.classList.remove('py-5');
      } else {
        header.classList.remove('shadow-lg', 'py-3');
        header.classList.add('py-5');
      }
    }

    // 2. Scroll Progress Bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = scrollPercent + '%';
    }

    // 3. Back-To-Top Button Visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
      }
    }

    // 4. Active Nav Link Highlighter
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-cyan-600', 'dark:text-cyan-400', 'font-semibold');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-cyan-600', 'dark:text-cyan-400', 'font-semibold');
          }
        });
      }
    });
  }, { passive: true });

  // Smooth scroll back to top on button click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================
   MOBILE MENU DRAWER
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  }

  menuBtn.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  });
}

/* ==========================================
   DYNAMIC TYPEWRITER EFFECT
   ========================================== */
function initTypingEffect() {
  const typingTextElement = document.getElementById('typing-text');
  if (!typingTextElement) return;

  const words = [
    'Software Engineering Undergraduate',
    'Full-Stack Developer',
    'Tech Enthusiast & Learner',
    'NSBM Green University Student'
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================
   INTERACTIVE PROJECTS FILTERING
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-white', 'shadow-lg', 'shadow-cyan-500/30', 'scale-105');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      btn.classList.add('bg-cyan-500', 'text-white', 'shadow-lg', 'shadow-cyan-500/30', 'scale-105');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) scale(1) translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'perspective(1000px) scale(0.95) translateY(10px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   INTERACTIVE 3D TILT EFFECT & SPECULAR GLARE
   ========================================== */
function init3DTilt() {
  // Check if touch device or reduced motion preferred
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) {
    return; // Leave smooth static styling for touch & reduced-motion
  }

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    // Add specular glare element if not already present
    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    let isHovered = false;
    let bounds = null;
    let rAF = null;

    function onMouseEnter() {
      isHovered = true;
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    }

    function onMouseMove(e) {
      if (!isHovered) return;
      if (!bounds) bounds = card.getBoundingClientRect();

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xNorm = mouseX / bounds.width; // 0 to 1
      const yNorm = mouseY / bounds.height; // 0 to 1

      // Tilt angles (subtle & professional: max 12 degrees)
      const maxTilt = 12;
      const tiltX = (yNorm - 0.5) * -maxTilt;
      const tiltY = (xNorm - 0.5) * maxTilt;

      if (rAF) cancelAnimationFrame(rAF);

      rAF = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${xNorm * 100}% ${yNorm * 100}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 65%)`;
          glare.style.opacity = '1';
        }
      });
    }

    function onMouseLeave() {
      isHovered = false;
      bounds = null;
      if (rAF) cancelAnimationFrame(rAF);

      card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      
      if (glare) {
        glare.style.opacity = '0';
      }
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ==========================================
   HERO AVATAR INTERACTIVE 3D MOUSE TRACKING
   ========================================== */
function initHeroInteractive3D() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) return;

  const heroSection = document.getElementById('home');
  const avatarCard = document.querySelector('.hero-avatar-card');
  const floatingChips = document.querySelectorAll('.floating-chip');

  if (!heroSection || !avatarCard) return;

  let rAF = null;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = y * -20;
    const rotY = x * 20;

    if (rAF) cancelAnimationFrame(rAF);

    rAF = requestAnimationFrame(() => {
      avatarCard.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.03)`;

      // Dynamic parallax on floating chips
      floatingChips.forEach((chip, idx) => {
        const factor = (idx + 1) * 12;
        const chipOffsetX = x * factor;
        const chipOffsetY = y * factor;
        chip.style.transform = `translate3d(${chipOffsetX.toFixed(1)}px, ${chipOffsetY.toFixed(1)}px, ${50 + factor}px)`;
      });
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    if (rAF) cancelAnimationFrame(rAF);
    avatarCard.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    avatarCard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';

    floatingChips.forEach((chip) => {
      chip.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
      chip.style.transform = '';
      setTimeout(() => { chip.style.transition = ''; }, 800);
    });

    setTimeout(() => { avatarCard.style.transition = ''; }, 800);
  });
}

/* ==========================================
   SMOOTH PARALLAX SCROLLING ENGINE
   ========================================== */
function initParallaxScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxItems = document.querySelectorAll('[data-parallax-speed]');
  if (!parallaxItems.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxItems.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.15;
      const yPos = scrollY * speed;
      el.style.transform = `translate3d(0, ${yPos.toFixed(1)}px, 0)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================
   CONTACT FORM VALIDATION & INTERACTION
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    let isValid = true;

    // Reset validations
    resetInputValidation(nameInput);
    resetInputValidation(emailInput);
    resetInputValidation(subjectInput);
    resetInputValidation(messageInput);

    // Validate Name
    if (!nameInput.value.trim()) {
      setInputError(nameInput, 'Name is required');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      setInputError(emailInput, 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      setInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setInputError(subjectInput, 'Subject is required');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setInputError(messageInput, 'Message is required');
      isValid = false;
    }

    if (isValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending Message...';

      setTimeout(() => {
        showToast('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1400);
    } else {
      showToast('Please correct the validation errors in the form.', 'error');
    }
  });
}

function setInputError(input, message) {
  input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
  input.classList.remove('border-slate-200', 'dark:border-slate-700', 'focus:border-cyan-500', 'focus:ring-cyan-500');
  
  const helperText = input.nextElementSibling;
  if (helperText && helperText.classList.contains('error-message')) {
    helperText.textContent = message;
    helperText.classList.remove('hidden');
  }
}

function resetInputValidation(input) {
  input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
  input.classList.add('border-slate-200', 'dark:border-slate-700', 'focus:border-cyan-500', 'focus:ring-cyan-500');
  
  const helperText = input.nextElementSibling;
  if (helperText && helperText.classList.contains('error-message')) {
    helperText.classList.add('hidden');
    helperText.textContent = '';
  }
}

/* ==========================================
   TOAST NOTIFICATION ENGINE
   ========================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconClass = 'fas fa-check-circle text-emerald-500';
  if (type === 'error') {
    iconClass = 'fas fa-exclamation-circle text-red-500';
  } else if (type === 'info') {
    iconClass = 'fas fa-info-circle text-cyan-500';
  }

  toast.innerHTML = `
    <i class="${iconClass} text-xl"></i>
    <span class="text-sm font-medium text-slate-800 dark:text-slate-100">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}
