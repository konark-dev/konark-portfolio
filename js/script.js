/**
 * Konark Agarwal — Portfolio Interactions & Usable Controls
 * Mobile drawer, project filters, preview modal, contact modal, copy-email, scroll-spy, back-to-top
 */

(() => {
  'use strict';

  // --- Dynamic Year ---
  const yearElements = document.querySelectorAll('#year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach((el) => {
    el.textContent = currentYear;
  });

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- Mobile Navigation Drawer & Hamburger ---
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  if (menuToggle && siteNav) {
    const toggleMenu = (open) => {
      const currentlyExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      const shouldOpen = open !== undefined ? open : !currentlyExpanded;
      menuToggle.setAttribute('aria-expanded', String(shouldOpen));
      siteNav.classList.toggle('open', shouldOpen);
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (siteNav.classList.contains('open') && !siteNav.contains(e.target) && e.target !== menuToggle) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // Legacy hamburger support for any secondary pages
  const legacyHamburger = document.querySelector('.hamburger');
  const legacyNavMenu = document.querySelector('.nav-menu');
  if (legacyHamburger && legacyNavMenu) {
    legacyHamburger.addEventListener('click', () => {
      legacyHamburger.classList.toggle('active');
      legacyNavMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        legacyHamburger.classList.remove('active');
        legacyNavMenu.classList.remove('active');
      });
    });
  }

  // --- Smooth Scroll Buttons (Back to Top & Explore) ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const scrollExploreBtn = document.getElementById('scrollExploreBtn');
  const heroExploreBtn = document.getElementById('heroExploreBtn');
  const scrollToWork = (e) => {
    const workSection = document.getElementById('work');
    if (workSection) {
      e.preventDefault();
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  if (scrollExploreBtn) scrollExploreBtn.addEventListener('click', scrollToWork);
  if (heroExploreBtn) heroExploreBtn.addEventListener('click', scrollToWork);

  // --- Active Nav Link Scroll-Spy ---
  const trackedSections = document.querySelectorAll('section[id], main[id]');
  const mainNavLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if ('IntersectionObserver' in window && trackedSections.length > 0 && mainNavLinks.length > 0) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            mainNavLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    trackedSections.forEach((sec) => spyObserver.observe(sec));
  }

  // --- Project Category Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.work-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        projectCards.forEach((card) => {
          const cat = card.getAttribute('data-category') || '';
          if (filter === 'all' || cat === filter) {
            card.classList.remove('is-hidden');
            card.classList.add('is-visible');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // --- Copy Email to Clipboard Button ---
  const copyButtons = document.querySelectorAll('#copyEmailBtn, .button-copy');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'konarkagarwal9999@gmail.com';
      let copied = false;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch (_) {}
      }

      if (!copied) {
        try {
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copied = true;
        } catch (err) {
          console.warn('Fallback copy error:', err);
        }
      }

      const toast = btn.querySelector('.copy-toast') || document.getElementById('copyToast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2200);
      }
    });
  });

  // --- Project Quick Preview Modal ---
  const projectData = {
    budget: {
      title: 'Glow Budget Dash',
      category: '01 / PERSONAL FINANCE · WEB PROJECT',
      image: 'assets/images/budget.png',
      desc: 'A finance dashboard concept exploring how personal spending can be presented with more clarity. Built as a hands-on exercise in interface structure, clear metrics, and useful information hierarchy.',
      chips: ['Dashboard', 'Frontend', 'Analytics', 'CSS Grid'],
      link: 'https://github.com/Konark-Agarwal/glow-budget-dash',
    },
    cook: {
      title: 'Cook Craft Flow',
      category: '02 / FOOD & DISCOVERY · WEB PROJECT',
      image: 'assets/images/cook.png',
      desc: 'A recipe-discovery experience exploring how people can move from “what should I make?” to a useful next step with structured culinary workflows, ingredient pairing, and precision timers.',
      chips: ['Web app', 'UX exploration', 'Interactive Flows', 'JavaScript'],
      link: 'https://github.com/Konark-Agarwal/cook-craft-flow',
      live: 'https://cook-craft-flow.vercel.app',
    },
    happy: {
      title: 'Her Happy Place',
      category: '03 / CREATIVE WEB · WEB PROJECT',
      image: 'assets/images/love.png',
      desc: 'A small, personal web experience focused on warmth, visual details, responsive layouts, and making a simple site feel deeply considered and emotionally engaging.',
      chips: ['Frontend', 'Visual design', 'Micro-interactions', 'Storytelling'],
      link: 'https://github.com/Konark-Agarwal/her-happy-place-site',
    },
    agriva: {
      title: 'AgriVa',
      category: '04 / AGRICULTURE TECH · WEB PROJECT',
      image: 'assets/images/budget.png',
      desc: 'An agri-tech platform built to bridge the gap between farmers and modern tools. Explores how technology can simplify access to resources, market data, and support for agricultural communities.',
      chips: ['JavaScript', 'Web app', 'AgriTech', 'Farmers'],
      link: 'https://github.com/konark-dev/AgriVa',
    },
    pramaanflow: {
      title: 'PramaanFlow',
      category: '05 / IDENTITY TECH · FULL-STACK PROJECT',
      image: 'assets/images/pramaanflow.png',
      desc: 'A document verification and identity flow system exploring how digital trust and seamless onboarding can be built for users in India. Built with TypeScript for reliability and scalability.',
      chips: ['TypeScript', 'Full-stack', 'Identity', 'Onboarding'],
      link: 'https://github.com/konark-dev/PramaanFlow',
      live: 'https://pramaanflow.vercel.app',
    },
    kisanflow: {
      title: 'Kisan Setu',
      category: '06 / AGRICULTURE TECH · WEB PROJECT',
      image: 'assets/images/kisansetu.png',
      desc: 'A farmer-centric web platform designed to streamline crop management, advisory services, and supply-chain visibility for Indian farmers. Bridging agricultural communities with modern digital tools.',
      chips: ['TypeScript', 'Web app', 'AgriTech', 'Supply chain', 'Farmers'],
      link: 'https://github.com/konark-dev/kisan-flow',
      live: 'https://kisansetu-ivory.vercel.app',
    },
  };

  const projectModal = document.getElementById('projectModal');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');

  const openProjectModal = (projectId) => {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    document.getElementById('modalProjectCategory').textContent = data.category;
    document.getElementById('modalProjectTitle').textContent = data.title;
    document.getElementById('modalProjectImg').src = data.image;
    document.getElementById('modalProjectImg').alt = `Screenshot of ${data.title}`;
    document.getElementById('modalProjectDesc').textContent = data.desc;

    const chipsContainer = document.getElementById('modalProjectChips');
    chipsContainer.innerHTML = '';
    data.chips.forEach((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      chipsContainer.appendChild(span);
    });

    const link = document.getElementById('modalProjectLink');
    link.href = data.link;

    const liveLink = document.getElementById('modalProjectLive');
    if (liveLink) {
      if (data.live) {
        liveLink.href = data.live;
        liveLink.style.display = 'inline-flex';
      } else {
        liveLink.style.display = 'none';
      }
    }

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.preview-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const proj = btn.getAttribute('data-project');
      if (proj) openProjectModal(proj);
    });
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // --- Quick Contact Message Modal ---
  const contactModal = document.getElementById('contactModal');
  const openContactModalBtn = document.getElementById('openContactModalBtn');
  const closeContactModalBtn = document.getElementById('closeContactModalBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const quickContactForm = document.getElementById('quickContactForm');
  const modalMessageStatus = document.getElementById('modalMessageStatus');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');

  const openContactModal = () => {
    if (!contactModal) return;
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstInput = contactModal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeContactModal = () => {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (openContactModalBtn) openContactModalBtn.addEventListener('click', openContactModal);
  if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', closeContactModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeContactModal);
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }

  // Escape key for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) closeProjectModal();
      if (contactModal && contactModal.classList.contains('open')) closeContactModal();
    }
  });

  // Modal contact form submit
  if (quickContactForm && modalMessageStatus && modalSubmitBtn) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (quickContactForm.querySelector('#modalName')?.value || '').trim();
      const email = (quickContactForm.querySelector('#modalEmail')?.value || '').trim();
      const subject = (quickContactForm.querySelector('#modalSubject')?.value || '').trim();
      const message = (quickContactForm.querySelector('#modalMessage')?.value || '').trim();

      if (!name || !email || !subject || !message) {
        modalMessageStatus.className = 'message-status error';
        modalMessageStatus.textContent = 'Please fill out all fields.';
        return;
      }

      modalSubmitBtn.classList.add('btn-loading');
      modalSubmitBtn.disabled = true;
      modalMessageStatus.className = 'message-status loading';
      modalMessageStatus.textContent = 'Sending message to Konark...';

      setTimeout(() => {
        modalSubmitBtn.classList.remove('btn-loading');
        modalSubmitBtn.disabled = false;
        modalMessageStatus.className = 'message-status success';
        modalMessageStatus.textContent = `Thank you, ${name}! Your note has been recorded. Konark will get back to you at ${email}.`;
        quickContactForm.reset();

        setTimeout(() => {
          closeContactModal();
          modalMessageStatus.className = 'message-status';
          modalMessageStatus.textContent = '';
        }, 3000);
      }, 700);
    });

    quickContactForm.addEventListener('input', () => {
      if (modalMessageStatus.classList.contains('error')) {
        modalMessageStatus.className = 'message-status';
        modalMessageStatus.textContent = '';
      }
    });
  }

  // --- Dedicated Page Contact Form (for contact.html) ---
  const contactForm = document.getElementById('contactForm');
  const messageStatus = document.getElementById('messageStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm && messageStatus && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').trim();
      const email = (formData.get('email') || '').trim();
      const subject = (formData.get('subject') || '').trim();
      const message = (formData.get('message') || '').trim();

      if (!name || !email || !subject || !message) {
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Please fill in all required fields.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        messageStatus.className = 'message-status error';
        messageStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
      messageStatus.className = 'message-status loading';
      messageStatus.textContent = 'Sending your message...';

      setTimeout(() => {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        messageStatus.className = 'message-status success';
        messageStatus.textContent = `Thank you, ${name}! Your message has been received. I'll get back to you soon.`;
        contactForm.reset();

        setTimeout(() => {
          messageStatus.style.display = 'none';
        }, 6000);
      }, 700);
    });

    contactForm.addEventListener('input', () => {
      if (messageStatus.classList.contains('error')) {
        messageStatus.className = 'message-status';
        messageStatus.textContent = '';
      }
    });
  }

  // --- Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }
})();