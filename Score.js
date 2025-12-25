export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.03; // Increased running score rate
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";
    this.ctx.textBaseline = "top";
    // Always use a fixed y position for score
    const y = 10 * this.scaleRatio;
    this.ctx.textAlign = "center";

    // Load and draw the score indicator image
    const img = new window.Image();
    img.src = 'images/score_indicator-min.png';
    const scoreStr = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const hiStr = `HI  ${highScorePadded}`;
    // Calculate positions
    // We'll use a fixed height and scale width to preserve aspect ratio
    const indicatorHeight = 20 * this.scaleRatio;
    img.onload = () => {
      const aspect = img.width / img.height;
      const indicatorWidth = indicatorHeight * aspect;
      const totalWidth = this.ctx.measureText(scoreStr + '    ' + hiStr).width + indicatorWidth + 4 * this.scaleRatio;
      const startX = this.canvas.width / 2 - totalWidth / 2;
      // Draw the indicator image at its natural aspect ratio, aligned to score text baseline
      this.ctx.drawImage(img, startX, y + indicatorHeight - fontSize, indicatorWidth, indicatorHeight);
      // Draw the score next to the image
      this.ctx.textAlign = 'left';
      this.ctx.fillText(scoreStr, startX + indicatorWidth + 4 * this.scaleRatio, y);
      // Draw the HI score after a gap
      this.ctx.textAlign = 'left';
      this.ctx.fillText(hiStr, startX + indicatorWidth + 4 * this.scaleRatio + this.ctx.measureText(scoreStr).width + 32 * this.scaleRatio, y);
    };
    if (img.complete) {
      img.onload();
    }
  }
}
