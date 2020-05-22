var gameMain = function(game){   
    var osc, rev, acceY, frequency, frequency_check, volume;
    var note, last_frequency, form, scale, reverb, tempo;
    var watchID;

    notes_blues = [
    	'G2','Bb2',
        'C3','Eb3','F3','Gb3','G3','Bb3','C4','Eb4','F4','Gb4','G4','Bb4',
        'C5','Eb5','F5','Gb5','G5','Bb5','C6','Eb6','F6','Gb6','G6','Bb6','C7','Eb7',
        'F7','Gb7','G7','Bb7'  
    ];  
};

gameMain.prototype = {
    create: function(){  
        
        hubble = game.add.tileSprite(0, 0, WIDTH, 1275, 'hubble');
		
		osc0 = T("cosc", {wave:'saw', beats:5, mul:0.25});
        osc1 = T("cosc", {wave:'sin', beats:4, mul:0.65});
        osc2 = T("cosc", {wave:'sin', beats:4, mul:0.7});
        osc3 = T("cosc", {wave:'tri', beats:3, mul:0.9});

        rev0 = T("reverb", {room:0.7, damp:0.5, mix:0.6}, osc0);
        rev1 = T("reverb", {room:0.8, damp:0.3, mix:0.75}, osc1);
        rev2 = T("reverb", {room:0.8, damp:0.5, mix:0.65}, osc2);
        rev3 = T("reverb", {room:0.7, damp:0.4, mix:0.6}, osc3);
    
        name_to_osc = {
            'hole0': osc0,  
            'hole1': osc1,  
            'hole2': osc2,  
            'hole3': osc3
        };
        
        name_to_rev = {
            'hole0': rev0,  
            'hole1': rev1,  
            'hole2': rev2,  
            'hole3': rev3
        };
        
        try{
            window.plugins.insomnia.keepAwake();
        } catch(e){}
        
        setTimeout(function(){
            try{
                StatusBar.hide;
            } catch(e){}    
        }, 1000);
        
        asteroids = game.add.group();
        asteroids.enableBody = true;
        asteroids.physicsBodyType = Phaser.Physics.ARCADE;  
       
        sfxBlues = game.add.audio('blues', 0.85, true),

        buttons = game.add.group();

        hole0 = buttons.create(200, 350, 'black_hole');
        hole0.anchor.set(0.5, 0.5);
        hole0.tint = 0xff0000;
        hole0.inputEnabled = true;
        hole0.name = 'hole0';
        hole0.events.onInputDown.add(playHole, this);
        hole0.events.onInputUp.add(function(){
            stopHole(hole0, 0xff0000);
        }, this);
        game.input.addPointer();
        
        hole1 = buttons.create(640, 350, 'black_hole');
        hole1.anchor.set(0.5, 0.5);
        hole1.tint = 0x000fff;
        hole1.inputEnabled = true;
        hole1.name = 'hole1';
        hole1.events.onInputDown.add(playHole, this);
        hole1.events.onInputUp.add(function(){
            stopHole(hole1, 0x000fff);
        }, this);
        game.input.addPointer();
        
        hole2 = buttons.create(200, 750, 'black_hole');
        hole2.anchor.set(0.5, 0.5);
        hole2.tint = 0xffff00;
        hole2.inputEnabled = true;
        hole2.name = 'hole2';
        hole2.events.onInputDown.add(playHole, this);
        hole2.events.onInputUp.add(function(){
            stopHole(hole2, 0xffff00);
        }, this);
        game.input.addPointer();
        
        hole3 = buttons.create(640, 750, 'black_hole');
        hole3.anchor.set(0.5, 0.5);
        hole3.tint = 0xff00ff;
        hole3.inputEnabled = true;
        hole3.name = 'hole3';
        hole3.events.onInputDown.add(playHole, this);
        hole3.events.onInputUp.add(function(){
            stopHole(hole3, 0xff00ff);
        }, this);
        game.input.addPointer();  
        
        hole4 = buttons.create(640, 750, 'black_hole');
        hole4.scale.set(0.7, 0.7);
        hole4.anchor.set(0.5, 0.5);
        hole4.x = game.world.centerX - hole4.width / 2 + 115;
        hole4.y = game.world.centerY - hole4.width / 2 + 115;
        hole4.inputEnabled = true;
        hole4.name = 'musicHole';
        hole4.events.onInputDown.add(playMusic, this);
        var tween = game.add.tween(hole4.scale).to( { x: 0.8, y:0.8 }, 2000, "Linear", true, 0, -1);
        tween.yoyo(true, 0);
        game.input.addPointer();
        
        note = game.add.image(hole4.x - 65, hole4.y - 65, 'note');
        note.alpha = 0.7;
   
        note1Text = game.add.text(0, 300, 'I', {
            font: '43px ' + font, fill: 'white', fontWeight: 'bold', align: 'center'
        });
        note1Text.x = hole2.x - note1Text.width/2;
        
        note2Text = game.add.text(0, 300, 'II', {
            font: '43px ' + font, fill: 'lightblue', fontWeight: 'bold', align: 'center'
        });
        note2Text.x = hole1.x - note2Text.width/2;
        
        note3Text = game.add.text(0, 700, 'III', {
            font: '43px ' + font, fill: 'lightgreen', fontWeight: 'bold', align: 'center'
        });
        note3Text.x = hole0.x - note3Text.width/2;
        
        note4Text = game.add.text(0, 700, 'IV', {
            font: '43px ' + font, fill: 'lightyellow', fontWeight: 'bold', align: 'center'
        });
        note4Text.x = hole3.x - note4Text.width/2;
       
        try{
            watchReading();
        } catch(e){}
		
		instText = game.add.text(0, 970, 'Touch & hold the holes to play!.\nTilt your device back and forth to change notes.\nTilt sideways to change volume.', {
            font: '28px ' + font, fill: 'lightyellow', fontWeight: 'bold', align: 'center'
        });
        
        instText.x = game.world.centerX - instText.width / 2;
        instText.alpha = 0;
    
        game.add.tween(instText).to( { alpha: 1 }, 6000, "Linear", true);
        
        setTimeout(function(){
            game.add.tween(instText).to( { alpha: 0 }, 12000, "Linear", true);
        }, 10000);

        createAsteroids();
        
        initAd();
    }, 
    
    update: function(){  
    	hole0.angle -= 0.1;	
    	hole1.angle += 0.32;	
    	hole2.angle -= 0.22;	
    	hole3.angle += 0.2;	
   	}
};

