// Snail.js
// Handles snail obstacle

const SNAIL_IMAGE = "images/snail.png";

class Snail {
  constructor(x, y, scaleRatio = 1) {
    this.x = x;
    this.y = y;
    this.height = 38 * scaleRatio;
    this.width = 38 * scaleRatio; // maintain snail image aspect ratio
    this.collected = false;
    this.visible = true;
    this.scaleRatio = scaleRatio;
    this.image = new Image();
    this.image.src = SNAIL_IMAGE;
  }

  update(gameSpeed, frameTimeDelta, groundSpeed, scaleRatio) {
    if (!this.collected) {
      this.x -= gameSpeed * frameTimeDelta * groundSpeed * scaleRatio;
      if (this.x + this.width < 0) {
        this.visible = false;
      }
    }
  }

  draw(ctx) {
    if (!this.visible) return;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  isColliding(player) {
    return (
      this.visible &&
      !this.collected &&
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

export default Snail;
