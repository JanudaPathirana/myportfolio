document.addEventListener('DOMContentLoaded', () => {
  // Core initializations
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initTypingEffect();
  initProjectFilters();
  initGitHubProjects();
  initContactForm();
  initCurrentYear();

  // 3D & Visual Interactive Enhancements
  init3DTilt();
  initThreeHeroCanvas();
});

/* ==========================================
   0.3 THEME TOGGLE SYSTEM (Fixed & Robust)
   Supports Class Strategy, Data-Theme, and LocalStorage
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  if (!themeToggleBtn) return;

  function applyTheme(theme, showFeedback = false) {
    const isDark = theme === 'dark';
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.setAttribute('aria-pressed', 'true');
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');

      themeToggleLightIcon?.classList.remove('hidden');
      themeToggleDarkIcon?.classList.add('hidden');

      localStorage.setItem('theme', 'dark');
      localStorage.setItem('color-theme', 'dark');
      if (showFeedback) showToast('Switched to Dark Mode', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggleBtn.setAttribute('aria-pressed', 'false');
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');

      themeToggleLightIcon?.classList.add('hidden');
      themeToggleDarkIcon?.classList.remove('hidden');

      localStorage.setItem('theme', 'light');
      localStorage.setItem('color-theme', 'light');
      if (showFeedback) showToast('Switched to Light Mode', 'info');
    }
  }

  // Determine current theme setting from localStorage or system preference
  const savedTheme = localStorage.getItem('theme') || localStorage.getItem('color-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme, false);

  // Toggle button event listener
  themeToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isCurrentlyDark = document.documentElement.classList.contains('dark') || 
                            document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isCurrentlyDark ? 'light' : 'dark', true);
  });

  // Listen for system theme changes if user has not set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme') && !localStorage.getItem('color-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });
}

/* ==========================================
   SCROLL EFFECTS (Header shadow, Active Link, Progress, Back-To-Top)
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
      if (scrollY > 30) {
        header.classList.add('shadow-md', 'py-3.5');
        header.classList.remove('py-5');
      } else {
        header.classList.remove('shadow-md', 'py-3.5');
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
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-nav');
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

  onScroll();

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
    'Aspiring Software Engineer',
    'Python & Java Learner',
    'Full-Stack Web Enthusiast'
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
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
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px) scale(0.97)';
          setTimeout(() => {
            card.style.display = 'none';
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/* ==========================================
   9. GITHUB ACTIVITY INTEGRATION
   Fetches public repos from JanudaPathirana
   ========================================== */
async function initGitHubProjects() {
  const container = document.getElementById('github-repos-container');
  if (!container) return;

  try {
    const response = await fetch('https://api.github.com/users/JanudaPathirana/repos?sort=updated&per_page=6');
    
    if (!response.ok) {
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const repos = await response.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      renderFallbackRepos(container);
      return;
    }

    container.innerHTML = '';
    repos.slice(0, 6).forEach(repo => {
      const card = document.createElement('div');
      card.className = 'card-surface p-6 flex flex-col justify-between';
      
      const languageBadge = repo.language 
        ? `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
             <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${repo.language}
           </span>`
        : '';

      card.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <i class="fab fa-github text-xl text-slate-700 dark:text-slate-300"></i>
            ${languageBadge}
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white truncate">
            ${repo.name}
          </h4>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            ${repo.description || 'Public software repository on GitHub.'}
          </p>
        </div>
        <div class="flex items-center justify-between pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
          <span class="flex items-center gap-1">
            <i class="fas fa-star text-amber-500"></i> ${repo.stargazers_count}
          </span>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View Repo <i class="fas fa-external-link-alt text-[10px]"></i>
          </a>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.info('GitHub API fetch bypassed (using static repository data):', error.message);
    renderFallbackRepos(container);
  }
}

function renderFallbackRepos(container) {
  const verifiedRepos = [
    {
      name: 'myportfolio',
      desc: 'Modern personal developer portfolio website built with HTML, CSS, JavaScript, and Tailwind CSS.',
      lang: 'JavaScript',
      url: 'https://github.com/JanudaPathirana/myportfolio'
    },
    {
      name: 'News-Desk',
      desc: 'Responsive web application project aggregating and presenting categorized news articles.',
      lang: 'HTML / JS',
      url: 'https://github.com/JanudaPathirana/News-Desk'
    },
    {
      name: 'hotel-billing-system',
      desc: 'Python console application for calculating invoices, managing inventory items, and billing.',
      lang: 'Python',
      url: 'https://github.com/JanudaPathirana'
    }
  ];

  container.innerHTML = '';
  verifiedRepos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'card-surface p-6 flex flex-col justify-between';
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <i class="fab fa-github text-xl text-slate-700 dark:text-slate-300"></i>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            ${repo.lang}
          </span>
        </div>
        <h4 class="text-base font-bold text-slate-900 dark:text-white">
          ${repo.name}
        </h4>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ${repo.desc}
        </p>
      </div>
      <div class="pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800 text-right">
        <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
          View on GitHub <i class="fas fa-external-link-alt text-[10px]"></i>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
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

    resetInputValidation(nameInput);
    resetInputValidation(emailInput);
    resetInputValidation(subjectInput);
    resetInputValidation(messageInput);

    if (!nameInput.value.trim()) {
      setInputError(nameInput, 'Name is required');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      setInputError(emailInput, 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      setInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      setInputError(subjectInput, 'Subject is required');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      setInputError(messageInput, 'Message is required');
      isValid = false;
    }

    if (isValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

      // Simulates sending with professional toast feedback
      setTimeout(() => {
        showToast('Thank you! Your message has been received.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1000);
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
   DYNAMIC YEAR IN FOOTER
   ========================================== */
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
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
    iconClass = 'fas fa-info-circle text-emerald-500';
  }

  toast.innerHTML = `
    <i class="${iconClass} text-base"></i>
    <span class="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
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

    // Particle Constellation
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

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
      color: 0x10b981,
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
    function animate() {
      requestAnimationFrame(animate);

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
    console.warn('Three.js canvas initialized in fallback mode:', err);
  }
}
