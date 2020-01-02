function preload() {
    initAll();
}

function setup() {
    if(typeof tracks[tracks.length-1] == "undefined")
        setTimeout(setup, 100);
    else
    {
        canvas = createCanvas(800, 600);
        canvas.parent("game-container");
        frameRate(60);
        gamestate = "startup";
    }
}

var step = 1;
function draw() {
    if (gamestate == "game")
    {
        if (keys.pressed("left", "a") && (troopers.length == 0 || troopers[0].x != brass.x-1))
            brass.direction = 0;
        else if (keys.pressed("up", "w") && (troopers.length == 0 || troopers[0].y != brass.y-1))
            brass.direction = 1;
        else if (keys.pressed("right", "d") && (troopers.length == 0 || troopers[0].x != brass.x+1))
            brass.direction = 2;
        else if (keys.pressed("down", "s") && (troopers.length == 0 || troopers[0].y != brass.y+1))
            brass.direction = 3;
        
        background(255);/*
        stroke(0);
        fill(200);
        for (var i = 0; i < 16; i++)
        {
            for (var j = 0; j < 10; j++)
            {
                rect(i*50, j*50, 50, 50);
            }
        }*/
        image(images.background, 0, 0);
        
        if (tracks[currentTrack].checkBeat(troopers.length >= 119) && synchTrack || !synchTrack && frameCount%framesPerBeat == 0)
        {
            var collision = checkCollision();
            if (troopers.length == 159)
            {
                noLoop();
                tracks[currentTrack].pause();
                gamestate = "victory";
            }
            else if (collision == "dead")
            {
                noLoop();
                tracks[currentTrack].pause();
                gamestate = "gameover";
            }
            else
            {
                moveAll(collision, sleepy.shiny);
                step *= -1;
                if (collision && troopers.length < 159)
                    resetSleepy();
            }
        }
        falinks.trooper[0].updated = false;
        falinks.trooper[1].updated = false;
        falinks.sleepy[0].updated = false;
        falinks.sleepy[1].updated = false;
        falinks.brass.updated = false;
        
        falinks.sleepy[sleepy.shiny].play(sleepy.x*50, sleepy.y*50, true, 30);
        for (var i = 0; i < troopers.length; i++)
            troopers[i].display(step);
        brass.display(step);
        
        switch (gamestate)
        {
        case "game":
            animations.menu.updated = false;
            animations.menu.play(0, 500, true, 50);
            image(images.scorebox, 265, 519);
            noStroke();
            fill(0);
            textSize(20);
            text((troopers.length+1), 322, 550);
        break;
        case "gameover":
            endScreen("Falinks fainted!");
        break;
        case "victory":
            endScreen("You win!");
        break;
        }
    }
    else if (gamestate == "music")
        musicMenu("drag");
    else
    {
        noLoop();
        if (gamestate == "paused")
        {
            tracks[currentTrack].pause();
            pauseMenu();
        }
        if (gamestate == "startup")
            startupMenu();
    }
};

