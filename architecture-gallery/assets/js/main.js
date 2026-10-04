/* ==========================================================================
   رفتارهای مشترک سایت + راه‌اندازی هر صفحه بر اساس data-page روی <body>
   ========================================================================== */
(function () {
  const S = window.STUDIO, P = window.PROJECTS, C = window.CATEGORIES;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const fa = (n) => Number(n).toLocaleString("fa-IR");
  const faNo = (n) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const yr = (y) => fa(y).replace(/[٬,]/g, "");
  const catLabel = (id) => (C.find((c) => c.id === id) || {}).label || "";
  const STATUS = { built: "اجرا شده", progress: "در حال اجرا", concept: "طرح" };
  const page = document.body.dataset.page;

  /* ---------- سربرگ و پانویس ---------- */
  function header() {
    const links = [["index.html", "آثار", "home"], ["about.html", "درباره ما", "about"], ["contact.html", "تماس با ما", "contact"]];
    const el = document.createElement("header");
    el.className = "site-header";
    el.innerHTML = `<div class="wrap">
      <a class="brand" href="index.html" aria-label="${esc(S.name)}">
        <i class="brand-mark"></i><span class="brand-name">${esc(S.name)}</span><span class="brand-latin latin">${esc(S.latin)}</span>
      </a>
      <nav class="nav" id="nav">${links.map(([h, t, k]) =>
        `<a href="${h}" class="${page === k || (page === "project" && k === "home") ? "active" : ""}">${t}</a>`).join("")}</nav>
      <button class="menu-btn" aria-label="منو" aria-controls="nav" aria-expanded="false"><span></span><span></span></button>
    </div>`;
    document.body.prepend(el);
    const btn = $(".menu-btn", el);
    btn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", open);
    });
    const onScroll = () => el.classList.toggle("scrolled", scrollY > 30);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function footer() {
    const el = document.createElement("footer");
    el.className = "site-footer";
    el.innerHTML = `<div class="wrap">
      <p class="footer-cta">پروژه‌ای در ذهن دارید؟<br><a href="contact.html">بیایید گفت‌وگو کنیم</a></p>
      <div class="footer-grid">
        <div><span class="eyebrow">استودیو</span><p>${esc(S.address)}</p></div>
        <div><span class="eyebrow">تماس</span><a href="mailto:${esc(S.email)}" class="latin">${esc(S.email)}</a><a href="tel:${esc(S.phone)}">${esc(S.phone)}</a></div>
        <div><span class="eyebrow">صفحات</span><a href="index.html">آثار</a><a href="about.html">درباره ما</a><a href="contact.html">تماس با ما</a></div>
        <div><span class="eyebrow">شبکه‌ها</span>${S.social.map((s) => `<a class="latin" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div>
      </div>
      <div class="copyright"><span>© ${yr(1404)} ${esc(S.name)} — تمامی حقوق محفوظ است.</span><span class="latin">${esc(S.latin)} · EST. ${esc(S.founded + 621)}</span></div>
    </div>`;
    document.body.append(el);
  }

  /* ---------- انیمیشن ورود ---------- */
  function reveals() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal:not(.in)").forEach((el) => io.observe(el));
  }

  /* ---------- لایت‌باکس ---------- */
  const lb = { items: [], i: 0, el: null };
  function lightbox() {
    const el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML = `<div class="lb-top"><span class="lb-title"></span><button class="lb-close">بستن ✕</button></div>
      <div class="lb-stage"><img alt=""><button class="lb-nav lb-prev" aria-label="قبلی"></button><button class="lb-nav lb-next" aria-label="بعدی"></button></div>
      <div class="lb-bottom"><span class="lb-cap"></span><span class="lb-arrows"><button class="lb-prev" aria-label="قبلی">→</button><span class="lb-count"></span><button class="lb-next" aria-label="بعدی">←</button></span></div>`;
    document.body.append(el);
    lb.el = el;
    $(".lb-close", el).onclick = closeLb;
    $$(".lb-prev", el).forEach((b) => (b.onclick = () => showLb(lb.i - 1)));
    $$(".lb-next", el).forEach((b) => (b.onclick = () => showLb(lb.i + 1)));
    addEventListener("keydown", (e) => {
      if (!el.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(lb.i + 1);
      if (e.key === "ArrowRight") showLb(lb.i - 1);
    });
    let x0 = null;
    el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) showLb(lb.i + (dx > 0 ? 1 : -1));
      x0 = null;
    });
  }
  function openLb(items, i, title) {
    lb.items = items;
    $(".lb-title", lb.el).textContent = title;
    lb.el.classList.add("open");
    document.body.style.overflow = "hidden";
    showLb(i);
    $(".lb-close", lb.el).focus();
  }
  function showLb(i) {
    const n = lb.items.length;
    lb.i = (i + n) % n;
    const it = lb.items[lb.i];
    const img = $(".lb-stage img", lb.el);
    img.src = it.src;
    img.alt = it.caption;
    $(".lb-cap", lb.el).textContent = it.caption;
    $(".lb-count", lb.el).textContent = `${lb.i + 1} / ${n}`;
  }
  function closeLb() {
    lb.el.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- کارت اثر ---------- */
  function workCard(p) {
    return `<article class="work reveal" data-cat="${p.category}">
      <a href="project.html?p=${encodeURIComponent(p.slug)}">
        <div class="frame"><div class="frame-inner"><img src="${coverSrc(p)}" alt="${esc(p.title)}" loading="lazy"></div></div>
        <div class="label">
          <span class="no">${faNo(p.number)}</span>
          <h3>${esc(p.title)}</h3>
          <span class="yr">${yr(p.year)}</span>
          <div class="meta"><span>${esc(catLabel(p.category))}</span><span>${esc(p.location)}</span><span class="status status-${p.status}">${STATUS[p.status]}</span></div>
        </div>
      </a>
    </article>`;
  }

  /* ---------- صفحه اصلی ---------- */
  function home() {
    const grid = $("#gallery");
    grid.innerHTML = P.map(workCard).join("");
    const counts = (id) => (id === "all" ? P.length : P.filter((p) => p.category === id).length);
    const filters = $("#filters");
    filters.innerHTML = C.filter((c) => counts(c.id) > 0)
      .map((c, i) => `<button class="${i === 0 ? "active" : ""}" data-f="${c.id}">${c.label}<sup>${fa(counts(c.id))}</sup></button>`).join("");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", filters).forEach((x) => x.classList.toggle("active", x === b));
      $$(".work", grid).forEach((w) => w.classList.toggle("hidden", b.dataset.f !== "all" && w.dataset.cat !== b.dataset.f));
    });
    const built = P.filter((p) => p.status === "built").length;
    const area = P.reduce((s, p) => s + (p.builtArea || 0), 0);
    $("#stats").innerHTML = `
      <div><b>${fa(P.length)}</b><small>پروژه طراحی شده</small></div>
      <div><b>${fa(built)}</b><small>پروژه اجرا شده</small></div>
      <div><b>${fa(area)}</b><small>متر مربع زیربنا</small></div>
      <div><b>${fa(1404 - S.founded)}</b><small>سال تجربه</small></div>`;
  }

  /* ---------- صفحه پروژه ---------- */
  function project() {
    const slug = new URLSearchParams(location.search).get("p");
    const idx = Math.max(0, P.findIndex((p) => p.slug === slug));
    const p = P[idx];
    const next = P[(idx + 1) % P.length];
    document.title = `${p.title} — ${S.name}`;

    const specs = [
      ["کاربری", catLabel(p.category)],
      ["وضعیت", `<span class="status status-${p.status}">${STATUS[p.status]}</span>`],
      ["موقعیت", esc(p.location)],
      ["سال", yr(p.year)],
      ["کارفرما", esc(p.client)],
      ["مساحت زمین", p.siteArea ? `${fa(p.siteArea)} متر مربع` : ""],
      ["زیربنا", p.builtArea ? `${fa(p.builtArea)} متر مربع` : ""],
      ["طبقات", esc(p.floors)],
      ["سازه", esc(p.structure)],
      ["مصالح", esc((p.materials || []).join("، "))],
      ["تیم طراحی", esc((p.team || []).join("، "))],
      ["عکاس", esc(p.photographer)]
    ].filter(([, v]) => v && v !== "—");

    const tabs = [
      ["built", "عکس‌های اجرا شده", p.built || []],
      ["render", "رندرها", p.renders || []],
      ["drawing", "نقشه‌ها و دیاگرام‌ها", p.drawings || []]
    ];
    const first = tabs.find((t) => t[2].length) || tabs[0];

    $("#project").innerHTML = `
      <section class="p-hero wrap">
        <div class="p-title">
          <div><span class="eyebrow">اثر شماره ${faNo(p.number)} — ${esc(catLabel(p.category))}</span>
          <h1 class="line-reveal"><span>${esc(p.title)}</span></h1></div>
          <span class="latin">${esc(p.latin)}</span>
        </div>
        <div class="p-cover" id="cover"><img src="${coverSrc(p)}" alt="${esc(p.title)}"></div>
      </section>

      <section class="p-body wrap">
        <aside class="specs reveal"><span class="eyebrow">مشخصات پروژه</span><dl>
          ${specs.map(([k, v]) => `<div class="row"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
        </dl></aside>
        <div class="concept reveal">
          <p class="lead">${esc(p.summary)}</p>
          ${(p.concept || []).map((t) => `<p>${esc(t)}</p>`).join("")}
          ${p.awards && p.awards.length ? `<ul class="awards">${p.awards.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
        </div>
      </section>

      <section class="wrap" id="images">
        <div class="tabs" role="tablist">${tabs.map(([k, t, list]) =>
          `<button role="tab" data-k="${k}" ${list.length ? "" : "disabled"} class="${k === first[0] ? "active" : ""}" aria-selected="${k === first[0]}">${t}<sup>${fa(list.length)}</sup></button>`).join("")}
        </div>
        <div id="plates"></div>
      </section>

      <a class="next wrap" href="project.html?p=${encodeURIComponent(next.slug)}">
        <span class="eyebrow">اثر بعدی — ${faNo(next.number)}</span><h2>${esc(next.title)}</h2>
      </a>`;

    const items = (k) => tabs.find((t) => t[0] === k)[2].map((it, i) => ({ src: imageSrc(p, k, i), caption: it.caption }));
    function showTab(k) {
      const list = items(k);
      const box = $("#plates");
      box.innerHTML = list.length
        ? `<div class="plates ${k}">${list.map((it, i) => `<figure class="plate reveal" data-i="${i}">
            <div class="img"><img src="${it.src}" alt="${esc(it.caption)}" loading="lazy"></div>
            <figcaption><span class="latin">${String(i + 1).padStart(2, "0")}</span><span>${esc(it.caption)}</span></figcaption></figure>`).join("")}</div>`
        : `<p class="empty">تصویری برای این بخش ثبت نشده است.</p>`;
      $$(".plate", box).forEach((f) => f.addEventListener("click", () => openLb(list, +f.dataset.i, p.title)));
      reveals();
    }
    $(".tabs").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.disabled) return;
      $$(".tabs button").forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
      showTab(b.dataset.k);
    });
    showTab(first[0]);

    const cover = $("#cover");
    requestAnimationFrame(() => cover.classList.add("in"));
    cover.addEventListener("click", () => openLb([{ src: coverSrc(p), caption: p.title }].concat(items("built"), items("render")), 0, p.title));
  }

  /* ---------- درباره ما ---------- */
  function about() {
    const team = $("#team");
    if (!team) return;
    const people = [
      ["سروش صالحی", "بنیان‌گذار و معمار ارشد"],
      ["مریم کاظمی", "مدیر طراحی داخلی"],
      ["امیر رضایی", "معمار و مدیر پروژه"],
      ["سارا حسینی", "طراح و مدل‌ساز"]
    ];
    const pal = [["#8a8378", "#ebe7df", "#26231f"], ["#b5643c", "#e8dccb", "#2a2420"], ["#4f6152", "#e3e6dc", "#1c2420"], ["#c99a5b", "#efe4d2", "#3b2f25"]];
    team.innerHTML = people.map(([n, r], i) => `<div class="member reveal">
      <div class="portrait"><img src="${artPlate("render", pal[i], "member" + i)}" alt="${n}"></div>
      <h3>${n}</h3><p>${r}</p></div>`).join("");
    $("#awards").innerHTML = P.flatMap((p) => (p.awards || []).map((a) => [p, a]))
      .map(([p, a]) => `<tr><td>${yr(p.year)}</td><td>${esc(a)}</td><td><a href="project.html?p=${p.slug}">${esc(p.title)}</a></td></tr>`).join("");
  }

  /* ---------- تماس ---------- */
  function contact() {
    $("#info").innerHTML = `
      <div class="info-block"><span class="eyebrow">ایمیل</span><a class="latin" href="mailto:${esc(S.email)}">${esc(S.email)}</a></div>
      <div class="info-block"><span class="eyebrow">تلفن</span><a href="tel:${esc(S.phone)}">${esc(S.phone)}</a><br><a href="tel:${esc(S.mobile)}">${esc(S.mobile)}</a></div>
      <div class="info-block"><span class="eyebrow">نشانی استودیو</span><p>${esc(S.address)}</p></div>
      <div class="info-block"><span class="eyebrow">ساعات کاری</span><p>${esc(S.hours)}</p></div>
      <div class="info-block"><span class="eyebrow">شبکه‌های اجتماعی</span><div class="socials">${S.social.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div></div>`;

    const form = $("#form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const note = $(".form-note", form);
      if (!d.get("name") || !d.get("email") || !d.get("message")) {
        note.textContent = "لطفاً نام، ایمیل و پیام را وارد کنید.";
        return;
      }
      // بدون سرور: پیام در برنامه ایمیل کاربر باز می‌شود.
      // برای ارسال مستقیم، action فرم را به سرویسی مانند Formspree متصل کنید.
      const body = [
        `نام: ${d.get("name")}`, `ایمیل: ${d.get("email")}`, `تلفن: ${d.get("phone") || "-"}`,
        `نوع پروژه: ${d.getAll("type").join("، ") || "-"}`, `بودجه: ${d.get("budget") || "-"}`, "", d.get("message")
      ].join("\n");
      location.href = `mailto:${S.email}?subject=${encodeURIComponent("درخواست همکاری — " + d.get("name"))}&body=${encodeURIComponent(body)}`;
      note.textContent = "سپاس از شما؛ برنامه ایمیل برای ارسال پیام باز شد.";
      form.reset();
    });
  }

  /* ---------- اجرا ---------- */
  header();
  footer();
  lightbox();
  ({ home, project, about, contact }[page] || (() => {}))();
  reveals();
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("loaded")));
})();
