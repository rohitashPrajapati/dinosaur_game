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
  // --- Sound Button ---
  let soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) {
    soundBtn = document.createElement('button');
    soundBtn.id = 'sound-toggle-btn';
    var soundOnSVG = '<svg id="sound-on-svg" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="display:block; color:#3b59ff;"><path d="M20.522 7.228a6.74 6.74 0 0 1 0 9.544M7.5 15.75H3a.75.75 0 0 1-.75-.75V9A.75.75 0 0 1 3 8.25h4.5L14.25 3v18L7.5 15.75Zm0-7.5v7.5m10.369-5.869a2.99 2.99 0 0 1 0 4.238" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    var soundOffSVG = '<svg id="sound-off-svg" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" style="display:block; color:#3b59ff;"><path d="M27.363 9.637a8.988 8.988 0 0 1 0 12.726M10 11v10m13.825-7.825a3.99 3.99 0 0 1 0 5.65M6 5l20 22m-7-7.7V28l-9-7H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h6l.85-.662m3.175-2.463L19 4v9.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    soundBtn.innerHTML = soundOnSVG;
    soundBtn.style.position = 'fixed';
    soundBtn.style.top = '24px';
    soundBtn.style.right = '24px';
    soundBtn.style.zIndex = 3000;
    function setBtnSize() {
      if (window.IS_MOBILE_LANDSCAPE) {
        soundBtn.style.width = '56px';
        soundBtn.style.height = '32px';
        soundBtn.style.borderRadius = '16px';
      } else {
        soundBtn.style.width = '80px';
        soundBtn.style.height = '44px';
        soundBtn.style.borderRadius = '22px';
      }
    }
    setBtnSize();
    window.addEventListener('resize', setBtnSize);
    soundBtn.style.border = 'none';
    soundBtn.style.background = '#fff';
    soundBtn.style.display = 'flex';
    soundBtn.style.alignItems = 'center';
    soundBtn.style.justifyContent = 'center';
    soundBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    soundBtn.style.userSelect = 'none';
    soundBtn.style.cursor = 'pointer';
    soundBtn.setAttribute('aria-label', 'Toggle sound');
    let soundOn = true;
    soundBtn.onclick = () => {
      soundOn = !soundOn;
      soundBtn.innerHTML = soundOn ? soundOnSVG : soundOffSVG;
      if (window.soundManager) {
        window.soundManager.setMuted(!soundOn);
      } else if (typeof soundManager !== 'undefined') {
        soundManager.setMuted && soundManager.setMuted(!soundOn);
      }
      soundBtn.blur();
    };
    document.body.appendChild(soundBtn);
  }

  // --- Pause Button ---
  let pauseBtn = document.getElementById('pause-btn');
  if (!pauseBtn) {
    pauseBtn = document.createElement('button');
    pauseBtn.id = 'pause-btn';
    pauseBtn.innerHTML = '<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="display:block; color:#3b59ff;"><rect x="6" y="4" width="4" height="16" rx="2" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="2" fill="currentColor"/></svg>';
    pauseBtn.style.position = 'fixed';
    pauseBtn.style.top = '24px';
    pauseBtn.style.right = '110px';
    pauseBtn.style.zIndex = 3000;
    pauseBtn.style.width = soundBtn ? soundBtn.style.width : '80px';
    pauseBtn.style.height = soundBtn ? soundBtn.style.height : '44px';
    pauseBtn.style.borderRadius = soundBtn ? soundBtn.style.borderRadius : '22px';
    pauseBtn.style.border = 'none';
    pauseBtn.style.background = '#fff';
    pauseBtn.style.display = 'flex';
    pauseBtn.style.alignItems = 'center';
    pauseBtn.style.justifyContent = 'center';
    pauseBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    pauseBtn.style.userSelect = 'none';
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.setAttribute('aria-label', 'Pause game');
    pauseBtn.onclick = () => {
      if (!window.isGamePaused) {
        pauseGame();
      }
    };
    document.body.appendChild(pauseBtn);
  }
}

// Call after DOM is ready
window.addEventListener('DOMContentLoaded', createSoundAndPauseButtons);
// Also call immediately in case DOM is already loaded
createSoundAndPauseButtons();
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
    // Resume button
    const resumeBtn = document.createElement('button');
    resumeBtn.innerText = 'Resume';
    resumeBtn.style.fontSize = '1.2rem';
    resumeBtn.style.padding = '10px 32px';
    resumeBtn.style.background = '#3b59ff';
    resumeBtn.style.color = '#fff';
    resumeBtn.style.border = 'none';
    resumeBtn.style.borderRadius = '8px';
    resumeBtn.style.cursor = 'pointer';
    resumeBtn.onclick = resumeGame;
    popup.appendChild(resumeBtn);
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
const WATERDITCH_MIN_DISTANCE = 4000; // px, min distance between ditches (increased)
const WATERDITCH_MAX_DISTANCE = 8000; // px, max distance between ditches (increased)


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
const PLAYER_WIDTH = 67 / 1.6; //58
const PLAYER_HEIGHT = 113 / 1.6; //62
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
const BOMB_SPAWN_INTERVAL = 2500; // ms, adjust for frequency

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

