"use strict";

var mines = new Swiper(".mines__slider", {
  spaceBetween: 31,
  slidesPerView: 3,
  loop: false,
  breakpoints: {
    1200: {
      slidesPerView: 3
    },
    992: {
      slidesPerView: 2.5,
      spaceBetween: 31
    },
    764: {
      slidesPerView: 1.72,
      spaceBetween: 24
    },
    480: {
      slidesPerView: 1.5
    },
    320: {
      slidesPerView: 1.09,
      spaceBetween: 16
    }
  },
  navigation: {
    nextEl: '.mines__slider .swiper-button-next',
    prevEl: '.mines__slider .swiper-button-prev'
  }
});
var newsSliderEl = document.querySelector(".news__slider");

function updateSliderPosition() {
  if (!newsSliderEl || !newsSliderEl.swiper) return;
  var viewportWidth = window.innerWidth;
  var swiper = newsSliderEl.swiper;
  var activeSlide = swiper.slides[swiper.activeIndex];
  if (!activeSlide) return; // Ширина родительского контейнера слайдера

  var parentContainer = newsSliderEl.parentElement;
  var parentContainerWidth = parentContainer ? parentContainer.offsetWidth : window.innerWidth;
  var sliderNav = newsSliderEl.querySelector('.news__nav');
  var sliderNavWidth = sliderNav.getBoundingClientRect().width;
  var activeWidth;

  if ($(window).width() > 992) {
    activeWidth = 426;
  } else if ($(window).width() <= 992 && $(window).width() > 600) {
    activeWidth = 348;
  } else {
    activeWidth = 335;
  } // Ширина слайдера = половина ширины родителя


  newsSliderEl.style.width = viewportWidth / 2 + activeWidth / 2 + 'px'; // Смещение: центр родителя минус половина ширины активного слайда

  var offset = parentContainerWidth / 2 - activeWidth / 2;
  newsSliderEl.style.marginLeft = offset + 'px'; // смещение навигации

  sliderNav.style.marginLeft = activeWidth / 2 - sliderNavWidth / 2 + 'px';
}

var news = new Swiper(".news__slider", {
  spaceBetween: 32,
  loop: true,
  slidesPerView: 2.5,
  centeredSlides: false,
  speed: 1500,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  breakpoints: {
    1600: {
      spaceBetween: 32,
      slidesPerView: 3.6
    },
    1200: {
      spaceBetween: 32,
      slidesPerView: 2.8
    },
    992: {
      spaceBetween: 32,
      slidesPerView: 2.5
    },
    600: {
      spaceBetween: 24,
      slidesPerView: 2
    },
    320: {
      spaceBetween: 12,
      slidesPerView: 1
    }
  },
  navigation: {
    nextEl: '.news__slider .swiper-button-next',
    prevEl: '.news__slider .swiper-button-prev'
  },
  pagination: {
    el: ".news__slider .swiper-pagination",
    clickable: true
  },
  on: {
    init: updateSliderPosition,
    slideChangeTransitionStart: updateSliderPosition,
    resize: updateSliderPosition
  }
});
window.addEventListener('resize', updateSliderPosition);
news.on('click', function (swiper, event) {
  var clickedSlide = event.target.closest('.swiper-slide');
  if (!clickedSlide) return;
  if (event.target.closest('button, a, input')) return;
  var targetIndex = Array.from(swiper.slides).indexOf(clickedSlide);

  if (targetIndex !== -1 && targetIndex !== swiper.activeIndex) {
    swiper.slideTo(targetIndex);
  }
});
var postGallery = [];

function initPostGallery() {
  var sliderContainers = document.querySelectorAll('.post__gallery');
  sliderContainers.forEach(function (container, index) {
    if (!container.classList.contains('swiper-initialized')) {
      var nextButton = container.querySelector('.swiper-button-next');
      var prevButton = container.querySelector('.swiper-button-prev');
      var slider = new Swiper(container, {
        slidesPerView: 1,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton
        },
        observer: true,
        observeParents: true
      });
      setTimeout(function () {
        slider.update();
      }, 100);
      postGallery.push(slider);
      container.classList.add('swiper-initialized');
    }
  });
}

document.addEventListener('DOMContentLoaded', initPostGallery);
var mapSlider = new Swiper(".map__slider", {
  slidesPerView: 1,
  loop: true,
  effect: 'fade',
  navigation: {
    nextEl: '.map__slider .swiper-button-next',
    prevEl: '.map__slider .swiper-button-prev'
  },
  on: {
    slideChange: function slideChange() {
      updateActiveButton(this.realIndex);
    }
  }
});
var heroMetals = new Swiper(".hero__slider", {
  slidesPerView: 1,
  speed: 600,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  }
});
$('.hero__slider .swiper-pagination-bullet').on('click', function () {
  var clickedBullet = $(this).index();
  heroMetals.slideToLoop(clickedBullet);
});
$(function () {
  function initMetalsSlider($slider) {
    if (!$slider.length) return;
    var existingSwiper = $slider.data('metalsSwiper');

    if (existingSwiper) {
      existingSwiper.update();
      return;
    }

    var swiper = new Swiper($slider[0], {
      slidesPerView: 3,
      spaceBetween: 16,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      speed: 1000,
      mousewheel: {
        enabled: true,
        // eventsTarget: '.swiper-wrapper',
        sensitivity: 3
      },
      navigation: {
        nextEl: $slider.parent().find('.swiper-button-next')[0],
        prevEl: $slider.parent().find('.swiper-button-prev')[0]
      },
      pagination: {
        el: $slider.parent().find('.swiper-pagination')[0],
        clickable: true
      },
      breakpoints: {
        1200: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 8
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 8
        }
      }
    });
    $slider.data('metalsSwiper', swiper);
  }

  function updateVisibleMetalsSliders() {
    $('.metals__slider:visible').each(function () {
      initMetalsSlider($(this));
    });
  }

  function initPracticeSliders($slider) {
    if (!$slider.length) return;
    var existingSwiper = $slider.data('practiceSwiper');

    if ($(window).width() <= 992) {
      if (existingSwiper) {
        existingSwiper.update();
        return;
      }

      var swiper = new Swiper($slider[0], {
        slidesPerView: 2,
        spaceBetween: 24,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        speed: 1000,
        slidesPerGroup: 2,
        pagination: {
          el: $slider.parent().find('.swiper-pagination')[0],
          clickable: true
        },
        breakpoints: {
          767: {
            slidesPerView: 2,
            spaceBetween: 24,
            slidesPerGroup: 2
          },
          320: {
            slidesPerView: 1.1,
            spaceBetween: 20,
            slidesPerGroup: 1
          }
        }
      });
      $slider.data('practiceSwiper', swiper);
    } else {
      if (existingSwiper) {
        existingSwiper.destroy(true, true);
        $slider.removeData('practiceSwiper');
      }
    }
  }

  function updateVisiblePracticeSliders() {
    $('.practice-tabs__benefits:visible').each(function () {
      initPracticeSliders($(this));
    });
  }

  window.updateMetalsSliders = updateVisibleMetalsSliders;
  updateVisibleMetalsSliders();
  window.initPracticeSliders = initPracticeSliders;
  window.updatePracticeSliders = updateVisiblePracticeSliders;
  updateVisiblePracticeSliders();
  var resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateVisiblePracticeSliders();
    }, 250);
  });
  $(document).on('click', '[data-btn]', function () {
    var dataBtn = $(this).attr('data-btn');
    $(this).addClass('active').siblings().removeClass('active');
    $("[data-content=\"".concat(dataBtn, "\"]")).addClass('active').siblings().removeClass('active');

    if ($(this).hasClass('practice-tabs__btn')) {
      $(this).removeClass('hovered');
      $('.practice-tabs__body').removeClass('blurred');
    }

    setTimeout(function () {
      updateVisibleMetalsSliders();
      updateVisiblePracticeSliders();
    }, 0);
  });
});
var comfort = new Swiper(".comfort__slider", {
  spaceBetween: 32,
  slidesPerView: 3,
  loop: false,
  breakpoints: {
    1400: {
      slidesPerView: 3,
      spaceBetween: 32
    },
    1200: {
      slidesPerView: 2.5,
      spaceBetween: 24
    },
    992: {
      slidesPerView: 2.3,
      spaceBetween: 24
    },
    600: {
      slidesPerView: 2,
      spaceBetween: 24
    },
    320: {
      slidesPerView: 1.09,
      spaceBetween: 16
    }
  },
  navigation: {
    nextEl: '.comfort__slider .swiper-button-next',
    prevEl: '.comfort__slider .swiper-button-prev'
  },
  pagination: {
    el: ".comfort__slider .swiper-pagination",
    clickable: true
  }
});
var benefitsSlider = null;

