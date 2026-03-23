/*
  Página web dedicada a Emma Julietta (HTML/CSS/JS puro)
  - Galería interactiva de ultrasonidos (PDF) desde /ultrasonidos
  - Contador regresivo hasta el 2 de abril de 2026 (hora local del usuario)
  - Animaciones suaves (nubes, brillos, corazones/estrellas), parallax y reveal al hacer scroll
*/

(() => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const TARGET_LOCAL = new Date(2026, 3, 2, 0, 0, 0); // 2 de abril 2026 00:00:00 (hora local)

  const ULTRASOUNDS = [
    "ultrasonidos/OB20250827133322_Obstetricia.pdf",
    "ultrasonidos/IMAGENES.pdf",
    "ultrasonidos/OB20250911145249_Obstetricia.pdf",
    "ultrasonidos/BRENDA HERRERA ALVAR 4.pdf",
    "ultrasonidos/BRENDA HERRERA ALVAR 3.pdf",
    "ultrasonidos/BRENDA HDZ ALVAREZ.pdf",
    "ultrasonidos/IMAGENES ESTRUCTURAL.pdf",
    "ultrasonidos/BRANDA HERRERA ALVAR.pdf",
    "ultrasonidos/BRENDA HERRERA ALVAR 2.pdf",
    "ultrasonidos/IMAGENES CRECIMIENTO.pdf",
    "ultrasonidos/BRENDA HERRERA ALVAR.pdf",
  ];

  const els = {
    canvas: document.querySelector(".ambient-canvas"),
    parallax: Array.from(document.querySelectorAll(".parallax")),
    reveals: Array.from(document.querySelectorAll(".reveal")),

    cdDays: document.getElementById("cdDays"),
    cdHours: document.getElementById("cdHours"),
    cdMinutes: document.getElementById("cdMinutes"),
    cdSeconds: document.getElementById("cdSeconds"),
    tzNote: document.getElementById("tzNote"),

    gallery: document.getElementById("gallery"),

    modal: document.getElementById("modal"),
    modalTitle: document.getElementById("modalTitle"),
    modalClose: document.getElementById("modalClose"),
    pdfObject: document.getElementById("pdfObject"),
    pdfLink: document.getElementById("pdfLink"),
    pdfDownload: document.getElementById("pdfDownload"),
  };

  const pad2 = (n) => String(n).padStart(2, "0");

  const fileBaseName = (path) => {
    const name = path.split("/").pop() ?? path;
    return name.replace(/\.pdf$/i, "");
  };

  const prettyTitle = (path) => {
    const base = fileBaseName(path);
    return base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  };

  const toUrl = (path) => encodeURI(path);

  const formatTzNote = () => {
    const tz = Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;
    const offsetMin = -new Date().getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMin);
    const hh = pad2(Math.floor(abs / 60));
    const mm = pad2(abs % 60);
    const label = tz ? `${tz} (UTC${sign}${hh}:${mm})` : `UTC${sign}${hh}:${mm}`;
    return `Tu zona horaria: ${label}. El conteo se calcula en hora local.`;
  };

  const updateCountdown = () => {
    if (!els.cdDays || !els.cdHours || !els.cdMinutes || !els.cdSeconds) return;

    const now = new Date();
    let diffMs = TARGET_LOCAL.getTime() - now.getTime();
    if (Number.isNaN(diffMs)) diffMs = 0;
    diffMs = Math.max(0, diffMs);

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.cdDays.textContent = String(days);
    els.cdHours.textContent = pad2(hours);
    els.cdMinutes.textContent = pad2(minutes);
    els.cdSeconds.textContent = pad2(seconds);

    if (els.tzNote) {
      els.tzNote.textContent =
        diffMs === 0
          ? "¡Llegó el gran día! 💛"
          : formatTzNote();
    }
  };

  const renderGallery = () => {
    if (!els.gallery) return;
    els.gallery.innerHTML = "";

    const frag = document.createDocumentFragment();
    ULTRASOUNDS.forEach((path, index) => {
      const title = prettyTitle(path);

      const card = document.createElement("article");
      card.className = "card reveal";
      card.setAttribute("role", "listitem");

      const thumb = document.createElement("div");
      thumb.className = "card__thumb";
      thumb.innerHTML = `
        <div class="thumb__frame" aria-hidden="true"></div>
        <div class="thumb__label"><span class="thumb__dot" aria-hidden="true"></span>PDF</div>
      `;

      const h3 = document.createElement("h3");
      h3.className = "card__title";
      h3.textContent = title;

      const meta = document.createElement("p");
      meta.className = "card__meta";
      meta.textContent = "Ultrasonido · Archivo PDF";

      const actions = document.createElement("div");
      actions.className = "card__actions";

      const btn = document.createElement("button");
      btn.className = "btn";
      btn.type = "button";
      btn.textContent = "Ver ultrasonido";
      btn.addEventListener("click", () => openModal(path, title));

      const pill = document.createElement("div");
      pill.className = "pill";
      pill.textContent = `#${index + 1}`;

      actions.appendChild(btn);
      actions.appendChild(pill);

      card.appendChild(thumb);
      card.appendChild(h3);
      card.appendChild(meta);
      card.appendChild(actions);

      frag.appendChild(card);
    });

    els.gallery.appendChild(frag);
  };

  const setModalOpen = (isOpen) => {
    if (!els.modal) return;
    els.modal.classList.toggle("is-open", isOpen);
    els.modal.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  const openModal = (path, title) => {
    const url = toUrl(path);
    const pdfUrl = `${url}#toolbar=0&navpanes=0&scrollbar=0`;

    if (els.modalTitle) els.modalTitle.textContent = title;
    if (els.pdfObject) els.pdfObject.setAttribute("data", pdfUrl);
    if (els.pdfLink) els.pdfLink.setAttribute("href", url);
    if (els.pdfDownload) els.pdfDownload.setAttribute("href", url);

    setModalOpen(true);
  };

  const closeModal = () => {
    if (els.pdfObject) els.pdfObject.setAttribute("data", "");
    setModalOpen(false);
  };

  const initModal = () => {
    if (!els.modal) return;
    els.modal.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.close === "true") closeModal();
    });
    els.modalClose?.addEventListener("click", closeModal);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.modal?.classList.contains("is-open")) closeModal();
    });
  };

  const initReveal = () => {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (items.length === 0) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "40px 0px -10% 0px" },
    );

    items.forEach((el) => io.observe(el));
  };

  const initParallax = () => {
    if (prefersReducedMotion) return;
    if (!els.parallax || els.parallax.length === 0) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const y = window.scrollY || 0;
      for (const el of els.parallax) {
        const speed = Number(el.dataset.speed ?? "0");
        const ty = Math.round(y * speed);
        el.style.transform = `translate3d(0, ${ty}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  };

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  const spawnFloat = () => {
    if (prefersReducedMotion) return;

    const el = document.createElement("div");
    const kind = pick(["heart", "star", "star", "heart"]);
    el.className = `float float--${kind}`;

    const size = rand(12, 22);
    const dur = rand(5.6, 8.2);
    const x = rand(6, 94);
    const drift = rand(-8, 8);
    const rot = rand(120, 360);

    el.style.setProperty("--size", `${size}px`);
    el.style.setProperty("--dur", `${dur}s`);
    el.style.setProperty("--x", `${x}vw`);
    el.style.setProperty("--drift", `${drift}vw`);
    el.style.setProperty("--rot", `${rot}deg`);

    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), (dur + 0.25) * 1000);
  };

  const initFloatSpawner = () => {
    if (prefersReducedMotion) return;
    const base = 900;
    window.setInterval(() => {
      const hidden = document.visibilityState === "hidden";
      if (hidden) return;
      spawnFloat();
    }, base);
  };

  const initAmbientCanvas = () => {
    if (!els.canvas) return;
    if (prefersReducedMotion) return;

    const ctx = els.canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const particles = [];

    const resize = () => {
      const scale = dpr();
      const w = Math.floor(window.innerWidth * scale);
      const h = Math.floor(window.innerHeight * scale);
      els.canvas.width = w;
      els.canvas.height = h;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(scale, scale);

      const target = Math.round((window.innerWidth * window.innerHeight) / 26000);
      const desired = Math.max(24, Math.min(56, target));
      particles.length = 0;
      for (let i = 0; i < desired; i += 1) {
        particles.push({
          x: rand(0, window.innerWidth),
          y: rand(0, window.innerHeight),
          r: rand(0.7, 1.9),
          vx: rand(-0.06, 0.06),
          vy: rand(-0.05, 0.05),
          a: rand(0.06, 0.22),
          tw: rand(0.004, 0.012),
          phase: rand(0, Math.PI * 2),
          tint: pick(["#ffffff", "#dff4ff", "#ffe6f6", "#fff4d6"]),
        });
      }
    };

    let rafId = 0;
    const draw = (t) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const time = t * 0.001;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        const twinkle = p.a + Math.sin(time * (1 / p.tw) + p.phase) * 0.07;
        ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
        ctx.fillStyle = p.tint;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = Math.max(0, Math.min(1, twinkle * 0.28));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      window.cancelAnimationFrame(rafId);
      if (document.visibilityState !== "hidden") rafId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafId = window.requestAnimationFrame(draw);
  };

  const init = () => {
    renderGallery();
    initModal();
    initReveal();
    initParallax();

    updateCountdown();
    window.setInterval(updateCountdown, 1000);

    initFloatSpawner();
    initAmbientCanvas();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
