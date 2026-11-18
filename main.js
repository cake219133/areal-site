/* Ареал • Студентам — step controller, Why stage, Track switcher. Vanilla JS, no deps. */
(() => {
'use strict';

/* ---------------- timings (mirror CSS variables) ---------------- */
const SLIDE_MS = 600;            // Figma SMART_ANIMATE 600ms EASE_OUT (track + why steps)
const SCROLL_MS = 650;           // section-to-section scroll
const HOVER_OUT_MS = 150;        // = --hover-out
const CLICK_SLIDE_DELAY = HOVER_OUT_MS + 50; // slide starts after hover-out finished (+50ms pause)
const GESTURE_GAP_MS = 140;      // wheel silence that separates two gestures (trackpad inertia = one gesture)
const SWIPE_MIN = 40;            // px for a touch swipe
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const bp = () => innerWidth >= 1024 ? 'd' : innerWidth >= 600 ? 't' : 'm';
const canHover = matchMedia('(hover: hover) and (pointer: fine)');

/* =====================================================================
   WHY — data from Figma Component 45 variants (desktop 1440×800),
   «Шаг 121–125» (768×946) and mobile «Шаг 108» (375×710)
   [x, y, opacity]; element absent from a state => opacity 0 in place
   ===================================================================== */
const WHY_ASSETS = {
  card1:{k:'card',html:'<img class="cov" src="assets/why/card1b.jpg" alt="">',txt:'Предложение о&nbsp;работе еще во&nbsp;время учебы'},
  card2:{k:'card',html:'<img class="cov bot" src="assets/why/card2.jpg" alt="">',txt:'Реальный опыт на&nbsp;производстве'},
  card3:{k:'card',html:'<img class="cov bot" src="assets/why/card3.jpg" alt="">',txt:'<span class="v-d">Наставник на&nbsp;каждом этапе практики</span><span class="v-m">Наставник на&nbsp;период практики</span>'},
  card4:{k:'card',html:'<img class="cov" src="assets/why/card4a.jpg" alt=""><img class="cov" src="assets/why/card4b.jpg" alt="">',txt:'Оплата практики и&nbsp;стипендии'},
  card7:{k:'card',html:'<img class="cov" src="assets/why/card7a.jpg" alt=""><img class="cov" src="assets/why/card7b.jpg" alt="">',txt:'Рабочие места в&nbsp;8 регионах России'},
  p11:{k:'ph',html:'<div class="flipbox"><img src="assets/why/p11.jpg" alt="" style="left:0;top:-14.39%;width:100%;height:149.92%"></div>'},
  p12:{k:'ph',html:'<img class="cov" src="assets/why/p12.jpg" alt="">'},
  p21:{k:'ph',html:'<img class="cov bot" src="assets/why/p21.jpg" alt="">'},
  p22:{k:'ph',html:'<div class="flipbox"><img class="cov" src="assets/why/p22.jpg" alt=""></div>'},
  p31:{k:'ph',html:'<img class="cov bot" src="assets/why/p31.jpg" alt="">'},
  p32:{k:'ph',html:'<img class="cov bot" src="assets/why/p32.jpg" alt="">'},
  p41:{k:'ph',html:'<img src="assets/why/p41.jpg" alt="" style="left:-20.26%;top:0;width:150%;height:100%">'},
  p42:{k:'ph',html:'<img class="cov" src="assets/why/p42.jpg" alt="">'},
  p71:{k:'ph',html:'<img src="assets/why/p71.jpg" alt="" style="left:-10.83%;top:0;width:150.06%;height:100%">'},
  p72:{k:'ph',html:'<img class="cov" src="assets/why/p72.jpg" alt="">'},
};
/* Desktop: exact Figma keyframes. Landing steps = variants 92…88 (opacity forced to 0/1 so a step never
   rests semi-transparent); variant 93 = entry pose, 87 = exit pose (played while the section scrolls in/out). */
const bin = st => Object.fromEntries(Object.entries(st).map(([k, v]) => [k, [v[0], v[1], v[2] >= 1 ? 1 : 0]]));
const DESK = [
  {p11:[48,574,0],card1:[163,220,.1],p12:[933,187,0]},
  {p11:[48,416,1],card2:[965,275,0],card1:[163,180,1],p22:[163,656,0],p12:[933,147,1],p21:[1163,592,0]},
  {p12:[933,127,0],p42:[48,91,0],card1:[163,35,.1],card2:[965,125,1],p41:[1233,456,0],p22:[163,576,1],card4:[163,357,0],p21:[1163,532,1],p11:[48,386,.1]},
  {p22:[163,486,0],p41:[1233,386,1],card2:[965,5,0],card4:[163,337,1],card7:[1025,415,0],p71:[1233,267,0],p72:[233,157,0],p42:[48,61,1],p21:[1163,318,0]},
  {p41:[1233,336,0],p31:[965,236,0],p32:[277,632,0],card4:[163,267,0],card7:[1025,306,1],p72:[233,77,1],p71:[1233,121,1],card3:[48,220,0],p42:[48,1,.2]},
  {card3:[48,70,1],p31:[965,111,1],p32:[277,494,1],p71:[1233,66,0],p72:[233,17,0],card7:[1025,236,.2]},
  {p32:[277,375,0],p72:[233,17,0],card3:[48,0,0],p31:[965,31,0],card7:[1025,136,0]},
].map(bin);
/* Tablet / mobile: the same desktop behaviour (group arrives from below and fades in, previous group
   leaves upwards and fades out, purely vertical) applied to the groups/positions of the 768 and 375 frames. */
function fromGroups(groups, IN, OUT) {
  const st = [];
  const pose = cur => { const o = {}; groups.forEach((g, gi) => { for (const [id, [x, y]] of Object.entries(g)) {
    o[id] = gi === cur ? [x, y, 1] : gi < cur ? [x, y - OUT, 0] : [x, y + IN, 0]; } }); return o; };
  for (let c = -1; c <= groups.length; c++) st.push(pose(c));
  return st;
}
const WHY = {
  d:{W:1440,H:800,card:[262,330],ph:159,stagger:0,states:DESK},
  t:{W:768,H:946,card:[200,252],ph:120,stagger:0,states:fromGroups([
    {card1:[86,80],p12:[558,188],p11:[24,736]},
    {card2:[544,147],p22:[58,579],p21:[484,763]},
    {p42:[56,97],card4:[46,613],p41:[620,276]},
    {card7:[396,617],p72:[116,186],p71:[624,394]},
    {card3:[56,51],p31:[498,243],p32:[150,737]},
  ], 120, 140)},
  m:{W:375,H:710,card:[143,180],ph:80,stagger:110,states:fromGroups([
    {card1:[28,32],p12:[232,132],p21:[20,440],card2:[207,477],p22:[91,550]},
    {card3:[20,82],card7:[212,21],p41:[263,439],card4:[32,504],p42:[203,534]},
  ], 90, 110)},
};
// landing steps exclude the entry (0) and exit (last) poses
const whySteps = b => WHY[b].states.length - 2;
const whyAnimMs = b => SLIDE_MS + WHY[b].stagger * 4;

const whyStage = $('#whyStage');
const whyEls = {};
for (const [id, a] of Object.entries(WHY_ASSETS)) {
  const el = document.createElement('div');
  el.className = 'why-el ' + (a.k === 'card' ? 'why-card' : 'why-ph');
  el.innerHTML = a.html + (a.txt ? `<p>${a.txt}</p>` : '');
  el.style.opacity = 0;
  whyStage.appendChild(el); whyEls[id] = el;
}
// resolve full per-state tables (position persists, opacity 0 when absent)
function resolveWhy(conf) {
  const ids = Object.keys(WHY_ASSETS), out = conf.states.map(() => ({}));
  for (const id of ids) {
    const first = conf.states.findIndex(s => s[id]);
    let last = null;
    conf.states.forEach((s, i) => {
      if (s[id]) { last = s[id]; out[i][id] = s[id]; }
      else if (last) out[i][id] = [last[0], last[1], 0];
      else if (first >= 0) { const f = conf.states[first][id]; out[i][id] = [f[0], f[1], 0]; }
      else out[i][id] = null; // not used at this breakpoint
    });
  }
  return out;
}
const WHY_RESOLVED = { d: resolveWhy(WHY.d), t: resolveWhy(WHY.t), m: resolveWhy(WHY.m) };
let whyState = 0; // index into states (0 = entry pose)
function renderWhy(i, animate = true) {
  const b = bp(), conf = WHY[b], st = WHY_RESOLVED[b][i], prev = WHY_RESOLVED[b][whyState] || st;
  whyState = i;
  const sw = whyStage.clientWidth, sh = whyStage.clientHeight;
  const u = Math.min(sw / conf.W, sh / conf.H);
  whyStage.style.setProperty('--wu', u.toFixed(4) + 'px');
  let order = 0;
  for (const [id, el] of Object.entries(whyEls)) {
    const v = st[id];
    el.classList.toggle('no-anim', !animate);
    if (!v) { el.style.display = 'none'; continue; }
    el.style.display = '';
    const isCard = WHY_ASSETS[id].k === 'card';
    const w = (isCard ? conf.card[0] : conf.ph) * u, h = (isCard ? conf.card[1] : conf.ph) * u;
    el.style.width = w + 'px'; el.style.height = h + 'px';
    const x = Math.min(v[0] / conf.W * sw, sw - w), y = v[1] / conf.H * sh;
    // staggered entrance (mobile): photos of the arriving group appear one after another
    const entering = animate && conf.stagger && v[2] === 1 && (!prev[id] || prev[id][2] === 0);
    el.style.transitionDelay = entering ? (order++ * conf.stagger) + 'ms' : '0ms';
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    el.style.opacity = v[2];
  }
  if (!animate) { void whyStage.offsetWidth; Object.values(whyEls).forEach(e => e.classList.remove('no-anim')); }
}

/* =====================================================================
   TRACKS — Animation 8171:62357 (4 variants, ON_CLICK SMART_ANIMATE 600ms EASE_OUT)
   ===================================================================== */
const V = (d, m) => m ? `<span class="v-d">${d}</span><span class="v-m">${m}</span>` : d;
const TRACKS = [
  { sub:'Студентам вузов и ссузов', name:'Студенческая практика', img:'assets/slide-1.jpg',
    thumb:'<img src="assets/thumb-1-base.jpg" alt="" style="inset:0;width:100%;height:100%;object-fit:cover"><img src="assets/thumb-1.jpg" alt="" style="left:.37%;top:-57.96%;width:163.24%;height:185%">',
    title:'Студенческая практика', desc:'Познакомься с&nbsp;производством, попробуй свои силы в&nbsp;профессии и&nbsp;получи ценный опыт', btn:'Узнать больше',
    adv:[['Оплата','Практика в&nbsp;Ареале оплачивается&nbsp;— за&nbsp;настоящие задачи получаешь настоящие деньги'],
         ['Наставничество','Наставник из&nbsp;числа специалистов Ареала, который поможет разобраться в&nbsp;задачах'],
         ['Опыт','Опыт работы на&nbsp;производстве, с&nbsp;возможностью дальнейшего трудоустройства'],
         ['Условия','Оплата проезда, питания, проживания за&nbsp;счет компании']] },
  { sub:'Активным студентам', name:'Амбассадоры Ареала', img:'assets/slide-2.jpg',
    thumb:'<div class="flipbox"><img src="assets/thumb-2.jpg" alt="" style="left:0;top:-10.56%;width:100%;height:110.73%"></div>',
    title:'Амбассадоры Ареала', desc:V('Реферальная программа и&nbsp;бесплатное карьерное обучение для активных студентов&#8209;технарей','Рассказывай об&nbsp;Ареале, создавай контент, организуй события, заводи полезные знакомства и&nbsp;получай призы'), btn:'Стать амбассадором',
    adv:[['Призы и мерч','Сертификат для резюме, эксклюзивный мерч, упоминание достижений на&nbsp;крупных мероприятиях'],
         ['Выпускной в Москве',V('Тусовка в&nbsp;Москве с&nbsp;подарками для лучших амбассадоров по&nbsp;итогам программы','Знакомство с&nbsp;экспертами для лучших амбассадоров по&nbsp;итогам программы')],
         ['Реальный опыт','Онлайн и&nbsp;офлайн: соцсети, встречи с&nbsp;компанией, промо, мероприятия и&nbsp;Дни карьеры'],
         ['Карьерные возможности','Приоритет при трудоустройстве и&nbsp;рекомендации от&nbsp;Ареала для дальнейшей карьеры']] },
  { sub:'Выпускникам бакалавриата', name:'Магистерская программа МФТИ', img:'assets/slide-3.jpg',
    thumb:'<img src="assets/thumb-3.jpg" alt="" style="left:-44%;top:-34.82%;width:188%;height:188%">',
    title:V('Магистерская программа с&nbsp;МФТИ','Магистерская программа МФТИ'), desc:'Магистратура ЛФИ МФТИ на&nbsp;стыке физики, Data Science и&nbsp;горной добычи. Диплом топового вуза и&nbsp;опыт работы&nbsp;— одновременно.', btn:'О программе',
    adv:[['Учебная программа',V('Data Science + физика: ML, computer vision и&nbsp;геонауки от&nbsp;преподавателей МФТИ и&nbsp;МГУ','Инновационные технологии и&nbsp;опыт работы с&nbsp;реальными производственными задачами')],
         ['Финансовая поддержка','Стипендия в&nbsp;течение 2-х лет обучения'],
         ['Трудоустройство','Возможность получить предложение о&nbsp;работе после окончания обучения'],
         ['Карьерный старт','Работа над реальными проектами компании параллельно с&nbsp;учебой в&nbsp;магистратуре']] },
  { sub:'Любознательным', name:'Образовательные курсы', img:'assets/slide-4.jpg',
    thumb:'<div class="flipbox"><img src="assets/thumb-4.jpg" alt="" style="left:-68.56%;top:0;width:180%;height:100%"></div>',
    title:'Образовательные курсы', desc:V('Пройди бесплатный курс&nbsp;— получи сертификат и&nbsp;знания, которые пригодятся в&nbsp;профессии','Получи сертификат и&nbsp;знания, которые пригодятся в&nbsp;профессии'), btn:'Выбрать курс',
    adv:[['Формат обучения','Онлайн-курсы в&nbsp;удобном темпе, без привязки к&nbsp;расписанию учебы'],
         ['Сертификат','Официальный сертификат, который можно добавить в&nbsp;резюме'],
         ['Практическая польза','Знания, которые пригодятся при прохождении практики и&nbsp;стажировки в&nbsp;Ареале'],
         ['Доступность','Бесплатно для всех студентов&nbsp;— никаких скрытых условий и&nbsp;оплат']] },
];
const trk = $('#tracks'), trkList = $('#trkList'), strip = $('#trkStrip'), hoverLayer = $('#trkHover');
const textsIn = $('#trkTexts'), advBox = $('#trkAdv'), trkDots = $('#trkDots');
TRACKS.forEach((t, i) => {
  trkList.insertAdjacentHTML('beforeend',
    `<button class="trk-btn${i ? '' : ' is-active'}" type="button" role="tab" aria-selected="${!i}" data-i="${i}" aria-label="${t.sub}: ${t.name}">
       <span class="trk-btn__th">${t.thumb}</span>
       <span class="trk-btn__lbl"><small>${t.sub}</small><span>${t.name}</span></span>
       <span class="trk-btn__tab">${t.sub}</span></button>`);
  strip.insertAdjacentHTML('beforeend', `<img src="${t.img}" alt="" style="top:${i * 100}%" ${i ? 'loading="lazy"' : ''}>`);
  hoverLayer.insertAdjacentHTML('beforeend', `<img src="${t.img}" alt="" loading="lazy">`);
  textsIn.insertAdjacentHTML('beforeend',
    `<div class="trk-item${i ? '' : ' on'}"><div class="trk-item__txt"><h2>${t.title}</h2><p>${t.desc}</p></div>
       <a class="btn btn--white" href="#" tabindex="${i ? -1 : 0}">${t.btn}</a></div>`);
});
for (let c = 0; c < 4; c++) {
  advBox.insertAdjacentHTML('beforeend', `<div class="adv-col"><div class="adv-col__in">${
    TRACKS.map((t, i) => `<div class="adv${i ? '' : ' on'}"><p class="caps">${t.adv[c][0]}</p><p>${t.adv[c][1]}</p></div>`).join('')}</div></div>`);
}
const trkBtns = $$('.trk-btn', trkList), trkItems = $$('.trk-item', textsIn), hoverImgs = $$('img', hoverLayer);
let trkIndex = 0;
function renderTrack(i) {
  trkIndex = i;
  strip.style.transform = `translate3d(0,${-i * 100}%,0)`;
  trkItems.forEach((it, k) => { it.classList.toggle('on', k === i); it.querySelector('.btn').tabIndex = k === i ? 0 : -1; });
  textsIn.style.transform = `translate3d(0,${-trkItems[i].offsetTop}px,0)`;
  $$('.adv-col__in', advBox).forEach(col => {
    const blocks = [...col.children];
    blocks.forEach((b, k) => b.classList.toggle('on', k === i));
    col.style.transform = `translate3d(0,${-blocks[i].offsetTop}px,0)`;
  });
  trkBtns.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', k === i); });
  if (bp() !== 'd') { // keep active tab visible in the sticky tab row
    const b = trkBtns[i];
    trkList.scrollTo({ left: b.offsetLeft - (trkList.clientWidth - b.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
  }
}

/* ---- hover (desktop, real mouse only) + click hover-suppression ---- */
let hovered = null, leaveTimer = 0;
const suppressed = new Set();
function setHover(i) {
  hovered = i;
  trk.classList.toggle('is-hover', i !== null);
  trkBtns.forEach((b, k) => b.classList.toggle('is-hovered', k === i));
  if (i !== null) hoverImgs.forEach((im, k) => im.classList.toggle('on', k === i));
}
const hoverAllowed = e => e.pointerType === 'mouse' && canHover.matches && bp() === 'd';
trkBtns.forEach((b, i) => {
  b.addEventListener('pointerenter', e => {
    if (!hoverAllowed(e) || suppressed.has(b)) return;
    clearTimeout(leaveTimer); setHover(i);
  });
  b.addEventListener('pointerleave', e => {
    suppressed.delete(b);                 // re-arm hover only after the pointer left the thumbnail
    if (e.pointerType !== 'mouse') return;
    clearTimeout(leaveTimer); leaveTimer = setTimeout(() => setHover(null), 60);
  });
  b.addEventListener('click', () => {
    clearTimeout(leaveTimer);
    if (hovered !== null) { suppressed.add(b); setHover(null); } // hover-out starts NOW (--hover-out 150ms)
    const delay = bp() === 'd' && !reduced ? CLICK_SLIDE_DELAY : 0;
    ctl.lockFor(delay + SLIDE_MS);
    setTimeout(() => { renderTrack(i); ctl.syncTrack(i); }, delay);
  });
});

/* ---- advantages swipe dots (tablet / mobile) ---- */
function advPages() {
  const col = advBox.firstElementChild; if (!col) return 1;
  const step = col.offsetWidth + parseFloat(getComputedStyle(advBox).columnGap || 0);
  return { n: 1 + Math.max(0, Math.ceil((advBox.scrollWidth - advBox.clientWidth - 2) / step)), step };
}
function renderAdvDots() {
  if (bp() === 'd') return;
  const { n, step } = advPages(), cur = Math.min(n - 1, Math.round(advBox.scrollLeft / step));
  trkDots.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k === cur ? 'on' : ''}"></i>`).join('');
}
advBox.addEventListener('scroll', renderAdvDots, { passive: true });

/* =====================================================================
   STEP CONTROLLER — fullscreen sections + steps inside them
   ===================================================================== */
const secHero = $('#hero'), secWhy = $('#why'), secTrk = $('#tracks'), rest = $('#rest');
const SECS = [secHero, secWhy, secTrk];
let steps = [];      // [{s: sectionIndex, k: stepInSection}]
let idx = 0;         // current step; idx === steps.length => free scroll zone
let busyUntil = 0, animating = false;
function buildSteps() {
  steps = [{ s: 0, k: 0 }];
  for (let k = 0; k < whySteps(bp()); k++) steps.push({ s: 1, k });
  TRACKS.forEach((_, k) => steps.push({ s: 2, k }));
}
const WHY_ENTRY = 0, whyExit = () => WHY[bp()].states.length - 1;
const whyTo = (k, animate) => renderWhy(k + 1, animate); // landing step k → state k+1
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function scrollToY(y, ms = SCROLL_MS) {
  const from = scrollY, d = y - from;
  if (reduced || Math.abs(d) < 2) { scrollTo(0, y); return; }
  animating = true; const t0 = performance.now();
  const tick = now => {
    const p = Math.min(1, (now - t0) / ms);
    scrollTo(0, from + d * easeInOut(p));
    if (p < 1) requestAnimationFrame(tick); else { animating = false; scrollTo(0, y); }
  };
  requestAnimationFrame(tick);
}
const secTop = s => SECS[s].offsetTop;
const lock = ms => { busyUntil = performance.now() + (reduced ? 50 : ms); };
function applyStep(target, animate = true) {
  const prev = steps[idx], next = steps[target];
  idx = target;
  // leaving the Why block: play the exit/entry pose while the page scrolls away
  if (prev && prev.s === 1 && (!next || next.s !== 1)) renderWhy(next && next.s < 1 ? WHY_ENTRY : whyExit(), animate);
  if (!next) { lock(SCROLL_MS); scrollToY(rest.offsetTop); return; }
  let ms = SLIDE_MS;
  if (next.s === 1) {
    if (prev && prev.s === 1) { whyTo(next.k, animate); ms = whyAnimMs(bp()); }
    else { // entering: start from the entry (from above) / exit (from below) pose, animate in during the scroll
      renderWhy(prev && prev.s > 1 ? whyExit() : WHY_ENTRY, false);
      requestAnimationFrame(() => whyTo(next.k, animate));
    }
  }
  if (next.s === 2 && next.k !== trkIndex) renderTrack(next.k);
  if (hovered !== null) { trkBtns.forEach(b => b.classList.contains('is-hovered') && suppressed.add(b)); setHover(null); }
  if (!prev || prev.s !== next.s) {
    lock(animate ? Math.max(SCROLL_MS, next.s === 1 ? whyAnimMs(bp()) : 0) : 0);
    animate ? scrollToY(secTop(next.s)) : scrollTo(0, secTop(next.s));
  } else lock(ms);
}
function go(dir) {
  if (performance.now() < busyUntil || animating) return false;
  const t = idx + dir;
  if (t < 0 || t > steps.length) return false;
  if (idx === steps.length && dir < 0) { // coming back from free zone into the last track
    if (scrollY > rest.offsetTop + 2) return false;
    const target = steps.length - 1; idx = target; renderTrack(steps[target].k);
    lock(SCROLL_MS); scrollToY(secTop(2)); return true;
  }
  applyStep(t); return true;
}
const inFree = () => idx >= steps.length;
const ctl = {
  lockFor(ms) { busyUntil = Math.max(busyUntil, performance.now() + ms); },
  syncTrack(k) { const t = steps.findIndex(s => s.s === 2 && s.k === k); if (t >= 0) { idx = t; } },
};

/* wheel / trackpad — one gesture = one step.
   A new gesture = a pause > GESTURE_GAP_MS, or (once the current step finished) a fresh acceleration
   of the delta (a new flick on top of decaying inertia). Lockout ≈ animation length only. */
let lastWheelT = 0, lastAbs = 0, consumed = false;
addEventListener('wheel', e => {
  if (e.ctrlKey) return; // pinch-zoom
  const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  const dir = Math.sign(dy);
  const now = performance.now(), abs = Math.abs(dy);
  if (inFree()) {
    const rt = rest.offsetTop;
    if (dir >= 0 || scrollY + dy > rt + 1 && scrollY > rt + 1) { lastWheelT = now; lastAbs = abs; consumed = true; return; } // native scroll
    e.preventDefault();
    if (scrollY > rt + 1) { scrollTo(0, rt); lastWheelT = now; lastAbs = abs; consumed = true; return; }
  } else e.preventDefault();
  const idle = now >= busyUntil && !animating;
  if (now - lastWheelT > GESTURE_GAP_MS) consumed = false;               // pause → new gesture
  else if (idle && abs >= 12 && abs > lastAbs * 1.4) consumed = false;    // fresh flick during inertia tail
  lastWheelT = now; lastAbs = abs;
  if (consumed || abs < 2 || !dir || !idle) return;
  if (go(dir)) consumed = true;
}, { passive: false });

/* touch — vertical swipe = one step; horizontal swipes are left to carousels */
let tx0 = 0, ty0 = 0, tAxis = null, tActive = false;
addEventListener('touchstart', e => {
  if (e.touches.length !== 1) { tActive = false; return; }
  tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; tAxis = null; tActive = true;
}, { passive: true });
addEventListener('touchmove', e => {
  if (!tActive) return;
  const dx = e.touches[0].clientX - tx0, dy = e.touches[0].clientY - ty0;
  if (!tAxis && Math.hypot(dx, dy) > 6) tAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (tAxis !== 'y') return;
  if (!inFree()) { e.preventDefault(); return; }
  if (dy > 0 && scrollY <= rest.offsetTop + 1) e.preventDefault(); // pull down at top of free zone → back to tracks
}, { passive: false });
addEventListener('touchend', e => {
  if (!tActive || tAxis !== 'y') return; tActive = false;
  const dy = ty0 - e.changedTouches[0].clientY;
  if (Math.abs(dy) < SWIPE_MIN) return;
  if (inFree() && (dy > 0 || scrollY > rest.offsetTop + 1)) return;
  go(Math.sign(dy));
}, { passive: true });

/* keyboard */
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select,[contenteditable]') || e.altKey || e.metaKey || e.ctrlKey) return;
  const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !(e.key === ' ' && e.shiftKey);
  const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
  if (e.key === 'Home') { e.preventDefault(); idx = 0; renderTrack(0); whyTo(0, false); lock(SCROLL_MS); scrollToY(0); return; }
  if (!down && !up) return;
  if (inFree()) { if (up && scrollY <= rest.offsetTop + 1) { e.preventDefault(); go(-1); } return; }
  e.preventDefault(); go(down ? 1 : -1);
});

/* external scroll (scrollbar drag, anchors, find-in-page) → resnap */
let scrollTimer = 0;
addEventListener('scroll', () => {
  if (animating) return;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    if (animating) return;
    const y = scrollY, rt = rest.offsetTop, vh = secHero.offsetHeight;
    if (y >= rt - 1) { idx = steps.length; return; }
    if (inFree()) { idx = steps.length - 1; renderTrack(steps[idx].k); scrollToY(secTop(2), 400); return; }
    const s = Math.max(0, Math.min(2, Math.round(y / vh)));
    if (Math.abs(y - secTop(s)) > 1) {
      if (steps[idx].s !== s) { idx = steps.findIndex(st => st.s === s); if (s === 1) whyTo(0, false); if (s === 2) renderTrack(0); }
      scrollToY(secTop(s), 350);
    }
  }, 140);
}, { passive: true });

