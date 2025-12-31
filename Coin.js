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
        // sweets: pick a random sweet image and assign score based on image
        let sweetIndex = 0;
        let sweetSrc = "images/sweet_1.png";
        if (sweetImages.length > 0) {
          sweetIndex = Math.floor(Math.random() * sweetImages.length);
          sweetSrc = sweetImages[sweetIndex];
        }
        this.image = new Image();
        this.image.src = sweetSrc;
        // Assign different scores for each sweet image
        const sweetScores = [200, 50, 100, 200, 250, 200, 100, 200, 500];
        this.scoreValue = sweetScores[sweetIndex] || 200;
        // Maintain sweet aspect ratio (assume square for sweet)
        const sweetSize = (isMobile ? 25 : 25) * scaleRatio;
        if (window.IS_MOBILE_LANDSCAPE) {
          this.width = 0;
          this.height = 0;
          this.image.onload = () => {
            const aspect = this.image.naturalWidth / this.image.naturalHeight;
            this.width = sweetSize * aspect;
            this.height = sweetSize;
            this._imageReady = true;
          };
          this._imageReady = false;
        } else {
          this.width = sweetSize;
          this.height = sweetSize;
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