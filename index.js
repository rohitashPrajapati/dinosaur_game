// Allow space bar to start game after popup is removed
window.addEventListener('keydown', function(e) {
  if (window.globalPopupActive) return;
  if ((e.code === 'Space' || e.key === ' ') && window.waitingToStart) {
    window.waitingToStart = false;
    waitingToStart = false;
    e.preventDefault();
  }
});
// Load Kalam-Bold font for GameOver text
const kalamFont = new FontFace('KalamBold', 'url(font/Kalam-Bold.ttf)');
kalamFont.load().then(function(loadedFace) {
  document.fonts.add(loadedFace);
});
import { showGlobalPopup } from './globalPopup.js';
import { showSorryPopup, showCongratulationPopup } from './gamePopups.js';
// Show info popup only on first load
function maybeShowInfoPopup() {
  if (!localStorage.getItem('dinoGameInfoPopupShown')) {
    // Use scaleRatio for font size
    const scaleRatio = (window && window.scaleRatio) ? window.scaleRatio : 1;
    // Detect mobile view
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 700;
    // Reduce font size more aggressively on mobile
    const mainFontBase = isMobile ? 1.85 : 2.4;
    const subFontBase = isMobile ? 1.55 : 2.0;
    const mainFontSize = (mainFontBase * Math.max(0.7, Math.min(scaleRatio, 1.15))).toFixed(2) + 'rem';
    const subFontSize = (subFontBase * Math.max(0.7, Math.min(scaleRatio, 1.15))).toFixed(2) + 'rem';
      showGlobalPopup({
        message: `
          <div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: ${mainFontSize}; color: #4b2e1e; font-weight: bold; text-shadow: 3px 3px 0 #ffd966, 0 2px 8px #fff, 0 1px 0 #fff; margin-bottom: 0.7em;">
            Tap to jump. Collect mithai to<br>unlock real discounts.
          </div>
          <div style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: ${subFontSize}; color: #8bc34a; font-weight: bold; text-shadow: 2px 2px 0 #fffbe7, 0 2px 8px #fff, 0 1px 0 #fff; margin-top: 0.5em;">
            1% off every 15000 points. Upto 5%
          </div>
        `,
        messagePosition: { top: '43%', left: '55%', transform: 'translate(-50%, -50%)', width: '70%' },
        buttonPosition: { left: '52%', bottom: isMobile ? '55px' : '32px', transform: 'translateX(-50%)' },
        onResume: () => {
          // Start the game: remove waitingToStart and trigger first frame
          window.waitingToStart = false;
        },
        onClose: () => {
          localStorage.setItem('dinoGameInfoPopupShown', '1');
        }
      });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  maybeShowInfoPopup();
});
import Player from "./Player.js";
import { showSweetPop } from "./sweetPop.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import Score from "./Score.js";
import Coin from "./Coin.js";
import WaterDitch from "./WaterDitch.js";
import Bomb from "./Bomb.js";
import SnailController from "./SnailController.js";
import soundManager from "./soundManager.js";

