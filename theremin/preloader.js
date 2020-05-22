var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){ 
        progressTxt = this.progress = this.game.add.text(0, this.game.world.centerY - 30, '0%',{
             font: '32px', fill: 'white', fontWeight: 'normal', align: 'center'
        });
        progressTxt.x = this.game.world.centerX - progressTxt.width / 2;
        this.progress.anchor.setTo(0.5, 0.5);
        this.game.load.onFileComplete.add(this.fileComplete, this);
  
        loadingTxt = this.add.text(0,  this.game.world.centerY - 150, "Loading...", {
            font: '24px', fill: 'lightgrey', fontWeight: 'normal', align: 'center'
        });
        loadingTxt.x = this.game.world.centerX - loadingTxt.width / 2;

        game.load.image('hubble', 'theremin/images/hubble.jpg');
        game.load.image('note', 'theremin/images/note.png');
        game.load.image('black_hole', 'theremin/images/black_hole.png');
        game.load.audio('blues', 'theremin/audio/blues_CM120.ogg');
        game.load.spritesheet('asteroid', 'theremin/images/asteroid1.png', 1024/8, 107);
    },
    
    create: function(){
        game.state.start("Game");  
    }, 
};

preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progress.text = progress+"%";
};