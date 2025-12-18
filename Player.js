export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];
  dinoRunImageIndex = 0;

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.48; // Slower upward movement for longer jump
  GRAVITY = 0.36;    // Slightly less gravity for smoother descent

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    // Maintain player aspect ratio
    if (window.IS_MOBILE_LANDSCAPE) {
      this.width = 0;
      this.height = 0;
      this.standingStillImage = new Image();
      this.standingStillImage.src = "images/player3.png";
      this.standingStillImage.onload = () => {
        const aspect = this.standingStillImage.naturalWidth / this.standingStillImage.naturalHeight;
        this.height = height;
        this.width = height * aspect;
        this._imageReady = true;
      };
      this.jumpImage = new Image();
      this.jumpImage.src = "images/player_jump.png";
      this.jumpImage.onload = () => {};
      this._imageReady = false;
    } else {
      this.width = width;
      this.height = height;
      this._imageReady = true;
    }
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    const BOTTOM_OFFSET = 31 * scaleRatio;
    this.y = this.canvas.height - this.height - BOTTOM_OFFSET;
    this.yStandingPosition = this.y;


    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/player3.png";
    this.jumpImage = new Image();
    this.jumpImage.src = "images/player_jump.png";
    this.image = this.standingStillImage;

    // Add as many run images as you want here
    const runImageSources = [
      "images/player1.png",
      "images/player2.png",
      "images/player3.png",
      "images/player4.png",
      "images/player5.png"
    ];
    runImageSources.forEach(src => {
      const img = new Image();
      img.src = src;
      this.dinoRunImages.push(img);
    });

    //keyboard
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    //touch
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  draw(ctx) {
    if (window.IS_MOBILE_LANDSCAPE && !this._imageReady) return;
    // ...existing code for drawing the player...
  }

  touchstart = () => {
    this.jumpPressed = true;
  };

  touchend = () => {
    this.jumpPressed = false;
  };

  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.jumpImage;
    } else {
      // Only set to standingStillImage if not running (prevents run() from being overridden)
      if (!this.dinoRunImages.includes(this.image)) {
        this.image = this.standingStillImage;
      }
    }

    this.jump(frameTimeDelta);
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      // Cycle through all run images
      this.dinoRunImageIndex = (this.dinoRunImageIndex + 1) % this.dinoRunImages.length;
      this.image = this.dinoRunImages[this.dinoRunImageIndex];
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  draw() {
    // Draw the image in 'contain' mode (preserve aspect ratio, fit inside box)
    const img = this.image;
    const boxWidth = this.width;
    const boxHeight = this.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const boxAspect = boxWidth / boxHeight;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgAspect > boxAspect) {
      // Image is wider than box
      drawWidth = boxWidth;
      drawHeight = boxWidth / imgAspect;
      offsetX = 0;
      offsetY = (boxHeight - drawHeight) / 2;
    } else {
      // Image is taller than box
      drawHeight = boxHeight;
      drawWidth = boxHeight * imgAspect;
      offsetX = (boxWidth - drawWidth) / 2;
      offsetY = 0;
    }
    this.ctx.drawImage(
      img,
      this.x + offsetX,
      this.y + offsetY,
      drawWidth,
      drawHeight
    );
  }
}
