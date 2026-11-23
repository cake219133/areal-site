"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// * плавный скролл на якоря
$("body").on("click", '[href*="#"]', function (e) {
  var fixed_offset = 100;
  if (!$(this.hash).length) return;
  $("html,body").stop().animate({
    scrollTop: $(this.hash).offset().top - fixed_offset
  }, 1000);
  e.preventDefault();
});
$(".burger").on("click", function () {
  $(".header__nav").addClass("open");
  bodyFixed();
});
$(".header__close").on("click", function () {
  $(".header__nav").removeClass("open");
  clearInlineStyle($("body"));
});
$('.btn--callback').on('click', function () {
  $(".header__nav").removeClass("open");
  clearInlineStyle($("body"));
});
/*phone mask */

$("[data-tel-input]").inputmask({
  mask: "+7 (999) 999-99-99",
  showMaskOnHover: false // placeholder: "+7 (000) 000-00-00",

});
/* date mask */

$("[data-date-input]").inputmask({
  alias: "datetime",
  inputFormat: "dd.mm.yyyy",
  placeholder: "ДД.ММ.ГГГГ",
  showMaskOnHover: false
}); // * Вычисляет ширину полосы прокрутки

function scrollWidth() {
  var div = document.createElement("div");
  div.style.height = "50px";
  div.style.width = "50px";
  div.style.overflowY = "scroll";
  document.body.appendChild(div);
  var scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth;
} // * Убирает прокрутку у body


function bodyFixed() {
  $("body").css({
    "padding-right": scrollWidth() + "px",
    overflow: "hidden"
  });
}

function clearInlineStyle(element) {
  element.removeAttr("style");
}
/* accordeon */


$(".accordeon__head").on("click", function () {
  $(this).toggleClass("open").closest(".accordeon__item").find(".accordeon__body").slideToggle(300);
});

function closeCustomSelect() {
  if (!topicSelect || !customDropdown) return;
  topicSelect.setAttribute('aria-expanded', 'false');
  customDropdown.classList.remove('is-open');
}
/* modals */


var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var previousActiveElement = null;

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function lockBodyScroll() {
  var scrollbarWidth = getScrollbarWidth();
  document.body.style.paddingRight = scrollbarWidth ? scrollbarWidth + 'px' : '';
  document.body.classList.add('is-scroll-locked');
}

function unlockBodyScroll() {
  document.body.style.paddingRight = '';
  document.body.classList.remove('is-scroll-locked');
}

var modalForm = document.getElementById('hotline-modal-form');
var modalCaptcha = document.getElementById('hotline-modal-captcha');
var modalSuccess = document.getElementById('hotline-modal-success');
var allModals = [modalForm, modalCaptcha, modalSuccess];
var form = document.getElementById('hotline-form');
var submitBtn = document.getElementById('hotline-submit-btn'); // Captcha elements

var captchaForm = document.getElementById('hotline-captcha-form');
var captchaImg = document.getElementById('captcha-image');
var captchaCanvas = document.getElementById('captcha-canvas');
var captchaReloadBtn = document.getElementById('captcha-reload-btn');
var fieldGroupCaptcha = document.getElementById('field-group-captcha');
var inputCaptcha = document.getElementById('form-captcha');
var confirmBtn = document.getElementById('hotline-confirm-btn');
var currentCaptchaCode = 'p3A';
var anonSwitch = document.getElementById('anon-switch');
var inputFio = document.getElementById('form-fio');
var fieldGroupEmail = document.getElementById('field-group-email');
var inputEmail = document.getElementById('form-email');
var fieldGroupMessage = document.getElementById('field-group-message');
var textareaMessage = document.getElementById('form-message');
var fieldGroupCompany = document.getElementById('field-group-company');
var inputCompany = document.getElementById('form-company');
var fieldGroupConsent = document.querySelector('.form .custom-checkbox');
var inputConsent = document.querySelector('.form .custom-checkbox input');
var fieldGroupTopic = document.getElementById('field-group-topic');
var topicSelect = document.getElementById('topic-select');
var topicSelectLabel = document.getElementById('topic-select-label');
var topicHiddenInput = document.getElementById('form-topic-input');
var customDropdown = fieldGroupTopic ? fieldGroupTopic.querySelector('.custom-select__dropdown') : null;

function openModal(targetModal) {
  if (!targetModal) return; // Hide any other open modal

  allModals.forEach(function (m) {
    if (m && m !== targetModal && m.classList.contains('is-open')) {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    }
  });
  previousActiveElement = document.activeElement;
  targetModal.classList.add('is-open');
  targetModal.setAttribute('aria-hidden', 'false');
  lockBodyScroll();
  bodyFixed();

  if (targetModal === modalForm) {
    if (anonSwitch) {
      anonSwitch.focus();
    } else {
      var closeBtn1 = modalForm.querySelector('.modal__close');
      if (closeBtn1) closeBtn1.focus();
    }
  } else if (targetModal === modalCaptcha) {
    resetCaptcha();
    if (inputCaptcha) inputCaptcha.focus();
  } else if (targetModal === modalSuccess) {
    var closeBtn3 = modalSuccess.querySelector('.modal__close');
    if (closeBtn3) closeBtn3.focus();
  }
}

function closeModal(targetModal, unlock) {
  if (typeof unlock === 'undefined') unlock = true;
  if (!targetModal || !targetModal.classList.contains('is-open')) return;
  targetModal.classList.remove('is-open');
  targetModal.setAttribute('aria-hidden', 'true');
  closeCustomSelect();
  clearInlineStyle($("body"));

  if (unlock) {
    unlockBodyScroll();

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }
}

function closeAllModals() {
  allModals.forEach(function (m) {
    if (m && m.classList.contains('is-open')) {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    }
  });
  closeCustomSelect();
  unlockBodyScroll();

  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
} // Attach open triggers for form modal


document.querySelectorAll('[data-modal-target="hotline-modal-form"], [data-modal-target="hotline-modal"]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    openModal(modalForm);
  });
}); // Attach backdrop and close button clicks for each modal

allModals.forEach(function (m) {
  if (!m) return;
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-close]')) {
      closeModal(m, true);
    }
  });
}); // Escape key listener for Modals and Mobile Drawer

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    var openModalEl = null;

    for (var i = 0; i < allModals.length; i++) {
      if (allModals[i] && allModals[i].classList.contains('is-open')) {
        openModalEl = allModals[i];
        break;
      }
    }

    if (openModalEl) {
      closeModal(openModalEl, true);
    } else if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileDrawer();
    }
  }
});

function handleAnonymousToggle() {
  var isAnon = anonSwitch && anonSwitch.checked;

  if (inputFio) {
    if (isAnon) {
      inputFio.disabled = true;
      inputFio.value = '';
      inputFio.required = false;
      inputFio.classList.add('is-disabled');
      inputFio.classList.remove('is-invalid');
    } else {
      inputFio.disabled = false;
      inputFio.required = true;
      inputFio.classList.remove('is-disabled');
    }
  }

  if (fieldGroupConsent && inputConsent) {
    if (isAnon) {
      inputConsent.disabled = true;
      inputConsent.checked = false;
      inputConsent.required = false;
      fieldGroupConsent.classList.add('is-disabled');
      fieldGroupConsent.classList.remove('is-invalid');
    } else {
      inputConsent.disabled = false;
      inputConsent.required = true;
      fieldGroupConsent.classList.remove('is-disabled');
    }
  }
}

if (anonSwitch) {
  anonSwitch.addEventListener('change', handleAnonymousToggle);
}

if (textareaMessage) {
  textareaMessage.addEventListener('input', function () {
    this.style.height = 'auto';
    var newHeight = Math.max(44, this.scrollHeight);
    this.style.height = newHeight + 'px';
    validateForm();
  });
} // function mapIndent() {
// if($(window).width() <= 767) {
// let mapTxtHeight = $('.map__text').height();
// let mobMapHeight = $('.map__img--mobile').height();
// console.log(mapTxtHeight, mobMapHeight)
// $('.map').attr('style', `min-height: ${mapTxtHeight + mobMapHeight + 18}px`)
// if($(window).width() > 992) {
//   $('.map__svg').attr('style', `margin-top: -${mapTxtHeight - 52}px`)
// } else if($(window).width() <= 375) {
//   $('.map__svg').attr('style', `top: ${mapTxtHeight + 11}px`)
// }
// }
// $(document).ready(function(){
//   mapIndent();
// })
// $(window).on('resize', function(){
//   mapIndent();
// })


$('[data-fancybox]').fancybox();
$(window).on('load', function () {
  $('.marquee').marquee({
    duration: 50000,
    gap: 0,
    delayBeforeStart: 0,
    direction: 'left',
    duplicated: true,
    duplicateCount: 3,
    startVisible: true,
    pauseOnHover: true
  }).css('opacity', '1');
});

function addClassOnScroll(targetClass, offsetPercent) {
  var offset = $(window).height() * offsetPercent / 100; // Расчет оффсета в пикселях

  $(window).on('scroll', detectScroll);

  function detectScroll() {
    var windowBottom = $(window).scrollTop() + $(window).height();
    $(targetClass).each(function () {
      var elementTop = $(this).offset().top;

      if (windowBottom - offset >= elementTop) {
        $(this).addClass('anim');
      }
    });
  } // Вызываем сразу, чтобы обработать элементы при загрузке страницы


  $(window).trigger('scroll');
}

addClassOnScroll('.animate-children', 2);
addClassOnScroll('.animate', 2);
addClassOnScroll('.territory__benefit', 15);
addClassOnScroll('.test-block__step', 30);

function updateActiveButton(index) {
  var $btn = $('.map__btn').eq(index);
  $btn.addClass('active').siblings().removeClass('active');
  var dataId = $btn.attr('data-id');
  $("path[id=\"".concat(dataId, "\"]")).addClass('active').siblings().removeClass('active');
} // $('.map__btn').on('click', function () {
//   const index = $(this).index(); 
//   const dataId = $(this).attr('data-id');
//   mapSlider.slideToLoop(index);
// });
// function updatePoints() {
//   const $svg = $('#image');
//   const $container = $('.map__svg');
//   const $points = $container.find('.map__btn');
//   if (!$svg.length || !$points.length) return;
//   const bbox = $svg[0].getBoundingClientRect();
//   const width = bbox.width;
//   const height = bbox.height;
//   $points.each(function() {
//     const $point = $(this);
//     let absX; 
//     let absY;
//     let relX;
//     let relY;
//     if($(window).width() > 992) {
//       absX = parseFloat($point.data('absXDesktop'));
//       absY = parseFloat($point.data('absYDesktop'));
//       relX = absX / 1387;
//       relY = absY / 728;
//     } else if($(window).width() <= 992 && $(window).width() > 375) {
//       absX = parseFloat($point.data('absXTablet'));
//       absY = parseFloat($point.data('absYTablet'));
//       relX = absX / 813;
//       relY = absY / 428;
//     } 
//     else if($(window).width() <= 375) {
//       absX = parseFloat($point.data('absXMobile'));
//       absY = parseFloat($point.data('absYMobile'));
//       relX = absX / 377;
//       relY = absY / 201;
//     }
//     if (isNaN(absX) || isNaN(absY)) {
//       console.warn('Invalid coordinates for point:', $point[0]);
//       return;
//     }
//     $point.css({
//       left: relX * width + 'px',
//       top: relY * height + 'px'
//     });
//   });
// }
// $(window).on('load', updatePoints);
// $(window).on('resize', updatePoints);


function minBodyHeight() {
  var footerHeight = $('.footer').height();
  var headerHeight = $('.header').height();
  $('.main').attr('style', "min-height: calc(100vh - ".concat(footerHeight + headerHeight, "px)"));
}

$(document).ready(function () {
  var windowHeight = $(window).height();
  var contentHeight = $('.main').height();

  if (contentHeight < windowHeight) {
    minBodyHeight();
  }
});
var regions = $('.map__svg').find('[data-region-name]');
var regionsButtons = $('.map').find('.map__button');
var regionsNames = $('.map').find('[data-info]');
regions.each(function () {
  var regionOffsetleft = $(this).offset().left;
  $(this).attr('data-offset', regionOffsetleft);
});
regionsButtons.each(function () {
  var regionButtonOffsetleft = $(this).offset().left;
  $(this).attr('data-offset', regionButtonOffsetleft);
});

function defaultMap() {
  requestAnimationFrame(function () {
    $('.map').find('[data-region-name]').removeClass('visible');
    regionsButtons.removeClass('active');
    $('.map__bg--white').removeClass('opacity-1');
    $('.map__bg--color').removeClass('opacity-0');
    $('.map__point').removeClass('hide').removeClass('opacity-0');
    $('.map__info').removeClass('visible');
    $('.map__information').find('[data-info-mobile]').removeClass('show');
  });
}

function setContainerHeightVar() {
  if ($(window).width() <= 768) {
    var btnsIndent;

    if ($(window).width() > 600) {
      btnsIndent = 140;
    } else {
      btnsIndent = 100;
    }

    setTimeout(function () {
      var container = document.querySelector('.map .container');
      if (!container) return;
      var height = container.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--container-height', "".concat(height + btnsIndent, "px"));
    }, 300);
  }
}

function initResponsiveTwoRows() {
  if ($(window).width() <= 768) {
    var totalWidth = ($('.map__buttons').children().length - 1) * 10;
    $('.map__buttons').children().each(function () {
      totalWidth += $(this).outerWidth();
    });
    $('.map__buttons').css({
      "width": totalWidth / 2 + 60
    });
  }
}

function showWhiteMap(regionId) {
  $('.map__bg--color').addClass('opacity-0');
  $('.map__bg--white').addClass('opacity-1');
  setTimeout(function () {
    $('.map__point').addClass('opacity-0');
    $(".map__point[id=".concat(regionId, "]")).addClass('hide').siblings().removeClass('hide');
    $(".map__button[data-region=".concat(regionId, "]")).addClass('active').siblings().removeClass('active');
  }, 50);
} // initResponsiveTwoRows();


setContainerHeightVar();

if ($(window).width() >= 769) {
  regionsNames.each(function () {
    var regionId = $(this).attr('data-info');
    $(this).on('mouseenter', function () {
      $('.map').find("[data-region-name=".concat(regionId, "]")).addClass('visible');
      $(this).siblings('.map__info').addClass('hide');
      showWhiteMap(regionId);
    });
    $(this).on('mouseleave', function () {
      $('.map').find("[data-region-name=".concat(regionId, "]")).removeClass('visible');
      $(this).siblings('.map__info').removeClass('hide');
      defaultMap();
    });
  });
} else {
  regionsButtons.each(function () {
    $(this).on('click', function () {
      if (!$(this).hasClass('active')) {
        var regionId = $(this).attr('data-region');
        var regionOffsetleft = $('.map').find("[data-region-name=".concat(regionId, "]")).attr('data-offset');
        var targetScroll = regionOffsetleft > 150 ? regionOffsetleft - 100 : 0;
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
          $('.map__overflow')[0].style.scrollBehavior = 'smooth';
          $('.map__overflow')[0].scrollLeft = targetScroll;
          setTimeout(function () {
            $('.map__overflow')[0].style.scrollBehavior = '';
          }, 600);
        } else {
          $('.map__overflow').animate({
            scrollLeft: targetScroll
          }, 600, 'linear');
        }

        $('.map__information').find("[data-info-mobile=".concat(regionId, "]")).addClass('show').siblings().removeClass('show');
        $(this).addClass('active').siblings().removeClass('active');
        $('.map').find("[data-region-name=".concat(regionId, "]")).addClass('visible');
        $('.map').find("[data-region-name!=".concat(regionId, "]")).removeClass('visible');
        showWhiteMap(regionId);
      } else {
        defaultMap();
      }
    });
  });
}

var resizeTimer;
$(window).on('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    // initResponsiveTwoRows();
    setContainerHeightVar();
  }, 250);
});
$(document).on('click', function (e) {
  var $target = $(e.target);
  var isClickedOnButton = $target.is(regionsButtons) || regionsButtons.has(e.target).length > 0;
  var isClickedOnRegion = $target.is(regions) || regions.has(e.target).length > 0;
  var isClickedOnMapInfo = $target.is(regionsNames) || regionsNames.has(e.target).length > 0;

  if (!isClickedOnButton && !isClickedOnRegion && !isClickedOnMapInfo) {
    defaultMap();
  }
});
$(document).ready(function () {
  var lastScrollTop = 0;
  var delta = 5;
  var scrollDelay = 2000; // Задержка в мс перед добавлением класса

  var scrollTimeout = null; // Переменная для хранения таймера

  var $header = $('header');
  var headerHeight = $header.outerHeight();

  if ($('.search--sticky').length) {
    var initialSearchOffset = $('.search--sticky').offset().top;
  }

  function isInsidePinnedAnimation(st) {
    if (typeof ScrollTrigger === 'undefined') return false;
    var triggers = ScrollTrigger.getAll();

    for (var i = 0; i < triggers.length; i++) {
      var t = triggers[i];

      if ((t.pin || t.vars && t.vars.pin) && t.start > 100) {
        if (st >= t.start - 5 && st <= t.end + 5) {
          return true;
        }
      }
    }

    return false;
  }

  $(window).on('scroll', function () {
    var st = $(this).scrollTop(); // Skip header--isScrolled and header--hidden while hero section is pinned/animating

    if (window.isPracticeHeroPinned && window.isPracticeHeroPinned(st)) {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }

      $header.removeClass('header--isScrolled');
      $header.removeClass('header--hidden');
      $header.removeClass('header--pinned-hidden');
      lastScrollTop = st;
      return;
    } // Hide header completely while inside pinned animated sections


    if (isInsidePinnedAnimation(st)) {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }

      $header.addClass('header--hidden');
      $header.addClass('header--pinned-hidden');
      lastScrollTop = st;
      return;
    } else {
      $header.removeClass('header--pinned-hidden');
    } // --- Логика класса header--isScrolled с задержкой ---


    if (st > 0) {
      // Если класс ещё не добавлен и таймер не запущен — запускаем задержку
      if (!$header.hasClass('header--isScrolled') && !scrollTimeout) {
        scrollTimeout = setTimeout(function () {
          $header.addClass('header--isScrolled');
          scrollTimeout = null; // Сбрасываем после срабатывания
        }, scrollDelay);
      }

      if (st > initialSearchOffset) {
        $('.search--sticky').addClass('sticky');
        $('.vacancies__filter').addClass('sticky');
      }
    } else {
      // Если вернулись в самый верх — очищаем таймер и сразу убираем класс
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }

      $header.removeClass('header--isScrolled');
      $('.search--sticky').removeClass('sticky');
      $('.vacancies__filter').removeClass('sticky');
    } // --- Логика скрытия/показа хедера при скролле ---


    if (Math.abs(lastScrollTop - st) <= delta) {
      return;
    }

    if (st > lastScrollTop && st > headerHeight) {
      $header.addClass('header--hidden');
      $('.search--sticky').addClass('sticky-top');
      $('.vacancies__filter').addClass('sticky-top');
    } else {
      $header.removeClass('header--hidden');
      $('.search--sticky').removeClass('sticky-top');
      $('.vacancies__filter').removeClass('sticky-top');
    }

    lastScrollTop = st;
  });
}); // search

$('.search input').on('focus', function () {
  var tags = $('.search').find('.search__overflow');
  var suggestionsDefault = $(this).closest('.search').find('.search__suggestions--default');
  suggestionsDefault.show();

  if ($(this).closest('.search').hasClass('search--sticky')) {
    $('.coverflow').addClass('faded');
    $('.search--sticky').addClass('sticky--noBg');
    bodyFixed();
  } else {
    tags.hide();
  }
});
$(document).on('click', function (e) {
  var $clickedSearch = $(e.target).closest('.search');

  if ($clickedSearch.length) {
    return;
  }

  $('.search').each(function () {
    var $search = $(this);
    $search.find('.search__suggestions--default').hide();
    $search.find('.search__overflow').show();
    $search.removeClass('sticky--noBg');
  });
});
$('.search input').on('input', function () {
  var inputValue = $(this).val();
  var suggestions = $(this).closest('.search').find('.search__suggestions--match');
  var tags = $(this).closest('.search').find('.search__overflow');
  var suggestionsDefault = $(this).closest('.search').find('.search__suggestions--default');

  if ($(this).closest('.search').hasClass('search--sticky')) {
    if (inputValue.length >= 1) {
      $(this).closest('.search').find('.search__reset').show();
    } else {
      $(this).closest('.search').find('.search__reset').hide();
    }
  }

  tags.hide();

  if (inputValue.length >= 3) {
    suggestions.show();
    suggestionsDefault.hide();
    tags.hide();
  } else {
    suggestions.hide();
    suggestionsDefault.show();
  }
});
$('.search__reset').on('click', function () {
  $(this).closest('.search').find('input').val('');
  $(this).hide();
  var suggestions = $(this).closest('.search').find('.search__suggestions--match');
  var suggestionsDefault = $('.search').find('.search__suggestions--default');
  suggestionsDefault.hide();
  suggestions.hide();
  $('.coverflow').removeClass('faded');
  clearInlineStyle($("body"));
}); // $(document).on('click', function(e) {
//   if (!$(e.target).closest('.search--vacancies').length) {
//     $('.coverflow').removeClass('faded')
//   }
// });

