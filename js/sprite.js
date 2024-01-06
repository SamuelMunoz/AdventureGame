/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */
import { ctx } from '../main'

class Sprite {
    constructor({ position }) {
        this.position = position
        this.images = { idle: [], blinking: [], walk: [], jump: [], kick: [], hurt: [] }
        this.frame = 0
        this.count = 0
        this.hurt = false
        this.faceToRight = true
        this.isBlinking = false
        this.width = 256
        this.height = 256
        this.keysPressed = {
            any: { pressed: false },
            up: { pressed: false },
            left: { pressed: false },
            right: { pressed: false },
            run: { pressed: false },
            throw: { pressed: false },
            kick: { pressed: false },
            slash: { pressed: false },
            falling: { pressed: false },
            force: { pressed: false }
        }
    }

    draw() {
        if (this.keysPressed.force.pressed) {
            this.forceField()
        }
        if (this.isFalling()) {
            this.falling()
        } else {
            this.drawActions()
        }
    }

    update() {
        this.draw()
    }

    boundingBox() {
        ctx.fillStyle = "rgba(255,0,0,0.2)"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    forceField() {
        var grd = ctx.createRadialGradient(
            this.position.x + (this.width / 2) + (this.faceToRight ? -10 : 10),
            this.position.y + (this.height / 2),
            this.width / 2,
            this.position.x + (this.width / 2) + (this.faceToRight ? -10 : 10),
            this.position.y + (this.height / 2),
            5
        )
        grd.addColorStop(0, 'rgba(200, 255, 200, 0.005)')
        grd.addColorStop(1, 'rgba(200, 255, 200, .8)')
        ctx.save()
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(this.position.x + (this.width / 2) + (this.faceToRight ? -10 : 10), this.position.y + (this.height / 2) + 4, this.width / 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
    }

    drawActions() {
        if (this.isAttack()) {
            if (this.keysPressed.slash.pressed) {
                if (this.isWalk()) {
                    if (this.faceToRight) {
                        ctx.drawImage(this.images.stashRun[this.count], this.position.x, this.position.y, this.width, this.height)
                    } else {
                        ctx.save()
                        ctx.scale(-1, 1)
                        ctx.drawImage(this.images.stashRun[this.count], -this.position.x, this.position.y, -this.width, this.height)
                        ctx.restore()
                    }
                } else {
                    if (this.faceToRight) {
                        ctx.drawImage(this.images.slash[this.count], this.position.x, this.position.y, this.width, this.height)
                    } else {
                        ctx.save()
                        ctx.scale(-1, 1)
                        ctx.drawImage(this.images.slash[this.count], -this.position.x, this.position.y, -this.width, this.height)
                        ctx.restore()
                    }
                }
            } else if (this.keysPressed.kick.pressed) {
                if (this.faceToRight) {
                    ctx.drawImage(this.images.kick[this.count], this.position.x, this.position.y, this.width, this.height)
                } else {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(this.images.kick[this.count], -this.position.x, this.position.y, -this.width, this.height)
                    ctx.restore()
                }
            } else if (this.keysPressed.throw.pressed) {
                if (this.faceToRight) {
                    ctx.drawImage(this.images.throw[this.count], this.position.x, this.position.y, this.width, this.height)
                } else {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(this.images.throw[this.count], -this.position.x, this.position.y, -this.width, this.height)
                    ctx.restore()
                }
            }
        } else {
            if (this.isIdle()) {
                if (this.faceToRight) {
                    if (this.randomBlink()) { this.isBlinking = true }
                    else if (this.frame % 30 == 0) { this.isBlinking = false }
                    if (this.isBlinking) {
                        ctx.drawImage(this.images.blinking[this.count], this.position.x, this.position.y, this.width, this.height)
                    } else {
                        ctx.drawImage(this.images.idle[this.count], this.position.x, this.position.y, this.width, this.height)
                    }
                } else {
                    if (this.randomBlink()) { this.isBlinking = true }
                    else if (this.frame % 30 == 0) { this.isBlinking = false }
                    if (this.isBlinking) {
                        ctx.save()
                        ctx.scale(-1, 1)
                        ctx.drawImage(this.images.blinking[this.count], -this.position.x, this.position.y, -this.width, this.height)
                        ctx.restore()
                    } else {
                        ctx.save()
                        ctx.scale(-1, 1)
                        ctx.drawImage(this.images.idle[this.count], -this.position.x, this.position.y, -this.width, this.height)
                        ctx.restore()
                    }
                }
            } else if (this.isWalk()) {
                if (this.faceToRight) {
                    ctx.drawImage(this.images.walk[this.count], this.position.x, this.position.y, this.width, this.height)
                } else {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(this.images.walk[this.count], -this.position.x, this.position.y, -this.width, this.height)
                    ctx.restore()
                }
            } else if (this.isJump()) {
                if (this.faceToRight) {
                    ctx.drawImage(this.images.jump[this.count], this.position.x, this.position.y, this.width, this.height)
                } else {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(this.images.jump[this.count], -this.position.x, this.position.y, -this.width, this.height)
                    ctx.restore()
                }
            }
        }
    }

    isIdle() {
        return this.images.idle[this.count] &&
            !this.keysPressed.left.pressed &&
            !this.keysPressed.right.pressed
    }

    isJump() {
        return this.images.jump[this.count] && this.keysPressed.up.pressed
    }

    isWalk() {
        return this.images.walk[this.count] && (this.keysPressed.right.pressed || this.keysPressed.left.pressed)
    }

    isAttack() {
        return (this.images.kick[this.count] && this.keysPressed.kick.pressed) ||
            (this.images.slash[this.count] && this.keysPressed.slash.pressed) ||
            (this.images.throw[this.count] && this.keysPressed.throw.pressed)
    }

    isHurt() {
        return this.images.hurt[this.count] && this.hurt
    }

    isFalling() {
        return this.images.falling[this.count] && this.keysPressed.falling.pressed
    }

    falling() {
        if (this.faceToRight) {
            ctx.drawImage(this.images.falling[this.count], this.position.x, this.position.y, this.width, this.height)
        } else {
            ctx.save()
            ctx.scale(-1, 1)
            ctx.drawImage(this.images.falling[this.count], -this.position.x, this.position.y, -this.width, this.height)
            ctx.restore()
        }
    }

    randomBlink() {
        var rounded = Math.round(Math.random() * 90)
        return rounded == 10
    }
}

export default Sprite