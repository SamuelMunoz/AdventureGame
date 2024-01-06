/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */
import { canvas, gravity } from '../main'
import Sprite from './sprite'

class Player extends Sprite {
    constructor({ position, imageSrc }) {
        super({ imageSrc })
        this.position = position
        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: gravity }
        this.elasticity = 0.3
        this.offset = 200
    }

    update() {
        this.allColisions()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.draw()
    }

    downCanvasColision() {
        if (this.position.y + this.height + this.velocity.y > canvas.height - this.offset || this.velocity.y == 0) {
            this.velocity.y = -this.velocity.y * this.elasticity
            this.velocity.y += this.acceleration.y
            this.position.y += this.velocity.y
            if (Math.abs(this.velocity.y) < 1) {
                this.velocity.y = 0
                this.position.y = canvas.height - this.offset - this.height
            }
        } else {
            this.velocity.y += this.acceleration.y
            this.position.y += this.velocity.y
        }
    }

    topJumpLimit() {
        if (this.position.y < -this.height / 2) {
            this.velocity.y = 0
        }
        this.velocity.y += this.acceleration.y
        this.position.y += this.velocity.y
    }

    leftColision() {
        if (this.position.x < 0) {
            this.velocity.x = 0
            this.position.x = 0
        }
    }

    rightColision() {
        if (this.position.x + this.width > canvas.width) {
            this.velocity.x = 0
            this.position.x = canvas.width - this.width
        }
    }

    allColisions() {
        this.topJumpLimit()
        this.leftColision()
        this.rightColision()
        this.downCanvasColision()
    }
}

export default Player