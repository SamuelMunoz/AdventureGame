/**
 * Adventure game demo 1.0.
 *
 * @link   URL: www.codig01.com
 * @author CODIG01.
 * @since  1.0
 */
const gravityMultiplier = 0.1
const gravity = 9.81 * gravityMultiplier
const canvas = document.createElement("canvas")
canvas.width = window.screen.height
canvas.height = window.screen.height / 16 * 9
const ctx = canvas.getContext("2d")
// ctx.scale(.256, .256)

export { canvas, ctx, gravity }