// --- Sound Toggle Button ---
function createSoundAndPauseButtons() {
      // Add tap/click visual feedback
      function addTapEffect(el) {
        el.addEventListener('mousedown', () => {
          el.style.transform = 'scale(0.88)';
          el.style.opacity = '0.7';
        });
        el.addEventListener('mouseup', () => {
          el.style.transform = '';
          el.style.opacity = '';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
          el.style.opacity = '';
        });
        el.addEventListener('touchstart', () => {
          el.style.transform = 'scale(0.88)';
          el.style.opacity = '0.7';
        }, {passive:true});
        el.addEventListener('touchend', () => {
          el.style.transform = '';
          el.style.opacity = '';
        });
        el.addEventListener('touchcancel', () => {
          el.style.transform = '';
          el.style.opacity = '';
        });
      }

  // --- Sound Button ---
  let soundBtn = document.getElementById('sound-toggle-btn');
  const canvas = document.getElementById('game');
  let container = document.getElementById('game-canvas-container');
  if (!container && canvas) {
    // fallback: wrap canvas if container not found (should not happen)
    container = document.createElement('div');
    container.id = 'game-canvas-container';
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    canvas.parentNode.insertBefore(container, canvas);
    container.appendChild(canvas);
  }
  if (!soundBtn) {
    soundBtn = document.createElement('img');
    soundBtn.id = 'sound-toggle-btn';
    soundBtn.src = 'images/sound_on-min.png';
    soundBtn.alt = 'Sound On';
    soundBtn.style.width = '48px';
    soundBtn.style.height = '48px';
    soundBtn.style.objectFit = 'contain';
    soundBtn.style.display = 'block';
    soundBtn.style.background = 'none';
    soundBtn.style.border = 'none';
    soundBtn.style.boxShadow = 'none';
    soundBtn.style.padding = '0';
    soundBtn.style.borderRadius = '0';
    soundBtn.style.margin = '0';
    soundBtn.style.outline = 'none';
    soundBtn.style.position = 'absolute';
    soundBtn.style.top = '16px';
    soundBtn.style.right = '16px';
    soundBtn.style.zIndex = '10';
    soundBtn.style.userSelect = 'none';
    soundBtn.style.cursor = 'pointer';
    soundBtn.setAttribute('aria-label', 'Toggle sound');
    let soundOn = true;
    soundBtn.onclick = () => {
      soundOn = !soundOn;
      soundBtn.src = soundOn ? 'images/sound_on-min.png' : 'images/sound_off-min.png';
      soundBtn.alt = soundOn ? 'Sound On' : 'Sound Off';
      if (window.soundManager) {
        window.soundManager.setMuted(!soundOn);
      } else if (typeof soundManager !== 'undefined') {
        soundManager.setMuted && soundManager.setMuted(!soundOn);
      }
      soundBtn.blur();
    };
    ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(evt => {
      soundBtn.addEventListener(evt, e => {
        e.stopPropagation();
      });
    });
    addTapEffect(soundBtn);
    if (container) {
      container.appendChild(soundBtn);
    }
  }

  // --- Pause Button ---
  let pauseBtn = document.getElementById('pause-btn');
  if (!pauseBtn) {
    pauseBtn = document.createElement('img');
    pauseBtn.id = 'pause-btn';
    pauseBtn.src = 'images/pause-min.png';
    pauseBtn.alt = 'Pause';
    pauseBtn.style.width = '48px';
    pauseBtn.style.height = '48px';
    pauseBtn.style.objectFit = 'contain';
    pauseBtn.style.display = 'block';
    pauseBtn.style.background = 'none';
    pauseBtn.style.border = 'none';
    pauseBtn.style.boxShadow = 'none';
    pauseBtn.style.padding = '0';
    pauseBtn.style.borderRadius = '0';
    pauseBtn.style.margin = '0';
    pauseBtn.style.outline = 'none';
    pauseBtn.style.position = 'absolute';
    pauseBtn.style.top = '16px';
    pauseBtn.style.right = '72px';
    pauseBtn.style.zIndex = '10';
    pauseBtn.style.userSelect = 'none';
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.setAttribute('aria-label', 'Pause game');
    pauseBtn.onclick = () => {
      if (!window.isGamePaused) {
        pauseGame();
      }
    };
    addTapEffect(pauseBtn);
    ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(evt => {
      pauseBtn.addEventListener(evt, e => {
        e.stopPropagation();
      });
    });
    if (container) {
      container.appendChild(pauseBtn);
    }
  }
// Utility to show resume button as image on overlay
window.showResumeButtonOnOverlay = function showResumeButtonOnOverlay() {
  // Remove any existing resume button
  const oldBtn = document.getElementById('resume-btn');
  if (oldBtn && oldBtn.parentElement) oldBtn.parentElement.removeChild(oldBtn);
  // Find the pause popup
  const pauseOverlay = document.getElementById('pause-overlay');
  if (pauseOverlay) {
    const popup = pauseOverlay.querySelector('div');
    if (popup) {
      const resumeBtn = document.createElement('img');
      resumeBtn.id = 'resume-btn';
      resumeBtn.src = 'images/play_button-min.png';
      resumeBtn.alt = 'Resume';
      resumeBtn.style.width = '64px';
      resumeBtn.style.height = '64px';
      resumeBtn.style.objectFit = 'contain';
      resumeBtn.style.display = 'block';
      resumeBtn.style.background = 'none';
      resumeBtn.style.border = 'none';
      resumeBtn.style.boxShadow = 'none';
      resumeBtn.style.padding = '0';
      resumeBtn.style.borderRadius = '0';
      resumeBtn.style.margin = '24px auto 0 auto';
      resumeBtn.style.outline = 'none';
      resumeBtn.style.userSelect = 'none';
      resumeBtn.style.cursor = 'pointer';
      resumeBtn.setAttribute('aria-label', 'Resume game');
      addTapEffect(resumeBtn);
      ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(evt => {
        resumeBtn.addEventListener(evt, e => {
          e.stopPropagation();
        });
      });
      resumeBtn.onclick = () => {
        resumeGame();
      };
      popup.appendChild(resumeBtn);
    }
  }
}
}

// --- Auto-rotate to landscape on mobile ---
function forceLandscapeOnMobile() {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {
      // If lock fails (e.g., not allowed), show a message
      showRotateMessage();
    });
  } else if (isMobile) {
    // If orientation lock not supported, show a message
    showRotateMessage();
  }
}

function showRotateMessage() {
  if (document.getElementById('rotate-message')) return;
  const msg = document.createElement('div');
  msg.id = 'rotate-message';
  msg.innerText = 'Please rotate your device to landscape for the best experience.';
  msg.style.position = 'fixed';
  msg.style.top = 0;
  msg.style.left = 0;
  msg.style.width = '100vw';
  msg.style.height = '100vh';
  msg.style.background = 'rgba(0,0,0,0.7)';
  msg.style.color = '#fff';
  msg.style.display = 'flex';
  msg.style.alignItems = 'center';
  msg.style.justifyContent = 'center';
  msg.style.fontSize = '2rem';
  msg.style.zIndex = 5000;
  msg.style.textAlign = 'center';
  document.body.appendChild(msg);
  // Remove message when in landscape (listen to both orientationchange and resize)
  function removeIfLandscape() {
    if (window.matchMedia('(orientation: landscape)').matches) {
      msg.remove();
      window.removeEventListener('orientationchange', removeIfLandscape);
      window.removeEventListener('resize', removeIfLandscape);
    }
  }
  window.addEventListener('orientationchange', removeIfLandscape);
  window.addEventListener('resize', removeIfLandscape);
  // Also check immediately in case already in landscape
  removeIfLandscape();
}

window.addEventListener('DOMContentLoaded', () => {
  createSoundAndPauseButtons();
  forceLandscapeOnMobile();
});
// Also call immediately in case DOM is already loaded
createSoundAndPauseButtons();
forceLandscapeOnMobile();
// --- Pause/Resume Logic ---
window.isGamePaused = false;
let pauseOverlay = null;

