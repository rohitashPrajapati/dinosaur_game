// SnailController.js
// Handles spawning and updating snails
import Snail from "./Snail.js";

// Minimum safe gap (in px) between snail and cactus/bomb for safe landing
const MIN_SNAIL_SAFE_GAP = 220;

class SnailController {
  constructor(ctx, scaleRatio, groundSpeed) {
    this.ctx = ctx;
    this.scaleRatio = scaleRatio;
    this.groundSpeed = groundSpeed;
    this.snails = [];
    this.spawnTimer = 0;
    this.SNAIL_SPAWN_INTERVAL = 3500; // ms
  }

  reset() {
    this.snails = [];
    this.spawnTimer = 0;
  }


  /**
   * Update snails and spawn new ones if needed.
   * @param {number} gameSpeed
   * @param {number} frameTimeDelta
   * @param {number} scaleRatio
   * @param {Array} cactiRects - Array of {x, y, width, height} for cacti
   * @param {Array} bombRects - Array of {x, y, width, height} for bombs
   */
  update(gameSpeed, frameTimeDelta, scaleRatio, cactiRects = [], bombRects = [], ditchRects = [], sweetRects = []) {
    this.spawnTimer += frameTimeDelta;
    if (this.spawnTimer > this.SNAIL_SPAWN_INTERVAL) {
      this.spawnSnail(scaleRatio, cactiRects, bombRects, ditchRects, sweetRects);
      this.spawnTimer = 0;
    }
    this.snails.forEach(snail => snail.update(gameSpeed, frameTimeDelta, this.groundSpeed, scaleRatio));
    this.snails = this.snails.filter(snail => snail.visible);
  }

  draw() {
    this.snails.forEach(snail => snail.draw(this.ctx));
  }

  /**
   * Spawn a snail at a safe distance from cacti and bombs.
   * @param {number} scaleRatio
   * @param {Array} cactiRects
   * @param {Array} bombRects
   */
  spawnSnail(scaleRatio, cactiRects = [], bombRects = [], ditchRects = [], sweetRects = []) {
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 200;
    const groundY = GAME_HEIGHT * scaleRatio - 38 * scaleRatio - 34 * scaleRatio;
    let tryCount = 0;
    let placed = false;
    while (!placed && tryCount < 10) {
      const x = GAME_WIDTH * scaleRatio + Math.random() * 200 * scaleRatio;
      // Check safe gap from cacti
      const safeFromCactus = !cactiRects.some(cactus =>
        Math.abs((cactus.x + cactus.width / 2) - (x + 19 * scaleRatio)) < MIN_SNAIL_SAFE_GAP * scaleRatio
      );
      // Check safe gap from bombs
      const safeFromBomb = !bombRects.some(bomb =>
        Math.abs((bomb.x + bomb.width / 2) - (x + 19 * scaleRatio)) < MIN_SNAIL_SAFE_GAP * scaleRatio
      );
      // Check safe gap from other snails
      const safeFromSnail = !this.snails.some(snail =>
        Math.abs((snail.x + snail.width / 2) - (x + 19 * scaleRatio)) < MIN_SNAIL_SAFE_GAP * scaleRatio
      );
      // Check safe gap from ditches
      const safeFromDitch = !ditchRects.some(ditch =>
        Math.abs((ditch.x + ditch.width / 2) - (x + 19 * scaleRatio)) < MIN_SNAIL_SAFE_GAP * scaleRatio
      );
      // Check safe gap from sweets
      const safeFromSweet = !sweetRects.some(sweet =>
        Math.abs((sweet.x + sweet.width / 2) - (x + 19 * scaleRatio)) < MIN_SNAIL_SAFE_GAP * scaleRatio
      );
      if (safeFromCactus && safeFromBomb && safeFromSnail && safeFromDitch && safeFromSweet) {
        this.snails.push(new Snail(x, groundY, scaleRatio));
        placed = true;
      }
      tryCount++;
    }
  }

  isColliding(player) {
    return this.snails.some(snail => snail.isColliding(player));
  }
}

export default SnailController;
