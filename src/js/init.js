var images, falinks, animations;
var tracks;

var keys = {
    all: [],
    up: 38, down: 40, left: 37, right: 39,
    w: 87, a: 65, s: 83, d: 68,
    enter: 13,
    pressed: function(code, code2) {
        if (typeof code == "number")
            return keys.all[code] || keys.all[code2];
        else
            return keys.all[keys[code]] || keys.all[keys[code2]];
    }
};
function keyPressed() {
    keys.all[keyCode] = true;
    
    if (keys.pressed("enter") && gamestate == "game")
        gamestate = "paused";
};
function keyReleased() {
    keys.all[keyCode] = false;
};
function handleKeys() {
    for (var i = 0; i < keys.all.length; i++)
        keys.all[i] = false;
};

function loadSprites() {
    images = {
        brass: loadImage("images/brass.png"),
        trooper: [
            loadImage("images/trooper.png"),
            loadImage("images/trooper-shiny.png")
        ],
        sleepy: [
            loadImage("images/sleep-trooper.png"),
            loadImage("images/sleep-trooper-shiny.png")
        ],
        background:
            loadImage("images/background.png"),
        menu:
            loadImage("images/menu.png"),
        scorebox:
            loadImage("images/scorebox.png"),
        musicmenu:
            loadImage("images/musicmenu.png"),
        button:
            loadImage("images/button-large.png"),
        selected:
            loadImage("images/selected.png")
    };
};

function loadAudio() {
    tracks = [
        new Track("rose", 0.816326531, 0.005, 0),
        new Track("route8", 0.568682927, 0, 0),
        new Track("pokejobs", 0.475, 0),
        new Track("gym", 0.42871875, -0.007, -0.01, -0.01),
        new Track("leon", 0.361694118, 0, 0)
    ];
};

function initAnimations() { // for miscellaneous animations
    falinks = {
        brass: new SpriteAnimation(images.brass, 5),
        trooper: [
            new SpriteAnimation(images.trooper[0], 5),
            new SpriteAnimation(images.trooper[1], 5)
        ],
        sleepy: [
            new SpriteAnimation(images.sleepy[0], 2),
            new SpriteAnimation(images.sleepy[1], 2)
        ]
    };
    animations = {
        menu: new SpriteAnimation(images.menu, 2)
    };
};

function initAll() {
    loadSprites();
    loadAudio();
    initAnimations();
};