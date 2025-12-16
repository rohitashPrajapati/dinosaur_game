// SnailController.js
// Handles spawning and updating snails
import Snail from "./Snail.js";

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

  update(gameSpeed, frameTimeDelta, scaleRatio) {
    this.spawnTimer += frameTimeDelta;
    if (this.spawnTimer > this.SNAIL_SPAWN_INTERVAL) {
      this.spawnSnail(scaleRatio);
      this.spawnTimer = 0;
    }
    this.snails.forEach(snail => snail.update(gameSpeed, frameTimeDelta, this.groundSpeed, scaleRatio));
    this.snails = this.snails.filter(snail => snail.visible);
  }

  draw() {
    this.snails.forEach(snail => snail.draw(this.ctx));
  }

  spawnSnail(scaleRatio) {
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 200;
    const groundY = GAME_HEIGHT * scaleRatio - 38 * scaleRatio - 34 * scaleRatio; // 28: snail height, 24: ground height
    const x = GAME_WIDTH * scaleRatio + Math.random() * 200 * scaleRatio;
    this.snails.push(new Snail(x, groundY, scaleRatio));
  }

  isColliding(player) {
    return this.snails.some(snail => snail.isColliding(player));
  }
}

export default SnailController;
