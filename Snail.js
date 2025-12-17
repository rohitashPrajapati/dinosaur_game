// Snail.js
// Handles snail obstacle

const SNAIL_IMAGE = "images/snail.png";

class Snail {
  constructor(x, y, scaleRatio = 1) {
    this.x = x;
    this.y = y;
    // Maintain snail image aspect ratio (assume square for snail)
    const snailSize = 38 * scaleRatio;
    if (window.IS_MOBILE_LANDSCAPE) {
      this.width = 0;
      this.height = 0;
      this.image.onload = () => {
        const aspect = this.image.naturalWidth / this.image.naturalHeight;
        this.height = snailSize;
        this.width = snailSize * aspect;
        this._imageReady = true;
      };
      this._imageReady = false;
    } else {
      this.height = snailSize;
      this.width = snailSize;
      this._imageReady = true;
    }
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
    if (window.IS_MOBILE_LANDSCAPE && !this._imageReady) return;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  isColliding(player) {
    // Shrink snail's collision box for less sensitive gameover
    const COLLISION_SHRINK = 0.35; // 35% smaller on all sides
    const shrinkW = this.width * COLLISION_SHRINK;
    const shrinkH = this.height * COLLISION_SHRINK;
    const sx = this.x + shrinkW / 2;
    const sy = this.y + shrinkH / 2;
    const sw = this.width - shrinkW;
    const sh = this.height - shrinkH;
    return (
      this.visible &&
      !this.collected &&
      player.x < sx + sw &&
      player.x + player.width > sx &&
      player.y < sy + sh &&
      player.y + player.height > sy
    );
  }
}

export default Snail;
