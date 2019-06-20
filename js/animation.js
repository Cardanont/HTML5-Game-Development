
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
        update: function() {
            
            this.count ++; /// keep track of how many cycles have passed since the las frame change

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

        left:  {active: false, state: false},
        rigth: {active: false, state: false},
        up:    {active: false, state: false},

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




    

});