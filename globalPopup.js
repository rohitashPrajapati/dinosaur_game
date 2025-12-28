// globalPopup.js
// Provides a reusable global popup overlay for the game

let globalPopupActive = false;

function showGlobalPopup({
  message = '',
  onClose = null,
  onResume = null, // custom action for resume button
  bannerImg = 'images/info_banner-min.png',
  buttonImg = 'images/play_button-min.png',
  buttonLabel = '',
  animationIn = 'scale',
  animationOut = 'scale',
  disableClose = false,
  scaleRatio = (window && window.scaleRatio) ? window.scaleRatio : 1,
  messagePosition = { top: '40%', left: '55%', transform: 'translate(-50%, -50%)', width: '70%' },
  buttonPosition = null
} = {}) {
  if (globalPopupActive) return;
  globalPopupActive = true;

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 700;
  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'global-popup-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.20)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 9999;
  overlay.style.transition = 'opacity 0.3s';
  overlay.style.opacity = '0';

  // Popup container
  const popup = document.createElement('div');
  popup.style.position = 'relative';
  popup.style.display = 'flex';
    // ...existing code...
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.background = 'none';
  popup.style.border = 'none';
  popup.style.outline = 'none';
  popup.style.boxShadow = 'none';
  popup.style.padding = '0';
  popup.style.margin = '0';
  popup.style.userSelect = 'none';
  popup.style.pointerEvents = 'auto';
  popup.style.transform = 'scale(0.7)';
  popup.style.transition = 'transform 0.35s cubic-bezier(.68,-0.55,.27,1.55)';

  // Banner image
  const banner = document.createElement('img');
  banner.src = bannerImg;
  banner.alt = 'Info';
  // Double the base width and use scaleRatio for responsive sizing
  const baseWidth = 420 * 2.8 * scaleRatio;
  banner.style.width = `min(98vw, ${baseWidth}px)`;
  banner.style.maxWidth = '98vw';
  banner.style.height = 'auto';
  banner.style.display = 'block';
  banner.style.margin = '0 auto';
  banner.style.userSelect = 'none';
  banner.style.pointerEvents = 'none';
  banner.style.position = 'relative';

  // Message text
  const msg = document.createElement('div');
  msg.innerHTML = message;
  msg.style.position = 'absolute';
  msg.style.textAlign = 'center';
  msg.style.fontSize = (1.25 * 2 * scaleRatio) + 'rem';
  msg.style.color = '#333';
  msg.style.fontWeight = 'bold';
  msg.style.textShadow = '0 2px 8px #fff, 0 1px 0 #fff';
  msg.style.pointerEvents = 'none';
  msg.style.userSelect = 'none';
  msg.style.zIndex = 2;
  // Always apply messagePosition after all other style assignments
  msg.style.top = messagePosition.top || '40%';
  msg.style.left = messagePosition.left || '55%';
  msg.style.transform = messagePosition.transform || 'translate(-50%, -50%)';
  msg.style.width = messagePosition.width || '70%';


  // Only create and append the default resume/play button if buttonImg is not empty
  let btn = null;
  if (buttonImg) {
    btn = document.createElement('img');
    btn.src = buttonImg;
    btn.alt = buttonLabel || 'Resume';
    btn.style.width = (isMobile ?  65 * scaleRatio : 77 * scaleRatio) + 'px';
    btn.style.height = (isMobile ? 65 * scaleRatio : 77 * scaleRatio) + 'px';
    // Apply custom button position if provided
    if (buttonPosition) {
      if (buttonPosition.left) btn.style.left = buttonPosition.left;
      if (buttonPosition.right) btn.style.right = buttonPosition.right;
      if (buttonPosition.top) btn.style.top = buttonPosition.top;
      if (buttonPosition.bottom) btn.style.bottom = buttonPosition.bottom;
      if (buttonPosition.transform) btn.style.transform = buttonPosition.transform;
    } else {
      btn.style.left = '55%';
      btn.style.bottom = isMobile ? '60px' : '40px';
      btn.style.transform = 'translateX(-50%)';
    }
    btn.style.position = 'absolute';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = 3;
    btn.style.transition = 'transform 0.2s';
    btn.addEventListener('mousedown', () => btn.style.transform = (buttonPosition && buttonPosition.transform ? buttonPosition.transform + ' scale(0.92)' : 'translateX(-50%) scale(0.92)'));
    btn.addEventListener('mouseup', () => btn.style.transform = buttonPosition && buttonPosition.transform ? buttonPosition.transform : 'translateX(-50%)');
    btn.addEventListener('mouseleave', () => btn.style.transform = buttonPosition && buttonPosition.transform ? buttonPosition.transform : 'translateX(-50%)');
    btn.addEventListener('touchstart', () => btn.style.transform = (buttonPosition && buttonPosition.transform ? buttonPosition.transform + ' scale(0.92)' : 'translateX(-50%) scale(0.92)'));
    btn.addEventListener('touchend', () => btn.style.transform = buttonPosition && buttonPosition.transform ? buttonPosition.transform : 'translateX(-50%)');

    // Hide popup on button click
    btn.onclick = () => {
      if (typeof onResume === 'function') onResume();
      popup.style.transform = 'scale(0.7)';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        globalPopupActive = false;
        if (typeof onClose === 'function') onClose();
      }, 350);
    };
  }

  // Structure
  popup.appendChild(banner);
  popup.appendChild(msg);
  if (btn) popup.appendChild(btn);
  popup.style.width = banner.style.width;
  popup.style.height = banner.style.height;
  popup.style.minHeight = (180 * 2 * scaleRatio) + 'px';
  popup.style.minWidth = (220 * 2 * scaleRatio) + 'px';
  popup.style.maxWidth = '98vw';
  popup.style.maxHeight = '90vh';
  popup.style.overflow = 'visible';
  popup.style.position = 'relative';

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Animate in
  setTimeout(() => {
    overlay.style.opacity = '1';
    popup.style.transform = 'scale(1)';
  }, 10);
}

export { showGlobalPopup };
