/* ==========================================================================
   MAIN.JS — Lógica de la página principal (index.html)

   Funcionalidades:
   - Menú desplegable (toggle + cierre al clic exterior)
   - Filtrado interactivo de historias por categoría
   - Navegación entre vistas internas (inicio ↔ legales)
   - Enrutamiento por hash para enlaces externos (#privacy, #terms, #cookies)
   - Validación del formulario de suscripción
   - Botón "volver arriba"
   ========================================================================== */

(function () {
  'use strict';

  /* ── Referencias al DOM ───────────────────────────────────────────────── */
  var menu        = document.getElementById('main-menu');
  var menuToggle  = document.getElementById('menu-toggle');
  var homeView    = document.getElementById('home-view');
  var filterStatus = document.getElementById('filter-status');
  var footerMessage = document.getElementById('footer-message');
  var topButton   = document.getElementById('top-button');


  /* ── Menú desplegable ─────────────────────────────────────────────────── */
  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });


/* ── Carrusel dinámico del Hero ────────────────────────────────────────── */
  function initHeroCarousel() {
    var heroSection  = document.getElementById('hero-section');
    var categoryChip = document.getElementById('hero-category');
    var titleEl      = document.getElementById('hero-title');
    var excerptEl    = document.getElementById('hero-excerpt');
    var linkBtn      = document.getElementById('hero-link');
    var dotsContainer = document.getElementById('hero-dots');

    if (!heroSection || !titleEl) return;

    function getStoriesFromGrid() {
      var cards = document.querySelectorAll('#story-grid .story-card');
      var list = [];

      cards.forEach(function (card) {
        var imgEl = card.querySelector('img');
        var category = card.getAttribute('data-category') || (card.querySelector('.story-meta') ? card.querySelector('.story-meta').textContent : 'Misterio');
        var title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
        var excerpt = card.getAttribute('data-excerpt') || (card.querySelector('p') ? card.querySelector('p').textContent : '');
        var image = card.getAttribute('data-image') || (imgEl ? imgEl.getAttribute('src') : 'images/taxista.jpg');
        var link = card.getAttribute('href') || '#';

        if (title && link && link !== '#') {
          list.push({
            category: category,
            title: title,
            excerpt: excerpt,
            image: image,
            link: link
          });
        }
      });

      return list;
    }

    var stories = getStoriesFromGrid();

    // Fallback si no hay historias válidas en el grid
    if (stories.length === 0) {
      stories.push({
        category: 'Misterio',
        title: 'El taxista se negó a llevarme y entonces descubrí por qué...',
        excerpt: 'Una noche, una dirección y un silencio que parecía saber mucho más de lo que decía.',
        image: 'images/taxista.jpg',
        link: 'historia-taxista.html'
      });
    }

    var currentIndex = 0;
    var intervalId = null;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      if (stories.length > 1) {
        stories.forEach(function (_, index) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'hero-dot' + (index === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Ir a diapositiva ' + (index + 1));
          dot.addEventListener('click', function () {
            goToSlide(index);
            resetTimer();
          });
          dotsContainer.appendChild(dot);
        });
      }
    }

    function renderSlide(index) {
      var item = stories[index];
      if (!item) return;

      heroSection.style.backgroundImage =
        "linear-gradient(135deg, rgba(20,20,20,.88), rgba(20,20,20,.38)), url('" + item.image + "')";

      if (categoryChip) categoryChip.textContent = item.category;
      if (titleEl) titleEl.textContent = item.title;
      if (excerptEl) excerptEl.textContent = item.excerpt;
      if (linkBtn) linkBtn.setAttribute('href', item.link);

      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.hero-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === index);
        });
      }
    }

    function goToSlide(index) {
      currentIndex = index;
      renderSlide(currentIndex);
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % stories.length;
      renderSlide(currentIndex);
    }

    function startTimer() {
      if (stories.length > 1 && !intervalId) {
        intervalId = setInterval(nextSlide, 4500);
      }
    }

    function resetTimer() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      startTimer();
    }

    renderSlide(0);
    startTimer();
  }

  // Inicializar carrusel del Hero
  initHeroCarousel();

  /* ── Sistema de vistas (inicio ↔ legales) ─────────────────────────────── */
  function showView(viewId) {
    var allViews = document.querySelectorAll('.view');
    allViews.forEach(function (v) {
      v.classList.toggle('is-active', v.id === viewId);
    });
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showHome() {
    showView('home-view');
    // Limpiar el hash de la URL al volver al inicio
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
  }

  function showStories() {
    if (!homeView.classList.contains('is-active')) {
      showView('home-view');
    }
    closeMenu();
    setTimeout(function () {
      document.getElementById('stories-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }


  /* ── Enrutamiento por hash (para enlaces desde páginas de historias) ──── */
  // Permite que enlaces como index.html#privacy abran la vista legal correcta
  function handleHash() {
    var hash = window.location.hash.replace('#', '');
    if (hash === 'privacy')  showView('legal-privacy-view');
    else if (hash === 'terms')   showView('legal-terms-view');
    else if (hash === 'cookies') showView('legal-cookies-view');
    // Para otros hashes (#stories-section, #site-footer), el navegador
    // maneja el scroll nativo automáticamente
  }

  window.addEventListener('hashchange', handleHash);
  // Comprobar hash al cargar la página
  if (window.location.hash) {
    handleHash();
  }


  /* ── Filtrado interactivo de historias por categoría ───────────────────── */
  function filterStories(category) {
    // Asegurar vista de inicio activa
    if (!homeView.classList.contains('is-active')) {
      showView('home-view');
    }

    var cards = document.querySelectorAll('.story-card');
    var count = 0;

    cards.forEach(function (card) {
      var match = category === 'all' || card.getAttribute('data-category') === category;
      card.hidden = !match;
      if (match) count++;
    });

    // Actualizar estado visual de los botones de filtro
    document.querySelectorAll('.filter-button').forEach(function (btn) {
      btn.classList.toggle('is-selected', btn.getAttribute('data-filter') === category);
    });

    // Actualizar mensaje de estado (accesible via aria-live)
    if (category === 'all') {
      filterStatus.textContent = 'Mostrando todas las historias.';
    } else {
      filterStatus.textContent =
        'Filtro activo: ' + category + '. ' +
        count + ' historia' + (count === 1 ? '' : 's') +
        ' visible' + (count === 1 ? '' : 's') + '.';
    }

    closeMenu();
    setTimeout(function () {
      document.getElementById('stories-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }


  /* ── Delegación de eventos (acciones + filtros) ──────────────────────── */
  document.addEventListener('click', function (e) {
    // --- Botones de acción (data-action) ---
    var actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      var action = actionEl.getAttribute('data-action');

      if (action === 'home')    showHome();
      if (action === 'stories') showStories();
      if (action === 'contact') {
        closeMenu();
        document.getElementById('site-footer').scrollIntoView({ behavior: 'smooth' });
      }

      // Páginas legales
      if (action === 'privacy') {
        showView('legal-privacy-view');
        history.replaceState(null, '', '#privacy');
      }
      if (action === 'terms') {
        showView('legal-terms-view');
        history.replaceState(null, '', '#terms');
      }
      if (action === 'cookies') {
        showView('legal-cookies-view');
        history.replaceState(null, '', '#cookies');
      }

      // Volver atrás desde una página legal
      if (action === 'legal-back') showHome();
    }

    // --- Botones de filtro (data-filter) ---
    var filterEl = e.target.closest('[data-filter]');
    if (filterEl) {
      filterStories(filterEl.getAttribute('data-filter'));
    }
  });


  /* ── Formulario de suscripción ────────────────────────────────────────── */
  var subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email   = document.getElementById('email');
      var message = document.getElementById('subscribe-message');

      if (!email.value.trim() || !email.validity.valid) {
        message.textContent = 'Escribe un correo electrónico válido para continuar.';
        email.focus();
        return;
      }

      /* ────────────────────────────────────────────────────────────────
         TODO: Conectar con servicio real de email marketing.

         Opción A — Netlify Forms:
           Añade el atributo netlify al <form> y Netlify lo gestiona.

         Opción B — Mailchimp / SendGrid / etc.:
           Envía un POST a la API del servicio con el email capturado.

         Opción C — Google Sheets:
           Usa un Apps Script como endpoint para guardar los emails.
         ──────────────────────────────────────────────────────────────── */
      message.textContent = '¡Gracias! Tu correo ha sido registrado.';
      email.value = '';
    });
  }


  /* ── Botón "volver arriba" ────────────────────────────────────────────── */
  window.addEventListener('scroll', function () {
    topButton.classList.toggle('is-visible', window.scrollY > 420);
  }, { passive: true });

  topButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
