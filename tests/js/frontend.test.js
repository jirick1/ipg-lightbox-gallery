/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

describe('frontend.js basic DOM behavior', () => {
  beforeAll(() => {
    // Load the plugin's frontend.js into the JSDOM global
    const frontendPath = path.join(__dirname, '../../frontend.js');
    const code = fs.readFileSync(frontendPath, 'utf8');
    // Stub IntersectionObserver to be undefined to trigger fallback
    delete global.IntersectionObserver;
    // Evaluate in the current context (window/global)
    eval(code);
  });

  test('initializes gallery and lightbox', () => {
    // Build a minimal DOM
    document.body.innerHTML = `
      <div class="ipg" data-ipg>
        <div class="page-container">
          <div class="img-gallery">
            <figure><img src="https://example.com/a.jpg" alt="A"><figcaption>Caption A</figcaption></figure>
            <figure><img src="https://example.com/b.jpg" alt="B"><figcaption>Caption B</figcaption></figure>
          </div>
        </div>
      </div>`;

    // Simulate DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Overlay should be appended
    const overlay = document.querySelector('.ipg__lightbox');
    expect(overlay).toBeTruthy();

    // Clicking an image opens lightbox
    const firstImg = document.querySelector('.img-gallery img');
    firstImg.click();
    expect(overlay.classList.contains('is-open')).toBe(true);

    // Caption text should match
    const caption = overlay.querySelector('.ipg__caption').textContent;
    expect(caption).toBe('Caption A');
  });
});
