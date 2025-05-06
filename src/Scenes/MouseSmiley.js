class MouseSmiley extends Phaser.Scene {
    constructor() {
        super("mouseSmiley");
        this.my = {sprite: {}};

        // document.addEventListener('click', (event) => {
        //     var pointer = this.input.activePointer;
        //     if (event.button === 0) { // Left button
        //         var touchX = pointer.x;
        //         var touchY = pointer.y;
        //         this.createSmiley(touchX, touchY);
        //     }
        // });
        
    }

    preload() {
        this.load.image("handPeace", "hand_yellow_peace.png");

    }

    createSmiley(mouseX, mouseY) {
        console.log("this is a little click test");
        console.log(mouseX);
        console.log(mouseY);

        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        my.sprite.body = this.add.sprite(mouseX, mouseY, "yellowBody");

        // Create the two sprites, one for each type of smile
        my.sprite.smile = this.add.sprite(mouseX, mouseY + 20, "smile");
        my.sprite.dimple = this.add.sprite(mouseX, mouseY + 20, "smileDimple");
        
        // Create the sprite for the left and right hands
        my.sprite.leftOpenHand = this.add.sprite(mouseX - 125, mouseY + 20, "handOpen");
        my.sprite.leftOpenHand.flipX = true;   // flip sprite to have thumb on correct side
        my.sprite.rightOpenHand = this.add.sprite(mouseX + 125, mouseY + 20, "handOpen");

        my.sprite.rightPeaceHand = this.add.sprite(mouseX + 125, mouseY + 20, "handPeace");
        my.sprite.leftPeaceHand = this.add.sprite(mouseX - 125, mouseY + 20, "handPeace");
        my.sprite.leftPeaceHand.flipX = true;   // flip sprite to have thumb on correct side

        // Randomize hand and eye varients
        if (Math.floor(Math.random() * (1 - 0 + 1))) { //random true or false
            my.sprite.dimple.visible = true;
            my.sprite.smile.visible = false;
        } else {
            my.sprite.dimple.visible = false;
            my.sprite.smile.visible = true;
        }

        if (Math.floor(Math.random() * (1 - 0 + 1))) { //random true or false
            my.sprite.rightPeaceHand.visible = true;
            my.sprite.rightOpenHand.visible = false;
        } else {
            my.sprite.rightPeaceHand.visible = false;
            my.sprite.rightOpenHand.visible = true;
        }

        if (Math.floor(Math.random() * (1 - 0 + 1))) { //random true or false
            my.sprite.leftPeaceHand.visible = true;
            my.sprite.leftOpenHand.visible = false;
        } else {
            my.sprite.leftPeaceHand.visible = false;
            my.sprite.leftOpenHand.visible = true;
        }
        
    }

    create() {
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>mouseSmiley.js</h2>'

    }

    update() {
        console.log("test");

        /*
        var pointer = this.input.activePointer;
        if (pointer.isDown) {
            var touchX = pointer.x;
            var touchY = pointer.y;
            console.log("touchX:");
            console.log(touchX);
            console.log("touchY:");
            console.log(touchY);
        }
            */

    }
}