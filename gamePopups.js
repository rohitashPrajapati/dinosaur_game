// gamePopups.js
// Provides Sorry and Congratulation popups for the game

import { showGlobalPopup } from './globalPopup.js';

function showSorryPopup({ onRestart, onHome }) {
  // Reduce size by 40%
  const scaleDown = 0.78;
  showGlobalPopup({
    bannerImg: 'images/sorry_banner_image-min.png',
    message: `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; min-height: 180px; width: 100%;">
        <div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: ${2.5 * scaleDown}rem; color: #523232; font-weight: bold; text-shadow: 2px 2px 0 #FFB30080, 0 2px 8px #fff, 0 1px 0 #fff; text-align: center;">We hope it was fun.<br>Wanna try again?</div>
      </div>
    `,
    buttonImg: '', // No single resume button
    onResume: null,
    onClose: null,
    // Custom rendering for two buttons
    disableClose: true,
    scaleRatio: ((window && window.scaleRatio) ? window.scaleRatio : 1) * scaleDown,
    messagePosition: { top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }
  });
  setTimeout(() => {
    const popup = document.getElementById('global-popup-overlay')?.querySelector('div');
    if (popup) {
      // Remove default button if any
      const btn = popup.querySelector('img[alt="Resume"]');
      if (btn) btn.remove();
      // Add restart and home buttons
      const btnSize = 85 * scaleDown;
      const btnMargin = 18 * scaleDown;
      const btnBottom = 22 * scaleDown;
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
      homeBtn.onclick = () => { if (typeof onHome === 'function') onHome(); document.getElementById('global-popup-overlay')?.remove(); };
      popup.appendChild(restartBtn);
      popup.appendChild(homeBtn);
    }
  }, 50);
}

// function showCongratulationPopup({ score, discountText, onRestart, onHome }) {
//   showGlobalPopup({
//     bannerImg: 'images/success_banner_image-min.png',
//     message: `<div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: 2.1rem; color: #523232; font-weight: bold; text-shadow: 2px 2px 0 #FFB30080, 0 2px 8px #fff, 0 1px 0 #fff; margin-bottom: 0.7em;">YOUR SCORE: ${score.toLocaleString()}</div><div style='font-family: inherit; font-size: 1.5rem; color: #8bc34a; font-weight: bold; margin-bottom: 0.7em;'>We have added 1% discount to your account. Happy Shopping.</div>`,
//     buttonImg: '',
//     onResume: null,
//     onClose: null,
//     disableClose: true,
//     scaleRatio: (window && window.scaleRatio) ? window.scaleRatio : 1
//   });
//   setTimeout(() => {
//     const popup = document.getElementById('global-popup-overlay')?.querySelector('div');
//     if (popup) {
//       const btn = popup.querySelector('img[alt="Resume"]');
//       if (btn) btn.remove();
//       const restartBtn = document.createElement('img');
//       restartBtn.src = 'images/restart-min.png';
//       restartBtn.alt = 'Restart';
//       restartBtn.style.width = '64px';
//       restartBtn.style.height = '64px';
//       restartBtn.style.margin = '0 18px';
//       restartBtn.style.cursor = 'pointer';
//       restartBtn.style.position = 'absolute';
//       restartBtn.style.left = '45%';
//       restartBtn.style.bottom = '18px';
//       restartBtn.onclick = () => { if (typeof onRestart === 'function') onRestart(); document.getElementById('global-popup-overlay')?.remove(); };
//       const homeBtn = document.createElement('img');
//       homeBtn.src = 'images/home-min.png';
//       homeBtn.alt = 'Home';
//       homeBtn.style.width = '64px';
//       homeBtn.style.height = '64px';
//       homeBtn.style.margin = '0 18px';
//       homeBtn.style.cursor = 'pointer';
//       homeBtn.style.position = 'absolute';
//       homeBtn.style.left = '55%';
//       homeBtn.style.bottom = '18px';
//       homeBtn.onclick = () => { if (typeof onHome === 'function') onHome(); document.getElementById('global-popup-overlay')?.remove(); };
//       popup.appendChild(restartBtn);
//       popup.appendChild(homeBtn);
//     }
//   }, 50);
// }

function showCongratulationPopup({ score, discountText, onRestart, onHome }) {
  // Reduce size by 40%
  const scaleDown = 0.78;
   showGlobalPopup({
     bannerImg: 'images/success_banner_image-min.png',
     message: `<div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: 2.1rem; color: #523232; font-weight: bold; text-shadow: 2px 2px 0 #FFB30080, 0 2px 8px #fff, 0 1px 0 #fff; margin-bottom: 0.3em;">YOUR SCORE: ${Math.round(score).toLocaleString()}</div><div style="font-family: 'KalamBold', 'Kalam', 'Comic Sans MS', cursive; font-size: 1.5rem; color: #8bc34a; font-weight: bold; margin-bottom: 0.7em;">We have added 1% discount to your account. Happy Shopping.</div>`,
     buttonImg: '', // No single resume button
     onResume: null,
     onClose: null,
     // Custom rendering for two buttons
     disableClose: true,
     scaleRatio: ((window && window.scaleRatio) ? window.scaleRatio : 1) * scaleDown,
     messagePosition: { top: '59%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }
   });
  setTimeout(() => {
    const popup = document.getElementById('global-popup-overlay')?.querySelector('div');
    if (popup) {
      // Remove default button if any
      const btn = popup.querySelector('img[alt="Resume"]');
      if (btn) btn.remove();
      // Add restart and home buttons
      const btnSize = 85 * scaleDown;
      const btnMargin = 18 * scaleDown;
      const btnBottom = 22 * scaleDown;
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
      homeBtn.onclick = () => { if (typeof onHome === 'function') onHome(); document.getElementById('global-popup-overlay')?.remove(); };
      popup.appendChild(restartBtn);
      popup.appendChild(homeBtn);
    }
  }, 50);
}

export { showSorryPopup, showCongratulationPopup };
