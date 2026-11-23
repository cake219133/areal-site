"use strict";

$(document).ready(function () {
  $('.form[data-feedback-form]').each(function () {
    var $form = $(this);
    var $formWrapper = $form.closest('.feedback__form');
    var $formMain = $form.closest('.feedback__main');
    var $formSuccess = $formMain.find('.feedback__success');
    var $submitBtn = $form.find('[data-feedback-next]');
    var $captcha = $formMain.find('[data-feedback-captcha]');
    var $confirmBtn = $captcha.find('[data-feedback-confirm]');
    var $refreshBtn = $captcha.find('[data-feedback-captcha-refresh]');
    var $requiredInputs = $form.find('[required]');
    var $consentCheckbox = $form.find('.custom-checkbox input[type="checkbox"]');
    var $feedbackError = $form.find('[data-feedback-error]');
    var $captchaSid = $form.find('input[name="captcha_sid"]');
    var $captchaWord = $captcha.find('input[name="captcha_word"]');
    var $captchaImage = $captcha.find('[data-feedback-captcha-image]');
    var $captchaError = $captcha.find('[data-feedback-captcha-error]');
    var captchaRequest = 0;
    var captchaReady = false;
    var captchaStep = false;
    var isSubmitting = false;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $form.off('submit');

    function getValue($input) {
      return String($input.val() || '').trim();
    }

    function getError($input) {
      return $input.closest('.form__input, .form__select, .feedback__bottom').find('.form__error').first();
    }

    function showError($input, message) {
      var $error = getError($input);

      if ($error.length) {
        $error.text(message).show().addClass('is-visible');
      }

      $input.addClass('error');
    }

    function clearError($input) {
      var $error = getError($input);

      if ($error.length) {
        $error.hide().removeClass('is-visible');
      }

      $input.removeClass('error');
    }

    function toggleSubmit() {
      var allRequiredFilled = $requiredInputs.toArray().every(function (input) {
        var $input = $(input);

        if (input.type === 'checkbox') {
          return $input.is(':checked');
        }

        return getValue($input) !== '';
      });
      var noInvalidFiles = $form.find('input[type="file"]').toArray().every(function (input) {
        return !$(input).hasClass('is-invalid');
      });
      var consentChecked = $consentCheckbox.length ? $consentCheckbox.is(':checked') : true;

      var firstStepReady = allRequiredFilled && consentChecked && noInvalidFiles;
      $submitBtn.prop('disabled', isSubmitting || !firstStepReady);
      $confirmBtn.prop('disabled', !(captchaStep && captchaReady && !isSubmitting && firstStepReady && getValue($captchaWord) !== ''));
      $refreshBtn.prop('disabled', isSubmitting);
    }

    function showFirstStep() {
      captchaStep = false;
      $captcha.removeClass('show');
      $captchaWord.prop('disabled', true);
      $form.show();
      toggleSubmit();
    }

    function refreshCaptcha() {
      var request = ++captchaRequest;
      captchaReady = false;
      $captchaSid.val('');
      $captchaWord.val('').prop('disabled', true);
      $captcha.attr('aria-busy', 'true');
      $captchaError.hide().removeClass('is-visible').text('');
      clearError($captchaWord);
      $captchaImage.off('load.feedbackCaptcha error.feedbackCaptcha');
      toggleSubmit();

      var url = new URL($form[0].action, window.location.href);
      url.searchParams.set('captcha', 'Y');

      fetch(url.toString(), {cache: 'no-store', credentials: 'same-origin'}).then(function (response) {
        if (!response.ok) {
          throw new Error('Не удалось загрузить код');
        }

        return response.json();
      }).then(function (data) {
        if (request !== captchaRequest) {
          return;
        }

        if (!data || data.success !== true || typeof data.captcha_sid !== 'string' || !/^[a-f0-9]{32}$/i.test(data.captcha_sid) || typeof data.sessid !== 'string' || !/^[a-f0-9]{32}$/i.test(data.sessid) || typeof data.captcha_src !== 'string') {
          throw new Error('Не удалось загрузить код');
        }

        var captchaUrl = new URL(data.captcha_src, window.location.href);
        if (captchaUrl.origin !== window.location.origin || captchaUrl.searchParams.get('captcha_sid') !== data.captcha_sid) {
          throw new Error('Не удалось загрузить код');
        }

        return new Promise(function (resolve, reject) {
          $captchaImage.on('load.feedbackCaptcha', function () {
            if (request === captchaRequest && this.complete && this.naturalWidth > 0) {
              resolve(data);
            }
          }).on('error.feedbackCaptcha', function () {
            if (request === captchaRequest && this.complete && this.naturalWidth === 0) {
              reject(new Error('Не удалось загрузить код'));
            }
          }).attr('src', captchaUrl.toString()).prop('hidden', false);
        });
      }).then(function (data) {
        if (!data || request !== captchaRequest) {
          return;
        }

        $captchaSid.val(data.captcha_sid);
        $form.find('input[name="sessid"]').val(data.sessid);
        $captchaWord.prop('disabled', false);
        captchaReady = true;
        $captcha.attr('aria-busy', 'false');
        toggleSubmit();
        if (captchaStep) {
          $captchaWord.trigger('focus');
        }
      }).catch(function () {
        if (request !== captchaRequest) {
          return;
        }

        captchaReady = false;
        $captchaSid.val('');
        $captchaWord.val('');
        $captcha.attr('aria-busy', 'false');
        $captchaImage.prop('hidden', true);
        var message = 'Не удалось загрузить код. Нажмите кнопку обновления, чтобы повторить попытку.';
        $captchaError.text(message).show().addClass('is-visible');
        toggleSubmit();
      });
    }

    $requiredInputs.each(function () {
      $(this).on('blur', function () {
        if ($(this).val() === '') {
          $(this).closest('.form__input').find('.form__error').show();
        }
      });
      $(this).on('input', function () {
        if ($(this).val() !== '') {
          $(this).closest('.form__input').find('.form__error').hide();
        }
      });
    });

    function validateForm() {
      var isValid = true;

      $requiredInputs.each(function () {
        var $input = $(this);
        var filled = this.type === 'checkbox' ? $input.is(':checked') : getValue($input) !== '';

        if (!filled) {
          showError($input, 'Обязательное поле');
          isValid = false;
        } else {
          clearError($input);
        }
      });

      if ($form.find('input[type="file"].is-invalid').length) {
        isValid = false;
      }

      var $emailInput = $form.find('input[name="email"]');
      var emailValue = getValue($emailInput);

      if (emailValue !== '' && !emailPattern.test(emailValue)) {
        showError($emailInput, 'Введите корректный e-mail');
        isValid = false;
      } else if (emailValue !== '') {
        clearError($emailInput);
      }

      var $phoneInput = $form.find('input[name="phone"]');
      var phoneValue = getValue($phoneInput);

      if (phoneValue !== '' && phoneValue.replace(/\D/g, '').length !== 11) {
        showError($phoneInput, 'Номер должен содержать 11 цифр');
        isValid = false;
      } else if (phoneValue !== '') {
        clearError($phoneInput);
      }

      if ($consentCheckbox.length && !$consentCheckbox.is(':checked')) {
        showError($consentCheckbox, 'Необходимо дать согласие на обработку данных');
        isValid = false;
      }

      return isValid;
    }

    $form.on('change', 'input[type="file"]', function () {
      var $input = $(this);
      var file = this.files[0];
      var message = 'Допустимые форматы резюме: JPG, JPEG, PNG, PDF или DOCX';
      if (file && (file.size === 0 || file.size > 10 * 1024 * 1024)) {
        message = file.size === 0 ? 'Файл резюме пустой' : 'Размер резюме не должен превышать 10 МБ';
        $input.val('').triggerHandler('change');
        $input.addClass('is-invalid');
      }
      if ($input.hasClass('is-invalid')) {
        showError($input, message);
        $input.attr('aria-invalid', 'true');
        $input.next('span').find('.form__icon--attach').hide();
        $input.next('span').find('.form__icon--delete').show();
      } else {
        clearError($input);
        $input.removeAttr('aria-invalid');
      }
      setTimeout(toggleSubmit, 0);
    });
    $form.on('click', '.form__icon--delete', function () {
      var $input = $(this).closest('.form__input--file').find('input[type="file"]');
      $input.removeClass('is-invalid').removeAttr('aria-invalid');
      clearError($input);
      toggleSubmit();
    });
    $requiredInputs.add($consentCheckbox).on('input change', function () {
      clearError($(this));
      toggleSubmit();
    });
    $form.find('input:not([type="file"]), select').on('input change', function () {
      clearError($(this));
      toggleSubmit();
    });

    $captchaWord.on('input change', function () {
      clearError($captchaWord);
      toggleSubmit();
    });
    $refreshBtn.on('click', function (e) {
      e.preventDefault();
      if (isSubmitting) {
        return;
      }

      refreshCaptcha();
    });

    $form.on('submit', function (e) {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (!validateForm()) {
        showFirstStep();
        var $firstError = $form.find(':input.error').first();

        if ($firstError.length) {
          $firstError[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          $firstError.trigger('focus');
        }

        return;
      }

      if (!captchaStep) {
        captchaStep = true;
        $feedbackError.hide().removeClass('is-visible').text('');
        $form.hide();
        $captcha.addClass('show');
        refreshCaptcha();
        return;
      }

      if (!captchaReady || getValue($captchaWord) === '') {
        if (captchaReady) {
          showError($captchaWord, 'Обязательное поле');
          $captchaWord.trigger('focus');
        }
        return;
      }

      var form = this;
      isSubmitting = true;
      toggleSubmit();
      $captchaError.hide().removeClass('is-visible').text('');

      var formData = new FormData(form);
      formData.set('sessid', getValue($form.find('input[name="sessid"]')));

      fetch(form.action, { method: 'POST', body: formData, credentials: 'same-origin' }).then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || !data.success) {
            var error = new Error(data.message || 'Не удалось отправить отклик');
            error.status = response.status;
            error.field = data.field;
            throw error;
          }
        });
      }).then(function () {
        $formWrapper.hide();
        $captcha.removeClass('show');
        $formSuccess.show();
      }).catch(function (error) {
        isSubmitting = false;
        captchaReady = false;
        $captchaSid.val('');
        $captchaWord.val('').prop('disabled', true);
        if ((error.status === 400 && error.field !== 'captcha_word') || error.status === 413 || error.status === 415) {
          showFirstStep();
          $feedbackError.text(error.message || 'Не удалось отправить отклик').show().addClass('is-visible');
        } else if (error.status === 400 && error.field === 'captcha_word') {
          refreshCaptcha();
          $captchaError.text('Код введён неверно. Введите код с новой картинки.').show().addClass('is-visible');
        } else {
          $captchaError.text((error.message || 'Не удалось отправить отклик') + '. Обновите код кнопкой обновления и повторите попытку.').show().addClass('is-visible');
        }
        toggleSubmit();
      });
    });

    toggleSubmit();
  });
});
