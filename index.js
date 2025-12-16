import Player from "./Player.js";
import { showSweetPop } from "./sweetPop.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import Score from "./Score.js";
import Coin from "./Coin.js";
import WaterDitch from "./WaterDitch.js";
import Bomb from "./Bomb.js";
// Water Ditch variables
let waterDitches = [];
let waterDitchSpawnDistance = 6000; // Start ditches after a long initial distance
let lastDitchSpawnDistance = 0; // Track distance at which last ditch was spawned
let totalDistanceTravelled = 0; // Track total ground distance travelled
const WATERDITCH_MIN_DISTANCE = 4000; // px, min distance between ditches (increased)
const WATERDITCH_MAX_DISTANCE = 8000; // px, max distance between ditches (increased)


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const GAME_SPEED_START = 1; // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
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

const CACTI_CONFIG = [
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
const COIN_SPAWN_INTERVAL = 1000; // ms (reduced interval for more sweets)

let bombs = [];
let bombSpawnTimer = 0;
const BOMB_SPAWN_INTERVAL = 2500; // ms, adjust for frequency

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

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

  // Water Ditch setup
  waterDitches = [];
  // Start ditches after a long initial distance
  waterDitchSpawnDistance = 6000 * scaleRatio;
  lastDitchSpawnDistance = 0;
  totalDistanceTravelled = 0;
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
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
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
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
  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  coins = [];
  coinSpawnTimer = 0;
  bombs = [];
  bombSpawnTimer = 0;
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
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText("Tap Screen or Press Space To Start", x, y);
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

  // Helper to check if a sweet would overlap any cactus
  function isOverlappingCactus(sweetX, sweetY, sweetW, sweetH) {
    if (!cactiController || !cactiController.getCactusRects) return false;
    const cacti = cactiController.getCactusRects();
    return cacti.some(cactus =>
      sweetX < cactus.x + cactus.width &&
      sweetX + sweetW > cactus.x &&
      sweetY < cactus.y + cactus.height &&
      sweetY + sweetH > cactus.y
    );
  }

  // Use a single random value for all sweet spawn probabilities
  const sweetRand = Math.random();
  if (gameMode === "sweet") {
    if (sweetRand < 0.15) {
      // 15% chance to spawn a row of sweets on the ground at cactus level
      const groundCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 sweets
      const groundY = GAME_HEIGHT * scaleRatio - coinSize - 24 * scaleRatio; // 24 is ground height
      for (let i = 0; i < groundCount; i++) {
        const groundX = x + i * (coinSize * 0.8);
        if (!isOverlappingCactus(groundX, groundY, coinSize, coinSize)) {
          coins.push(new Coin(groundX, groundY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else if (sweetRand < 0.27) {
      // Next 12%: random group (2-3) of sweets on ground at cactus level
      const groundCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 sweets
      const groundY = GAME_HEIGHT * scaleRatio - coinSize - 4 * scaleRatio;
      for (let i = 0; i < groundCount; i++) {
        const groundX = x + i * (coinSize * 0.8);
        if (!isOverlappingCactus(groundX, groundY, coinSize, coinSize)) {
          coins.push(new Coin(groundX, groundY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else if (sweetRand < 0.645) {

      // Next 37.5%: horizontal row group of sweets
      const rowCount = Math.floor(Math.random() * 2) + 3; // 3 or 4 sweets in a row
      const rowY = Math.random() * (maxY - minY) + minY;
      for (let i = 0; i < rowCount; i++) {
        const rowX = x + i * (coinSize * 0.8); // 80% overlap for nice spacing
        if (!isOverlappingCactus(rowX, rowY, coinSize, coinSize)) {
          coins.push(new Coin(rowX, rowY, "sweet", SWEET_IMAGES, scaleRatio));
        }
      }
    } else {
      // Otherwise: single sweet at random y (not a group)
      const y = Math.random() * (maxY - minY) + minY;
      if (!isOverlappingCactus(x, y, coinSize, coinSize)) {
        coins.push(new Coin(x, y, "sweet", SWEET_IMAGES, scaleRatio));
      }
    }
  } else {
    // Coin mode logic (unchanged)
    const y = Math.random() * (maxY - minY) + minY;
    if (!isOverlappingCactus(x, y, coinSize, coinSize)) {
      coins.push(new Coin(x, y, "coin", [], scaleRatio));
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
    //Update game objects
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);

    // Track total ground distance travelled
    totalDistanceTravelled += gameSpeed * frameTimeDelta * GROUND_AND_CACTUS_SPEED * scaleRatio;
    // Water Ditch spawn logic: only spawn after required distance travelled since last ditch
    if (totalDistanceTravelled - lastDitchSpawnDistance > waterDitchSpawnDistance) {
      const groundY = GAME_HEIGHT * scaleRatio - GROUND_HEIGHT * scaleRatio;
      const ditchX = GAME_WIDTH * scaleRatio;
      // Check cactus positions to avoid overlap and ensure safe distance
      const SAFE_DIST = 350 * scaleRatio; // Increased minimum safe distance between ditch and cactus
      let canSpawn = true;
      if (cactiController && cactiController.getCactusRects) {
        const cactiRects = cactiController.getCactusRects();
        for (const cactus of cactiRects) {
          // If cactus is too close to where ditch would spawn, skip this spawn
          if (Math.abs((cactus.x + cactus.width/2) - (ditchX + 81)) < SAFE_DIST) {
            canSpawn = false;
            break;
          }
        }
      }
      if (canSpawn) {
        waterDitches.push(new WaterDitch(ditchX, groundY));
        lastDitchSpawnDistance = totalDistanceTravelled;
        waterDitchSpawnDistance = Math.random() * (WATERDITCH_MAX_DISTANCE - WATERDITCH_MIN_DISTANCE) + WATERDITCH_MIN_DISTANCE;
      }
    }
    // Update ditches (move at ground speed)
    waterDitches.forEach((ditch) => ditch.update(gameSpeed, frameTimeDelta, GROUND_AND_CACTUS_SPEED, scaleRatio));
    // Remove ditches that have gone off screen
    waterDitches = waterDitches.filter((ditch) => ditch.x + ditch.width > 0);


    // Coin/sweet spawn logic
    coinSpawnTimer += frameTimeDelta;
    if (coinSpawnTimer > COIN_SPAWN_INTERVAL) {
      spawnCoinOrSweet();
      coinSpawnTimer = 0;
    }

    // Bomb spawn logic
    bombSpawnTimer += frameTimeDelta;
    if (bombSpawnTimer > BOMB_SPAWN_INTERVAL) {
      // 30% chance to spawn a bomb
      if (Math.random() < 0.3) {
        const groundY = GAME_HEIGHT * scaleRatio - 65 * scaleRatio; // 50px bomb height
        const x = GAME_WIDTH * scaleRatio + 100; // spawn just off right
        // Use Bomb's width/height for overlap check
        const bombHeight = 30 * scaleRatio;
        const bombWidth = (279 / 316) * bombHeight;
        // Require a minimum horizontal gap between bomb and any cactus
        const MIN_BOMB_CACTUS_GAP = 80 * scaleRatio; // adjust as needed for jump
        let canPlace = true;
        if (cactiController && cactiController.getCactusRects) {
          const cacti = cactiController.getCactusRects();
          for (const cactus of cacti) {
            const overlap = !(x + bombWidth + MIN_BOMB_CACTUS_GAP < cactus.x || x - MIN_BOMB_CACTUS_GAP > cactus.x + cactus.width);
            if (overlap) {
              canPlace = false;
              break;
            }
          }
        }
        if (canPlace) {
          bombs.push(new Bomb(x, groundY, scaleRatio));
        }
      }
      bombSpawnTimer = 0;
    }


    // Update coins/sweets
    coins.forEach((coin) => coin.update(gameSpeed, frameTimeDelta, GROUND_AND_CACTUS_SPEED, scaleRatio));
    // Update bombs
    bombs.forEach((bomb) => bomb.update(gameSpeed, frameTimeDelta, GROUND_AND_CACTUS_SPEED, scaleRatio));

    // Bomb collision detection
    for (const bomb of bombs) {
      if (bomb.isColliding(player) && !bomb.collected && !bomb.exploding) {
        bomb.triggerExplosion();
        gameOver = true;
        setupGameReset();
        score.setHighScore();
        break;
      }
    }

    // Collision detection
    // Track sweets collected in the last second, and their positions
    if (!window.sweetsCollected) window.sweetsCollected = [];
    const now = performance.now();
    coins.forEach((coin) => {
      if (coin.isColliding(player) && !coin.collected) {
        coin.collect();
        score.score += coin.scoreValue;
        if (coin.type === "sweet") {
          // Store timestamp and center position
          window.sweetsCollected.push({
            ts: now,
            x: coin.x + coin.width / 2,
            y: coin.y + coin.height / 2
          });
        }
      }
    });
    // Remove sweets older than 1 second
    window.sweetsCollected = window.sweetsCollected.filter(obj => now - obj.ts < 1000);
    if (window.sweetsCollected.length >= 3) {
      // Average the last 3 positions
      const last3 = window.sweetsCollected.slice(-3);
      const avgX = Math.round(last3.reduce((sum, obj) => sum + obj.x, 0) / 3);
      const avgY = Math.round(last3.reduce((sum, obj) => sum + obj.y, 0) / 3);
      // Convert game canvas position to screen position
      const rect = canvas.getBoundingClientRect();
      const screenX = rect.left + avgX * (rect.width / canvas.width);
      const screenY = rect.top + avgY * (rect.height / canvas.height);
      showSweetPop(screenX, screenY);
      window.sweetsCollected = [];
    }

    // Water Ditch collision detection (game over if player falls in)
    for (const ditch of waterDitches) {
      if (ditch.isColliding(player)) {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
        break;
      }
    }

    // Remove invisible coins/sweets
    coins = coins.filter((coin) => coin.visible);
    // Only remove bombs if their explosion animation is done
    bombs = bombs.filter((bomb) => bomb.visible || (bomb.exploding && bomb.explosionFrame < 3));
  }

  if (!gameOver && cactiController.collideWith(player)) {
    gameOver = true;
    setupGameReset();
    score.setHighScore();
  }

  //Draw game objects
  ground.draw();
  cactiController.draw();
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
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
