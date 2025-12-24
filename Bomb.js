// Bomb.js
// Handles bomb obstacle and explosion animation

const BOMB_IMAGE = "images/bomb.png";
const BOMB_EXPLOSION_IMAGES = [
  "images/brust1.png",
  "images/brust2.png",
  "images/brust3.png"
];

class Bomb {
  constructor(x, y, scaleRatio = 1) {
    this.x = x;
    this.y = y;
    // Maintain bomb image aspect ratio 279:316
    this.height = 30 * scaleRatio; // or any preferred height
    if (window.IS_MOBILE_LANDSCAPE) {
      this.width = 0;
      this.image.onload = () => {
        const aspect = this.image.naturalWidth / this.image.naturalHeight;
        this.width = this.height * aspect;
        this._imageReady = true;
      };
      this._imageReady = false;
    } else {
      this.width = (279 / 316) * this.height;
      this._imageReady = true;
    }
    // Explosion image aspect ratio 890:813
    this.explosionHeight = this.height;
    this.explosionWidth = (890 / 813) * this.explosionHeight;
    this.collected = false;
    this.visible = true;
    this.scaleRatio = scaleRatio;
    this.image = new Image();
    this.image.src = BOMB_IMAGE;
    this.exploding = false;
    this.explosionFrame = 0;
    this.explosionTimer = 0;
  }

  update(gameSpeed, frameTimeDelta, groundSpeed, scaleRatio) {
    if (window.IS_MOBILE_LANDSCAPE && !this._imageReady) return;
    if (!this.collected) {
      this.x -= gameSpeed * frameTimeDelta * groundSpeed * scaleRatio;
      // Only hide if fully off screen and not exploding
      if (this.x + this.width < 0) {
        this.visible = false;
      }
    } else if (this.exploding) {
      this.explosionTimer += frameTimeDelta;
      if (this.explosionTimer > 80) { // 80ms per frame
        this.explosionFrame++;
        this.explosionTimer = 0;
      }
      // Only hide after explosion animation AND off screen
      if (this.explosionFrame >= BOMB_EXPLOSION_IMAGES.length && this.x + this.width < 0) {
        this.visible = false;
      }
    }
  }

  draw(ctx) {
    if (!this.visible) return;
    if (this.exploding && this.explosionFrame < BOMB_EXPLOSION_IMAGES.length) {
      const img = new Image();
      img.src = BOMB_EXPLOSION_IMAGES[this.explosionFrame];
      // Center the explosion on the bomb
      const ex = this.x + (this.width - this.explosionWidth) / 2;
      const ey = this.y + (this.height - this.explosionHeight) / 2;
      ctx.drawImage(img, ex, ey, this.explosionWidth, this.explosionHeight);
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  triggerExplosion() {
    this.collected = true;
    this.exploding = true;
    this.explosionFrame = 0;
    this.explosionTimer = 0;
  }

  isColliding(player) {
    // Shrink bomb collision box by 30% on all sides
    const shrinkW = this.width * 0.15;
    const shrinkH = this.height * 0.15;
    const bombX = this.x + shrinkW;
    const bombY = this.y + shrinkH;
    const bombW = this.width - 2 * shrinkW;
    const bombH = this.height - 2 * shrinkH;
    return (
      this.visible &&
      !this.collected &&
      player.x < bombX + bombW &&
      player.x + player.width > bombX &&
      player.y < bombY + bombH &&
      player.y + player.height > bombY
    );
  }
}

export default Bomb;