function pauseGame() {
  window.isGamePaused = true;
  // Show overlay popup
  if (!pauseOverlay) {
    pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.style.position = 'fixed';
    pauseOverlay.style.top = 0;
    pauseOverlay.style.left = 0;
    pauseOverlay.style.width = '100vw';
    pauseOverlay.style.height = '100vh';
    pauseOverlay.style.background = 'rgba(0,0,0,0.35)';
    pauseOverlay.style.display = 'flex';
    pauseOverlay.style.alignItems = 'center';
    pauseOverlay.style.justifyContent = 'center';
    pauseOverlay.style.zIndex = 4000;
    // Popup box
    const popup = document.createElement('div');
    popup.style.background = '#fff';
    popup.style.padding = '32px 48px';
    popup.style.borderRadius = '18px';
    popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'center';
    // Pause text
    const pauseText = document.createElement('div');
    pauseText.innerText = 'Game Paused';
    pauseText.style.fontSize = '2.2rem';
    pauseText.style.color = '#3b59ff';
    pauseText.style.marginBottom = '24px';
    popup.appendChild(pauseText);
    // Resume button as image
    setTimeout(() => {
      showResumeButtonOnOverlay();
    }, 0);
    pauseOverlay.appendChild(popup);
    document.body.appendChild(pauseOverlay);
  } else {
    pauseOverlay.style.display = 'flex';
  }
}

function resumeGame() {
  window.isGamePaused = false;
  if (pauseOverlay) pauseOverlay.style.display = 'none';
}

// Keyboard shortcut: P to pause/resume
window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    if (!window.isGamePaused) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
});
// Water Ditch variables
let waterDitches = [];
let waterDitchSpawnDistance = 6000; // Start ditches after a long initial distance
let lastDitchSpawnDistance = 0; // Track distance at which last ditch was spawned
let totalDistanceTravelled = 0; // Track total ground distance travelled
let IS_MOBILE_LANDSCAPE = false;
function isMobileLandscape() {
  return /Mobi|Android/i.test(navigator.userAgent) && window.matchMedia(
    '(orientation: landscape) and (max-width: 900px)'
  ).matches;
}
IS_MOBILE_LANDSCAPE = isMobileLandscape();
let WATERDITCH_MIN_DISTANCE = IS_MOBILE_LANDSCAPE ? 6000 : 4000; // px, min distance between ditches (much larger for mobile landscape)
let WATERDITCH_MAX_DISTANCE = IS_MOBILE_LANDSCAPE ? 12000 : 8000; // px, max distance between ditches (much larger for mobile landscape)


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const GAME_SPEED_START = 0.8; // Slower initial speed
const GAME_SPEED_INCREMENT = 0.000007; // Slower acceleration

const ORIGINAL_GAME_WIDTH = 800;
const ORIGINAL_GAME_HEIGHT = 200;
let GAME_WIDTH = ORIGINAL_GAME_WIDTH;
let GAME_HEIGHT = ORIGINAL_GAME_HEIGHT;
// const PLAYER_WIDTH = 67 / 1.5; //58
// const PLAYER_HEIGHT = 100 / 1.5; //62
const PLAYER_WIDTH = 75 * 1.0; //58
const PLAYER_HEIGHT = 76 * 1.0; //62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;

// Preload background image
const backgroundImage = new Image();
backgroundImage.src = "images/background.png";
let backgroundLoaded = false;
backgroundImage.onload = () => {
  backgroundLoaded = true;
};

// Background animation variables
let backgroundX = 0;
let backgroundSpeed = GROUND_AND_CACTUS_SPEED;

let CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: "images/cactus_1.png" },
  { width: 98 / 1.5, height: 100 / 1.5, image: "images/cactus_2.png" },
  { width: 68 / 1.5, height: 70 / 1.5, image: "images/cactus_3.png" },
];


// Game mode: "coin" or "sweet"
let gameMode = "sweet"; // Change to "sweet" to switch
const SWEET_IMAGES = [
  "images/sweet_1.png",
  "images/sweet_2.png",
  "images/sweet_3.png",
  "images/sweet_4.png",
  "images/sweet_5.png",
  "images/sweet_6.png",
  "images/sweet_7.png",
  "images/sweet_8.png",
  "images/sweet_9.png",
];

let player = null;
let ground = null;
let cactiController = null;
let score = null;
let coins = [];
let coinSpawnTimer = 0;
const COIN_SPAWN_INTERVAL = 500; // ms (further reduced interval for even more sweets)

let bombs = [];
let bombSpawnTimer = 0;
const BOMB_SPAWN_INTERVAL = 1500; // ms, reduced interval for more frequent bombs

let snailController = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;
window.waitingToStart = waitingToStart;

function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio
  );
  // Hide the ground image (do not remove)
  ground.visible = false;

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED
  );

  score = new Score(ctx, scaleRatio);
  coins = [];
  coinSpawnTimer = 0;
  bombs = [];
  bombSpawnTimer = 0;

  // Snail setup
  // snailController = new SnailController(ctx, scaleRatio, GROUND_AND_CACTUS_SPEED); // Disabled for now

  // Water Ditch setup
  waterDitches = [];
  // Start ditches after a long initial distance
  waterDitchSpawnDistance = 6000 * scaleRatio;
  lastDitchSpawnDistance = 0;
  totalDistanceTravelled = 0;
}