let IS_MOBILE_LANDSCAPE = false;

function isMobileLandscape() {
  return /Mobi|Android/i.test(navigator.userAgent) && window.matchMedia(
    '(orientation: landscape) and (max-width: 900px)'
  ).matches;
}

function setScreen() {
  IS_MOBILE_LANDSCAPE = isMobileLandscape();
  const dpr = window.devicePixelRatio || 1;
  let cssW, cssH, scale;
  if (IS_MOBILE_LANDSCAPE) {
    // Reduce cactus size for mobile landscape
    CACTI_CONFIG = [
      { width: 48 / 1.6, height: 100 / 1.6, image: "images/cactus_1.png" },
      { width: 98 / 1.6, height: 100 / 1.6, image: "images/cactus_2.png" },
      { width: 68 / 1.6, height: 70 / 1.6, image: "images/cactus_3.png" },
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
    CACTI_CONFIG = [
      { width: 48 / 1.5, height: 100 / 1.5, image: "images/cactus_1.png" },
      { width: 98 / 1.5, height: 100 / 1.5, image: "images/cactus_2.png" },
      { width: 68 / 1.5, height: 70 / 1.5, image: "images/cactus_3.png" },
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
  // Center the game area in the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
  ctx.translate((canvas.width - GAME_WIDTH * scaleRatio) / 2, (canvas.height - GAME_HEIGHT * scaleRatio) / 2);
  createSprites();
}

setScreen();
//Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
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
  let fontSize, x, y;
  if (IS_MOBILE_LANDSCAPE) {
    fontSize = 32 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    x = canvas.width / 2;
    y = canvas.height / 2;
  } else {
    fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    x = canvas.width / 4.5;
    y = canvas.height / 2;
  }
  ctx.fillText("GAME OVER", x, y);
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
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  window.waitingToStart = false;
  ground.reset();
  cactiController.reset();
  score.reset();
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
    // Extra: At the very start of the game, spawn a burst of sweets
    if (totalDistanceTravelled < 2000) {
      // Spawn a big burst of sweets in the first 2000px
      const burstCount = 10 + Math.floor(Math.random() * 6); // 10-15 sweets
      const burstY = GAME_HEIGHT * scaleRatio - 150 - 24 * scaleRatio;
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
      // Continue with normal logic as well
    }
    if (sweetRand < 0.28) {
      // 60% chance to spawn a row of sweets on the ground at cactus level
      const groundCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sweets
      const groundY = GAME_HEIGHT * scaleRatio - coinSize - 24 * scaleRatio; // 24 is ground height
      for (let i = 0; i < groundCount; i++) {
        let tries = 0;
        let groundX;
        do {
          groundX = x + i * (coinSize * 0.8) + (Math.random() * 20 - 10);
          tries++;
        } while (isOverlappingAny(groundX, groundY, coinSize, coinSize) && tries < MAX_TRIES);
        if (tries < MAX_TRIES) {
          coins.push(new Coin(groundX + (sweetsSpaceBetween * i), groundY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else if (sweetRand < 0.45) {
      // Next 30%: random group (4-7) of sweets on ground at cactus level
      const groundCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sweets
      const groundY = GAME_HEIGHT * scaleRatio - coinSize - (IS_MOBILE_LANDSCAPE ? 25 : 28) * scaleRatio;
      for (let i = 0; i < groundCount; i++) {
        let tries = 0;
        let groundX;
        do {
          groundX = x + i * (coinSize * 0.8) + (Math.random() * 20 - 10);
          tries++;
        } while (isOverlappingAny(groundX, groundY, coinSize, coinSize) && tries < MAX_TRIES);
        if (tries < MAX_TRIES) {
          coins.push(new Coin(groundX + (sweetsSpaceBetween * i), groundY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else if (sweetRand < 0.99) {
      // Next 9%: horizontal row group of sweets
      const rowCount = Math.floor(Math.random() * 4) + 5; // 5 to 8 sweets in a row
      const rowY = Math.random() * (maxY - minY) + minY;
      for (let i = 0; i < rowCount; i++) {
        let tries = 0;
        let rowX;
        do {
          rowX = x + i * (coinSize * 0.8) + (Math.random() * 20 - 10);
          tries++;
        } while (isOverlappingAny(rowX, rowY, coinSize, coinSize) && tries < MAX_TRIES);
        if (tries < MAX_TRIES) {
          coins.push(new Coin(rowX + (sweetsSpaceBetween * i), rowY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else {
      // Otherwise: single sweet at random y (not a group)
      let tries = 0;
      let y, tryX;
      do {
        y = Math.random() * (maxY - minY) + minY;
        tryX = x + (Math.random() * 20 - 10);
        tries++;
      } while (isOverlappingAny(tryX, y, coinSize, coinSize) && tries < MAX_TRIES);
      if (tries < MAX_TRIES) {
        coins.push(new Coin(tryX, y, "sweet", SWEET_IMAGES, scaleRatio));
      }
    }
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
      const SAFE_DIST = 350 * scaleRatio;
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
        waterDitches.push(new WaterDitch(ditchX, groundY, IS_MOBILE_LANDSCAPE));
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
      if (Math.random() < 0.3) {
        const groundY = GAME_HEIGHT * scaleRatio - 65 * scaleRatio;
        const bombHeight = 30 * scaleRatio;
        const bombWidth = (279 / 316) * bombHeight;
        const MIN_BOMB_SAFE_GAP = 220 * scaleRatio;
        let tryCount = 0;
        let placed = false;
        const cacti = cactiController && cactiController.getCactusRects ? cactiController.getCactusRects() : [];
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
        soundManager.play('explosion');
        gameOver = true;
        setupGameReset();
        score.setHighScore();
        soundManager.play('gameover', 500);
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
          window.sweetsCollected.push({
            ts: now,
            x: coin.x + coin.width / 2,
            y: coin.y + coin.height / 2
          });
        }
      }
    });
    window.sweetsCollected = window.sweetsCollected.filter(obj => now - obj.ts < 1000);
    if (window.sweetsCollected.length >= 5) {
      const last3 = window.sweetsCollected.slice(-3);
      const avgX = Math.round(last3.reduce((sum, obj) => sum + obj.x, 0) / 3);
      const avgY = Math.round(last3.reduce((sum, obj) => sum + obj.y, 0) / 3);
      const rect = canvas.getBoundingClientRect();
      const screenX = rect.left + avgX * (rect.width / canvas.width);
      const screenY = rect.top + avgY * (rect.height / canvas.height);
      showSweetPop(screenX, screenY);
      window.sweetsCollected = [];
    }
    for (const ditch of waterDitches) {
      if (ditch.isColliding(player)) {
        if (!player.jumpInProgress && !player.falling) {
          soundManager.play('waterpit');
        }
        gameOver = true;
        setupGameReset();
        score.setHighScore();
        soundManager.play('gameover', 500);
        break;
      }
    }
    coins = coins.filter((coin) => coin.visible);
    bombs = bombs.filter((bomb) => bomb.visible || (bomb.exploding && bomb.explosionFrame < 3));
  }

  if (!gameOver && cactiController.collideWith(player)) {
    // Find the colliding cactus
    let impactX = null, impactY = null;
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
        break;
      }
    }
    if (impactX !== null && impactY !== null) {
      showImpactImage(impactX, impactY);
    }
    gameOver = true;
    setupGameReset();
    score.setHighScore();
    soundManager.play('gameover', 0);
  }
// Show impact image at given canvas coordinates
function showImpactImage(x, y) {
  const rect = canvas.getBoundingClientRect();
  // Convert canvas coordinates to screen coordinates
  const screenX = rect.left + x * (rect.width / canvas.width);
  const screenY = rect.top + y * (rect.height / canvas.height);
  let impactImg = document.getElementById('impact-img');
  if (impactImg) impactImg.remove();
  impactImg = document.createElement('img');
  impactImg.id = 'impact-img';
  impactImg.src = 'images/impact.png';
  impactImg.style.position = 'absolute';
  impactImg.style.left = screenX + 'px';
  impactImg.style.top = screenY + 'px';
  impactImg.style.transform = 'translate(-50%, -50%) scale(1.2)';
  impactImg.style.zIndex = 2000;
  impactImg.style.pointerEvents = 'none';
  impactImg.style.width = '60px';
  impactImg.style.height = '60px';
  impactImg.style.opacity = '1';
  document.body.appendChild(impactImg);
  setTimeout(() => {
    if (impactImg) impactImg.style.opacity = '0';
    setTimeout(() => impactImg && impactImg.remove(), 400);
  }, 400);
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
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    window.waitingToStart = true;
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
