/* =========================================================
   OneSystec — configuración rápida
   ========================================================= */
const CONFIG = {
  LOGIN_URL: "#",                         // ← link de tu app de inicio de sesión
  CONTACT_EMAIL: "info@onesystec.com",
  WHATSAPP: "393923802297",               // número sin "+" ni espacios
  WHATSAPP_DISPLAY: "+39 392 380 2297",
  TEAM_WHATSAPP: {                        // ← número de cada persona del equipo (sin "+")
    es: "393514824263",                   //   Yan Gamonal · atención en español
    it: "393923802297",                   //   Emerson Gamonal · atención en italiano
    en: "393342016624"                    //   Mauro Agostinelli · atención en inglés
  },
  SOCIAL: {                               // ← pega aquí los links de las redes
    facebook: "#",
    instagram: "#",
    youtube: "#"
  },
  DEFAULT_LANG: "it",                     // idioma por defecto: italiano
  DEFAULT_THEME: "day",                   // day · night
  LANGS: ["it", "es", "en"],
  THEMES: ["day", "night"]
};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Contact links & social icons ---------- */
  const waHref = (num, msgLang) => `https://wa.me/${num || CONFIG.WHATSAPP}?text=${encodeURIComponent((msgLang && I18N[msgLang]["wa.msg"]) || t("wa.msg"))}`;
  $$(".js-login").forEach(a => {
    a.href = CONFIG.LOGIN_URL;
    if (/^https?:/.test(CONFIG.LOGIN_URL)) a.rel = "noopener";
  });
  $$(".js-mail").forEach(a => a.href = "mailto:" + CONFIG.CONTACT_EMAIL);
  $$(".js-mail-text").forEach(el => el.textContent = CONFIG.CONTACT_EMAIL);
  $$(".js-phone-text").forEach(el => el.textContent = CONFIG.WHATSAPP_DISPLAY);
  const nets = [
    ["facebook", "Facebook", CONFIG.SOCIAL.facebook],
    ["instagram", "Instagram", CONFIG.SOCIAL.instagram],
    ["youtube", "YouTube", CONFIG.SOCIAL.youtube],
    ["whatsapp", "WhatsApp", null],
    ["email", "Email", "mailto:" + CONFIG.CONTACT_EMAIL]
  ];
  $$("[data-social]").forEach(box => {
    box.innerHTML = nets.map(([id, label, url]) =>
      `<a data-net="${id}" ${id === "whatsapp" ? 'class="js-wa"' : `href="${url}"`} ${/^https?:/.test(url || "https") && id !== "email" ? 'target="_blank" rel="noopener"' : ""} aria-label="${label}" title="${label}"><svg viewBox="0 0 24 24"><use href="#i-${id}"/></svg></a>`
    ).join("");
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- i18n ---------- */
  let lang = CONFIG.DEFAULT_LANG;
  const qs = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem("osx-lang"); } catch (e) {}
  if (CONFIG.LANGS.includes(qs)) lang = qs;
  else if (CONFIG.LANGS.includes(saved)) lang = saved;

  const t = key => (I18N[lang] && I18N[lang][key]) ?? I18N[CONFIG.DEFAULT_LANG][key];

  function applyLang(next, animate) {
    lang = next;
    const run = () => {
      document.documentElement.lang = lang;
      $$("[data-i18n]").forEach(el => {
        const v = t(el.dataset.i18n);
        if (typeof v === "string") el.textContent = v;
      });
      $(".lang__cur").textContent = lang.toUpperCase();
      $$(".js-wa").forEach(a => a.href = waHref(a.dataset.member && CONFIG.TEAM_WHATSAPP[a.dataset.member], a.dataset.member));
      $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
      $$("[data-lang]").forEach(b => b.setAttribute("aria-current", b.dataset.lang === lang));
      startRotator();
      document.body.classList.remove("switching");
    };
    try { localStorage.setItem("osx-lang", lang); } catch (e) {}
    if (animate && !reduced) { document.body.classList.add("switching"); setTimeout(run, 220); }
    else run();
  }

  /* dropdowns */
  function dropdown(box, onPick) {
    const btn = $(".dd__btn", box);
    btn.addEventListener("click", e => {
      e.stopPropagation();
      $$(".dd.open").forEach(d => d !== box && d.classList.remove("open"));
      const open = box.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    $$(".dd__menu button", box).forEach(b => b.addEventListener("click", () => {
      box.classList.remove("open"); btn.setAttribute("aria-expanded", false); onPick(b);
    }));
  }
  document.addEventListener("click", () => $$(".dd.open").forEach(d => d.classList.remove("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") $$(".dd.open").forEach(d => d.classList.remove("open")); });

  dropdown($("#lang"), b => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang, true); });

  /* ---------- Theme (interruptor día / noche) ---------- */
  const sw = $("#themeSwitch");
  let netColors = null;
  function applyTheme(th) {
    if (!CONFIG.THEMES.includes(th)) th = CONFIG.DEFAULT_THEME;
    document.documentElement.setAttribute("data-theme", th);
    sw.setAttribute("aria-checked", th === "night");
    const cs = getComputedStyle(document.documentElement);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = th === "night" ? "#080b26" : "#eef1fc";
    netColors = { line: cs.getPropertyValue("--net-line").trim(), dot: cs.getPropertyValue("--net-dot").trim(), hover: cs.getPropertyValue("--net-hover").trim() };
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("osx-theme"); } catch (e) {}
  applyTheme(savedTheme || CONFIG.DEFAULT_THEME);
  sw.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
    applyTheme(next);
    try { localStorage.setItem("osx-theme", next); } catch (e) {}
  });

  /* ---------- Typing rotator ---------- */
  let rotTimer;
  function startRotator() {
    clearTimeout(rotTimer);
    const el = $("#rotator"), words = t("hero.rot");
    let w = 0, i = 0, deleting = false;
    if (reduced) { el.textContent = words[0]; return; }
    (function tick() {
      const word = words[w];
      i += deleting ? -1 : 1;
      el.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 1600; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      rotTimer = setTimeout(tick, delay);
    })();
  }

  /* ---------- Nav ---------- */
  const nav = $(".header");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("a", menu).forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  // active link
  const links = $$(".nav__links a");
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["inicio", "servicios", "plataforma", "nosotros", "contacto"].forEach(id => { const s = document.getElementById(id); s && spy.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .14 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const co = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.to, suf = el.dataset.suffix || "";
    const start = performance.now(), dur = 1400;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(start);
    co.unobserve(el);
  }), { threshold: .6 });
  $$(".count").forEach(el => co.observe(el));

  /* ---------- Card spotlight + tilt ---------- */
  $$(".card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
      if (!reduced) card.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  /* ---------- Auto carousels ---------- */
  $$(".carousel").forEach(c => {
    const track = $(".carousel__track", c), slides = $$(".slide", c);
    const dotsBox = $(".carousel__dots", c), bar = $(".carousel__progress span", c);
    const interval = +c.dataset.interval || 4500;
    let idx = 0, timer, paused = false;

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Slide ${i + 1}`);
      b.addEventListener("click", () => go(i, true));
      dotsBox.appendChild(b); return b;
    });

    function go(n, user) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      if (bar && !reduced) { bar.style.transition = "none"; bar.style.width = "0"; bar.offsetWidth; bar.style.transition = `width ${interval}ms linear`; bar.style.width = "100%"; }
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (!paused && !reduced) timer = setTimeout(() => go(idx + 1), interval);
    }

    // swipe
    let sx = null;
    c.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    c.addEventListener("touchend", e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1), true);
      sx = null;
    });
    document.addEventListener("visibilitychange", () => document.hidden ? clearTimeout(timer) : schedule());
    go(0);
  });

  /* ---------- Live map clock + speed ---------- */
  const clock = $("#clock"), speed = $("#speed");
  setInterval(() => {
    clock.textContent = new Date().toLocaleTimeString("it-IT");
    speed.textContent = 55 + Math.round(Math.random() * 20);
  }, 1000);

  /* ---------- Clients marquee: duplicar para bucle continuo ---------- */
  const ct = $("#clientsTrack");
  if (ct) ct.innerHTML += ct.innerHTML.replace(/<li /g, '<li aria-hidden="true" ');

  /* ---------- Contact form → email ---------- */
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = [
      `${t("contact.name")}: ${f.get("name")}`,
      `${t("contact.email")}: ${f.get("email")}`,
      `${t("contact.company")}: ${f.get("company") || "-"}`,
      `${t("contact.phone")}: ${f.get("phone") || "-"}`,
      `${t("contact.interest")}: ${f.get("interest")}`,
      "", f.get("message") || ""
    ].join("\n");
    location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent(t("contact.subject"))}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Background network (canvas) ---------- */
  const cv = $("#net"), ctx = cv.getContext("2d");
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  }
  addEventListener("resize", resize); resize();
  addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const nc = netColors || { line: "120,140,255", dot: "150,170,255", hover: "34,195,238" };
    const night = document.documentElement.getAttribute("data-theme") === "night";
    const k = night ? { line: .35, hover: .6, dot: .85, r: 1.6 } : { line: .3, hover: .55, dot: .55, r: 1.4 };
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.strokeStyle = `rgba(${nc.line},${(1 - d / 130) * k.line})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < 180) { ctx.strokeStyle = `rgba(${nc.hover},${(1 - dm / 180) * k.hover})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      ctx.fillStyle = i % 3 ? `rgba(${nc.dot},${k.dot})` : `rgba(${nc.hover},${k.dot})`;
      ctx.beginPath(); ctx.arc(a.x, a.y, k.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  if (!reduced) draw();

  applyLang(lang, false);
})();
