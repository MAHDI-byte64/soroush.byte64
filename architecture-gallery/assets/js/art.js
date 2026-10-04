/* ==========================================================================
   پلاک‌های هنری جایگزین
   تا زمانی که عکس واقعی قرار داده نشده، برای هر تصویر یک ترکیب‌بندی
   معمارانه انتزاعی (SVG) با پالت رنگی خود پروژه ساخته می‌شود.
   ========================================================================== */
(function () {
  function rng(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6d2b79f5;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

  const W = 1200, H = 800;

  /* عکس اجرا شده: آسمان، زمین، حجم‌ها، سایه‌ها و بازشوها */
  function built(r, [main, light, dark], id) {
    const horizon = 520 + r() * 80;
    let s = `<defs>
      <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${mix(light, "#ffffff", .35)}"/>
        <stop offset="1" stop-color="${light}"/>
      </linearGradient>
      <linearGradient id="sh${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${dark}" stop-opacity=".0"/>
        <stop offset="1" stop-color="${dark}" stop-opacity=".35"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky${id})"/>
    <rect y="${horizon}" width="${W}" height="${H - horizon}" fill="${mix(light, dark, .18)}"/>`;
    const n = 2 + Math.floor(r() * 3);
    let x = 120 + r() * 120;
    for (let i = 0; i < n && x < W - 160; i++) {
      const w = 180 + r() * 300, h = 160 + r() * 280;
      const y = horizon - h;
      const c = mix(main, light, r() * .45);
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
      s += `<rect x="${x + w * .62}" y="${y}" width="${w * .38}" height="${h}" fill="url(#sh${id})"/>`;
      // بازشوها
      const cols = 1 + Math.floor(r() * 4), rows = 1 + Math.floor(r() * 3);
      const ow = w / (cols * 2 + 1), oh = h / (rows * 2.4 + 1);
      if (r() > .3) for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) {
        s += `<rect x="${x + ow * (a * 2 + 1)}" y="${y + oh * (b * 2.4 + 1)}" width="${ow}" height="${oh * 1.4}" fill="${dark}" opacity=".78"/>`;
      } else {
        s += `<rect x="${x + w * .12}" y="${y + h * .55}" width="${w * .76}" height="${h * .3}" fill="${dark}" opacity=".8"/>`;
      }
      // سایه افتاده
      s += `<polygon points="${x + w},${horizon} ${x + w + h * .45},${horizon + 30} ${x + h * .45},${horizon + 30} ${x},${horizon}" fill="${dark}" opacity=".12"/>`;
      x += w + (r() > .5 ? -40 : 30 + r() * 60);
    }
    // خط نازک افق و یک «آدم» برای مقیاس
    const px = 200 + r() * 800;
    s += `<line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="${dark}" stroke-opacity=".25"/>`;
    s += `<g fill="${dark}"><circle cx="${px}" cy="${horizon - 62}" r="7"/><rect x="${px - 6}" y="${horizon - 54}" width="12" height="54" rx="4"/></g>`;
    return s;
  }

  /* رندر: نوری نرم و اتمسفریک، دید پرسپکتیو با نقطه گریز */
  function render(r, [main, light, dark], id) {
    const vx = 300 + r() * 600, vy = 330 + r() * 120;
    let s = `<defs>
      <radialGradient id="glow${id}" cx="${vx / W}" cy="${vy / H}" r=".8">
        <stop offset="0" stop-color="${mix(light, "#fff8e8", .6)}"/>
        <stop offset=".55" stop-color="${mix(main, light, .55)}"/>
        <stop offset="1" stop-color="${mix(main, dark, .45)}"/>
      </radialGradient>
      <filter id="blur${id}"><feGaussianBlur stdDeviation="30"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#glow${id})"/>`;
    // صفحات پرسپکتیو
    s += `<polygon points="0,0 ${vx - 140},${vy - 120} ${vx - 140},${vy + 110} 0,${H}" fill="${mix(main, dark, .25)}" opacity=".9"/>`;
    s += `<polygon points="${W},0 ${vx + 160},${vy - 120} ${vx + 160},${vy + 110} ${W},${H}" fill="${mix(main, light, .2)}" opacity=".85"/>`;
    s += `<polygon points="0,${H} ${vx - 140},${vy + 110} ${vx + 160},${vy + 110} ${W},${H}" fill="${mix(light, dark, .3)}"/>`;
    s += `<polygon points="0,0 ${vx - 140},${vy - 120} ${vx + 160},${vy - 120} ${W},0" fill="${dark}" opacity=".55"/>`;
    // ستون‌ها/فین‌ها
    const fins = 3 + Math.floor(r() * 5);
    for (let i = 0; i < fins; i++) {
      const t = (i + 1) / (fins + 1);
      const xa = W - (W - (vx + 160)) * t;
      s += `<line x1="${xa}" y1="${(vy - 120) * t}" x2="${xa}" y2="${H - (H - vy - 110) * t}" stroke="${dark}" stroke-opacity=".35" stroke-width="${10 * (1 - t) + 2}"/>`;
    }
    s += `<ellipse cx="${vx}" cy="${vy}" rx="200" ry="120" fill="#fff" opacity=".35" filter="url(#blur${id})"/>`;
    // شبح انسان
    const px = vx - 40 + r() * 80;
    s += `<g fill="${dark}" opacity=".7"><circle cx="${px}" cy="${vy + 52}" r="5"/><rect x="${px - 4}" y="${vy + 58}" width="8" height="46" rx="3"/></g>`;
    return s;
  }

  /* نقشه: خطوط پلان یا مقطع روی کاغذ */
  function drawing(r, [main, light, dark]) {
    const paper = mix(light, "#ffffff", .5);
    let s = `<rect width="${W}" height="${H}" fill="${paper}"/>`;
    // شبکه محوری
    for (let i = 1; i < 12; i++) s += `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${H}" stroke="${dark}" stroke-opacity=".05"/>`;
    for (let i = 1; i < 8; i++) s += `<line x1="0" y1="${i * 100}" x2="${W}" y2="${i * 100}" stroke="${dark}" stroke-opacity=".05"/>`;
    const x0 = 220, y0 = 160, w = 760, h = 480;
    s += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="${dark}" stroke-width="10"/>`;
    // تقسیمات داخلی
    const vs = 2 + Math.floor(r() * 3);
    for (let i = 1; i <= vs; i++) {
      const xx = x0 + (w / (vs + 1)) * i + (r() - .5) * 60;
      const gap = y0 + 60 + r() * (h - 160);
      s += `<line x1="${xx}" y1="${y0}" x2="${xx}" y2="${gap}" stroke="${dark}" stroke-width="5"/>`;
      s += `<line x1="${xx}" y1="${gap + 70}" x2="${xx}" y2="${y0 + h}" stroke="${dark}" stroke-width="5"/>`;
      s += `<path d="M${xx} ${gap} A70 70 0 0 1 ${xx + 70} ${gap + 70}" fill="none" stroke="${dark}" stroke-opacity=".4" stroke-width="1.5"/>`;
    }
    const hy = y0 + h * (.35 + r() * .3);
    s += `<line x1="${x0}" y1="${hy}" x2="${x0 + w * .45}" y2="${hy}" stroke="${dark}" stroke-width="5"/>`;
    // حیاط/فضای رنگی
    const cx = x0 + w * (.3 + r() * .35), cw = 120 + r() * 120;
    s += `<rect x="${cx}" y="${y0 + h * .3}" width="${cw}" height="${cw * .8}" fill="${main}" opacity=".28"/>`;
    // پنجره‌ها روی دیوار بیرونی
    for (let i = 0; i < 5; i++) {
      const xx = x0 + 60 + i * (w - 120) / 4;
      s += `<rect x="${xx - 30}" y="${y0 - 6}" width="60" height="12" fill="${paper}" stroke="${dark}" stroke-width="1.5"/>`;
    }
    // فلش شمال و مقیاس
    s += `<g transform="translate(1080 110)" stroke="${dark}" fill="none" stroke-width="2"><circle r="28"/><path d="M0 -22 L10 14 L0 6 L-10 14 Z" fill="${dark}"/></g>`;
    s += `<g transform="translate(220 700)" fill="${dark}"><rect width="40" height="8"/><rect x="80" width="40" height="8"/><rect width="160" height="8" fill="none" stroke="${dark}"/></g>`;
    return s;
  }

  const KINDS = { built, render, drawing };

  window.artPlate = function (kind, palette, seed) {
    const r = rng(seed);
    const id = Math.floor(r() * 1e9).toString(36);
    const body = (KINDS[kind] || built)(r, palette, id);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  /* آدرس نهایی یک تصویر: عکس واقعی یا پلاک جایگزین */
  window.imageSrc = function (project, kind, index) {
    const list = project[kind === "render" ? "renders" : kind === "drawing" ? "drawings" : "built"] || [];
    const item = list[index];
    if (item && item.src) return item.src;
    return window.artPlate(kind, project.palette, project.slug + kind + index);
  };

  /* تصویر شاخص پروژه برای کارت گالری */
  window.coverSrc = function (project) {
    if (project.cover) return project.cover;
    if (project.built && project.built.length) return window.imageSrc(project, "built", 0);
    return window.imageSrc(project, "render", 0);
  };
})();
