/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */
import { canvas, ctx, gravity } from '../main'

class Particle {
    constructor({ position, size, velocity, image }) {
        this.position = position
        this.width = size.x
        this.height = size.y
        this.velocity = { x: velocity.x + (Math.random() * 4), y: velocity.y + (Math.random() * 4) }
        this.elasticity = 0.8
        this.friction = 0.2
        this.decay = 100
        this.offset = 274
        this.image = image
    }

    draw() {
        if (this.image) {
            ctx.drawImage(this.image, this.position.x, this.position.y, 64, 64)
        } else {
            ctx.save()
            ctx.fillStyle = "rgba(255, 255, 60, " + (this.decay * 0.1) + ")"
            ctx.beginPath()
            ctx.arc(this.position.x + 30, this.position.y + 32, this.height * .8, 0, 2 * Math.PI)
            ctx.fill()
            ctx.restore()
        }

        this.decay -= 1
    }

    update() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - this.offset) {
            if (Math.abs(this.velocity.y) > 2) {
                this.velocity.y = - this.velocity.y * this.elasticity
            } else {
                this.position.y = canvas.height - this.offset - this.height
                this.velocity.x = this.velocity.x * this.friction
            }
        }

        this.position.x += this.velocity.x

        if ((this.position.x + this.velocity.x < 0) || (this.position.x + this.width + this.velocity.x > canvas.width)) {
            this.velocity.x = - this.velocity.x * 0.4
        }

        this.draw()
    }
}

export default Particle