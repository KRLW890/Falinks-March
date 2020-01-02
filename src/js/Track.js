var currentTrack = 2, synchTrack = true, framesPerBeat = 1;
const MUTAG = window.mutag;

var Track = function(src, beat, offset, introOffset, climaxOffset)
{
    this.beat = beat;
    this.currentBeat = 0;
    this.currentTrack = 1;
    this.audio = [];
    this.offsets = [introOffset, offset, climaxOffset];
    this.audio[1] = new Audio();
    this.audio[1].src = "music/" + src + ".mp3";
    this.getTags();
    var temp = this;
    this.audio[1].addEventListener("ended", function() {
        temp.resetBeat();
        this.currentTime = 0;
        this.play();
    });
    if (typeof introOffset == "number")
    {
        this.audio[0] = new Audio();
        this.audio[0].src = "music/" + src + "-intro.mp3";
        this.currentTrack = 0;
        var temp = this;
        this.audio[0].addEventListener("ended", function() {
            temp.resetBeat();
            this.currentTime = 0;
            temp.currentTrack = 1;
            temp.audio[1].currentTime = 0;
            temp.audio[1].play();
        });
    }
    if (typeof climaxOffset == "number")
    {
        this.audio[2] = new Audio();
        this.audio[2].src = "music/" + src + "-climax.mp3";
        var temp = this;
        this.audio[2].addEventListener("ended", function() {
            temp.resetBeat();
            this.currentTime = 0;
            this.play();
        });
    }
};

Track.prototype.getTags = function()
{
    fetch(this.audio[1].src)
        .then(response => response.blob())
        .then(MUTAG.fetch)
        .then((tags) => { this.tags = tags; });
};

Track.prototype.resetAudio = function()
{
    this.currentBeat = 0;
    for (var i = 0; i < 3; i++)
    {
        if (this.audio[i] != undefined)
        {
            this.audio[i].pause();
            this.audio[i].currentTime = 0;
//this.audio[i].playbackRate = 0.5;
         }
    }
    if (this.audio[0] != undefined)
        this.currentTrack = 0;
    else
        this.currentTrack = 1;
};

Track.prototype.play = function()
{
    if (!synchTrack && framesPerBeat == 5)
    {
        for (var i = 0; i < 3; i++)
        {
            if (this.audio[i] != undefined)
                this.audio[i].playbackRate = 2;
        }
    }
    else
    {
        for (var i = 0; i < 3; i++)
        {
            if (this.audio[i] != undefined)
                this.audio[i].playbackRate = 1;
        }
    }
    this.audio[this.currentTrack].play();
};

Track.prototype.pause = function()
{
    this.audio[this.currentTrack].pause();
};

Track.prototype.resetBeat = function()
{   // make sure that the song doesn't cause two steps in quick succession when the song restarts
    if (this.audio[this.currentTrack].currentTime+this.offsets[this.currentTrack] < (this.currentBeat+1)*this.beat-(this.beat/5))
        this.currentBeat = 0;
}

Track.prototype.checkBeat = function(climax)
{
    var output = false;
    if (Math.floor((this.audio[this.currentTrack].currentTime+this.offsets[this.currentTrack])/this.beat) != this.currentBeat && this.audio[this.currentTrack].currentTime+this.offsets[this.currentTrack] > 0)
    {
        this.currentBeat = Math.floor((this.audio[this.currentTrack].currentTime+this.offsets[this.currentTrack])/this.beat);
        output = true;
        if (climax && this.audio[2] != undefined && this.currentTrack != 2)
        {
            this.audio[this.currentTrack].pause();
            this.audio[this.currentTrack].currentTime = 0;
            this.audio[2].currentTime = 0;
            this.audio[2].play();
            this.currentTrack = 2;
            this.resetBeat();
        }
    }
    return output;
};