var vacanciesInput = $('.search').find('.search__field input');
vacanciesInput.on('blur', function () {
  var value = vacanciesInput.val();
  $('.coverflow').removeClass('faded');
  clearInlineStyle($("body"));
  var suggestions = $(this).closest('.search').find('.search__suggestions--match');
  setTimeout(function () {
    suggestions.hide();
  }, 200);
});
$('.btn--filter').on('click', function () {
  $('.vacancies__filter').show();
  bodyFixed();
});
$('.filter__close').on('click', function () {
  $('.vacancies__filter').hide();
  clearInlineStyle($("body"));
  var suggestions = $(this).closest('.search').find('.search__suggestions--match');
  suggestions.hide();
});

if ($(window).width() <= 992) {
  $('.filter__title').on('click', function () {
    $(this).parent().find('.filter__block').show();
  });
  $('.filter__back').on('click', function () {
    $(this).closest('.filter__category').find('.filter__block').hide();
  });
}

$(document).ready(function () {
  function initSearchFilter() {
    $('.filter__search').on('input', function () {
      var searchText = $(this).val().toLowerCase().trim();
      var $category = $(this).closest('.filter__category');
      var $checkboxes = $category.find('.filter__checkboxes .custom-checkbox, .filter__radios .custom-radio');

      if (searchText === '') {
        $checkboxes.show();
        return;
      }

      $checkboxes.each(function () {
        var $this = $(this);
        var text = $this.find('.custom-checkbox__text, label').text().toLowerCase();

        if (text.includes(searchText)) {
          $this.show();
        } else {
          $this.hide();
        }
      });
    });
  } // Вспомогательная функция: считает только "активные" (не дефолтные) выбранные инпуты


  function getCheckedCount($category) {
    return $category.find('.filter__checkboxes input:checked, .filter__radios input:checked, .custom-radio input:checked, .custom-checkbox input:checked').filter(function () {
      // Исключаем radio/checkbox, помеченные как выбранные по умолчанию
      return $(this).attr('data-default') !== 'true' && !$(this).data('default');
    }).length;
  }

  function updateFilterCount($category) {
    var checkedCount = getCheckedCount($category);
    var $span = $category.find('.filter__title span'); // Обновляем счетчик только для конкретной категории

    if (checkedCount > 0) {
      $span.text(checkedCount);
      $span.addClass('show');
    } else {
      $span.text('').removeClass('show');
    } // Делегируем управление глобальными элементами (.filter__bottom, .btn--reset) в общую функцию


    updateTotalFilterCount();
  }

  function updateTotalFilterCount() {
    var activeCategoriesCount = 0;
    var totalCheckedCount = 0; // Считаем общее количество выбранных фильтров

    $('.filter__category').each(function () {
      var count = getCheckedCount($(this));

      if (count > 0) {
        activeCategoriesCount++;
        totalCheckedCount += count;
      }
    });
    var $filterBtn = $('.btn--filter');
    var $btnSpan = $filterBtn.find('span');

    if (activeCategoriesCount > 0) {
      $btnSpan.text(activeCategoriesCount);
      $btnSpan.addClass('show');
    } else {
      $btnSpan.removeClass('show');
    } // Пересчитываем видимость filter__bottom и btn--reset при загрузке и любом изменении


    if ($(window).width() > 992) {
      if (totalCheckedCount > 0) {
        $('.filter__bottom').show();
        $('.btn--reset').show();
      } else {
        $('.filter__bottom').hide();
        $('.btn--reset').hide();
      }
    } else {
      if (totalCheckedCount > 0) {
        $('.btn--reset').show();
      } else {
        $('.btn--reset').hide();
      }
    }
  }

  function resetAllFilters() {
    $('.filter__category .filter__checkboxes input, .filter__category .filter__radios input, .filter__category .custom-radio input, .filter__category .custom-checkbox input').prop('checked', false);
    $('.filter__category .filter__title span').each(function () {
      $(this).text('').removeClass('show');
    });
    var $filterBtn = $('.btn--filter');
    var $btnSpan = $filterBtn.find('span');

    if ($btnSpan.length) {
      $btnSpan.text('').removeClass('show');
    }

    $('.search--vacancies .search__tag').removeClass('active');
    updateTotalFilterCount(); // Корректно скроет filter__bottom и btn--reset
  }

  function activateFilterByTag(tagText) {
    var found = false;
    $('.filter__category').each(function () {
      var $category = $(this);
      $category.find('.filter__checkboxes .custom-checkbox').each(function () {
        var $checkbox = $(this);
        var text = $checkbox.find('input').attr('data-name');

        if (text === tagText) {
          var $input = $checkbox.find('input[type="checkbox"]');

          if ($input.length) {
            $input.prop('checked', true);
            found = true;
            updateFilterCount($category);
          }
        }
      });
      $category.find('.filter__radios .custom-radio').each(function () {
        var $radio = $(this);
        var text = $radio.find('input').attr('data-name');

        if (text === tagText) {
          var $input = $radio.find('input[type="radio"]');

          if ($input.length) {
            $input.prop('checked', true);
            found = true;
            updateFilterCount($category);
          }
        }
      });
    });
    return found;
  }

  $(document).on('change', '.filter__category input[type="checkbox"], .filter__category input[type="radio"]', function () {
    var $category = $(this).closest('.filter__category');
    updateFilterCount($category);
  });
  $(document).on('click', '.filter__radios label, .custom-radio label', function () {
    var $radio = $(this).closest('.custom-radio').find('input[type="radio"]');

    if ($radio.length) {
      setTimeout(function () {
        var $category = $radio.closest('.filter__category');
        updateFilterCount($category);
      }, 50);
    }
  });
  $(document).on('click', '.btn--reset', function (e) {
    e.preventDefault();
    resetAllFilters();
  });
  $(document).on('click', '.search--vacancies .search__tag', function (e) {
    e.preventDefault();
    var $tag = $(this);
    var filterText = $tag.data('filter');

    if ($tag.hasClass('active')) {
      $tag.removeClass('active');
      $('.filter__category .filter__checkboxes .custom-checkbox, .filter__category .filter__radios .custom-radio').each(function () {
        var $item = $(this);
        var text = $item.find('input').attr('data-name');

        if (text === filterText) {
          var $input = $item.find('input[type="checkbox"], input[type="radio"]');

          if ($input.length) {
            $input.prop('checked', false);
            var $category = $input.closest('.filter__category');
            updateFilterCount($category);
          }
        }
      });
      return;
    }

    $tag.addClass('active');
    var found = activateFilterByTag(filterText);
  });
  initSearchFilter(); // Инициализация при загрузке — учитываем только НЕ дефолтные

  $('.filter__category').each(function () {
    var checkedCount = getCheckedCount($(this));
    var $span = $(this).find('.filter__title span');

    if (checkedCount > 0) {
      $span.text(checkedCount);
      $span.addClass('show');
    } else {
      $span.removeClass('show');
    }
  });
  $('.search--vacancies .search__tag.active').each(function () {
    var filterText = $(this).data('filter');
    activateFilterByTag(filterText);
  }); // Финальный пересчет при загрузке страницы: покажет или скроет filter__bottom

  updateTotalFilterCount();
}); // видео на стр карьера

$('.btn--video').on('click', function () {
  var $container = $(this).parent();
  var $video = $container.find('video')[0];
  var $btn = $(this);
  $container.find('video').addClass('onProgress');

  if ($video.paused) {
    $video.play();
    $btn.fadeOut(200);
  } else {
    $video.pause();
    $btn.fadeIn(200);
  }
}); // $(document).on('click', 'video.onProgress', function() {
//   var $container = $(this).parent();
//   var $video = $container.find('video')[0];
//   var $btn = $container.find('.btn--video');
//   $video.pause();
//   $btn.fadeIn(200);
//   $container.find('video').removeClass('onProgress');
// });

$('video').on('ended', function () {
  $(this).siblings('.btn--video').fadeIn(200);
  $(this).removeClass('onProgress');
});
$('video:not(.reviews__video):not(.practice-hero__video video)').on('play', function () {
  this.controls = true;
}); // $('.company-video__wrapper video').on('pause', function() {
//   this.controls = false;
//   var $video = $(this);
//   $video.removeClass('onProgress');
//   $video.siblings('.btn--video').fadeIn(200);
// });

$(function () {
  var originalText = "Прикрепить резюме";
  var validExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx'];
  var maxFileSize = 10 * 1024 * 1024; // 10 МБ

  $('.form__input--file input[type="file"]').on('change', function () {
    var $input = $(this);
    var $container = $input.closest('.form__input--file');
    var $fileText = $container.find('.form__text');
    var $error = $container.find('.form__error');
    var $attachIcon = $container.find('.form__icon--attach');
    var $deleteIcon = $container.find('.form__icon--delete');
    var file = this.files && this.files[0];
    var defaultLabel = $fileText.data('default-text') || originalText;

    if (!file) {
      resetVisuals($input, $fileText, $attachIcon, $deleteIcon, defaultLabel);
      $error.hide();
      $input.removeClass('is-invalid');
      $input.trigger('input');
      return;
    }

    var isAnketa = $input.closest('.anketa').length > 0;
    var allowedExts = isAnketa ? ['pdf', 'doc', 'docx'] : validExtensions;
    var fileName = file.name;
    var fileExt = fileName.split('.').pop().toLowerCase(); // Проверка расширения файла

    if (!allowedExts.includes(fileExt)) {
      $error.text(isAnketa ? 'Поддерживаемые форматы: PDF, DOC, DOCX' : 'Файл должен иметь расширение .jpg, .png, .pdf, .docx').show();
      $input.addClass('is-invalid');
      $input.val('');
      resetVisuals($input, $fileText, $attachIcon, $deleteIcon, defaultLabel);
      $input.trigger('input');
      return;
    } // Проверка размера файла (до 10 МБ)


    if (file.size > maxFileSize) {
      $error.text('Максимальный размер файла — 10 МБ').show();
      $input.addClass('is-invalid');
      $input.val('');
      resetVisuals($input, $fileText, $attachIcon, $deleteIcon, defaultLabel);
      $input.trigger('input');
      return;
    }

    $error.hide();
    $input.removeClass('is-invalid');
    var displayName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;

    if ($fileText.length) {
      $fileText.text(displayName);
    } else {
      var textNode = $input.next('span').contents().filter(function () {
        return this.nodeType === 3 && $.trim(this.nodeValue) !== '';
      })[0];
      if (textNode) textNode.nodeValue = displayName + ' ';
    }

    $attachIcon.hide();
    $deleteIcon.show();
    $input.trigger('input');
  });
  $('.form__icon--delete').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $container = $(this).closest('.form__input--file');
    var $input = $container.find('input[type="file"]');
    var $fileText = $container.find('.form__text');
    var $error = $container.find('.form__error');
    var $attachIcon = $container.find('.form__icon--attach');
    var $deleteIcon = $container.find('.form__icon--delete');
    var defaultLabel = $fileText.data('default-text') || originalText;
    $input.val('');
    $error.hide();
    $input.removeClass('is-invalid');
    resetVisuals($input, $fileText, $attachIcon, $deleteIcon, defaultLabel);
    $input.trigger('input');
  });

  function resetVisuals($input, $fileText, $attachIcon, $deleteIcon, text) {
    if ($fileText.length) {
      $fileText.text(text);
    } else {
      var textNode = $input.next('span').contents().filter(function () {
        return this.nodeType === 3 && $.trim(this.nodeValue) !== '';
      })[0];
      if (textNode) textNode.nodeValue = text + ' ';
    }

    $attachIcon.show();
    $deleteIcon.hide();
  }
}); // анимация блока регионы
// $(function () {
//   const $regionsWrapper = $('.regions');
//   if($regionsWrapper.length) {
//     const $regions = $('.regions__sticky');
//     const $btns = $('.regions__item');
//     const $texts = $('.regions__text');
//     const $imgs = $('.regions__img');
//     const totalSlides = $btns.length;
//     let currentSlide = 0;
//     let isScrolling = false;
//     const BREAKPOINT = 1200;
//     function updateWrapperHeight() {
//       if ($(window).width() > BREAKPOINT) {
//         const windowHeight = $(window).height();
//         $regionsWrapper.attr('style', `height: calc(100vh * ${totalSlides})`);
//       } else {
//         $regionsWrapper.attr('style', '');
//       }
//     }
//     function initMobileState() {
//       if ($(window).width() <= BREAKPOINT) {
//         $('.regions__item.active .regions__text').show();
//       } else {
//         // $('.regions__text').hide();
//       }
//     }
//     updateWrapperHeight();
//     initMobileState();
//     function setActiveSlide(index) {
//       if (index < 0 || index >= totalSlides || index === currentSlide) return;
//       currentSlide = index;
//       if ($(window).width() <= BREAKPOINT) {
//         $btns.eq(index).find('.regions__text').stop(true, true).slideDown(300);
//         $btns.eq(index).siblings().find('.regions__text').stop(true, true).slideUp(300);
//       }
//       $btns.removeClass('active').eq(index).addClass('active'); 
//       $texts.removeClass('active'); 
//       setTimeout(function(){
//         $texts.eq(index).addClass('active'); 
//       }, 300);
//       $imgs.removeClass('active').eq(index).addClass('active');
//     }
//     $(window).on('scroll', function () {
//       if ($(window).width() <= BREAKPOINT) return;
//       if (isScrolling) return;
//       const wrapperTop = $regionsWrapper.offset().top;
//       const scrollTop = $(window).scrollTop();
//       const windowHeight = $(window).height();
//       if (scrollTop >= wrapperTop && scrollTop < wrapperTop + (windowHeight * (totalSlides - 1))) {
//         const relativeScroll = scrollTop - wrapperTop;
//         const slideIndex = Math.round(relativeScroll / windowHeight);
//         setActiveSlide(slideIndex);
//       }
//     });
//     $btns.on('click', function () {
//       const index = $(this).index();
//       if ($(window).width() > BREAKPOINT) {
//         const wrapperTop = $regionsWrapper.offset().top;
//         const windowHeight = $(window).height();
//         const targetScroll = wrapperTop + (windowHeight * index);
//         isScrolling = true;
//         $('html, body').animate({
//           scrollTop: targetScroll
//         }, 600, function () {
//           setTimeout(() => {
//             isScrolling = false;
//           }, 100);
//         });
//       }
//       setActiveSlide(index);
//     });
//     let resizeTimer;
//     $(window).on('resize', function () {
//       clearTimeout(resizeTimer);
//       resizeTimer = setTimeout(function () {
//         updateWrapperHeight();
//         initMobileState(); 
//       }, 150);
//     });
//   }
// });
// let regionsTxtDesktop = $('.regions__text');
// if(regionsTxtDesktop.length) {
//   regionsTxtDesktop.each(function(){
//     let tabs = $(this).find('.tabs');
//     if(tabs.length) {
//       tabs.each(function(){
//         const $bodies = $(this).find('.tabs__body');
//         let maxHeight = 0;
//         $bodies.each(function () {
//           const $el = $(this);
//           const isVisible = $el.is(':visible');
//           if (isVisible) {
//             $el.css('min-height', 'auto');
//           } else {
//             $el.css({
//               'visibility': 'hidden',
//               'display': 'block',
//               'position': 'absolute',
//               'top': '-9999px',
//               'min-height': 'auto'
//             });
//           }
//           const currentHeight = $el.outerHeight();
//           if (currentHeight > maxHeight) {
//             maxHeight = currentHeight;
//           }
//           if (!isVisible) {
//             $el.css({
//               'visibility': '',
//               'display': '',
//               'position': '',
//               'top': ''
//             });
//           }
//         });
//         $bodies.css('min-height', maxHeight + 'px');
//       })
//     }
//   })
// }
// анимация регионов без скролла

$(function () {
  var $regionsWrapper = $('.regions');

  if ($regionsWrapper.length) {
    var updateWrapperHeight = function updateWrapperHeight() {
      // 2. Устанавливаем большую высоту ТОЛЬКО если это не noscroll И мы на десктопе
      if (!isNoScroll && $(window).width() > BREAKPOINT) {
        // <--- ИЗМЕНЕНО
        var windowHeight = $(window).height();
        $regionsWrapper.attr('style', "height: calc(100vh * ".concat(totalSlides, ")"));
      } else {
        $regionsWrapper.attr('style', ''); // Сбрасываем высоту для mobile или noscroll
      }
    };

    var initMobileState = function initMobileState() {
      // 3. Инициализируем состояние "как на мобильном", если это noscroll ИЛИ экран маленький
      if ($(window).width() <= BREAKPOINT || isNoScroll) {
        // <--- ИЗМЕНЕНО
        $('.regions__item.active .regions__text').show();
      } else {// $('.regions__text').hide();
      }
    };

    var setActiveSlide = function setActiveSlide(index) {
      if (index < 0 || index >= totalSlides || index === currentSlide) return;
      currentSlide = index; // 4. Анимация текста (slideDown/up) работает для мобильных И для noscroll

      if ($(window).width() <= BREAKPOINT || isNoScroll) {
        // <--- ИЗМЕНЕНО
        $btns.eq(index).find('.regions__text').stop(true, true).slideDown(300);
        $btns.eq(index).siblings().find('.regions__text').stop(true, true).slideUp(300);
      }

      $btns.removeClass('active').eq(index).addClass('active');
      $texts.removeClass('active');
      setTimeout(function () {
        $texts.eq(index).addClass('active');
      }, 300);
      $imgs.removeClass('active').eq(index).addClass('active');
    };

    // 1. Определяем, есть ли класс отключения скролла
    var isNoScroll = $regionsWrapper.hasClass('regions--noscroll'); // <--- ИЗМЕНЕНО

    var $regions = $('.regions__sticky');
    var $btns = $('.regions__item');
    var $texts = $('.regions__text');
    var $imgs = $('.regions__img');
    var totalSlides = $btns.length;
    var currentSlide = 0;
    var isScrolling = false;
    var BREAKPOINT = 1200;
    updateWrapperHeight();
    initMobileState();
    $(window).on('scroll', function () {
      // 5. Полностью отключаем реакцию на скролл, если включен noscroll (или это мобильный)
      if (isNoScroll || $(window).width() <= BREAKPOINT) return; // <--- ИЗМЕНЕНО

      if (isScrolling) return;
      var wrapperTop = $regionsWrapper.offset().top;
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();

      if (scrollTop >= wrapperTop && scrollTop < wrapperTop + windowHeight * (totalSlides - 1)) {
        var relativeScroll = scrollTop - wrapperTop;
        var slideIndex = Math.round(relativeScroll / windowHeight);
        setActiveSlide(slideIndex);
      }
    });
    $btns.on('click', function () {
      var index = $(this).index(); // 6. Прокрутка окна (animate scrollTop) срабатывает ТОЛЬКО если это НЕ noscroll И десктоп

      if (!isNoScroll && $(window).width() > BREAKPOINT) {
        // <--- ИЗМЕНЕНО
        var wrapperTop = $regionsWrapper.offset().top;
        var windowHeight = $(window).height();
        var targetScroll = wrapperTop + windowHeight * index;
        isScrolling = true;
        $('html, body').animate({
          scrollTop: targetScroll
        }, 600, function () {
          setTimeout(function () {
            isScrolling = false;
          }, 100);
        });
      } // setActiveSlide вызывается всегда при клике


      setActiveSlide(index);
    });

    var _resizeTimer;

    $(window).on('resize', function () {
      clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(function () {
        updateWrapperHeight();
        initMobileState();
      }, 150);
    });
  }
}); // Логика выравнивания высоты табов