// ...existing code...

function setScreen() {
  IS_MOBILE_LANDSCAPE = isMobileLandscape();
  WATERDITCH_MIN_DISTANCE = IS_MOBILE_LANDSCAPE ? 6000 : 4000;
  WATERDITCH_MAX_DISTANCE = IS_MOBILE_LANDSCAPE ? 12000 : 8000;
  const dpr = window.devicePixelRatio || 1;
  let cssW, cssH, scale;
  if (IS_MOBILE_LANDSCAPE) {
    // Reduce cactus size for mobile landscape
    const scaleFactor = 2;
    CACTI_CONFIG = [
      { width: 48 / scaleFactor, height: 100 / scaleFactor, image: "images/cactus_1.png" },
      { width: 98 / scaleFactor, height: 100 / scaleFactor, image: "images/cactus_2.png" },
      { width: 68 / scaleFactor, height: 70 / scaleFactor, image: "images/cactus_3.png" },
    ];
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    GAME_HEIGHT = ORIGINAL_GAME_HEIGHT;
    GAME_WIDTH = Math.min(Math.round(screenW * 0.95), Math.round(GAME_HEIGHT * 2.5));
    scale = Math.max(screenW / GAME_WIDTH, screenH / GAME_HEIGHT);
    cssW = GAME_WIDTH * scale;
    cssH = GAME_HEIGHT * scale;
  } else {
    // Restore cactus size for desktop/portrait
    const scaleFactor = 2;
    CACTI_CONFIG = [
      { width: 48 / scaleFactor, height: 100 / scaleFactor, image: "images/cactus_1.png" },
      { width: 98 / scaleFactor, height: 100 / scaleFactor, image: "images/cactus_2.png" },
      { width: 68 / scaleFactor, height: 70 / scaleFactor, image: "images/cactus_3.png" },
    ];
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    GAME_WIDTH = ORIGINAL_GAME_WIDTH;
    GAME_HEIGHT = ORIGINAL_GAME_HEIGHT;
    // Use the smaller ratio to fit the game in the viewport
    scale = Math.min(screenW / GAME_WIDTH, screenH / GAME_HEIGHT);
    cssW = GAME_WIDTH * scale;
    cssH = GAME_HEIGHT * scale;
  }
  // Set canvas size in device pixels for sharpness
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  // Set CSS size in screen pixels (cover viewport or fit)
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  // Set scaleRatio for all game elements (includes DPR)
  scaleRatio = scale * dpr;
  window.scaleRatio = scaleRatio;
  // Center the game area in the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
  ctx.translate((canvas.width - GAME_WIDTH * scaleRatio) / 2, (canvas.height - GAME_HEIGHT * scaleRatio) / 2);
  createSprites();
}


function isAndroidChrome() {
  return /Android/.test(navigator.userAgent) && /Chrome/.test(navigator.userAgent);
}

function fixMobileViewport() {
  // Only apply window.innerHeight fix for Android Chrome
  const container = document.getElementById('game-canvas-container');
  if (isAndroidChrome()) {
    if (container) {
      container.style.height = window.innerHeight + 'px';
      container.style.maxHeight = window.innerHeight + 'px';
    }
    if (canvas) {
      canvas.style.height = window.innerHeight + 'px';
      canvas.style.maxHeight = window.innerHeight + 'px';
    }
  } else {
    // Reset to default for iOS and desktop
    if (container) {
      container.style.height = '';
      container.style.maxHeight = '';
    }
    if (canvas) {
      canvas.style.height = '';
      canvas.style.maxHeight = '';
    }
  }
}

function setScreenWithMobileFix() {
  fixMobileViewport();
  setScreen();
}

setScreenWithMobileFix();
window.addEventListener("resize", () => setTimeout(setScreenWithMobileFix, 500));
if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreenWithMobileFix);
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  //window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function showGameOver() {
  // Instantly show only the congratulation or sorry popup at game over
  if (!window._popupShownForGameOver) {
    window._popupShownForGameOver = true;
    if (score.score >= 5500) {
      showCongratulationPopup({
        score: score.score,
        discountText: 'We have added 1% discount to your account. Happy Shopping.',
        onRestart: () => { window.location.reload(); },
        onHome: () => { window.location.href = '/'; }
      });
    } else {
      showSorryPopup({
        onRestart: () => { window.location.reload(); },
        onHome: () => { window.location.href = '/'; }
      });
    }
  }
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

function reset() {
  if (window.globalPopupActive) return; // Block reset if popup is visible
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  window.waitingToStart = false;
  ground.reset();
  cactiController.reset();
  score.reset();
  if (player && typeof player.reset === 'function') player.reset();
  gameSpeed = GAME_SPEED_START;
  coins = [];
  coinSpawnTimer = 0;
  bombs = [];
  bombSpawnTimer = 0;
  // Reset snails
  if (snailController) snailController.reset();
  // Reset water ditches
  waterDitches = [];
  // Start ditches after a long initial distance
  waterDitchSpawnDistance = 6000 * scaleRatio;
  lastDitchSpawnDistance = 0;
  totalDistanceTravelled = 0;
  window._popupShownForGameOver = false;
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let text;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    text = "Tap to start";
  } else {
    text = "Press Space to Start";
  }
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.fillText(text, x, y);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  // Create vertical gradient: sky blue at top, white at ground
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  // gradient.addColorStop(0, "#87ceeb"); // top: sky blue
  gradient.addColorStop(0, "#f7fffe"); // top: sky blue
  gradient.addColorStop(1, "#f7fffe"); // bottom: white
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw background image in a loop (position updated in gameLoop)
  if (backgroundLoaded) {
    const bgWidth = canvas.width;
    const marginTop = 30 * scaleRatio; // 30px margin top, adjust as needed
    const bgHeight = canvas.height - marginTop;
    ctx.drawImage(backgroundImage, backgroundX, marginTop, bgWidth, bgHeight);
    ctx.drawImage(backgroundImage, backgroundX + bgWidth -1, marginTop, bgWidth, bgHeight);
  }
}