function playHole(_hole){     
    for (x=0; x<name_to_rev.length; x++){
        name_to_rev[x].pause();
    }
    
    var hole_name = _hole.name;  
    name_to_rev[hole_name].play(); 
    _hole.tint = Math.random() * 0xffffff;
}

function stopHole(_hole, _tint){
    var hole_name = _hole.name; 
    name_to_rev[hole_name].pause();
    _hole.tint = _tint;   
}

function watchReading(){
    watchID = navigator.accelerometer.watchAcceleration(readAccel, onError, { frequency: 100 });
}

function readAccel(acceleration){    
    acceY = Math.round(acceleration.y + 11);
    acceX = Math.abs(acceleration.x * 1.3);
    
    if (acceleration.x < 0){
        hole0.alpha = 1 - (Math.abs(acceleration.x) / 12);
        hole2.alpha = 1 - (Math.abs(acceleration.x) / 12);
        
        note1Text.alpha = 1.2 - (Math.abs(acceleration.x) / 12);
        note3Text.alpha = 1.2 - (Math.abs(acceleration.x) / 12);
    }
    else{
        hole1.alpha = 1 - (Math.abs(acceleration.x) / 12);
        hole3.alpha = 1 - (Math.abs(acceleration.x) / 12);
        
        note2Text.alpha = 1.2 - (Math.abs(acceleration.x) / 12);
        note4Text.alpha = 1.2 - (Math.abs(acceleration.x) / 12);
    }
    
    if (acceY < 0) acceY = 0;
    if (acceX > 30) acceX = 30;

    hubble.autoScroll(0, acceY * 70);

    note0 = acceY - 3; // saw - lead
    note1 = acceY; // sin - chord
    note2 = acceY - 5; // sin - chord
    note3 = acceY - 10; // tri - bass
    
    var notes = [note0, note1, note2, note3, 0];
    
    for (n=0; n>notes.length; notes++){
        if (notes[n] < 0) notes[n] = 0;
        if (notes[n] > notes_blues.length - 1) notes[n] = notes_blues.length - 1;
    }
 
    frequency1 = teoria.note(notes_blues[note0]).fq();
    frequency2 = teoria.note(notes_blues[note1]).fq();
    frequency3 = teoria.note(notes_blues[note2]).fq();
    frequency4 = teoria.note(notes_blues[note3]).fq();

    osc0.set({freq: frequency1, mul: hole0.alpha - 0.2});
    osc1.set({freq: frequency2, mul: hole1.alpha - 0.2});
    osc2.set({freq: frequency3, mul: hole2.alpha - 0.2});
    osc3.set({freq: frequency4, mul: hole3.alpha - 0.2});
    
    note1Text.text = notes_blues[note0];
    note2Text.text = notes_blues[note1];
    note3Text.text = notes_blues[note2];
    note4Text.text = notes_blues[note3];
}

function onError(){
	alert('error');
}

function initAd(){
    var admobid = {};

    admobid = {
        banner: 'ca-app-pub-9795366520625065/5463880917'
    };

    if(AdMob) AdMob.createBanner({
       adId: admobid.banner,
       position: AdMob.AD_POSITION.TOP_CENTER,
       autoShow: true
    });
}

function playMusic(){
	if (!sfxBlues.isPlaying){
		sfxBlues.play();
		note.tint = 0xfffa00;
		hole4.tint = 0xaa00ff;
	}
	else{
		sfxBlues.stop();
		note.tint = 0xffffff;
		hole4.tint = 0xffffff;
	}
}


function createAsteroids(){  
    var time_to_next = game.rnd.integerInRange(800, 5000);

    var start_x = game.rnd.integerInRange(50, WIDTH - 50);
    var start_y = game.rnd.integerInRange(-2500, 2500);
    var frame =  game.rnd.integerInRange(1, 7);
    
    var vel_y = game.rnd.integerInRange(-300, 300);
    var vel_x = game.rnd.integerInRange(-300, 300);
    var scale = game.rnd.integerInRange(3, 8) / 10;

    var asteroid_alpha = game.rnd.integerInRange(5, 9);

    asteroid = asteroids.create(start_x ,start_y, 'asteroid');
    asteroid.frame = frame;
    asteroid.scale.set(scale, scale);

    asteroid.body.velocity.y = vel_y;
    asteroid.body.velocity.x = vel_x;

    asteroid.alpha = 0;
    game.add.tween(asteroid).to( { alpha: parseFloat('0.' + asteroid_alpha) }, 1000, Phaser.Easing.Linear.None, true);

    asteroid_timer = game.time.events.add(time_to_next, function(){
        createAsteroids(); 
    }, this, []);
}