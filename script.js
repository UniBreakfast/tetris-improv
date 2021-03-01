const gs = {
  alive: [[1]],
  pos: {x: 0, y: 0},
  inert: eval(`[${`[${'0,'.repeat(10)}],`.repeat(20)}]`)
}

render()
setInterval(tick, 300)

onkeydown = e => {
  const {key} = e
  if (key == 'ArrowDown' && canMove('down')) gs.pos.y++
  else if (key == 'ArrowLeft' && canMove('left')) gs.pos.x--
  else if (key == 'ArrowRight' && canMove('right')) gs.pos.x++
  else return
  render()
}

function tick() {
  if (canMove('down')) gs.pos.y++
  else {
    const cells = getCoords(gs.alive, gs.pos)
    cells.forEach(({x, y}) => gs.inert[y][x] = 1)
    const inert = gs.inert.filter(row => row.some(cell => cell == 0))
    gs.inert = [
      ...eval(`[${`[${'0,'.repeat(10)}],`.repeat(20 - inert.length)}]`),
      ...inert
    ]
    gs.alive = [[1]]
    gs.pos = {x: 0, y: 0}
  }
  render()
}

function canMove(dirn) {
  const cells = getCoords(gs.alive, gs.pos)
  const shift = shifts[dirn]
  cells.forEach(cell => {
    cell.x += shift.x
    cell.y += shift.y
  })
  return cells.every(({x, y}) => gs.inert[y]?.[x] === 0)
}

function getCoords(shape, pos) {
  return shape.flatMap((row, j) => row.map((cell, i) =>
    cell && {x: pos.x + i, y: pos.y + j})).filter(Boolean)
}

function render() {
  const cells = gs.inert.flatMap((row, y) => row.map((cell, x) =>
    cell && {x, y})).filter(Boolean).concat(getCoords(gs.alive, gs.pos))
  tGlass.innerHTML = cells.map(buildBlock).join('')
}

function buildBlock({x, y}) {
  const left = x*5,  top = y*5
  return `<div class="block" style="left: ${left}vh; top: ${top}vh"></div>`
}

const shifts = {
  down: {x: 0, y: 1},
  left: {x: -1, y: 0},
  right: {x: 1, y: 0},
}
