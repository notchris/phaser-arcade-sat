/* jshint esversion: 6 */
import Phaser from 'phaser';
import MultiKey from "./multikey.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene' });
    }

    init () {
    }

    preload () {

    }

    create() {
        const { LEFT, RIGHT, UP, A, D, W} = Phaser.Input.Keyboard.KeyCodes;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.leftInput = new MultiKey(this, [LEFT, A]);
        this.rightInput = new MultiKey(this, [RIGHT, D]);
        this.jumpInput = new MultiKey(this, [UP, W]);


        let pts = [[0,0],[0,32],[32,32],[32,0]];
        this.player = this.add.sat(400, 200, pts, false, 'blah');

        let testpts = [[0,0],[0,128],[128,128],[128,0]];
        this.test = this.add.sat(600, 200, testpts, true, 'blah2');

        // Track which sensors are touching something
        this.isTouching = { left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
    }

    update() {
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;
    
        if (isLeftKeyDown) {
          if (!(isInAir && this.isTouching.left)) {
            this.player.body.setVelocityX(-160);
          }
        } else if (isRightKeyDown) {
          if (!(isInAir && this.isTouching.right)) {
            this.player.body.setVelocityX(160);
          }
        } else {
            this.player.body.setVelocityX(0);
        }
        //if (isJumpKeyDown && this.canJump && isOnGround) {
        if (isJumpKeyDown) {
          this.player.body.setVelocityY(-330);
    
          this.canJump = false;
          this.jumpCooldownTimer = this.time.addEvent({
            delay: 250,
            callback: () => (this.canJump = true)
          });
        }
    }
}