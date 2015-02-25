// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.CANVAS, 'gameDiv');

var mainState = {

    preload: function () {
        "use strict";
        game.stage.backgroundColor = '#c5e0ff';

        game.load.image('player', 'assets/koala.png');
        game.load.image('coin', 'assets/coin.png');
        game.load.image('cloud', 'assets/cloud.png');
        game.load.image('raincloud', 'assets/raincloud.png');
    },

    create: function () {
        "use strict";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 320;
        this.scale.minHeight = 480;
        this.scale.maxWidth = 768;
        this.scale.maxHeight = 1152;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        game.scale.refresh();
        
        this.player = this.game.add.sprite(100, 245, 'player');

        game.physics.arcade.enable(this.player);
        this.player.body.setSize(20, 20, 0, 0);
        this.player.body.gravity.y = 1000;
        
        game.input.onDown.add(this.jump, this);
            
//        var spaceKey = this.game.input.keyboard.addKey(Phaser.K);
//        spaceKey.onDown.add(this.jump, this);
        
        this.coins = game.add.group();
        this.coins.enableBody = true;
        this.coins.createMultiple(20, 'coin');
        
        this.timer = game.time.events.loop(1500, this.addRowOfCoins, this);
        
        this.clouds = game.add.group();
        this.clouds.enableBody = true;
        this.clouds.createMultiple(10, 'cloud');
        
        this.timer = game.time.events.loop(500, this.addClouds, this);
        this.rainclouds = game.add.group();
        this.rainclouds.enableBody = true;
        this.rainclouds.availHeight = 10;
        this.rainclouds.availWidth = 10;
        this.rainclouds.createMultiple(5, 'raincloud');
        
        this.timer = game.time.events.loop(3000, this.addRainClouds, this);
        
        this.timer = game.time.events.loop(10000, this.addExtraRainClouds, this);
        
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        this.player.anchor.setTo(-0.2, 0.5);
    },

    update: function () {
        "use strict";
        if (this.player.inWorld === false) {
            this.restartGame();
        }
        game.physics.arcade.overlap(this.player, this.coins, this.addScore, null, this);
        game.physics.arcade.overlap(this.player, this.rainclouds, this.restartGame, null, this);
        if (this.player.angle < 20) {
            this.player.angle += 1;
        }
    },
    showScore: function () {
        "use strict";
        window.location.href("score");
    },
    addScore: function (player, coin) {
        "use strict";
        coin.kill();
        this.score += 1;
        this.labelScore.text = this.score;
    },
    jump: function () {
        "use strict";
        this.player.body.velocity.y = -350;
        
        var animation = game.add.tween(this.player);
        animation.to({angle: -20}, 100);
        animation.start();
    },

    restartGame: function () {
        "use strict";
        if (this.score !== 0) {
            this.checkScore();
            window.location.href = ('#score');
            $('#yourScore').text(this.score);
            var highScore = localStorage.getItem('score');
            if (highScore === 0) {
                highScore = this.score;
            }
            $('#highScore').text(highScore);
        }
        game.state.start('main');
    },
    checkScore: function () {
        "use strict";
        var highScore = localStorage.getItem('score');
        if (this.score > highScore) {
            localStorage.setItem('score', this.score);
        }
    },
    addClouds: function () {
        "use strict";
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 9; i++) {
            if (i == hole) {
                this.addCloud(400, i * 60 + 10);
            }
        }
    },
    addCloud: function (x, y) {
        "use strict";
        var cloud = this.clouds.getFirstDead();
        
        cloud.reset(x, y);
        cloud.body.velocity.x = -200;
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },
    addExtraRainClouds: function () {
        "use strict";
        this.timer = game.time.events.loop(5000, this.addRainClouds, this);
    },
    addRainClouds: function () {
        "use strict";
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++) {
            if (i == hole) {
                this.addRainCloud(400, i * 60 + 10);
            }
        }
    },
    addRainCloud: function (x, y) {
        "use strict";
        var raincloud = this.rainclouds.getFirstDead();
        
        raincloud.reset(x, y);
        raincloud.body.velocity.x = -200;
        raincloud.checkWorldBounds = true;
        raincloud.outOfBoundsKill = true;
    },
    addOneCoin: function (x, y) {
        "use strict";
        var coin = this.coins.getFirstDead();
        
        coin.reset(x, y);
        coin.body.velocity.x = -200;
        coin.checkWorldBounds = true;
        coin.outOfBoundsKill = true;
    },
    addRowOfCoins: function () {
        "use strict";
        var hole = Math.floor(Math.random() * 5) + 1;

/*        for (var i = 0; i < 2; i++) {
            if (i != hole && i != hole + 1) {
                this.addOneCoin(400, i * 60 + 10);
            }
        }*/
        
        for (var i = 0; i < 8; i++) {
            if (i == hole) {
                this.addOneCoin(400, i * 60 + 10);
            }
        }
        this.labelScore.text = this.score;
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);

function startGame () {
    "use strict";
    window.location.href= ('#play');
    game.state.start('main');
};
$(document).ready(function () {
    "use strict";
    setTimeout(function () {                                             window.location.href = ('#start');
                }, 3000);
});