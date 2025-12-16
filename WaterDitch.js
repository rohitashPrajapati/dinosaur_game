class WaterDitch {
  constructor(gameWidth, groundY) {
    this.width = 81 * 2; // width of the ditch
    this.height = 36 * 2; // depth of the ditch
    this.x = gameWidth;
    // this.y = groundY - this.height + 5; // align with ground
    this.y = groundY - 16; // align with ground
    this.image = new Image();
    this.image.src = 'images/waterpit.png';
    this.passed = false;
  }

  update(gameSpeed, frameTimeDelta, groundSpeed, scaleRatio) {
    // Move at the same speed as the ground
    this.x -= gameSpeed * frameTimeDelta * groundSpeed * scaleRatio;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  isColliding(player) {
    // Shrink the effective collision area for fairness
    const COLLISION_MARGIN = 0.35; // 18% margin on each side
    const margin = this.width * COLLISION_MARGIN;
    const effectiveX = this.x + margin;
    const effectiveWidth = this.width - 2 * margin;
    const playerBottom = player.y + player.height;
    const playerRight = player.x + player.width;
    const playerLeft = player.x;
    // If player is within the reduced ditch x range and not above it (i.e., not jumping)
    return (
      playerRight > effectiveX &&
      playerLeft < effectiveX + effectiveWidth &&
      playerBottom >= this.y
    );
  }
}

export default WaterDitch;