function initBenefitsSlider() {
  var windowWidth = $(window).width();
  var isMobile = windowWidth <= 1024;

  if (benefitsSlider && !isMobile) {
    benefitsSlider.destroy(true, true);
    benefitsSlider = null;
    return;
  }

  if (!benefitsSlider && isMobile) {
    var $sliderContainer = $(".benefits__slider");
    benefitsSlider = new Swiper($sliderContainer[0], {
      slidesPerView: 2,
      spaceBetween: 24,
      speed: 1500,
      loop: false,
      pagination: {
        el: ".benefits__slider .swiper-pagination",
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1.095,
          spaceBetween: 16,
          slidesPerGroup: 1
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 24,
          slidesPerGroup: 2
        }
      }
    });
  }
}

$(document).ready(function () {
  if ($(".benefits__slider").length) {
    initBenefitsSlider();
  }
});
$(window).on('resize', function () {
  if ($(".benefits__slider").length) {
    initBenefitsSlider();
  }
});
var gallery = new Swiper(".page-gallery__slider", {
  spaceBetween: 32,
  slidesPerView: 1,
  loop: false,
  breakpoints: {
    993: {
      slidesPerView: 1,
      spaceBetween: 32
    },
    600: {
      slidesPerView: 1.002,
      spaceBetween: 16
    },
    320: {
      slidesPerView: 1.015,
      spaceBetween: 16
    }
  },
  navigation: {
    nextEl: '.page-gallery__slider .swiper-button-next',
    prevEl: '.page-gallery__slider .swiper-button-prev'
  },
  pagination: {
    el: ".page-gallery__slider .swiper-pagination",
    type: 'fraction',
    renderFraction: function renderFraction(currentClass, totalClass) {
      return '<span class="' + currentClass + '"></span>' + 'из ' + '<span class="' + totalClass + '"></span>';
    }
  }
});
var vacancy = new Swiper(".vacancy__slider", {
  spaceBetween: 32,
  slidesPerView: 1,
  loop: false,
  breakpoints: {
    993: {
      slidesPerView: 1,
      spaceBetween: 32
    },
    600: {
      slidesPerView: 1.001,
      spaceBetween: 16
    },
    320: {
      slidesPerView: 1.001,
      spaceBetween: 12
    }
  },
  navigation: {
    nextEl: '.vacancy__slider .swiper-button-next',
    prevEl: '.vacancy__slider .swiper-button-prev'
  },
  pagination: {
    el: ".vacancy__slider .swiper-pagination",
    type: 'fraction',
    renderFraction: function renderFraction(currentClass, totalClass) {
      return '<span class="' + currentClass + '"></span>' + 'из ' + '<span class="' + totalClass + '"></span>';
    }
  }
});
var careerSlider = new Swiper(".hero--career .hero__bg", {
  slidesPerView: 1,
  loop: true,
  effect: 'fade',
  speed: 3000,
  autoplay: {
    delay: 3000
  }
});
var industrySlider = null;

function initIndustrySlider() {
  if ($('.industry__slider').length) {
    if (industrySlider) {
      industrySlider.destroy(true, true);
      industrySlider = null;
    }

    var windowWidth = $(window).width();

    if (windowWidth > 600) {
      industrySlider = new Swiper('.industry__slider', {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        centeredSlides: true,
        initialSlide: 2,
        speed: 1200,
        slideToClickedSlide: true,
        effect: 'coverflow',
        pagination: {
          el: ".industry__slider .swiper-pagination",
          clickable: true
        },
        breakpoints: {
          993: {
            slidesPerView: 2.675,
            coverflowEffect: {
              rotate: 0,
              slideShadows: false,
              depth: 600,
              scale: 1.18
            }
          },
          601: {
            slidesPerView: 2.1,
            coverflowEffect: {
              rotate: 0,
              slideShadows: false,
              depth: 800,
              scale: 1.3
            }
          }
        }
      });
    } else {
      industrySlider = new Swiper('.industry__slider', {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        centeredSlides: true,
        initialSlide: 2,
        speed: 1200,
        slidesPerView: 'auto',
        spaceBetween: 12,
        pagination: {
          el: ".industry__slider .swiper-pagination",
          clickable: true
        }
      });
    }
  }
}

function debounce(func, wait) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      return func.apply(context, args);
    }, wait);
  };
}

$(document).ready(function () {
  initIndustrySlider();
});
$(window).on('resize', debounce(function () {
  initIndustrySlider();
}, 250));
var connectSlider = null;

function initConnectSlider() {
  if ($('.connect__slider').length) {
    if (connectSlider) {
      connectSlider.destroy(true, true);
      connectSlider = null;
    }

    connectSlider = new Swiper('.connect__slider', {
      initialSlide: 1,
      effect: 'cards',
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      cardsEffect: {
        perSlideOffset: 7,
        perSlideRotate: 2,
        rotate: true
      },
      pagination: {
        el: ".connect__slider .swiper-pagination",
        clickable: true
      },
      breakpoints: {
        601: {
          cardsEffect: {
            perSlideOffset: 15,
            perSlideRotate: 2,
            rotate: true
          }
        },
        1261: {
          cardsEffect: {
            perSlideOffset: 14,
            perSlideRotate: 2,
            rotate: true
          }
        }
      }
    });
  }
}

function debounce2(func, wait) {
  var timeout;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      return func.apply(_this, args);
    }, wait);
  };
}

$(document).ready(function () {
  initConnectSlider();
});
$(window).on('resize', debounce2(function () {
  initConnectSlider();
}, 250)); // var practiceThumbs = new Swiper('.practice-gallery__thumbs .swiper', {
//   spaceBetween: 2,
//   slidesPerView: 4,
//   freeMode: true,
//   watchSlidesProgress: true,
//   direction: 'vertical',
// });
// var practiceGallery = new Swiper('.practice-gallery__slider', {
//   thumbs: {
//     swiper: practiceThumbs,
//   },
//   effect: 'fade',
//   speed: 1500,
// });

function practiceTabHover() {// Tab hover preview is handled in common.js with GSAP opacity transitions
}

practiceTabHover();

function initReviewsSlider() {
  var reviewsSliderEl = document.querySelector('.reviews__slider');
  if (!reviewsSliderEl) return;
  var reviewsSlider = new Swiper('.reviews__slider', {
    slidesPerView: 1.1,
    spaceBetween: 16,
    speed: 600,
    watchOverflow: true,
    pagination: {
      el: '.reviews__pagination',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      993: {
        slidesPerView: 2,
        spaceBetween: 192
      }
    },
    on: {
      slideChange: function slideChange() {
        document.querySelectorAll('.reviews__media.is-playing').forEach(function (media) {
          var video = media.querySelector('.reviews__video');

          if (video && !video.paused) {
            video.pause();
          }
        });
      }
    }
  });
  var modal = document.querySelector('.video-modal');
  var modalVideo = modal ? modal.querySelector('.video-modal__video') : null;
  var modalClose = modal ? modal.querySelector('.video-modal__close') : null;
  var activeInlineVideo = null;

  function pauseAllInlineVideos() {
    document.querySelectorAll('.reviews__video').forEach(function (v) {
      if (!v.paused) {
        v.pause();
      }
    });
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('video-modal-open');

    if (modalVideo) {
      if (activeInlineVideo) {
        try {
          activeInlineVideo.currentTime = modalVideo.currentTime;
        } catch (err) {}
      }

      modalVideo.pause();
    }

    if (activeInlineVideo) {
      activeInlineVideo.pause();
      activeInlineVideo = null;
    }

    pauseAllInlineVideos();
  }

  if (modalClose) {
    modalClose.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  if (modalVideo) {
    modalVideo.addEventListener('play', function () {
      pauseAllInlineVideos();
    });
    modalVideo.addEventListener('timeupdate', function () {
      if (modal && modal.classList.contains('is-open')) {
        pauseAllInlineVideos();
      }
    });
  }

  var videoCards = reviewsSliderEl.querySelectorAll('.reviews__media--video');
  videoCards.forEach(function (card) {
    var playBtn = card.querySelector('.reviews__play');
    var video = card.querySelector('.reviews__video');
    var fullscreenBtn = card.querySelector('.reviews__fullscreen');
    if (!video) return; // Remove all native controls from inline video

    video.controls = false;
    video.addEventListener('play', function () {
      video.controls = false;
    });

    if (playBtn) {
      playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('.reviews__media.is-playing').forEach(function (otherCard) {
          if (otherCard !== card) {
            var otherVideo = otherCard.querySelector('.reviews__video');

            if (otherVideo) {
              otherVideo.pause();
            }

            otherCard.classList.remove('is-playing');
          }
        });
        card.classList.add('is-playing');
        video.controls = false;
        video.play()["catch"](function (err) {
          console.warn('Playback prevented:', err);
        });
      });
    }

    video.addEventListener('click', function (e) {
      e.stopPropagation();

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('ended', function () {
      card.classList.remove('is-playing');
      video.currentTime = 0;
    });

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!modal || !modalVideo) return;
        activeInlineVideo = video; // Immediately pause the inline video and all other inline videos

        video.pause();
        pauseAllInlineVideos(); // Transfer source and currentTime to modal video

        modalVideo.src = video.currentSrc || video.src;

        try {
          modalVideo.currentTime = video.currentTime;
        } catch (err) {} // Open the fullscreen modal and lock body scroll


        modal.classList.add('is-open');
        document.body.classList.add('video-modal-open'); // Start modal video playback

        modalVideo.play()["catch"](function (err) {
          console.warn('Modal video play prevented:', err);
        });
      });
    }
  });
}