(function () {
  var regionsTxtDesktop = $('.regions__text');

  function calculateTabHeights() {
    if (!regionsTxtDesktop.length) return;
    regionsTxtDesktop.each(function () {
      var tabs = $(this).find('.tabs');

      if (tabs.length) {
        tabs.each(function () {
          var $bodies = $(this).find('.tabs__body');
          var maxHeight = 0;
          var $content = $(this).find('.tabs__content');
          $bodies.each(function () {
            var $el = $(this);
            var isVisible = $el.is(':visible'); // Временно показываем всех скрытых родителей

            var $hiddenParents = $el.parents().filter(function () {
              return $(this).css('display') === 'none';
            });
            var parentsDisplay = [];
            $hiddenParents.each(function (i) {
              parentsDisplay.push($(this).css('display'));
              $(this).css('display', 'block');
            });

            if (isVisible) {
              $el.css('min-height', 'auto');
            } else {
              $el.css({
                'visibility': 'hidden',
                'display': 'block',
                'min-height': 'auto'
              });
            }

            var currentHeight = $el.outerHeight();

            if (currentHeight > maxHeight) {
              maxHeight = currentHeight;
            }

            if (!isVisible) {
              $el.css({
                'visibility': '',
                'display': '',
                'position': '',
                'top': ''
              });
            }

            $hiddenParents.each(function (i) {
              $(this).css('display', parentsDisplay[i]);
            });
          });
          $bodies.css('min-height', maxHeight + 'px');
          $content.css('min-height', maxHeight + 'px');
        });
      }
    });
  } // Первый расчёт после загрузки DOM


  $(function () {
    calculateTabHeights(); // Пересчёт после загрузки шрифтов

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        calculateTabHeights();
      });
    }

    $(window).on('load', function () {
      calculateTabHeights();
    });
  });
  var resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      calculateTabHeights();
    }, 200);
  });
})(); // анимация блока benefits


document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('.benefits');
  var sticky = section === null || section === void 0 ? void 0 : section.querySelector('.benefits__sticky');
  var content = section === null || section === void 0 ? void 0 : section.querySelector('.benefits__content');
  var image = section === null || section === void 0 ? void 0 : section.querySelector('.benefits__image');
  if (!section || !sticky || !content || !image) return;
  var visibleElements = section.querySelectorAll('.benefits__slider, .benefits__blur');
  var visibleTitle = section.querySelector('.benefits__text');

  var clamp = function clamp(value) {
    return Math.min(Math.max(value, 0), 1);
  };

  var smoothstep = function smoothstep(value) {
    var progress = clamp(value);
    return progress * progress * (3 - 2 * progress);
  };

  var measureImage = function measureImage() {
    image.style.width = '';
    image.style.height = '';
    var styles = getComputedStyle(image);
    return {
      width: parseFloat(styles.width),
      height: parseFloat(styles.height)
    };
  };

  var initialSize = measureImage();
  var isAnimating = false;

  var render = function render() {
    var sectionTop = section.getBoundingClientRect().top + window.scrollY;
    var animationDistance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
    var progress = clamp((window.scrollY - sectionTop) / animationDistance);
    var imageProgress = clamp(progress / 0.6);
    var easedImageProgress = smoothstep(imageProgress);
    var contentProgress = clamp((progress - 0.6) / 0.2);
    var easedContentProgress = smoothstep(contentProgress);
    var targetWidth = content.clientWidth;
    var targetHeight = content.clientHeight;
    var width = initialSize.width + (targetWidth - initialSize.width) * easedImageProgress;
    var height = initialSize.height + (targetHeight - initialSize.height) * easedImageProgress; // Оптимизация: обновляем только при изменении значений

    var currentWidth = parseFloat(image.style.width) || 0;
    var currentHeight = parseFloat(image.style.height) || 0;

    if (Math.abs(currentWidth - width) > 0.5 || Math.abs(currentHeight - height) > 0.5) {
      image.style.width = "".concat(width, "px");
      image.style.height = "".concat(height, "px");
    }

    var isFullSize = imageProgress >= 0.8;
    var currentBorderRadius = image.style.borderRadius;
    var newBorderRadius = isFullSize ? '0' : '';

    if (currentBorderRadius !== newBorderRadius) {
      image.style.borderRadius = newBorderRadius;
    } // Оптимизация обновления элементов


    visibleElements.forEach(function (element) {
      var shouldBeVisible = easedContentProgress > 0;
      var currentOpacity = parseFloat(element.style.opacity) || 0;
      var newOpacity = shouldBeVisible ? easedContentProgress : 0;
      var currentTransform = element.style.transform || '';
      var newTransform = shouldBeVisible ? "translateY(".concat(30 - 30 * easedContentProgress, "px)") : 'translateY(30px)';

      if (Math.abs(currentOpacity - newOpacity) > 0.01 || currentTransform !== newTransform) {
        if (shouldBeVisible) {
          element.classList.add('visible');
          element.style.opacity = easedContentProgress;
          element.style.transform = "translateY(".concat(30 - 30 * easedContentProgress, "px)");
          element.style.webkitTransform = "translateY(".concat(30 - 30 * easedContentProgress, "px)");
        } else {
          element.classList.remove('visible');
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.webkitTransform = 'translateY(30px)';
        }
      }
    });

    if (visibleTitle) {
      var shouldBeVisible = easedContentProgress > 0;
      var currentOpacity = parseFloat(visibleTitle.style.opacity) || 0;
      var newOpacity = shouldBeVisible ? easedContentProgress : 0;

      if (Math.abs(currentOpacity - newOpacity) > 0.01) {
        if (shouldBeVisible) {
          visibleTitle.classList.add('visible');
          visibleTitle.style.opacity = easedContentProgress;
        } else {
          visibleTitle.classList.remove('visible');
          visibleTitle.style.opacity = '0';
        }
      }
    }
  };

  var frameId = null;
  var lastScrollTime = 0;
  var SCROLL_THROTTLE = 16; // ~60fps

  var requestRender = function requestRender() {
    var now = performance.now(); // Троттлинг для iOS Chrome

    if (now - lastScrollTime < SCROLL_THROTTLE) {
      if (frameId === null) {
        frameId = requestAnimationFrame(function () {
          frameId = null;
          lastScrollTime = performance.now();
          render();
        });
      }

      return;
    }

    if (frameId !== null) return;
    frameId = requestAnimationFrame(function () {
      frameId = null;
      lastScrollTime = performance.now();
      render();
    });
  }; // Используем scroll с пассивным слушателем


  window.addEventListener('scroll', requestRender, {
    passive: true
  }); // Используем touchmove для лучшей отзывчивости на iOS

  if ('ontouchstart' in window) {
    document.addEventListener('touchmove', requestRender, {
      passive: true
    });
  }

  window.addEventListener('resize', function () {
    initialSize = measureImage();
    requestRender();
  }); // Проверка на предпочтение уменьшенного движения

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.borderRadius = '0';
    image.style.transform = 'translateZ(0)';
    visibleElements.forEach(function (element) {
      element.classList.add('visible');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      element.style.webkitTransform = 'translateY(0)';
    });

    if (visibleTitle) {
      visibleTitle.classList.add('visible');
      visibleTitle.style.opacity = '1';
    }

    return;
  } // Инициализация начального состояния


  render();
});
document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('.benefits');
  var sticky = section === null || section === void 0 ? void 0 : section.querySelector('.benefits__sticky');
  var content = section === null || section === void 0 ? void 0 : section.querySelector('.benefits__content');
  var image = section === null || section === void 0 ? void 0 : section.querySelector('.benefits__image');
  if (!section || !sticky || !content || !image) return;
  var visibleElements = section.querySelectorAll('.benefits__slider, .benefits__blur');
  var visibleTitle = section.querySelector('.benefits__text');

  var clamp = function clamp(value) {
    return Math.min(Math.max(value, 0), 1);
  };

  var smoothstep = function smoothstep(value) {
    var progress = clamp(value);
    return progress * progress * (3 - 2 * progress);
  };

  var measureImage = function measureImage() {
    image.style.width = '';
    image.style.height = '';
    var styles = getComputedStyle(image);
    return {
      width: parseFloat(styles.width),
      height: parseFloat(styles.height)
    };
  };

  var initialSize = measureImage();
  var isAnimating = false;

  var render = function render() {
    var rect = section.getBoundingClientRect();
    var windowHeight = window.innerHeight; // Когда секция достигает середины экрана
    // rect.top - расстояние от верха секции до верха окна
    // windowHeight / 2 - середина экрана
    // Когда rect.top <= windowHeight / 2, секция пересекает середину экрана

    var triggerPoint = windowHeight / 2; // Прогресс от момента когда секция касается середины экрана (0) 
    // до момента когда секция покидает середину экрана (1)
    // Используем высоту секции как диапазон анимации

    var sectionHeight = section.offsetHeight;
    var progress = clamp((triggerPoint - rect.top) / (sectionHeight * 0.5)); // Для image используем прогресс 0-1 на протяжении всей анимации

    var imageProgress = clamp(progress / 0.7);
    var easedImageProgress = smoothstep(imageProgress); // Для контента (текст, слайдер) начинаем позже

    var contentProgress = clamp((progress - 0.5) / 0.3);
    var easedContentProgress = smoothstep(contentProgress);
    var targetWidth = content.clientWidth;
    var targetHeight = content.clientHeight;
    var width = initialSize.width + (targetWidth - initialSize.width) * easedImageProgress;
    var height = initialSize.height + (targetHeight - initialSize.height) * easedImageProgress; // Оптимизация: обновляем только при изменении значений

    var currentWidth = parseFloat(image.style.width) || 0;
    var currentHeight = parseFloat(image.style.height) || 0;

    if (Math.abs(currentWidth - width) > 0.5 || Math.abs(currentHeight - height) > 0.5) {
      image.style.width = "".concat(width, "px");
      image.style.height = "".concat(height, "px");
    }

    var isFullSize = imageProgress >= 0.8;
    var currentBorderRadius = image.style.borderRadius;
    var newBorderRadius = isFullSize ? '0' : '';

    if (currentBorderRadius !== newBorderRadius) {
      image.style.borderRadius = newBorderRadius;
    } // Оптимизация обновления элементов


    visibleElements.forEach(function (element) {
      var shouldBeVisible = easedContentProgress > 0;
      var currentOpacity = parseFloat(element.style.opacity) || 0;
      var newOpacity = shouldBeVisible ? easedContentProgress : 0;
      var currentTransform = element.style.transform || '';
      var newTransform = shouldBeVisible ? "translateY(".concat(30 - 30 * easedContentProgress, "px)") : 'translateY(30px)';

      if (Math.abs(currentOpacity - newOpacity) > 0.01 || currentTransform !== newTransform) {
        if (shouldBeVisible) {
          element.classList.add('visible');
          element.style.opacity = easedContentProgress;
          element.style.transform = "translateY(".concat(30 - 30 * easedContentProgress, "px)");
          element.style.webkitTransform = "translateY(".concat(30 - 30 * easedContentProgress, "px)");
        } else {
          element.classList.remove('visible');
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.webkitTransform = 'translateY(30px)';
        }
      }
    });

    if (visibleTitle) {
      var shouldBeVisible = easedContentProgress > 0;
      var currentOpacity = parseFloat(visibleTitle.style.opacity) || 0;
      var newOpacity = shouldBeVisible ? easedContentProgress : 0;

      if (Math.abs(currentOpacity - newOpacity) > 0.01) {
        if (shouldBeVisible) {
          visibleTitle.classList.add('visible');
          visibleTitle.style.opacity = easedContentProgress;
        } else {
          visibleTitle.classList.remove('visible');
          visibleTitle.style.opacity = '0';
        }
      }
    }
  };

  var frameId = null;
  var lastScrollTime = 0;
  var SCROLL_THROTTLE = 16;

  var requestRender = function requestRender() {
    var now = performance.now();

    if (now - lastScrollTime < SCROLL_THROTTLE) {
      if (frameId === null) {
        frameId = requestAnimationFrame(function () {
          frameId = null;
          lastScrollTime = performance.now();
          render();
        });
      }

      return;
    }

    if (frameId !== null) return;
    frameId = requestAnimationFrame(function () {
      frameId = null;
      lastScrollTime = performance.now();
      render();
    });
  }; // Используем scroll с пассивным слушателем


  window.addEventListener('scroll', requestRender, {
    passive: true
  }); // Используем touchmove для лучшей отзывчивости на iOS

  if ('ontouchstart' in window) {
    document.addEventListener('touchmove', requestRender, {
      passive: true
    });
  }

  window.addEventListener('resize', function () {
    initialSize = measureImage();
    requestRender();
  }); // Проверка на предпочтение уменьшенного движения

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.borderRadius = '0';
    image.style.transform = 'translateZ(0)';
    visibleElements.forEach(function (element) {
      element.classList.add('visible');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      element.style.webkitTransform = 'translateY(0)';
    });

    if (visibleTitle) {
      visibleTitle.classList.add('visible');
      visibleTitle.style.opacity = '1';
    }

    return;
  } // Инициализация начального состояния


  render();
}); //валидация формы
// jQuery(document).ready(function($) {
//   const $form = $('.feedback__form .form');
//   if (!$form.length) return;
//   const $submitBtn = $form.find('button[type="submit"]');
//   const $formBlock = $('.feedback__form');
//   const $successBlock = $('.feedback__success');
//   const $requiredInputs = $form.find('[required]');
//   const $consentCheckbox = $form.find('.custom-checkbox input[type="checkbox"]');
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   // ---------- 1. Активация кнопки ----------
//   const toggleSubmit = () => {
//     // Проверяем, что все required-поля заполнены
//     const allRequiredFilled = $requiredInputs.toArray().every(input => {
//       const $input = $(input);
//       if (input.type === 'checkbox') {
//         return $input.is(':checked');
//       }
//       return $input.val().trim().length > 0;
//     });
//       // Проверяем, что ни один input[type="file"] не имеет класса is-invalid
//     const noInvalidFiles = $form.find('input[type="file"]').toArray().every(input => {
//       return !$(input).hasClass('is-invalid');
//     });
//     // Проверяем чекбокс согласия (даже если у него нет атрибута required)
//     const consentChecked = $consentCheckbox.length ? $consentCheckbox.is(':checked') : true;
//     $submitBtn.prop('disabled', !(allRequiredFilled && consentChecked && noInvalidFiles));
//   };
//   $requiredInputs.each(function(){
//     $(this).on('blur', function(){
//       if($(this).val() === '') {
//         $(this).closest('.form__input').find('.form__error').show();
//       }
//     })
//     $(this).on('input', function(){
//       if($(this).val() !== '') {
//         $(this).closest('.form__input').find('.form__error').hide();
//       }
//     })
//   })
//   $form.on('change', 'input[type="file"]', function() {
//     setTimeout(toggleSubmit, 0);
//   });
//   // Слушаем события input и change на всех required-полях и чекбоксе
//   $requiredInputs.add($consentCheckbox).on('input change', toggleSubmit);
//   // ---------- 2. Вспомогательные функции показа ошибок ----------
//   const showError = ($input, message) => {
//     // Ищем обёртку .form__input или .feedback__bottom (для чекбокса)
//     const $wrapper = $input.closest('.form__input, .feedback__bottom');
//     if (!$wrapper.length) return;
//     const $errorEl = $wrapper.find('.form__error');
//     if ($errorEl.length) {
//       $errorEl.text(message).addClass('is-visible');
//     }
//     $input.addClass('error');
//   };
//   const clearError = ($input) => {
//     const $wrapper = $input.closest('.form__input, .feedback__bottom');
//     if (!$wrapper.length) return;
//     const $errorEl = $wrapper.find('.form__error');
//     if ($errorEl.length) {
//       $errorEl.removeClass('is-visible');
//     }
//     $input.removeClass('error');
//   };
//   // Сбрасываем ошибки при вводе/изменении в любом поле
//   $form.find('input, select').on('input change', function() {
//     clearError($(this));
//   });
//   // ---------- 3. Отправка формы ----------
//   $form.on('submit', function(e) {
//     e.preventDefault();
//     const $emailInput = $form.find('input[name="email"]');
//     const $phoneInput = $form.find('input[name="phone"]');
//     let isValid = true;
//     // Проверка email
//     const emailValue = $emailInput.val().trim();
//     if (!emailPattern.test(emailValue)) {
//       showError($emailInput, 'Введите корректный e-mail');
//       isValid = false;
//     } else {
//       clearError($emailInput);
//     }
//     // Проверка телефона: если поле заполнено — должно быть ровно 11 цифр
//     const phoneValue = $phoneInput.val().trim();
//     if (phoneValue.length > 0) {
//       const digits = phoneValue.replace(/\D/g, '');
//       if (digits.length !== 11) {
//         showError($phoneInput, 'Номер должен содержать 11 цифр');
//         isValid = false;
//       } else {
//         clearError($phoneInput);
//       }
//     } else {
//       clearError($phoneInput);
//     }
//     // Проверка чекбокса согласия при отправке
//     if ($consentCheckbox.length && !$consentCheckbox.is(':checked')) {
//       showError($consentCheckbox, 'Необходимо дать согласие на обработку данных');
//       isValid = false;
//     } else {
//       clearError($consentCheckbox);
//     }
//     if (!isValid) return;
//     $formBlock.hide();
//     $successBlock.show();
//   });
// });
//* селекты

var select = $('select');

if (select.length) {
  select.each(function () {
    var _this = this;

    var $select = $(this);
    var cstSel = customSelect($(this))[0];
    $select.data('customSelect', cstSel);
    $(this).on("change", function () {
      $(this).parent().find(".custom-select-opener").addClass("chosen");
      $(this).trigger('input');
    });
    cstSel.container.addEventListener('custom-select:close', function () {
      var selectedValue = $(_this).val();
      var error = $(_this).closest('.form__select').find('.form__error');

      if (selectedValue == '') {
        error.show();
      } else {
        error.hide();
      }

      $(_this).trigger('input');
    });
  });
} //анимация блока команда


