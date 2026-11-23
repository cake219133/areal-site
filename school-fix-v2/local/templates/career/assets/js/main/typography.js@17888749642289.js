(function () {
  var typographyWords = 'в|во|без|до|из|к|ко|на|над|под|по|о|об|обо|от|перед|при|через|для|с|со|у|за|про|и|а|но|да|не|ни|то|или|либо|что|чтобы|как|когда|если|вы|мы|the|a|an|on|to|at|up|out|by|of|for|from|and|in|is|am|are|with|or|but';
  var typographyParticles = 'ли|ль|же|ж|бы|б';
  var typographySpace = '[ \\t\\r\\n]';
  var typographyWordPattern = new RegExp('(^|[^А-Яа-яЁёA-Za-z0-9_])(' + typographyWords + ')(' + typographySpace + '+)', 'giu');
  var typographyParticlePattern = new RegExp('([А-Яа-яЁёA-Za-z])(' + typographySpace + '+)(' + typographyParticles + ')(?=' + typographySpace + '+|[,.!?;:]|$)', 'giu');

  function processTextNode(textNode) {
    var parent = textNode.parentElement;

    if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|PRE|CODE|TEXTAREA)$/i.test(parent.tagName) || parent.closest('[contenteditable="true"]')) {
      return;
    }

    var text = textNode.nodeValue;
    var previousText;

    do {
      previousText = text;
      text = text
        .replace(typographyWordPattern, '$1$2\u00a0')
        .replace(typographyParticlePattern, '$1\u00a0$3');
    } while (text !== previousText);

    textNode.nodeValue = text;
  }

  function processTypography(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      processTextNode(walker.currentNode);
    }
  }

  function observeTypography() {
    if (!window.MutationObserver) {
      return;
    }

    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            processTypography(node);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  function initTypography() {
    processTypography(document.body);
    observeTypography();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypography);
  } else {
    initTypography();
  }
})();