$(document).ready(function () {
  initReviewsSlider();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVycy5qcyIsIm5hbWVzIjpbIm1pbmVzIiwiU3dpcGVyIiwic3BhY2VCZXR3ZWVuIiwic2xpZGVzUGVyVmlldyIsImxvb3AiLCJicmVha3BvaW50cyIsIm5hdmlnYXRpb24iLCJuZXh0RWwiLCJwcmV2RWwiLCJuZXdzU2xpZGVyRWwiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ1cGRhdGVTbGlkZXJQb3NpdGlvbiIsInN3aXBlciIsInZpZXdwb3J0V2lkdGgiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiYWN0aXZlU2xpZGUiLCJzbGlkZXMiLCJhY3RpdmVJbmRleCIsInBhcmVudENvbnRhaW5lciIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnRDb250YWluZXJXaWR0aCIsIm9mZnNldFdpZHRoIiwic2xpZGVyTmF2Iiwic2xpZGVyTmF2V2lkdGgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsImFjdGl2ZVdpZHRoIiwiJCIsInN0eWxlIiwib2Zmc2V0IiwibWFyZ2luTGVmdCIsIm5ld3MiLCJjZW50ZXJlZFNsaWRlcyIsInNwZWVkIiwiYXV0b3BsYXkiLCJkZWxheSIsImRpc2FibGVPbkludGVyYWN0aW9uIiwicGFnaW5hdGlvbiIsImVsIiwiY2xpY2thYmxlIiwib24iLCJpbml0Iiwic2xpZGVDaGFuZ2VUcmFuc2l0aW9uU3RhcnQiLCJyZXNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjbGlja2VkU2xpZGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidGFyZ2V0SW5kZXgiLCJBcnJheSIsImZyb20iLCJpbmRleE9mIiwic2xpZGVUbyIsInBvc3RHYWxsZXJ5IiwiaW5pdFBvc3RHYWxsZXJ5Iiwic2xpZGVyQ29udGFpbmVycyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiY29udGFpbmVyIiwiaW5kZXgiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIm5leHRCdXR0b24iLCJwcmV2QnV0dG9uIiwic2xpZGVyIiwib2JzZXJ2ZXIiLCJvYnNlcnZlUGFyZW50cyIsInNldFRpbWVvdXQiLCJ1cGRhdGUiLCJwdXNoIiwiYWRkIiwibWFwU2xpZGVyIiwiZWZmZWN0Iiwic2xpZGVDaGFuZ2UiLCJ1cGRhdGVBY3RpdmVCdXR0b24iLCJyZWFsSW5kZXgiLCJoZXJvTWV0YWxzIiwiY2xpY2tlZEJ1bGxldCIsInNsaWRlVG9Mb29wIiwiaW5pdE1ldGFsc1NsaWRlciIsIiRzbGlkZXIiLCJsZW5ndGgiLCJleGlzdGluZ1N3aXBlciIsImRhdGEiLCJvYnNlcnZlU2xpZGVDaGlsZHJlbiIsIm1vdXNld2hlZWwiLCJlbmFibGVkIiwic2Vuc2l0aXZpdHkiLCJwYXJlbnQiLCJmaW5kIiwidXBkYXRlVmlzaWJsZU1ldGFsc1NsaWRlcnMiLCJlYWNoIiwiaW5pdFByYWN0aWNlU2xpZGVycyIsInNsaWRlc1Blckdyb3VwIiwiZGVzdHJveSIsInJlbW92ZURhdGEiLCJ1cGRhdGVWaXNpYmxlUHJhY3RpY2VTbGlkZXJzIiwidXBkYXRlTWV0YWxzU2xpZGVycyIsInVwZGF0ZVByYWN0aWNlU2xpZGVycyIsInJlc2l6ZVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiZGF0YUJ0biIsImF0dHIiLCJhZGRDbGFzcyIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJoYXNDbGFzcyIsImNvbWZvcnQiLCJiZW5lZml0c1NsaWRlciIsImluaXRCZW5lZml0c1NsaWRlciIsIndpbmRvd1dpZHRoIiwiaXNNb2JpbGUiLCIkc2xpZGVyQ29udGFpbmVyIiwicmVhZHkiLCJnYWxsZXJ5IiwidHlwZSIsInJlbmRlckZyYWN0aW9uIiwiY3VycmVudENsYXNzIiwidG90YWxDbGFzcyIsInZhY2FuY3kiLCJjYXJlZXJTbGlkZXIiLCJpbmR1c3RyeVNsaWRlciIsImluaXRJbmR1c3RyeVNsaWRlciIsImluaXRpYWxTbGlkZSIsInNsaWRlVG9DbGlja2VkU2xpZGUiLCJjb3ZlcmZsb3dFZmZlY3QiLCJyb3RhdGUiLCJzbGlkZVNoYWRvd3MiLCJkZXB0aCIsInNjYWxlIiwiZGVib3VuY2UiLCJmdW5jIiwid2FpdCIsInRpbWVvdXQiLCJjb250ZXh0IiwiYXJncyIsImFyZ3VtZW50cyIsImFwcGx5IiwiY29ubmVjdFNsaWRlciIsImluaXRDb25uZWN0U2xpZGVyIiwiY2FyZHNFZmZlY3QiLCJwZXJTbGlkZU9mZnNldCIsInBlclNsaWRlUm90YXRlIiwiZGVib3VuY2UyIiwicHJhY3RpY2VUYWJIb3ZlciIsImluaXRSZXZpZXdzU2xpZGVyIiwicmV2aWV3c1NsaWRlckVsIiwicmV2aWV3c1NsaWRlciIsIndhdGNoT3ZlcmZsb3ciLCJtZWRpYSIsInZpZGVvIiwicGF1c2VkIiwicGF1c2UiLCJtb2RhbCIsIm1vZGFsVmlkZW8iLCJtb2RhbENsb3NlIiwiYWN0aXZlSW5saW5lVmlkZW8iLCJwYXVzZUFsbElubGluZVZpZGVvcyIsInYiLCJjbG9zZU1vZGFsIiwicmVtb3ZlIiwiYm9keSIsImN1cnJlbnRUaW1lIiwiZXJyIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwia2V5IiwidmlkZW9DYXJkcyIsImNhcmQiLCJwbGF5QnRuIiwiZnVsbHNjcmVlbkJ0biIsImNvbnRyb2xzIiwib3RoZXJDYXJkIiwib3RoZXJWaWRlbyIsInBsYXkiLCJjb25zb2xlIiwid2FybiIsInNyYyIsImN1cnJlbnRTcmMiXSwic291cmNlcyI6WyJzbGlkZXJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1pbmVzID0gbmV3IFN3aXBlcihcIi5taW5lc19fc2xpZGVyXCIsIHtcclxuICBzcGFjZUJldHdlZW46IDMxLFxyXG4gIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgbG9vcDogZmFsc2UsXHJcbiAgYnJlYWtwb2ludHM6IHtcclxuICAgIDEyMDA6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgIH0sXHJcbiAgICA5OTI6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMi41LFxyXG4gICAgICBzcGFjZUJldHdlZW46IDMxLFxyXG4gICAgfSxcclxuICAgIDc2NDoge1xyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLjcyLFxyXG4gICAgICBzcGFjZUJldHdlZW46IDI0LFxyXG4gICAgfSxcclxuICAgIDQ4MDoge1xyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLjUsXHJcbiAgICB9LFxyXG4gICAgMzIwOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEuMDksXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMTYsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgbmF2aWdhdGlvbjoge1xyXG4gICAgbmV4dEVsOiAnLm1pbmVzX19zbGlkZXIgLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICBwcmV2RWw6ICcubWluZXNfX3NsaWRlciAuc3dpcGVyLWJ1dHRvbi1wcmV2JyxcclxuICB9LFxyXG5cclxufSk7XHJcblxyXG5jb25zdCBuZXdzU2xpZGVyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld3NfX3NsaWRlclwiKTtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNsaWRlclBvc2l0aW9uKCkge1xyXG4gICAgaWYgKCFuZXdzU2xpZGVyRWwgfHwgIW5ld3NTbGlkZXJFbC5zd2lwZXIpIHJldHVybjtcclxuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIGNvbnN0IHN3aXBlciA9IG5ld3NTbGlkZXJFbC5zd2lwZXI7XHJcbiAgICBjb25zdCBhY3RpdmVTbGlkZSA9IHN3aXBlci5zbGlkZXNbc3dpcGVyLmFjdGl2ZUluZGV4XTtcclxuICAgIGlmICghYWN0aXZlU2xpZGUpIHJldHVybjtcclxuXHJcbiAgICAvLyDQqNC40YDQuNC90LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0LrQvtC90YLQtdC50L3QtdGA0LAg0YHQu9Cw0LnQtNC10YDQsFxyXG4gICAgY29uc3QgcGFyZW50Q29udGFpbmVyID0gbmV3c1NsaWRlckVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICBjb25zdCBwYXJlbnRDb250YWluZXJXaWR0aCA9IHBhcmVudENvbnRhaW5lclxyXG4gICAgICAgID8gcGFyZW50Q29udGFpbmVyLm9mZnNldFdpZHRoXHJcbiAgICAgICAgOiB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICB2YXIgc2xpZGVyTmF2ID0gbmV3c1NsaWRlckVsLnF1ZXJ5U2VsZWN0b3IoJy5uZXdzX19uYXYnKTtcclxuICAgIHZhciBzbGlkZXJOYXZXaWR0aCA9IHNsaWRlck5hdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHJcbiAgICB2YXIgYWN0aXZlV2lkdGg7XHJcbiAgICBpZigkKHdpbmRvdykud2lkdGgoKSA+IDk5Mikge1xyXG4gICAgICBhY3RpdmVXaWR0aCA9IDQyNjtcclxuICAgIH0gZWxzZSBpZigkKHdpbmRvdykud2lkdGgoKSA8PSA5OTIgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiA2MDAgKSB7XHJcbiAgICAgIGFjdGl2ZVdpZHRoID0gMzQ4O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWN0aXZlV2lkdGggPSAzMzU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KjQuNGA0LjQvdCwINGB0LvQsNC50LTQtdGA0LAgPSDQv9C+0LvQvtCy0LjQvdCwINGI0LjRgNC40L3RiyDRgNC+0LTQuNGC0LXQu9GPXHJcbiAgICBuZXdzU2xpZGVyRWwuc3R5bGUud2lkdGggPSAoKHZpZXdwb3J0V2lkdGggLyAyKSArIChhY3RpdmVXaWR0aCAvIDIpKSArICdweCc7XHJcblxyXG4gICAgLy8g0KHQvNC10YnQtdC90LjQtTog0YbQtdC90YLRgCDRgNC+0LTQuNGC0LXQu9GPINC80LjQvdGD0YEg0L/QvtC70L7QstC40L3QsCDRiNC40YDQuNC90Ysg0LDQutGC0LjQstC90L7Qs9C+INGB0LvQsNC50LTQsFxyXG4gICAgY29uc3Qgb2Zmc2V0ID0gKHBhcmVudENvbnRhaW5lcldpZHRoIC8gMikgLSAoYWN0aXZlV2lkdGggLyAyKTtcclxuICAgIG5ld3NTbGlkZXJFbC5zdHlsZS5tYXJnaW5MZWZ0ID0gb2Zmc2V0ICsgJ3B4JztcclxuXHJcbiAgICAvLyDRgdC80LXRidC10L3QuNC1INC90LDQstC40LPQsNGG0LjQuFxyXG4gICAgc2xpZGVyTmF2LnN0eWxlLm1hcmdpbkxlZnQgPSAoYWN0aXZlV2lkdGggLyAyKSAtIChzbGlkZXJOYXZXaWR0aCAvIDIpICsgJ3B4J1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuY29uc3QgbmV3cyA9IG5ldyBTd2lwZXIoXCIubmV3c19fc2xpZGVyXCIsIHtcclxuICBzcGFjZUJldHdlZW46IDMyLFxyXG4gIGxvb3A6IHRydWUsXHJcbiAgc2xpZGVzUGVyVmlldzogMi41LFxyXG4gIGNlbnRlcmVkU2xpZGVzOiBmYWxzZSxcclxuICBzcGVlZDogMTUwMCxcclxuICBhdXRvcGxheToge1xyXG4gICAgZGVsYXk6IDUwMDAsXHJcbiAgICBkaXNhYmxlT25JbnRlcmFjdGlvbjogZmFsc2UsIFxyXG4gIH0sXHJcbiAgYnJlYWtwb2ludHM6IHtcclxuICAgIDE2MDA6IHsgXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMzIsXHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDMuNixcclxuICAgIH0sXHJcbiAgICAxMjAwOiB7IFxyXG4gICAgICBzcGFjZUJldHdlZW46IDMyLFxyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAyLjgsXHJcbiAgICB9LFxyXG4gICAgOTkyOiB7IFxyXG4gICAgICBzcGFjZUJldHdlZW46IDMyLFxyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAyLjUsXHJcbiAgICB9LFxyXG4gICAgNjAwOiB7IFxyXG4gICAgICBzcGFjZUJldHdlZW46IDI0LFxyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgfSxcclxuICAgIDMyMDogeyBcclxuICAgICAgc3BhY2VCZXR3ZWVuOiAxMixcclxuICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBuYXZpZ2F0aW9uOiB7XHJcbiAgICBuZXh0RWw6ICcubmV3c19fc2xpZGVyIC5zd2lwZXItYnV0dG9uLW5leHQnLFxyXG4gICAgcHJldkVsOiAnLm5ld3NfX3NsaWRlciAuc3dpcGVyLWJ1dHRvbi1wcmV2JyxcclxuICB9LFxyXG4gIHBhZ2luYXRpb246IHtcclxuICAgIGVsOiBcIi5uZXdzX19zbGlkZXIgLnN3aXBlci1wYWdpbmF0aW9uXCIsXHJcbiAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgfSxcclxuICBvbjoge1xyXG4gICAgaW5pdDogdXBkYXRlU2xpZGVyUG9zaXRpb24sXHJcbiAgICBzbGlkZUNoYW5nZVRyYW5zaXRpb25TdGFydDogdXBkYXRlU2xpZGVyUG9zaXRpb24sXHJcbiAgICByZXNpemU6IHVwZGF0ZVNsaWRlclBvc2l0aW9uLFxyXG4gIH1cclxufSk7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVTbGlkZXJQb3NpdGlvbik7XHJcblxyXG5uZXdzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChzd2lwZXIsIGV2ZW50KSB7XHJcbiAgY29uc3QgY2xpY2tlZFNsaWRlID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5zd2lwZXItc2xpZGUnKTtcclxuICBpZiAoIWNsaWNrZWRTbGlkZSkgcmV0dXJuO1xyXG4gIFxyXG4gIGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnYnV0dG9uLCBhLCBpbnB1dCcpKSByZXR1cm47XHJcbiAgY29uc3QgdGFyZ2V0SW5kZXggPSBBcnJheS5mcm9tKHN3aXBlci5zbGlkZXMpLmluZGV4T2YoY2xpY2tlZFNsaWRlKTtcclxuICBpZiAodGFyZ2V0SW5kZXggIT09IC0xICYmIHRhcmdldEluZGV4ICE9PSBzd2lwZXIuYWN0aXZlSW5kZXgpIHtcclxuICAgIHN3aXBlci5zbGlkZVRvKHRhcmdldEluZGV4KTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxubGV0IHBvc3RHYWxsZXJ5ID0gW107XHJcblxyXG5mdW5jdGlvbiBpbml0UG9zdEdhbGxlcnkoKSB7XHJcbiAgY29uc3Qgc2xpZGVyQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3N0X19nYWxsZXJ5Jyk7XHJcbiAgc2xpZGVyQ29udGFpbmVycy5mb3JFYWNoKChjb250YWluZXIsIGluZGV4KSA9PiB7XHJcbiAgICBpZiAoIWNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgIGNvbnN0IG5leHRCdXR0b24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnN3aXBlci1idXR0b24tbmV4dCcpO1xyXG4gICAgICBjb25zdCBwcmV2QnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItYnV0dG9uLXByZXYnKTtcclxuXHJcbiAgICAgIGNvbnN0IHNsaWRlciA9IG5ldyBTd2lwZXIoY29udGFpbmVyLCB7XHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICBuZXh0RWw6IG5leHRCdXR0b24sXHJcbiAgICAgICAgICBwcmV2RWw6IHByZXZCdXR0b24sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHNsaWRlci51cGRhdGUoKTtcclxuICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICAgIHBvc3RHYWxsZXJ5LnB1c2goc2xpZGVyKTtcclxuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3N3aXBlci1pbml0aWFsaXplZCcpOyBcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRQb3N0R2FsbGVyeSk7XHJcblxyXG5cclxuXHJcbmNvbnN0IG1hcFNsaWRlciA9IG5ldyBTd2lwZXIoXCIubWFwX19zbGlkZXJcIiwge1xyXG4gIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgbG9vcDogdHJ1ZSxcclxuICBlZmZlY3Q6ICdmYWRlJyxcclxuICBuYXZpZ2F0aW9uOiB7XHJcbiAgICBuZXh0RWw6ICcubWFwX19zbGlkZXIgLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICBwcmV2RWw6ICcubWFwX19zbGlkZXIgLnN3aXBlci1idXR0b24tcHJldicsXHJcbiAgfSxcclxuICBvbjoge1xyXG4gICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdXBkYXRlQWN0aXZlQnV0dG9uKHRoaXMucmVhbEluZGV4KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IGhlcm9NZXRhbHMgPSBuZXcgU3dpcGVyKFwiLmhlcm9fX3NsaWRlclwiLCB7XHJcbiAgc2xpZGVzUGVyVmlldzogMSxcclxuICBzcGVlZDogNjAwLFxyXG4gIGxvb3A6IHRydWUsXHJcbiAgYXV0b3BsYXk6IHtcclxuICAgIGRlbGF5OiA1MDAwLCBcclxuICAgIGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZSxcclxuICB9LFxyXG59KTtcclxuXHJcblxyXG4kKCcuaGVyb19fc2xpZGVyIC5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3QgY2xpY2tlZEJ1bGxldCA9ICQodGhpcykuaW5kZXgoKTtcclxuICBoZXJvTWV0YWxzLnNsaWRlVG9Mb29wKGNsaWNrZWRCdWxsZXQpO1xyXG59KTtcclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIGluaXRNZXRhbHNTbGlkZXIoJHNsaWRlcikge1xyXG4gICAgaWYgKCEkc2xpZGVyLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGV4aXN0aW5nU3dpcGVyID0gJHNsaWRlci5kYXRhKCdtZXRhbHNTd2lwZXInKTtcclxuXHJcbiAgICBpZiAoZXhpc3RpbmdTd2lwZXIpIHtcclxuICAgICAgZXhpc3RpbmdTd2lwZXIudXBkYXRlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzd2lwZXIgPSBuZXcgU3dpcGVyKCRzbGlkZXJbMF0sIHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgc3BhY2VCZXR3ZWVuOiAxNixcclxuICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgc3BlZWQ6IDEwMDAsXHJcbiAgICAgIG1vdXNld2hlZWw6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIC8vIGV2ZW50c1RhcmdldDogJy5zd2lwZXItd3JhcHBlcicsXHJcbiAgICAgICAgc2Vuc2l0aXZpdHk6IDMsXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICBuZXh0RWw6ICRzbGlkZXIucGFyZW50KCkuZmluZCgnLnN3aXBlci1idXR0b24tbmV4dCcpWzBdLFxyXG4gICAgICAgIHByZXZFbDogJHNsaWRlci5wYXJlbnQoKS5maW5kKCcuc3dpcGVyLWJ1dHRvbi1wcmV2JylbMF0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICBlbDogJHNsaWRlci5wYXJlbnQoKS5maW5kKCcuc3dpcGVyLXBhZ2luYXRpb24nKVswXSxcclxuICAgICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgIDEyMDA6IHtcclxuICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICBzcGFjZUJldHdlZW46IDE2LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxNixcclxuICAgICAgICB9LFxyXG4gICAgICAgIDYwMDoge1xyXG4gICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgIHNwYWNlQmV0d2VlbjogOCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIDMyMDoge1xyXG4gICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgICAgICAgIHNwYWNlQmV0d2VlbjogOCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgJHNsaWRlci5kYXRhKCdtZXRhbHNTd2lwZXInLCBzd2lwZXIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlzaWJsZU1ldGFsc1NsaWRlcnMoKSB7XHJcbiAgICAkKCcubWV0YWxzX19zbGlkZXI6dmlzaWJsZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICBpbml0TWV0YWxzU2xpZGVyKCQodGhpcykpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gaW5pdFByYWN0aWNlU2xpZGVycygkc2xpZGVyKSB7XHJcbiAgICBpZiAoISRzbGlkZXIubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmdTd2lwZXIgPSAkc2xpZGVyLmRhdGEoJ3ByYWN0aWNlU3dpcGVyJyk7XHJcblxyXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9IDk5Mikge1xyXG4gICAgICBpZiAoZXhpc3RpbmdTd2lwZXIpIHtcclxuICAgICAgICBleGlzdGluZ1N3aXBlci51cGRhdGUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN3aXBlciA9IG5ldyBTd2lwZXIoJHNsaWRlclswXSwge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAyNCxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogMTAwMCxcclxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMixcclxuICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICBlbDogJHNsaWRlci5wYXJlbnQoKS5maW5kKCcuc3dpcGVyLXBhZ2luYXRpb24nKVswXSxcclxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICA3Njc6IHtcclxuICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAyNCxcclxuICAgICAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgMzIwOiB7XHJcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDEuMSxcclxuICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAyMCxcclxuICAgICAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDEsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHNsaWRlci5kYXRhKCdwcmFjdGljZVN3aXBlcicsIHN3aXBlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoZXhpc3RpbmdTd2lwZXIpIHtcclxuICAgICAgICBleGlzdGluZ1N3aXBlci5kZXN0cm95KHRydWUsIHRydWUpO1xyXG4gICAgICAgICRzbGlkZXIucmVtb3ZlRGF0YSgncHJhY3RpY2VTd2lwZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlzaWJsZVByYWN0aWNlU2xpZGVycygpIHtcclxuICAgICQoJy5wcmFjdGljZS10YWJzX19iZW5lZml0czp2aXNpYmxlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGluaXRQcmFjdGljZVNsaWRlcnMoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy51cGRhdGVNZXRhbHNTbGlkZXJzID0gdXBkYXRlVmlzaWJsZU1ldGFsc1NsaWRlcnM7XHJcbiAgdXBkYXRlVmlzaWJsZU1ldGFsc1NsaWRlcnMoKTtcclxuICB3aW5kb3cuaW5pdFByYWN0aWNlU2xpZGVycyA9IGluaXRQcmFjdGljZVNsaWRlcnM7XHJcbiAgd2luZG93LnVwZGF0ZVByYWN0aWNlU2xpZGVycyA9IHVwZGF0ZVZpc2libGVQcmFjdGljZVNsaWRlcnM7XHJcbiAgdXBkYXRlVmlzaWJsZVByYWN0aWNlU2xpZGVycygpO1xyXG5cclxuXHJcbiAgbGV0IHJlc2l6ZVRpbWVyO1xyXG4gICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcclxuICAgIHJlc2l6ZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHVwZGF0ZVZpc2libGVQcmFjdGljZVNsaWRlcnMoKTtcclxuICAgIH0sIDI1MCk7XHJcbiAgfSk7XHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWJ0bl0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBkYXRhQnRuID0gJCh0aGlzKS5hdHRyKCdkYXRhLWJ0bicpO1xyXG4gIFxyXG4gICAgJCh0aGlzKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgIC5zaWJsaW5ncygpXHJcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgXHJcbiAgICAkKGBbZGF0YS1jb250ZW50PVwiJHtkYXRhQnRufVwiXWApXHJcbiAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdwcmFjdGljZS10YWJzX19idG4nKSkge1xyXG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdob3ZlcmVkJyk7XHJcbiAgICAgICQoJy5wcmFjdGljZS10YWJzX19ib2R5JykucmVtb3ZlQ2xhc3MoJ2JsdXJyZWQnKTtcclxuICAgIH1cclxuICBcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB1cGRhdGVWaXNpYmxlTWV0YWxzU2xpZGVycygpO1xyXG4gICAgICB1cGRhdGVWaXNpYmxlUHJhY3RpY2VTbGlkZXJzKCk7XHJcbiAgICB9LCAwKTtcclxuICB9KTtcclxufSk7XHJcblxyXG5cclxuY29uc3QgY29tZm9ydCA9IG5ldyBTd2lwZXIoXCIuY29tZm9ydF9fc2xpZGVyXCIsIHtcclxuICBzcGFjZUJldHdlZW46IDMyLFxyXG4gIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgbG9vcDogZmFsc2UsXHJcbiAgYnJlYWtwb2ludHM6IHtcclxuICAgIDE0MDA6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgc3BhY2VCZXR3ZWVuOiAzMixcclxuICAgIH0sXHJcbiAgICAxMjAwOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDIuNSxcclxuICAgICAgc3BhY2VCZXR3ZWVuOiAyNCxcclxuICAgIH0sXHJcbiAgICA5OTI6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMi4zLFxyXG4gICAgICBzcGFjZUJldHdlZW46IDI0LFxyXG4gICAgfSxcclxuICAgIDYwMDoge1xyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICBzcGFjZUJldHdlZW46IDI0LFxyXG4gICAgfSxcclxuICAgIDMyMDoge1xyXG4gICAgICBzbGlkZXNQZXJWaWV3OiAxLjA5LFxyXG4gICAgICBzcGFjZUJldHdlZW46IDE2LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIG5hdmlnYXRpb246IHtcclxuICAgIG5leHRFbDogJy5jb21mb3J0X19zbGlkZXIgLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICBwcmV2RWw6ICcuY29tZm9ydF9fc2xpZGVyIC5zd2lwZXItYnV0dG9uLXByZXYnLFxyXG4gIH0sXHJcbiAgcGFnaW5hdGlvbjoge1xyXG4gICAgZWw6IFwiLmNvbWZvcnRfX3NsaWRlciAuc3dpcGVyLXBhZ2luYXRpb25cIixcclxuICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICB9LFxyXG5cclxufSk7XHJcblxyXG5sZXQgYmVuZWZpdHNTbGlkZXIgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gaW5pdEJlbmVmaXRzU2xpZGVyKCkge1xyXG4gIGNvbnN0IHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgY29uc3QgaXNNb2JpbGUgPSB3aW5kb3dXaWR0aCA8PSAxMDI0O1xyXG4gIFxyXG4gIGlmIChiZW5lZml0c1NsaWRlciAmJiAhaXNNb2JpbGUpIHtcclxuICAgIGJlbmVmaXRzU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSk7XHJcbiAgICBiZW5lZml0c1NsaWRlciA9IG51bGw7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghYmVuZWZpdHNTbGlkZXIgJiYgaXNNb2JpbGUpIHtcclxuICAgIGNvbnN0ICRzbGlkZXJDb250YWluZXIgPSAkKFwiLmJlbmVmaXRzX19zbGlkZXJcIik7XHJcbiAgICBcclxuICAgIGJlbmVmaXRzU2xpZGVyID0gbmV3IFN3aXBlcigkc2xpZGVyQ29udGFpbmVyWzBdLCB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMjQsXHJcbiAgICAgIHNwZWVkOiAxNTAwLFxyXG5cclxuICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICBlbDogXCIuYmVuZWZpdHNfX3NsaWRlciAuc3dpcGVyLXBhZ2luYXRpb25cIixcclxuICAgICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgMzIwOiB7XHJcbiAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLjA5NSxcclxuICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTYsXHJcbiAgICAgICAgICBzbGlkZXNQZXJHcm91cDogMSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIDYwMDoge1xyXG4gICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgIHNwYWNlQmV0d2VlbjogMjQsXHJcbiAgICAgICAgICBzbGlkZXNQZXJHcm91cDogMixcclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5iZW5lZml0c19fc2xpZGVyXCIpLmxlbmd0aCkge1xyXG4gICAgaW5pdEJlbmVmaXRzU2xpZGVyKCk7XHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCl7XHJcbiAgaWYoJChcIi5iZW5lZml0c19fc2xpZGVyXCIpLmxlbmd0aCkge1xyXG4gICAgaW5pdEJlbmVmaXRzU2xpZGVyKCk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5jb25zdCBnYWxsZXJ5ID0gbmV3IFN3aXBlcihcIi5wYWdlLWdhbGxlcnlfX3NsaWRlclwiLCB7XHJcbiAgc3BhY2VCZXR3ZWVuOiAzMixcclxuICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gIGxvb3A6IGZhbHNlLFxyXG4gIGJyZWFrcG9pbnRzOiB7XHJcblxyXG4gICAgOTkzOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMzIsXHJcbiAgICB9LFxyXG4gICAgNjAwOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEuMDAyLFxyXG4gICAgICBzcGFjZUJldHdlZW46IDE2LFxyXG4gICAgfSxcclxuXHJcbiAgICAzMjA6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMS4wMTUsXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMTYsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgbmF2aWdhdGlvbjoge1xyXG4gICAgbmV4dEVsOiAnLnBhZ2UtZ2FsbGVyeV9fc2xpZGVyIC5zd2lwZXItYnV0dG9uLW5leHQnLFxyXG4gICAgcHJldkVsOiAnLnBhZ2UtZ2FsbGVyeV9fc2xpZGVyIC5zd2lwZXItYnV0dG9uLXByZXYnLFxyXG4gIH0sXHJcbiAgcGFnaW5hdGlvbjoge1xyXG4gICAgZWw6IFwiLnBhZ2UtZ2FsbGVyeV9fc2xpZGVyIC5zd2lwZXItcGFnaW5hdGlvblwiLFxyXG4gICAgdHlwZTogJ2ZyYWN0aW9uJyxcclxuICAgIHJlbmRlckZyYWN0aW9uOiBmdW5jdGlvbihjdXJyZW50Q2xhc3MsIHRvdGFsQ2xhc3MpIHtcclxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjdXJyZW50Q2xhc3MgKyAnXCI+PC9zcGFuPicgKyAn0LjQtyAnICsgJzxzcGFuIGNsYXNzPVwiJyArIHRvdGFsQ2xhc3MgKyAnXCI+PC9zcGFuPic7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IHZhY2FuY3kgPSBuZXcgU3dpcGVyKFwiLnZhY2FuY3lfX3NsaWRlclwiLCB7XHJcbiAgc3BhY2VCZXR3ZWVuOiAzMixcclxuICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gIGxvb3A6IGZhbHNlLFxyXG4gIGJyZWFrcG9pbnRzOiB7XHJcblxyXG4gICAgOTkzOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMzIsXHJcbiAgICB9LFxyXG4gICAgNjAwOiB7XHJcbiAgICAgIHNsaWRlc1BlclZpZXc6IDEuMDAxLFxyXG4gICAgICBzcGFjZUJldHdlZW46IDE2LFxyXG4gICAgfSxcclxuXHJcbiAgICAzMjA6IHtcclxuICAgICAgc2xpZGVzUGVyVmlldzogMS4wMDEsXHJcbiAgICAgIHNwYWNlQmV0d2VlbjogMTIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgbmF2aWdhdGlvbjoge1xyXG4gICAgbmV4dEVsOiAnLnZhY2FuY3lfX3NsaWRlciAuc3dpcGVyLWJ1dHRvbi1uZXh0JyxcclxuICAgIHByZXZFbDogJy52YWNhbmN5X19zbGlkZXIgLnN3aXBlci1idXR0b24tcHJldicsXHJcbiAgfSxcclxuICBwYWdpbmF0aW9uOiB7XHJcbiAgICBlbDogXCIudmFjYW5jeV9fc2xpZGVyIC5zd2lwZXItcGFnaW5hdGlvblwiLFxyXG4gICAgdHlwZTogJ2ZyYWN0aW9uJyxcclxuICAgIHJlbmRlckZyYWN0aW9uOiBmdW5jdGlvbihjdXJyZW50Q2xhc3MsIHRvdGFsQ2xhc3MpIHtcclxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjdXJyZW50Q2xhc3MgKyAnXCI+PC9zcGFuPicgKyAn0LjQtyAnICsgJzxzcGFuIGNsYXNzPVwiJyArIHRvdGFsQ2xhc3MgKyAnXCI+PC9zcGFuPic7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IGNhcmVlclNsaWRlciA9IG5ldyBTd2lwZXIoXCIuaGVyby0tY2FyZWVyIC5oZXJvX19iZ1wiLCB7XHJcbiAgc2xpZGVzUGVyVmlldzogMSxcclxuICBsb29wOiB0cnVlLFxyXG4gIGVmZmVjdDogJ2ZhZGUnLFxyXG4gIHNwZWVkOiAzMDAwLFxyXG4gIGF1dG9wbGF5OiB7XHJcbiAgICBkZWxheTogMzAwMCwgXHJcbiAgfSxcclxufSk7XHJcblxyXG5cclxubGV0IGluZHVzdHJ5U2xpZGVyID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIGluaXRJbmR1c3RyeVNsaWRlcigpIHtcclxuICBpZigkKCcuaW5kdXN0cnlfX3NsaWRlcicpLmxlbmd0aCkge1xyXG4gICAgaWYgKGluZHVzdHJ5U2xpZGVyKSB7XHJcbiAgICAgIGluZHVzdHJ5U2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSk7IFxyXG4gICAgICBpbmR1c3RyeVNsaWRlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBjb25zdCB3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgaWYgKHdpbmRvd1dpZHRoID4gNjAwKSB7XHJcbiAgICAgIGluZHVzdHJ5U2xpZGVyID0gbmV3IFN3aXBlcignLmluZHVzdHJ5X19zbGlkZXInLCB7XHJcbiAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICBhdXRvcGxheToge1xyXG4gICAgICAgICAgZGVsYXk6IDUwMDAsIFxyXG4gICAgICAgICAgZGlzYWJsZU9uSW50ZXJhY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2VudGVyZWRTbGlkZXM6IHRydWUsXHJcbiAgICAgICAgaW5pdGlhbFNsaWRlOiAyLFxyXG4gICAgICAgIHNwZWVkOiAxMjAwLFxyXG4gICAgICAgIHNsaWRlVG9DbGlja2VkU2xpZGU6IHRydWUsXHJcbiAgICAgICAgZWZmZWN0OiAnY292ZXJmbG93JyxcclxuICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICBlbDogXCIuaW5kdXN0cnlfX3NsaWRlciAuc3dpcGVyLXBhZ2luYXRpb25cIixcclxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICA5OTM6IHtcclxuICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMi42NzUsXHJcbiAgICAgICAgICAgIGNvdmVyZmxvd0VmZmVjdDoge1xyXG4gICAgICAgICAgICAgIHJvdGF0ZTogMCxcclxuICAgICAgICAgICAgICBzbGlkZVNoYWRvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGRlcHRoOiA2MDAsXHJcbiAgICAgICAgICAgICAgc2NhbGU6IDEuMTgsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgNjAxOiB7XHJcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIuMSxcclxuICAgICAgICAgICAgY292ZXJmbG93RWZmZWN0OiB7XHJcbiAgICAgICAgICAgICAgcm90YXRlOiAwLFxyXG4gICAgICAgICAgICAgIHNsaWRlU2hhZG93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgZGVwdGg6IDgwMCxcclxuICAgICAgICAgICAgICBzY2FsZTogMS4zLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGluZHVzdHJ5U2xpZGVyID0gbmV3IFN3aXBlcignLmluZHVzdHJ5X19zbGlkZXInLCB7XHJcbiAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICBhdXRvcGxheToge1xyXG4gICAgICAgICAgZGVsYXk6IDUwMDAsIFxyXG4gICAgICAgICAgZGlzYWJsZU9uSW50ZXJhY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2VudGVyZWRTbGlkZXM6IHRydWUsXHJcbiAgICAgICAgaW5pdGlhbFNsaWRlOiAyLFxyXG4gICAgICAgIHNwZWVkOiAxMjAwLFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICBzcGFjZUJldHdlZW46IDEyLFxyXG4gICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgIGVsOiBcIi5pbmR1c3RyeV9fc2xpZGVyIC5zd2lwZXItcGFnaW5hdGlvblwiLFxyXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQpIHtcclxuICBsZXQgdGltZW91dDtcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcclxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyksIHdhaXQpO1xyXG4gIH07XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gIGluaXRJbmR1c3RyeVNsaWRlcigpO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5vbigncmVzaXplJywgZGVib3VuY2UoZnVuY3Rpb24oKSB7XHJcbiAgaW5pdEluZHVzdHJ5U2xpZGVyKCk7XHJcbn0sIDI1MCkpO1xyXG5cclxuXHJcbmxldCBjb25uZWN0U2xpZGVyID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIGluaXRDb25uZWN0U2xpZGVyKCkge1xyXG4gIGlmKCQoJy5jb25uZWN0X19zbGlkZXInKS5sZW5ndGgpIHtcclxuICAgIGlmIChjb25uZWN0U2xpZGVyKSB7XHJcbiAgICAgIGNvbm5lY3RTbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKTtcclxuICAgICAgY29ubmVjdFNsaWRlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBjb25uZWN0U2xpZGVyID0gbmV3IFN3aXBlcignLmNvbm5lY3RfX3NsaWRlcicsIHtcclxuICAgICAgaW5pdGlhbFNsaWRlOiAxLFxyXG4gICAgICBlZmZlY3Q6ICdjYXJkcycsXHJcbiAgICAgIGF1dG9wbGF5OiB7XHJcbiAgICAgICAgZGVsYXk6IDUwMDAsIFxyXG4gICAgICAgIGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgY2FyZHNFZmZlY3Q6IHtcclxuICAgICAgICBwZXJTbGlkZU9mZnNldDogNyxcclxuICAgICAgICBwZXJTbGlkZVJvdGF0ZTogMixcclxuICAgICAgICByb3RhdGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICBlbDogXCIuY29ubmVjdF9fc2xpZGVyIC5zd2lwZXItcGFnaW5hdGlvblwiLFxyXG4gICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICA2MDE6IHtcclxuICAgICAgICAgIGNhcmRzRWZmZWN0OiB7XHJcbiAgICAgICAgICAgIHBlclNsaWRlT2Zmc2V0OiAxNSxcclxuICAgICAgICAgICAgcGVyU2xpZGVSb3RhdGU6IDIsXHJcbiAgICAgICAgICAgIHJvdGF0ZTogdHJ1ZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAxMjYxOiB7XHJcbiAgICAgICAgICBjYXJkc0VmZmVjdDoge1xyXG4gICAgICAgICAgICBwZXJTbGlkZU9mZnNldDogMTQsXHJcbiAgICAgICAgICAgIHBlclNsaWRlUm90YXRlOiAyLFxyXG4gICAgICAgICAgICByb3RhdGU6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWJvdW5jZTIoZnVuYywgd2FpdCkge1xyXG4gIGxldCB0aW1lb3V0O1xyXG4gIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKSwgd2FpdCk7XHJcbiAgfTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGluaXRDb25uZWN0U2xpZGVyKCk7XHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBkZWJvdW5jZTIoZnVuY3Rpb24gKCkge1xyXG4gIGluaXRDb25uZWN0U2xpZGVyKCk7XHJcbn0sIDI1MCkpO1xyXG5cclxuXHJcbi8vIHZhciBwcmFjdGljZVRodW1icyA9IG5ldyBTd2lwZXIoJy5wcmFjdGljZS1nYWxsZXJ5X190aHVtYnMgLnN3aXBlcicsIHtcclxuLy8gICBzcGFjZUJldHdlZW46IDIsXHJcbi8vICAgc2xpZGVzUGVyVmlldzogNCxcclxuLy8gICBmcmVlTW9kZTogdHJ1ZSxcclxuLy8gICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4vLyAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuLy8gfSk7XHJcbi8vIHZhciBwcmFjdGljZUdhbGxlcnkgPSBuZXcgU3dpcGVyKCcucHJhY3RpY2UtZ2FsbGVyeV9fc2xpZGVyJywge1xyXG4vLyAgIHRodW1iczoge1xyXG4vLyAgICAgc3dpcGVyOiBwcmFjdGljZVRodW1icyxcclxuLy8gICB9LFxyXG4vLyAgIGVmZmVjdDogJ2ZhZGUnLFxyXG4vLyAgIHNwZWVkOiAxNTAwLFxyXG4vLyB9KTtcclxuXHJcbmZ1bmN0aW9uIHByYWN0aWNlVGFiSG92ZXIoKSB7XHJcbiAgLy8gVGFiIGhvdmVyIHByZXZpZXcgaXMgaGFuZGxlZCBpbiBjb21tb24uanMgd2l0aCBHU0FQIG9wYWNpdHkgdHJhbnNpdGlvbnNcclxufVxyXG5wcmFjdGljZVRhYkhvdmVyKCk7XHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdFJldmlld3NTbGlkZXIoKSB7XHJcbiAgY29uc3QgcmV2aWV3c1NsaWRlckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX3NsaWRlcicpO1xyXG4gIGlmICghcmV2aWV3c1NsaWRlckVsKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHJldmlld3NTbGlkZXIgPSBuZXcgU3dpcGVyKCcucmV2aWV3c19fc2xpZGVyJywge1xyXG4gICAgc2xpZGVzUGVyVmlldzogMS4xLFxyXG4gICAgc3BhY2VCZXR3ZWVuOiAxNixcclxuICAgIHNwZWVkOiA2MDAsXHJcbiAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICBlbDogJy5yZXZpZXdzX19wYWdpbmF0aW9uJyxcclxuICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgIDMyMDoge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgIH0sXHJcbiAgICAgIDk5Mzoge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAxOTIsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb246IHtcclxuICAgICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmV2aWV3c19fbWVkaWEuaXMtcGxheWluZycpLmZvckVhY2goZnVuY3Rpb24obWVkaWEpIHtcclxuICAgICAgICAgIGNvbnN0IHZpZGVvID0gbWVkaWEucXVlcnlTZWxlY3RvcignLnJldmlld3NfX3ZpZGVvJyk7XHJcbiAgICAgICAgICBpZiAodmlkZW8gJiYgIXZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvLW1vZGFsJyk7XHJcbiAgY29uc3QgbW9kYWxWaWRlbyA9IG1vZGFsID8gbW9kYWwucXVlcnlTZWxlY3RvcignLnZpZGVvLW1vZGFsX192aWRlbycpIDogbnVsbDtcclxuICBjb25zdCBtb2RhbENsb3NlID0gbW9kYWwgPyBtb2RhbC5xdWVyeVNlbGVjdG9yKCcudmlkZW8tbW9kYWxfX2Nsb3NlJykgOiBudWxsO1xyXG4gIGxldCBhY3RpdmVJbmxpbmVWaWRlbyA9IG51bGw7XHJcblxyXG4gIGZ1bmN0aW9uIHBhdXNlQWxsSW5saW5lVmlkZW9zKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJldmlld3NfX3ZpZGVvJykuZm9yRWFjaChmdW5jdGlvbih2KSB7XHJcbiAgICAgIGlmICghdi5wYXVzZWQpIHtcclxuICAgICAgICB2LnBhdXNlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuICAgIGlmICghbW9kYWwgfHwgIW1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKSByZXR1cm47XHJcbiAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvLW1vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBpZiAobW9kYWxWaWRlbykge1xyXG4gICAgICBpZiAoYWN0aXZlSW5saW5lVmlkZW8pIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgYWN0aXZlSW5saW5lVmlkZW8uY3VycmVudFRpbWUgPSBtb2RhbFZpZGVvLmN1cnJlbnRUaW1lO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge31cclxuICAgICAgfVxyXG4gICAgICBtb2RhbFZpZGVvLnBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFjdGl2ZUlubGluZVZpZGVvKSB7XHJcbiAgICAgIGFjdGl2ZUlubGluZVZpZGVvLnBhdXNlKCk7XHJcbiAgICAgIGFjdGl2ZUlubGluZVZpZGVvID0gbnVsbDtcclxuICAgIH1cclxuICAgIHBhdXNlQWxsSW5saW5lVmlkZW9zKCk7XHJcbiAgfVxyXG5cclxuICBpZiAobW9kYWxDbG9zZSkge1xyXG4gICAgbW9kYWxDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBjbG9zZU1vZGFsKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmIChtb2RhbCkge1xyXG4gICAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gbW9kYWwpIHtcclxuICAgICAgICBjbG9zZU1vZGFsKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHtcclxuICAgICAgICBjbG9zZU1vZGFsKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKG1vZGFsVmlkZW8pIHtcclxuICAgIG1vZGFsVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBwYXVzZUFsbElubGluZVZpZGVvcygpO1xyXG4gICAgfSk7XHJcbiAgICBtb2RhbFZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKG1vZGFsICYmIG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbicpKSB7XHJcbiAgICAgICAgcGF1c2VBbGxJbmxpbmVWaWRlb3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB2aWRlb0NhcmRzID0gcmV2aWV3c1NsaWRlckVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXZpZXdzX19tZWRpYS0tdmlkZW8nKTtcclxuICB2aWRlb0NhcmRzLmZvckVhY2goZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgY29uc3QgcGxheUJ0biA9IGNhcmQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX3BsYXknKTtcclxuICAgIGNvbnN0IHZpZGVvID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fdmlkZW8nKTtcclxuICAgIGNvbnN0IGZ1bGxzY3JlZW5CdG4gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19mdWxsc2NyZWVuJyk7XHJcbiAgICBpZiAoIXZpZGVvKSByZXR1cm47XHJcblxyXG4gICAgLy8gUmVtb3ZlIGFsbCBuYXRpdmUgY29udHJvbHMgZnJvbSBpbmxpbmUgdmlkZW9cclxuICAgIHZpZGVvLmNvbnRyb2xzID0gZmFsc2U7XHJcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgZnVuY3Rpb24oKSB7IHZpZGVvLmNvbnRyb2xzID0gZmFsc2U7IH0pO1xyXG5cclxuICAgIGlmIChwbGF5QnRuKSB7XHJcbiAgICAgIHBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXZpZXdzX19tZWRpYS5pcy1wbGF5aW5nJykuZm9yRWFjaChmdW5jdGlvbihvdGhlckNhcmQpIHtcclxuICAgICAgICAgIGlmIChvdGhlckNhcmQgIT09IGNhcmQpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3RoZXJWaWRlbyA9IG90aGVyQ2FyZC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fdmlkZW8nKTtcclxuICAgICAgICAgICAgaWYgKG90aGVyVmlkZW8pIHtcclxuICAgICAgICAgICAgICBvdGhlclZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3RoZXJDYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBsYXlpbmcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdpcy1wbGF5aW5nJyk7XHJcbiAgICAgICAgdmlkZW8uY29udHJvbHMgPSBmYWxzZTtcclxuICAgICAgICB2aWRlby5wbGF5KCkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1BsYXliYWNrIHByZXZlbnRlZDonLCBlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKHZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgIHZpZGVvLnBsYXkoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2aWRlby5wYXVzZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBsYXlpbmcnKTtcclxuICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGZ1bGxzY3JlZW5CdG4pIHtcclxuICAgICAgZnVsbHNjcmVlbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFtb2RhbCB8fCAhbW9kYWxWaWRlbykgcmV0dXJuO1xyXG4gICAgICAgIGFjdGl2ZUlubGluZVZpZGVvID0gdmlkZW87XHJcblxyXG4gICAgICAgIC8vIEltbWVkaWF0ZWx5IHBhdXNlIHRoZSBpbmxpbmUgdmlkZW8gYW5kIGFsbCBvdGhlciBpbmxpbmUgdmlkZW9zXHJcbiAgICAgICAgdmlkZW8ucGF1c2UoKTtcclxuICAgICAgICBwYXVzZUFsbElubGluZVZpZGVvcygpO1xyXG5cclxuICAgICAgICAvLyBUcmFuc2ZlciBzb3VyY2UgYW5kIGN1cnJlbnRUaW1lIHRvIG1vZGFsIHZpZGVvXHJcbiAgICAgICAgbW9kYWxWaWRlby5zcmMgPSB2aWRlby5jdXJyZW50U3JjIHx8IHZpZGVvLnNyYztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgbW9kYWxWaWRlby5jdXJyZW50VGltZSA9IHZpZGVvLmN1cnJlbnRUaW1lO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge31cclxuXHJcbiAgICAgICAgLy8gT3BlbiB0aGUgZnVsbHNjcmVlbiBtb2RhbCBhbmQgbG9jayBib2R5IHNjcm9sbFxyXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3ZpZGVvLW1vZGFsLW9wZW4nKTtcclxuXHJcbiAgICAgICAgLy8gU3RhcnQgbW9kYWwgdmlkZW8gcGxheWJhY2tcclxuICAgICAgICBtb2RhbFZpZGVvLnBsYXkoKS5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignTW9kYWwgdmlkZW8gcGxheSBwcmV2ZW50ZWQ6JywgZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBpbml0UmV2aWV3c1NsaWRlcigpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxLQUFLLEdBQUcsSUFBSUMsTUFBSixDQUFXLGdCQUFYLEVBQTZCO0VBQ3pDQyxZQUFZLEVBQUUsRUFEMkI7RUFFekNDLGFBQWEsRUFBRSxDQUYwQjtFQUd6Q0MsSUFBSSxFQUFFLEtBSG1DO0VBSXpDQyxXQUFXLEVBQUU7SUFDWCxNQUFNO01BQ0pGLGFBQWEsRUFBRTtJQURYLENBREs7SUFJWCxLQUFLO01BQ0hBLGFBQWEsRUFBRSxHQURaO01BRUhELFlBQVksRUFBRTtJQUZYLENBSk07SUFRWCxLQUFLO01BQ0hDLGFBQWEsRUFBRSxJQURaO01BRUhELFlBQVksRUFBRTtJQUZYLENBUk07SUFZWCxLQUFLO01BQ0hDLGFB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
