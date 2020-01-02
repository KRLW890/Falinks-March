var gamestate = "loading";

var startupMenu = function()
{
    image(images.background, 0, 0);
    image(images.button, 250, 200);
    image(images.button, 250, 330);
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(207, 137, 83);
    stroke(97, 50, 14);
    strokeWeight(7);
    text("Falinks March", 400, 120);
    textSize(23);
    strokeWeight(4);
    text("Begin", 400, 238);
    text("Choose Music", 400, 368);
};

var startupFunctionality = function()
{
    if (mouseX >= 250 && mouseX <= 550)
    {
        if (mouseY >= 200 && mouseY <= 275)
            resetGame();
        else if (mouseY >= 330 && mouseY <= 405)
        {
            gamestate = "music";
            musicMenu(false);
        }
    }
}

var resetGame = function()
{
    brass.x = 0;
    brass.y = 0;
    brass.direction = 2;
    troopers = [];
    resetSleepy();
    for (var i = 0; i < 10; i++)
    {
        for (var j = 0; j < 16; j++)
        {
            grid[i][j] = false;
        }
    }
    grid[0][0] = true;
    gamestate = "game";
    frameCount = 0;
    loop();
    tracks[currentTrack].resetAudio();
    tracks[currentTrack].play();
};

var pauseMenu = function()
{
    background(255);
    image(images.background, 0, 0);
    image(images.button, 250, 150);
    image(images.button, 250, 250);
    image(images.button, 250, 350);
    image(images.button, 250, 350);
    image(images.scorebox, 343, 545);
    noStroke();
    fill(0);
    textSize(20);
    text((troopers.length+1), 400, 576);
    fill(207, 137, 83);
    stroke(97, 50, 14);
    textSize(35);
    strokeWeight(5);
    text("Paused", 400, 100);
    textSize(23);
    strokeWeight(4);
    text("Resume", 400, 188);
    text("Restart", 400, 288);
    text("Music Options", 400, 388);
};

var pauseFunctionality = function()
{
    if (mouseX >= 250 && mouseX <= 550)
    {
        if (mouseY >= 150 && mouseY <= 225)
        {
            gamestate = "game";
            loop();
            tracks[currentTrack].play();
        }
        else if (mouseY >= 250 && mouseY <= 325)
            resetGame();
        else if (mouseY >= 350 && mouseY <= 425)
        {
            gamestate = "pausememo";
            strokeWeight(3);
            stroke(97, 50, 14);
            fill(186, 128, 124);
            rect(200, 175, 400, 200, 4);
            image(images.button, 230, 310, 150, 38);
            image(images.button, 420, 310, 150, 38);
            
            strokeWeight(5);
            fill(207, 137, 83);
            text("Warning:\nchanging music settings will reset the game. Continue?", 210, 185, 380, 100);
            text("Yes", 305, 329);
            text("No", 495, 329);
        }
    }
}

var pauseMemo = function()
{
    if (mouseY >= 310 && mouseY <= 348)
    {
        if (mouseX >= 230 && mouseX <= 380)
        {
            gamestate = "music";
            musicMenu(false);
        }
        else if (mouseX >= 420 && mouseX <= 570)
        {
            gamestate = "paused";
            pauseMenu();
        }
    }
};

