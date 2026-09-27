document.addEventListener('DOMContentLoaded', () => {
  // Initialize Themes, Scroll progress, mobile navigation, and typing animations
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initTypingEffect();
  initProjectFilters();
  initContactForm();
});

/* ==========================================
   THEME TOGGLE SYSTEM
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  // Determine current theme setting from localStorage or system preference
  if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
    themeToggleDarkIcon.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleLightIcon.classList.add('hidden');
    themeToggleDarkIcon.classList.remove('hidden');
  }

  // Event listener for theme toggle button
  themeToggleBtn.addEventListener('click', () => {
    // Toggle class
    document.documentElement.classList.toggle('dark');
    
    // Toggle icons and store preference
    if (document.documentElement.classList.contains('dark')) {
      themeToggleLightIcon.classList.remove('hidden');
      themeToggleDarkIcon.classList.add('hidden');
      localStorage.setItem('color-theme', 'dark');
      showToast('Switched to Dark Mode', 'info');
    } else {
      themeToggleLightIcon.classList.add('hidden');
      themeToggleDarkIcon.classList.remove('hidden');
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
    if (scrollY > 50) {
      header.classList.add('shadow-md', 'backdrop-blur-lg');
      header.classList.remove('py-5');
      header.classList.add('py-3');
    } else {
      header.classList.remove('shadow-md');
      header.classList.remove('py-3');
      header.classList.add('py-5');
    }

    // 2. Scroll Progress Bar
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollY / docHeight) * 100;
    scrollProgressBar.style.width = scrollPercent + '%';

    // 3. Back-To-Top Button Visibility
    if (scrollY > 500) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
    }

    // 4. Active Nav Link Highlighter
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
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
  });

  // Smooth scroll back to top on button click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   MOBILE MENU DRAWER
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

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
  const words = [
    'Software Engineering Undergraduate',
    'Tech Enthusiast & Learner',
    'Full-Stack Developer Developer',
    'NSBM Green University Student'
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting characters
      typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      // Typing characters
      typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // Checking word boundaries
    if (!isDeleting && charIndex === currentWord.length) {
      // Finished typing, wait before starting delete
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next word
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing
  if (typingTextElement) {
    type();
  }
}

/* ==========================================
   INTERACTIVE PROJECTS FILTERING
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button styling
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-white', 'shadow-lg', 'shadow-cyan-500/30');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      btn.classList.add('bg-cyan-500', 'text-white', 'shadow-lg', 'shadow-cyan-500/30');

      const filterValue = btn.getAttribute('data-filter');

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(10px)';
          // Add hidden class after transition completes
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
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
      // Simulate form submission (e.g. AJAX)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending Message...';

      // Simulate a small delay for premium UX
      setTimeout(() => {
        showToast('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
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
  
  // Create container if it doesn't exist
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  // Assign styling icons and colors based on notification type
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

  // Trigger animations
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    // Remove element after transition completes
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}
