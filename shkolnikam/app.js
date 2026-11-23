(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bp = () => innerWidth >= 1024 ? 'd' : innerWidth >= 600 ? 't' : 'm';

/* ---------- menu ---------- */
const menu = $('#skMenu');
const burger = $('.sk-burger');
function setMenu(open) {
  menu.hidden = !open;
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(menu.hidden));
$('.sk-menu__close').addEventListener('click', () => setMenu(false));
menu.addEventListener('click', e => { if (e.target === menu || e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ---------- opportunities: five discrete steps, Figma Cards 1–5 ---------- */
const TUNE_KEY = 'sk-opp-tune-v1';
const TUNE_DEFAULTS = {
  duration: 700, ease: 'expo', bezier: '0, 0, 0.16, 1', lock: 180,
  travel: 1, rotation: 1, lineDur: 700, lineStagger: 100, lineOffset: 30
};
let tune = { ...TUNE_DEFAULTS };
try { Object.assign(tune, JSON.parse(localStorage.getItem(TUNE_KEY) || '{}')); } catch (e) {}

const POSES = {
  a: [
    { x: 475, y: 227, r: 0, o: 1 },
    { x: 494.43, y: 202.34, r: -6, o: 1 },
    { x: 508.76, y: 149, r: -10, o: 1 },
    { x: 508.76, y: 149, r: -10, o: 1 },
    { x: 508.76, y: 149, r: -10, o: 1 }
  ],
  b: [
    { x: 475, y: 404, r: 0, o: 0 },
    { x: 475, y: 364, r: 0, o: 1 },
    { x: 475, y: 227, r: 0, o: 1 },
    { x: 439, y: 253.22, r: 6, o: 1 },
    { x: 415, y: 292.09, r: 10, o: 1 }
  ],
  c: [
    { x: 475, y: 446, r: 0, o: 0 },
    { x: 475, y: 446, r: 0, o: 0 },
    { x: 475, y: 446, r: 0, o: 0 },
    { x: 475, y: 454, r: 0, o: 1 },
    { x: 475, y: 227, r: 0, o: 1 }
  ]
};
const ANCHOR = { a: POSES.a[0], b: POSES.b[2], c: POSES.c[4] };
const stage = $('#oppStage');
const frame = $('#oppFrame');
const shots = {
  a: $('.sk-shot[data-shot="a"]'),
  b: $('.sk-shot[data-shot="b"]'),
  c: $('.sk-shot[data-shot="c"]')
};
const caps = $$('.sk-cap');
let step = 0;
let anim = null;
let busyUntil = 0;
let locked = false;
let scrollingAway = false;

function easeOf(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (tune.ease === 'cubic') return 1 - Math.pow(1 - t, 3);
  if (tune.ease === 'quart') return 1 - Math.pow(1 - t, 4);
  if (tune.ease === 'bezier') return bezierEase(t);
  return 1 - Math.pow(2, -10 * t);
}
function bezierEase(t) {
  const p = String(tune.bezier).split(/[,\s]+/).map(Number);
  const [x1, y1, x2, y2] = p.length === 4 && p.every(n => !Number.isNaN(n)) ? p : [0, 0, 0.16, 1];
  let u = t;
  for (let i = 0; i < 6; i++) {
    const x = 3 * x1 * u * (1 - u) * (1 - u) + 3 * x2 * u * u * (1 - u) + u * u * u;
    const dx = 3 * x1 * (1 - u) * (1 - 3 * u) + 3 * x2 * u * (2 - 3 * u) + 3 * u * u;
    if (Math.abs(x - t) < 1e-4 || Math.abs(dx) < 1e-4) break;
    u = Math.min(1, Math.max(0, u - (x - t) / dx));
  }
  return 3 * y1 * u * (1 - u) * (1 - u) + 3 * y2 * u * u * (1 - u) + u * u * u;
}
function posed(key, index) {
  const raw = POSES[key][index];
  const a = ANCHOR[key];
  return {
    x: a.x + (raw.x - a.x) * tune.travel,
    y: a.y + (raw.y - a.y) * tune.travel,
    r: raw.r * tune.rotation,
    o: raw.o
  };
}
function fitStage() {
  const pad = 16;
  const s = Math.min((stage.clientWidth - pad) / 1440, (stage.clientHeight - pad) / 800);
  frame.style.transform = `translate(-50%, -50%) scale(${s})`;
  frame.dataset.scale = String(s);
}
function placeShot(el, p) {
  el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotate(${p.r.toFixed(2)}deg)`;
  el.style.opacity = String(p.o);
}
/* Lassie animateText: each block (not SplitText) from y +30px / autoAlpha 0,
   ease expo.out, the next block 0.1s later. Exit travels back up. */
const TEXT_EASE = 'cubic-bezier(.19, 1, .22, 1)';
function setText(cap, shown, instant) {
  const units = $$('.sk-linehost', cap);
  cap.classList.toggle('is-on', shown);
  units.forEach((el, i) => {
    const order = shown ? i : units.length - 1 - i;
    const delay = instant || reduce ? 0 : order * tune.lineStagger;
    const hiddenY = cap.dataset.leaving === 'up' ? -tune.lineOffset : tune.lineOffset;
    const y = shown ? 0 : hiddenY;
    if (instant || reduce) {
      el.style.transition = 'none';
      el.style.transform = `translate3d(0,${shown ? 0 : tune.lineOffset}px,0)`;
      el.style.opacity = shown ? '1' : '0';
      return;
    }
    if (shown) {
      el.style.transition = 'none';
      el.style.transform = `translate3d(0,${tune.lineOffset}px,0)`;
      el.style.opacity = '0';
      el.getBoundingClientRect();
    }
    const dur = Math.max(0, tune.lineDur);
    el.style.transition = `transform ${dur}ms ${TEXT_EASE} ${delay}ms, opacity ${dur}ms ${TEXT_EASE} ${delay}ms`;
    el.style.transform = `translate3d(0,${y}px,0)`;
    el.style.opacity = shown ? '1' : '0';
  });
}
function lerpPose(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
    r: a.r + (b.r - a.r) * t, o: a.o + (b.o - a.o) * t
  };
}
function goStep(next) {
  next = Math.max(0, Math.min(4, next));
  if (next === step && !anim) return;
  const prev = step;
  const start = {}, end = {};
  ['a', 'b', 'c'].forEach(k => { start[k] = posed(k, prev); end[k] = posed(k, next); });
  const dirUp = next > prev;
  step = next;
  stage.dataset.step = String(next);
  caps.forEach(cap => {
    const on = +cap.dataset.cap === next;
    cap.dataset.leaving = dirUp ? 'up' : 'down';
    setText(cap, on, reduce);
  });
  if (reduce || tune.duration <= 0) {
    showPose(next, true);
    busyUntil = performance.now() + tune.lock;
    return;
  }
  const t0 = performance.now();
  busyUntil = t0 + tune.duration + tune.lock;
  if (anim) cancelAnimationFrame(anim);
  const tick = now => {
    const t = easeOf(Math.min(1, (now - t0) / tune.duration));
    ['a', 'b', 'c'].forEach(k => placeShot(shots[k], lerpPose(start[k], end[k], t)));
    if (t < 1) anim = requestAnimationFrame(tick);
    else { anim = null; ['a', 'b', 'c'].forEach(k => placeShot(shots[k], end[k])); }
  };
  anim = requestAnimationFrame(tick);
}
function alignStage() {
  scrollTo(0, stage.getBoundingClientRect().top + scrollY);
  locked = true;
}
function leaveTo(el) {
  locked = false;
  scrollingAway = true;
  const y = el.getBoundingClientRect().top + scrollY;
  const from = scrollY, dist = y - from;
  if (reduce || Math.abs(dist) < 2) { scrollTo(0, y); scrollingAway = false; busyUntil = performance.now() + 220; return; }
  const t0 = performance.now(), dur = 650;
  busyUntil = t0 + dur + tune.lock;
  const tick = now => {
    const t = easeOf(Math.min(1, (now - t0) / dur));
    scrollTo(0, from + dist * t);
    if (t < 1) requestAnimationFrame(tick);
    else { scrollTo(0, y); scrollingAway = false; }
  };
  requestAnimationFrame(tick);
}
function tryStep(dir) {
  if (performance.now() < busyUntil || scrollingAway) return;
  if (dir > 0) { if (step < 4) goStep(step + 1); else leaveTo($('#test')); }
  else if (step > 0) goStep(step - 1);
  else leaveTo($('#opportunities'));
}
let lastWheel = 0, lastAbs = 0, consumed = false;
addEventListener('wheel', e => {
  if (e.ctrlKey || e.target.closest('.sk-tune, input, textarea, select')) return;
  const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  const dir = Math.sign(dy), abs = Math.abs(dy), now = performance.now();
  const top = stage.getBoundingClientRect().top;
  if (!locked && dir > 0 && top > 2 && top < innerHeight * 0.8) {
    e.preventDefault(); alignStage(); step = 0; showPose(0, true); return;
  }
  if (!locked && dir < 0) {
    const testTop = $('#test').getBoundingClientRect().top;
    if (testTop > -8 && testTop < innerHeight * 0.55 && top < -8) {
      e.preventDefault(); alignStage(); step = 4; showPose(4, true); return;
    }
  }
  if (!(locked || Math.abs(top) < 3)) return;
  e.preventDefault();
  if (!locked) alignStage();
  const idle = now >= busyUntil && !scrollingAway;
  if (now - lastWheel > Math.max(140, tune.lock)) consumed = false;
  else if (idle && abs >= 12 && abs > lastAbs * 1.4) consumed = false;
  lastWheel = now; lastAbs = abs;
  if (consumed || abs < 2 || !dir || !idle) return;
  tryStep(dir);
  consumed = true;
}, { passive: false });
let tx0 = 0, ty0 = 0, tAxis = null, tActive = false;
addEventListener('touchstart', e => {
  if (e.touches.length !== 1 || e.target.closest('.sk-track, .sk-tune')) { tActive = false; return; }
  tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; tAxis = null; tActive = true;
}, { passive: true });
addEventListener('touchmove', e => {
  if (!tActive) return;
  const dx = e.touches[0].clientX - tx0, dy = e.touches[0].clientY - ty0;
  if (!tAxis && Math.hypot(dx, dy) > 8) tAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (tAxis === 'y' && locked) e.preventDefault();
}, { passive: false });
addEventListener('touchend', e => {
  if (!tActive || tAxis !== 'y') return;
  tActive = false;
  const dy = ty0 - e.changedTouches[0].clientY;
  if (Math.abs(dy) < 40) return;
  const top = stage.getBoundingClientRect().top;
  if (!locked && dy > 0 && top > 2 && top < innerHeight * 0.8) { alignStage(); step = 0; showPose(0, true); return; }
  if (locked) tryStep(Math.sign(dy));
}, { passive: true });
addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, select, .sk-tune') || e.altKey || e.metaKey || e.ctrlKey) return;
  const down = e.key === 'ArrowDown' || e.key === 'PageDown';
  const up = e.key === 'ArrowUp' || e.key === 'PageUp';
  if (!down && !up) return;
  const top = stage.getBoundingClientRect().top;
  if (!locked && Math.abs(top) > 3) return;
  e.preventDefault();
  if (!locked) alignStage();
  tryStep(down ? 1 : -1);
});
function showPose(index, instant) {
  ['a', 'b', 'c'].forEach(k => placeShot(shots[k], posed(k, index)));
  caps.forEach(cap => setText(cap, +cap.dataset.cap === index, instant));
  stage.dataset.step = String(index);
}
function bootStage() { fitStage(); showPose(0, true); }
addEventListener('resize', fitStage);
bootStage();
window.__sk = {
  goStep, tryStep,
  get step() { return step; },
  get tune() { return tune; },
  pose: k => posed(k, step)
};

const stepsEl = $('.sk-steps');
if (stepsEl && !reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { stepsEl.classList.add('is-in'); io.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(stepsEl);
} else if (stepsEl) stepsEl.classList.add('is-in');

if (new URLSearchParams(location.search).get('tune') === '1') {
  const panel = $('#skTune');
  panel.hidden = false;
  const fields = { tnDur: 'duration', tnLock: 'lock', tnTravel: 'travel', tnRot: 'rotation', tnLine: 'lineDur', tnStagger: 'lineStagger', tnOffset: 'lineOffset' };
  const out = $('#tnOut');
  function paint() {
    Object.entries(fields).forEach(([id, key]) => { $('#' + id).value = tune[key]; });
    $('#tnEase').value = tune.ease;
    $('#tnBezier').value = tune.bezier;
    out.textContent = JSON.stringify(tune);
  }
  function save() { localStorage.setItem(TUNE_KEY, JSON.stringify(tune)); paint(); }
  Object.keys(fields).forEach(id => $('#' + id).addEventListener('input', e => { tune[fields[id]] = Number(e.target.value); save(); }));
  $('#tnEase').addEventListener('change', e => { tune.ease = e.target.value; save(); });
  $('#tnBezier').addEventListener('change', e => { tune.bezier = e.target.value; save(); });
  $('#tnReset').addEventListener('click', () => { tune = { ...TUNE_DEFAULTS }; save(); });
  $('#tnCopy').addEventListener('click', async () => {
    const text = JSON.stringify(tune, null, 2);
    try { await navigator.clipboard.writeText(text); out.textContent = 'Скопировано\n' + text; }
    catch (err) { out.textContent = text; }
  });
  paint();
}


/* ---------- events ---------- */
const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MONTHS_N = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
const EVENTS = [
  { date: '2026-03-21', city: 'Москва', title: 'Внеурочные занятия в школе для подростков 14–16 лет', status: 'closed', cat: 'expert' },
  { date: '2026-03-22', city: 'Москва', title: 'Экскурсия в офис в управляющую компанию в Москве', status: 'open', cat: 'office' },
  { date: '2026-04-04', city: 'Санкт-Петербург', title: 'День открытых дверей по проекту «Профессионалитет» для выпускников колледжа', status: 'open', cat: 'doors' }
];
const CATS = { office: 'Экскурсии в офис', doors: 'Дни открытых дверей', consult: 'Карьерные консультации', expert: 'Встречи с экспертом' };
let activeCats = new Set();
let activeDate = null;
let calOpen = false;
let calCursor = new Date(2026, 6, 1); /* July 2026, as in the open-calendar frame */

const dateBtn = $('#dateBtn');
const clearBtn = $('#clearFilters');
const track = $('#eventTrack');
const trackWrap = $('#trackWrap');
const emptyFilters = $('#emptyFilters');
const emptyNone = $('#emptyNone');

function fmtDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { d, m, y, label: d + ' ' + MONTHS[m - 1] };
}
function isoOf(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}
function filtered() {
  return EVENTS.filter(ev => {
    if (activeDate && ev.date !== activeDate) return false;
    if (activeCats.size && ![...activeCats].includes(ev.cat)) return false;
    return true;
  });
}
function eventDays(y, m) {
  return new Set(EVENTS.filter(ev => {
    const p = fmtDay(ev.date);
    return p.y === y && p.m - 1 === m;
  }).map(ev => fmtDay(ev.date).d));
}
function calendarHTML() {
  const y = calCursor.getFullYear();
  const m = calCursor.getMonth();
  const first = new Date(y, m, 1);
  let start = (first.getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const marks = eventDays(y, m);
  const cells = [];
  for (let i = 0; i < start; i++) cells.push({ n: prevDays - start + 1 + i, out: true });
  for (let d = 1; d <= days; d++) cells.push({ n: d, out: false, iso: isoOf(y, m, d), event: marks.has(d) });
  while (cells.length % 7) cells.push({ n: cells.length - (start + days) + 1, out: true });
  const wd = ['пн','вт','ср','чт','пт','сб','вс'].map(w => `<span class="sk-cal__wd">${w}</span>`).join('');
  const grid = cells.map(c => {
    if (c.out) return `<span class="sk-cal__day is-out">${c.n}</span>`;
    const sel = activeDate === c.iso ? ' is-sel' : '';
    const ev = c.event ? ' is-event' : '';
    return `<button type="button" class="sk-cal__day${sel}${ev}" data-date="${c.iso}">${c.n}</button>`;
  }).join('');
  const note = activeDate ? 'Дата выбрана' : 'Выберите дату';
  return `<article class="sk-cal" id="calendar">
    <div class="sk-cal__bar">
      <button type="button" data-cal="-1" aria-label="Предыдущий месяц">‹</button>
      <p>${MONTHS_N[m]} ${y}</p>
      <button type="button" data-cal="1" aria-label="Следующий месяц">›</button>
    </div>
    <div class="sk-cal__grid">${wd}${grid}</div>
    <p class="sk-cal__note">${note}</p>
  </article>`;
}
function cardHTML(ev) {
  const f = fmtDay(ev.date);
  const open = ev.status === 'open';
  return `<article class="sk-ev${open ? ' is-open' : ''}">
    <div class="sk-ev__tags"><span class="sk-tag">${String(f.d).padStart(2, '0')} ${MONTHS[f.m - 1]}</span><span class="sk-tag">${ev.city}</span></div>
    <h3 class="sk-ev__title">${ev.title}</h3>
    <div class="sk-ev__bottom">
      <span class="sk-ev__status">${open ? 'Регистрация открыта' : 'Запись завершена'}</span>
      ${open ? '<a class="sk-btn sk-btn--gold" href="#events">подробнее</a>' : ''}
    </div>
  </article>`;
}
function renderEvents() {
  const anyFilter = activeCats.size > 0 || !!activeDate;
  clearBtn.hidden = !anyFilter;
  $$('.sk-chip[data-cat]').forEach(b => b.classList.toggle('is-on', activeCats.has(b.dataset.cat)));
  dateBtn.classList.toggle('is-on', !!activeDate);
  dateBtn.setAttribute('aria-expanded', calOpen ? 'true' : 'false');
  dateBtn.firstChild.textContent = activeDate ? fmtDay(activeDate).label + ' ' : 'Выбрать дату ';
  if (!EVENTS.length) {
    emptyNone.hidden = false; emptyFilters.hidden = true; trackWrap.hidden = true; return;
  }
  const list = filtered();
  if (!list.length) {
    emptyFilters.hidden = false; emptyNone.hidden = true; trackWrap.hidden = true; return;
  }
  emptyFilters.hidden = true; emptyNone.hidden = true; trackWrap.hidden = false;
  track.innerHTML = (calOpen ? calendarHTML() : '') + list.map(cardHTML).join('');
  requestAnimationFrame(syncNav);
}
function syncNav() {
  const [prev, next] = $$('#eventNav button');
  const max = track.scrollWidth - track.clientWidth;
  prev.disabled = track.scrollLeft < 2;
  next.disabled = track.scrollLeft >= max - 2;
}
dateBtn.addEventListener('click', () => { calOpen = !calOpen; renderEvents(); });
clearBtn.addEventListener('click', () => { activeCats.clear(); activeDate = null; calOpen = false; renderEvents(); });
$('#showAll').addEventListener('click', e => { e.preventDefault(); activeCats.clear(); activeDate = null; calOpen = false; renderEvents(); document.getElementById('events').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
$('#filterRow').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]');
  if (!b) return;
  const c = b.dataset.cat;
  if (activeCats.has(c)) activeCats.delete(c); else activeCats.add(c);
  renderEvents();
});
track.addEventListener('click', e => {
  const nav = e.target.closest('[data-cal]');
  if (nav) { calCursor.setMonth(calCursor.getMonth() + (+nav.dataset.cal)); renderEvents(); return; }
  const day = e.target.closest('[data-date]');
  if (!day) return;
  activeDate = day.dataset.date;
  calOpen = false;
  renderEvents();
});
track.addEventListener('scroll', syncNav, { passive: true });
$$('#eventNav button').forEach(b => b.addEventListener('click', () => {
  const card = track.querySelector('.sk-ev, .sk-cal');
  const w = card ? card.getBoundingClientRect().width + 24 : 420;
  track.scrollBy({ left: +b.dataset.dir * w, behavior: reduce ? 'auto' : 'smooth' });
}));
renderEvents();

/* In-page anchors should not be treated as external actions. Buttons without a destination stay on the page. */
$$('a[href="#contacts"], a[href="#events"], a[href="#opportunities"], a[href="#test"], a[href="#top"]').forEach(a => {
  if (a.id === 'showAll') return;
});
})();
