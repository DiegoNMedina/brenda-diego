/*
  Página romántica para Brenda (HTML/CSS/JS puro)
  - Contador en tiempo real desde 2024-12-29 00:00:00 (hora local)
  - Flores amarillas flotando (SVG) generadas con JavaScript
  - Partículas sutiles en canvas (brillos cálidos)
  - Carta oculta con animación suave
*/

(() => {
  const START_LOCAL = new Date(2024, 11, 29, 0, 0, 0); // 2024-12-29 00:00:00 (hora local)
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const els = {
    years: document.getElementById("years"),
    months: document.getElementById("months"),
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    revealBtn: document.getElementById("revealBtn"),
    letter: document.getElementById("letter"),
    flowerLayer: document.querySelector(".flower-layer"),
    treeWrap: document.querySelector(".tree-wrap"),
    canvas: document.querySelector(".ambient-canvas"),
  };

  const pad2 = (n) => String(n).padStart(2, "0");

  const addLocalYears = (date, years) => {
    const d = new Date(date.getTime());
    d.setFullYear(d.getFullYear() + years);
    return d;
  };

  const addLocalMonths = (date, months) => {
    const d = new Date(date.getTime());
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const diffFromStartLocal = (startLocal, nowLocal) => {
    if (nowLocal < startLocal) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    let years = nowLocal.getFullYear() - startLocal.getFullYear();
    let cursor = addLocalYears(startLocal, years);
    if (cursor > nowLocal) {
      years -= 1;
      cursor = addLocalYears(startLocal, years);
    }

    let months = nowLocal.getMonth() - cursor.getMonth();
    if (months < 0) months += 12;
    let cursor2 = addLocalMonths(cursor, months);
    if (cursor2 > nowLocal) {
      months -= 1;
      cursor2 = addLocalMonths(cursor, months);
    }

    const remainingMs = nowLocal.getTime() - cursor2.getTime();
    const totalSeconds = Math.floor(remainingMs / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { years, months, days, hours, minutes, seconds };
  };

  const updateCounter = () => {
    const now = new Date();
    const d = diffFromStartLocal(START_LOCAL, now);
    els.years.textContent = String(d.years);
    els.months.textContent = String(d.months);
    els.days.textContent = String(d.days);
    els.hours.textContent = pad2(d.hours);
    els.minutes.textContent = pad2(d.minutes);
    els.seconds.textContent = pad2(d.seconds);
  };

  const setReady = () => {
    window.requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  };

  const toggleLetter = () => {
    const isOpen = els.letter.classList.toggle("is-open");
    els.revealBtn.setAttribute("aria-expanded", String(isOpen));
    els.revealBtn.textContent = isOpen ? "Cerrar carta" : "Un detalle para ti 💛";
    if (isOpen) {
      els.letter.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
    }
  };

  const flowerSvg = () => `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="petal" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(45 36) rotate(55) scale(80 80)">
          <stop stop-color="#fff7d6" stop-opacity="0.95" />
          <stop offset="0.32" stop-color="#ffe08a" stop-opacity="0.98" />
          <stop offset="1" stop-color="#f6c442" stop-opacity="0.95" />
        </radialGradient>
        <radialGradient id="center" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(90) scale(26 26)">
          <stop stop-color="#fff0c1" stop-opacity="1" />
          <stop offset="0.55" stop-color="#d4a11a" stop-opacity="1" />
          <stop offset="1" stop-color="#8a5a09" stop-opacity="0.95" />
        </radialGradient>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feColorMatrix in="b" type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.28 0" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#softGlow)">
        <path d="M60 18C71 18 79 29 74 39C69 49 60 54 60 54C60 54 51 49 46 39C41 29 49 18 60 18Z" fill="url(#petal)"/>
        <path d="M102 60C102 71 91 79 81 74C71 69 66 60 66 60C66 60 71 51 81 46C91 41 102 49 102 60Z" fill="url(#petal)"/>
        <path d="M60 102C49 102 41 91 46 81C51 71 60 66 60 66C60 66 69 71 74 81C79 91 71 102 60 102Z" fill="url(#petal)"/>
        <path d="M18 60C18 49 29 41 39 46C49 51 54 60 54 60C54 60 49 69 39 74C29 79 18 71 18 60Z" fill="url(#petal)"/>
        <path d="M33 33C41 25 53 26 58 36C63 46 60 57 60 57C60 57 49 60 39 55C29 50 25 41 33 33Z" fill="url(#petal)"/>
        <path d="M87 33C95 41 91 50 81 55C71 60 60 57 60 57C60 57 57 46 62 36C67 26 79 25 87 33Z" fill="url(#petal)"/>
        <path d="M87 87C79 95 67 94 62 84C57 74 60 63 60 63C60 63 71 60 81 65C91 70 95 79 87 87Z" fill="url(#petal)"/>
        <path d="M33 87C25 79 29 70 39 65C49 60 60 63 60 63C60 63 63 74 58 84C53 94 41 95 33 87Z" fill="url(#petal)"/>
        <circle cx="60" cy="60" r="14" fill="url(#center)" />
        <circle cx="56" cy="56" r="4" fill="#fff7dc" opacity="0.45" />
      </g>
    </svg>
  `;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const randN = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const SVG_NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag) => document.createElementNS(SVG_NS, tag);

  const initTree = () => {
    if (!els.treeWrap) return;
    if (els.treeWrap.querySelector(".tree")) return;

    const svg = svgEl("svg");
    svg.setAttribute("viewBox", "0 0 600 520");
    svg.setAttribute("preserveAspectRatio", "xMidYMax meet");
    svg.classList.add("tree");
    svg.setAttribute("aria-hidden", "true");

    const defs = svgEl("defs");

    const wood = svgEl("linearGradient");
    wood.setAttribute("id", "treeWood");
    wood.setAttribute("x1", "0");
    wood.setAttribute("y1", "0");
    wood.setAttribute("x2", "0");
    wood.setAttribute("y2", "1");
    const woodStops = [
      { o: "0", c: "#c6922e", a: "0.88" },
      { o: "0.55", c: "#5c3d10", a: "0.86" },
      { o: "1", c: "#3a2408", a: "0.82" },
    ];
    for (const s of woodStops) {
      const st = svgEl("stop");
      st.setAttribute("offset", s.o);
      st.setAttribute("stop-color", s.c);
      st.setAttribute("stop-opacity", s.a);
      wood.appendChild(st);
    }

    const petal = svgEl("radialGradient");
    petal.setAttribute("id", "treePetal");
    petal.setAttribute("cx", "30%");
    petal.setAttribute("cy", "30%");
    petal.setAttribute("r", "70%");
    const petalStops = [
      { o: "0", c: "#fff6d2", a: "0.96" },
      { o: "0.38", c: "#ffe08a", a: "0.98" },
      { o: "1", c: "#f6c442", a: "0.95" },
    ];
    for (const s of petalStops) {
      const st = svgEl("stop");
      st.setAttribute("offset", s.o);
      st.setAttribute("stop-color", s.c);
      st.setAttribute("stop-opacity", s.a);
      petal.appendChild(st);
    }

    const center = svgEl("radialGradient");
    center.setAttribute("id", "treeCenter");
    center.setAttribute("cx", "35%");
    center.setAttribute("cy", "35%");
    center.setAttribute("r", "70%");
    const centerStops = [
      { o: "0", c: "#fff0c1" },
      { o: "0.6", c: "#d4a11a" },
      { o: "1", c: "#8a5a09" },
    ];
    for (const s of centerStops) {
      const st = svgEl("stop");
      st.setAttribute("offset", s.o);
      st.setAttribute("stop-color", s.c);
      center.appendChild(st);
    }

    const glow = svgEl("filter");
    glow.setAttribute("id", "treeGlow");
    glow.setAttribute("x", "-30%");
    glow.setAttribute("y", "-30%");
    glow.setAttribute("width", "160%");
    glow.setAttribute("height", "160%");

    const blur = svgEl("feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", "0.9");
    blur.setAttribute("result", "b");

    const cm = svgEl("feColorMatrix");
    cm.setAttribute("in", "b");
    cm.setAttribute("type", "matrix");
    cm.setAttribute(
      "values",
      "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.22 0",
    );
    cm.setAttribute("result", "g");

    const merge = svgEl("feMerge");
    const m1 = svgEl("feMergeNode");
    m1.setAttribute("in", "g");
    const m2 = svgEl("feMergeNode");
    m2.setAttribute("in", "SourceGraphic");
    merge.appendChild(m1);
    merge.appendChild(m2);

    glow.appendChild(blur);
    glow.appendChild(cm);
    glow.appendChild(merge);

    defs.appendChild(wood);
    defs.appendChild(petal);
    defs.appendChild(center);
    defs.appendChild(glow);
    svg.appendChild(defs);

    const gPaths = svgEl("g");
    gPaths.setAttribute("filter", "url(#treeGlow)");

    const gBlooms = svgEl("g");
    gBlooms.setAttribute("filter", "url(#treeGlow)");

    const pathSpecs = [
      { d: "M300 500 C300 430 295 380 300 320 C305 260 315 210 310 160", w: 16, dur: 1700, delay: 120, blooms: 3 },
      { d: "M300 355 C252 322 214 298 178 266", w: 10, dur: 1100, delay: 720, blooms: 4 },
      { d: "M300 330 C355 300 392 270 436 240", w: 10, dur: 1100, delay: 860, blooms: 4 },
      { d: "M302 278 C268 246 236 220 206 190", w: 8, dur: 980, delay: 1220, blooms: 4 },
      { d: "M304 265 C342 236 380 206 426 172", w: 8, dur: 980, delay: 1340, blooms: 4 },
      { d: "M306 214 C284 186 260 160 238 132", w: 6, dur: 900, delay: 1660, blooms: 3 },
      { d: "M308 206 C330 176 356 150 388 124", w: 6, dur: 900, delay: 1760, blooms: 3 },
      { d: "M220 310 C210 300 196 292 184 284", w: 5, dur: 720, delay: 980, blooms: 2 },
      { d: "M412 260 C424 252 438 244 452 236", w: 5, dur: 720, delay: 1120, blooms: 2 },
    ];

    const paths = [];
    for (const spec of pathSpecs) {
      const p = svgEl("path");
      p.classList.add("tree__path");
      p.setAttribute("d", spec.d);
      p.setAttribute("stroke", "url(#treeWood)");
      p.setAttribute("stroke-width", String(spec.w));
      gPaths.appendChild(p);
      paths.push({ p, ...spec });
    }

    const createBloom = (x, y, scale, rot) => {
      const wrapper = svgEl("g");
      wrapper.setAttribute("transform", `translate(${x} ${y}) rotate(${rot}) scale(${scale})`);

      const g = svgEl("g");
      g.classList.add("tree__bloom");

      const petals = 6;
      const petalDist = 7.2;
      const petalR = 5.2;
      for (let i = 0; i < petals; i += 1) {
        const ang = (Math.PI * 2 * i) / petals;
        const cx = Math.cos(ang) * petalDist;
        const cy = Math.sin(ang) * petalDist;
        const c = svgEl("circle");
        c.setAttribute("cx", cx.toFixed(2));
        c.setAttribute("cy", cy.toFixed(2));
        c.setAttribute("r", String(petalR));
        c.setAttribute("fill", "url(#treePetal)");
        g.appendChild(c);
      }

      const mid = svgEl("circle");
      mid.setAttribute("cx", "0");
      mid.setAttribute("cy", "0");
      mid.setAttribute("r", "4.2");
      mid.setAttribute("fill", "url(#treeCenter)");
      g.appendChild(mid);

      wrapper.appendChild(g);
      return { wrapper, bloom: g };
    };

    const placeBloomOnPath = (pathEl, pct) => {
      const length = pathEl.getTotalLength();
      const pt = pathEl.getPointAtLength(length * pct);
      const s = rand(0.88, 1.25);
      const rot = rand(-25, 25);
      const b = createBloom(pt.x, pt.y, s, rot);
      gBlooms.appendChild(b.wrapper);
      window.requestAnimationFrame(() => b.bloom.classList.add("is-bloom"));
    };

    const placeCanopyBloom = (x, y, delayMs) => {
      const s = rand(0.8, 1.45);
      const rot = rand(-30, 30);
      const b = createBloom(x, y, s, rot);
      gBlooms.appendChild(b.wrapper);
      window.setTimeout(() => b.bloom.classList.add("is-bloom"), Math.max(0, delayMs));
    };

    const scheduleCanopy = (delayBase) => {
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const canopyCount = vw < 720 ? 52 : 78;
      const clusters = [
        { x: 250, y: 170, rx: 68, ry: 58, w: 1.0 },
        { x: 340, y: 165, rx: 74, ry: 60, w: 1.0 },
        { x: 300, y: 120, rx: 62, ry: 52, w: 0.85 },
        { x: 210, y: 220, rx: 52, ry: 46, w: 0.7 },
        { x: 390, y: 220, rx: 52, ry: 46, w: 0.7 },
      ];

      const weightsSum = clusters.reduce((s, c) => s + c.w, 0);
      const pickCluster = () => {
        let r = Math.random() * weightsSum;
        for (const c of clusters) {
          r -= c.w;
          if (r <= 0) return c;
        }
        return clusters[0];
      };

      for (let i = 0; i < canopyCount; i += 1) {
        const c = pickCluster();
        const x = c.x + randN() * c.rx;
        const y = c.y + randN() * c.ry;

        if (x < 90 || x > 510 || y < 36 || y > 315) continue;

        const delay = delayBase + rand(0, 900) + i * (vw < 720 ? 12 : 10);
        placeCanopyBloom(x, y, delay);
      }
    };

    const drawPath = (pathEl, duration, delay) => {
      const length = pathEl.getTotalLength();
      pathEl.style.strokeDasharray = `${length} ${length}`;
      pathEl.style.strokeDashoffset = `${length}`;

      if (typeof pathEl.animate !== "function") {
        window.setTimeout(() => {
          pathEl.style.strokeDashoffset = "0";
        }, delay);
        return { length, duration, delay };
      }

      pathEl.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration,
          delay,
          easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
          fill: "forwards",
        },
      );

      return { length, duration, delay };
    };

    const scheduleBlooms = (pathEl, blooms, duration, delay) => {
      for (let i = 0; i < blooms; i += 1) {
        const pct = rand(0.18, 0.94);
        const t = delay + duration * pct;
        window.setTimeout(() => placeBloomOnPath(pathEl, pct), t);
      }
    };

    svg.appendChild(gPaths);
    svg.appendChild(gBlooms);
    els.treeWrap.appendChild(svg);

    if (prefersReducedMotion) {
      for (const item of paths) {
        item.p.style.strokeDasharray = "none";
        item.p.style.strokeDashoffset = "0";
        scheduleBlooms(item.p, item.blooms, 0, 0);
      }
      scheduleCanopy(0);
      return;
    }

    for (const item of paths) {
      drawPath(item.p, item.dur, item.delay);
      scheduleBlooms(item.p, item.blooms, item.dur, item.delay);
    }

    const endDelay = Math.max(...paths.map((p) => p.delay + p.dur));
    scheduleCanopy(endDelay * 0.55);
  };

  const spawnFlower = () => {
    if (!els.flowerLayer) return;

    const flower = document.createElement("div");
    flower.className = "flower";
    flower.innerHTML = flowerSvg();

    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    const size = vw < 720 ? rand(34, 62) : rand(40, 78);
    const dur = vw < 720 ? rand(12, 18) : rand(14, 22);
    const delay = rand(0, 4);
    const x = rand(4, 96);
    const drift = rand(-10, 10);
    const rot = pick(["320deg", "360deg", "420deg", "480deg"]);
    const op = rand(0.55, 0.9).toFixed(2);

    flower.style.setProperty("--size", `${size}px`);
    flower.style.setProperty("--dur", `${dur}s`);
    flower.style.setProperty("--delay", `${delay}s`);
    flower.style.setProperty("--x", `${x}vw`);
    flower.style.setProperty("--drift", `${drift}vw`);
    flower.style.setProperty("--rot", rot);
    flower.style.setProperty("--op", op);

    els.flowerLayer.appendChild(flower);

    const removeAfterMs = (dur + delay + 0.2) * 1000;
    window.setTimeout(() => {
      flower.remove();
      if (!prefersReducedMotion && document.visibilityState === "visible") spawnFlower();
    }, removeAfterMs);
  };

  const initFlowers = () => {
    if (prefersReducedMotion) return;

    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const count = vw < 720 ? 10 : 16;
    for (let i = 0; i < count; i += 1) {
      spawnFlower();
    }
  };

  const initAmbientCanvas = () => {
    if (!els.canvas) return;
    if (prefersReducedMotion) return;

    const ctx = els.canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const particles = [];
    const dpr = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const scale = dpr();
      const w = Math.floor(window.innerWidth * scale);
      const h = Math.floor(window.innerHeight * scale);
      els.canvas.width = w;
      els.canvas.height = h;
      els.canvas.style.width = "100%";
      els.canvas.style.height = "100%";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(scale, scale);

      const target = Math.round((window.innerWidth * window.innerHeight) / 22000);
      const desired = Math.max(26, Math.min(60, target));
      particles.length = 0;
      for (let i = 0; i < desired; i += 1) {
        particles.push({
          x: rand(0, window.innerWidth),
          y: rand(0, window.innerHeight),
          r: rand(0.6, 1.8),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.06, 0.06),
          a: rand(0.08, 0.26),
          tw: rand(0.004, 0.012),
          phase: rand(0, Math.PI * 2),
          tint: pick(["#fff7d9", "#ffe7a8", "#ffd6e4"]),
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

        const twinkle = p.a + Math.sin(time * (1 / p.tw) + p.phase) * 0.06;
        ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
        ctx.fillStyle = p.tint;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = Math.max(0, Math.min(1, twinkle * 0.35));
        ctx.fillStyle = p.tint;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        window.cancelAnimationFrame(rafId);
      } else {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafId = window.requestAnimationFrame(draw);
  };

  const initInteractions = () => {
    if (!els.revealBtn || !els.letter) return;
    els.revealBtn.addEventListener("click", toggleLetter);
  };

  const init = () => {
    setReady();
    updateCounter();
    window.setInterval(updateCounter, 1000);
    initInteractions();
    initTree();
    initFlowers();
    initAmbientCanvas();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