function spawnCoinOrSweet() {
  // Coin or sweet appears in air, random x and y
  const coinSize = 150;
  const minY = 10 * scaleRatio;
  const maxY = GAME_HEIGHT * scaleRatio - coinSize - 50 * scaleRatio;
  const x = GAME_WIDTH * scaleRatio + coinSize;

  // Helper to check if a sweet would overlap any obstacle or sweet
  function isOverlappingAny(sweetX, sweetY, sweetW, sweetH) {
    // Check cacti
    if (cactiController && cactiController.getCactusRects) {
      const cacti = cactiController.getCactusRects();
      if (cacti.some(cactus =>
        sweetX < cactus.x + cactus.width &&
        sweetX + sweetW > cactus.x &&
        sweetY < cactus.y + cactus.height &&
        sweetY + sweetH > cactus.y
      )) return true;
    }
    // Check bombs
    if (bombs.some(bomb =>
      sweetX < bomb.x + bomb.width &&
      sweetX + sweetW > bomb.x &&
      sweetY < bomb.y + bomb.height &&
      sweetY + sweetH > bomb.y
    )) return true;
    // Check snails
    if (snailController && snailController.snails) {
      if (snailController.snails.some(snail =>
        sweetX < snail.x + snail.width &&
        sweetX + sweetW > snail.x &&
        sweetY < snail.y + snail.height &&
        sweetY + sweetH > snail.y
      )) return true;
    }
    // Check water ditches
    if (waterDitches.some(ditch =>
      sweetX < ditch.x + ditch.width &&
      sweetX + sweetW > ditch.x &&
      sweetY < ditch.y + ditch.height &&
      sweetY + sweetH > ditch.y
    )) return true;
    // Check other sweets
    if (coins.some(coin =>
      coin.visible &&
      sweetX < coin.x + coin.width &&
      sweetX + sweetW > coin.x &&
      sweetY < coin.y + coin.height &&
      sweetY + sweetH > coin.y
    )) return true;
    return false;
  }

  // Use a single random value for all sweet spawn probabilities
  const sweetRand = Math.random();
  if (gameMode === "sweet") {
    const sweetsSpaceBetween = IS_MOBILE_LANDSCAPE ? 30 : 0;
    const MAX_TRIES = 10;
    // Reduce burst sweets at start
    if (totalDistanceTravelled < 2000) {
      const burstCount = 3 + Math.floor(Math.random() * 2); // 3-4 sweets
      const burstY = GAME_HEIGHT * scaleRatio - 150 - (IS_MOBILE_LANDSCAPE ? 30 : 36) * scaleRatio;
      for (let i = 0; i < burstCount; i++) {
        let tries = 0;
        let burstX;
        do {
          burstX = (i * 120) + (Math.random() * 40 - 20) + 200;
          tries++;
        } while (isOverlappingAny(burstX, burstY, 150, 150) && tries < MAX_TRIES);
        if (tries < MAX_TRIES) {
          coins.push(new Coin(burstX, burstY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    }
    // Main sweets logic
    if (sweetRand < 0.18) {
      // 18% chance to spawn a group of sweets with random gap
      const groupCount = Math.floor(Math.random() * 2) + 3; // 3-4 sweets per group
      const groundY = GAME_HEIGHT * scaleRatio - coinSize - (IS_MOBILE_LANDSCAPE ? 30 : 36) * scaleRatio;
      const gapLength = Math.random() * 180 + 80; // random gap between groups (80-260px)
      const groupStartX = x + Math.random() * 120;
      for (let i = 0; i < groupCount; i++) {
        let tries = 0;
        let sweetX = groupStartX + i * gapLength;
        let sweetY = groundY;
        // Randomly raise one sweet in the group
        if (Math.random() < 0.5 && i === Math.floor(Math.random() * groupCount)) {
          sweetY -= 60 + Math.random() * 40; // 60-100px above ground
        }
        do {
          tries++;
        } while (isOverlappingAny(sweetX, sweetY, coinSize, coinSize) && tries < MAX_TRIES);
        if (tries < MAX_TRIES) {
          coins.push(new Coin(sweetX, sweetY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else if (sweetRand < 0.28) {
      // 10% chance: single sweet with random gap
      const sweetX = x + Math.random() * 400;
      const sweetY = GAME_HEIGHT * scaleRatio - coinSize - (IS_MOBILE_LANDSCAPE ? 30 : 36) * scaleRatio - (Math.random() < 0.5 ? (60 + Math.random() * 40) : 0);
      let tries = 0;
      do {
        tries++;
      } while (isOverlappingAny(sweetX, sweetY, coinSize, coinSize) && tries < MAX_TRIES);
      if (tries < MAX_TRIES) {
        coins.push(new Coin(sweetX, sweetY, "sweet", SWEET_IMAGES, scaleRatio));
      }
    } else if (sweetRand < 0.38) {
      // 10% chance: group in air
      const groupCount = Math.floor(Math.random() * 2) + 3; // 3-4 sweets
      const rowY = Math.random() * (maxY - minY) + minY;
      const gapLength = Math.random() * 180 + 80;
      const groupStartX = x + Math.random() * 120;
      for (let i = 0; i < groupCount; i++) {
        let tries = 0;
        let sweetX = groupStartX + i * gapLength;
        let sweetY = rowY;
        // Randomly raise one sweet in the group
        if (Math.random() < 0.5 && i === Math.floor(Math.random() * groupCount)) {
          sweetY -= 60 + Math.random() * 40;
        }
        do {
          tries++;
        } while (isOverlappingAny(sweetX, sweetY, coinSize, coinSize) && tries < MAX_TRIES);
        if (tries < MAX_TRIES) {
          coins.push(new Coin(sweetX, sweetY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else if (sweetRand < 0.48) {
      // 10% chance: single sweet in air
      const sweetX = x + Math.random() * 400;
      let sweetY = Math.random() * (maxY - minY) + minY - (Math.random() < 0.5 ? (60 + Math.random() * 40) : 0);
      // Clamp sweetY to minY to avoid clipping at top
      if (sweetY < minY) sweetY = minY;
      let tries = 0;
      do {
        tries++;
      } while (isOverlappingAny(sweetX, sweetY, coinSize, coinSize) && tries < MAX_TRIES);
      if (tries < MAX_TRIES) {
        coins.push(new Coin(sweetX, sweetY, "sweet", SWEET_IMAGES, scaleRatio));
      }
    }
    // Otherwise, no sweets spawned (reduces overall count)
  } else {
    // Coin mode logic (unchanged)
    let tries = 0;
    let y, tryX;
    do {
      y = Math.random() * (maxY - minY) + minY;
      tryX = x + (Math.random() * 20 - 10);
      tries++;
    } while (isOverlappingAny(tryX, y, coinSize, coinSize) && tries < 10);
    if (tries < 10) {
      coins.push(new Coin(tryX, y, "coin", [], scaleRatio));
    }
  }
}



function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  // Only update/draw if not paused
  if (window.isGamePaused) {
    // Draw overlay if needed (already handled by pauseGame)
    requestAnimationFrame(gameLoop);
    return;
  }

  // Only update background position if game is running
  if (!gameOver && !waitingToStart && backgroundLoaded) {
    backgroundX -= gameSpeed * frameTimeDelta * backgroundSpeed * scaleRatio * 0.5;
    const bgWidth = canvas.width;
    if (backgroundX <= -bgWidth) {
      backgroundX += bgWidth;
    }
  }

  clearScreen();

  if (!gameOver && !waitingToStart) {
    // ...existing code for updating game objects, collisions, etc...
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
    const cactiRects = cactiController && cactiController.getCactusRects ? cactiController.getCactusRects() : [];
    const bombRects = bombs.map(bomb => ({ x: bomb.x, y: bomb.y, width: bomb.width, height: bomb.height }));
    const ditchRects = waterDitches.map(ditch => ({ x: ditch.x, y: ditch.y, width: ditch.width, height: ditch.height }));
    const sweetRects = coins.map(coin => ({ x: coin.x, y: coin.y, width: coin.width, height: coin.height }));
    if (snailController) snailController.update(gameSpeed, frameTimeDelta, scaleRatio, cactiRects, bombRects, ditchRects, sweetRects);
    if (snailController && snailController.isColliding(player)) {
      gameOver = true;
      setupGameReset();
      score.setHighScore();
      soundManager.play('gameover', 0);
    }
    totalDistanceTravelled += gameSpeed * frameTimeDelta * GROUND_AND_CACTUS_SPEED * scaleRatio;
    if (totalDistanceTravelled - lastDitchSpawnDistance > waterDitchSpawnDistance) {
      const groundY = GAME_HEIGHT * scaleRatio - GROUND_HEIGHT * scaleRatio;
      const ditchX = GAME_WIDTH * scaleRatio;
      const SAFE_DIST = IS_MOBILE_LANDSCAPE ? 900 * scaleRatio : 350 * scaleRatio; // much larger safe area for mobile landscape
      let canSpawn = true;
      if (cactiController && cactiController.getCactusRects) {
        const cactiRects = cactiController.getCactusRects();
        for (const cactus of cactiRects) {
          if (Math.abs((cactus.x + cactus.width/2) - (ditchX + 81)) < SAFE_DIST) {
            canSpawn = false;
            break;
          }
        }
      }
      for (const bomb of bombs) {
        if (Math.abs((bomb.x + bomb.width/2) - (ditchX + 81)) < SAFE_DIST) {
          canSpawn = false;
          break;
        }
      }
      if (snailController && snailController.snails) {
        for (const snail of snailController.snails) {
          if (Math.abs((snail.x + snail.width/2) - (ditchX + 81)) < SAFE_DIST) {
            canSpawn = false;
            break;
          }
        }
      }
      for (const ditch of waterDitches) {
        if (Math.abs((ditch.x + ditch.width/2) - (ditchX + 81)) < SAFE_DIST) {
          canSpawn = false;
          break;
        }
      }
      if (canSpawn) {
        waterDitches.push(new WaterDitch(ditchX, groundY, IS_MOBILE_LANDSCAPE, scaleRatio));
        lastDitchSpawnDistance = totalDistanceTravelled;
        waterDitchSpawnDistance = Math.random() * (WATERDITCH_MAX_DISTANCE - WATERDITCH_MIN_DISTANCE) + WATERDITCH_MIN_DISTANCE;
      }
    }
    waterDitches.forEach((ditch) => ditch.update(gameSpeed, frameTimeDelta, GROUND_AND_CACTUS_SPEED, scaleRatio));
    waterDitches = waterDitches.filter((ditch) => ditch.x + ditch.width > 0);
    coinSpawnTimer += frameTimeDelta;
    if (coinSpawnTimer > COIN_SPAWN_INTERVAL) {
      spawnCoinOrSweet();
      coinSpawnTimer = 0;
    }
    bombSpawnTimer += frameTimeDelta;
    if (bombSpawnTimer > BOMB_SPAWN_INTERVAL) {
      // Always spawn at least one bomb per interval
      const groundY = GAME_HEIGHT * scaleRatio - 65 * scaleRatio;
      const bombHeight = 30 * scaleRatio;
      const bombWidth = (279 / 316) * bombHeight;
      const MIN_BOMB_SAFE_GAP = IS_MOBILE_LANDSCAPE ? 900 * scaleRatio : 250 * scaleRatio; // much larger gap for mobile landscape
      let bombsToSpawn = 2 + Math.floor(Math.random() * 2); // 2-3 bombs per interval
      const cacti = cactiController && cactiController.getCactusRects ? cactiController.getCactusRects() : [];
      for (let i = 0; i < bombsToSpawn; i++) {
        let tryCount = 0;
        let placed = false;
        while (!placed && tryCount < 10) {
          const x = GAME_WIDTH * scaleRatio + 50 + Math.random() * 150 * scaleRatio;
          const safeFromCactus = !cacti.some(cactus =>
            Math.abs((cactus.x + cactus.width / 2) - (x + bombWidth / 2)) < MIN_BOMB_SAFE_GAP
          );
          const safeFromSnail = !(snailController && snailController.snails && snailController.snails.some(snail =>
            Math.abs((snail.x + snail.width / 2) - (x + bombWidth / 2)) < MIN_BOMB_SAFE_GAP
          ));
          const safeFromBomb = !bombs.some(bomb =>
            Math.abs((bomb.x + bomb.width / 2) - (x + bombWidth / 2)) < MIN_BOMB_SAFE_GAP
          );
          const safeFromDitch = !waterDitches.some(ditch =>
            Math.abs((ditch.x + ditch.width / 2) - (x + bombWidth / 2)) < MIN_BOMB_SAFE_GAP
          );
          const safeFromSweet = !coins.some(coin =>
            Math.abs((coin.x + coin.width / 2) - (x + bombWidth / 2)) < MIN_BOMB_SAFE_GAP
          );
          if (safeFromCactus && safeFromSnail && safeFromBomb && safeFromDitch && safeFromSweet) {
            bombs.push(new Bomb(x, groundY, scaleRatio));
            placed = true;
          }
          tryCount++;
        }
      }
      bombSpawnTimer = 0;
    }
    coins.forEach((coin) => coin.update(gameSpeed, frameTimeDelta, GROUND_AND_CACTUS_SPEED, scaleRatio));
    bombs.forEach((bomb) => bomb.update(gameSpeed, frameTimeDelta, GROUND_AND_CACTUS_SPEED, scaleRatio));
    for (const bomb of bombs) {
      if (bomb.isColliding(player) && !bomb.collected && !bomb.exploding) {
        bomb.triggerExplosion();
        bomb.visible = false; // Hide bomb image, but keep for explosion animation
        soundManager.play('explosion');
        // Show impact image for bomb
        let impactX = Math.max(player.x, bomb.x) + Math.min(player.width, bomb.width) / 2;
        let impactY = Math.max(player.y, bomb.y) + Math.min(player.height, bomb.height) / 2;
        showImpactImage(impactX, impactY);
        // Do not remove the bomb immediately; let it finish its explosion animation
        if (!player.diedAnimationPlaying) {
          player.startDiedAnimation();
          setTimeout(() => {
            gameOver = true;
            setupGameReset();
            score.setHighScore();
            soundManager.play('gameover', 500);
          }, 16 * player.DIED_ANIMATION_TIMER);
        }
        break;
      }
    }
    if (!window.sweetsCollected) window.sweetsCollected = [];
    const now = performance.now();
    coins.forEach((coin) => {
      if (coin.isColliding(player) && !coin.collected) {
        coin.collect();
        score.score += coin.scoreValue;
        soundManager.play('coin');
        if (coin.type === "sweet") {
          // Track sweet collection for celebration logic
          window.sweetsCollected.push({
            ts: now,
            x: coin.x + coin.width / 2,
            y: coin.y + coin.height / 2,
            sweetSrc: coin.image.src
          });
        }
      }
    });
    window.sweetsCollected = window.sweetsCollected.filter(obj => now - obj.ts < 1000);
    // Show celebration image only when 3 continuous sweets are collected
    if (window.sweetsCollected.length >= 3) {
      // Check if last 3 sweets are close enough in time (continuous) and are the same sweet
      const last3 = window.sweetsCollected.slice(-3);
      const allSame = last3.every(obj => obj.sweetSrc === last3[0].sweetSrc);
      if (allSame && last3[2].ts - last3[0].ts < 1200) { // 1.2s window for continuity
        if (!document.getElementById('impact-img')) {
          const avgX = Math.round(last3.reduce((sum, obj) => sum + obj.x, 0) / 3);
          const avgY = Math.round(last3.reduce((sum, obj) => sum + obj.y, 0) / 3);
          const rect = canvas.getBoundingClientRect();
          const screenX = rect.left + avgX * (rect.width / canvas.width);
          const screenY = rect.top + avgY * (rect.height / canvas.height);
          showSweetPop(screenX, screenY, scaleRatio);
        }
        window.sweetsCollected = [];
      }
    }
    for (const ditch of waterDitches) {
      if (ditch.isColliding(player)) {
        if (!player.jumpInProgress && !player.falling) {
          soundManager.play('waterpit');
        }
        // Show impact image for water ditch
        let impactX = Math.max(player.x, ditch.x) + Math.min(player.width, ditch.width) / 2;
        let impactY = Math.max(player.y, ditch.y) + Math.min(player.height, ditch.height) / 2;
        showImpactImage(impactX, impactY);
        if (!player.diedAnimationPlaying) {
          player.startDiedAnimation();
          setTimeout(() => {
            gameOver = true;
            setupGameReset();
            score.setHighScore();
            soundManager.play('gameover', 500);
          }, 16 * player.DIED_ANIMATION_TIMER);
        }
        break;
      }
    }
    coins = coins.filter((coin) => coin.visible);
    bombs = bombs.filter((bomb) => bomb.visible || (bomb.exploding && bomb.explosionFrame < 3));
  }

  if (!gameOver && cactiController.collideWith(player)) {
    // Find the colliding cactus
    let impactX = null, impactY = null;
    let collided = false;
    for (const cactus of cactiController.cacti) {
      if (cactus.collideWith(player)) {
        // Impact position: center of overlap
        impactX = Math.max(player.x, cactus.x);
        // If player is above cactus (impact on top), show at cactus top
        if (player.y + player.height < cactus.y + cactus.height / 2) {
          impactY = cactus.y; // top of cactus
        } else {
          // Otherwise, center of overlap
          impactY = Math.max(player.y, cactus.y);
          impactY += Math.min(player.height, cactus.height) / 2;
        }
        impactX += Math.min(player.width, cactus.width) / 2;
        collided = true;
        break;
      }
    }
    if (impactX !== null && impactY !== null) {
      showImpactImage(impactX, impactY);
    }
    if (collided && !player.diedAnimationPlaying) {
      soundManager.play('cactus', 0); // Play death sound immediately
      player.startDiedAnimation();
      setTimeout(() => {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
        soundManager.play('gameover', 0);
      }, 16 * player.DIED_ANIMATION_TIMER);
    }
  }
// Show impact image at given canvas coordinates
function showImpactImage(x, y) {
  // Always show above and in front of player's head
  const rect = canvas.getBoundingClientRect();
  // Player's head position: center-top of player
  const playerHeadX = player.x + player.width * 0.7; // in front of face
  const playerHeadY = player.y - player.height * 0.25; // above head
  const screenX = rect.left + playerHeadX * (rect.width / canvas.width);
  const screenY = rect.top + playerHeadY * (rect.height / canvas.height);
  // Remove celebration image if present
  let sweetPopImg = document.getElementById('sweet-pop');
  if (sweetPopImg) sweetPopImg.remove();
  let impactImg = document.getElementById('impact-img');
  if (impactImg) impactImg.remove();
  impactImg = document.createElement('img');
  impactImg.id = 'impact-img';
  impactImg.src = 'images/oh_snap.png';
  impactImg.style.position = 'absolute';
  impactImg.style.left = screenX + 'px';
  impactImg.style.top = screenY + 'px';
  impactImg.style.transform = 'translate(-50%, -50%) scale(1.2)';
  impactImg.style.zIndex = 2000;
  impactImg.style.pointerEvents = 'none';
  // Make oh_snap image scale with screen ratio
  const baseWidth = 70 / 2; // px
  const baseHeight = 50 / 2; // px
  const ratio = (typeof scaleRatio !== 'undefined' && scaleRatio) ? scaleRatio : 1;
  impactImg.style.width = (baseWidth * ratio) + 'px';
  impactImg.style.height = (baseHeight * ratio) + 'px';
  impactImg.style.opacity = '1';
  document.body.appendChild(impactImg);
  setTimeout(() => {
    if (impactImg) impactImg.style.opacity = '0';
    setTimeout(() => impactImg && impactImg.remove(), 400);
  }, 1000);
}

  //Draw game objects
  ground.draw();
  cactiController.draw();
  // Draw snails after ground/cacti, before player
  // if (snailController) snailController.draw(); // Disabled for now
  // Draw water ditches after ground/cacti, before player
  waterDitches.forEach((ditch) => ditch.draw(ctx));
  // Draw bombs before player
  bombs.forEach((bomb) => bomb.draw(ctx));
  player.draw();
  coins.forEach((coin) => coin.draw(ctx));
  if (gameOver) {
    showGameOver();
    score.draw();
  } else {
    score.draw();
  }

  if (waitingToStart) {
    window.waitingToStart = true;
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", function(e) {
  if (window.globalPopupActive) return;
  reset(e);
}, { once: true });

function handleTouchStartToStart(e) {
  if (window.globalPopupActive) return;
  if (window.waitingToStart) {
    window.waitingToStart = false;
    waitingToStart = false;
    e.preventDefault();
  }
}

window.addEventListener("touchstart", handleTouchStartToStart);