function teamAnimation() {
  if ($(window).width() > 480) {
    var section = document.querySelector('.team');
    var sticky = section === null || section === void 0 ? void 0 : section.querySelector('.team__sticky');
    if (!section || !sticky) return;
    var isDesktop = window.innerWidth > 992;
    var groups = [{
      selector: '.team__img--anim1',
      start: 0,
      end: 0.72,
      maxSize: isDesktop ? 2 : 1.4,
      appearStart: 0.0,
      appearEnd: 0.15,
      scaleStart: 0.15,
      scaleEnd: 0.45,
      fadeOutStart: 0.55,
      fadeOutEnd: 0.72
    }, {
      selector: '.team__img--anim2',
      start: isDesktop ? 0.3 : 0.5,
      end: 1,
      maxSize: isDesktop ? 1.5 : 1.3,
      appearStart: 0.0,
      appearEnd: 0.15,
      scaleStart: 0.15,
      scaleEnd: 0.45,
      fadeOutStart: 0.7,
      fadeOutEnd: 0.9
    }];
    var images = groups.flatMap(function (_ref) {
      var selector = _ref.selector;
      return _toConsumableArray(section.querySelectorAll(selector));
    });
    var baseSizes = new WeakMap();
    var basePositions = new WeakMap(); // Сохраняем базовые размеры И начальные позиции (до применения transform)

    var updateBaseSizes = function updateBaseSizes() {
      var stickyRect = sticky.getBoundingClientRect();
      images.forEach(function (image) {
        var inlineW = image.style.width;
        var inlineH = image.style.height;
        var inlineTransform = image.style.transform;
        image.style.width = '';
        image.style.height = '';
        image.style.transform = '';
        var styles = getComputedStyle(image);
        var rect = image.getBoundingClientRect();
        baseSizes.set(image, {
          width: parseFloat(styles.width),
          height: parseFloat(styles.height)
        }); // Начальный центр изображения относительно sticky

        basePositions.set(image, {
          centerX: rect.left - stickyRect.left + rect.width / 2,
          centerY: rect.top - stickyRect.top + rect.height / 2
        });
        image.style.width = inlineW;
        image.style.height = inlineH;
        image.style.transform = inlineTransform;
      });
    };

    updateBaseSizes();

    var clamp = function clamp(value) {
      var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return Math.min(Math.max(value, min), max);
    };

    var smoothstep = function smoothstep(value) {
      var progress = clamp(value);
      return progress * progress * (3 - 2 * progress);
    };

    var getScrollProgress = function getScrollProgress() {
      var sectionTop = section.getBoundingClientRect().top + window.scrollY;
      var stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      var scrollStart = sectionTop - stickyTop;
      var scrollDistance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      return clamp((window.scrollY - scrollStart) / scrollDistance);
    };

    var targetProgress = 0;
    var currentProgress = 0;
    var isAnimating = false;
    var smoothingFactor = 0.07;

    var render = function render(scrollProgress) {
      var stickyW = sticky.offsetWidth;
      var stickyH = sticky.offsetHeight; // Насколько далеко изображения уходят к краям

      var sideOffset = Math.min(stickyW * 0.18, 220);
      var verticalOffset = Math.min(stickyH * 0.22, 200);
      groups.forEach(function (_ref2) {
        var selector = _ref2.selector,
            start = _ref2.start,
            end = _ref2.end,
            maxSize = _ref2.maxSize,
            appearStart = _ref2.appearStart,
            appearEnd = _ref2.appearEnd,
            scaleStart = _ref2.scaleStart,
            scaleEnd = _ref2.scaleEnd,
            fadeOutStart = _ref2.fadeOutStart,
            fadeOutEnd = _ref2.fadeOutEnd;
        var groupProgress = clamp((scrollProgress - start) / (end - start));
        var groupImages = section.querySelectorAll(selector);
        groupImages.forEach(function (image, index) {
          var base = baseSizes.get(image);
          var basePos = basePositions.get(image);
          if (!base || !basePos) return;
          var delayPerImage = 0.08;
          var delayedProgress = clamp((groupProgress - index * delayPerImage) / (1 - index * delayPerImage)); // Появление

          var appearProgress = clamp((delayedProgress - appearStart) / (appearEnd - appearStart));
          var appearance = smoothstep(appearProgress); // Исчезновение

          var disappearProgress = clamp((delayedProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart));
          var disappearance = 1 - smoothstep(disappearProgress);
          var opacity = appearance * disappearance; // Рост

          var scaleProgress = clamp((delayedProgress - scaleStart) / (scaleEnd - scaleStart));
          var growth = smoothstep(scaleProgress); // Движение

          var movement = smoothstep(delayedProgress / 0.9);
          var size = 1 + (maxSize - 1) * growth; // Направление движения по X: левые — влево, правые — вправо

          var isLeft = image.classList.contains('team__img--left');
          var isBottom = image.classList.contains('team__img--bottom');
          var dirX = isLeft ? -1 : 1;
          var dirY = isBottom ? 1 : -1; // --- Ключевой момент ---
          // Компенсируем рост изображения, чтобы ЦЕНТР двигался по прямой.
          // Изображение растёт от своего top-left угла, поэтому центр
          // смещается на (widthDelta/2, heightDelta/2) относительно начала.
          // Мы вычитаем это смещение, чтобы центр оставался на прямой.

          var widthDelta = base.width * size - base.width;
          var heightDelta = base.height * size - base.height;
          var growCompensationX = -widthDelta / 2;
          var growCompensationY = -heightDelta / 2; // Основное движение по прямой

          var moveX = dirX * sideOffset * movement;
          var moveY = dirY * verticalOffset * movement;
          var moveZ = 180 * movement; // Итоговое смещение центра

          var translateX = moveX + growCompensationX;
          var translateY = moveY + growCompensationY;
          image.style.width = "".concat(base.width * size, "px");
          image.style.height = "".concat(base.height * size, "px");
          image.style.opacity = opacity;
          image.style.transform = "translate3d(".concat(translateX, "px, ").concat(translateY, "px, ").concat(moveZ, "px)");
        });
      });
    };

    var animate = function animate() {
      currentProgress += (targetProgress - currentProgress) * smoothingFactor;

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
        isAnimating = false;
      } else {
        requestAnimationFrame(animate);
      }

      render(currentProgress);
    };

    var handleScroll = function handleScroll() {
      targetProgress = getScrollProgress();

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      images.forEach(function (image) {
        image.style.opacity = '1';
        image.style.transform = 'none';
      });
      return;
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    window.addEventListener('resize', function () {
      updateBaseSizes();
      handleScroll();
    });
    handleScroll();
  } else {
    addClassOnScroll('.animate-image', 2);
  }
}

$(window).on('load', teamAnimation); //* поделиться *//

$(document).ready(function () {
  $('.share__link').on('click', function (e) {
    var urlToShare = $(this).attr('data-link');
    var shareText = $(this).attr('data-text');

    if ($(this).hasClass('share__link--copy')) {
      navigator.clipboard.writeText(urlToShare).then(function () {})["catch"](function (err) {
        console.error('Не удалось скопировать URL: ', err);
      });
    } else if ($(this).hasClass('share__link--tg')) {
      var telegramUrl = "https://t.me/share/url?url=".concat(urlToShare, "&text=").concat(shareText);
      window.open(telegramUrl, '_blank');
    } else if ($(this).hasClass('share__link--vk')) {
      var vkUrl = "https://vk.com/share.php?url=".concat(encodeURIComponent(urlToShare), "&title=").concat(encodeURIComponent(shareText));
      window.open(vkUrl, '_blank');
    } else if ($(this).hasClass('share__link--ok')) {
      var okUrl = "https://ok.ru/share?url=".concat(encodeURIComponent(urlToShare), "&title=").concat(encodeURIComponent(shareText));
      window.open(okUrl, '_blank');
    }
  });
});
$(document).ready(function () {
  $('.share--dropdown').on('click', function () {
    var $options = $(this).find('.share__options');

    if ($(window).width() > 600) {
      $options.slideToggle(300);
    } else {
      $options.toggleClass('active');
    }
  });
  $(window).on('resize', function () {
    var $options = $('.share__options');
    $options.removeAttr('style').removeClass('active');
  });
});
$(document).ready(function () {
  if ($('.vacancy__btn').length && $(window).width() <= 600) {
    var $stickyBtn = $('.vacancy__btn');
    var $container = $('.vacancy__wrapper');
    var $innerBtn = $container.find('.btn');
    var showAt = $innerBtn.offset().top + $innerBtn.outerHeight(); // Буфер: за сколько пикселей до конца контейнера начинаем прятать

    var buffer = $stickyBtn.outerHeight() + 40;
    $(window).on('scroll resize', function () {
      var scrollTop = $(this).scrollTop();
      var windowHeight = $(this).height();
      var scrollBottom = scrollTop + windowHeight;
      var containerBottom = $container.offset().top + $container.outerHeight();
      var hideAt = containerBottom - buffer;

      if (scrollTop > showAt && scrollBottom < hideAt) {
        if (!$stickyBtn.is(':visible')) {
          $stickyBtn.stop(true, true).slideDown(300);
        }
      } else {
        if ($stickyBtn.is(':visible')) {
          $stickyBtn.stop(true, true).slideUp(300);
        }
      }
    });
  }
});
$('.btn--dwnld').on('click', function (e) {
  var $btn = $(this);

  if ($btn.hasClass('is-loading')) {
    e.preventDefault();
    return;
  }

  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var isSlow = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');

  if (isSlow) {
    $btn.addClass('is-loading');
    var $text = $btn.find('span');
    var $iconDefault = $btn.find('.btn__icon--default');
    var $iconProgress = $btn.find('.btn__icon--progress');
    var originalText = $text.text();
    $iconDefault.fadeOut(200);
    $iconProgress.fadeIn(200);
    $text.text('скачивание');
    setTimeout(function () {
      $iconProgress.fadeOut(200);
      $iconDefault.fadeIn(200);
      $text.text(originalText);
      $btn.removeClass('is-loading');
    }, 2000);
  }
});
var cookieBlock = document.querySelector('.cookies');

if (getCookie('cookie_agreed') === '1') {
  if (cookieBlock) cookieBlock.style.display = 'none';
} else {
  if (cookieBlock) cookieBlock.style.display = 'block';
} // Обработка клика


document.addEventListener('click', function (e) {
  if (e.target.hasAttribute('data-agree-cookie')) {
    document.cookie = "cookie_agreed=1; path=/; max-age=31536000"; // 1 год

    if (cookieBlock) cookieBlock.style.display = 'none';
  } else if (e.target.hasAttribute('data-disagree-cookie')) {
    cookieBlock.style.display = 'none';
    setTimeout(function () {
      cookieBlock.style.display = 'block';
    }, 5000);
  }
});

