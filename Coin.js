class Coin {
  constructor(x, y, type = "coin", sweetImages = []) {
    this.x = x;
    this.y = y;

    this.type = type; // "coin" or "sweet"
    this.visible = true;
    this.collected = false;
    this.opacity = 1;

      // Responsive size: check both width and height for mobile (portrait or landscape)
      const isMobile = window.innerWidth < 600 || window.innerHeight < 600;

      if (type === "coin") {
        this.image = new Image();
        this.image.src = "images/coin_small.png";
        this.scoreValue = 100;
        this.width = isMobile ? 60 : 150;
        this.height = isMobile ? 60 : 150;
      } else {
        // sweets: pick a random sweet image
        const sweetSrc = sweetImages.length > 0 ? sweetImages[Math.floor(Math.random() * sweetImages.length)] : "images/sweet_1.png";
        this.image = new Image();
        this.image.src = sweetSrc;
        this.scoreValue = 200;
        // Responsive size for sweet
        this.width = isMobile ? 60 : 80;
        this.height = isMobile ? 60 : 80;
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
    if (this.visible && this.opacity > 0) {
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