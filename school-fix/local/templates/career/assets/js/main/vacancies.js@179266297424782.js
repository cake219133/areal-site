(function () {
  'use strict';

  function catalogUrl(value) {
    try {
      var url = new URL(value, window.location.origin);
      if (url.origin === window.location.origin && /^\/vacancies\/(?:filter\/.+\/apply\/)?$/.test(url.pathname)) {
        return url.pathname + url.search + url.hash;
      }
    } catch (error) {}
    return '';
  }

  function detailUrl(url) {
    return url.origin === window.location.origin && /^\/vacancies\/vacancy-\d+\/$/.test(url.pathname);
  }

  function initNavigation() {
    var current = new URL(window.location.href);
    var key = 'careerVacancyReturn:';
    var backUrl = '/vacancies/';
    if (detailUrl(current)) {
      try {
        backUrl = catalogUrl(current.searchParams.get('return') || window.sessionStorage.getItem(key + current.pathname)) || backUrl;
      } catch (error) {}
      if (current.searchParams.has('return')) {
        current.searchParams.delete('return');
        window.history.replaceState(window.history.state, '', current.pathname + current.search + current.hash);
      }
      try {
        window.sessionStorage.setItem(key + current.pathname, backUrl);
      } catch (error) {}
      document.querySelectorAll('[data-vacancy-back]').forEach(function (link) {
        link.setAttribute('href', backUrl);
      });
    }

    function rememberReturn(event) {
      var link = event.target.closest('a[href]');
      if (!link) return;
      var destination = new URL(link.href, window.location.href);
      if (!detailUrl(destination)) return;
      destination.searchParams.delete('return');
      link.setAttribute('href', destination.pathname + destination.search + destination.hash);
      var source = new URL(window.location.href);
      var returnUrl = catalogUrl(source.href) || (detailUrl(source) ? backUrl : '/vacancies/');
      try {
        window.sessionStorage.setItem(key + destination.pathname, returnUrl);
      } catch (error) {}
    }

    document.addEventListener('pointerdown', rememberReturn, true);
    document.addEventListener('click', rememberReturn, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
}());

(function () {
  'use strict';

  var search = document.querySelector('[data-vacancy-search]');
  var filter = document.querySelector('[data-vacancy-filter]');
  if (!search) return;

  var searchForm = search.querySelector('[data-vacancy-search-form]');
  if (!searchForm) return;
  var searchBox = search.classList.contains('search')
    ? search
    : search.querySelector('.search--sticky') || search;
  var searchInput = searchForm.querySelector('input[name="q"]');
  var matchSuggestions = search.querySelector('[data-vacancy-suggestions]');
  var defaultSuggestions = search.querySelector('.search__suggestions--default');
  var resetButton = search.querySelector('.search__reset');
  var searchDestination = searchForm.getAttribute('action') || window.location.pathname;
  var searchTimer;
  var requestController;
  var filterRequestController;
  var filterRequestId = 0;
  var preferredTag;
  var deselectedTag;

  if (!searchInput) return;

  function pageUrl(path, queryValue) {
    var url = new URL(path, window.location.origin);
    var query = queryValue === undefined ? searchInput.value.trim() : queryValue.trim();
    url.search = query ? '?q=' + encodeURIComponent(query) : '';
    return url.href;
  }

  function updateSuggestionsState() {
    var focused = document.activeElement === searchInput;
    var query = searchInput.value.trim();
    var showDefault = focused && query === '' && defaultSuggestions
      && defaultSuggestions.querySelector('.search__suggestion') !== null;
    var showMatches = focused && query.length >= 3 && matchSuggestions
      && matchSuggestions.querySelector('.search__suggestion') !== null;

    if (defaultSuggestions) defaultSuggestions.style.display = showDefault ? 'block' : 'none';
    if (matchSuggestions) matchSuggestions.style.display = showMatches ? 'block' : 'none';
  }

  function filterUrl() {
    var groups = selectedFilters();
    var codes = Object.keys(groups);
    var filterContainer = filter.closest('.vacancies__filter');
    var path = filterContainer ? filterContainer.dataset.filterBase : '';
    if (codes.length) {
      path += 'filter/' + codes.map(function (code) {
        return code.toLowerCase() + '-is-' + groups[code].join('-or-');
      }).join('/') + '/apply/';
    }
    return pageUrl(path);
  }

  function normalizedFilters(filters) {
    var result = {};
    Object.keys(filters || {}).sort().forEach(function (code) {
      if (filters[code].length) result[code.toUpperCase()] = filters[code].slice().sort();
    });
    return JSON.stringify(result);
  }

  function selectedFilters() {
    var groups = {};
    filter.querySelectorAll('input:checked[data-url-id]:not([data-filter-default]):not([data-default="true"])').forEach(function (input) {
      var category = input.closest('[data-filter-code]');
      if (!category) return;
      var code = category.dataset.filterCode.toUpperCase();
      if (!groups[code]) groups[code] = [];
      var urlIds = input.dataset.urlIds ? JSON.parse(input.dataset.urlIds) : [input.dataset.urlId];
      urlIds.forEach(function (urlId) {
        if (!groups[code].includes(urlId)) groups[code].push(urlId);
      });
    });
    return groups;
  }

  function tagPreset(tag) {
    try { return JSON.parse(tag.dataset.filterPreset); } catch (error) { return null; }
  }

  function isQuickFilterActive(tag) {
    var preset = tagPreset(tag);
    return preset && normalizedFilters(preset.filters) === normalizedFilters(selectedFilters())
      && (!preset.hasQuery || preset.query === searchInput.value.trim());
  }

  function updateHeroTagUrls() {
    if (filter) return;
    search.querySelectorAll('[data-vacancy-tag-url]').forEach(function (tag) {
      var url = new URL(tag.dataset.vacancyTagUrl, window.location.origin);
      if (!url.searchParams.has('q') && searchInput.value.trim()) url.searchParams.set('q', searchInput.value.trim());
      tag.href = url.href;
    });
  }

  function saveHistory(value) {
    if (!value) return;
    var history = readHistory().filter(function (item) { return item !== value; });
    history.unshift(value);
    document.cookie = 'vacancy_search_history=' + encodeURIComponent(JSON.stringify(history.slice(0, 5))) + '; max-age=2592000; path=/; SameSite=Lax';
  }

  function readHistory() {
    var cookie = document.cookie.split('; ').find(function (item) { return item.indexOf('vacancy_search_history=') === 0; });
    if (!cookie) return [];
    try {
      var value = JSON.parse(decodeURIComponent(cookie.split('=').slice(1).join('=')));
      return Array.isArray(value)
        ? value.filter(function (item) { return typeof item === 'string'; }).slice(0, 5)
        : [];
    } catch (error) {
      return [];
    }
  }

  function submitSearch() {
    deselectedTag = null;
    saveHistory(searchInput.value.trim());
    clearTimeout(searchTimer);
    if (requestController) requestController.abort();
    searchInput.blur();
    updateSuggestionsState();
    if (filter) {
      renderHistory();
      submitFilter(filterUrl());
    } else {
      window.location.assign(pageUrl(searchDestination));
    }
  }

  function filterSearch(input) {
    var query = input.value.trim().toLowerCase();
    input.closest('[data-filter-code]').querySelectorAll('.custom-checkbox, .custom-radio').forEach(function (control) {
      var value = control.querySelector('input');
      if (value) control.style.display = (value.dataset.name || '').toLowerCase().includes(query) ? '' : 'none';
    });
  }

  function replaceFilterControls(html) {
    if (typeof html !== 'string') return;
    var page = new DOMParser().parseFromString(html, 'text/html');
    var nextMain = page.querySelector('.filter__main');
    var main = filter.querySelector('.filter__main');
    if (!nextMain || !main) return;
    var states = {};
    main.querySelectorAll('[data-filter-code]').forEach(function (category) {
      var input = category.querySelector('.filter__search');
      states[category.dataset.filterCode] = {
        open: category.querySelector('.filter__block').style.display,
        query: input ? input.value : ''
      };
    });
    var scrollTop = main.scrollTop;
    main.replaceChildren.apply(main, Array.from(nextMain.children));
    main.querySelectorAll('[data-filter-code]').forEach(function (category) {
      var state = states[category.dataset.filterCode];
      if (!state) return;
      category.querySelector('.filter__block').style.display = state.open;
      var input = category.querySelector('.filter__search');
      if (input) {
        input.value = state.query;
        filterSearch(input);
      }
    });
    main.scrollTop = scrollTop;
  }

  function updateFilterControls(data) {
    if (!filter || !data || !data.ITEMS) return;

    Object.keys(data.ITEMS).forEach(function (propertyId) {
      var item = data.ITEMS[propertyId];
      if (!item || !item.VALUES) return;

      Object.keys(item.VALUES).forEach(function (valueId) {
        var value = item.VALUES[valueId];
        if (!value || !value.CONTROL_ID) return;

        var input = Array.from(filter.querySelectorAll('input[type="checkbox"], input[type="radio"]')).find(function (candidate) {
          return candidate.id === value.CONTROL_ID;
        });
        if (!input) return;

        if (Object.prototype.hasOwnProperty.call(value, 'CHECKED')) input.checked = Boolean(value.CHECKED);
        input.disabled = Boolean(value.DISABLED) && !input.checked;
        var control = input.closest('[data-filter-control]') || input.closest('.custom-checkbox, .custom-radio');
        if (control) control.classList.toggle('disabled', input.disabled);

        if (Object.prototype.hasOwnProperty.call(value, 'ELEMENT_COUNT')) {
          var count = Array.from(filter.querySelectorAll('[data-filter-count]')).find(function (candidate) {
            return candidate.dataset.filterCount === value.CONTROL_ID;
          });
          if (count) count.textContent = value.ELEMENT_COUNT || '';
        }
      });
    });

    var total = filter.querySelector('[data-filter-total]');
    if (total && Object.prototype.hasOwnProperty.call(data, 'ELEMENT_COUNT')) {
      total.textContent = data.ELEMENT_COUNT;
    }
  }

  function bindFilterButton(button) {
    if (!button || button.dataset.vacancyAjaxBound) return;
    button.dataset.vacancyAjaxBound = '1';
    button.addEventListener('click', function () {
      var filterContainer = document.querySelector('.vacancies__filter');
      if (!filterContainer) return;

      filterContainer.style.display = 'block';
      if (typeof bodyFixed === 'function') bodyFixed();
    });
  }

  function replaceVacancyResults(page) {
    var currentResults = document.querySelector('.vacancies__results');
    var nextResults = typeof page === 'string' ? null : page.querySelector('.vacancies__results');
    if (typeof page === 'string') {
      var template = document.createElement('template');
      template.innerHTML = page.trim();
      nextResults = template.content.querySelector('.vacancies__results');
    }
    if (!nextResults) throw new Error('Vacancies results not found');

    if (currentResults) {
      currentResults.replaceWith(nextResults.cloneNode(true));
    }
    bindFilterButton(document.querySelector('.vacancies__results .btn--filter'));
  }

  function closeMobileFilter() {
    if (window.innerWidth > 992) return;
    var filterContainer = filter && filter.closest('.vacancies__filter');
    var closeButton = filterContainer && filterContainer.querySelector('.filter__close');
    if (closeButton) {
      closeButton.click();
      return;
    }
    if (filterContainer) filterContainer.style.display = 'none';
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
  }

  function submitFilter(url, updateHistory) {
    if (!filter) return;
    var requestUrl = new URL(url || filterUrl(), window.location.origin);
    var currentRequestId = ++filterRequestId;
    if (filterRequestController) filterRequestController.abort();
    filterRequestController = new AbortController();
    var formData = new FormData(filter);
    formData.set('ajax', 'y');
    formData.set('filter_url', requestUrl.pathname + requestUrl.search);
    formData.set('q', searchInput.value.trim());
    filter.setAttribute('aria-busy', 'true');

    fetch(filter.dataset.filterAjaxUrl || searchDestination, {
      method: 'POST',
      body: formData,
      signal: filterRequestController.signal,
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(function (response) {
      if (!response.ok) throw new Error('Vacancies filter request failed');
      return response.json();
    }).then(function (data) {
      if (currentRequestId !== filterRequestId) return;
      if (!data || typeof data.RESULTS_HTML !== 'string' || typeof data.FILTER_URL !== 'string') {
        throw new Error('Vacancies results are missing');
      }
      replaceFilterControls(data.FILTER_HTML);
      updateFilterControls(data);
      replaceVacancyResults(data.RESULTS_HTML);
      searchInput.value = data.QUERY || '';
      if (resetButton) resetButton.style.display = searchInput.value ? 'block' : 'none';
      if (updateHistory !== false) window.history.pushState({}, '', data.FILTER_URL);
      updateFilterState();
      showMore();
    }).catch(function (error) {
      if (currentRequestId === filterRequestId && error.name !== 'AbortError') updateFilterState();
    }).finally(function () {
      if (currentRequestId === filterRequestId) filter.removeAttribute('aria-busy');
    });
  }

  function renderSuggestions(items, container) {
    container.innerHTML = '';
    items.forEach(function (item) {
      var suggestion = typeof item === 'string' ? { text: item } : item;
      var link = document.createElement('a');
      link.className = 'search__suggestion' + (suggestion.history ? ' search__suggestion--history' : '');
      link.href = suggestion.href || suggestion.DETAIL_PAGE_URL || pageUrl(searchDestination, suggestion.text || suggestion.NAME);
      link.textContent = suggestion.text || suggestion.NAME;
      if (suggestion.detail || suggestion.DETAIL_PAGE_URL) link.dataset.vacancyDetail = '1';
      container.appendChild(link);
    });
  }

  function renderHistory() {
    if (!defaultSuggestions) return;
    var history = readHistory().slice(0, 5);
    var adminSuggestions = Array.from(defaultSuggestions.querySelectorAll('[data-vacancy-detail]')).slice(0, 5);
    var historyItems = history.map(function (value) { return { text: value, history: true }; });
    var adminItems = adminSuggestions.map(function (item) {
      return { text: item.textContent.trim(), href: item.getAttribute('href'), detail: true };
    });
    renderSuggestions(historyItems.concat(adminItems), defaultSuggestions);
  }

  function loadSuggestions() {
    if (!matchSuggestions) return;
    var query = searchInput.value.trim();
    clearTimeout(searchTimer);
    if (requestController) requestController.abort();
    if (query.length < 3) {
      matchSuggestions.innerHTML = '';
      updateSuggestionsState();
      return;
    }

    matchSuggestions.innerHTML = '';
    updateSuggestionsState();

    searchTimer = setTimeout(function () {
      requestController = new AbortController();
      var endpoint = search.dataset.vacancySearchEndpoint || '/career/ajax/vacancies-search.php';
      fetch(endpoint + '?q=' + encodeURIComponent(query), {
        signal: requestController.signal,
        credentials: 'same-origin'
      }).then(function (response) {
        return response.ok ? response.json() : { items: [] };
      }).then(function (data) {
        if (searchInput.value.trim() !== query) return;
        renderSuggestions(Array.isArray(data.items) ? data.items : [], matchSuggestions);
        updateSuggestionsState();
      }).catch(function (error) {
        if (searchInput.value.trim() !== query) return;
        if (error.name !== 'AbortError') renderSuggestions([], matchSuggestions);
        updateSuggestionsState();
      });
    }, 200);
  }

  function updateFilterState() {
    if (!filter) return;
    var activeCategories = 0;
    var activeFilters = 0;
    filter.querySelectorAll('[data-filter-code]').forEach(function (category) {
      var checked = Array.from(category.querySelectorAll('input:checked:not([data-filter-default]):not([data-default="true"])'));
      activeFilters += checked.length;
      var count = category.querySelector('.filter__title span');
      if (count) {
        count.textContent = checked.length || '';
        count.classList.toggle('show', checked.length > 0);
      }
      if (checked.length) activeCategories++;
    });
    var filterButtonCount = document.querySelector('.btn--filter span');
    if (filterButtonCount) {
      filterButtonCount.textContent = activeCategories || '';
      filterButtonCount.classList.toggle('show', activeCategories > 0);
    }
    var resetButton = filter.querySelector('.btn--reset');
    var filterBottom = filter.querySelector('.filter__bottom');
    if (resetButton) resetButton.style.display = activeFilters > 0 ? '' : 'none';
    if (filterBottom) filterBottom.style.display = window.innerWidth <= 992 || activeFilters > 0 ? 'block' : 'none';
    var tags = Array.from(search.querySelectorAll('[data-filter-preset]'));
    var activeTag = preferredTag && isQuickFilterActive(preferredTag)
      ? preferredTag : tags.find(function (tag) { return tag !== deselectedTag && isQuickFilterActive(tag); });
    tags.forEach(function (tag) {
      tag.classList.toggle('active', tag === activeTag);
      tag.setAttribute('aria-pressed', tag === activeTag ? 'true' : 'false');
    });
  }

  function showMore() {
    var list = document.querySelector('[data-vacancies-list]');
    var button = document.querySelector('[data-more]');
    if (!list || !button || button.dataset.vacancyMoreBound) return;
    button.dataset.vacancyMoreBound = '1';

    button.addEventListener('click', function () {
      var nextUrl = button.dataset.moreUrl;
      if (!nextUrl || button.disabled) return;

      button.disabled = true;
      fetch(nextUrl, { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Vacancies page request failed');
          return response.text();
        })
        .then(function (html) {
          var page = new DOMParser().parseFromString(html, 'text/html');
          var nextList = page.querySelector('[data-vacancies-list]');
          if (!nextList) throw new Error('Vacancies list not found');

          nextList.querySelectorAll('[data-vacancy-card]').forEach(function (card) {
            button.before(card);
          });

          var nextButton = nextList.querySelector('[data-more]');
          var nextPageUrl = nextButton ? nextButton.dataset.moreUrl : '';
          button.dataset.moreUrl = nextPageUrl || '';
          button.disabled = false;
          if (!nextPageUrl) button.remove();
        })
        .catch(function () {
          button.disabled = false;
        });
    });
  }

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    submitSearch();
  });
  searchInput.addEventListener('focus', function () {
    updateSuggestionsState();
    if (searchInput.value.trim().length >= 3) loadSuggestions();
  });
  searchInput.addEventListener('blur', function (event) {
    var relatedTarget = event.relatedTarget;
    if (relatedTarget && relatedTarget.closest && relatedTarget.closest('.search__suggestion')) return;
    updateSuggestionsState();
  });
  searchInput.addEventListener('input', function () {
    updateHeroTagUrls();
    updateSuggestionsState();
    loadSuggestions();
  });
  if (resetButton) {
    resetButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      searchInput.value = '';
      if (requestController) requestController.abort();
      if (matchSuggestions) matchSuggestions.innerHTML = '';
      submitSearch();
    });
  }
  searchBox.addEventListener('click', function (event) {
    var suggestion = event.target.closest('.search__suggestion');
    if (!suggestion) return;
    if (suggestion.dataset.vacancyDetail) return;
    event.preventDefault();
    searchInput.value = suggestion.textContent.trim();
    submitSearch();
  });
  document.addEventListener('click', function (event) {
    if (!searchBox.contains(event.target)) {
      if (document.activeElement === searchInput) searchInput.blur();
      updateSuggestionsState();
    }
  });
  if (filter) {
    search.querySelectorAll('[data-filter-preset]').forEach(function (tag) {
      tag.addEventListener('click', function (event) {
        event.stopPropagation();
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        var preset = tagPreset(tag);
        if (!preset) return;
        var active = tag.classList.contains('active');
        preferredTag = active ? null : tag;
        deselectedTag = active ? tag : null;
        if (active) {
          searchInput.value = '';
          if (resetButton) resetButton.style.display = 'none';
          updateSuggestionsState();
        }
        var url = active
          ? new URL(pageUrl(searchDestination), window.location.origin)
          : new URL(tag.href, window.location.origin);
        if (!url.searchParams.has('q') && searchInput.value.trim()) url.searchParams.set('q', searchInput.value.trim());
        clearTimeout(searchTimer);
        if (requestController) requestController.abort();
        submitFilter(url.href);
      });
    });
    filter.addEventListener('input', function (event) {
      if (event.target.matches('.filter__search')) filterSearch(event.target);
    });
    filter.addEventListener('click', function (event) {
      if (window.innerWidth > 992) return;
      var title = event.target.closest('.filter__title');
      var back = event.target.closest('.filter__back');
      if (title) title.closest('[data-filter-code]').querySelector('.filter__block').style.display = 'block';
      if (back) back.closest('.filter__block').style.display = 'none';
    });
    filter.addEventListener('change', function (event) {
      if (!event.target.matches('input[type="checkbox"], input[type="radio"]')) return;
      event.stopPropagation();
      deselectedTag = null;
      if (event.target.type === 'radio' && event.target.matches('[data-filter-default-option]')) {
        event.target.setAttribute('data-filter-default', '1');
      } else if (event.target.type === 'radio') {
        var category = event.target.closest('[data-filter-code]');
        if (category) category.querySelectorAll('[data-filter-default]').forEach(function (input) { input.removeAttribute('data-filter-default'); });
      }
      updateFilterState();
      submitFilter();
    });
    filter.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (window.innerWidth <= 992) {
        closeMobileFilter();
      } else {
        submitFilter();
      }
    });
    var resetFilterButton = filter.querySelector('.btn--reset');
    if (resetFilterButton) {
      resetFilterButton.addEventListener('click', function (event) {
        event.stopPropagation();
        deselectedTag = null;
        filter.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (input) { input.checked = false; });
        var defaultInput = filter.querySelector('[data-filter-default-option]') || filter.querySelector('[data-filter-code="EXPERIENCE"] input[type="radio"]');
        if (defaultInput) defaultInput.setAttribute('data-filter-default', '1');
        if (defaultInput) defaultInput.checked = true;
        updateFilterState();
        submitFilter();
      });
    }
  }

  renderHistory();
  updateHeroTagUrls();
  updateSuggestionsState();
  if (resetButton && searchInput.value) resetButton.style.display = 'block';
  if (filter) {
    updateFilterState();
    if (document.readyState === 'complete') {
      updateFilterState();
    } else {
      window.addEventListener('load', updateFilterState);
    }
  }
  showMore();
  window.addEventListener('popstate', function () {
    if (filter) {
      deselectedTag = null;
      searchInput.value = new URL(window.location.href).searchParams.get('q') || '';
      submitFilter(window.location.href, false);
    }
  });
}());
