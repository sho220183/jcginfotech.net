/* ==========================================================
   main.js — Scroll animations & mobile nav toggle
   JCG Info Tech
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Fade-up on scroll (Intersection Observer) ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Small stagger so sibling elements don't all fire at once
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

  /* ── Mobile nav toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');

      // ARIA state
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.querySelectorAll('span').forEach((s) => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });
  }

  /* ── Smooth active-link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
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

});

  /* ── Formspree AJAX submission ── */
  const form = document.getElementById('contact-form');
  if (form) {
    const successMsg = form.querySelector('.form-success');
    const errorMsg   = form.querySelector('.form-error');
    const submitBtn  = form.querySelector('.form-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Visual loading state
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
          // Reset button after 4s
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.form-submit__text').textContent = 'Enviar consulta';
          }, 4000);
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
