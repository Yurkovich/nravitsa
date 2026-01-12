const HANGING_WORDS = [
  'в', 'во', 'к', 'ко', 'с', 'со', 'у', 'о', 'об', 'обо',
  'от', 'ото', 'из', 'изо', 'над', 'под', 'по', 'за',
  'и', 'а', 'но', 'да', 'или', 'либо', 'что', 'чтобы',
  'как', 'будто', 'словно', 'точно', 'не', 'ни', 'же',
  'ли', 'бы', 'б', 'ль', 'ли', 'то', 'либо', 'нибудь'
];

function processTextNode(node) {
  const text = node.textContent;
  
  const hangingWordsRegex = new RegExp(
    `(^|\\s)(${HANGING_WORDS.join('|')})\\s+([а-яёa-z])`,
    'gi'
  );
  
  const newText = text.replace(hangingWordsRegex, (match, spaceBefore, hangingWord, nextChar) => {
    return `${spaceBefore}${hangingWord}\u00A0${nextChar}`;
  });
  
  if (newText !== text) {
    node.textContent = newText;
  }
}

function walkTextNodes(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  const textNodes = [];
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  textNodes.forEach(processTextNode);
}

function fixOrphans() {
  const elements = document.querySelectorAll('[data-fix-orphans]');
  
  elements.forEach(element => {
    walkTextNodes(element);
  });
}

function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.hasAttribute('data-fix-orphans')) {
            walkTextNodes(node);
          }
          const elements = node.querySelectorAll('[data-fix-orphans]');
          elements.forEach(el => walkTextNodes(el));
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function initOrphanFixer(options = {}) {
  const config = {
    autoObserve: true,
    customWords: [],
    ...options
  };
  
  if (config.customWords.length > 0) {
    HANGING_WORDS.push(...config.customWords.map(w => w.toLowerCase()));
  }
  
  fixOrphans();
  
  if (config.autoObserve) {
    observeDOM();
  }
  
  window.addEventListener('resize', fixOrphans);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fixOrphans,
    initOrphanFixer,
    HANGING_WORDS
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initOrphanFixer());
} else {
  initOrphanFixer();
}