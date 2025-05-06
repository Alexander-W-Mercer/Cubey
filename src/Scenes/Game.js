class Game extends Phaser.Scene {
    constructor() {
        super("smileyScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.my.daggers = {};
        this.my.enemies = {bats: {}, grats: {}, brats: {}, ghosts: {}, spiders: {}};
        this.my.groundTypes = {};
        this.my.webs = {};

        this.points = [
            1300, Phaser.Math.Between(0, 600),
            600, Phaser.Math.Between(0, 600),
            -100, Phaser.Math.Between(0, 600)
        ];
        this.randRow = [];
        this.randRow2 = [];
        this.randNum = 0;
        this.waveTime = 120;
        this.groundMom = 4;
        this.barrelTimer = 0;
        this.barrelTimerTarget = 500;

        this.score = 0;
        this.highScore = 0;
        this.gameState = 1;
        this.level = 1;

        this.activeEnemies = 0;
        this.daggersThrown = 0;
        this.deadEnemies = 0;

        this.playerMom = 0;
        this.momCap = 4;
        this.health = 3;
        this.webbed = 0;

        this.counter = 0;
        this.miniCounter = 0;
        this.entityBob = true;

        document.addEventListener('keydown', (event) => { //Template for key press action taken from online
            if (event.key === 'm') {
                if (this.gameState == 1) {
                    console.log("throwing dagger...");
                    this.throw();
                }
            }
        });
        document.addEventListener('click', (event) => {
            //var pointer = this.input.activePointer;
            if (event.button === 0&& this.gameState == 0) { // Left button
                this.score = 0;
                this.gameState = -1;
                this.level = 1;
                this.health = 3;
                this.gameOverText.alpha = 0;
                this.restartText.alpha = 0;
                this.nextLevelText.alpha = 0;
                this.my.sprite.player.angle = 0;
                this.my.sprite.health1.visible = true;
                this.my.sprite.health2.visible = true;
                this.my.sprite.health3.visible = true;
                this.my.webs.web1.visible = false;
                this.my.webs.web2.visible = false;
                this.my.webs.web3.visible = false;
                this.my.sprite.player.y = 300;
                for (const enemyList in this.my.enemies) {
                    for (const enemy in this.my.enemies[enemyList]) {
                        this.my.enemies[enemyList][enemy].visible = false;
                        console.log(enemy);
                    }
                }
                for (const dagger in this.my.daggers) {
                    this.my.daggers[dagger].used = false;
                    this.my.daggers[dagger].flipX = true;
                    this.my.daggers[dagger].angle = 0;
                    this.my.daggers[dagger].x = 30;
                    this.my.daggers[dagger].y = this.my.daggers[dagger].home;
                    this.my.daggers[dagger].mom = 0;
                    this.my.daggers[dagger].recharge = 300;
                    this.daggersThrown = 0;
                }
                this.resetGame();
            }
        });
        this.gameState = -1;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Shape Characters"
        // https://kenney.nl/assets/shape-characters
        this.load.setPath("./assets/");
        // floor
        this.load.image("floor", "ground.png");
        this.load.image("stones", "stone_ground.png");
        this.load.image("pebbles", "pebbles.png");
        // enemies
        this.load.image("bat", "bat.png");
        this.load.image("ghost", "ghost.png");
        this.load.image("grat", "gray_rat.png");
        this.load.image("brat", "brown_rat.png");
        this.load.image("spider", "spider.png");
        this.load.image("barrel", "barrel.png");
        // player
        this.load.image("player", "knight.png");
        this.load.image("health", "health_potion.png");
        this.load.image("bluehealth", "blue_health.png");
        //projectiles
        this.load.image("dagger", "dagger.png");
        this.load.image("web", "web.png");
        this.load.image("trap", "trap.png");
        


        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Use W & S to move, use M to throw daggers.</h2>'
    }

    changeScene() {
        this.scene.start("mouseSmiley");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        let daggers = my.daggers;
        let groundTypes = my.groundTypes;
        let enemies = my.enemies;
        let bats = enemies.bats;
        let grats = enemies.grats;
        let brats = enemies.brats;
        let ghosts = enemies.ghosts;
        let spiders = enemies.spiders;
        let webs = my.webs;

        // Create the floor
        my.sprite.floor = this.add.sprite(300, 300, "floor");
        my.sprite.floor.setScale(37);
        my.sprite.floor2 = this.add.sprite(892, 300, "floor");
        my.sprite.floor2.setScale(37);

        groundTypes.rocks1 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "stones");
        groundTypes.rocks2 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "stones");
        groundTypes.rocks3 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "stones");
        groundTypes.rocks4 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "stones");
        groundTypes.rocks5 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "stones");
        groundTypes.pebbles1 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "pebbles");
        groundTypes.pebbles2 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "pebbles");
        groundTypes.pebbles3 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "pebbles");
        groundTypes.pebbles4 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "pebbles");
        groundTypes.pebbles5 = this.add.sprite(40*Phaser.Math.Between(1, 30), 40*Phaser.Math.Between(1, 14), "pebbles");
        for (const ground in groundTypes) {
            groundTypes[ground].setScale(3);
        }


        //Score Text
        this.scoreText = this.add.text(15, 10, 'Score :', {fontFamily: 'MS Sans Serif',fontSize: '40px', fill: '#3F2631'})
        this.highScoreText = this.add.text(30, 50, 'High Score :', {fontFamily: 'MS Sans Serif',fontSize: '20px', fill: '#3F2631'})
        this.smallLevelText = this.add.text(15, 550, 'Level :', {fontFamily: 'MS Sans Serif',fontSize: '40px', fill: '#3F2631'})

        //Health
        my.sprite.health1 = this.add.sprite(550, 550, "health");
        my.sprite.health2 = this.add.sprite(600, 550, "health");
        my.sprite.health3 = this.add.sprite(650, 550, "health");
        my.sprite.health4 = this.add.sprite(700, 550, "bluehealth");
        my.sprite.health4.visible = false;

        //Enemies (4 brats, 2 grats, 4 bats, 3 spiders, 2 ghosts) 15 total + 3 webs
        ///////////////////////////////////////////////////////////////////////////
        this.resetGame();


        //daggers
        daggers.dagger1 = this.add.sprite(30, 220, "dagger");
        daggers.dagger2 = this.add.sprite(30, 260, "dagger");
        daggers.dagger3 = this.add.sprite(30, 300, "dagger");
        daggers.dagger4 = this.add.sprite(30, 340, "dagger");
        daggers.dagger5 = this.add.sprite(30, 380, "dagger");
        console.log(daggers);
        for (const dagger in daggers) {
            daggers[dagger].setScale(3);
            daggers[dagger].used = false;
            daggers[dagger].home = daggers[dagger].y;
            daggers[dagger].flipX = true;
            daggers[dagger].mom = 0;
            daggers[dagger].recharge = 300;
        }

        
        

        // Player
        my.sprite.trap = this.add.sprite(75, 300, "trap");
        my.sprite.player = this.add.sprite(75, 300, "player");
        my.sprite.player.setScale(3);
        my.sprite.trap.setScale(3);
        my.sprite.trap.visible = false;

        //Barrel
        this.curve = new Phaser.Curves.Spline(this.points);
        my.sprite.barrel = this.add.follower(this.curve, 10, 10, "barrel");
        my.sprite.barrel.setScale(3);

        my.sKey = this.input.keyboard.addKey('S');
        my.wKey = this.input.keyboard.addKey('w');

        //Other Text
        this.gameOverText = this.add.text(110, 250, 'GAME OVER', {fontFamily: 'MS Sans Serif',fontSize: '100px', fill: '#3F2631'})
        this.gameOverText.alpha = 0;
        this.restartText = this.add.text(110, 350, 'Click to Restart...', {fontFamily: 'MS Sans Serif',fontSize: '25px', fill: '#3F2631'})
        this.restartText.alpha = 0;
        this.nextLevelText = this.add.text(150, 250, 'Level ', {fontFamily: 'MS Sans Serif',fontSize: '100px', fill: '#3F2631'})
        this.nextLevelText.alpha = 0;

    }

    throw() {
        let daggers = this.my.daggers;
        if (this.daggersThrown < 5) {
            console.log(this.daggersThrown)
            for (const dagger in daggers) {
                if (daggers[dagger].used == false) {
                    daggers[dagger].angle = 90;
                    daggers[dagger].x = this.my.sprite.player.x;
                    daggers[dagger].y = this.my.sprite.player.y;
                    daggers[dagger].used = true;
                    daggers[dagger].mom = 15;
                    this.daggersThrown++;
                    break;
                }
            }
        }
    }

    activateEnemy() { //Activate random enemy
        let my = this.my;
        let enemies = my.enemies;
        this.randSpawnNum = (Phaser.Math.Between(0, 14));
        this.current = 0;
        for (const enemyList in enemies) {
            for (const enemy in enemies[enemyList]) {
                if (this.current == this.randSpawnNum) {
                    if (enemies[enemyList][enemy].active == false && enemies[enemyList][enemy].alive == true) {
                        enemies[enemyList][enemy].active = true;
                        this.activeEnemies++;
                        return;
                    } else {
                        this.randSpawnNum = -1;
                    }
                }
                if (this.randSpawnNum == -1) { //If the number has passed the chosen enemy, choose next avaliable enemy
                    if (enemies[enemyList][enemy].active == false && enemies[enemyList][enemy].alive == true) {
                        enemies[enemyList][enemy].active = true;
                        this.activeEnemies++;
                        return;
                    }
                }
                this.current++;
            }
        }
        //If there are no enemies left in the back of the list, just choose first enemy found from front still alive:
        for (const enemyList in enemies) {
            for (const enemy in enemies[enemyList]) {
                if (enemies[enemyList][enemy].active == false && enemies[enemyList][enemy].alive == true) {
                    enemies[enemyList][enemy].active = true;
                    this.activeEnemies++;
                    return;
                }
            }
        }
    }

    gameOver() {
        console.log("GAME IS OVER. YOU HAVE LOST");
        this.gameState = 0;
    }

    resetGame() {
        console.log("Setting up next level...");
        this.my.enemies = {bats: {}, grats: {}, brats: {}, ghosts: {}, spiders: {}};
        this.my.webs = {};

        let my = this.my;   // create an alias to this.my for readability
        let enemies = my.enemies;
        let bats = enemies.bats;
        let grats = enemies.grats;
        let brats = enemies.brats;
        let ghosts = enemies.ghosts;
        let spiders = enemies.spiders;
        let webs = my.webs;

        if (this.level == 1) {
            this.levelSelector = Phaser.Math.Between(0, 3);
        } else {
            this.levelSelector = Phaser.Math.Between(0, 6);
        }


        //Enemies (4 brats, 2 grats, 4 bats, 3 spiders, 2 ghosts) 15 total + 3 webs
        ///////////////////////////////////////////////////////////////////////////
        switch (this.levelSelector) { //row 1 has 4 brats & 1 grat
            case 0: // Normal
                this.randRow = [[80,750],[190,750],[300,750],[410,750],[520,750]];
                break;
            case 1: // Center Isle
                this.randRow = [[80,750],[140,750],[300,750],[460,750],[520,750]];
                break;
            case 2: // Compact
                this.randRow = [[200,750],[250,750],[300,750],[350,750],[400,750]];
                break;
            case 3: // Castle 
                this.randRow = [[80,600],[190,750],[300,600],[410,750],[520,600]];
                break;
            case 4: // Rock and a Hard Place
                this.randRow = [[80,125],[140,750],[300,750],[460,750],[520,125]];
                break;
            case 5: // Sneak Attack
                this.randRow = [[80,25],[190,25],[300,25],[410,25],[520,25]];
                break;
            case 6: // Push Back
                this.randRow = [[80,1050],[190,1050],[300,1050],[410,1050],[520,1050]];
                break;
        }
        this.order = [];
        //random x spots
        for (let i = 4; i >= 0; i--) {
            this.randNum = Phaser.Math.Between(0, i);
            this.order.push(this.randRow[this.randNum]);
            this.randRow.splice(this.randNum,1);
        }
        this.order.push(this.randRow[0]);

        console.log("row1:" + this.order);

        brats.brat1 = this.add.sprite(this.order[0][1], this.order[0][0], "brat");
        brats.brat2 = this.add.sprite(this.order[1][1], this.order[1][0], "brat");
        brats.brat3 = this.add.sprite(this.order[2][1], this.order[2][0], "brat");
        brats.brat4 = this.add.sprite(this.order[3][1], this.order[3][0], "brat");
        grats.grat1 = this.add.sprite(this.order[4][1], this.order[4][0], "grat");

        //////////////////////////////////////////////////////////////////////////
        switch (this.levelSelector) { //row 2 has 1 grat, 3 bats & 1 spider
            case 0:
                this.randRow = [[80,900],[190,900],[300,900],[410,900],[520,900]];
                break;
            case 1:
                this.randRow = [[80,900],[140,900],[300,900],[460,900],[520,900]];
                break;
            case 2:
                this.randRow = [[200,900],[250,900],[300,900],[350,900],[400,900]];
                break;
            case 3:
                this.randRow = [[80,750],[190,900],[300,750],[410,900],[520,750]];
                break;
            case 4: // Center Isle
                this.randRow = [[80,900],[140,900],[300,900],[460,900],[520,900]];
                break;
            case 5:
                this.randRow = [[80,900],[190,900],[300,900],[410,900],[520,900]];
                break;
            case 6: // Push Back
                this.randRow = [[80,1250],[190,1250],[300,1250],[410,1250],[520,1250]];
                break;
        }
        this.order = [];
        //random x spots
        for (let i = 4; i >= 0; i--) {
            this.randNum = Phaser.Math.Between(0, i);
            this.order.push(this.randRow[this.randNum]);
            this.randRow.splice(this.randNum,1);
            console.log(this.order);
        }
        this.order.push(this.randRow[0]);

        console.log("row2:" + this.order);

        grats.grat2 = this.add.sprite(this.order[0][1], this.order[0][0], "grat");
        bats.bat1 = this.add.sprite(this.order[1][1], this.order[1][0], "bat");
        bats.bat2 = this.add.sprite(this.order[2][1], this.order[2][0], "bat");
        bats.bat3 = this.add.sprite(this.order[3][1], this.order[3][0], "bat");
        spiders.spider1 = this.add.sprite(this.order[4][1], this.order[4][0], "spider");
        webs.web1 = this.add.sprite(-50, 0, "web");

        //////////////////////////////////////////////////////////////////////////
        switch (this.levelSelector) { //row 3 has 1 bat, 2 spiders & 2 ghosts
            case 0:
                this.randRow = [[80,1050],[190,1050],[300,1050],[410,1050],[520,1050]];
                break;
            case 1:
                this.randRow = [[80,1050],[140,1050],[300,1050],[460,1050],[520,1050]];
                break;
            case 2:
                this.randRow = [[200,1050],[250,1050],[300,1050],[350,1050],[400,1050]];
                break;
            case 3:
                this.randRow = [[80,900],[190,1050],[300,900],[410,1050],[520,900]];
                break;
            case 4: // Center Isle
                this.randRow = [[80,1050],[140,1050],[300,1050],[460,1050],[520,1050]];
                break;
            case 5:
                this.randRow = [[80,1050],[190,1050],[300,1050],[410,1050],[520,1050]];
                break;
            case 6: // Push Back
                this.randRow = [[80,1300],[190,1300],[300,1300],[410,1300],[520,1300]];
                break;
        }
        this.order = [];
        //random x spots
        for (let i = 4; i >= 0; i--) {
            this.randNum = Phaser.Math.Between(0, i);
            this.order.push(this.randRow[this.randNum]);
            this.randRow.splice(this.randNum,1);
        }
        this.order.push(this.randRow[0]);

        console.log("row3:" + this.order);
        
        bats.bat4 = this.add.sprite(this.order[0][1], this.order[0][0], "bat");
        spiders.spider2 = this.add.sprite(this.order[1][1], this.order[1][0], "spider");
        spiders.spider3 = this.add.sprite(this.order[2][1], this.order[2][0], "spider");
        webs.web2 = this.add.sprite(this.order[1][1], -100, "web");
        webs.web3 = this.add.sprite(this.order[2][1], -100, "web");
        ghosts.ghost1 = this.add.sprite(this.order[3][1], this.order[3][0], "ghost");
        ghosts.ghost2 = this.add.sprite(this.order[4][1], this.order[4][0], "ghost");
        ghosts.ghost1.flipX = true;
        ghosts.ghost2.flipX = true;

        //start brats with their properties
        for (const rat in brats) {
            brats[rat].scoreValue = 10;
        }

        //start grats with their properties
        for (const rat in grats) {
            grats[rat].scoreValue = 15;
            grats[rat].mom = 5*(Phaser.Math.Between(0, 1)*2 - 1);
            grats[rat].decision = 40;
        }

        //start bats with their properties
        for (const bat in bats) {
            bats[bat].scoreValue = 15;
            bats[bat].mom = 5;
        }

        //start ghosts with their properties
        for (const ghost in ghosts) {
            ghosts[ghost].scoreValue = 30;
            ghosts[ghost].upOrDown = true;
            ghosts[ghost].mom = 0;
            ghosts[ghost].floatMom = 0;
        }

        //start spiders with their properties
        spiders.spider1.nestX = 650;
        spiders.spider2.nestX = 550;
        spiders.spider3.nestX = 450;
        spiders.spider1.mom = 5;
        spiders.spider2.mom = 10;
        spiders.spider3.mom = 15;
        spiders.spider1.scoreValue = 20;
        spiders.spider2.scoreValue = 25;
        spiders.spider3.scoreValue = 30;

        //scaling some stuff
        webs.web1.setScale(3);
        webs.web2.setScale(3);
        webs.web3.setScale(3);
        my.sprite.health1.setScale(3);
        my.sprite.health2.setScale(3);
        my.sprite.health3.setScale(3);
        my.sprite.health4.setScale(3);

        //start them with their proper UNIVERSAL properties
        for (const enemyList in enemies) {
            for (const enemy in enemies[enemyList]) {
                enemies[enemyList][enemy].setScale(3);
                enemies[enemyList][enemy].alive = true;1050
                enemies[enemyList][enemy].active = false;
            }
        }
        this.deadEnemies = 0;

    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        let daggers = my.daggers;    // create an alias to my.daggers for readability
        let groundTypes = my.groundTypes;
        let enemies = my.enemies;
        let bats = enemies.bats;
        let grats = enemies.grats;
        let brats = enemies.brats;
        let ghosts = enemies.ghosts;
        let spiders = enemies.spiders;
        let webs = my.webs;

        console.log("dead enemies:" + this.deadEnemies);

        //Level Counter
        this.nextLevelText.text = 'Level ' + this.level;
        this.smallLevelText.text = 'Level : ' + this.level;

        //Score Text
        if (this.highScore < this.score) {
            this.highScore = this.score;
        }
        this.scoreText.text = 'Score : ' + this.score;
        this.highScoreText.text = 'High Score : ' + this.highScore;

        //scrolling ground
        for (const ground in groundTypes) {
            groundTypes[ground].x = groundTypes[ground].x - this.groundMom;
            if (groundTypes[ground].x < -40) {
                groundTypes[ground].x = 1200 + 40*Phaser.Math.Between(0, 5);
                groundTypes[ground].y = 40*Phaser.Math.Between(1, 14);
            }
        }

        if (this.gameState == 1) { // IF THE GAME IS ACTIVELY RUNNING, DO THE FOLLOWING: /////////////////////////////////

            my.sprite.barrel.update(); //I don't know if this actually does anything, but I'm too lazy to check, and scared it'll break if I do.

            console.log(this.activeEnemies);
            //Make new waves
            //console.log(this.activeEnemies);
            console.log("spawning enemies in: " + this.waveTime);
            this.waveTime--;
            if (this.waveTime < 1) {
                console.log("-spawning enemies-");
                if (this.score >= 0 && this.score < 30) {
                    this.activateEnemy();
                } else if (this.score >= 30 && this.score < 400) {
                    this.activateEnemy();
                    this.activateEnemy();
                } else if (this.score >= 400 && this.score < 900) {
                    if (Phaser.Math.Between(0, 1)) {
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                    } else {
                        this.activateEnemy();
                        this.activateEnemy();
                    }
                } else if (this.score >= 900 && this.score < 1500) {
                    if (Phaser.Math.Between(0, 1)) {
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                    } else {
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                    }
                } else if (this.score >= 1500) {
                    if (Phaser.Math.Between(0, 1)) {
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                    } else {
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                        this.activateEnemy();
                    }
                }
                this.waveTime = 300 + (10*this.activeEnemies) - (5*this.deadEnemies);
            }

            //thrown daggers
            for (const dagger in daggers) {
                if (daggers[dagger].used == true) {
                    daggers[dagger].x = daggers[dagger].x + daggers[dagger].mom;
                    if (daggers[dagger].x > 1200) {
                        daggers[dagger].recharge--;
                    }
                    if (daggers[dagger].recharge < 0) {
                        daggers[dagger].angle = 0;
                        daggers[dagger].x = 30;
                        daggers[dagger].y = daggers[dagger].home;
                        daggers[dagger].used = false;
                        daggers[dagger].mom = 0;
                        daggers[dagger].recharge = 300;
                        this.daggersThrown--;
                    }
                }
            }


            // Player Movement
            my.sprite.player.y = my.sprite.player.y + this.playerMom;
            if (my.sKey.isDown) { 
                if (this.playerMom < this.momCap) {
                    this.playerMom = this.playerMom + 0.4;
                } else {
                    this.playerMom = this.momCap;
                }
            } else if (my.wKey.isDown) {
                if (this.playerMom > -this.momCap) {
                    this.playerMom = this.playerMom - 0.4;
                } else {
                    this.playerMom = -this.momCap;
                }
            } else {
                if (this.playerMom > 0.2) {
                    this.playerMom = this.playerMom - 0.1;
                } else if (this.playerMom < -0.2) {
                    this.playerMom = this.playerMom + 0.1;
                } else {
                    this.playerMom = 0;
                }
            }

            /////////////////////////////////////Active Enemy Movement
            //brats:
            for (const rat in brats) {
                if (brats[rat].active == true && brats[rat].alive == true) {
                    console.log("RAT IS RUNNNNINGGG");
                    brats[rat].x = brats[rat].x - 10;
                    brats[rat].y = brats[rat].y - Phaser.Math.Between(-5, 5);
                    if (brats[rat].x < - 40) {
                        brats[rat].x = 1250;
                        brats[rat].y = Phaser.Math.Between(20, 580);
                    }
                }
            }
            //grats:
            for (const rat in grats) {
                if (grats[rat].active == true && grats[rat].alive == true) {
                    console.log("RAT IS RUNNNNINGGG");
                    grats[rat].x = grats[rat].x - 10;
                    grats[rat].y = grats[rat].y + grats[rat].mom;
                    if (this.counter % grats[rat].decision == 0) {
                        grats[rat].mom = grats[rat].mom*-1;
                        grats[rat].decision = Phaser.Math.Between(20, 120);
                    }
                    if (grats[rat].x < - 40) {
                        grats[rat].x = 1250;
                        grats[rat].y = Phaser.Math.Between(20, 580);
                    }
                    if (grats[rat].y < -30) { // Allow player to move up and down off screen before teleporting to the opposite end
                        grats[rat].y = 620;
                    } else if (grats[rat].y > 620) {
                        grats[rat].y = -20;
                    }
                }
            }
            //bats:
            for (const bat in bats) {
                if (bats[bat].active == true && bats[bat].alive == true) {
                    console.log("BAT IS FLYING");
                    bats[bat].x = bats[bat].x - 10;
                    bats[bat].y = bats[bat].y + bats[bat].mom;
                    if (bats[bat].mom > 5) {
                        bats[bat].mom = bats[bat].mom + Phaser.Math.Between(-1, 0)
                    } else if (bats[bat].mom < -5) {
                        bats[bat].mom = bats[bat].mom + Phaser.Math.Between(0, 1)
                    } else {
                        bats[bat].mom = bats[bat].mom + Phaser.Math.Between(-1, 1)
                    }
                    if (bats[bat].x < - 40) {
                        bats[bat].x = 1250;
                        bats[bat].y = Phaser.Math.Between(20, 580);
                    }
                    if (bats[bat].y < -30) { // Allow player to move up and down off screen before teleporting to the opposite end
                        bats[bat].y = 620;
                    } else if (bats[bat].y > 620) {
                        bats[bat].y = -20;
                    }
                }
            }
            //ghosts:
            for (const ghost in ghosts) {
                if (ghosts[ghost].active == true && ghosts[ghost].alive == true) {
                    console.log("GHOST IS FLOATING");
                    ghosts[ghost].x = ghosts[ghost].x - 10;
                    ghosts[ghost].y = ghosts[ghost].y + ghosts[ghost].mom + ghosts[ghost].floatMom;
                    if (ghosts[ghost].upOrDown == true) {
                        ghosts[ghost].floatMom++;
                        if (ghosts[ghost].floatMom > 4) {
                            ghosts[ghost].upOrDown = false;
                        }
                    } else {
                        ghosts[ghost].floatMom--;
                        if (ghosts[ghost].floatMom < -4) {
                            ghosts[ghost].upOrDown = true;
                        }
                    }
                    if (ghosts[ghost].y > my.sprite.player.y && ghosts[ghost].mom > -3) {
                        ghosts[ghost].mom--;
                    } else if (ghosts[ghost].y < my.sprite.player.y && ghosts[ghost].mom < 3) {
                        ghosts[ghost].mom++;
                    }
                    if (ghosts[ghost].x < - 40) {
                        ghosts[ghost].x = 1250;
                        ghosts[ghost].y = Phaser.Math.Between(20, 580);
                    }
                    if (ghosts[ghost].y < -30) { // Allow player to move up and down off screen before teleporting to the opposite end
                        ghosts[ghost].y = 620;
                    } else if (ghosts[ghost].y > 620) {
                        ghosts[ghost].y = -20;
                    }
                }
            }
            //spiders
            for (const spider in spiders) {
                if (spiders[spider].active == true && spiders[spider].alive == true) {
                    console.log("SPIDER IS CRAWLING");
                    if (spiders[spider].x > spiders[spider].nestX) {
                        spiders[spider].x = spiders[spider].x - spiders[spider].mom;
                    }
                    if (spiders[spider].x <= spiders[spider].nestX) {
                        spiders[spider].y = spiders[spider].y - spiders[spider].mom;
                    }
                    if (spiders[spider].y < 40) {
                        spiders[spider].mom = spiders[spider].mom*-1;
                        spiders[spider].y = spiders[spider].y + 15;
                    } else if (spiders[spider].y > 560) {
                        spiders[spider].mom = spiders[spider].mom*-1;
                        spiders[spider].y = spiders[spider].y - 15;
                    }
                }
            }
            //webs
            if (spiders.spider1.active == true) {
                if (this.counter % 40 == 0 && webs.web1.x < -40) {
                    webs.web1.x = spiders.spider1.x;
                    webs.web1.y = spiders.spider1.y;
                }
                webs.web1.angle = webs.web1.angle + 5;
                webs.web1.x = webs.web1.x - 10;
            }
            if (spiders.spider2.active == true) {
                if (this.counter % 40 == 0 && webs.web2.x < -40) {
                    webs.web2.x = spiders.spider2.x;
                    webs.web2.y = spiders.spider2.y;
                }
                webs.web2.angle = webs.web2.angle + 5;
                webs.web2.x = webs.web2.x - 10;
            }
            if (spiders.spider3.active == true) {
                if (this.counter % 40 == 0 && webs.web3.x < -40) {
                    webs.web3.x = spiders.spider3.x;
                    webs.web3.y = spiders.spider3.y;
                }
                webs.web3.angle = webs.web3.angle + 5;
                webs.web3.x = webs.web3.x - 10;
            }
            if (this.webbed > 0) {
                my.sprite.trap.x = my.sprite.player.x
                my.sprite.trap.y = my.sprite.player.y
                my.sprite.trap.visible = true;
                this.momCap = 1;
                this.webbed--;
            } else {
                this.momCap = 4;
                my.sprite.trap.visible = false;
            }

            //The Barrel
            // console.log("barrelTimer:");
            // console.log(this.barrelTimer);
            // console.log("barrelTarget:");
            // console.log(this.barrelTimerTarget);
            if (this.barrelTimer > this.barrelTimerTarget) {
                this.barrelTimer = 0;
                this.barrelTimerTarget = 100000;
                my.sprite.barrel.x = 1400;
                my.sprite.barrel.visible = true;
                my.sprite.barrel.x = this.curve.points[0].x;
                my.sprite.barrel.y = this.curve.points[0].y;
                my.sprite.barrel.startFollow({
                    from: 0,
                    to: 1,
                    delay: 0,
                    duration: 4000,
                    //ease: 'Sine.easeInOut',
                    repeat: -1,
                    yoyo: false,
                    rotateToPath: true,
                    rotationOffset: 0//-90
                });
            }
            if (my.sprite.barrel.x < -40) {
                my.sprite.barrel.stopFollow();
                my.sprite.barrel.y = -80;
                my.sprite.barrel.x = 1300;
                this.barrelTimerTarget = Phaser.Math.Between(500, 200);
                this.barrelTimer = 0;
                console.log("look here please")
                console.log(this.points);
                this.curve.points[0].y = Phaser.Math.Between(0, 600);
                this.curve.points[1].y = Phaser.Math.Between(0, 600);
                this.curve.points[2].y = Phaser.Math.Between(0, 600);

            } else {
                this.barrelTimer++;
            }
            

            ////////////////////////////////////////////////////////////////////////// COLLISION
            //Enemy collision with thrown dagger
            for (const enemyList in enemies) {
                for (const enemy in enemies[enemyList]) {
                    for (const dagger in daggers) {
                        if (daggers[dagger].used == true) {
                            if (enemies[enemyList][enemy].x < daggers[dagger].x + 30 && enemies[enemyList][enemy].x > daggers[dagger].x - 30 && enemies[enemyList][enemy].y < daggers[dagger].y + 20 && enemies[enemyList][enemy].y > daggers[dagger].y - 20) {
                                console.log("AN ENEMY HAS BEEN HIT");
                                enemies[enemyList][enemy].visible = false;
                                enemies[enemyList][enemy].alive = false;
                                enemies[enemyList][enemy].x = 0;
                                enemies[enemyList][enemy].y = 0;
                                if (enemies[enemyList][enemy].active) {
                                    this.activeEnemies--;
                                }
                                this.deadEnemies++;
                                this.score = this.score + enemies[enemyList][enemy].scoreValue;
                                daggers[dagger].x = 1220;
                                // if (this.health == 3) {
                                //     my.sprite.health1.visible = false;
                                //     this.health--;
                                // } else if (this.health == 2) {
                                //     my.sprite.health2.visible = false;
                                //     this.health--;
                                // } else if (this.health == 1) {
                                //     my.sprite.health3.visible = false;
                                //     this.health--;
                                //     this.gameOver();
                                // }
                            }
                        }
                    }
                }
            }

            //Collision with player
            for (const enemyList in enemies) {
                for (const enemy in enemies[enemyList]) {
                    if (enemies[enemyList][enemy].x < my.sprite.player.x + 30 && enemies[enemyList][enemy].x > my.sprite.player.x - 30 && enemies[enemyList][enemy].y < my.sprite.player.y + 30 && enemies[enemyList][enemy].y > my.sprite.player.y - 30) {
                        console.log("THERE HAS BEEN A PLAYER HIT");
                        enemies[enemyList][enemy].visible = false;
                        enemies[enemyList][enemy].alive = false;
                        enemies[enemyList][enemy].x = 0;
                        enemies[enemyList][enemy].y = 0;
                        this.activeEnemies--;
                        this.deadEnemies++;
                        if (this.health == 3) {
                            my.sprite.health1.visible = false;
                            this.health--;
                        } else if (this.health == 2) {
                            my.sprite.health2.visible = false;
                            this.health--;
                        } else if (this.health == 1) {
                            my.sprite.health3.visible = false;
                            this.health--;
                            this.gameOver();
                        } else if (this.health == 4) {
                            my.sprite.health4.visible = false;
                            this.health--;
                        }
                        console.log(this.health);
                    }
                }
            }

            //Web Collision with player
            for (const web in webs) {
                if (webs[web].x < my.sprite.player.x + 30 && webs[web].x > my.sprite.player.x - 30 && webs[web].y < my.sprite.player.y + 30 && webs[web].y > my.sprite.player.y - 30) {
                    this.playerMom = 0;
                    this.webbed = 50;
                    webs[web].y = -40;
                }
            }
            
            //Web Collision with dagger
            for (const web in webs) {
                for (const dagger in daggers) {
                    if (webs[web].x < daggers[dagger].x + 30 && webs[web].x > daggers[dagger].x - 30 && webs[web].y < daggers[dagger].y + 20 && webs[web].y > daggers[dagger].y - 20) {
                        webs[web].y = -40;
                        webs[web].x = webs[web].x + 40;
                    }
                }
            }

            //Barrel Collision
            if (my.sprite.barrel.x < my.sprite.player.x + 30 && my.sprite.barrel.x > my.sprite.player.x - 30 && my.sprite.barrel.y < my.sprite.player.y + 30 && my.sprite.barrel.y > my.sprite.player.y - 30) {
                console.log("barrel hit");
                console.log("here please =======================================================================");
                my.sprite.barrel.stopFollow();
                //my.sprite.barrel.visible = false;
                my.sprite.barrel.x = 1300;
                my.sprite.barrel.y = -50; // I really have no clue why it takes off 2 hearts, but I guess it does :/ What can you do. its a feature now.
                if (this.health == 3) {
                    my.sprite.health1.visible = false;
                    this.health--;
                } else if (this.health == 2) {
                    my.sprite.health2.visible = false;
                    this.health--;
                } else if (this.health == 1) {
                    my.sprite.health3.visible = false;
                    this.health--;
                    this.gameOver();
                } else if (this.health == 4) {
                    my.sprite.health4.visible = false;
                    this.health--;
                }
                console.log(this.health);
            }


            if (my.sprite.player.y < -30) { // Allow player to move up and down off screen before teleporting to the opposite end
                my.sprite.player.y = 620;
            } else if (my.sprite.player.y > 620) {
                my.sprite.player.y = -20;
            }

            this.counter++;

            if (this.counter % 40 == 0) {  // Make enemies bob up and down every 40 updates :)
                console.log("bob");
                switch (this.entityBob) {
                    case true:
                        my.sprite.barrel.flipX = true;
                        my.sprite.player.y = my.sprite.player.y + 5;
                        this.entityBob = false;
                        for (const enemyList in enemies) {
                            for (const enemy in enemies[enemyList]) {
                                enemies[enemyList][enemy].y = enemies[enemyList][enemy].y - 5;
                            }
                        }
                        break;
                    case false:
                        my.sprite.barrel.flipX = false;
                        my.sprite.player.y = my.sprite.player.y - 5;
                        this.entityBob = true;
                        for (const enemyList in enemies) {
                            for (const enemy in enemies[enemyList]) {
                                enemies[enemyList][enemy].y = enemies[enemyList][enemy].y + 5
                            }
                        }
                        break;
                }

            }
            
            //Kill all enemies:
            if (this.deadEnemies == 15) {
                this.level++;
                this.gameState = -1;
                this.score = this.score + 50;
                switch (this.health) {
                    case 0:
                        this.gameState = 0;
                        this.gameOver();
                        break;
                    case 1:
                        this.health = 2;
                        my.sprite.health2.visible = true;
                        break;
                    case 2:
                        this.health = 3;
                        my.sprite.health3.visible = true;
                        break;
                    case 3:
                        this.health = 4;
                        my.sprite.health4.visible = true;
                        break;
                }
                for (const web in this.my.webs) {
                    this.my.webs[web].visible = false;
                }
                this.resetGame();
            }

        } else if (this.gameState == 0){ ///////////////////////////////////// GAME OVER (Loss) ///////////////////////////////////////////////////
            my.sprite.player.angle = 90;
            console.log("weeeeep womp");
            if (this.gameOverText.alpha < 1) {
                this.gameOverText.alpha = this.gameOverText.alpha + 0.1;
            }
            if (this.gameOverText.alpha >= 1 && this.restartText.alpha < 1) {
                this.restartText.alpha = this.restartText.alpha + 0.1;
            }
            this.counter++;
            if (this.counter % 20 == 0) {  // Enemies Celebrate
                if (this.groundMom > 0) {
                    this.groundMom = this.groundMom - 1;
                }
                switch (this.entityBob) {
                    case true:
                        this.entityBob = false;
                        for (const enemyList in enemies) {
                            for (const enemy in enemies[enemyList]) {
                                enemies[enemyList][enemy].y = enemies[enemyList][enemy].y - 5
                                if (Phaser.Math.Between(0, 1)) {
                                    enemies[enemyList][enemy].flipX = true;
                                }
                            }
                        }
                        break;
                    case false:
                        this.entityBob = true;
                        for (const enemyList in enemies) {
                            for (const enemy in enemies[enemyList]) {
                                enemies[enemyList][enemy].y = enemies[enemyList][enemy].y + 5
                                if (Phaser.Math.Between(0, 1)) {
                                    enemies[enemyList][enemy].flipX = false;
                                }
                            }
                        }
                        break;
                }

            }
        } else { ////////////////////////// GAME CHANGING TO NEXT LEVEL /////////////////////////////////////////////
            my.sprite.barrel.stopFollow();
            my.sprite.barrel.visible = false;
            if (this.counter % 40 == 0) {  // Make enemies bob up and down every 40 updates :)
                switch (this.entityBob) {
                    case true:
                        my.sprite.player.y = my.sprite.player.y + 5;
                        this.entityBob = false;
                        for (const enemyList in enemies) {
                            for (const enemy in enemies[enemyList]) {
                                enemies[enemyList][enemy].y = enemies[enemyList][enemy].y - 5;
                            }
                        }
                        break;
                    case false:
                        my.sprite.player.y = my.sprite.player.y - 5;
                        this.entityBob = true;
                        for (const enemyList in enemies) {
                            for (const enemy in enemies[enemyList]) {
                                enemies[enemyList][enemy].y = enemies[enemyList][enemy].y + 5
                            }
                        }
                        break;
                }

            }

            this.counter++;
            this.miniCounter++;
            if (this.miniCounter < 100) {  // Enemies Celebrate
                if (this.groundMom < 50) {
                    this.groundMom = this.groundMom + 1;
                    if (this.nextLevelText.alpha < 1) {
                        this.nextLevelText.alpha = this.nextLevelText.alpha + 0.02;
                    }
                    
                }
            } else if (this.miniCounter > 200 && this.miniCounter < 250 ) {  // Enemies Celebrate
                if (this.groundMom > 4) {
                    this.groundMom = this.groundMom - 1;
                    if (this.nextLevelText.alpha > 0) {
                        this.nextLevelText.alpha = this.nextLevelText.alpha - 0.02;
                    }
                }
            }  else if (this.miniCounter > 250) {
                this.miniCounter = 0;
                this.gameState = 1;
                console.log("Level Start!");
            }
        }
    }

}