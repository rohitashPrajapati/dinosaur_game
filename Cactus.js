export default class Cactus {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    // Maintain cactus image aspect ratio
    if (window.IS_MOBILE_LANDSCAPE) {
      this.width = 0;
      this.height = 0;
      if (image) {
        image.onload = () => {
          this.height = height;
          this.width = height * (image.naturalWidth / image.naturalHeight);
          this._imageReady = true;
        };
      }
      this._imageReady = false;
    } else {
      this.width = width;
      this.height = height;
      this._imageReady = true;
    }
    this.image = image;
  }

  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  }

  draw() {
    if (window.IS_MOBILE_LANDSCAPE && !this._imageReady) return;
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWith(sprite) {
    const adjustBy = 1.8;
    if (
      sprite.x < this.x + this.width / adjustBy &&
      sprite.x + sprite.width / adjustBy > this.x &&
      sprite.y < this.y + this.height / adjustBy &&
      sprite.height + sprite.y / adjustBy > this.y
    ) {
      return true;
    } else {
      return false;
    }
  }
}
