/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */

class Explosioncluster {
    constructor(bomb) {
        this.bomb = bomb
        this.particles = []
    }

    init() {
        for (let i = 0; i < 60; i++) {
            this.particles.push(
                new ExplosionParticle({
                    position: {
                        x: this.bomb.position.x,
                        y: this.bomb.position.y - particle.velocity.y
                    }
                })
            )
        }
    }


    update() {
        if (this.particles.length >= 1) {
            this.particles.forEach((item, index) => {
                if (item.ttl > item.maxLife) {
                    this.particles.splice(index, 1)
                }
                item.r -= 0.001
                item.update()
            });
        }
    }
}

export default Explosioncluster