let root: HTMLElement | null = null;
let savingCount = 0;

window.addEventListener('DOMContentLoaded', () => {
  root = document.querySelector(':root');
});

function updateSavingIndicator(saving: boolean) {
  if (saving) savingCount++;
  else savingCount--;

  if (root == null) return;

  root.style.setProperty('--spinner-display', savingCount === 0 ? 'none' : 'block');
}

export { updateSavingIndicator };
