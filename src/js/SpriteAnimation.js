var SpriteAnimation = function (spritesheet, frames, xOffset, yOffset) {
    this.spritesheet = spritesheet;
    this.frames = frames;
    this.updated = false;
    this.xOffset = xOffset || 0;
    this.yOffset = yOffset || 0;
    this.frameCount = 0;
    this.playing = false;
};



SpriteAnimation.prototype.play = function (x, y, loop, framerate, w, h) {
    // plays the animation. It can either loop or stop on the last frame
    // if it is not set to loop, it returns true when the last frame has been played
    // the speed of the animation is divided by framerate
    if (framerate == null) {
        framerate = 1;
    }
    if (h == null) {
        if (w == null) {
            w = this.spritesheet.width/this.frames;
            h = this.spritesheet.height;
        } else {
            h = w * this.spritesheet.height;
            w = w * this.spritesheet.width/this.frames;
        }
    } else {
        h = h * this.spritesheet.height;
        w = w * this.spritesheet.width/this.frames;
    }

    if (this.playing === false) {
        // reset the frame counter if it's the first frame
        this.frameCount = -1;
        this.playing = true;
        this.updated = false;
    }
    
    if (!this.updated && (loop || Math.floor(this.frameCount/framerate) < this.frames - 1)) {
        this.frameCount++;
        this.updated = true;
    }
    
    image(this.spritesheet, x+this.xOffset, y+this.yOffset, w, h, (this.spritesheet.width/this.frames) * (Math.floor(this.frameCount / framerate) % this.frames), 0, this.spritesheet.width/this.frames, this.spritesheet.height);

    if (!(loop || Math.floor(this.frameCount/framerate) < this.frames - 1)) {
        // if the function is not set to loop and has reached the last frame, return true
        return true;
    }
}



SpriteAnimation.prototype.drawFrame = function (x, y, frame, w, h) {
    // draws a specific frame of the animation
    if (h == null) {
        if (w == null) {
            w = this.spritesheet.width/this.frames;
            h = this.spritesheet.height;
        } else {
            h = w * this.spritesheet.height;
            w = w * this.spritesheet.width;
        }
    } else {
        h = h * this.spritesheet.height;
        w = w * this.spritesheet.width;
    }

    image(this.spritesheet, x+this.xOffset, y+this.yOffset, w, h, (this.spritesheet.width/this.frames) * frame, 0, this.spritesheet.width/this.frames, this.spritesheet.height);
}



