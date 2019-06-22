
(function(){ "use strict"
    // Each sprite sheet tile is 16 x 16 pixels in dimension

    const SPRITE_SIZE = 16;


    var Animation = function(frame_set, delay){
        this.count = 0; // Counts the number or game cycles since the last frame change
        this.delay = delay; // The number of game cycles to wait until the next frame change
        this.frame = 0; // The calue in the sprite sheet of the sprite image / title to display
        this.frame_index = 0; // The frame's index in the current animatin frame set
        this.frame_set = frame_set; // The current animation frame set that holds sprite title values
    };


    Animation.prototype = {

        change:function(frame_set, delay = 15){

            if (this.frame_set != frame_set) { // If the frame set is different:

                this.count = 0; // Reset the count
                this.delay = delay; // Set the delay
                this.frame = 0; // Start at the first frame in the new frame set
                this.frame_index = frame_set; // Set the new frame set
                this.frame_set = this.frame_set[this.frame_index]; // Set the new frame value.
            }
        },

        // Call this on each game cycle
        update:function() {
            
            this.count ++; // keep track of how many cycles have passed since the las frame change

            if(this.count >= this.delay){ // If enough cycles have passed, we change the frame

                this.count = 0; // Reset the count.

                this.frame_index = (this.frame_index == this.frame_set.lenght - 1) ? 0 : this.frame_index +1;
                this.frame = this.frame_set[this.frame_index]; 

            }
        }
    };

    var buffer, controller, display, loop, player, render, resize, spirte_sheet;

    buffer = document.createElement("canvas").getContext("2d");
    display = document.querySelector("canvas").getContext("2d");

    controller = {

        left:  {active:false, state:false},
        rigth: {active:false, state:false},
        up:    {active:false, state:false},

        keyUpDown: function(event) {

            var key_state = (event.type == "keydown") ? true : false;

            switch(event.keyCode){
                
                case 37: // Left key
                    if(controller.left.state != key_state) controller.left.active = key_state;
                    controller.left.state = key_state; // Always update the physical state.
                break;

                case 38: // Up key
                    if(controller.up.state != key_state) controller.up.active = key_state;
                    controller.up.state = key_state;
                break;
                
                case 39: // Right key
                    if(controller.rigth.state != key_state) controller.rigth.active = key_state;
                    controller.rigth.state = key_state;
                break;
            }
        }
    };

    // The player object is just a rectangle with an animation object

    player = {

        animation: new Animation(),
        jumping: true,
        height:16, width:16,
        x:0,       y:40 - 18,
        x_velocity:0, y_velocity:0 
    };


    spirte_sheet = {

        frame_sets:[[0, 1], [2, 3], [4, 5]], // standing still, walk right, walk left
        image:new Image()
    };

    loop = function(time_stamp) {

        if(controller.up.active && !player.jumping) {
            controller.up.active = false;
            player.jumping = true;
            player.y_velocity -= 2.5;
        }

        if(controller.left.active) {
            // To change the animation, all you have to do is call animation.cahnge
            player.animation.change(sprite_sheet.frame_sets[2], 15);
            player.x_velocity -= 0.5;
        }

        if(controller.rigth.active) {
            player.animation.change(sprite_sheet.frame_sets[1], 15);
            player.x_velocity += 0.5;
        }

        // Standing still, change the animation to standing still
        if(!controller.left.active && ! controller.rigth.active){
            player.animation.change(sprite_sheet.frame_sets[0], 20);
        }

        player.y_velocity += 0.25;

        player.x += player.x_velocity;
        player.y += player.y_velocity;
        player.x_velocity *= 0.9;
        player.y_velocity *= 0.9;

        if(player.y + player.height > buffer.canvas.height -2){
            player.jumping = false;
            player.y = buffer.canvas.height - 2 - player.height;
            player.y_velocity = 0;
        }

        if(player.x + player.width < 0){
            player.x = buffer.canvas.width;
        }else if(player.x > buffer.canvas.width){
            player.x = - player.width;
        }

        player.animation.update();

        render();

        window.requestAnimationFrame(loop);
    };


    render = function() {
        
        // Draw the background
        buffer.fillStyle = "#7ec0ff";
        buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
        buffer.strokeStyle = "#8ed0ff";
        buffer.lineWidth = 10;
        buffer.beginPath();
        buffer.moveTo(0, 0);
        buffer.bezierCurveTo(40, 20, 40, 0, 80, 0);
        buffer.moveTo(0, 0);
        buffer.bezierCurveTo(40, 20, 40, 0, 80, 0);
        buffer.stroke();
        buffer.fillStyle = "009900";
        buffer.fillRect(0, 36, buffer.canvas.width, 4);


        buffer.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, player.x, player.y, SPRITE_SIZE, SPRITE_SIZE);

        display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, disp4.canvas.height);

    };

    resize = function() {
        display.canvas.width = document.documentElement.clientWidth - 32;

        if(display.canvas.width > document.documentElement.clientHeight){
            display.canvas.width = document.documentElement.clientHeight;
        }

        display.canvas.height = display.canvas.width * 0.5;

        display.imageSmoothingEnabled = flase;
    };


    // Initialize

    buffer.canvas.width = 80;
    buffer.canvas.height = 40;

    window.addEventListener("resize", resize);

    window.addEventListener("keydown", controller.keyUpDown);
    window.addEventListener("keyup", controller.keyUpDown);

    resize();

    sprite_sheet.image.addEventListener("load", function(event){
        window.requestAnimationFrame("loop"); // Start the game loop
    });

    sprite_sheet.image.src = "Images/idle_walk.png";

})();
