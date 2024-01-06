/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */
import { noise } from './perlinNoise.js'
import { canvas, ctx, gravity } from '../main'

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class ExplosionParticle {
    constructor({ position }) {
        this.position = position
        this.random = noise(this.position.x, this.position.y)
        this.direction = this.gradTRoRad(180 + (Math.random() * 50 - 25)) // 180 points up
        this.velocity = {
            x: Math.sin(this.direction) * 30 * (Math.random()),
            y: Math.cos(this.direction) * 30 * (Math.random())
        }
        this.radius = randomIntFromRange(2, 10)
        this.maxLife = 100
        this.ttl = 1
        this.offset = 272
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x + 26, this.position.y + 26, this.radius * this.random, 0, Math.PI * 2, false)
        ctx.closePath();
        ctx.fillStyle = `rgba(255, ${255 - this.ttl * 1},  ${60 - this.ttl * .5}, ${0.8 - this.ttl * this.random * 0.025})`
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.position.y >= canvas.height - this.offset) {
            this.velocity.y = -this.velocity.y * this.random
        } else {
            this.velocity.y += gravity;
        }

        this.position.x += this.velocity.x * this.random
        this.position.y += this.velocity.y * this.random
        this.ttl++
        this.draw()
    }

    gradTRoRad(grad) {
        return (((2 * Math.PI) / 360) * grad)
    }
}

export default ExplosionParticle