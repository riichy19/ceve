// ====== UI core: año, tema, reveal, progreso, toTop, navbar blur, ripple, scrollspy ======
document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const yEl = document.getElementById('y');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // ---- Tema (claro/oscuro) con persistencia ----
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-bs-theme', initial);
  updateThemeIcon(initial);
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          html.setAttribute('data-bs-theme', next);
          localStorage.setItem('theme', next);
          updateThemeIcon(next);
        });
      } else {
        html.setAttribute('data-bs-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
      }
    });
  }
  function updateThemeIcon(mode) {
    if (!themeBtn) return;
    themeBtn.innerHTML = mode === 'dark'
      ? '<i class="bi bi-moon-stars"></i><span class="d-none d-sm-inline"> Oscuro</span>'
      : '<i class="bi bi-brightness-high"></i><span class="d-none d-sm-inline"> Claro</span>';
  }

  // ---- Reveal en scroll ----
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // ---- Scrollspy & navegación activa ----
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;
    let currentId = '';
    const offset = 120;
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top - offset <= 0) currentId = sec.id;
    });
    navLinks.forEach(a => {
      const id = a.getAttribute('href').replace('#','');
      a.classList.toggle('active', id === currentId);
    });
  }

  // ---- Progreso lectura + toTop + navbar blur ----
  const progressBar = document.querySelector('#scrollProgress .bar');
  const toTop = document.getElementById('toTop');
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (toTop) (scrolled > 600) ? toTop.classList.add('show') : toTop.classList.remove('show');
    if (navbar) (scrolled > 8) ? navbar.classList.add('is-scrolled') : navbar.classList.remove('is-scrolled');
    updateActiveNav();
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Botones: ripple effect ----
  document.querySelectorAll('.btn-raise').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ---- Imagen hero: micro parallax ----
  const avatar = document.querySelector('.avatar.interactive');
  if (avatar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const strength = 8;
    avatar.addEventListener('mousemove', (e) => {
      const r = avatar.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      avatar.style.transform = `translate(${x*strength}px, ${y*strength}px) scale(1.02)`;
    });
    avatar.addEventListener('mouseleave', () => { avatar.style.transform = ''; });
  }

  // ---- Tooltips (opcional) ----
  if (window.bootstrap) {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  }

  // ====== Feed Social ======
  const FEED_KEY = 'ra-feed-v1';
  const feedEl = document.getElementById('feedList');
  const publishBtn = document.getElementById('publishBtn');
  const composerText = document.getElementById('composerText');
  const composerImage = document.getElementById('composerImage');
  const addStoryBtn = document.getElementById('addStoryBtn');
  const charCount = document.getElementById('charCount');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  // Seed inicial (adaptado a tus proyectos reales)
  const seed = [
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 12,
      text: 'Refactor del Sistema Multi-Inventario: endpoints más limpios, nuevos índices en MySQL y dashboard con gráficos mensuales.',
      likes: 14, comments: 3, liked: false,
      tags: ['#Node', '#MySQL', '#CleanCode']
    },
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 36,
      text: 'Implementé 2FA en Angular con envío de tokens por SMS/Email + módulo de reset. Backend Node y SQL Server.',
      likes: 23, comments: 5, liked: true,
      tags: ['#Angular', '#2FA', '#Node', '#SQLServer']
    },
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 72,
      text: 'Pipeline de automatización: descarga SFTP, unzip, conversión a CSV y carga a DB. Scripts en Node + Linux Ubuntu.',
      likes: 19, comments: 2, liked: false,
      tags: ['#Automatización', '#SFTP', '#CSV', '#Linux']
    },
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 96,
      text: 'Proyecto tipo Twitter (Udemy): auth, timeline y seguidores con Node + MongoDB. Tests de endpoints con Postman.',
      likes: 31, comments: 6, liked: false,
      tags: ['#MongoDB', '#Node', '#Postman']
    }
  ];

  let posts = loadPosts();

  // Render inicial
  renderFeed(posts);

  // Composer: autosize + contador + publicar
  if (composerText) {
    autoResize(composerText);
    composerText.addEventListener('input', () => {
      const len = composerText.value.length;
      charCount.textContent = `${len}/280`;
      charCount.classList.toggle('text-danger', len > 260);
      publishBtn.disabled = len === 0;
      autoResize(composerText);
    });
    composerText.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter' && !publishBtn.disabled) {
        e.preventDefault();
        publish();
      }
    });
  }
  if (publishBtn) publishBtn.addEventListener('click', publish);

  // Adjuntar imagen (simple)
  document.getElementById('btnAttach')?.addEventListener('click', () => composerImage.click());
  if (composerImage) {
    composerImage.addEventListener('change', () => {
      // Nota: para demo, solo mostramos que hay imagen adjunta.
      if (composerImage.files?.length) {
        toast('Imagen adjunta lista para publicar.');
      }
    });
  }
  // Etiquetas rápidas
  document.getElementById('btnTag')?.addEventListener('click', () => {
    const tag = prompt('Agrega una etiqueta (sin #):');
    if (tag) {
      const cur = composerText.value.trim();
      composerText.value = (cur + ' #' + tag.replace(/\s+/g, '')).trim() + ' ';
      composerText.dispatchEvent(new Event('input'));
    }
  });

  // Stories: por ahora, un placeholder para interacción
  if (addStoryBtn) {
    addStoryBtn.addEventListener('click', () => toast('Historias editables próximamente.'));
  }

  // Delegación de eventos del feed
  feedEl?.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.btn-like');
    const img = e.target.closest('[data-img-src]');
    const cmToggle = e.target.closest('[data-cm-toggle]');
    if (likeBtn) toggleLike(likeBtn);
    if (img) openImage(img.getAttribute('data-img-src') || '');
    if (cmToggle) toggleComments(cmToggle);
  });

  // Cargar más
  loadMoreBtn?.addEventListener('click', () => {
    showSkeletons(2);
    setTimeout(() => {
      const more = [
        {
          id: cryptoRandomId(),
          author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
          time: Date.now() - 1000 * 60 * 15,
          text: 'Pequeña mejora de performance: cache selectiva y compresión de respuestas en Node.',
          likes: 5, comments: 0, liked: false,
          tags: ['#Performance', '#Node']
        },
        {
          id: cryptoRandomId(),
          author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
          time: Date.now() - 1000 * 60 * 50,
          text: 'Snippet CSS: skeleton loaders accesibles y con prefers-reduced-motion.',
          likes: 8, comments: 1, liked: false,
          tags: ['#CSS', '#A11y']
        }
      ];
      posts = [...more, ...posts];
      savePosts(posts);
      renderFeed(posts);
    }, 650);
  });

  // ====== Helpers del Feed ======
  function publish() {
    const text = composerText.value.trim();
    if (!text) return;
    const newPost = {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: '../client/img/traje.png' },
      time: Date.now(),
      text,
      likes: 0, comments: 0, liked: false,
      tags: extractTags(text)
    };
    const file = composerImage.files?.[0];
    if (file) {
      // Demo: no subimos, mostramos en modal al abrir
      newPost.image = URL.createObjectURL(file);
      composerImage.value = '';
    }
    posts = [newPost, ...posts];
    savePosts(posts);
    renderFeed(posts);
    composerText.value = '';
    composerText.dispatchEvent(new Event('input'));
    toast('Publicado ✨');
  }

  function toggleLike(btn) {
    const id = btn.getAttribute('data-id');
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return;
    const p = posts[idx];
    p.liked = !p.liked;
    p.likes += p.liked ? 1 : -1;
    savePosts(posts);
    // Actualiza UI del card
    const likeCountEl = btn.querySelector('[data-like-count]');
    likeCountEl.textContent = p.likes;
    btn.classList.toggle('liked', p.liked);
    btn.setAttribute('aria-pressed', String(p.liked));
  }

  function toggleComments(btn) {
    const id = btn.getAttribute('data-id');
    const el = document.getElementById('cm-' + id);
    if (!el) return;
    const isShown = el.classList.contains('show');
    if (window.bootstrap) {
      const c = bootstrap.Collapse.getOrCreateInstance(el);
      isShown ? c.hide() : c.show();
    } else {
      el.classList.toggle('show');
    }
  }

  function openImage(src) {
    const img = document.getElementById('imgModalSrc');
    if (!img) return;
    img.src = src;
    if (window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance('#imgModal').show();
    }
  }

  // ====== Chatbot ======
  const chatToggle = document.getElementById('chatToggle');
  const chatWidget = document.getElementById('chatWidget');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatSuggestions = document.getElementById('chatSuggestions');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const contactEmail = 'ricardo.alexis031299@gmail.com';
  const emailLink = `<a href="mailto:${contactEmail}">${contactEmail}</a>`;
  const cvLink = './client/cv/CV%20OCTUBRE%202025%20Titulo%20en%20Proceso.pdf';
  const cvAnchor = `<a href="${cvLink}" target="_blank" rel="noopener">descargar el CV en PDF</a>`;
  // Extiende sugerencias base sin romper compatibilidad con el array existente
  try {
    window.__baseSuggestionsPlus = (Array.isArray(baseSuggestions)
      ? baseSuggestions.concat(['Ver certificados', 'Tu especializacion'])
      : ['Ver certificados', 'Tu especializacion']);
  } catch { /* no-op */ }
  const baseSuggestions = [
    'Resúmeme tu experiencia',
    'Muéstrame tus proyectos',
    '¿Cuáles son tus habilidades?',
    '¿Cómo te contacto?'
  ];
  const fallbackReplies = [
    'Mi conocimiento se centra en la información del portafolio: experiencia, proyectos, habilidades y formas de contacto. ¿Qué tema quieres explorar?',
    'No tengo datos de ese tema fuera del sitio, pero sí puedo contarte sobre proyectos destacados, habilidades, logros y contacto.',
    'La página resume proyectos, stack tecnológico, logros y cómo contactar a Ricardo. ¿Te gustaría profundizar en alguno?'
  ];
  const knowledgeBase = [
    {
      id: 'overview',
      regex: /(quien eres|quien es ricardo|sobre ti|sobre mi|presentate|presentacion|descripcion general|que haces|resumen general)/,
      answer: 'Ricardo Alexis es un desarrollador de software full stack con foco en Node.js, Angular, automatización de procesos y bases de datos SQL/NoSQL. Disfruta diseñar arquitecturas modulares, documentar buenas prácticas y acompañar la adopción tecnológica con equipos multidisciplinarios.',
      suggestions: ['Resúmeme tu experiencia', 'Muéstrame tus proyectos', '¿Cuáles son tus habilidades?']
    },
    {
      id: 'experience',
      regex: /(experiencia|trayectoria|perfil profesional|anos de experiencia|años de experiencia|senioridad|full stack jr)/,
      answer: 'El portafolio destaca 1+ año de experiencia con más de 20 proyectos entregados como Full Stack Jr. Está disponible para proyectos y combina un enfoque tranquilo con pensamiento sistémico para resolver problemas reales.',
      suggestions: ['¿Qué logros recientes tienes?', 'Muéstrame tus proyectos destacados', '¿Cómo te contacto?']
    },
    {
      id: 'skills',
      regex: /(habilidad|skills|stack|tecnolog|lenguaj|herramient|framework|tool|capacidades)/,
      answer: 'Las habilidades incluyen lenguajes y core como Java, Python, PHP, JavaScript, HTML, CSS y Node.js; bases de datos MySQL, MariaDB, SQL Server, MongoDB y Cassandra; frameworks y herramientas como Angular, Bootstrap, Express, XAMPP, Postman y Git; además de metodologías REST, Clean Code, Scrum, Testing y CI/CD.',
      suggestions: ['¿Qué tecnologías base usas?', 'Muéstrame tus proyectos destacados', '¿Dónde puedo descargar tu CV?']
    },
    {
      id: 'stack-base',
      regex: /(tecnologias base|stack base|base tecnologica|tech base|chips)/,
      answer: 'Las tecnologías base resaltadas son Node.js, Angular, SQL Server, MongoDB, AWS S3, Linux Ubuntu y automatización, tal como se muestra en las chips del portafolio.',
      suggestions: ['¿Qué habilidades tienes?', 'Cuéntame de tus proyectos destacados', '¿Cómo te contacto?']
    },
    {
      id: 'services',
      regex: /(servicio|que ofreces|en que ayudas|servicios clave|ofreces|tipo de trabajo)/,
      answer: 'Los servicios clave incluyen diseño de plataformas web corporativas, APIs e integraciones y microservicios en Node.js, automatización de flujos y orquestación de datos, además de seguridad, monitoreo y documentación técnica.',
      suggestions: ['Muéstrame tus proyectos destacados', '¿Qué logros recientes tienes?', '¿Cómo te contacto?']
    },
    {
      id: 'highlights',
      regex: /(logro|reciente|ultimos hitos|timeline|novedades|actualmente)/,
      answer: 'Los logros recientes incluyen la migración de datos automatizada con SFTP y scripts Node.js en 2025, un dashboard analítico para inventarios en 2024 y la autenticación 2FA corporativa en Angular también en 2024.',
      suggestions: ['Muéstrame tus proyectos destacados', '¿Qué habilidades tienes?', '¿Cómo te contacto?']
    },
    {
      id: 'projects-multi',
      regex: /(multi inventario|inventario|insumos|tickets|uniparts|compras)/,
      answer: 'El Sistema Multi-Inventario (junio-octubre 2024 con UNIPARTS S.A de C.V.) ofrece consultas en tiempo real para tickets, compras, usuarios y equipos asignados. Incluye dashboards mensuales, control de accesos y automatización de workflows con Node.js, MySQL, Bootstrap y XAMPP.',
      suggestions: ['¿Tienes proyectos de seguridad?', 'Cuéntame de la automatización de archivos', '¿Cómo te contacto?']
    },
    {
      id: 'projects-2fa',
      regex: /(2fa|doble factor|seguridad|token|autenticacion)/,
      answer: 'La implementación de autenticación 2FA en Angular (julio-agosto 2025 para Grupo GABSSA) gestiona registro y validación con doble factor, tokens enviados por SMS y correo, un módulo de recuperación y auditoría de accesos. El backend usa Node.js y SQL Server con almacenamiento seguro.',
      suggestions: ['Cuéntame del Sistema Multi-Inventario', '¿Qué habilidades tienes?', '¿Cómo te contacto?']
    },
    {
      id: 'projects-automation',
      regex: /(automatizacion|sftp|transferencia de archivos|csv|orquestacion|pipelines?)/,
      answer: 'La Transferencia y Automatización de archivos (2025, Grupo GABSSA) mueve grandes volúmenes de información en entornos Linux con pipelines en Node.js y SFTP. Automatiza descargas, unzip, conversión a CSV, cargas a bases corporativas e integra Amazon S3 con monitoreo y alertas.',
      suggestions: ['¿Tienes proyectos de seguridad?', 'Muéstrame otra solución destacada', '¿Cómo te contacto?']
    },
    {
      id: 'projects-social',
      regex: /(red social|twitter|seguidores|timeline|udemy)/,
      answer: 'El Proyecto Red Social (agosto-noviembre 2024, curso Udemy) replica una plataforma tipo Twitter con autenticación, timeline y gestión de seguidores. El backend usa Node.js y MongoDB, con pruebas de endpoints realizadas en Postman.',
      suggestions: ['¿Qué habilidades tienes?', 'Cuéntame del Sistema Multi-Inventario', '¿Cómo te contacto?']
    },
    {
      id: 'projects-bitacora',
      regex: /(bitacora|prestaciones|recursos humanos|rh)/,
      answer: 'La Bitácora de prestaciones (enero-marzo 2025 con UNIPARTS) es una aplicación web para Recursos Humanos orientada a registrar y seguir prestaciones de ley, con UI responsiva, reportes de auditoría, recuperación de datos e integración mediante XAMPP.',
      suggestions: ['¿Tienes más proyectos?', '¿Qué habilidades tienes?', '¿Cómo te contacto?']
    },
    {
      id: 'projects-arcade',
      regex: /(shark|arcade|cassandra|maquina)/,
      answer: 'El juego de arcade Shark (2023) gestiona registro, consulta y validación de puntos de jugadores con Node.js y Cassandra. Incluye validaciones por IP local, respaldos ante pérdida de datos y un panel administrativo accesible y seguro.',
      suggestions: ['¿Qué otras soluciones has creado?', '¿Qué habilidades tienes?', '¿Cómo te contacto?']
    },
    {
      id: 'projects-general',
      regex: /(proyecto|portafolio|caso de exito|trabajos realizados|soluciones)/,
      answer: 'Los proyectos destacados abarcan inventarios corporativos, autenticación 2FA, automatización de archivos en Linux, una red social estilo Twitter, una bitácora de prestaciones para RH y un juego arcade con Cassandra. Puedo darte detalles de cualquiera.',
      suggestions: ['Cuéntame del Sistema Multi-Inventario', '¿Tienes proyectos de seguridad?', '¿Cómo te contacto?']
    },
    {
      id: 'feed',
      regex: /(feed|timeline|publicacion|posts|historias|story|blog|red social interna)/,
      answer: 'El feed simula una red social con historias destacadas, publicaciones con métricas, etiquetas y acciones como me gusta, compartir y un compositor con contador de caracteres e inserción de imágenes.',
      suggestions: ['¿Qué proyectos destacas?', '¿Qué habilidades tienes?', '¿Cómo te contacto?']
    },
    {
      id: 'contact',
      regex: /(contacto|comunicarnos|escribirte|hablar contigo|agend|coordinemos|mandarte mensaje)/,
      answer: `Puedes contactarlo por correo en ${emailLink} y en la sección de contacto del sitio se invita a agendar una llamada para nuevos proyectos.`,
      allowHTML: true,
      suggestions: ['¿Cómo agendamos un proyecto?', 'Muéstrame tus proyectos destacados', '¿Qué habilidades tienes?']
    },
    {
      id: 'availability',
      regex: /(disponible|contratar|colaborar|trabajo contigo|sumarte|agenda)/,
      answer: 'Ricardo está disponible para proyectos, especialmente con equipos que valoran la documentación, tienen impacto en operaciones o inteligencia de negocio y trabajan de forma remota o híbrida.',
      suggestions: ['¿Cómo te contacto?', 'Muéstrame tus proyectos destacados', '¿Qué habilidades tienes?']
    },
    {
      id: 'resources',
      regex: /(recursos|github|linkedin|enlaces|links)/,
      answer: 'En la tarjeta de recursos puedes acceder a sus perfiles de GitHub y LinkedIn, además del enlace directo al correo electrónico.',
      suggestions: ['¿Cómo te contacto?', '¿Qué habilidades tienes?', 'Muéstrame tus proyectos destacados']
    },
    {
      id: 'location',
      regex: /(donde estas|ubicacion|pais|mexico|radicas|resides)/,
      answer: 'Actualmente opera desde México y está abierto a colaboraciones remotas o híbridas, según se menciona en el portafolio.',
      suggestions: ['¿Cómo te contacto?', 'Muéstrame tus proyectos destacados', '¿Qué logros recientes tienes?']
    }
  ];
  // Normalización de textos del chatbot (acentos y eñes)
  const FALLBACK_REPLIES_NORM = [
    'Mi conocimiento se centra en la información del portafolio: experiencia, proyectos, habilidades y formas de contacto. ¿Qué tema quieres explorar?',
    'No tengo datos de ese tema fuera del sitio, pero sí puedo contarte sobre proyectos destacados, habilidades, logros y contacto.',
    'La página resume proyectos, stack tecnológico, logros y cómo contactar a Ricardo. ¿Te gustaría profundizar en alguno?'
  ];
  function normalizeChatText() {
    const map = {
      overview: 'Ricardo Alexis es un desarrollador de software full stack con foco en Node.js, Angular, automatización de procesos y bases de datos SQL/NoSQL. Disfruta diseñar arquitecturas modulares, documentar buenas prácticas y acompañar la adopción tecnológica con equipos multidisciplinarios.',
      experience: 'El portafolio destaca 1+ año de experiencia con más de 20 proyectos entregados como Full Stack Jr. Está disponible para proyectos y combina un enfoque tranquilo con pensamiento sistémico para resolver problemas reales.',
      skills: 'Las habilidades incluyen lenguajes y core como Java, Python, PHP, JavaScript, HTML, CSS y Node.js; bases de datos MySQL, MariaDB, SQL Server, MongoDB y Cassandra; frameworks y herramientas como Angular, Bootstrap, Express, XAMPP, Postman y Git; además de metodologías REST, Clean Code, Scrum, Testing y CI/CD.',
      'stack-base': 'Las tecnologías base resaltadas son Node.js, Angular, SQL Server, MongoDB, AWS S3, Linux Ubuntu y automatización, tal como se muestra en las chips del portafolio.',
      services: 'Los servicios clave incluyen diseño de plataformas web corporativas, APIs e integraciones y microservicios en Node.js, automatización de flujos y orquestación de datos, además de seguridad, monitoreo y documentación técnica.',
      highlights: 'Los logros recientes incluyen la migración de datos automatizada con SFTP y scripts Node.js en 2025, un dashboard analítico para inventarios en 2024 y la autenticación 2FA corporativa en Angular también en 2024.',
      'projects-multi': 'El Sistema Multi-Inventario (junio–octubre 2024, UNIPARTS S.A. de C.V.) ofrece consultas en tiempo real para tickets, compras, usuarios y equipos asignados. Incluye dashboards mensuales, control de accesos y automatización de workflows con Node.js, MySQL, Bootstrap y XAMPP.',
      'projects-2fa': 'La implementación de autenticación 2FA en Angular (julio–agosto 2025, Grupo GABSSA) gestiona registro y validación con doble factor, tokens enviados por SMS y correo, un módulo de recuperación y auditoría de accesos. El backend usa Node.js y SQL Server con almacenamiento seguro.',
      'projects-automation': 'La Transferencia y Automatización de archivos (2025, Grupo GABSSA) mueve grandes volúmenes de información en entornos Linux con pipelines en Node.js y SFTP. Automatiza descargas, unzip, conversión a CSV, cargas a bases corporativas e integra Amazon S3 con monitoreo y alertas.',
      'projects-social': 'El Proyecto Red Social (agosto–noviembre 2024, curso Udemy) replica una plataforma tipo Twitter con autenticación, timeline y gestión de seguidores. El backend usa Node.js y MongoDB, con pruebas de endpoints realizadas en Postman.',
      'projects-bitacora': 'La Bitácora de prestaciones (enero–marzo 2025, UNIPARTS) es una aplicación web para Recursos Humanos orientada a registrar y seguir prestaciones de ley, con UI responsiva, reportes de auditoría, recuperación de datos e integración mediante XAMPP.',
      'projects-arcade': 'El juego de arcade Shark (2023) gestiona registro, consulta y validación de puntos de jugadores con Node.js y Cassandra. Incluye validaciones por IP local, respaldos ante pérdida de datos y un panel administrativo accesible y seguro.',
      'projects-general': 'Los proyectos destacados abarcan inventarios corporativos, autenticación 2FA, automatización de archivos en Linux, una red social estilo Twitter, una bitácora de prestaciones para RH y un juego arcade con Cassandra. Puedo darte detalles de cualquiera.',
      feed: 'El feed simula una red social con historias destacadas, publicaciones con métricas, etiquetas y acciones como me gusta, compartir y un compositor con contador de caracteres e inserción de imágenes.',
      contact: `Puedes contactarlo por correo en ${emailLink} y, en la sección de contacto del sitio, se invita a agendar una llamada para nuevos proyectos.`,
      availability: 'Ricardo está disponible para proyectos, especialmente con equipos que valoran la documentación, tienen impacto en operaciones o inteligencia de negocio y trabajan de forma remota o híbrida.',
      resources: 'En la tarjeta de recursos puedes acceder a sus perfiles de GitHub y LinkedIn, además del enlace directo al correo electrónico.',
      location: 'Actualmente opera desde México y está abierto a colaboraciones remotas o híbridas, según se menciona en el portafolio.'
    };
    try { knowledgeBase.forEach(e => { if (map[e.id]) e.answer = map[e.id]; }); } catch {}
  }
  normalizeChatText();
  // Extiende sugerencias por defecto con nuevas entradas visibles en el sitio
  if (Array.isArray(baseSuggestions)) {
    try { baseSuggestions.push('Ver certificados', 'Tu especialización'); } catch {}
  }
  let chatInitialized = false;
  let autoOpenTriggered = false;
  let emailShared = false;
  let chatTransitionHandler = null;
  let typingRow = null;

  if (chatWidget) {
    chatWidget.setAttribute('aria-hidden', 'true');
    document.body.classList.add('has-chat');
  }

  function appendMessage(sender, message, allowHTML = false) {
    if (!chatMessages) return null;
    const row = document.createElement('div');
    row.className = `chat-message ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (allowHTML) {
      bubble.innerHTML = message;
    } else {
      bubble.textContent = message;
    }
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return row;
  }

  function setSuggestions(items = []) {
    if (!chatSuggestions) return;
    chatSuggestions.innerHTML = '';
    if (!items.length) {
      chatSuggestions.hidden = true;
      return;
    }
    const frag = document.createDocumentFragment();
    items.forEach(text => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = text;
      btn.addEventListener('click', () => handleSuggestion(text));
      frag.appendChild(btn);
    });
    chatSuggestions.appendChild(frag);
    chatSuggestions.hidden = false;
  }

  function clearSuggestions() {
    setSuggestions([]);
  }

  function handleSuggestion(text) {
    appendMessage('user', text);
    processChatInput(text);
    chatInput?.focus();
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showTyping() {
    if (!chatMessages || typingRow) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    typingRow = appendMessage('bot', '<span class="typing-dots"><span></span><span></span><span></span></span>', true);
    typingRow?.querySelector('.chat-bubble')?.classList.add('is-typing');
  }

  function hideTyping() {
    if (typingRow) {
      typingRow.remove();
      typingRow = null;
    }
  }

  function respondWithDelay(message, options = {}) {
    const { allowHTML = false } = options;
    const suggestionsOption = Object.prototype.hasOwnProperty.call(options, 'suggestions')
      ? options.suggestions
      : (window.__baseSuggestionsPlus || baseSuggestions);
    const delay = Math.min(1400, 420 + message.length * 15);
    showTyping();
    setTimeout(() => {
      hideTyping();
      appendMessage('bot', message, allowHTML);
      if (Array.isArray(suggestionsOption)) {
        if (suggestionsOption.length) {
          setSuggestions(suggestionsOption);
        } else {
          clearSuggestions();
        }
      } else if (suggestionsOption === false) {
        clearSuggestions();
      } else {
        setSuggestions(baseSuggestions);
      }
    }, delay);
  }

  function primeChat() {
    if (chatInitialized) return;
    chatInitialized = true;
    respondWithDelay('¡Hola! Soy el asistente virtual de Ricardo Alexis. Puedo contarte sobre su experiencia, proyectos, habilidades o cómo contactarlo. ¿Qué te gustaría saber?', {
      suggestions: (window.__baseSuggestionsPlus || baseSuggestions)
    });
  }

  function openChat() {
    if (!chatWidget) return;
    if (chatWidget.classList.contains('is-active')) {
      chatInput?.focus();
      return;
    }
    primeChat();
    if (chatTransitionHandler) {
      chatWidget.removeEventListener('transitionend', chatTransitionHandler);
      chatTransitionHandler = null;
    }
    chatWidget.hidden = false;
    chatWidget.setAttribute('aria-hidden', 'false');
    chatToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('chat-open');
    requestAnimationFrame(() => {
      chatWidget.classList.add('is-active');
      chatInput?.focus();
    });
  }

  function closeChat() {
    if (!chatWidget || !chatWidget.classList.contains('is-active')) return;
    chatWidget.classList.remove('is-active');
    chatWidget.setAttribute('aria-hidden', 'true');
    chatToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('chat-open');

    chatTransitionHandler = (event) => {
      if (event.target !== chatWidget || event.propertyName !== 'opacity') return;
      chatWidget.hidden = true;
      chatWidget.removeEventListener('transitionend', chatTransitionHandler);
      chatTransitionHandler = null;
    };
    chatWidget.addEventListener('transitionend', chatTransitionHandler);
  }

  function sanitizeText(text) {
    try {
      return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch {
      return text;
    }
  }

  function handlePhoneRequest() {
    respondWithDelay('Por ahora no tengo un número telefónico disponible. Prefiero coordinar por correo y agendamos con gusto.', {
      suggestions: ['¿Cuál es tu correo?', '¿Qué proyectos tienes?']
    });
  }

  function shareEmail() {
    const message = emailShared
      ? `Ya te había compartido mi correo: ${emailLink}.`
      : `Puedes escribirme directamente a ${emailLink} y coordinamos detalles.`;
    emailShared = true;
    respondWithDelay(message, {
      allowHTML: true,
      suggestions: ['¿Cómo agendamos un proyecto?', 'Muéstrame tus proyectos destacados', '¿Qué habilidades tienes?']
    });
  }

  function shareCv() {
    respondWithDelay(`Puedes ${cvAnchor} desde esta página para revisar la trayectoria completa.`, {
      allowHTML: true,
      suggestions: ['¿Qué habilidades dominas?', '¿Cómo te contacto?', 'Muéstrame tus proyectos destacados']
    });
  }

  function findKnowledge(text) {
    return knowledgeBase.find(entry => entry.regex.test(text)) || null;
  }

  function processChatInput(rawMessage) {
    const normalized = rawMessage.toLowerCase();
    const sanitized = sanitizeText(normalized).trim();
    if (!sanitized) return;

    clearSuggestions();

    if (/^(hola|buenos dias|buen dia|buenas tardes|buenas noches|hey|que tal|saludos)$/.test(sanitized)) {
      respondWithDelay('¡Hola! Estoy listo para ayudarte con la información del portafolio: experiencia, proyectos, habilidades y contacto.', {
        suggestions: (window.__baseSuggestionsPlus || baseSuggestions)
      });
      return;
    }

    if (/^(como estas|que tal estas|todo bien)$/.test(sanitized)) {
      respondWithDelay('¡Todo bien! Este asistente responde con base en el contenido del portafolio de Ricardo. Pregúntame sobre proyectos, habilidades o formas de contacto.', {
        suggestions: (window.__baseSuggestionsPlus || baseSuggestions)
      });
      return;
    }

    if (/^(gracias|muchas gracias|mil gracias|thank you|thanks)$/.test(sanitized)) {
      respondWithDelay('¡Con gusto! Si quieres saber más sobre proyectos, habilidades o cómo contactarlo, sólo dime.', {
        suggestions: (window.__baseSuggestionsPlus || baseSuggestions)
      });
      return;
    }

    if (/^(adios|hasta luego|nos vemos|bye|hasta pronto)$/.test(sanitized)) {
      respondWithDelay(`¡Hasta luego! Si necesitas retomar la conversación puedes escribirme a ${emailLink}.`, {
        allowHTML: true,
        suggestions: false
      });
      return;
    }

    if (/(tel|phone|cel|numero)/.test(sanitized)) {
      handlePhoneRequest();
      return;
    }

    if (/(correo|mail|email)/.test(sanitized)) {
      shareEmail();
      return;
    }

    if (/(cv|curriculum|hoja de vida|resume)/.test(sanitized)) {
      shareCv();
      return;
    }

    // Certificados y especializacion (respuestas con datos del DOM si existen)
    if (/(certificado|certificados|certificacion|certificaciones|diploma|diplomas)/.test(sanitized)) {
      shareCertificates();
      return;
    }
    if (/(especialidad|especializacion|en que te especializas|cual es tu especialidad)/.test(sanitized)) {
      shareSpecialization();
      return;
    }

    const knowledge = findKnowledge(sanitized);
    if (knowledge) {
      respondWithDelay(knowledge.answer, {
        allowHTML: knowledge.allowHTML,
        suggestions: knowledge.suggestions
      });
      return;
    }

    respondWithDelay(randomItem(FALLBACK_REPLIES_NORM), {
      suggestions: (window.__baseSuggestionsPlus || baseSuggestions)
    });
  }

  function shareCertificates() {
    const html = buildCertificatesHtml();
    respondWithDelay(html, { allowHTML: true, suggestions: ['Tu especializacion', 'Mostrar proyectos', 'Contacto'] });
  }

  function shareSpecialization() {
    const text = getSpecializationText();
    respondWithDelay(text, { suggestions: ['Ver certificados', 'Mostrar proyectos', 'Contacto'] });
  }

  function buildCertificatesHtml() {
    try {
      const cards = Array.from(document.querySelectorAll('#certificados .card'));
      if (!cards.length) throw new Error('no-cards');
      const items = cards.slice(0, 6).map(card => {
        const title = card.querySelector('h3')?.textContent?.trim() || 'Certificado';
        const link = card.querySelector('a[href]')?.getAttribute('href') || '#';
        return `<li><a href="${link}" target="_blank" rel="noopener">${escapeHTML(title)}</a></li>`;
      }).join('');
      return `<div><strong>Certificados:</strong><ul>${items}</ul></div>`;
    } catch {
      return `<div><strong>Certificados:</strong><ul>
        <li><a href="./client/img/Programacion_fullstack_Escritorio.png" target="_blank" rel="noopener">Programacion Full Stack (Escritorio)</a></li>
        <li><a href="./client/img/Inteligencia_Artificial_aplicada_negocios_empresas.png" target="_blank" rel="noopener">IA aplicada a negocios y empresas</a></li>
        <li><a href="./client/img/Master_node.png" target="_blank" rel="noopener">Master en Node.js</a></li>
        <li><a href="./client/img/desarrolloweb.png" target="_blank" rel="noopener">Desarrollo Web Completo</a></li>
      </ul></div>`;
    }
  }

  function getSpecializationText() {
    const p = document.querySelector('#certificados p');
    const fallback = 'Ingeniero en Sistemas Computacionales con especialización en Tecnologías de Desarrollo para Sistemas Web.';
    return (p?.textContent?.trim() || fallback);
  }

  chatToggle?.addEventListener('click', () => {
    if (!chatWidget) return;
    chatWidget.hidden ? openChat() : closeChat();
  });

  chatClose?.addEventListener('click', closeChat);

  chatForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!chatInput) return;
    const value = chatInput.value.trim();
    if (!value) return;
    appendMessage('user', value);
    chatInput.value = '';
    processChatInput(value);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !chatWidget?.hidden) {
      closeChat();
    }
  });

  const triggerAutoOpen = () => {
    if (autoOpenTriggered) return;
    autoOpenTriggered = true;
    openChat();
  };

  ['pointerdown', 'keydown'].forEach(evt => document.addEventListener(evt, triggerAutoOpen, { once: true }));
  document.addEventListener('scroll', triggerAutoOpen, { once: true, passive: true });

  function renderFeed(list) {
    if (!feedEl) return;
    feedEl.innerHTML = list.map(renderPost).join('');
  }

  function renderPost(p) {
    const time = timeAgo(p.time);
    const tags = (p.tags || []).map(t => `<a href="#" class="chip" role="button">${escapeHTML(t)}</a>`).join(' ');
    const image = p.image ? `
      <div class="mt-2">
        <img src="${p.image}" class="img-fluid rounded-3" alt="Imagen adjunta" data-img-src="${p.image}" style="cursor: zoom-in;">
      </div>` : '';
    return `
      <article class="card feed-card" data-id="${p.id}">
        <div class="card-body">
          <div class="author">
            <div>
              <div class="d-flex align-items-center gap-2">
                <span class="fw-semibold">${escapeHTML(p.author.name)}</span>
                <span class="text-body-secondary">${escapeHTML(p.author.handle)}</span>
                <span class="meta">· ${time}</span>
              </div>
            </div>
          </div>
          <div class="content">${linkify(escapeHTML(p.text))}</div>
          ${tags ? `<div class="tags">${tags}</div>` : ''}
          ${image}
          <div class="action-bar">
            <button class="btn-action btn-like ${p.liked ? 'liked' : ''}" data-id="${p.id}" aria-pressed="${p.liked}" aria-label="Me gusta">
              <i class="bi bi-heart"></i> <span data-like-count>${p.likes}</span>
            </button>
            <button class="btn-action" data-cm-toggle data-id="${p.id}" aria-controls="cm-${p.id}" aria-expanded="false">
              <i class="bi bi-chat-dots"></i> <span>${p.comments}</span>
            </button>
            <button class="btn-action" onclick="navigator.clipboard?.writeText(window.location.href + '#${p.id}')">
              <i class="bi bi-link-45deg"></i> <span>Compartir</span>
            </button>
          </div>
          <div class="collapse mt-2" id="cm-${p.id}">
            <div class="border rounded-3 p-3 text-body-secondary small">Comentarios próximamente.</div>
          </div>
        </div>
      </article>
    `;
  }

  function showSkeletons(n=2) {
    if (!feedEl) return;
    const frag = document.createDocumentFragment();
    for (let i=0;i<n;i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton';
      frag.appendChild(sk);
    }
    feedEl.prepend(frag);
    setTimeout(() => {
      document.querySelectorAll('.skeleton').forEach(el => el.remove());
    }, 700);
  }

  function extractTags(text) {
    const tags = (text.match(/#\w+/g) || []).slice(0, 6);
    return Array.from(new Set(tags));
  }

  function timeAgo(ts) {
    const diff = Date.now() - (typeof ts === 'number' ? ts : new Date(ts).getTime());
    const s = Math.floor(diff/1000);
    if (s < 60) return 'ahora';
    const m = Math.floor(s/60);
    if (m < 60) return `hace ${m}m`;
    const h = Math.floor(m/60);
    if (h < 24) return `hace ${h}h`;
    const d = Math.floor(h/24);
    return `hace ${d}d`;
  }

  function linkify(text) {
    return text
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" class="link-muted">$1</a>')
      .replace(/#(\w+)/g, '<a href="#" class="link-muted">#$1</a>');
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function savePosts(arr) { localStorage.setItem(FEED_KEY, JSON.stringify(arr)); }
  function loadPosts() {
    try {
      const raw = localStorage.getItem(FEED_KEY);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(FEED_KEY, JSON.stringify(seed));
      return seed;
    } catch { return seed; }
  }

  function cryptoRandomId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function autoResize(ta) {
    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 560) + 'px'; };
    ta.addEventListener('input', fit); fit();
  }

  function toast(msg) {
    // Simple mini-toast accesible
    const el = document.createElement('div');
    el.role = 'status';
    el.ariaLive = 'polite';
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);padding:.5rem .75rem;background:var(--bs-body-bg);border:1px solid var(--bs-border-color);border-radius:.5rem;box-shadow:var(--shadow-2);z-index:2000;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
});