function getCookie(name) {
  var cookies = document.cookie.split(';');

  var _iterator = _createForOfIteratorHelper(cookies),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var cookie = _step.value;

      var _cookie$trim$split = cookie.trim().split('=', 2),
          _cookie$trim$split2 = _slicedToArray(_cookie$trim$split, 2),
          key = _cookie$trim$split2[0],
          value = _cookie$trim$split2[1];

      if (key === name) {
        return decodeURIComponent(value !== null && value !== void 0 ? value : '');
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return undefined;
} // фильтры мероприятий


$(function () {
  var eventsSlider = new Swiper('.events__slider', {
    slidesPerView: 3,
    spaceBetween: 24,
    navigation: {
      nextEl: '.events__slider .swiper-button-next',
      prevEl: '.events__slider .swiper-button-prev'
    },
    pagination: {
      el: ".events__slider .swiper-pagination",
      clickable: true
    },
    watchSlidesProgress: true,
    breakpoints: {
      1024: {
        slidesPerView: 'auto',
        spaceBetween: 24
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 12
      }
    }
  });

  function toggleResetButton() {
    var hasActiveFilter = $('[data-event-filter].active').length > 0;

    if (hasActiveFilter) {
      $('.events__filter--reset').css('display', 'flex');
    } else {
      $('.events__filter--reset').hide();
    }
  }

  function applyFilters() {
    var activeCategories = [];
    $('[data-event-filter].active').not('.js-calendar').each(function () {
      activeCategories.push($(this).data('event-filter'));
    });
    var activeDate = $('.js-calendar').hasClass('active') ? $('.js-calendar').text() : null;
    var visibleSlidesCount = 0;
    $('.event-card').each(function () {
      var $card = $(this);
      var cardEvent = $card.data('event');
      var cardDate = $card.data('date');
      var isCategoryMatch = activeCategories.length === 0 || activeCategories.includes(cardEvent);
      var isDateMatch = !activeDate || cardDate === activeDate;

      if (isCategoryMatch && isDateMatch) {
        $card.show();
        visibleSlidesCount++;
      } else {
        $card.hide();
      }
    });
    eventsSlider.update();
    eventsSlider.slideTo(0);
    var $wrapper = $('.events__slider .swiper-wrapper');

    if (visibleSlidesCount === 0) {
      $('.events__result--notFound').show();
      $('.events .custom-slider').hide();
      eventsSlider.update();
    } else {
      $('.events__empty-slide').remove();
      $('.events__result--notFound').hide();
      $('.events .custom-slider').show();
      eventsSlider.update();
    }
  }

  $('[data-event-filter]').not('.js-calendar').on('click', function () {
    $(this).toggleClass('active');
    toggleResetButton();
    applyFilters();
  });

  if ($('.js-calendar').length) {
    var hideFullyOffRows = function hideFullyOffRows() {
      $('.calendar-table tbody').find('tr').each(function () {
        var $row = $(this);

        if ($row.find('td.off').length === 7) {
          $row.hide();
        } else {
          $row.show();
        }
      });
    };

    var $btn = $('.js-calendar');
    $btn.daterangepicker({
      singleDatePicker: true,
      showDropdowns: false,
      minYear: 1901,
      maxYear: moment().year(),
      autoApply: true,
      locale: {
        format: 'DD.MM.YYYY',
        firstDay: 1,
        daysOfWeek: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      }
    });
    $btn.on('click', function () {
      $(this).data('daterangepicker').show();
    });
    $btn.on('apply.daterangepicker', function (ev, picker) {
      var selectedDate = picker.startDate.format('DD.MM.YYYY');
      $(this).text(selectedDate).addClass('active');
      toggleResetButton();
      applyFilters();
    });
    $btn.on('show.daterangepicker', function () {
      hideFullyOffRows();
    });
    $(document).on('click', 'th.prev, th.next', function () {
      hideFullyOffRows();
    });
  }

  $('.events__filter--reset').on('click', function () {
    $('.events__filter').removeClass('active');
    $('.events__result--notFound').hide();
    $('.js-calendar').text('Выбрать дату');
    var picker = $('.js-calendar').data('daterangepicker');

    if (picker) {
      picker.setStartDate(moment());
      picker.setEndDate(moment());
    }

    $(this).hide();
    applyFilters();
  });
});
$('.search__suggestions').each(function () {
  var ps = new PerfectScrollbar(this, {
    wheelSpeed: 0.2
  });
}); // let filterOffsetTop = $('.vacancies__filter').offset().top;
// let windowheight = $(window).height();
// var initialHeight = windowheight - filterOffsetTop - 50;
// document.documentElement.style.setProperty('--initial-height', initialHeight + 'px');

(function () {
  var ticking = false;
  var BREAKPOINT = 992;

  function checkSticky() {
    var $wrapper = $('.vacancies__wrapper');
    var $filter = $('.filter__bottom');

    if (!$wrapper.length || !$filter.length) {
      ticking = false;
      return;
    } // Если экран <= 992 — снимаем класс и выходим


    if ($(window).width() <= BREAKPOINT) {
      $filter.removeClass('no-fixed');
      ticking = false;
      return;
    }

    var wrapperBottom = $wrapper.offset().top + $wrapper.outerHeight();
    var windowBottom = $(window).scrollTop() + $(window).height();
    $filter.toggleClass('no-fixed', wrapperBottom <= windowBottom);
    ticking = false;
  }

  $(window).on('scroll resize', function () {
    if (!ticking) {
      window.requestAnimationFrame(checkSticky);
      ticking = true;
    }
  });
  checkSticky();
})();

/* ==========================================================================
   «Возможности для будущих специалистов» (.offers)
   Правки по ТЗ дизайнера:
   1) карточки поворачиваются одним плавным твином, без промежуточной остановки;
   2) 1 скролл (щелчок колеса / жест тачпада / свайп / клавиша) = 1 экран-шаг,
      блок занимает весь экран, на краях управление отдаётся обычному скроллу;
   3) текст появляется как на lassie.ai: снизу на 30px + проявление,
      expo.out ≈ cubic-bezier(.19,1,.22,1), 0.7s, шаг 0.1s, задержка 0.1s.
      Кнопка — следующий элемент той же очереди: те же 30px, fade и expo.out,
      длительность 0.7s, старт через 0.1s после старта последней строки.
      transition у .btn внутри шага выключен. Уход зеркальный;
      prefers-reduced-motion — без анимации;
   3b) фото не проявляется из прозрачности: opacity всегда 1.
      Новая карточка выезжает снизу из-за нижнего края вьюпорта
      (по повёрнутому габариту) и так же уезжает обратно;
   4) отступ от заголовка считается по повёрнутым габаритам картинок
      (минимум 40px на 1440, пропорционально меньше на узких экранах).
   Настройка таймингов: ?tune=1 в адресе страницы открывает панель.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  var section = document.querySelector('.offers');
  if (!section) return;
  var items = gsap.utils.toArray('.offers__item');
  if (items.length < 3) return;

  var OFFERS_DEFAULTS = {
    cardDuration: 1.2,   // c, длительность движения и поворота карточек
    cardEase: 'expo.out',// быстро в начале, мягко доезжает
    stepLock: 1.0,       // c, пауза до следующего шага, чтобы скролл не обрезал движение
    textDuration: 0.7,   // c
    textStagger: 0.1,    // c, между строками текста
    textOffset: 30,      // px, сдвиг текста при появлении/уходе
    textDelay: 0.1,      // c, задержка первой строки после начала шага
    btnDuration: 0.7,    // c, то же появление, что у текста
    btnStep: 0.1,        // c после старта последней строки
    gap: 40              // px на 1440, мин. зазор от повёрнутых фото до заголовка/низа экрана
  };
  var TUNE_KEY = 'offers-steps-tune-v3';
  var tuneMode = /[?&]tune=1(&|$)/.test(window.location.search);
  var cfg = {};
  var key;
  for (key in OFFERS_DEFAULTS) cfg[key] = OFFERS_DEFAULTS[key];
  if (tuneMode) {
    try {
      var saved = JSON.parse(window.localStorage.getItem(TUNE_KEY) || '{}');
      for (key in saved) if (key in cfg) cfg[key] = saved[key];
    } catch (e) {}
  }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TEXT_EASE = 'expo.out'; // = cubic-bezier(.19, 1, .22, 1)

  function textParts(item) {
    return gsap.utils.toArray(item.querySelectorAll('.offers__text > *'));
  }
  function isButton(node) {
    return !!(node.classList && node.classList.contains('btn'));
  }
  function splitParts(el) {
    var texts = [];
    var buttons = [];
    el.forEach(function (node) { (isButton(node) ? buttons : texts).push(node); });
    return { texts: texts, buttons: buttons };
  }

  var api = { layout: function () {} };
  var mm = gsap.matchMedia();

  /* ---------- ≥768: полноэкранный блок, шаги ---------- */
  mm.add('(min-width: 768px)', function () {
    var imgs = items.map(function (item) { return item.querySelector('img'); });
    var parts = items.map(textParts);
    var title = section.querySelector('.section-title');
    var container = section.querySelector('.container');
    var wrap = section.querySelector('.offers__items');
    var last = items.length - 1;
    var step = 0;
    var locked = false;
    var moving = false;
    var busyUntil = 0;
    var lastTop = section.getBoundingClientRect().top;
    var POSE = [];

    section.classList.add('offers--steps');
    gsap.set(items, { opacity: 1 });
    gsap.set(items.map(function (i) { return i.querySelector('.offers__text'); }), { clearProps: 'transform,opacity' });

    // Позы карточек на каждом шаге (те же значения, что были в макете/старом коде).
    function buildPoses() {
      var wide = window.innerWidth > 1220;
      var w = imgs[0].offsetWidth;
      var k = wide ? w / 490 : 1;
      var rest = { x: 0, y: 0, rotation: 0 };
      var below = { x: 0, y: 0, rotation: 0, off: true };
      var p1 = wide ? { x: 0, y: -40 * k, rotation: 10 } : { x: -8, y: -37, rotation: 8 };
      var p2 = wide ? { x: -36 * k, y: 21 * k, rotation: -10 } : { x: -21, y: 27, rotation: -10 };
      POSE = [
        [rest, below, below],
        [p1, rest, below],
        [p1, p2, rest]
      ];
    }

    // y, при котором повёрнутый габарит фото целиком ниже нижнего края вьюпорта.
    function offscreenY(img, rotation) {
      var rect = img.getBoundingClientRect();
      var curY = parseFloat(gsap.getProperty(img, 'y'));
      if (!isFinite(curY)) curY = 0;
      // Центр, как если бы секция уже стояла вверху экрана (шаг её туда прижимает).
      var center = rect.top + rect.height / 2 - curY - section.getBoundingClientRect().top;
      var w = img.offsetWidth;
      var h = img.offsetHeight;
      var rad = Math.abs(rotation || 0) * Math.PI / 180;
      var half = (h * Math.abs(Math.cos(rad)) + w * Math.abs(Math.sin(rad))) / 2;
      return Math.ceil(window.innerHeight - center + half + 16);
    }

    function poseTarget(img, p) {
      return {
        x: p.x,
        y: p.off ? offscreenY(img, p.rotation) : p.y,
        rotation: p.rotation,
        opacity: 1
      };
    }

    function setText(i, shown, dir, instant) {
      var el = parts[i];
      var group = splitParts(el);
      gsap.killTweensOf(el);
      var off = cfg.textOffset;
      if (instant || reduce) {
        gsap.set(el, { y: 0, autoAlpha: shown ? 1 : 0 });
        return;
      }
      var fromY = dir > 0 ? off : -off;
      var toY = dir > 0 ? -off : off;
      if (shown) {
        if (group.texts.length) {
          gsap.fromTo(group.texts, { y: fromY, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration: cfg.textDuration, ease: TEXT_EASE,
            stagger: cfg.textStagger, delay: cfg.textDelay, overwrite: 'auto'
          });
        }
        var lastStart = cfg.textDelay + Math.max(0, group.texts.length - 1) * cfg.textStagger;
        group.buttons.forEach(function (node) {
          gsap.fromTo(node, { y: fromY, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration: cfg.btnDuration, ease: TEXT_EASE,
            delay: lastStart + cfg.btnStep, overwrite: 'auto'
          });
        });
      } else {
        var texts = dir > 0 ? group.texts : group.texts.slice().reverse();
        if (texts.length) {
          gsap.to(texts, {
            y: toY, autoAlpha: 0, duration: cfg.textDuration * 0.6, ease: TEXT_EASE,
            stagger: cfg.textStagger * 0.5, overwrite: 'auto'
          });
        }
        group.buttons.forEach(function (node) {
          gsap.to(node, {
            y: toY, autoAlpha: 0, duration: cfg.btnDuration * 0.6, ease: TEXT_EASE, overwrite: 'auto'
          });
        });
      }
    }

    function setPointer(i) {
      items.forEach(function (item, n) { item.style.pointerEvents = n === i ? 'auto' : 'none'; });
    }

    function applyStep(i) {
      gsap.killTweensOf(imgs);
      imgs.forEach(function (img, n) { gsap.set(img, poseTarget(img, POSE[i][n])); });
      items.forEach(function (item, n) { setText(n, n === i, 1, true); });
      setPointer(i);
      section.setAttribute('data-step', String(i));
    }

    function goTo(next) {
      next = Math.max(0, Math.min(last, next));
      if (next === step) return;
      var dir = next > step ? 1 : -1;
      var prev = step;
      step = next;
      var dur = reduce ? 0 : cfg.cardDuration;
      imgs.forEach(function (img, n) {
        var p = poseTarget(img, POSE[next][n]);
        gsap.to(img, {
          x: p.x, y: p.y, rotation: p.rotation, opacity: 1,
          duration: dur, ease: cfg.cardEase, overwrite: 'auto'
        });
      });
      setText(prev, false, dir);
      setText(next, true, dir);
      setPointer(next);
      section.setAttribute('data-step', String(next));
      busyUntil = performance.now() + (reduce ? 150 : cfg.stepLock * 1000);
    }

    // Отступы: зазор от повёрнутых габаритов фото до заголовка и низа экрана.
    function layout() {
      imgs.forEach(function (img) { img.style.width = ''; });
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var gap = Math.max(20, cfg.gap * Math.min(1, vw / 1440));
      for (var pass = 0; pass < 3; pass++) {
        wrap.style.minHeight = '0px';
        buildPoses();
        var w = imgs[0].offsetWidth;
        var h = imgs[0].offsetHeight;
        var contentH = 0;
        items.forEach(function (item) {
          Array.prototype.forEach.call(item.children, function (c) {
            contentH = Math.max(contentH, c.offsetTop + c.offsetHeight);
          });
        });
        var overTop = 0;
        var overBottom = 0;
        POSE.forEach(function (pose) {
          pose.forEach(function (p, n) {
            if (p.off) return;
            var rad = Math.abs(p.rotation) * Math.PI / 180;
            var half = (h * Math.cos(rad) + w * Math.sin(rad)) / 2;
            var cy = imgs[n].offsetTop + h / 2 + p.y;
            overTop = Math.max(overTop, half - cy);
            overBottom = Math.max(overBottom, cy + half - contentH);
          });
        });
        wrap.style.minHeight = contentH + 'px';
        title.style.marginBottom = Math.ceil(overTop + gap) + 'px';
        container.style.paddingBottom = Math.ceil(overBottom + gap) + 'px';
        var excess = section.offsetHeight - vh;
        if (excess <= 1 || vw <= 1220 || w <= 360) break;
        // Низкий экран: уменьшаем фото, чтобы шаг целиком помещался в экран
        var nw = Math.max(360, w - excess * 1.25 * (w / h));
        imgs.forEach(function (img) { img.style.width = nw + 'px'; });
      }
      applyStep(step);
      if (locked) window.scrollTo(0, absTop());
    }
    api.layout = function () { layout(); ScrollTrigger.refresh(); };

    function absTop() { return section.getBoundingClientRect().top + window.pageYOffset; }

    var scrollTween = null;
    function scrollToY(y, dur, done) {
      moving = true;
      if (scrollTween) scrollTween.kill();
      var proxy = { y: window.pageYOffset };
      scrollTween = gsap.to(proxy, {
        y: y, duration: reduce ? 0 : dur, ease: 'power3.out',
        onUpdate: function () { window.scrollTo(0, proxy.y); },
        onComplete: function () {
          window.scrollTo(0, y);
          moving = false;
          lastTop = section.getBoundingClientRect().top;
          if (done) done();
        }
      });
    }
    function enter(i, animated) {
      if (step !== i) { step = i; applyStep(i); }
      locked = true;
      busyUntil = performance.now() + 250;
      if (animated) scrollToY(absTop(), 0.6, function () { busyUntil = performance.now() + 150; });
      else { window.scrollTo(0, absTop()); lastTop = 0; }
    }
    function leave(dir) {
      locked = false;
      var y = dir > 0 ? absTop() + section.offsetHeight : absTop() - window.innerHeight * 0.6;
      scrollToY(Math.max(0, y), 0.7);
    }

    function onScroll() {
      var top = section.getBoundingClientRect().top;
      if (moving) return;
      if (locked) {
        // прыжок по якорю / перетаскивание скроллбара — отпускаем блок
        if (Math.abs(top) > window.innerHeight * 0.5) locked = false;
        else if (Math.abs(top) > 1) window.scrollTo(0, absTop());
        lastTop = section.getBoundingClientRect().top;
        return;
      }
      if (lastTop > 1 && top <= 1) enter(0, false);          // въехали сверху
      else if (lastTop < -1 && top >= -1) enter(last, false); // вернулись снизу
      lastTop = top;
    }

    var lastWheel = 0;
    var lastAbs = 0;
    var consumed = false;
    function onWheel(e) {
      if (e.ctrlKey || (e.target.closest && e.target.closest('.offers-tune'))) return;
      var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      var dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
      var abs = Math.abs(dy);
      var now = performance.now();
      var top = section.getBoundingClientRect().top;
      var vh = window.innerHeight;
      if (!locked && !moving) {
        if (dir > 0 && top > 1 && top < vh * 0.6) { e.preventDefault(); enter(0, true); consumed = true; lastWheel = now; lastAbs = abs; return; }
        if (dir < 0 && top < -1 && top > -vh * 0.6) { e.preventDefault(); enter(last, true); consumed = true; lastWheel = now; lastAbs = abs; return; }
        if (Math.abs(top) > 1) return;
        locked = true;
      }
      if (!locked) return; // уходим анимированным скроллом — не мешаем
      // Один жест = один шаг: инерцию тачпада гасим, новый жест — пауза >140мс или резкий разгон
      var idle = now >= busyUntil && !moving;
      if (now - lastWheel > 140) consumed = false;
      else if (idle && abs >= 12 && abs > lastAbs * 1.4) consumed = false;
      lastWheel = now;
      lastAbs = abs;
      if (consumed || abs < 2 || !dir || !idle) { e.preventDefault(); return; }
      if ((dir > 0 && step === last) || (dir < 0 && step === 0)) {
        locked = false; // край блока: отдаём событие обычному скроллу
        consumed = true;
        return;
      }
      e.preventDefault();
      consumed = true;
      goTo(step + dir);
    }

    function onKey(e) {
      if (!locked || moving || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], .offers-tune')) return;
      var k = e.key;
      var dir = (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) ? 1
        : (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      if (performance.now() < busyUntil) return;
      if ((dir > 0 && step === last) || (dir < 0 && step === 0)) leave(dir);
      else goTo(step + dir);
    }

    var ty0 = 0;
    var tx0 = 0;
    var tAxis = null;
    function onTouchStart(e) {
      if (e.touches.length !== 1) { tAxis = 'none'; return; }
      ty0 = e.touches[0].clientY; tx0 = e.touches[0].clientX; tAxis = null;
    }
    function onTouchMove(e) {
      if (!locked || tAxis === 'none') return;
      var dx = e.touches[0].clientX - tx0;
      var dy = e.touches[0].clientY - ty0;
      if (!tAxis && Math.sqrt(dx * dx + dy * dy) > 8) tAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (tAxis === 'y' || moving) e.preventDefault();
    }
    function onTouchEnd(e) {
      if (!locked || tAxis !== 'y') return;
      var dy = ty0 - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40 || performance.now() < busyUntil || moving) return;
      var dir = dy > 0 ? 1 : -1;
      if ((dir > 0 && step === last) || (dir < 0 && step === 0)) leave(dir);
      else goTo(step + dir);
    }
    function onResize() { layout(); }

    layout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', api.layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(api.layout);
    ScrollTrigger.refresh();

    window.__offers = { goTo: goTo, get step() { return step; }, get locked() { return locked; }, cfg: cfg, layout: api.layout };

    return function () {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', api.layout);
      if (scrollTween) scrollTween.kill();
      gsap.killTweensOf(imgs);
      parts.forEach(function (p) { gsap.killTweensOf(p); gsap.set(p, { clearProps: 'all' }); });
      gsap.set(imgs, { clearProps: 'all' });
      gsap.set(items, { clearProps: 'opacity,pointerEvents' });
      [title, container, wrap].forEach(function (el) { el.removeAttribute('style'); });
      section.classList.remove('offers--steps');
      section.removeAttribute('data-step');
      api.layout = function () {};
    };
  });

  /* ---------- <768: список, текст проявляется при прокрутке ---------- */
  mm.add('(max-width: 767px)', function () {
    if (reduce) return;
    items.forEach(function (item) {
      var group = splitParts(textParts(item));
      var trigger = item.querySelector('.offers__text');
      if (group.texts.length) {
        gsap.fromTo(group.texts, { y: cfg.textOffset, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: cfg.textDuration, ease: TEXT_EASE, stagger: cfg.textStagger,
          scrollTrigger: { trigger: trigger, start: 'top 88%', toggleActions: 'play none none reverse' }
        });
      }
      var lastStart = Math.max(0, group.texts.length - 1) * cfg.textStagger;
      group.buttons.forEach(function (node) {
        gsap.fromTo(node, { y: cfg.textOffset, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: cfg.btnDuration, ease: TEXT_EASE, delay: lastStart + cfg.btnStep,
          scrollTrigger: { trigger: trigger, start: 'top 88%', toggleActions: 'play none none reverse' }
        });
      });
    });
  });

  /* ---------- панель настройки (?tune=1) ---------- */
  if (tuneMode) {
    var fields = [
      ['cardDuration', 'Карточки: длительность, с', 0, 2, 0.05],
      ['stepLock', 'Пауза до след. шага, с', 0, 2, 0.05],
      ['textDuration', 'Текст: длительность, с', 0, 2, 0.05],
      ['textStagger', 'Текст: шаг между строками, с', 0, 0.5, 0.01],
      ['textDelay', 'Текст: задержка, с', 0, 1, 0.05],
      ['textOffset', 'Текст: сдвиг, px', 0, 100, 1],
      ['btnDuration', 'Кнопка: длительность, с', 0, 2, 0.05],
      ['btnStep', 'Кнопка: шаг, с', 0, 1, 0.01],
      ['gap', 'Зазор фото ↔ заголовок, px', 0, 120, 2]
    ];
    var eases = ['expo.out', 'power4.out', 'power3.out', 'power2.out', 'circ.out', 'sine.out', 'back.out(1.2)'];
    var panel = document.createElement('div');
    panel.className = 'offers-tune';
    var html = '<b>Анимация «Возможности»</b>';
    fields.forEach(function (f) {
      html += '<label>' + f[1] + ' <output data-o="' + f[0] + '"></output><input type="range" data-k="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '"></label>';
    });
    html += '<label>Кривая карточек <select data-k="cardEase">' + eases.map(function (e) { return '<option>' + e + '</option>'; }).join('') + '</select></label>';
    html += '<div class="offers-tune__btns"><button type="button" data-a="copy">Скопировать настройки</button><button type="button" data-a="reset">Сброс</button></div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);
    var paint = function () {
      fields.forEach(function (f) {
        panel.querySelector('[data-k="' + f[0] + '"]').value = cfg[f[0]];
        panel.querySelector('[data-o="' + f[0] + '"]').textContent = cfg[f[0]];
      });
      panel.querySelector('select').value = cfg.cardEase;
    };
    var save = function () {
      try { window.localStorage.setItem(TUNE_KEY, JSON.stringify(cfg)); } catch (e) {}
      paint();
      api.layout();
    };
    panel.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (!k) return;
      cfg[k] = k === 'cardEase' ? e.target.value : Number(e.target.value);
      save();
    });
    panel.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-a');
      if (a === 'reset') { for (var k in OFFERS_DEFAULTS) cfg[k] = OFFERS_DEFAULTS[k]; save(); }
      if (a === 'copy') {
        var text = JSON.stringify(cfg, null, 2);
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        e.target.textContent = 'Скопировано';
        setTimeout(function () { e.target.textContent = 'Скопировать настройки'; }, 1200);
      }
    });
    paint();
  }
});
$(document).on('click', '.document-dropdown__btn', function () {
  var btn = $(this);
  var dropdown = btn.closest('.document-dropdown');
  var body = dropdown.find('.document-dropdown__list');
  dropdown.toggleClass('open');
  body.slideToggle(300);
});
$(document).ready(function () {
  var docsFolders = $(document).find('.document-dropdown');

  if (docsFolders) {
    var docsFoldersAmount = docsFolders.length;

    if (docsFoldersAmount <= 2) {
      docsFolders.addClass('open');
      docsFolders.find('.document-dropdown__list').slideDown(300);
    } else {
      docsFolders.first().addClass('open');
      docsFolders.first().find('.document-dropdown__list').slideDown(300);
    }
  }
}); // ==========================================
// Stud-benefits pinned scroll animation (Figma Component 45 / screen why)
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  var section = document.querySelector('.stud-benefits');
  if (!section) return;
  var stage = section.querySelector('.stud-benefits__images');
  if (!stage) return;
  var CARD_MAP = {
    card1: section.querySelector('.stud-benefits__card--1-1'),
    p11: section.querySelector('.stud-benefits__card--1-2'),
    p12: section.querySelector('.stud-benefits__card--1-3'),
    card2: section.querySelector('.stud-benefits__card--2-1'),
    p21: section.querySelector('.stud-benefits__card--2-2'),
    p22: section.querySelector('.stud-benefits__card--2-3'),
    card4: section.querySelector('.stud-benefits__card--3-1'),
    p42: section.querySelector('.stud-benefits__card--3-2'),
    p41: section.querySelector('.stud-benefits__card--3-3'),
    card7: section.querySelector('.stud-benefits__card--4-1'),
    p72: section.querySelector('.stud-benefits__card--4-2'),
    p71: section.querySelector('.stud-benefits__card--4-3'),
    card3: section.querySelector('.stud-benefits__card--5-1'),
    p31: section.querySelector('.stud-benefits__card--5-2'),
    p32: section.querySelector('.stud-benefits__card--5-3')
  };
  var CARD_KEYS = Object.keys(CARD_MAP); // Desktop states (exact Figma Component 45 variants: 0 entry pose, 1..5 landing steps, 6 exit pose)

  var DESK_STATES = [{
    p11: [48, 574, 0],
    card1: [163, 220, 0],
    p12: [933, 187, 0]
  }, {
    p11: [48, 416, 1],
    card2: [965, 275, 0],
    card1: [163, 180, 1],
    p22: [163, 656, 0],
    p12: [933, 147, 1],
    p21: [1163, 592, 0]
  }, {
    p12: [933, 127, 0],
    p42: [48, 91, 0],
    card1: [163, 35, 0],
    card2: [965, 125, 1],
    p41: [1233, 456, 0],
    p22: [163, 576, 1],
    card4: [163, 357, 0],
    p21: [1163, 532, 1],
    p11: [48, 386, 0]
  }, {
    p22: [163, 486, 0],
    p41: [1233, 386, 1],
    card2: [965, 5, 0],
    card4: [163, 337, 1],
    card7: [1025, 415, 0],
    p71: [1233, 267, 0],
    p72: [233, 157, 0],
    p42: [48, 61, 1],
    p21: [1163, 318, 0]
  }, {
    p41: [1233, 336, 0],
    p31: [965, 236, 0],
    p32: [277, 632, 0],
    card4: [163, 267, 0],
    card7: [1025, 306, 1],
    p72: [233, 77, 1],
    p71: [1233, 121, 1],
    card3: [48, 220, 0],
    p42: [48, 1, 0]
  }, {
    card3: [48, 70, 1],
    p31: [965, 111, 1],
    p32: [277, 494, 1],
    p71: [1233, 66, 0],
    p72: [233, 17, 0],
    card7: [1025, 236, 0]
  }, {
    p32: [277, 375, 0],
    p72: [233, 17, 0],
    card3: [48, 0, 0],
    p31: [965, 31, 0],
    card7: [1025, 136, 0]
  }];

  function fromGroups(groups, IN, OUT) {
    var st = [];

    var pose = function pose(cur) {
      var o = {};
      groups.forEach(function (g, gi) {
        for (var _i2 = 0, _Object$entries = Object.entries(g); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
              id = _Object$entries$_i[0],
              _Object$entries$_i$ = _slicedToArray(_Object$entries$_i[1], 2),
              x = _Object$entries$_i$[0],
              y = _Object$entries$_i$[1];

          o[id] = gi === cur ? [x, y, 1] : gi < cur ? [x, y - OUT, 0] : [x, y + IN, 0];
        }
      });
      return o;
    };

    for (var c = -1; c <= groups.length; c++) {
      st.push(pose(c));
    }

    return st;
  } // Tablet states (768x946 frame: IN 120, OUT 140)


  var TAB_STATES = fromGroups([{
    card1: [86, 80],
    p12: [558, 188],
    p11: [24, 736]
  }, {
    card2: [544, 147],
    p22: [58, 579],
    p21: [484, 763]
  }, {
    p42: [56, 97],
    card4: [46, 613],
    p41: [620, 276]
  }, {
    card7: [396, 617],
    p72: [116, 186],
    p71: [624, 394]
  }, {
    card3: [56, 51],
    p31: [498, 243],
    p32: [150, 737]
  }], 120, 140); // Mobile states (375x710 frame: IN 90, OUT 110)

  var MOB_STATES = fromGroups([{
    card1: [28, 32],
    p12: [232, 132],
    p21: [20, 440],
    card2: [207, 477],
    p22: [91, 550]
  }, {
    card3: [20, 82],
    card7: [212, 21],
    p41: [263, 439],
    card4: [32, 504],
    p42: [203, 534]
  }], 90, 110);

  function resolveStates(states) {
    var out = states.map(function () {
      return {};
    });

    var _loop = function _loop() {
      var id = _CARD_KEYS[_i3];
      var first = states.findIndex(function (s) {
        return s[id];
      });
      var last = null;
      states.forEach(function (s, i) {
        if (s[id]) {
          last = s[id];
          out[i][id] = s[id];
        } else if (last) {
          out[i][id] = [last[0], last[1], 0];
        } else if (first >= 0) {
          var f = states[first][id];
          out[i][id] = [f[0], f[1], 0];
        } else {
          out[i][id] = null;
        }
      });
    };

    for (var _i3 = 0, _CARD_KEYS = CARD_KEYS; _i3 < _CARD_KEYS.length; _i3++) {
      _loop();
    }

    return out;
  }

  var RESOLVED = {
    d: resolveStates(DESK_STATES),
    t: resolveStates(TAB_STATES),
    m: resolveStates(MOB_STATES)
  };

  var bp = function bp() {
    return window.innerWidth > 992 ? 'd' : window.innerWidth > 600 ? 't' : 'm';
  };

  function updateBenefitsScale() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var W = 1440,
        H = 800;

    if (vw <= 600) {
      W = 375;
      H = 710;
    } else if (vw <= 992) {
      W = 768;
      H = 946;
    }

    var scale = Math.min(vw / W, vh / H, 1);
    stage.style.setProperty('--benefits-scale', Math.max(0.35, scale));
  }

  function getLandingStepsCount() {
    return bp() === 'm' ? 2 : 5;
  }

  function getStepHeight() {
    return window.innerWidth <= 600 ? Math.max(350, window.innerHeight * 0.6) : window.innerWidth <= 992 ? Math.max(400, window.innerHeight * 0.65) : Math.max(450, window.innerHeight * 0.7);
  }

  var STEP_BUFFER = 40;
  var currentStateIndex = 0;
  var currentStep = 0;
  var isAnimating = false;
  var isWheelLocked = false;
  var stepHeight = getStepHeight();
  var totalSteps = getLandingStepsCount();
  var totalDistance = (totalSteps - 1) * stepHeight + STEP_BUFFER * 2;

  function renderWhyState(targetIndex) {
    var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var b = bp();
    var states = RESOLVED[b];
    var targetState = states[targetIndex];
    if (!targetState) return;
    var prevState = states[currentStateIndex] || targetState;
    currentStateIndex = targetIndex;
    var isMobile = b === 'm';
    var staggerOrder = 0;
    CARD_KEYS.forEach(function (id) {
      var el = CARD_MAP[id];
      if (!el) return;
      var v = targetState[id];

      if (!v) {
        el.style.display = 'none';
        return;
      }

      el.style.display = '';
      var prevV = prevState[id];
      var isEntering = animate && isMobile && v[2] === 1 && (!prevV || prevV[2] === 0);
      var delay = isEntering ? staggerOrder++ * 0.11 : 0;
      gsap.killTweensOf(el);

      if (!animate) {
        gsap.set(el, {
          x: v[0],
          y: v[1],
          opacity: v[2],
          pointerEvents: v[2] > 0 ? 'auto' : 'none'
        });
      } else {
        gsap.to(el, {
          x: v[0],
          y: v[1],
          opacity: v[2],
          duration: 0.6,
          delay: delay,
          ease: 'power2.out',
          onStart: function onStart() {
            if (v[2] > 0) el.style.pointerEvents = 'auto';
          },
          onComplete: function onComplete() {
            if (v[2] === 0) el.style.pointerEvents = 'none';
          }
        });
      }
    });
  }

  var st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=' + totalDistance,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onEnter: function onEnter() {
      currentStep = 0;
      renderWhyState(1, true);
    },
    onEnterBack: function onEnterBack() {
      var exitState = RESOLVED[bp()].length - 1;
      currentStep = totalSteps - 1;
      renderWhyState(exitState - 1, true);
    },
    onLeave: function onLeave() {
      var exitState = RESOLVED[bp()].length - 1;
      renderWhyState(exitState, true);
      currentStep = totalSteps - 1;
    },
    onLeaveBack: function onLeaveBack() {
      if (!isWheelLocked) {
        renderWhyState(0, true);
        currentStep = 0;
      }
    },
    onUpdate: function onUpdate(self) {
      if (isWheelLocked) return;
      var offset = self.scroll() - st.start - STEP_BUFFER;
      var rawStep = Math.round(offset / stepHeight);
      rawStep = Math.max(0, Math.min(totalSteps - 1, rawStep));

      if (rawStep !== currentStep) {
        currentStep = rawStep;
        renderWhyState(currentStep + 1, true);
      }
    }
  });

  var easeInOutCubic = function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  function scrollToY(targetY) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 650;
    var onComplete = arguments.length > 2 ? arguments[2] : undefined;
    var startY = window.pageYOffset || document.documentElement.scrollTop;
    var distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      window.scrollTo(0, targetY);
      if (onComplete) onComplete();
      return;
    }

    isAnimating = true;
    isWheelLocked = true;
    var startTime = performance.now();

    function step(now) {
      var elapsed = now - startTime;
      var progress = Math.min(1, elapsed / duration);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        setTimeout(function () {
          isAnimating = false;
          isWheelLocked = false;
          if (onComplete) onComplete();
        }, 50);
      }
    }

    requestAnimationFrame(step);
  }

  function getSectionTop() {
    return st && typeof st.start === 'number' && st.start > 0 ? st.start : section.offsetTop;
  }

  function getStepScroll(step) {
    var sectionTop = getSectionTop();
    return sectionTop + STEP_BUFFER + step * stepHeight;
  }

  function getNextSectionScroll() {
    if (typeof ScrollTrigger !== 'undefined') {
      var triggers = ScrollTrigger.getAll();

      for (var i = 0; i < triggers.length; i++) {
        var trig = triggers[i];

        if (trig && trig !== st && trig.trigger && trig.trigger.classList && trig.trigger.classList.contains('practice-tabs')) {
          if (typeof trig.start === 'number' && trig.start > 0) {
            return trig.start + 30;
          }
        }
      }
    }

    var end = st && typeof st.end === 'number' && st.end > 0 ? st.end : getSectionTop() + totalDistance;
    return end + 30;
  }

  function isInHeroSection(scrollY) {
    var heroSection = document.querySelector('.school-hero');
    if (!heroSection) return false;
    var sectionTop = getSectionTop();
    return scrollY < sectionTop - 10;
  }

  function goToStep(targetStep) {
    if (targetStep === currentStep) return;
    currentStep = targetStep;
    isAnimating = true;
    isWheelLocked = true;
    renderWhyState(currentStep + 1, true);
    var targetScroll = getStepScroll(currentStep);
    window.scrollTo({
      top: targetScroll,
      behavior: 'auto'
    });
    setTimeout(function () {
      isAnimating = false;
      isWheelLocked = false;
    }, 600);
  }

  function handleWheel(e) {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var delta = e.deltaY;
    if (Math.abs(delta) < 15) return;

    if (isAnimating || isWheelLocked) {
      e.preventDefault();
      return;
    }

    var sectionTop = getSectionTop();
    var sectionEnd = st ? st.end : sectionTop + totalDistance;
    var inHero = isInHeroSection(scrollY);
    var isAtPin = scrollY >= sectionTop - 10 && scrollY <= sectionEnd + 10;

    if (inHero) {
      if (delta > 0) {
        // Scrolling down from hero: jump to stud-benefits in ONE gesture
        e.preventDefault();
        currentStep = 0;
        renderWhyState(0, false);
        renderWhyState(1, true);
        scrollToY(getStepScroll(0), 650);
      }

      return;
    }

    if (!isAtPin) return;

    if (delta > 0) {
      // Scrolling down inside stud-benefits
      if (currentStep < totalSteps - 1) {
        e.preventDefault();
        goToStep(currentStep + 1);
      } else {
        // At last step: transition to next section (practice-tabs) in ONE gesture!
        e.preventDefault();
        var exitState = RESOLVED[bp()].length - 1;
        renderWhyState(exitState, true);
        scrollToY(getNextSectionScroll(), 650);
      }
    } else {
      // Scrolling up inside stud-benefits
      if (currentStep > 0) {
        e.preventDefault();
        goToStep(currentStep - 1);
      } else {
        // At first step: scrolling up returns to hero in ONE gesture
        e.preventDefault();
        renderWhyState(0, true);
        scrollToY(0, 650);
      }
    }
  }

  window.addEventListener('wheel', handleWheel, {
    passive: false
  });

  function handleKey(e) {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (isAnimating || isWheelLocked) return;
    var sectionTop = getSectionTop();
    var sectionEnd = st ? st.end : sectionTop + totalDistance;
    var inHero = isInHeroSection(scrollY);
    var isAtPin = scrollY >= sectionTop - 10 && scrollY <= sectionEnd + 10;

    if (inHero) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        currentStep = 0;
        renderWhyState(0, false);
        renderWhyState(1, true);
        scrollToY(getStepScroll(0), 650);
      }

      return;
    }

    if (!isAtPin) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (currentStep < totalSteps - 1) {
        e.preventDefault();
        goToStep(currentStep + 1);
      } else {
        e.preventDefault();
        var exitState = RESOLVED[bp()].length - 1;
        renderWhyState(exitState, true);
        scrollToY(getNextSectionScroll(), 650);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentStep > 0) {
        e.preventDefault();
        goToStep(currentStep - 1);
      } else {
        e.preventDefault();
        renderWhyState(0, true);
        scrollToY(0, 650);
      }
    }
  }

  window.addEventListener('keydown', handleKey);
  var touchStartY = 0;
  var touchStartX = 0;

  function handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (isAnimating || isWheelLocked) return;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var sectionTop = getSectionTop();
    var sectionEnd = st ? st.end : sectionTop + totalDistance;
    var inHero = isInHeroSection(scrollY);
    var isAtPin = scrollY >= sectionTop - 10 && scrollY <= sectionEnd + 10;
    var dy = touchStartY - e.changedTouches[0].clientY;
    var dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx)) return;

    if (inHero) {
      if (dy > 0) {
        // Swiping up (moving down to stud-benefits)
        currentStep = 0;
        renderWhyState(0, false);
        renderWhyState(1, true);
        scrollToY(getStepScroll(0), 650);
      }

      return;
    }

    if (!isAtPin) return;

    if (dy > 0) {
      if (currentStep < totalSteps - 1) {
        goToStep(currentStep + 1);
      } else {
        var exitState = RESOLVED[bp()].length - 1;
        renderWhyState(exitState, true);
        scrollToY(getNextSectionScroll(), 650);
      }
    } else {
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      } else {
        renderWhyState(0, true);
        scrollToY(0, 650);
      }
    }
  }

  window.addEventListener('touchstart', handleTouchStart, {
    passive: true
  });
  window.addEventListener('touchend', handleTouchEnd, {
    passive: true
  });

  function handleResize() {
    updateBenefitsScale();
    totalSteps = getLandingStepsCount();
    stepHeight = getStepHeight();
    totalDistance = (totalSteps - 1) * stepHeight + STEP_BUFFER * 2;
    st.vars.end = '+=' + totalDistance;
    st.refresh();

    if (currentStep >= totalSteps) {
      currentStep = totalSteps - 1;
    }

    renderWhyState(currentStep + 1, false);
  }

  window.addEventListener('resize', handleResize); // Initial setup

  updateBenefitsScale();
  renderWhyState(0, false);
}); // ==========================================
// Practice-tabs pinned scroll tab animation (all screens)
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  var section = document.querySelector('.practice-tabs');
  if (!section) return;
  var tabBtns = Array.from(section.querySelectorAll('.practice-tabs__btn'));
  var tabs = Array.from(section.querySelectorAll('.practice-tabs__tab'));
  var tabBody = section.querySelector('.practice-tabs__body');
  var tabsCount = tabs.length;
  if (!tabsCount) return;
  var currentStep = 0;
  var currentTabIndex = 0;
  var isAnimating = false;
  var isWheelLocked = false;
  var isClickScrolling = false;
  var clickScrollTimeout = null; // Initialize tabs visibility and positions

  tabs.forEach(function (tab, i) {
    var items = tab.querySelectorAll('.practice-tabs__benefit .section-label, .practice-tabs__benefit .practice-tabs__text');
    gsap.set(items, {
      y: 0,
      opacity: 1
    });
    var img = tab.querySelector('.practice-tabs__img');
    if (img) gsap.set(img, {
      yPercent: 0,
      opacity: 1
    });
    var info = tab.querySelector('.practice-tabs__info');
    if (info) gsap.set(info, {
      yPercent: 0,
      opacity: 1
    });

    if (i === 0) {
      tab.classList.add('active');
      gsap.set(tab, {
        opacity: 1,
        visibility: 'visible',
        yPercent: 0,
        zIndex: 1
      });
    } else {
      tab.classList.remove('active');
      gsap.set(tab, {
        opacity: 0,
        visibility: 'hidden',
        yPercent: 0,
        zIndex: 0
      });
    }
  });

  function getStepHeight() {
    return window.innerWidth <= 992 ? Math.max(350, window.innerHeight * 0.6) : Math.max(500, window.innerHeight * 0.7);
  }

  function getTopHoldDistance() {
    return window.innerWidth <= 992 ? Math.max(350, window.innerHeight * 0.55) : Math.max(450, window.innerHeight * 0.65);
  }

  var stepHeight = getStepHeight();
  var topHoldDistance = getTopHoldDistance();
  var totalDistance = topHoldDistance + (tabsCount - 1) * stepHeight + stepHeight * 0.5;

  function getTabScroll(index) {
    if (index === 0) {
      return st.start + topHoldDistance * 0.7;
    }

    return st.start + topHoldDistance + (index - 0.5) * stepHeight;
  }

  function switchTab(nextIndex, direction, explicitPrevIndex) {
    if (nextIndex < 0 || nextIndex >= tabsCount) return;
    var prevIndex = explicitPrevIndex !== undefined ? explicitPrevIndex : currentTabIndex;
    if (nextIndex === prevIndex && tabs[nextIndex].classList.contains('active')) return;
    currentTabIndex = nextIndex;
    currentStep = nextIndex;
    hoveredTabIndex = null;
    var isDown = direction !== undefined ? direction > 0 : nextIndex > prevIndex;
    var prevTab = tabs[prevIndex];
    var nextTab = tabs[nextIndex]; // Update buttons

    tabBtns.forEach(function (btn, i) {
      btn.classList.toggle('active', i === nextIndex);

      if (i === nextIndex) {
        btn.classList.remove('hovered');
      }
    });

    if (tabBody) {
      tabBody.classList.remove('blurred');
    }

    if (window.innerWidth <= 992 && tabBtns[nextIndex]) {
      tabBtns[nextIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    } // Directional slide:
    // Scrolling down (isDown):
    //   - nextTab appears снизу вверх: from inY = +100% to 0
    //   - prevTab disappears снизу вверх: from 0 to outY = -100%
    //   - nextTab benefit items appear снизу вверх: from +40px to 0 with opacity 0 -> 1
    //   - prevTab benefit items disappear снизу вверх: from 0 to -40px with opacity 1 -> 0
    // Scrolling up (!isDown):
    //   - nextTab appears сверху вниз: from inY = -100% to 0
    //   - prevTab disappears сверху вниз: from 0 to outY = +100%
    //   - nextTab benefit items appear сверху вниз: from -40px to 0 with opacity 0 -> 1
    //   - prevTab benefit items disappear сверху вниз: from 0 to +40px with opacity 1 -> 0


    var inY = isDown ? 100 : -100;
    var outY = isDown ? -100 : 100;
    var itemInY = isDown ? 40 : -40;
    var itemOutY = isDown ? -40 : 40;
    gsap.killTweensOf(tabs);
    var allImgs = section.querySelectorAll('.practice-tabs__img');
    gsap.killTweensOf(allImgs);
    var allInfos = section.querySelectorAll('.practice-tabs__info');
    gsap.killTweensOf(allInfos); // Hide any other inactive tabs

    tabs.forEach(function (tab, i) {
      if (i !== prevIndex && i !== nextIndex) {
        tab.classList.remove('active');
        gsap.set(tab, {
          opacity: 0,
          visibility: 'hidden',
          yPercent: 0,
          zIndex: 0
        });
        var otherImg = tab.querySelector('.practice-tabs__img');
        if (otherImg) gsap.set(otherImg, {
          yPercent: 0,
          opacity: 1
        });
        var otherInfo = tab.querySelector('.practice-tabs__info');
        if (otherInfo) gsap.set(otherInfo, {
          yPercent: 0,
          opacity: 1
        });
        var otherItems = tab.querySelectorAll('.practice-tabs__benefit .section-label, .practice-tabs__benefit .practice-tabs__text');
        gsap.killTweensOf(otherItems);
        gsap.set(otherItems, {
          y: 0,
          opacity: 1
        });
      }
    });
    var nextItems = nextTab.querySelectorAll('.practice-tabs__benefit .section-label, .practice-tabs__benefit .practice-tabs__text');
    gsap.killTweensOf(nextItems);
    gsap.set(nextItems, {
      y: itemInY,
      opacity: 0
    });
    var nextImg = nextTab.querySelector('.practice-tabs__img');
    var prevImg = prevTab ? prevTab.querySelector('.practice-tabs__img') : null;
    var nextInfo = nextTab.querySelector('.practice-tabs__info');
    var prevInfo = prevTab ? prevTab.querySelector('.practice-tabs__info') : null; // Prepare incoming tab

    nextTab.classList.add('active');
    gsap.set(nextTab, {
      visibility: 'visible',
      pointerEvents: 'auto',
      zIndex: 2,
      opacity: 1,
      yPercent: 0
    }); // Animate incoming img into place

    if (nextImg) {
      gsap.set(nextImg, {
        opacity: 0,
        yPercent: inY
      });
      gsap.to(nextImg, {
        yPercent: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out'
      });
    } // Animate incoming info into place


    if (nextInfo) {
      gsap.set(nextInfo, {
        opacity: 0,
        yPercent: inY
      });
      gsap.to(nextInfo, {
        yPercent: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out'
      });
    } // Animate incoming benefit items (снизу вверх when isDown, сверху вниз when !isDown)


    gsap.to(nextItems, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      delay: 0.1,
      stagger: 0.03,
      ease: 'power2.out'
    }); // Animate outgoing tab out of view

    if (prevTab && prevTab !== nextTab) {
      var prevItems = prevTab.querySelectorAll('.practice-tabs__benefit .section-label, .practice-tabs__benefit .practice-tabs__text');
      gsap.killTweensOf(prevItems); // Animate outgoing benefit items (исчезают снизу вверх when isDown, уходят сверху вниз when !isDown)

      gsap.to(prevItems, {
        y: itemOutY,
        opacity: 0,
        duration: 0.45,
        stagger: 0.02,
        ease: 'power2.in'
      });
      gsap.set(prevTab, {
        zIndex: 1,
        pointerEvents: 'none'
      }); // Animate outgoing img out of view

      if (prevImg) {
        gsap.to(prevImg, {
          yPercent: outY,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          onComplete: function onComplete() {
            prevTab.classList.remove('active');
            gsap.set(prevTab, {
              visibility: 'hidden',
              yPercent: 0,
              zIndex: 0
            });
            gsap.set(prevItems, {
              y: 0,
              opacity: 1
            });
            gsap.set(prevImg, {
              yPercent: 0,
              opacity: 1
            });
            if (prevInfo) gsap.set(prevInfo, {
              yPercent: 0,
              opacity: 1
            });
          }
        });
      } else {
        prevTab.classList.remove('active');
        gsap.set(prevTab, {
          visibility: 'hidden',
          yPercent: 0,
          zIndex: 0
        });
        gsap.set(prevItems, {
          y: 0,
          opacity: 1
        });
        if (prevInfo) gsap.set(prevInfo, {
          yPercent: 0,
          opacity: 1
        });
      } // Animate outgoing info out of view


      if (prevInfo) {
        gsap.to(prevInfo, {
          yPercent: outY,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out'
        });
      }
    }

    if (typeof window.updatePracticeSliders === 'function') {
      window.updatePracticeSliders();
    }
  } // ScrollTrigger for pinning on all screen sizes


  var st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=' + totalDistance,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onEnter: function onEnter() {
      if (currentStep !== 0) {
        var prev = currentStep;
        switchTab(0, 1, prev);
      }
    },
    onEnterBack: function onEnterBack() {
      if (currentStep !== tabsCount - 1) {
        var prev = currentStep;
        switchTab(tabsCount - 1, -1, prev);
      }
    },
    onLeave: function onLeave() {
      if (currentStep !== tabsCount - 1) {
        var prev = currentStep;
        switchTab(tabsCount - 1, 1, prev);
      }
    },
    onLeaveBack: function onLeaveBack() {
      if (currentStep !== 0) {
        var prev = currentStep;
        switchTab(0, -1, prev);
      }
    },
    onUpdate: function onUpdate(self) {
      if (isWheelLocked || isClickScrolling) return;
      var currentOffset = self.scroll() - st.start;
      var rawStep = 0;

      if (currentOffset < topHoldDistance) {
        rawStep = 0;
      } else {
        var afterTop = currentOffset - topHoldDistance;
        rawStep = Math.min(tabsCount - 1, 1 + Math.floor(afterTop / stepHeight));
      }

      rawStep = Math.max(0, Math.min(tabsCount - 1, rawStep));

      if (rawStep !== currentStep) {
        var dir = self.direction || (rawStep > currentStep ? 1 : -1);
        var prev = currentStep;
        switchTab(rawStep, dir, prev);
      }
    }
  });

  function goToStep(targetStep, direction) {
    if (targetStep === currentStep) return;
    var dir = direction !== undefined ? direction : targetStep > currentStep ? 1 : -1;
    var prev = currentStep;
    currentStep = targetStep;
    isAnimating = true;
    isWheelLocked = true;
    switchTab(currentStep, dir, prev);
    var targetScroll = getTabScroll(currentStep);
    window.scrollTo({
      top: targetScroll,
      behavior: 'auto'
    });
    setTimeout(function () {
      isAnimating = false;
      isWheelLocked = false;
    }, 550);
  }

  function handleWheel(e) {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var isAtPin = scrollY >= st.start - 5 && scrollY <= st.end + 5;
    if (!isAtPin) return;
    var delta = e.deltaY;
    if (Math.abs(delta) < 15) return;

    if (isAnimating) {
      e.preventDefault();
      return;
    }

    if (delta > 0) {
      // Scrolling down
      if (currentStep < tabsCount - 1) {
        e.preventDefault();
        goToStep(currentStep + 1, 1);
      } // At last tab: let natural scroll proceed to next section

    } else {
      // Scrolling up
      if (currentStep > 0) {
        e.preventDefault();
        goToStep(currentStep - 1, -1);
      } else {
        // At first tab: keep section pinned until user scrolls through the top hold distance
        if (scrollY > st.start + 30) {
          e.preventDefault();
          window.scrollTo({
            top: st.start,
            behavior: 'auto'
          });
        }
      }
    }
  }

  window.addEventListener('wheel', handleWheel, {
    passive: false
  });

  function handleKey(e) {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var isAtPin = scrollY >= st.start - 5 && scrollY <= st.end + 5;
    if (!isAtPin) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (currentStep < tabsCount - 1) {
        e.preventDefault();
        if (!isAnimating) goToStep(currentStep + 1, 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentStep > 0) {
        e.preventDefault();
        if (!isAnimating) goToStep(currentStep - 1, -1);
      }
    }
  }

  window.addEventListener('keydown', handleKey); // Tab buttons click:
  // "по клику на practice-tabs__btn переключение табов оставляем, но сохраняем автоматическую прокрутку с задержкой в 100ms"

  tabBtns.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
      hoveredTabIndex = null;

      if (tabBody) {
        tabBody.classList.remove('blurred');
      }

      if (index === currentStep) return;
      var dir = index > currentStep ? 1 : -1;
      var prev = currentStep;
      switchTab(index, dir, prev); // Automatic scroll with 100ms delay

      clearTimeout(clickScrollTimeout);
      clickScrollTimeout = setTimeout(function () {
        isClickScrolling = true;
        isWheelLocked = true;
        isAnimating = true;
        var targetScroll = getTabScroll(index);
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
        setTimeout(function () {
          isClickScrolling = false;
          isWheelLocked = false;
          isAnimating = false;
        }, 600);
      }, 100);
    });
  }); // Hover preview on desktop:

  var hoveredTabIndex = null;
  tabBtns.forEach(function (btn, index) {
    var img = btn.querySelector('img');
    if (!img) return;

    function handleEnter() {
      if (window.innerWidth < 992) return;
      btn.classList.add('hovered');

      if (tabBody) {
        tabBody.classList.add('blurred');
      } // If hovering over a tab that is not the currently active tab:


      if (index !== currentTabIndex) {
        if (hoveredTabIndex !== null && hoveredTabIndex !== index && hoveredTabIndex !== currentTabIndex) {
          var prevHoverTab = tabs[hoveredTabIndex];

          if (prevHoverTab) {
            gsap.killTweensOf(prevHoverTab);
            gsap.to(prevHoverTab, {
              opacity: 0,
              duration: 0.35,
              ease: 'power2.out',
              onComplete: function onComplete() {
                if (hoveredTabIndex !== currentTabIndex) {
                  gsap.set(prevHoverTab, {
                    visibility: 'hidden',
                    zIndex: 0
                  });
                }
              }
            });
          }
        }

        hoveredTabIndex = index;
        var hoverTab = tabs[index];
        if (!hoverTab) return;
        var hoverItems = hoverTab.querySelectorAll('.practice-tabs__benefit .section-label, .practice-tabs__benefit .practice-tabs__text');
        gsap.killTweensOf(hoverItems);
        gsap.set(hoverItems, {
          y: 0,
          opacity: 1
        });
        var hoverImg = hoverTab.querySelector('.practice-tabs__img');

        if (hoverImg) {
          gsap.killTweensOf(hoverImg);
          gsap.set(hoverImg, {
            yPercent: 0,
            opacity: 1
          });
        }

        var hoverInfo = hoverTab.querySelector('.practice-tabs__info');

        if (hoverInfo) {
          gsap.killTweensOf(hoverInfo);
          gsap.set(hoverInfo, {
            yPercent: 0,
            opacity: 1
          });
        }

        gsap.killTweensOf(hoverTab);
        gsap.set(hoverTab, {
          visibility: 'visible',
          pointerEvents: 'none',
          yPercent: 0,
          zIndex: 3
        });
        gsap.to(hoverTab, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }

    function handleLeave(e) {
      if (window.innerWidth < 992) return;
      if (e && e.relatedTarget && btn.contains(e.relatedTarget)) return;
      btn.classList.remove('hovered');

      if (tabBody) {
        tabBody.classList.remove('blurred');
      }

      if (index !== currentTabIndex) {
        if (hoveredTabIndex === index) {
          hoveredTabIndex = null;
        }

        var hoverTab = tabs[index];
        if (!hoverTab) return;
        var hoverItems = hoverTab.querySelectorAll('.practice-tabs__benefit .section-label, .practice-tabs__benefit .practice-tabs__text');
        gsap.killTweensOf(hoverItems);
        gsap.set(hoverItems, {
          y: 0,
          opacity: 1
        });
        var hoverImg = hoverTab.querySelector('.practice-tabs__img');

        if (hoverImg) {
          gsap.killTweensOf(hoverImg);
          gsap.set(hoverImg, {
            yPercent: 0,
            opacity: 1
          });
        }

        var hoverInfo = hoverTab.querySelector('.practice-tabs__info');

        if (hoverInfo) {
          gsap.killTweensOf(hoverInfo);
          gsap.set(hoverInfo, {
            yPercent: 0,
            opacity: 1
          });
        }

        gsap.killTweensOf(hoverTab);
        gsap.to(hoverTab, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: function onComplete() {
            if (index !== currentTabIndex) {
              gsap.set(hoverTab, {
                visibility: 'hidden',
                zIndex: 0
              });
            }
          }
        });
      }
    }

    img.addEventListener('mouseenter', handleEnter);
    img.addEventListener('mouseleave', handleLeave);
    btn.addEventListener('mouseleave', handleLeave);
  });

  function handleResize() {
    stepHeight = getStepHeight();
    topHoldDistance = getTopHoldDistance();
    totalDistance = topHoldDistance + (tabsCount - 1) * stepHeight + stepHeight * 0.5;
    st.vars.end = '+=' + totalDistance;
    st.refresh();
  }

  window.addEventListener('resize', handleResize);
}); // ==========================================
// Practice Hero scroll animation (Figma Step 1 -> Step 2)
// Fullscreen video shrinks to 426x240, text and breadcrumbs change color,
// and button «Подать заявку на практику» fades in.
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  var heroSection = document.querySelector('.practice-hero');

  if (heroSection) {
    var videoContainer = heroSection.querySelector('.practice-hero__video');
    var videoOverlay = heroSection.querySelector('.practice-hero__video-overlay');
    var heroVideo = heroSection.querySelector('.practice-hero__video video');
    var slot = heroSection.querySelector('.practice-hero__slot');
    var btn = heroSection.querySelector('.practice-hero__btn');
    var label = heroSection.querySelector('.practice-hero__content .section-label');
    var title = heroSection.querySelector('.practice-hero__content .section-title h2, .practice-hero__content .section-title h1');
    var descr = heroSection.querySelector('.practice-hero__descr');
    var breadcrumbsItems = heroSection.querySelectorAll('.breadcrumbs-item');
    var header = document.querySelector('header.header');

    if (heroVideo) {
      heroVideo.controls = false;
      heroVideo.removeAttribute('controls');
      heroVideo.addEventListener('play', function () {
        this.controls = false;
        this.removeAttribute('controls');
      });
    }

    if (videoContainer && slot) {
      var setupHeroAnimation = function setupHeroAnimation(scrollDistance) {
        function getSlotTop() {
          var slotRect = slot.getBoundingClientRect();
          var heroRect = heroSection.getBoundingClientRect();
          return slotRect.top - heroRect.top;
        }

        function getSlotWidth() {
          return slot.getBoundingClientRect().width;
        }

        function getSlotHeight() {
          return slot.getBoundingClientRect().height;
        } // Set initial states (Step 1)


        gsap.set(videoContainer, {
          top: 0,
          left: '50%',
          xPercent: -50,
          width: '100%',
          height: '100%',
          borderRadius: 0
        });
        if (heroVideo) gsap.set(heroVideo, {
          borderRadius: 0
        });
        if (videoOverlay) gsap.set(videoOverlay, {
          opacity: 1
        });
        if (btn) gsap.set(btn, {
          opacity: 0,
          y: 14,
          pointerEvents: 'none'
        });
        if (descr) gsap.set(descr, {
          opacity: 0,
          y: 14
        });
        heroSection.classList.remove('practice-hero--scrolled');

        if (header) {
          header.classList.add('header--white');
          header.classList.remove('header--black');
        } // Master scrubbed timeline ("уменьшить видео нужно за один скрол, потом появляется кнопка и practice-hero__descr")


        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '+=' + scrollDistance,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: function onRefresh(self) {
              if (self.spacer) {
                self.spacer.style.removeProperty('z-index');
                self.spacer.style.zIndex = 'auto';
              }
            },
            onUpdate: function onUpdate(self) {
              if (self.progress > 0.35) {
                heroSection.classList.add('practice-hero--scrolled');

                if (header) {
                  header.classList.remove('header--white');
                  header.classList.add('header--black');
                }
              } else {
                heroSection.classList.remove('practice-hero--scrolled');

                if (header) {
                  header.classList.add('header--white');
                  header.classList.remove('header--black');
                }
              }

              if (self.progress <= 1) {
                if (header) {
                  header.classList.remove('header--hidden');
                  header.classList.remove('header--isScrolled');
                }
              }
            }
          }
        });
        window.practiceHeroST = tl.scrollTrigger;

        if (tl.scrollTrigger && tl.scrollTrigger.spacer) {
          tl.scrollTrigger.spacer.style.removeProperty('z-index');
          tl.scrollTrigger.spacer.style.zIndex = 'auto';
        }

        window.isPracticeHeroPinned = function (st) {
          return window.practiceHeroST ? st <= window.practiceHeroST.end : false;
        }; // Phase 1 (0 -> 0.75): Video shrinks smoothly and overlay fades out


        var targetRadius = window.innerWidth <= 992 ? 10 : 8;
        tl.to(videoContainer, {
          top: function top() {
            return getSlotTop();
          },
          width: function width() {
            return getSlotWidth();
          },
          height: function height() {
            return getSlotHeight();
          },
          borderRadius: targetRadius,
          duration: 0.75,
          ease: 'power1.out'
        }, 0);

        if (heroVideo) {
          tl.to(heroVideo, {
            borderRadius: targetRadius,
            duration: 0.75,
            ease: 'power1.out'
          }, 0);
        }

        if (videoOverlay) {
          tl.to(videoOverlay, {
            opacity: 0,
            duration: 0.65,
            ease: 'power1.out'
          }, 0);
        } // Phase 2 (0.65 -> 1.0): Button and description appear smoothly


        if (descr) {
          tl.to(descr, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out'
          }, 0.65);
        }

        if (btn) {
          tl.to(btn, {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.35,
            ease: 'power2.out'
          }, 0.65);
        }

        return function () {
          if (tl.scrollTrigger) tl.scrollTrigger.kill();
          tl.kill();
        };
      };

      ScrollTrigger.matchMedia({
        // Desktop
        '(min-width: 993px)': function minWidth993px() {
          return setupHeroAnimation(360);
        },
        // Tablet
        '(min-width: 601px) and (max-width: 992px)': function minWidth601pxAndMaxWidth992px() {
          return setupHeroAnimation(100);
        },
        // Mobile
        '(max-width: 600px)': function maxWidth600px() {
          return setupHeroAnimation(20);
        }
      });
    }
  } // ==========================================
  // Conditions cards scroll animation (Wolverine Worldwide "A Culture Built For People" reference)
  // Column parallax scrub differential: centered around y = 0 so columns NEVER overlap section title!
  // ==========================================


  var conditionsSection = document.querySelector('.conditions');

  if (conditionsSection) {
    var col1 = conditionsSection.querySelector('.conditions__col:nth-child(1)');
    var col2 = conditionsSection.querySelector('.conditions__col:nth-child(2)');
    var col3 = conditionsSection.querySelector('.conditions__col:nth-child(3)');
    ScrollTrigger.matchMedia({
      '(min-width: 993px)': function minWidth993px() {
        if (col1) {
          gsap.fromTo(col1, {
            y: 110
          }, {
            y: -110,
            ease: 'none',
            scrollTrigger: {
              trigger: conditionsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        if (col2) {
          gsap.fromTo(col2, {
            y: 220
          }, {
            y: -220,
            ease: 'none',
            scrollTrigger: {
              trigger: conditionsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        if (col3) {
          gsap.fromTo(col3, {
            y: 125
          }, {
            y: -125,
            ease: 'none',
            scrollTrigger: {
              trigger: conditionsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }
      },
      '(min-width: 600px) and (max-width: 992px)': function minWidth600pxAndMaxWidth992px() {
        if (col1) {
          gsap.fromTo(col1, {
            y: 45
          }, {
            y: -45,
            ease: 'none',
            scrollTrigger: {
              trigger: conditionsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        if (col2) {
          gsap.fromTo(col2, {
            y: 70
          }, {
            y: -70,
            ease: 'none',
            scrollTrigger: {
              trigger: conditionsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        if (col3) {
          gsap.fromTo(col3, {
            y: 50
          }, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: conditionsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }
      }
    });
  } // ==========================================
  // Candidates scroll animation (Wolverine Worldwide c-showcase reference)
  // No pinning, items appear on scroll into view with anim-up-scale effect
  // ==========================================


  var candidatesSection = document.querySelector('.candidates');

  if (candidatesSection) {
    var candidateItems = candidatesSection.querySelectorAll('.candidates__item');
    var candidateBtn = candidatesSection.querySelector('.candidates__btn');

    if (candidateItems.length) {
      // Set initial hidden state (translateY + scale down + opacity 0)
      gsap.set(candidateItems, {
        opacity: 0,
        y: 40,
        scale: 0.94
      });
      if (candidateBtn) gsap.set(candidateBtn, {
        opacity: 0,
        y: 30,
        scale: 0.95
      }); // Use ScrollTrigger.batch to animate items into view as user scrolls

      ScrollTrigger.batch(candidateItems, {
        start: 'top 85%',
        once: true,
        onEnter: function onEnter(batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });

      if (candidateBtn) {
        ScrollTrigger.create({
          trigger: candidateBtn,
          start: 'top 92%',
          once: true,
          onEnter: function onEnter() {
            gsap.to(candidateBtn, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: 0.15,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });
      }
    }
  } // Ensure all triggers recalculate with pins accounted for


  ScrollTrigger.refresh();
}); // Клик по фильтрам курсов (для планшетов и мобильных)

$('.courses__filter').on('click', function (e) {
  if ($(e.target).closest('.courses__wrapper').length) return;
  if ($(e.target).closest('.courses__filter-clear').length) return;
  $(this).toggleClass('open');
  $(this).siblings('.courses__filter').removeClass('open');
});
$(document).on('click', function (e) {
  if (!$(e.target).closest('.courses__filter').length) {
    $('.courses__filter').removeClass('open');
  }
}); // Получение исходного текста кнопки фильтра

function getInitialFilterLabel($filter) {
  var initial = $filter.attr('data-initial-label');

  if (!initial) {
    initial = $filter.find('.courses__filter-label').text().trim();
    $filter.attr('data-initial-label', initial);
  }

  return initial;
} // Обновление состояния chosen и отображения текста в кнопке фильтра


function updateFilterChosen($filter) {
  var initialText = getInitialFilterLabel($filter);
  var $label = $filter.find('.courses__filter-label');
  var $checked = $filter.find('input[type="checkbox"]:checked');
  var count = $checked.length;
  var checkedOrder = $filter.data('checked-order') || [];
  checkedOrder = checkedOrder.filter(function (cb) {
    return cb.checked && $.contains($filter[0], cb);
  });

  if (count === 0) {
    $filter.removeClass('chosen');
    $label.text(initialText);
    $filter.data('checked-order', []);
  } else {
    $filter.addClass('chosen');
    var firstEl = checkedOrder.length ? checkedOrder[0] : $checked[0];
    var firstText = $(firstEl).closest('.custom-checkbox').find('.custom-checkbox__text').text().trim() || $(firstEl).val();

    if (count === 1) {
      $label.text(firstText);
    } else {
      var extra = count - 1;
      $label.text(firstText + ' +' + extra);
    }
  }

  updateResetAllVisibility();
}

function updateResetAllVisibility() {
  var anyChosen = $('.courses__filter.chosen').length > 0;
  $('.courses__reset-all').toggleClass('visible', anyChosen);
} // Изменение чекбоксов внутри фильтра закоментили, так как на бэке сюда вешается аякс
// $(document).on('change', '.courses__filter input[type="checkbox"]', function() {
//   var $filter = $(this).closest('.courses__filter');
//   var checkedOrder = $filter.data('checked-order') || [];
//   if (this.checked) {
//     if (checkedOrder.indexOf(this) === -1) {
//       checkedOrder.push(this);
//     }
//   } else {
//     var idx = checkedOrder.indexOf(this);
//     if (idx !== -1) {
//       checkedOrder.splice(idx, 1);
//     }
//   }
//   $filter.data('checked-order', checkedOrder);
//   updateFilterChosen($filter);
// });
// Крестик внутри конкретного фильтра — сброс его чекбоксов закоментили, так как на бэке сюда вешается аякс
// $(document).on('click', '.courses__filter-clear', function(e) {
//   e.stopPropagation();
//   var $filter = $(this).closest('.courses__filter');
//   $filter.find('input[type="checkbox"]').prop('checked', false);
//   $filter.data('checked-order', []);
//   $filter.removeClass('chosen open');
//   var initialText = getInitialFilterLabel($filter);
//   $filter.find('.courses__filter-label').text(initialText);
//   updateResetAllVisibility();
// });
// Кнопка сброса всех фильтров закоментили, так как на бэке сюда вешается аякс
// $(document).on('click', '.courses__reset-all', function(e) {
//   e.stopPropagation();
//   $('.courses__filter input[type="checkbox"]').prop('checked', false);
//   $('.courses__filter').each(function() {
//     var $f = $(this);
//     $f.data('checked-order', []);
//     $f.removeClass('chosen open');
//     var initialText = getInitialFilterLabel($f);
//     $f.find('.courses__filter-label').text(initialText);
//   });
//   updateResetAllVisibility();
// });
// Инициализация исходных подписей при загрузке страницы


$('.courses__filter').each(function () {
  getInitialFilterLabel($(this));

  if ($(this).find('input[type="checkbox"]:checked').length > 0) {
    updateFilterChosen($(this));
  }
}); // Форма записи на курс и валидация

var $coursesForm = $('#course-form .form');

var validateCoursesForm = function validateCoursesForm() {};

if ($coursesForm.length) {
  var $submitBtn = $coursesForm.find('button[type="submit"]');
  var $requiredFields = $coursesForm.find('[required]');

  validateCoursesForm = function validateCoursesForm() {
    var isValid = true;
    $requiredFields.each(function () {
      var $el = $(this);

      if ($el.is(':checkbox')) {
        if (!$el.is(':checked')) isValid = false;
      } else {
        if (!$el.val() || !$el.val().trim()) isValid = false;
      }
    });
    $submitBtn.prop('disabled', !isValid);
  };

  $coursesForm.on('input change', '[required]', validateCoursesForm);
  $coursesForm.find('.form__input input[required]').on('blur', function () {
    if (!$(this).val().trim()) {
      $(this).closest('.form__input').find('.form__error').show();
    }
  }).on('input', function () {
    if ($(this).val().trim()) {
      $(this).closest('.form__input').find('.form__error').hide();
    }
  });
  $coursesForm.on('submit', function (e) {
    e.preventDefault();
    validateCoursesForm();
  });
} // Аккордеон карточек курсов


$('.courses__card').on('click', function (e) {
  if ($(e.target).closest('.btn').length || $(e.target).closest('.custom-checkbox').length) {
    return;
  }

  $(this).toggleClass('open');
  $(this).find('.courses__hidden').slideToggle(300);
  $(this).siblings().find('.courses__hidden').slideUp(300);
  $(this).siblings().removeClass('open');

  if ($(window).width() <= 992) {
    $(this).find('.courses__text--main').slideToggle(300);
  }
}); // Клик «Записаться на курс» — скролл и предвыбор курса закоментили, так как на юэке сюда вешается аякс
// $(document).on('click', '.courses__card .courses__hidden .btn', function(e){
//   e.preventDefault();
//   e.stopPropagation();
//   const courseTitle = $(this).closest('.courses__card').find('.courses__title').text().trim();
//   const $targetForm = $('#course-form');
//   if ($targetForm.length) {
//     const $select = $targetForm.find('select[name="course"]');
//     if ($select.length && courseTitle) {
//       const normTitle = courseTitle.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
//       let matchedVal = '';
//       let matchedText = '';
//       $select.find('option').each(function() {
//         const val = $(this).val();
//         const text = $(this).text();
//         if (!val) return;
//         const normVal = val.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
//         const normTxt = text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
//         if (normVal === normTitle || normTxt === normTitle || normTitle.includes(normVal) || normVal.includes(normTitle)) {
//           matchedVal = val;
//           matchedText = text;
//         }
//       });
//       if (matchedVal) {
//         $select.val(matchedVal);
//         const cstSel = $select[0].customSelect || $select.data('customSelect') || ($select[0].parentElement && $select[0].parentElement.customSelect);
//         if (cstSel) {
//           cstSel.value = matchedVal;
//         }
//         const $container = $select.closest('.custom-select-container');
//         const $opener = $container.length ? $container.find('.custom-select-opener') : $select.parent().find('.custom-select-opener');
//         $opener.addClass('chosen');
//         $opener.find('span').text(matchedText || matchedVal);
//         $container.find('.custom-select-option').each(function() {
//           const isMatch = $(this).text().trim() === (matchedText || matchedVal).trim();
//           $(this).toggleClass('is-selected', isMatch);
//         });
//         $select.trigger('change');
//         $select.closest('.form__select').find('.form__error').hide();
//         if (typeof validateCoursesForm === 'function') {
//           validateCoursesForm();
//         }
//       }
//     }
//     $('html, body').animate({
//       scrollTop: $targetForm.offset().top - 40
//     }, 600);
//   }
// });

/* ==========================================================================
   Пошаговая форма: Анкета (Секция .anketa)
   ========================================================================== */

function initAnketa() {
  var $anketa = $('.anketa');
  if (!$anketa.length) return;
  var $wrapper = $anketa.find('.anketa__wrapper');
  var $content = $anketa.find('.anketa__content');
  var $steps = $anketa.find('.anketa__steps');
  var currentStep = 1;
  var totalSteps = 6;
  var allowedExtensions = ['pdf', 'doc', 'docx'];
  var maxFileSize = 10 * 1024 * 1024; // 10 МБ

  function updateStickyScrolled() {
    var targetContent = $content.length ? $content : $anketa.find('.anketa__content');
    var contentEl = targetContent.length ? targetContent[0] : null;
    var targetSteps = $steps.length ? $steps : $anketa.find('.anketa__steps');
    var stepsEl = targetSteps.length ? targetSteps[0] : null;
    var targetWrapper = $wrapper.length ? $wrapper : $anketa.find('.anketa__wrapper');
    var wrapperEl = targetWrapper.length ? targetWrapper[0] : null;
    var hasScrollbar = false;
    var isAtBottom = false; // 1. Проверяем основной скролл-контейнер .anketa__content

    if (contentEl) {
      var $currentStepBottom = $anketa.find('.anketa__step.current .anketa__bottom');
      var isCurrentlySticky = $currentStepBottom.hasClass('sticky-scrolled'); // Если sticky-scrolled уже добавлен, он добавляет вертикальный padding (32px),
      // который искусственно увеличивает scrollHeight. Для корректной проверки
      // наличия скролла учитываем базовую (естественную) высоту контента без этого паддинга.

      var stickyPaddingOffset = isCurrentlySticky ? 32 : 0;
      var naturalScrollHeight = contentEl.scrollHeight - stickyPaddingOffset;
      var parentHeight = stepsEl ? stepsEl.clientHeight : contentEl.clientHeight; // Скроллбар действительно появляется, если естественная высота контента больше высоты родителя .anketa__steps
      // или если естественный scrollHeight блока превышает его clientHeight

      var isOverflowingParent = stepsEl ? naturalScrollHeight > parentHeight + 2 : false;
      var isOverflowingSelf = naturalScrollHeight > contentEl.clientHeight + 2;

      if (isOverflowingParent || isOverflowingSelf) {
        hasScrollbar = true;
        var maxContentScroll = contentEl.scrollHeight - contentEl.clientHeight; // Когда проскролили блок anketa__content до конца (с допуском 5px на дробные пиксели)

        isAtBottom = contentEl.scrollTop >= Math.max(1, maxContentScroll - 5);
      }
    } // 2. Фоллбек для адаптива: если .anketa__content не имеет скролла, проверяем внешний контейнер .anketa__wrapper


    if (!hasScrollbar && wrapperEl) {
      var maxWrapperScroll = wrapperEl.scrollHeight - wrapperEl.clientHeight;

      if (maxWrapperScroll > 2) {
        hasScrollbar = true;
        isAtBottom = wrapperEl.scrollTop >= Math.max(1, maxWrapperScroll - 5);
      }
    } // Класс sticky-scrolled добавляется только если есть скроллбар и блок еще не проскролен до конца


    var shouldBeSticky = hasScrollbar && !isAtBottom;
    var $currentBottom = $anketa.find('.anketa__step.current .anketa__bottom');
    $anketa.find('.anketa__bottom').not($currentBottom).removeClass('sticky-scrolled');
    $currentBottom.toggleClass('sticky-scrolled', shouldBeSticky);
    $anketa.find('.anketa__steps').toggleClass('has-sticky', shouldBeSticky);
  }

  $content.on('scroll', updateStickyScrolled);
  $wrapper.on('scroll', updateStickyScrolled);
  $(window).on('load resize orientationchange', updateStickyScrolled);

  if ($.fn.inputmask) {
    $anketa.find('[data-date-input]').inputmask({
      alias: 'datetime',
      inputFormat: 'dd.mm.yyyy',
      placeholder: 'ДД.ММ.ГГГГ',
      showMaskOnHover: false
    });
  }

  function isValidEmail(val) {
    if (!val) return false;
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(String(val).trim());
  }

  function isValidPhone(val) {
    if (!val) return false;
    var digits = String(val).replace(/\D/g, '');
    return digits.length === 11;
  }

  function isValidDate(val) {
    if (!val) return false;
    var parts = String(val).trim().split('.');
    if (parts.length !== 3) return false;
    var dayStr = parts[0];
    var monthStr = parts[1];
    var yearStr = parts[2];
    if (dayStr.length !== 2 || monthStr.length !== 2 || yearStr.length !== 4) return false;
    var day = parseInt(dayStr, 10);
    var month = parseInt(monthStr, 10);
    var year = parseInt(yearStr, 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    var daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    return true;
  }

  function calculateProgressWidth(ratio) {
    if (ratio >= 1) return '100%';
    if (ratio <= 0) return '8px';
    return "calc(".concat(((1 - ratio) * 8).toFixed(2), "px + ").concat((ratio * 100).toFixed(2), "%)");
  }

  function isFieldFilled($field) {
    if ($field.is(':disabled')) return true;

    if ($field.is('input[type="file"]')) {
      var file = $field[0].files && $field[0].files[0];
      var hasFile = file && file.size > 0 || Boolean($field.val());
      if (!hasFile) return false;

      if (file) {
        var ext = file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(ext) || file.size > maxFileSize) {
          return false;
        }
      }

      return true;
    }

    if ($field.is('input[type="checkbox"]')) {
      return $field.prop('checked');
    }

    if ($field.is('select')) {
      var _val = $field.val();

      if (!_val) {
        var cstSel = $field.data('customSelect') || $field[0] && $field[0].customSelect;

        if (cstSel && cstSel.value) {
          _val = cstSel.value;
        }
      }

      return _val !== null && _val !== undefined && String(_val).trim() !== '';
    }

    var val = String($field.val() || '').trim();

    if ($field.is('[data-date-input]')) {
      return isValidDate(val);
    }

    if ($field.is('[data-tel-input]') || $field.attr('name') === 'phone') {
      return isValidPhone(val);
    }

    if ($field.is('input[type="email"]') || $field.attr('name') === 'email') {
      return isValidEmail(val);
    }

    return val.length > 0;
  }

  function getStepRequiredFields(stepNum) {
    var $step = $anketa.find(".anketa__step[data-step=\"".concat(stepNum, "\"]"));
    return $step.find('input[required], select[required]');
  }

  function updateStepProgress(stepNum) {
    var $fields = getStepRequiredFields(stepNum);
    var total = $fields.length;
    var filled = 0;
    $fields.each(function () {
      if (isFieldFilled($(this))) {
        filled++;
      }
    });
    var ratio = total > 0 ? filled / total : 0;
    var $progressItem = $anketa.find(".anketa__progress[data-progress=\"".concat(stepNum, "\"]"));

    if ($progressItem.hasClass('current')) {
      $progressItem.find('.anketa__progressbar span').css('width', calculateProgressWidth(ratio));
    }

    var $step = $anketa.find(".anketa__step[data-step=\"".concat(stepNum, "\"]"));
    var isComplete = total > 0 && filled === total;
    var $btn = $step.find('.anketa__next, .anketa__submit');
    $btn.prop('disabled', !isComplete);

    if (isComplete) {
      $btn.removeAttr('disabled').removeClass('disabled');
      $progressItem.addClass('filled');
    } else {
      $btn.attr('disabled', 'disabled').addClass('disabled');
      $progressItem.removeClass('filled');
    }
  }

  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > totalSteps) return;

    if (targetStep > currentStep) {
      var $prevProgress = $anketa.find(".anketa__progress[data-progress=\"".concat(currentStep, "\"]"));
      $prevProgress.removeClass('current').addClass('filled');
      $prevProgress.find('.anketa__progressbar span').css('width', '100%');
    } else {
      var $currProgressOld = $anketa.find(".anketa__progress[data-progress=\"".concat(currentStep, "\"]"));
      $currProgressOld.removeClass('current');
      var $fieldsOld = getStepRequiredFields(currentStep);
      var filledOld = 0;
      $fieldsOld.each(function () {
        if (isFieldFilled($(this))) filledOld++;
      });

      if ($fieldsOld.length === 0 || filledOld < $fieldsOld.length) {
        $currProgressOld.removeClass('filled').find('.anketa__progressbar span').css('width', '0%');
      }
    }

    currentStep = targetStep;
    $anketa.find('.anketa__step').removeClass('current');
    var $newStep = $anketa.find(".anketa__step[data-step=\"".concat(currentStep, "\"]"));
    $newStep.addClass('current');
    $anketa.find('.anketa__progress').removeClass('current');
    var $currProgress = $anketa.find(".anketa__progress[data-progress=\"".concat(currentStep, "\"]"));
    $currProgress.addClass('current');
    $newStep.find('.anketa__filelds').scrollTop(0);
    $content.scrollTop(0);
    $wrapper.scrollTop(0);
    updateStepProgress(currentStep);
    updateStickyScrolled();

    if (window.requestAnimationFrame) {
      requestAnimationFrame(updateStickyScrolled);
    }

    setTimeout(updateStickyScrolled, 20);
    setTimeout(updateStickyScrolled, 100);
  }

  $anketa.on('click', '.anketa__next', function (e) {
    e.preventDefault();
    updateStepProgress(currentStep);
    if ($(this).prop('disabled') || $(this).attr('disabled')) return;
    goToStep(currentStep + 1);
  });
  $anketa.on('click', '.anketa__prev', function (e) {
    e.preventDefault();
    goToStep(currentStep - 1);
  }); // Переход на шаг по клику на заполненный пункт прогресса

  $anketa.on('click', '.anketa__progress.filled', function (e) {
    e.preventDefault();
    var targetStep = parseInt($(this).data('progress') || $(this).attr('data-progress'), 10);

    if (targetStep && targetStep !== currentStep && targetStep >= 1 && targetStep <= totalSteps) {
      goToStep(targetStep);
    }
  });
  $anketa.on('input change keyup paste blur', 'input, select', function () {
    updateStepProgress(currentStep);
    updateStickyScrolled();
  }); // Отдельная обработка кликов по элементам кастомного селекта

  $anketa.on('click', '.custom-select-option, .custom-select-opener', function () {
    setTimeout(function () {
      updateStepProgress(currentStep);
      updateStickyScrolled();
    }, 20);
  });
  $anketa.find('select').on('change', function () {
    updateStepProgress(currentStep);
  }); // Валидация Email в реальном времени с выводом ошибок

  $anketa.on('blur', 'input[type="email"], input[name="email"]', function () {
    var val = $(this).val().trim();
    var $err = $(this).closest('.form__input').find('.form__error');

    if (val.length > 0 && !isValidEmail(val)) {
      $err.text('Некорректный формат Email (пример: name@domain.ru)').show();
      $(this).addClass('is-invalid');
    } else if (val.length === 0 && $(this).prop('required')) {
      $err.text('Обязательное поле').show();
      $(this).addClass('is-invalid');
    } else {
      $err.hide();
      $(this).removeClass('is-invalid');
    }
  });
  $anketa.on('input', 'input[type="email"], input[name="email"]', function () {
    var val = $(this).val().trim();

    if (isValidEmail(val)) {
      $(this).closest('.form__input').find('.form__error').hide();
      $(this).removeClass('is-invalid');
    }
  }); // Валидация телефона в реальном времени с выводом ошибок

  $anketa.on('blur', 'input[data-tel-input], input[name="phone"]', function () {
    var val = $(this).val().trim();
    var $err = $(this).closest('.form__input').find('.form__error');

    if (val.length > 0 && !isValidPhone(val)) {
      $err.text('Некорректный номер телефона').show();
      $(this).addClass('is-invalid');
    } else if (val.length === 0 && $(this).prop('required')) {
      $err.text('Обязательное поле').show();
      $(this).addClass('is-invalid');
    } else {
      $err.hide();
      $(this).removeClass('is-invalid');
    }
  });
  $anketa.on('input', 'input[data-tel-input], input[name="phone"]', function () {
    var val = $(this).val().trim();

    if (isValidPhone(val)) {
      $(this).closest('.form__input').find('.form__error').hide();
      $(this).removeClass('is-invalid');
    }
  }); // Валидация даты в реальном времени с выводом ошибок

  $anketa.on('blur', 'input[data-date-input]', function () {
    var val = $(this).val().trim();
    var $err = $(this).closest('.form__input').find('.form__error');

    if (val.length > 0 && !isValidDate(val)) {
      $err.text('Некорректная дата').show();
      $(this).addClass('is-invalid');
    } else if (val.length === 0 && $(this).prop('required')) {
      $err.text('Обязательное поле').show();
      $(this).addClass('is-invalid');
    } else {
      $err.hide();
      $(this).removeClass('is-invalid');
    }
  });
  $anketa.on('input', 'input[data-date-input]', function () {
    var val = $(this).val().trim();

    if (isValidDate(val)) {
      $(this).closest('.form__input').find('.form__error').hide();
      $(this).removeClass('is-invalid');
    }
  }); // Добавление повторяющихся секций (Практика и Образование)

  $anketa.on('click', '.anketa__add-btn', function (e) {
    e.preventDefault();
    var type = $(this).data('add');
    var $repeater = $anketa.find(".anketa__repeater[data-repeater=\"".concat(type, "\"]"));
    var $items = $repeater.find('.anketa__repeat-item');
    var newIndex = $items.length;
    var $first = $items.first();
    var $clone = $first.clone(); // Очистка значений

    $clone.find('input').val('').removeClass('is-invalid');
    $clone.find('.form__error').hide(); // Если клонировали custom-select, убираем созданную разметку плагина и восстанавливаем чистый select

    $clone.find('.custom-select-container').each(function () {
      var $origSelect = $(this).find('select');
      $origSelect.removeClass('custom-select-select is-hidden').val('').prop('selectedIndex', 0);
      $(this).replaceWith($origSelect);
    });

    if (type === 'practice') {
      $clone.find('.anketa__group-title').text("\u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0430 ".concat(newIndex + 1));
      $clone.find('input').each(function () {
        var name = $(this).attr('name');

        if (name) {
          $(this).attr('name', name.replace(/\[\d+\]/, "[".concat(newIndex, "]")));
        }
      });
    } else if (type === 'education') {
      $clone.find('.anketa__group-title').text("\u0423\u0447\u0435\u0431\u043D\u043E\u0435 \u0437\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0435 ".concat(newIndex + 1));
      $clone.find('input, select').each(function () {
        var name = $(this).attr('name');

        if (name) {
          $(this).attr('name', name.replace(/\[\d+\]/, "[".concat(newIndex, "]")));
        }
      });
    }

    $clone.find('.anketa__repeat-remove').show();
    $items.find('.anketa__repeat-remove').show();
    $repeater.append($clone); // Инициализируем маски дат на клоне

    $clone.find('[data-date-input]').inputmask({
      alias: 'datetime',
      inputFormat: 'dd.mm.yyyy',
      placeholder: 'ДД.ММ.ГГГГ',
      showMaskOnHover: false
    }); // Инициализируем custom-select на клоне

    if (typeof customSelect === 'function') {
      $clone.find('select').each(function () {
        var cstSel = customSelect($(this))[0];
        $(this).data('customSelect', cstSel);
      });
    }

    updateStepProgress(currentStep);
    updateStickyScrolled();
    setTimeout(updateStickyScrolled, 30);
  }); // Удаление повторяющейся секции

  $anketa.on('click', '.anketa__repeat-remove', function (e) {
    e.preventDefault();
    var $item = $(this).closest('.anketa__repeat-item');
    var $repeater = $item.closest('.anketa__repeater');
    var type = $repeater.data('repeater');
    $item.remove();
    var $remaining = $repeater.find('.anketa__repeat-item');
    $remaining.each(function (idx) {
      if (type === 'practice') {
        $(this).find('.anketa__group-title').text("\u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0430 ".concat(idx + 1));
      } else if (type === 'education') {
        $(this).find('.anketa__group-title').text("\u0423\u0447\u0435\u0431\u043D\u043E\u0435 \u0437\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0435 ".concat(idx + 1));
      }
    });

    if ($remaining.length <= 1) {
      $remaining.find('.anketa__repeat-remove').hide();
    }

    updateStepProgress(currentStep);
    updateStickyScrolled();
    setTimeout(updateStickyScrolled, 30);
  }); // Отправка формы (без сложной валидации, как запросил пользователь)

  $anketa.find('.anketa__form').on('submit', function (e) {
    e.preventDefault();
    alert('Анкета успешно отправлена!');
  }); // Изначально длина прогрессбара равна 0, а при переходе на шаг становится 8px

  $anketa.find('.anketa__progress .anketa__progressbar span').css('width', '0%');
  updateStepProgress(1); // Сразу при загрузке шага если содержимое превышает высоту контейнера — активируем sticky-scrolled

  updateStickyScrolled();

  if (window.requestAnimationFrame) {
    requestAnimationFrame(updateStickyScrolled);
  }

  setTimeout(updateStickyScrolled, 20);
  setTimeout(updateStickyScrolled, 100);
  setTimeout(updateStickyScrolled, 300);
}

$(function () {
  initAnketa();
});

function anketaBlocksPosition() {
  var headerHeight = $('.header').height();
  var anketaAside = $(document).find('.anketa__aside');
  var anketaSteps = $(document).find('.anketa__steps');
  var anketaSuccess = $(document).find('.anketa__success');

  if ($(window).width() > 1330) {
    if (anketaAside) {
      var anketaAsideHeight = anketaAside.height();
      anketaAside.attr('style', "top: ".concat(headerHeight, "px"));
      anketaSteps.attr('style', "margin-top: -".concat(anketaAsideHeight, "px"));
      anketaSuccess.attr('style', "margin-top: -".concat(anketaAsideHeight, "px"));
    }
  } else {
    anketaAside.removeAttr('style');
    anketaSteps.removeAttr('style');
    anketaSuccess.removeAttr('style');
  }
}

$(document).ready(function () {
  anketaBlocksPosition();
});
window.addEventListener('resize', anketaBlocksPosition);