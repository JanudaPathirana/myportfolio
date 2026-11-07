document.addEventListener('DOMContentLoaded', () => {
  // Core website initializations
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initTypingEffect();
  initProjectFilters();
  initContactForm();

  // 3D & Visual Interactive Enhancements
  init3DTilt();
  initThreeHeroCanvas();
});

/* ==========================================
   THEME TOGGLE SYSTEM (NSBM Emerald / Forest)
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  if (!themeToggleBtn) return;

  // Determine current theme setting from localStorage or system preference
  const savedTheme = localStorage.getItem('color-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon?.classList.remove('hidden');
    themeToggleDarkIcon?.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleLightIcon?.classList.add('hidden');
    themeToggleDarkIcon?.classList.remove('hidden');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
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

    // Trigger visual canvas update if Three.js is active
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
  });
}

/* ==========================================
   SCROLL EFFECTS (Header, Active Link, Progress, Back-To-Top)
   ========================================== */
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;
    
    // 1. Header background elevation
    if (header) {
      if (scrollY > 40) {
        header.classList.add('shadow-md', 'py-3');
        header.classList.remove('py-5');
      } else {
        header.classList.remove('shadow-md', 'py-3');
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
      if (scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8');
      }
    }

    // 4. Active Nav Link Highlighter
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-emerald-600', 'dark:text-emerald-400', 'font-semibold', 'active-nav');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-emerald-600', 'dark:text-emerald-400', 'font-semibold', 'active-nav');
          }
        });
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  onScroll();

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
    'Computer Science Undergraduate',
    'Full-Stack Developer',
    'Python & Backend Developer',
    'Algorithmic Problem Solver'
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================
   PROJECT CARDS FILTERING
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow-lg', 'shadow-emerald-600/30');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      btn.classList.add('bg-emerald-600', 'text-white', 'shadow-lg', 'shadow-emerald-600/30');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });
}

/* ==========================================
   INTERACTIVE 3D CARD TILT & MOUSE TRACKING
   ========================================== */
function init3DTilt() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) return;

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    let bounds = null;
    let rAF = null;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.12s ease-out';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xNorm = mouseX / bounds.width;
      const yNorm = mouseY / bounds.height;

      const maxTilt = 10;
      const tiltX = (yNorm - 0.5) * -maxTilt;
      const tiltY = (xNorm - 0.5) * maxTilt;

      if (rAF) cancelAnimationFrame(rAF);

      rAF = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.02)`;
        
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${xNorm * 100}% ${yNorm * 100}%, rgba(16, 185, 129, 0.2) 0%, transparent 65%)`;
          glare.style.opacity = '1';
        }
      });
    }

    function onMouseLeave() {
      bounds = null;
      if (rAF) cancelAnimationFrame(rAF);

      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      
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
   THREE.JS 3D HERO CONSTELLATION CANVAS
   ========================================== */
function initThreeHeroCanvas() {
  // Graceful fallback check: Ensure Three.js is loaded and WebGL supported
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('three-hero-canvas');
  if (!canvas) return;

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Constellation Geometry
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // NSBM Emerald Material
    const material = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 1.2,
      transparent: true,
      opacity: 0.65
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating 3D Geometric Ring
    const torusGeo = new THREE.TorusGeometry(12, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x008738,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(12, 0, -5);
    scene.add(torus);

    // Mouse Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    // Handle Window Resize
    function onResize() {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // Animation Loop
    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      particles.position.x = targetX * 6;
      particles.position.y = -targetY * 6;

      torus.rotation.x += 0.002;
      torus.rotation.y += 0.003;

      renderer.render(scene, camera);
    }

    animate();
  } catch (err) {
    // If WebGL fails, gracefully log without stopping standard page rendering
    console.warn('Three.js canvas initialized in fallback mode:', err);
  }
}

/* ==========================================
   CONTACT FORM VALIDATION
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
      }, 1200);
    } else {
      showToast('Please check the required fields in the form.', 'error');
    }
  });
}

function setInputError(input, message) {
  input.classList.add('border-red-500', 'focus:border-red-500');
  input.classList.remove('border-slate-200', 'dark:border-slate-700', 'focus:border-emerald-500');
  
  const helperText = input.nextElementSibling;
  if (helperText && helperText.classList.contains('error-message')) {
    helperText.textContent = message;
    helperText.classList.remove('hidden');
  }
}

function resetInputValidation(input) {
  input.classList.remove('border-red-500', 'focus:border-red-500');
  input.classList.add('border-slate-200', 'dark:border-slate-700', 'focus:border-emerald-500');
  
  const helperText = input.nextElementSibling;
  if (helperText && helperText.classList.contains('error-message')) {
    helperText.classList.add('hidden');
    helperText.textContent = '';
  }
}

/* ==========================================
   TOAST NOTIFICATION ENGINE (NSBM Green)
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
    iconClass = 'fas fa-info-circle text-emerald-500';
  }

  toast.innerHTML = `
    <i class="${iconClass} text-lg"></i>
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
    }, 350);
  }, 3800);
}
