export default class Ground {
  constructor(ctx, width, height, speed, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.scaleRatio = scaleRatio;

    this.x = 0;
    this.y = this.canvas.height - this.height;

    this.groundImage = new Image();
    this.groundImage.src = "images/ground.png";

    // Flag to control visibility
    this.visible = true;
  }

  update(gameSpeed, frameTimeDelta) {
    this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
  }

  draw() {
    if (!this.visible) return;
    // Draw ground image in 'contain' mode (preserve aspect ratio)
    const imgAspect = this.groundImage.width / this.groundImage.height || 1;
    const drawHeight = this.height;
    const drawWidth = drawHeight * imgAspect;

    // Repeat ground image to fill the ground width
    let drawX = this.x;
    while (drawX < this.canvas.width) {
      this.ctx.drawImage(
        this.groundImage,
        drawX,
        this.y,
        drawWidth,
        drawHeight
      );
      drawX += drawWidth;
    }

    if (this.x < -drawWidth) {
      this.x = 0;
    }
  }

  reset() {
    this.x = 0;
  }
}
