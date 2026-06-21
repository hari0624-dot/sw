// Pointer-based drag + canvas boundary limiting for stickers
// File: src/drag.js

const canvas = document.querySelector('#canvas');
if (!canvas) {
  console.warn('Canvas element (#canvas) not found.');
}

let draggingEl = null;
let pointerOffset = { x: 0, y: 0 };

function makeStickerDraggable(el) {
  el.style.position = 'absolute';
  el.classList.add('sticker--draggable');

  el.addEventListener('pointerdown', (e) => {
    // only left-button or primary pointer
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    draggingEl = el;
    const rect = draggingEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    pointerOffset.x = e.clientX - rect.left;
    pointerOffset.y = e.clientY - rect.top;

    // Ensure position is relative to canvas
    const left = rect.left - canvasRect.left;
    const top = rect.top - canvasRect.top;

    draggingEl.style.left = `${left}px`;
    draggingEl.style.top = `${top}px`;

    draggingEl.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  el.addEventListener('pointerup', (e) => {
    if (!draggingEl) return;
    try { draggingEl.releasePointerCapture && draggingEl.releasePointerCapture(e.pointerId); } catch (err) {}
    draggingEl = null;
  });
}

// document-level pointermove to track even if pointer leaves the sticker
document.addEventListener('pointermove', (e) => {
  if (!draggingEl) return;
  const canvasRect = canvas.getBoundingClientRect();

  let left = e.clientX - canvasRect.left - pointerOffset.x;
  let top = e.clientY - canvasRect.top - pointerOffset.y;

  const maxLeft = Math.max(0, canvas.clientWidth - draggingEl.offsetWidth);
  const maxTop = Math.max(0, canvas.clientHeight - draggingEl.offsetHeight);

  left = Math.max(0, Math.min(left, maxLeft));
  top  = Math.max(0, Math.min(top, maxTop));

  draggingEl.style.left = `${left}px`;
  draggingEl.style.top  = `${top}px`;

  e.preventDefault();
});

// Utility: initialize existing stickers inside canvas
function initStickers() {
  const stickers = canvas ? canvas.querySelectorAll('.sticker') : [];
  stickers.forEach((s) => makeStickerDraggable(s));
}

// If stash-to-canvas copying is needed, implement a drop handler on canvas
function initCanvasDrop() {
  const stash = document.querySelector('#stash');
  if (!canvas) return;

  // Example: accept drops using pointer events from a drag source that sets data-transfer-like attributes
  canvas.addEventListener('pointerdown', (e) => {
    // This placeholder is for future drop-from-stash logic if using a custom drag from stash
  });
}

initStickers();
initCanvasDrop();
