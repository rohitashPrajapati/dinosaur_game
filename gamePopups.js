// gamePopups.js
// Provides Sorry and Congratulation popups for the game

import { showGlobalPopup } from './globalPopup.js';

function showSorryPopup({ onRestart, onHome }) {
  // Use scaleRatio for all popup elements
  // Dynamically adjust scaleDown for small landscape screens (e.g., iPhone 12 Pro landscape)
  let scaleDown = 0.19;
  const width = window.innerWidth;
  const height = window.innerHeight;
  // iPhone 12 Pro landscape: 844x390, or similar small landscape screens
  // Further reduce for Android landscape (e.g., Galaxy S8+ 740x360)
  if (width <= 800 && height <= 400 && width > height) {
    scaleDown = 0.11;
  } else if (width <= 900 && height <= 420 && width > height) {
    scaleDown = 0.13;
  }
  const scaleRatio = ((window && window.scaleRatio) ? window.scaleRatio : 1) * scaleDown;
  showGlobalPopup({
    bannerImg: 'images/sorry_banner_image-min.png',
    message: `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; min-height: ${180 * scaleRatio}px; width: 100%;">
        <div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: ${2.5 * scaleRatio}rem; color: #523232; font-weight: bold; text-shadow: 2px 2px 0 #FFB30080, 0 2px 8px #fff, 0 1px 0 #fff; text-align: center;">We hope it was fun.<br>Wanna try again?</div>
      </div>
    `,
    buttonImg: '', // No single resume button
    onResume: null,
    onClose: null,
    // Custom rendering for two buttons
    disableClose: true,
    scaleRatio,
    messagePosition: { top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }
  });
  setTimeout(() => {
    const popup = document.getElementById('global-popup-overlay')?.querySelector('div');
    if (popup) {
      // Remove default button if any
      const btn = popup.querySelector('img[alt="Resume"]');
      if (btn) btn.remove();
      // Add restart and home buttons
      const btnSize = 85 * scaleRatio;
      const btnMargin = 18 * scaleRatio;
      const btnBottom = 22 * scaleRatio;
      const restartBtn = document.createElement('img');
      restartBtn.src = 'images/restart-min.png';
      restartBtn.alt = 'Restart';
      restartBtn.style.width = btnSize + 'px';
      restartBtn.style.height = btnSize + 'px';
      restartBtn.style.margin = `0 ${btnMargin}px`;
      restartBtn.style.cursor = 'pointer';
      restartBtn.style.position = 'absolute';
      restartBtn.style.left = '40%';
      restartBtn.style.bottom = btnBottom + 'px';
      restartBtn.style.objectFit = 'contain';
      // Add tap/click effect
      ['mousedown', 'touchstart'].forEach(evt => restartBtn.addEventListener(evt, () => {
        restartBtn.style.transform = 'scale(0.88)';
        restartBtn.style.opacity = '0.7';
      }));
      ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => restartBtn.addEventListener(evt, () => {
        restartBtn.style.transform = '';
        restartBtn.style.opacity = '';
      }));
      restartBtn.onclick = () => { if (typeof onRestart === 'function') onRestart(); document.getElementById('global-popup-overlay')?.remove(); };

      const homeBtn = document.createElement('img');
      homeBtn.src = 'images/home-min.png';
      homeBtn.alt = 'Home';
      homeBtn.style.width = btnSize + 'px';
      homeBtn.style.height = btnSize + 'px';
      homeBtn.style.margin = `0 ${btnMargin}px`;
      homeBtn.style.cursor = 'pointer';
      homeBtn.style.position = 'absolute';
      homeBtn.style.left = '50%';
      homeBtn.style.bottom = btnBottom + 'px';
      homeBtn.style.objectFit = 'contain';
      // Add tap/click effect
      ['mousedown', 'touchstart'].forEach(evt => homeBtn.addEventListener(evt, () => {
        homeBtn.style.transform = 'scale(0.88)';
        homeBtn.style.opacity = '0.7';
      }));
      ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => homeBtn.addEventListener(evt, () => {
        homeBtn.style.transform = '';
        homeBtn.style.opacity = '';
      }));
      homeBtn.onclick = () => { if (typeof onHome === 'function') onHome(); document.getElementById('global-popup-overlay')?.remove(); };

      popup.appendChild(restartBtn);
      popup.appendChild(homeBtn);
    }
  }, 50);
}