/* resize / breakpoint change */
let lastBp = bp();
function relayout() {
  const b = bp();
  if (b !== lastBp) {
    const cur = steps[idx]; lastBp = b; buildSteps();
    if (!cur) idx = steps.length;
    else { const n = whySteps(b); const k = cur.s === 1 ? Math.min(cur.k, n - 1) : cur.k; idx = steps.findIndex(s => s.s === cur.s && s.k === k); }
    if (hovered !== null) setHover(null);
  }
  renderWhy(steps[idx] && steps[idx].s === 1 ? steps[idx].k + 1 : Math.min(whyState, WHY[b].states.length - 1), false);
  [...$$('.trk__texts-in,.adv-col__in,.trk__strip')].forEach(el => el.style.transition = 'none');
  renderTrack(trkIndex); void strip.offsetWidth;
  [...$$('.trk__texts-in,.adv-col__in,.trk__strip')].forEach(el => el.style.transition = '');
  renderAdvDots(); renderEventDots();
  if (!inFree() && !animating) scrollTo(0, secTop(steps[idx].s));
}
let rT = 0; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(relayout, 80); });

/* =====================================================================
   EVENTS carousel
   ===================================================================== */
const evRow = $('#eventsRow'), evDots = $('#eventsDots');
const evStep = () => { const c = evRow.firstElementChild; return c.offsetWidth + parseFloat(getComputedStyle(evRow).columnGap || 0); };
$$('.slider-btn').forEach(b => b.addEventListener('click', () => evRow.scrollBy({ left: +b.dataset.dir * evStep(), behavior: reduced ? 'auto' : 'smooth' })));
function renderEventDots() {
  const n = evRow.children.length, cur = Math.round(evRow.scrollLeft / evStep());
  const max = evRow.scrollWidth - evRow.clientWidth;
  const active = evRow.scrollLeft >= max - 2 ? n - 1 : cur;
  evDots.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k === active ? 'on' : ''}"></i>`).join('');
  const [prev, next] = $$('.slider-btn'); prev.disabled = evRow.scrollLeft < 2; next.disabled = evRow.scrollLeft >= max - 2;
}
evRow.addEventListener('scroll', renderEventDots, { passive: true });
$$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

/* ---------------- init ---------------- */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
buildSteps();
const startIdx = +(new URLSearchParams(location.search).get('step') || 0); // ?step=N (debug / previews)
document.fonts && document.fonts.ready.then(() => renderTrack(trkIndex));
addEventListener('load', () => renderTrack(trkIndex));
idx = 0; renderWhy(WHY_ENTRY, false); renderTrack(0); renderAdvDots(); renderEventDots(); scrollTo(0, 0);
if (startIdx > 0) {
  const t = Math.min(startIdx, steps.length); const n = steps[t];
  if (n) { if (n.s === 1) whyTo(n.k, false); if (n.s === 2) renderTrack(n.k); idx = t; scrollTo(0, secTop(n.s)); }
  else { idx = steps.length; scrollTo(0, rest.offsetTop); }
}
window.__areal = { go, get idx() { return idx; }, get steps() { return steps; }, renderTrack, setHover };
})();
