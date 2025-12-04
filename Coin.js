class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 150;
    this.image = new Image();
    this.image.src = 'images/coin_small.png';
    this.visible = true;
    this.collected = false;
    this.opacity = 1;
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