var musicMenu = function(mouse)
{ // TALB = album, TIT2 = title, TPE1 = artist
    if (mouse == "click")
    {
        if (mouseX >= 475 && mouseX <= 775 && mouseY >= 100 && mouseY <= 475)
            currentTrack = Math.floor((mouseY-100)/75);
        else if (mouseY >= 390 && mouseY <= 420 && mouseX >= 50 && mouseX <= 450)
        {
            synchTrack = false;
            loop();
        }
        else if (mouseY >= 530 && mouseY <= 570)
        {
            if (mouseX >= 130 && mouseX <= 270)
                resetGame();
            else if (mouseX >= 530 && mouseX <= 670)
                synchTrack = true;
        }
    }
    if (mouse == "drag")
    {
        framesPerBeat = Math.floor((415-constrain(mouseX, 90, 415))*70/325+5);
    }
    noStroke();
    fill(255);
    rect(0, 500, 800, 100);
    strokeWeight(2);
    stroke(0);
    rect(130, 530, 140, 40, 2);
    rect(530, 530, 140, 40, 2);
    fill(0);
    noStroke();
    textSize(20);
    text("Begin", 200, 550);
    text("Synch speed", 600, 550);
    
    image(images.musicmenu, 0, 0);
    image(images.selected, 476, 100+75*currentTrack);
    fill(207, 137, 83);
    strokeWeight(4);
    stroke(97, 50, 14);
    textSize(25);
    for (var i = 0; i < 5; i++)
        text(tracks[i].tags.TIT2, 487, 110+75*i, 280, 55);
    fill(255, 174, 111);
    textSize(27);
    text("Selected track:", 237, 70);
    textSize(23);
    textAlign(LEFT, TOP);
    text("Title:\n\n\nArtist(s):\n\n\nAlbum:\n\n\nSpeed:", 50, 100);
    var lineHeight = textAscent() + textDescent() + 1.5;
    text(tracks[currentTrack].tags.TIT2, 75, 100+lineHeight, 390, 80);
    text(tracks[currentTrack].tags.TPE1, 75, 100+lineHeight*4, 390, 80);
    text(tracks[currentTrack].tags.TALB, 75, 100+lineHeight*7, 390, 80);
    
    strokeWeight(2);
    rect(90, 408, 325, 4);
    fill(97, 50, 14);
    triangle(90, 404, 90, 416, 82, 410);
    triangle(415, 404, 415, 416, 423, 410);
    strokeWeight(5);
    var speedX;
    if (synchTrack)
        speedX = 415-(60*tracks[currentTrack].beat-5)*325/70;
    else
        speedX = 415-(framesPerBeat-5)*325/70;
    line(speedX, 404, speedX, 416);
    noStroke();
    textSize(12);
    textAlign(RIGHT, CENTER);
    text("slower", 75, 410);
    textAlign(LEFT, CENTER);
    text("faster", 430, 410);
    textAlign(CENTER, CENTER);
    if (synchTrack)
        text("Speed synched to track", 252, 430);
    else if (framesPerBeat == 5)
    {
        fill(235, 0, 0);
        text("SPICY HOT MODE ACTIVATED", 252, 430);
    }
    else
        text("Speed desynched from track", 252, 430);
};

var endScreen = function(message)
{
      // background
    noStroke();
    fill(255);
    rect(0, 500, 800, 100);
      // buttons
    stroke(0);
    strokeWeight(2.4);
    fill(255);
    rect(130, 540, 140, 40, 2);
    rect(530, 540, 140, 40, 2);
      // text and scorebox
    noStroke();
    fill(0);
    textSize(30);
    text(message, 400, 525);
    image(images.scorebox, 343, 545);
    fill(0);
    textSize(20);
    text((troopers.length+1), 400, 576);
    text("Play again", 200, 560);
    text("Music options", 600, 560);
};

var endScreenClick = function()
{
    if (mouseY >= 540 && mouseY <= 580)
    {
        if (mouseX >= 130 && mouseX <= 270)
            resetGame();
        else if (mouseX >= 530 && mouseX <= 670)
        {
            gamestate = "music";
            musicMenu(false);
        }
    }
};


var mousePressed = function() {
    switch (gamestate)
    {
    case "startup":
        startupFunctionality();
    break;
    case "paused":
        pauseFunctionality();
    break;
    case "pausememo":
        pauseMemo();
    break;
    case "music":
        musicMenu("click");
    break;
    case "gameover":
    case "victory":
        endScreenClick();
    break;
    }
};

var mouseReleased = function()
{
    if (gamestate == "music")
        noLoop();
};
