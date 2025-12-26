// Register custom font for canvas
if (typeof window !== 'undefined' && window.document) {
  const style = document.createElement('style');
  style.innerHTML = `@font-face {
    font-family: 'KalamBold';
    src: url('font/Kalam-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }`;
  document.head.appendChild(style);
}
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
    this.ctx.font = `bold ${fontSize}px KalamBold, serif`;
    this.ctx.fillStyle = "#525250";
    this.ctx.textBaseline = "top";
    // Always use a fixed y position for score
    const y = 10 * this.scaleRatio;
    this.ctx.textAlign = "center";

    // Detect iOS
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Load and draw the score indicator image
    const img = new window.Image();
    img.src = 'images/score_indicator-min.png';
    // Always pad score to 6 digits for fixed width
    const scoreStr = Math.floor(this.score).toString().padStart(6, '0');
    const highScorePadded = highScore.toString().padStart(6, 0);
    const hiStr = `HI  ${highScorePadded}`;
    // Calculate positions
    // We'll use a fixed height and scale width to preserve aspect ratio
    const indicatorHeight = 20 * this.scaleRatio;
    img.onload = () => {
      const aspect = img.width / img.height;
      const indicatorWidth = indicatorHeight * aspect;
      // Use a fixed width for score text to prevent flicker
      const fixedScoreWidth = this.ctx.measureText('000000').width;
      const totalWidth = fixedScoreWidth + this.ctx.measureText(hiStr).width + indicatorWidth + 4 * this.scaleRatio;
      const startX = this.canvas.width / 2 - totalWidth / 2;
      // Adjust Y position for iOS only
      let indicatorY = y + (indicatorHeight * 0.8) - fontSize;
      if (isIOS) {
        indicatorY += 8 * this.scaleRatio; // Move image slightly lower on iOS
      }
      // Draw the indicator image at its natural aspect ratio, aligned to score text baseline
      this.ctx.drawImage(img, startX, indicatorY, indicatorWidth, indicatorHeight);
      // Draw the score next to the image
      this.ctx.textAlign = 'left';
      // Draw score at fixed width position with custom color and shadow
      this.ctx.save();
      this.ctx.fillStyle = '#2F8986';
      this.ctx.shadowColor = 'rgba(255, 179, 0, 0.5)';
      this.ctx.shadowBlur = 1 * this.scaleRatio;
      this.ctx.shadowOffsetX = 1 * this.scaleRatio;
      this.ctx.shadowOffsetY = 1 * this.scaleRatio;
      this.ctx.fillText(scoreStr, startX + indicatorWidth + 4 * this.scaleRatio, y);
      // Draw high score with same style
      this.ctx.fillText(hiStr, startX + indicatorWidth + 4 * this.scaleRatio + fixedScoreWidth + 32 * this.scaleRatio, y);
      this.ctx.restore();
      // Draw the HI score after a gap
      this.ctx.textAlign = 'left';
    };
    if (img.complete) {
      img.onload();
    }
  }
}