function showCongratulationPopup({ score, discountText, onRestart, onHome }) {
  // Reduce size by 40%
  // Dynamically adjust scaleDown for small landscape screens (e.g., iPhone 12 Pro landscape)
  let scaleDown = 0.19;
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 800 && height <= 400 && width > height) {
    scaleDown = 0.11;
  } else if (width <= 900 && height <= 420 && width > height) {
    scaleDown = 0.13;
  }
  const scaleRatio = ((window && window.scaleRatio) ? window.scaleRatio : 1) * scaleDown;
  const mainFontSize = (2.2 * scaleRatio).toFixed(2) + 'rem';
  const subFontSize = (1.6 * scaleRatio).toFixed(2) + 'rem';
  showGlobalPopup({
    bannerImg: 'images/success_banner_image-min.png',
    message: `<div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: ${mainFontSize}; color: #523232; font-weight: bold; text-shadow: 2px 2px 0 #FFB30080, 0 2px 8px #fff, 0 1px 0 #fff; margin-bottom: 0.3em;">YOUR SCORE: ${Math.round(score).toLocaleString()}</div><div style="font-family: 'KalamBold', 'Kalam', 'Comic Sans MS', cursive; font-size: ${subFontSize}; color: #8bc34a; font-weight: bold; margin-bottom: 0.7em;">We have added 1% discount to your account.<br>Happy Shopping.</div>`,
    buttonImg: '', // No single resume button
    onResume: null,
    onClose: null,
    // Custom rendering for two buttons
    disableClose: true,
    scaleRatio: scaleRatio,
    messagePosition: { top: '59%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }
  });
    setTimeout(() => {
      const popup = document.getElementById('global-popup-overlay')?.querySelector('div');
      if (popup) {
        // Remove default button if any
        const btn = popup.querySelector('img[alt="Resume"]');
        if (btn) btn.remove();
        // Add restart and home buttons
        const btnSize = 85 * scaleRatio;
        const btnMargin = 18 * scaleRatio;
        const btnBottom = 22 * scaleRatio;
        const restartBtn = document.createElement('img');
        restartBtn.src = 'images/restart-min.png';
        restartBtn.alt = 'Restart';
        restartBtn.style.width = btnSize + 'px';
        restartBtn.style.height = btnSize + 'px';
        restartBtn.style.margin = `0 ${btnMargin}px`;
        restartBtn.style.cursor = 'pointer';
        restartBtn.style.position = 'absolute';
        restartBtn.style.left = '40%';
        restartBtn.style.bottom = btnBottom + 'px';
        restartBtn.style.objectFit = 'contain';
        // Add tap/click effect
        ['mousedown', 'touchstart'].forEach(evt => restartBtn.addEventListener(evt, () => {
          restartBtn.style.transform = 'scale(0.88)';
          restartBtn.style.opacity = '0.7';
        }));
        ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => restartBtn.addEventListener(evt, () => {
          restartBtn.style.transform = '';
          restartBtn.style.opacity = '';
        }));
        restartBtn.onclick = () => { if (typeof onRestart === 'function') onRestart(); document.getElementById('global-popup-overlay')?.remove(); };
        const homeBtn = document.createElement('img');
        homeBtn.src = 'images/home-min.png';
        homeBtn.alt = 'Home';
        homeBtn.style.width = btnSize + 'px';
        homeBtn.style.height = btnSize + 'px';
        homeBtn.style.margin = `0 ${btnMargin}px`;
        homeBtn.style.cursor = 'pointer';
        homeBtn.style.position = 'absolute';
        homeBtn.style.left = '50%';
        homeBtn.style.bottom = btnBottom + 'px';
        homeBtn.style.objectFit = 'contain';
        // Add tap/click effect
        ['mousedown', 'touchstart'].forEach(evt => homeBtn.addEventListener(evt, () => {
          homeBtn.style.transform = 'scale(0.88)';
          homeBtn.style.opacity = '0.7';
        }));
        ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => homeBtn.addEventListener(evt, () => {
          homeBtn.style.transform = '';
          homeBtn.style.opacity = '';
        }));
        homeBtn.onclick = () => { if (typeof onHome === 'function') onHome(); document.getElementById('global-popup-overlay')?.remove(); };
        popup.appendChild(restartBtn);
        popup.appendChild(homeBtn);
      }
    }, 50);
}

export { showSorryPopup, showCongratulationPopup };

