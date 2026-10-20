/* ==========================================================
   main.js — Scroll animations, mobile nav, form, WhatsApp
   JCG InfraTech
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. Tema claro / oscuro ── */
  const html         = document.documentElement;
  const themeBtn     = document.getElementById('theme-toggle');
  const STORAGE_KEY  = 'jcg_theme';

  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  const storage = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
  };

  const applyTheme = (theme, animate = true) => {
    if (animate) html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    if (animate) setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  };

  // Solo se guarda la elección explícita; sin ella se sigue al sistema
  applyTheme(storage.get(STORAGE_KEY) || getSystemTheme(), false);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      storage.set(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!storage.get(STORAGE_KEY)) applyTheme(e.matches ? 'light' : 'dark');
  });

  /* ── 1. Fade-up on scroll ── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach((el) => fadeObserver.observe(el));

  /* ── 2. Mobile nav toggle ── */
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    const setMenu = (isOpen) => {
      navLinks.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
      spans[1].style.opacity   = isOpen ? '0' : '';
      spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    };

    toggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    // Escape y toque fuera del menú también lo cierran
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !e.target.closest('nav')) setMenu(false);
    });
  }

  /* ── 3. Active nav link on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          if (a.getAttribute('href') === `#${entry.target.id}`) {
            a.setAttribute('aria-current', 'location');
          } else {
            a.removeAttribute('aria-current');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── 4. Medición GA4 ── */
  const track = (name, params = {}) => {
    if (typeof gtag === 'function') gtag('event', name, params);
  };

  // Clics declarados en el HTML: data-track="evento" data-track-location="ubicación" [data-track-cta="nombre"]
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    const params = { link_location: el.dataset.trackLocation || 'desconocido' };
    if (el.dataset.trackCta) params.cta_name = el.dataset.trackCta;
    track(el.dataset.track, params);
  });

  // Recorrido: una vez por sección y visita (embudo servicios → contacto)
  const seenSections = new Set();
  const sectionViewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !seenSections.has(entry.target.id)) {
        seenSections.add(entry.target.id);
        track('section_view', { section_name: entry.target.id });
        sectionViewObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((s) => { if (s.id !== 'hero') sectionViewObserver.observe(s); });

  /* ── 5. Formspree AJAX submission ── */
  const form = document.getElementById('contact-form');
  if (form) {
    const successMsg = form.querySelector('.form-success');
    const errorMsg   = form.querySelector('.form-error');
    const submitBtn  = form.querySelector('.form-submit');

    // Nombre propio: GA4 ya usa form_start/form_submit en la medición mejorada
    form.addEventListener('focusin', () => {
      track('lead_form_start', { form_name: 'contacto' });
    }, { once: true });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const service = form.elements.servicio.value || 'sin_especificar';

      submitBtn.disabled = true;
      submitBtn.querySelector('.form-submit__text').textContent = 'Enviando...';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          form.reset();
          successMsg.hidden = false;
          errorMsg.hidden   = true;
          submitBtn.querySelector('.form-submit__text').textContent = '¡Enviado!';
          track('generate_lead', { form_name: 'contacto', service });
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.form-submit__text').textContent = 'Enviar consulta';
            successMsg.hidden = true;
          }, 5000);
        } else {
          throw new Error('server error');
        }
      } catch (err) {
        track('lead_form_error', { form_name: 'contacto', service, error_type: err.message === 'server error' ? 'servidor' : 'red' });
        errorMsg.hidden   = false;
        successMsg.hidden = true;
        submitBtn.disabled = false;
        submitBtn.querySelector('.form-submit__text').textContent = 'Enviar consulta';
      }
    });
  }

});
