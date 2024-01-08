/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */
import './style.css'
import Bomb from './js/particle'
import Player from './js/player'
import ExplosionParticle from './js/explosionParticle.js';

/** Start Dom creation */
document.querySelector('#app').innerHTML = `
  <div>
    <div id="screen"></div>
  </div>
`
export const canvas = document.createElement('canvas')
canvas.width = window.screen.height
canvas.height = window.screen.height / 16 * 9
export const ctx = canvas.getContext("2d")
document.querySelector('#screen').appendChild(canvas)
// ctx.scale(.256, .256)
/** End Dom creation */

/** Start Variable and Constants creation */
let count = 0, frame = 0, action = 15, idle = 0, bombs = [], explodeParticles = [], offsetToPrevenImageBlink = 2
const gravityMultiplier = 0.1
export const gravity = 9.81 * gravityMultiplier
export let explodeCluster = []
const maxNumberOfparticles = 4, walkSpeed = 3, runSpeed = 10
const particleImage = new Image()
particleImage.src = 'img/Red_crystal2.png'
const background = new Image()
background.src = "./img/game_background_4.png"
const player = new Player({ position: { x: 10, y: 10 } })
const keyPressed = {
  any: { pressed: false },
  up: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
  run: { pressed: false },
  throw: { pressed: false },
  kick: { pressed: false },
  hurt: { pressed: false },
  slash: { pressed: false },
  falling: { pressed: false },
  field: { pressed: false },
}
const imageActions = {
  idle: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Idle',
    file: '0_Reaper_Man_Idle_',
    frames: 17
  },
  blink: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Idle Blinking',
    file: '0_Reaper_Man_Idle Blinking_',
    frames: 17
  },
  walk: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Walking',
    file: '0_Reaper_Man_Walking_',
    frames: 23
  },
  jump: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Jump Loop',
    file: '0_Reaper_Man_Jump Loop_',
    frames: 5
  },
  throw: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Run Throwing',
    file: '0_Reaper_Man_Run Throwing_',
    frames: 11
  },
  kick: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Kicking',
    file: '0_Reaper_Man_Kicking_',
    frames: 11
  },
  hurt: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Hurt',
    file: '0_Reaper_Man_Hurt_',
    frames: 11
  },
  falling: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Falling Down',
    file: '0_Reaper_Man_Falling Down_',
    frames: 5
  },
  slashing: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Slashing',
    file: '0_Reaper_Man_Slashing_',
    frames: 11
  },
  slashRun: {
    path: 'img/Reaper_Man_1/PNG/PNG Sequences/Slashing',
    file: '0_Reaper_Man_Slashing_',
    frames: 11
  },
}
const imgBlink = loadImages(imageActions.blink)
const imgIdle = loadImages(imageActions.idle)
const imgWalk = loadImages(imageActions.walk)
const imgJump = loadImages(imageActions.jump)
const imgThrow = loadImages(imageActions.throw)
const imgKick = loadImages(imageActions.kick)
const imgHurt = loadImages(imageActions.hurt)
const imgfalling = loadImages(imageActions.falling)
const imgSlashing = loadImages(imageActions.slashing)
const imgStashRun = loadImages(imageActions.slashRun)
/** End Variable and Constants creation */

/** Start Function declaration */
function loadImages({ path, file, frames }) {
  let extension = 'png'
  let filesArray = []
  for (let index = 0; index <= frames; index++) {
    filesArray[index] = `${path}/${file}${String(index).padStart(3, '0')}.${extension}`
  }

  return filesArray
}

function imgInstances(inputArray) {
  let images = []
  inputArray.map((element, index) => {
    images.push(new Image)
    images[index].src = element
  })
  images.pop()
  return images
}

function imgInitialization() {
  player.images = {
    blinking: imgInstances(imgBlink),
    idle: imgInstances(imgIdle),
    walk: imgInstances(imgWalk),
    jump: imgInstances(imgJump),
    throw: imgInstances(imgThrow),
    kick: imgInstances(imgKick),
    hurt: imgInstances(imgHurt),
    slash: imgInstances(imgSlashing),
    stashRun: imgInstances(imgStashRun),
    falling: imgInstances(imgfalling),
  }
  action = player.images.idle.length
  idle = player.images.idle.length - offsetToPrevenImageBlink
  count = 0
}

function keysUpdate() {
  player.velocity.x = 0
  if (keyPressed.left.pressed) { player.velocity.x = - (keyPressed.run.pressed ? runSpeed : walkSpeed) }
  if (keyPressed.right.pressed) { player.velocity.x = (keyPressed.run.pressed ? runSpeed : walkSpeed) }
  if (keyPressed.up.pressed) {
    player.velocity.y = -8
  }
}

function updatePlayer() {
  player.update()
  player.keysPressed = keyPressed
  player.count = count
  player.frame = frame
}

