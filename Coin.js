class Coin {
  constructor(x, y, type = "coin", sweetImages = [], scaleRatio = 1) {
    this.x = x;
    this.y = y;
    this.type = type; // "coin" or "sweet"
    this.visible = true;
    this.collected = false;
    this.opacity = 1;

       // Responsive size: check both width and height for mobile (portrait or landscape)
      const isMobile = window.innerWidth < 600 || window.innerHeight < 600;
      // Use scaleRatio for responsive sizing, like player/cactus
      if (type === "coin") {
        this.image = new Image();
        this.image.src = "images/coin_small.png";
        this.scoreValue = 100;
        // Maintain coin aspect ratio (assume square for coin)
        const coinSize = (isMobile ? 60 : 150) * scaleRatio;
        if (window.IS_MOBILE_LANDSCAPE) {
          this.width = 0;
          this.height = 0;
          this.image.onload = () => {
            const aspect = this.image.naturalWidth / this.image.naturalHeight;
            this.width = coinSize * aspect;
            this.height = coinSize;
            this._imageReady = true;
          };
          this._imageReady = false;
        } else {
          this.width = coinSize;
          this.height = coinSize;
          this._imageReady = true;
        }
      } else {
        // sweets: pick a random sweet image
        const sweetSrc = sweetImages.length > 0 ? sweetImages[Math.floor(Math.random() * sweetImages.length)] : "images/sweet_1.png";
        this.image = new Image();
        this.image.src = sweetSrc;
        this.scoreValue = 200;
        // Maintain sweet aspect ratio (assume square for sweet)
        const sweetSize = (isMobile ? 30 : 30) * scaleRatio;
        if (window.IS_MOBILE_LANDSCAPE) {
          this.width = 0;
          this.height = 0;
          this.image.onload = () => {
            const aspect = this.image.naturalWidth / this.image.naturalHeight;
            console.log("Sweet image aspect:", aspect);
            this.width = sweetSize * aspect;
            this.height = sweetSize;
            this._imageReady = true;
          };
          this._imageReady = false;
        } else {
          this.width = sweetSize;
          this.height = sweetSize;
          console.log("Sweet image size:", this.width, this.height);
          this._imageReady = true;
        }
      }
  }

  update(gameSpeed, frameTimeDelta, groundSpeed, scaleRatio) {
    if (!this.collected) {
      // Use same formula as Ground for movement
      this.x -= gameSpeed * frameTimeDelta * groundSpeed * scaleRatio;
    } else {
      // Animate fade out
      this.opacity -= 0.1;
      if (this.opacity <= 0) {
        this.visible = false;
      }
    }
  }

  draw(ctx) {
    if (this.visible && this.opacity > 0 && (!window.IS_MOBILE_LANDSCAPE || this._imageReady)) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }

  collect() {
    this.collected = true;
  }

  isColliding(player) {
    return (
      this.visible &&
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

export default Coin;