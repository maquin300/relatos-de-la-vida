/* ==========================================================================
   STORY.JS — Lógica de las páginas de historias individuales

   Funcionalidades:
   - Menú desplegable (toggle + cierre al clic exterior)
   - Botón CTA (muro de pago / desbloqueo de contenido)
   - Botón "volver arriba"

   Este archivo se carga en plantilla.html y en cada historia individual
   (historia-taxista.html, historia-ejemplo.html, etc.)
   ========================================================================== */

(function () {
  'use strict';

  /* ── Menú desplegable ─────────────────────────────────────────────────── */
  var menu       = document.getElementById('main-menu');
  var menuToggle = document.getElementById('menu-toggle');

  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });


  /* ══════════════════════════════════════════════════════════════════════════
     BOTÓN CTA — DESBLOQUEO DE CONTENIDO

     La función handleUnlock() se ejecuta cuando el usuario hace clic en
     el botón "Continuar leyendo la historia".

     ─── INSTRUCCIONES PARA CONECTAR CON PUBLICIDAD ───

     Modifica el cuerpo de esta función según tu plataforma elegida:

     OPCIÓN A — Redirigir a un enlace publicitario (Content Locker):
       window.location.href = 'https://tu-red-publicitaria.com/oferta?id=123';

     OPCIÓN B — Abrir enlace en nueva pestaña y luego desbloquear:
       window.open('https://tu-red-publicitaria.com/oferta', '_blank');
       desbloquearContenido();  // Llama a la función de abajo

     OPCIÓN C — Cargar un script de monetización dinámicamente:
       var script = document.createElement('script');
       script.src = 'https://cdn.monetizacion.com/locker.js';
       script.onload = function() { initLocker(); };
       document.head.appendChild(script);

     OPCIÓN D — Mostrar un interstitial / popup antes de desbloquear:
       mostrarInterstitial(function onComplete() {
         desbloquearContenido();
       });
     ══════════════════════════════════════════════════════════════════════════ */

  /* ── Visibilidad progresiva de la barra fija (IntersectionObserver) ──── */
  var isUnlocked = false;
  var stickyBar = document.getElementById('sticky-paywall-bar');
  var lockedContent = document.getElementById('locked-content') || document.querySelector('.locked-content');

  function showPaywallBar() {
    if (!isUnlocked && stickyBar) {
      stickyBar.classList.add('is-visible');
    }
  }

  function hidePaywallBar() {
    if (stickyBar) {
      stickyBar.classList.remove('is-visible');
    }
  }

  if (lockedContent && stickyBar) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!isUnlocked && entry.isIntersecting) {
            showPaywallBar();
          }
        });
      }, {
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.01
      });
      observer.observe(lockedContent);
    } else {
      // Fallback para navegadores sin IntersectionObserver
      window.addEventListener('scroll', function () {
        if (!isUnlocked && lockedContent) {
          var rect = lockedContent.getBoundingClientRect();
          if (rect.top <= window.innerHeight) {
            showPaywallBar();
          }
        }
      }, { passive: true });
    }
  }

  function desbloquearContenido() {
    isUnlocked = true;
    hidePaywallBar();

    // Quitar el desenfoque y habilitar la interacción en todo el contenido posterior
    var lockedElements = document.querySelectorAll('.locked-content');
    lockedElements.forEach(function (el) {
      el.classList.add('is-unlocked');
    });

    if (stickyBar) {
      stickyBar.style.display = 'none';
    }
  }

  function handleUnlock() {
    var adsterraSmartlink = 'https://www.profitableratecpmnetwork.com/cf25ffarrp?key=607d267fdb95d3bf7e03b7eee228a38';
    window.open(adsterraSmartlink, '_blank');
    desbloquearContenido();
  }

  var unlockBtn = document.getElementById('unlock-button');
  if (unlockBtn) {
    unlockBtn.addEventListener('click', handleUnlock);
  }


  /* ── Sistema Aleatorio Automático de Historias Recomendadas ───────────── */
  function initRecommendedStories() {
    var recGrid = document.getElementById('recommended-grid');
    var recSection = recGrid ? recGrid.closest('.recommended-section') : null;
    if (!recGrid) return;

    var currentFile = window.location.pathname.split('/').pop().toLowerCase() || 'plantilla.html';

    // Registro estático con las historias reales existentes en el sitio (fallback robusto para entorno local file://)
    var realStoriesRegistry = [
      {
        category: 'Misterio',
        title: 'El taxista se negó a llevarme',
        excerpt: 'Una noche, una dirección y un silencio que parecía saber mucho más de lo que decía...',
        image: 'images/taxista.jpg',
        link: 'historia-taxista.html'
      },
      {
        category: 'Reflexión',
        title: 'El giro inesperado en la cocina',
        excerpt: 'El turno de la noche en el restaurante olía a cansancio, hasta que una visita sorpresa cambió todo...',
        image: 'images/cocina-fogong.jpg',
        link: 'historia-turno-noche.html'
      }
    ];

    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    function renderCards(stories) {
      // Exclusión estricta de la historia actual que el usuario está leyendo
      var filtered = stories.filter(function (item) {
        if (!item || !item.link) return false;
        var linkFile = item.link.split('/').pop().toLowerCase();
        return linkFile && linkFile !== currentFile && linkFile !== '#' && linkFile !== 'plantilla.html';
      });

      recGrid.innerHTML = '';

      if (filtered.length === 0) {
        if (recSection) recSection.style.display = 'none';
        return;
      }

      if (recSection) recSection.style.display = '';

      // Inyección garantizada de 1 o 2 historias alternativas reales
      var selected = shuffleArray(filtered).slice(0, 2);

      selected.forEach(function (story) {
        var card = document.createElement('a');
        card.className = 'story-card';
        card.href = story.link;
        card.setAttribute('data-category', story.category);
        card.setAttribute('data-image', story.image);

        var img = document.createElement('img');
        img.src = story.image;
        img.alt = story.title;
        img.className = 'thumbnail';

        var meta = document.createElement('span');
        meta.className = 'story-meta';
        meta.textContent = story.category;

        var title = document.createElement('h3');
        title.textContent = story.title;

        var excerpt = document.createElement('p');
        excerpt.textContent = story.excerpt;

        card.appendChild(img);
        card.appendChild(meta);
        card.appendChild(title);
        card.appendChild(excerpt);

        recGrid.appendChild(card);
      });
    }

    // Intentar leer historias dinámicamente desde index.html
    fetch('index.html')
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(function (htmlText) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlText, 'text/html');
        var cards = doc.querySelectorAll('#story-grid .story-card');
        var parsedStories = [];

        cards.forEach(function (card) {
          var imgEl = card.querySelector('img');
          var category = card.getAttribute('data-category') || (card.querySelector('.story-meta') ? card.querySelector('.story-meta').textContent : 'Misterio');
          var title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
          var excerpt = card.getAttribute('data-excerpt') || (card.querySelector('p') ? card.querySelector('p').textContent : '');
          var image = card.getAttribute('data-image') || (imgEl ? imgEl.getAttribute('src') : 'images/taxista.jpg');
          var link = card.getAttribute('href') || '#';

          if (title && link && link !== '#' && link !== 'plantilla.html') {
            parsedStories.push({
              category: category,
              title: title,
              excerpt: excerpt,
              image: image,
              link: link
            });
          }
        });

        // Combinar historias indexadas con el registro real para máxima cobertura
        var combinedMap = {};
        parsedStories.concat(realStoriesRegistry).forEach(function (item) {
          var key = item.link.split('/').pop().toLowerCase();
          if (key && !combinedMap[key]) {
            combinedMap[key] = item;
          }
        });

        var allStories = Object.keys(combinedMap).map(function (k) { return combinedMap[k]; });
        renderCards(allStories);
      })
      .catch(function () {
        // Fallback garantizado en entorno local (file://) o sin servidor
        renderCards(realStoriesRegistry);
      });
  }

  // Inicializar recomendaciones dinámicas
  initRecommendedStories();

  /* ── Botón "volver arriba" ────────────────────────────────────────────── */
  var topButton = document.getElementById('top-button');
  if (topButton) {
    window.addEventListener('scroll', function () {
      topButton.classList.toggle('is-visible', window.scrollY > 420);
    }, { passive: true });

    topButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
