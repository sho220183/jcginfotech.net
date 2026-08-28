/* ==========================================================
   main.js — Scroll animations, mobile nav, form, WhatsApp
   JCG InfraTech
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform  = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity    = '0';
        spans[2].style.transform  = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform  = '';
        spans[1].style.opacity    = '';
        spans[2].style.transform  = '';
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        toggle.querySelectorAll('span').forEach((s) => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });
  }

  /* ── 3. Active nav link on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${entry.target.id}`) {
            a.style.color = 'var(--color-cyan)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── 4. WhatsApp badge — hide after click (cookie) ── */
  const waBadge = document.querySelector('.whatsapp-badge');
  const waLink  = document.querySelector('.whatsapp-float');

  if (waBadge && waLink) {
    // Check if user already clicked WA before
    const waSeen = localStorage.getItem('wa_badge_seen');
    if (waSeen) {
      waBadge.style.display = 'none';
    }

    waLink.addEventListener('click', () => {
      localStorage.setItem('wa_badge_seen', '1');
      waBadge.style.display = 'none';
      // GA4 — click en WhatsApp
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', { event_category: 'contacto', event_label: 'boton_flotante' });
      }
    });
  }

  /* ── 5. Formspree AJAX submission ── */
  const form = document.getElementById('contact-form');
  if (form) {
    const successMsg = form.querySelector('.form-success');
    const errorMsg   = form.querySelector('.form-error');
    const submitBtn  = form.querySelector('.form-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

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
          // GA4 — formulario enviado
          if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', { event_category: 'contacto', event_label: 'formulario_web' });
          }
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.form-submit__text').textContent = 'Enviar consulta';
            successMsg.hidden = true;
          }, 5000);
        } else {
          throw new Error('server error');
        }
      } catch {
        errorMsg.hidden   = false;
        successMsg.hidden = true;
        submitBtn.disabled = false;
        submitBtn.querySelector('.form-submit__text').textContent = 'Enviar consulta';
      }
    });
  }

});
