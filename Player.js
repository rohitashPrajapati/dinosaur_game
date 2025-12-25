export default class Player {
      reset() {
        this.diedAnimationPlaying = false;
        this.dinoDiedImageIndex = 0;
        this.diedAnimationTimer = this.DIED_ANIMATION_TIMER;
        this.dinoRunImageIndex = 0;
        this.dinoJumpImageIndex = 0;
        this.jumpAnimationTimer = this.JUMP_ANIMATION_TIMER;
        this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        this.jumpPressed = false;
        this.jumpInProgress = false;
        this.falling = false;
        this.image = this.standingStillImage;
        // Optionally reset position if needed:
        this.y = this.yStandingPosition;
      }
    dinoDiedImages = [];
    dinoDiedImageIndex = 0;
    diedAnimationPlaying = false;
    DIED_ANIMATION_TIMER = 60;
    diedAnimationTimer = this.DIED_ANIMATION_TIMER;
  WALK_ANIMATION_TIMER = 28;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;

  dinoRunImages = [];
  dinoRunImageIndex = 0;

  dinoJumpImages = [];
  dinoJumpImageIndex = 0;
  JUMP_ANIMATION_TIMER = 40;
  jumpAnimationTimer = this.JUMP_ANIMATION_TIMER;

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.48; // Slower upward movement for longer jump
  GRAVITY = 0.36;    // Slightly less gravity for smoother descent

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    // Setup died animation frames
    const diedImageSources = [];
    for (let i = 3; i < 16; i++) {
      const num = i.toString().padStart(3, '0');
      diedImageSources.push(`images/player_died/frame_${num}.png`);
    }
    diedImageSources.forEach(src => {
      const img = new Image();
      img.src = src;
      this.dinoDiedImages.push(img);
    });
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
    const BOTTOM_OFFSET = 45 * scaleRatio; // Changed bottom offset
    this.y = this.canvas.height - this.height - BOTTOM_OFFSET;
    this.yStandingPosition = this.y;


    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/player/frame_000.png";

    // Setup jump animation frames
    const jumpImageSources = [];
    for (let i = 0; i < 16; i++) {
      const num = i.toString().padStart(3, '0');
      jumpImageSources.push(`images/player_jump/frame_${num}.png`);
    }
    jumpImageSources.forEach(src => {
      const img = new Image();
      img.src = src;
      this.dinoJumpImages.push(img);
    });

    this.jumpImage = this.dinoJumpImages[0];
    this.image = this.standingStillImage;

    // Add as many run images as you want here
    // const runImageSources = [
    //   "images/player1.png",
    //   "images/player2.png",
    //   "images/player3.png",
    //   "images/player4.png",
    //   "images/player5.png"
    // ];
    const runImageSources = [
    "images/player/frame_000.png",
    "images/player/frame_001.png",
    "images/player/frame_002.png",
    "images/player/frame_003.png",
    "images/player/frame_004.png",
    "images/player/frame_005.png",
    "images/player/frame_006.png",
    "images/player/frame_007.png",
    "images/player/frame_008.png",
    "images/player/frame_009.png",
    "images/player/frame_010.png",
    "images/player/frame_011.png",
    "images/player/frame_012.png",
    "images/player/frame_013.png",
    "images/player/frame_014.png",
    "images/player/frame_015.png",
    "images/player/frame_016.png",
    "images/player/frame_017.png",
    "images/player/frame_018.png",
    "images/player/frame_019.png",
    "images/player/frame_020.png",
    "images/player/frame_021.png",
    "images/player/frame_022.png",
    "images/player/frame_023.png",
    "images/player/frame_024.png",
    "images/player/frame_025.png",
    "images/player/frame_026.png",
    "images/player/frame_027.png",
    "images/player/frame_028.png",
    "images/player/frame_029.png",
    "images/player/frame_030.png",
    "images/player/frame_031.png",
    "images/player/frame_032.png",
    "images/player/frame_033.png",
    "images/player/frame_034.png",
    "images/player/frame_035.png"
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
    // Only play jump sound if game is not waiting to start
    if (typeof window.waitingToStart !== 'undefined' && !window.waitingToStart) {
      if (!this.jumpPressed && !this.jumpInProgress && !this.falling) {
        try {
          import('./soundManager.js').then(({ default: soundManager }) => {
            soundManager.play('jump');
          });
        } catch (e) {}
      }
    }
    this.jumpPressed = true;
  };

  touchend = () => {
    this.jumpPressed = false;
  };

  keydown = (event) => {
    if (event.code === "Space") {
      // Only play jump sound if game is not waiting to start
      if (typeof window.waitingToStart !== 'undefined' && !window.waitingToStart) {
        if (!this.jumpPressed && !this.jumpInProgress && !this.falling) {
          try {
            import('./soundManager.js').then(({ default: soundManager }) => {
              soundManager.play('jump');
            });
          } catch (e) {}
        }
      }
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, frameTimeDelta) {
    if (this.diedAnimationPlaying) {
      this.animateDied(frameTimeDelta);
      return;
    }
    if (this.jumpInProgress) {
      this.animateJump(frameTimeDelta);
    } else {
      this.run(gameSpeed, frameTimeDelta);
      // Only set to standingStillImage if not running (prevents run() from being overridden)
      if (!this.dinoRunImages.includes(this.image)) {
        this.image = this.standingStillImage;
      }
      this.dinoJumpImageIndex = 0;
      this.jumpAnimationTimer = this.JUMP_ANIMATION_TIMER;
    }
    this.jump(frameTimeDelta);
  }

  startDiedAnimation() {
    this.diedAnimationPlaying = true;
    this.dinoDiedImageIndex = 0;
    this.diedAnimationTimer = this.DIED_ANIMATION_TIMER;
  }

  animateDied(frameTimeDelta) {
    if (this.diedAnimationTimer <= 0) {
      if (this.dinoDiedImageIndex < this.dinoDiedImages.length - 1) {
        this.dinoDiedImageIndex++;
        this.diedAnimationTimer = this.DIED_ANIMATION_TIMER;
      }
    }
    this.image = this.dinoDiedImages[this.dinoDiedImageIndex];
    this.diedAnimationTimer -= frameTimeDelta;
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

  animateJump(frameTimeDelta) {
    // Animate jump frames
    if (this.jumpAnimationTimer <= 0) {
      this.dinoJumpImageIndex = (this.dinoJumpImageIndex + 1) % this.dinoJumpImages.length;
      this.jumpAnimationTimer = this.JUMP_ANIMATION_TIMER;
    }
    this.image = this.dinoJumpImages[this.dinoJumpImageIndex];
    this.jumpAnimationTimer -= frameTimeDelta;
  }

  draw() {
    // Draw the image in 'contain' mode (preserve aspect ratio, fit inside box)
    const img = this.image;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (this.diedAnimationPlaying) {
      // Use the original image's natural size ratio, scale to player height
      const aspect = img.naturalWidth / img.naturalHeight;
      let sizeOffset = 1;
      let drawY = this.y;
      if (img.naturalWidth > img.naturalHeight) {
        sizeOffset = 0.5; // Slightly decrease size for wider images
        drawY = this.yStandingPosition + 160; // Place at ground level
      }
      drawHeight = this.height * sizeOffset;
      drawWidth = drawHeight * aspect;
      offsetX = (this.width - drawWidth) / 2;
      this.ctx.drawImage(
        img,
        this.x + offsetX,
        drawY,
        drawWidth,
        drawHeight
      );
    } else {
      let boxWidth = this.width;
      let boxHeight = this.height;
      // Slightly decrease size for jump frames
      const isJumpFrame = this.dinoJumpImages.includes(img);
      if (isJumpFrame) {
        boxWidth *= 0.88; // Decrease width by 8%
        boxHeight *= 0.88; // Decrease height by 8%
      }
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = boxWidth / boxHeight;
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
}
