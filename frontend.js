document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ipg[data-ipg]').forEach(initIPGallery);
});

function initIPGallery(root) {
  if (root.__ipgDone) return; root.__ipgDone = true;

  const placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 3 2"></svg>';
  const imgs = root.querySelectorAll('.img-gallery img');
  const imgArr = Array.from(imgs);

  // Lazy prep
  imgArr.forEach(img => {
    if (!img.dataset.ipgSrc) {
      img.dataset.ipgSrc = img.currentSrc || img.src;
      if (img.getAttribute('srcset')) { img.dataset.ipgSrcset = img.getAttribute('srcset'); img.removeAttribute('srcset'); }
      if (img.getAttribute('sizes'))  { img.dataset.ipgSizes  = img.getAttribute('sizes');  img.removeAttribute('sizes'); }
      img.src = placeholder;
      img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    }
    img.style.cursor = 'zoom-in';
  });

  const restore = el => {
    if (!el) return;
    if (el.dataset.ipgSrc)    el.src = el.dataset.ipgSrc;
    if (el.dataset.ipgSrcset) el.setAttribute('srcset', el.dataset.ipgSrcset);
    if (el.dataset.ipgSizes)  el.setAttribute('sizes', el.dataset.ipgSizes);
    el.addEventListener('load', () => el.classList.add('is-loaded'), { once:true });
  };

  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { restore(entry.target); obs.unobserve(entry.target); }
        });
      }, { root: null, rootMargin: '300px 0px', threshold: 0.01 })
    : null;

  imgArr.forEach(img => { if (io) io.observe(img); else restore(img); });

  // Lightbox with Prev/Next
  const overlay = document.createElement('div');
  overlay.className = 'ipg__lightbox';
  overlay.innerHTML = `
    <button class="ipg__close" aria-label="Close (Esc)">&times;</button>
    <button class="ipg__nav ipg__prev" aria-label="Previous (Left Arrow)">&#10094;</button>
    <button class="ipg__nav ipg__next" aria-label="Next (Right Arrow)">&#10095;</button>
    <figure class="ipg__figure">
      <img class="ipg__img" alt="">
      <figcaption class="ipg__caption"></figcaption>
    </figure>
  `;
  root.appendChild(overlay);

  const lbImg   = overlay.querySelector('.ipg__img');
  const lbCap   = overlay.querySelector('.ipg__caption');
  const lbClose = overlay.querySelector('.ipg__close');
  const lbPrev  = overlay.querySelector('.ipg__prev');
  const lbNext  = overlay.querySelector('.ipg__next');

  let lastActive = null;
  let current = -1;

  function setFromIndex(i) {
    if (!imgArr.length) return;
    current = (i + imgArr.length) % imgArr.length;
    const it = imgArr[current];
    lbImg.src = it.dataset.ipgSrc || it.src;
    lbImg.alt = it.alt || '';
    const fig = it.closest('figure');
    lbCap.textContent = (fig && fig.querySelector('figcaption')?.textContent) || it.alt || '';
    const n1 = imgArr[(current + 1) % imgArr.length], p1 = imgArr[(current - 1 + imgArr.length) % imgArr.length];
    if (n1?.dataset.ipgSrc) new Image().src = n1.dataset.ipgSrc;
    if (p1?.dataset.ipgSrc) new Image().src = p1.dataset.ipgSrc;
  }

  function open(img) {
    overlay.classList.add('is-open');
    lastActive = document.activeElement;
    document.body.style.overflow = 'hidden';
    setFromIndex(imgArr.indexOf(img));
    lbClose.focus();
    toggleNavVisibility();
  }
  function close() {
    overlay.classList.remove('is-open');
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastActive && lastActive.focus) lastActive.focus();
  }
  function next() { setFromIndex(current + 1); }
  function prev() { setFromIndex(current - 1); }
  function toggleNavVisibility() {
    const multi = imgArr.length > 1;
    lbPrev.style.display = multi ? '' : 'none';
    lbNext.style.display = multi ? '' : 'none';
  }

  imgArr.forEach(img => img.addEventListener('click', () => open(img)));
  lbClose.addEventListener('click', close);
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });
}
