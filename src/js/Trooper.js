var grid = [];
for (var i = 0; i < 10; i++)
{
    grid.push([]);
    for (var j = 0; j < 16; j++)
    {
        grid[i].push(false);
    }
}

var troopers = [];

var Trooper = function(x, y, direction, shiny)
{
    this.x = x;
    this.y = y;
    this.direction = direction;
    if (shiny != undefined)
        this.shiny = shiny;
    else if (Math.random()*200 < 1)
        this.shiny = 1;
    else
        this.shiny = 0;
    this.trooper = 1;
};

Trooper.prototype.display = function(step)
{
    var speed = 2;
    if (!synchTrack && framesPerBeat >= 60)
        speed = 3;
    else if (!synchTrack && framesPerBeat <= 10)
        speed = 1;
    translate(this.x*50+25, this.y*50+25);
    rotate(this.direction*Math.PI/2);
    scale(1, step);
    if (this.trooper == 1)
        falinks.trooper[this.shiny].play(-27, -25, false, speed);
    else
        falinks.brass.play(-32, -26, false, speed);
    scale(1, step);
    rotate(-this.direction*Math.PI/2);
    translate(-(this.x*50+25), -(this.y*50+25));
};

var brass = new Trooper(0, 0, 2, 0);
brass.trooper = 0;
grid[0][0] = true;

var sleepy = new Trooper(1, 1, 0);
var resetSleepy = function()
{
    sleepy = new Trooper(Math.floor(Math.random()*16), Math.floor(Math.random()*10), 0);
    while (grid[sleepy.y][sleepy.x])
    {
        sleepy.x = Math.floor(Math.random()*16);
        sleepy.y = Math.floor(Math.random()*10);
    }
};

var checkCollision = function()
{
    // "dead" = collision detected; true = next space has sleepy trooper; false = completely empty space
    var output = false;
    if (brass.direction == 0)
    {
        if (brass.x-1 < 0 || grid[brass.y][brass.x-1])
            output = "dead";
        else if (brass.x-1 == sleepy.x && brass.y == sleepy.y)
            output = true;
    }
    else if (brass.direction == 1)
    {
        if (brass.y-1 < 0 || grid[brass.y-1][brass.x])
            output = "dead";
        else if (brass.x == sleepy.x && brass.y-1 == sleepy.y)
            output = true;
    }
    if (brass.direction == 2)
    {
        if (brass.x+1 > 15 || grid[brass.y][brass.x+1])
            output = "dead";
        else if (brass.x+1 == sleepy.x && brass.y == sleepy.y)
            output = true;
    }
    if (brass.direction == 3)
    {
        if (brass.y+1 > 9 || grid[brass.y+1][brass.x])
            output = "dead";
        else if (brass.x == sleepy.x && brass.y+1 == sleepy.y)
            output = true;
    }
    return output;
};

var moveAll = function(add, shiny)
{
    falinks.brass.playing = false;
    falinks.trooper[0].playing = false;
    falinks.trooper[1].playing = false;
    var subtract = 1;
    if (add)
    {
        subtract = 2;
        if (troopers.length > 0)
            troopers.push(new Trooper(troopers[troopers.length-1].x, troopers[troopers.length-1].y, troopers[troopers.length-1].direction, shiny));
        else
            troopers.push(new Trooper(brass.x, brass.y, brass.direction, shiny));
    }
    else if (troopers.length > 0)
        grid[troopers[troopers.length-1].y][troopers[troopers.length-1].x] = false;
    else
        grid[brass.y][brass.x] = false;
    
    for (var i = troopers.length-subtract; i > 0; i--)
    {
        troopers[i].x = troopers[i-1].x;
        troopers[i].y = troopers[i-1].y;
        troopers[i].direction = troopers[i-1].direction;
    }
    if (troopers.length > 0)
    {
        if (brass.x+1 == troopers[0].x)
            troopers[0].direction = 0;
        else if (brass.y+1 == troopers[0].y)
            troopers[0].direction = 1;
        else if (brass.x-1 == troopers[0].x)
            troopers[0].direction = 2;
        else if (brass.y-1 == troopers[0].y)
            troopers[0].direction = 3;

        troopers[0].x = brass.x;
        troopers[0].y = brass.y;
    }
    
    if (brass.direction == 0)
        brass.x--;
    if (brass.direction == 1)
        brass.y--;
    if (brass.direction == 2)
        brass.x++;
    if (brass.direction == 3)
        brass.y++;
    grid[brass.y][brass.x] = true;
};

