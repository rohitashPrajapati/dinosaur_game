export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
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
    const y = 20 * this.scaleRatio;

    // Always center the score text
    this.ctx.textAlign = "center";

    const scorePadded = `SCORE  ${Math.floor(this.score).toString().padStart(6, 0)}`;
    const highScorePadded = highScore.toString().padStart(6, 0);
    const combinedText = `${scorePadded}    HI  ${highScorePadded}`;
    // Draw both score and high score as a single centered string
    this.ctx.fillText(combinedText, this.canvas.width / 2, y);
  }
}
