(function () {
  'use strict';

  var popular = document.querySelector('[data-popular-vacancies]');
  if (!popular) return;

  var list = popular.querySelector('[data-popular-list]');
  var tags = Array.from(popular.querySelectorAll('[data-popular-tag]'));
  var endpoint = popular.dataset.popularEndpoint;
  var requestController;
  var requestId = 0;
  var successfulTag = null;

  if (!list || !endpoint || !tags.length) return;

  function appendInfo(container, className, value, extraClass) {
    if (!value) return;
    var item = document.createElement('div');
    item.className = className + (extraClass || '');
    item.textContent = value;
    container.appendChild(item);
  }

  function render(items) {
    list.innerHTML = '';
    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'vacancy-card';

      var link = document.createElement('a');
      link.className = 'full';
      link.href = item.DETAIL_PAGE_URL || '#';
      link.setAttribute('aria-label', item.NAME || '');
      card.appendChild(link);

      var title = document.createElement('div');
      title.className = 'vacancy-card__title';
      title.textContent = item.NAME || '';
      card.appendChild(title);

      var info = document.createElement('div');
      info.className = 'vacancy-card__info';
      appendInfo(info, 'vacancy-card__experience', item.EXPERIENCE, item.EXPERIENCE_XML_ID === 'no-experience' ? ' vacancy-card__experience--special' : '');
      appendInfo(info, 'vacancy-card__employment', item.EMPLOYMENT);
      appendInfo(info, 'vacancy-card__place', item.REGION);
      appendInfo(info, 'vacancy-card__mine', item.ENTERPRISE);
      card.appendChild(info);

      var icon = document.createElement('div');
      icon.className = 'vacancy-card__icon';
      icon.innerHTML = '<svg><use xlink:href="' + popular.dataset.popularIcon + '"></use></svg>';
      card.appendChild(icon);
      list.appendChild(card);
    });
  }

  function setActiveTag(activeTag) {
    tags.forEach(function (tag) {
      var active = tag === activeTag;
      tag.classList.toggle('active', active);
      tag.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function load(tagId, activeTag) {
    if (requestController) requestController.abort();
    requestController = new AbortController();
    var currentRequestId = ++requestId;
    var url = new URL(endpoint, window.location.origin);
    if (tagId) url.searchParams.set('tag', tagId);
    popular.setAttribute('aria-busy', 'true');

    fetch(url.href, { signal: requestController.signal, credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Popular vacancies request failed');
        return response.json();
      })
      .then(function (data) {
        if (currentRequestId !== requestId) return;
        successfulTag = activeTag;
        render(Array.isArray(data.items) ? data.items : []);
      })
      .catch(function (error) {
        if (currentRequestId === requestId && error.name !== 'AbortError') setActiveTag(successfulTag);
      })
      .finally(function () {
        if (currentRequestId === requestId) popular.removeAttribute('aria-busy');
      });
  }

  tags.forEach(function (tag) {
    tag.addEventListener('click', function (event) {
      event.preventDefault();
      var active = tag.classList.contains('active');
      setActiveTag(active ? null : tag);
      load(active ? null : tag.dataset.popularTag, active ? null : tag);
    });
  });
}());
