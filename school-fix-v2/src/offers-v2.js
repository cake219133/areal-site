/**
 * school-fix-v2: стек «Возможности» по мотивам Lassie FeaturesCarousel.
 * Зависимости: gsap и ScrollTrigger (libs.min.js).
 * Подключать один раз, вместо старого блока .offers в common.js.
 * Панель: ?tune=1, localStorage offers-v2-tune-v1.
 * Фото не крутятся. Первая карточка оседает из scale .95 / y 10%.
 * Задние: scale 1-0.15*depth, y (12-front)*depth %. Скролл — scrub, секция pin.
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  var section = document.querySelector('.offers');
  if (!section || section.dataset.v2 === '1') return;
  section.dataset.v2 = '1';
  section.classList.add('offers--v2');
  var items = gsap.utils.toArray(section.querySelectorAll('.offers__item'));
  if (items.length < 3) return;

  var DEFAULTS = {
    scrub: 0.25,
    scrollVh: 3,
    pinDesktop: 2.2,
    pinTablet: 3,
    pinMobile: 2.5,
    activeDur: 2,
    exitDesktop: 3,
    exitTablet: 2,
    exitMobile: 3,
    exitTextDesktop: 0.5,
    exitTextTablet: 2,
    exitTextMobile: 3,
    textDur: 1,
    textDurSmall: 2,
    textFrom: 50,
    btnStep: 0.1,
    stackScale: 0.15,
    stackY: 12,
    introScale: 0.95,
    introY: 10,
    innerFrom: 1.05
  };
  var TUNE_KEY = 'offers-v2-tune-v1';
  var tuneMode = /[?&]tune=1(&|$)/.test(location.search);
  var cfg = {};
  var key;
  for (key in DEFAULTS) cfg[key] = DEFAULTS[key];
  if (tuneMode) {
    try {
      var saved = JSON.parse(localStorage.getItem(TUNE_KEY) || '{}');
      for (key in saved) if (key in cfg && typeof saved[key] === 'number' && isFinite(saved[key])) cfg[key] = saved[key];
    } catch (e) {}
  }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function bp() {
    var w = window.innerWidth;
    return w >= 1280 ? 'desktop' : w >= 1024 ? 'tablet' : 'mobile';
  }
  function cardBox() {
    var w = window.innerWidth;
    var width = w >= 1280 ? 490 : w >= 1024 ? 420 : Math.min(490, Math.max(240, w - 32));
    return { w: width, h: Math.round(width * 346 / 490), r: w >= 1024 ? 16 : 12 };
  }
  function applyBox() {
    var b = cardBox();
    section.style.setProperty('--offer-w', b.w + 'px');
    section.style.setProperty('--offer-h', b.h + 'px');
    section.style.setProperty('--offer-r', b.r + 'px');
  }

  var itemsEl = section.querySelector('.offers__items');
  var stage = document.createElement('div');
  stage.className = 'offers__stage';
  itemsEl.parentNode.insertBefore(stage, itemsEl);
  stage.appendChild(itemsEl);

  var cards = items.map(function (item, i) {
    var img = item.querySelector('img');
    var media = document.createElement('div');
    media.className = 'offers__media';
    img.parentNode.insertBefore(media, img);
    media.appendChild(img);
    item.dataset.side = i === 1 ? 'right' : 'left';
    item.dataset.index = String(i);
    var texts = gsap.utils.toArray(item.querySelectorAll('.offers__text > *')).filter(function (n) {
      return !(n.classList && n.classList.contains('btn'));
    });
    var btn = item.querySelector('.offers__text .btn');
    return { item: item, media: media, img: img, texts: texts, btn: btn, parts: btn ? texts.concat([btn]) : texts };
  });

  var built = [];
  function destroy() {
    built.forEach(function (t) { if (t && t.kill) t.kill(); });
    built = [];
    cards.forEach(function (c) {
      gsap.set([c.media, c.img, c.parts], { clearProps: 'transform,opacity,visibility' });
    });
  }

  function pinDistance() {
    var b = bp();
    var mult = b === 'desktop' ? cfg.pinDesktop : b === 'tablet' ? cfg.pinTablet : cfg.pinMobile;
    return mult * window.innerHeight;
  }
  function exitMove() {
    var b = bp();
    return b === 'desktop' ? cfg.exitDesktop : b === 'tablet' ? cfg.exitTablet : cfg.exitMobile;
  }
  function exitText() {
    var b = bp();
    return b === 'desktop' ? cfg.exitTextDesktop : b === 'tablet' ? cfg.exitTextTablet : cfg.exitTextMobile;
  }
  function textDur() {
    return bp() === 'desktop' ? cfg.textDur : cfg.textDurSmall;
  }
  function textAt() {
    return bp() === 'desktop' ? 0.1 : 0;
  }

  function behind(card, index, front) {
    var depth = index - front;
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(card.media, {
      scale: 1 - cfg.stackScale * depth,
      yPercent: (cfg.stackY - front) * depth,
      opacity: 1,
      duration: cfg.activeDur
    }, 0);
    // Исходник Lassie ставит opacity видео 0.5-depth/5 (0.3 и 0.1) — на статичных фото стопка пропадает.
    // Оставляем ободок читаемым, как на референс-кадре: 0.84 и 0.68.
    tl.to(card.img, { opacity: depth <= 0 ? 1 : Math.max(0.62, 1 - 0.16 * depth), duration: cfg.activeDur }, 0);
    tl.set(card.parts, { autoAlpha: 0 }, 0);
    tl.to(card.parts, { yPercent: (90 - front) * depth, duration: cfg.activeDur }, 0);
    return tl;
  }
  function active(card) {
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var dur = textDur();
    var at = textAt();
    tl.to(card.media, { scale: 1, yPercent: 0, y: 0, opacity: 1, duration: cfg.activeDur }, 0);
    tl.fromTo(card.img, { scale: cfg.innerFrom }, { scale: 1, opacity: 1, duration: cfg.activeDur, ease: 'none' }, 0);
    card.texts.forEach(function (node, idx) {
      tl.fromTo(node, { autoAlpha: 0, yPercent: cfg.textFrom }, {
        autoAlpha: 1, yPercent: 0, duration: dur, ease: 'none', immediateRender: false
      }, at + idx * cfg.btnStep);
    });
    if (card.btn) {
      var lastStart = at + Math.max(0, card.texts.length - 1) * cfg.btnStep;
      tl.fromTo(card.btn, { autoAlpha: 0, yPercent: cfg.textFrom }, {
        autoAlpha: 1, yPercent: 0, duration: dur, ease: 'none', immediateRender: false
      }, lastStart + cfg.btnStep);
    }
    tl.eventCallback('onUpdate', function () {
      var on = tl.progress() > 0.15 && tl.progress() < 0.92;
      card.item.classList.toggle('is-front', on);
    });
    return tl;
  }
  function exit(card) {
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(card.parts, {
      autoAlpha: 0,
      yPercent: bp() === 'desktop' ? -60 : -100,
      duration: exitText()
    }, 0);
    tl.to(card.media, {
      scale: 1,
      yPercent: 0,
      y: function () { return -window.innerHeight; },
      duration: exitMove()
    }, 0);
    return tl;
  }
  function cardTimeline(i) {
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var card = cards[i];
    if (i === 0) {
      tl.add(active(card), 0);
      tl.add(exit(card));
    } else if (i === 1) {
      tl.add(behind(card, 1, 0), 0);
      tl.add(active(card));
      tl.add(exit(card));
    } else {
      tl.add(behind(card, 2, 0), 0);
      tl.add(behind(card, 2, 1));
      tl.add(active(card));
    }
    return tl;
  }

  function prime() {
    applyBox();
    gsap.set(cards[0].media, { scale: cfg.introScale, yPercent: cfg.introY, y: 0, opacity: 1 });
    gsap.set(cards[0].img, { scale: cfg.innerFrom, opacity: 1 });
    cards.slice(1).forEach(function (card, n) {
      var depth = n + 1;
      gsap.set(card.media, { scale: 1 - cfg.stackScale * depth, yPercent: cfg.stackY * depth, y: 0, opacity: 1 });
      gsap.set(card.img, { scale: 1, opacity: Math.max(0.62, 1 - 0.16 * depth) });
    });
    cards.forEach(function (card, i) {
      gsap.set(card.parts, { autoAlpha: 0, yPercent: i === 0 ? cfg.textFrom : 50 });
      card.item.classList.toggle('is-front', i === 0);
    });
    cards[0].item.style.zIndex = '3';
    cards[1].item.style.zIndex = '2';
    cards[2].item.style.zIndex = '1';
  }

  function build() {
    destroy();
    prime();
    if (reduce) {
      cards.forEach(function (card) {
        gsap.set(card.media, { scale: 1, yPercent: 0, y: 0, opacity: 1 });
        gsap.set(card.img, { scale: 1, opacity: 1 });
        gsap.set(card.parts, { autoAlpha: 1, yPercent: 0 });
        card.item.classList.add('is-front');
      });
      return;
    }
    var pin = ScrollTrigger.create({
      trigger: stage,
      start: 'center center',
      end: function () { return '+=' + pinDistance(); },
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    });
    var master = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: function () { return window.innerWidth < 1024 ? 'top center-=100' : 'top center+=100'; },
        end: function () { return '+=' + (cfg.scrollVh * window.innerHeight); },
        scrub: cfg.scrub,
        invalidateOnRefresh: true
      }
    });
    cards.forEach(function (_, i) { master.add(cardTimeline(i), 0); });
    built.push(pin, master);
  }

  build();
  window.addEventListener('resize', function () { applyBox(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });

  window.__offersV2 = {
    get cfg() { return cfg; },
    rebuild: build,
    timeline: function () { return built[1]; }
  };

  if (!tuneMode) return;
  var fields = [
    ['scrub', 'Сглаживание скролла, с', 0, 1, 0.05],
    ['scrollVh', 'Длина скролла, экраны', 1, 6, 0.1],
    ['pinDesktop', 'Pin на десктопе, экраны', 1, 5, 0.1],
    ['activeDur', 'Фаза карточки', 0.4, 4, 0.1],
    ['exitDesktop', 'Уход карточки', 0.4, 5, 0.1],
    ['stackScale', 'Масштаб шага стопки', 0, 0.4, 0.01],
    ['stackY', 'Сдвиг стопки, %', 0, 40, 1],
    ['introScale', 'Старт 1-й карточки, scale', 0.7, 1, 0.01],
    ['introY', 'Старт 1-й карточки, %', 0, 40, 1],
    ['textDur', 'Текст: длительность', 0.2, 3, 0.1],
    ['textFrom', 'Текст: старт, %', 0, 100, 1],
    ['btnStep', 'Кнопка: шаг', 0, 0.6, 0.01]
  ];
  var panel = document.createElement('div');
  panel.className = 'offers-tune-v2';
  var html = '<b>Анимация стопки v2</b>';
  fields.forEach(function (f) {
    html += '<label>' + f[1] + ' <output data-o="' + f[0] + '"></output><input type="range" data-k="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '"></label>';
  });
  html += '<div class="offers-tune__btns"><button type="button" data-a="copy">Скопировать настройки</button><button type="button" data-a="reset">Сброс</button></div>';
  panel.innerHTML = html;
  document.body.appendChild(panel);
  function paint() {
    fields.forEach(function (f) {
      panel.querySelector('[data-k="' + f[0] + '"]').value = cfg[f[0]];
      panel.querySelector('[data-o="' + f[0] + '"]').textContent = cfg[f[0]];
    });
  }
  function save() {
    try { localStorage.setItem(TUNE_KEY, JSON.stringify(cfg)); } catch (e) {}
    paint();
    build();
    ScrollTrigger.refresh();
  }
  panel.addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-k');
    if (!k) return;
    cfg[k] = Number(e.target.value);
    save();
  });
  panel.addEventListener('click', function (e) {
    var a = e.target.getAttribute('data-a');
    if (a === 'reset') { for (var k in DEFAULTS) cfg[k] = DEFAULTS[k]; save(); }
    if (a === 'copy') {
      var text = JSON.stringify(cfg, null, 2);
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      e.target.textContent = 'Скопировано';
      setTimeout(function () { e.target.textContent = 'Скопировать настройки'; }, 1200);
    }
  });
  paint();
});
