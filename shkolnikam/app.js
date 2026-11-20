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

/* ---------- opportunities scroll-scrub (Cards 1–5) ---------- */
const FRAMES = {
  d: {
    w: 1440, h: 800, cw: 490, ch: 346,
    A: [
      { x: 475, y: 227, r: 0 },
      { x: 494.43, y: 202.34, r: -6 },
      { x: 508.76, y: 149, r: -10 },
      { x: 508.76, y: 149, r: -10 },
      { x: 508.76, y: 149, r: -10 }
    ],
    B: [
      { x: 475, y: 1400, r: 0 },
      { x: 475, y: 364, r: 0 },
      { x: 475, y: 227, r: 0 },
      { x: 439, y: 253.22, r: 6 },
      { x: 415, y: 292.09, r: 10 }
    ],
    C: [
      { x: 475, y: 1500, r: 0 },
      { x: 475, y: 1500, r: 0 },
      { x: 475, y: 1400, r: 0 },
      { x: 475, y: 454, r: 0 },
      { x: 475, y: 227, r: 0 }
    ]
  }
};
/* Offsets are measured from the desktop “current” pose, then placed in each frame. */
function shiftFrames(base, frameW, home, cw) {
  const scale = cw / 490;
  const rest = base.A[0];
  const map = arr => arr.map(f => ({
    x: home.x + (f.x - rest.x) * scale,
    y: home.y + (f.y - rest.y) * scale,
    r: f.r
  }));
  return { w: frameW, h: base.h, cw, ch: Math.round(346 * scale), A: map(base.A), B: map(base.B), C: map(base.C) };
}
function layoutFor(name) {
  if (name === 'd') return FRAMES.d;
  if (name === 't') return shiftFrames(FRAMES.d, 768, { x: 380, y: 150 }, 348);
  return shiftFrames(FRAMES.d, 375, { x: 20, y: 8 }, 335);
}

const pin = $('#oppPin');
const sticky = $('#oppSticky');
const world = $('#oppWorld');
const shots = {
  a: $('.sk-shot[data-shot="a"]'),
  b: $('.sk-shot[data-shot="b"]'),
  c: $('.sk-shot[data-shot="c"]')
};
const caps = $$('.sk-cap');
const lerp = (a, b, t) => a + (b - a) * t;
function sample(keys, step) {
  const i = Math.min(keys.length - 2, Math.max(0, Math.floor(step)));
  const t = step >= keys.length - 1 ? 1 : step - i;
  const A = keys[i], B = keys[Math.min(keys.length - 1, i + 1)];
  return { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), r: lerp(A.r, B.r, t) };
}
function placeShot(el, f, scale, cw, ch) {
  el.style.width = (cw * scale) + 'px';
  el.style.height = (ch * scale) + 'px';
  el.style.transform = `translate3d(${(f.x * scale).toFixed(2)}px, ${(f.y * scale).toFixed(2)}px, 0) rotate(${f.r.toFixed(2)}deg)`;
}
let oppStep = 0;
function renderOpp(step) {
  oppStep = step;
  const lay = layoutFor(bp());
  const scale = world.clientWidth / lay.w;
  world.dataset.step = step.toFixed(3);
  placeShot(shots.a, sample(lay.A, step), scale, lay.cw, lay.ch);
  placeShot(shots.b, sample(lay.B, step), scale, lay.cw, lay.ch);
  placeShot(shots.c, sample(lay.C, step), scale, lay.cw, lay.ch);
  caps.forEach(cap => {
    const at = +cap.dataset.cap;
    const dist = Math.abs(step - at);
    const o = Math.max(0, 1 - dist / 0.42);
    cap.style.opacity = o.toFixed(3);
    cap.style.pointerEvents = o > 0.4 ? 'auto' : 'none';
  });
}
function oppProgress() {
  if (reduce) return 4;
  const start = pin.offsetTop;
  const travel = pin.offsetHeight - sticky.offsetHeight;
  if (travel <= 0) return 4;
  return Math.min(4, Math.max(0, (scrollY - start) / travel * 4));
}
function tickOpp() { renderOpp(oppProgress()); }
if (reduce) pin.closest('.sk-opp').classList.add('is-reduced');
addEventListener('scroll', tickOpp, { passive: true });
addEventListener('resize', tickOpp);
tickOpp();

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

/* ---------- social carousel (documented caption; photos from the contacts set) ---------- */
const SOCIAL = [
  { img: 'assets/photos/photo-a.png', meta: '14 мая · телеграм-канал @arealjobs', text: 'В мае 11 лучших амбассадоров посетили офис управляющей компании и приняли участие в командных играх' },
  { img: 'assets/contacts/raw-4.jpeg', meta: '14 мая · телеграм-канал @arealjobs', text: 'В мае 11 лучших амбассадоров посетили офис управляющей компании и приняли участие в командных играх' },
  { img: 'assets/contacts/raw-5.jpeg', meta: '14 мая · телеграм-канал @arealjobs', text: 'В мае 11 лучших амбассадоров посетили офис управляющей компании и приняли участие в командных играх' }
];
let soc = 0;
const socImg = $('#socImg');
const socMeta = $('#socMeta');
const socText = $('#socText');
const socDots = $('#socDots');
const socBackL = $('#socBackL');
const socBackR = $('#socBackR');
function renderSoc() {
  const cur = SOCIAL[soc];
  socImg.src = cur.img;
  socImg.alt = 'Фото из социальных сетей Ареала';
  socMeta.textContent = cur.meta;
  socText.textContent = cur.text;
  socBackL.src = SOCIAL[(soc + 1) % SOCIAL.length].img;
  socBackR.src = SOCIAL[(soc + 2) % SOCIAL.length].img;
  socDots.innerHTML = SOCIAL.map((_, i) => `<button type="button" role="tab" aria-label="Запись ${i + 1}" class="${i === soc ? 'is-on' : ''}" data-i="${i}"></button>`).join('');
}
socDots.addEventListener('click', e => {
  const b = e.target.closest('[data-i]');
  if (!b) return;
  soc = +b.dataset.i;
  renderSoc();
});
renderSoc();

/* In-page anchors should not be treated as external actions. Buttons without a destination stay on the page. */
$$('a[href="#contacts"], a[href="#events"], a[href="#opportunities"], a[href="#test"], a[href="#top"]').forEach(a => {
  if (a.id === 'showAll') return;
});
})();