function isFalling() {
  if (player.velocity.y > 0.1) {
    action = player.images.falling.length
    keyPressed.falling.pressed = true
  } else {
    keyPressed.falling.pressed = false
    action = idle
  }
}

function throwBomb() {
  if (bombs.length < maxNumberOfparticles) {
    bombs.push(new Bomb({
      position: {
        x: (player.faceToRight ? player.position.x + (player.width / 10) * 6 : player.position.x + (player.width / 10) * 2),
        y: (player.faceToRight ? player.position.y + (player.width / 10) * 5 : player.position.y + (player.width / 10) * 5)
      },
      size: { x: 20, y: 20 },
      velocity: { x: player.faceToRight ? 12 : -12, y: -16 },
      // image: particleImage
    }))
  }
}

function bombUpdate() {
  if (bombs.length >= 1) {
    bombs.forEach((bomb, index) => {
      if (bomb.decay == 0) {
        for (let i = 0; i < 60; i++) {
          explodeParticles.push(
            new ExplosionParticle({
              position: {
                x: bomb.position.x,
                y: bomb.position.y - bomb.velocity.y
              }
            })
          );
          console.log(bombs)
        }
        bombs.splice(index, 1)
      }
      bombShadow(bomb)
      bomb.update()
    })
  }
  explosionUpdate()
}

function explosionUpdate() {
  if (explodeParticles.length >= 1) {
    explodeParticles.forEach((item, index) => {
      if (item.ttl > item.maxLife) {
        explodeParticles.splice(index, 1)
      } else {
        item.r -= 0.001
        item.update()
      }
    });
  }
}

function shadowPlayer(base = 565) {
  let floorBase = base
  let posY = Math.abs(player.position.y + player.height - 44)
  // To avoid index incorrect on elipse
  if (player.position.y >= 0) {
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0," + ((posY / floorBase) / 12) + ")"
    ctx.beginPath()
    ctx.ellipse(player.position.x + (player.width / 2), floorBase, (player.width / 4) * (posY / floorBase), (player.height / 24) * (posY / floorBase), 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }
}

function bombShadow(item, base = 526) {
  let floorBase = base
  let posY = Math.abs(Math.round(item.position.y + item.height) - 11)
  // To avoid index incorrect on elipse
  if (player.position.y >= 0) {
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0," + ((posY / floorBase) / 8) + ")"
    ctx.beginPath()
    ctx.ellipse(item.position.x + item.width + 14, floorBase + 36, item.width + 6 * (posY / floorBase), (item.width / 6) * (posY / floorBase), 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }
}

function walkAndRunSpeed() {
  if (frame % (
    (keyPressed.left.pressed || keyPressed.right.pressed) ? runSpeed * 0.1 : walkSpeed
  ) == 0) {
    if (count > action) {
      count = 0
    } else {
      count++
    }
  }

  // Reset to avoid overload
  frame++
  if (frame >= 200000) {
    frame = 0
  }
}

function animate() {
  requestAnimationFrame(animate)
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
  if (background) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  }
  shadowPlayer()
  isFalling()
  updatePlayer()
  bombUpdate()
  keysUpdate()
  walkAndRunSpeed()
}
/** End Function declaration */

/** Start call */
imgInitialization()
animate()
/** End call */

/** Start Window Events */
window.addEventListener('keypress', (event) => {
  switch (event.key) {
    case '8':
      keyPressed.up.pressed = true
      action = player.images.jump.length
      count = 0
      break
    case '4':
      keyPressed.left.pressed = true
      player.faceToRight = false
      action = player.images.walk.length
      break
    case '6':
      keyPressed.right.pressed = true
      player.faceToRight = true
      action = player.images.walk.length
      break
    case '5':
      keyPressed.run.pressed = true
      break
    case 'd':
      keyPressed.throw.pressed = true
      action = player.images.throw.length
      count = 0
      throwBomb()
      break
    case 'a':
      keyPressed.kick.pressed = true
      action = player.images.kick.length
      count = 0
      break
    case 's':
      keyPressed.slash.pressed = true
      action = player.images.slash.length
      count = 0
      break
    case 'f':
      keyPressed.field.pressed = true
      break
    default:
      action = idle
      count = 0
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case '8':
      keyPressed.up.pressed = false
      action = idle
      break
    case '4':
      keyPressed.left.pressed = false
      action = idle
      break
    case '6':
      keyPressed.right.pressed = false
      action = idle
      break
    case '5':
      keyPressed.run.pressed = false
      action = idle
      break
    case 'd':
      keyPressed.throw.pressed = false
      action = idle
      break
    case 'a':
      keyPressed.kick.pressed = false
      action = idle
      break
    case 's':
      keyPressed.slash.pressed = false
      action = idle
      break
    case 'f':
      keyPressed.field.pressed = false
      break
  }
})
/** End Window Events */
