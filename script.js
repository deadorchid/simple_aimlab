const fieldContainer = document.getElementById('fieldContainer')
const countContainer = document.getElementById('countContainer')

const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')

/*
 * {
 * domElement: ...,
 * scale: ...
 * state: ... [increase, decrease, static]
 * isShoot: ...
 * isExists: ...
 * }
*/

let COUNT = 0

const targets = []

let i = 0

fieldContainer.addEventListener('click', () => {
  changeCount(() => COUNT -= 20)
})

let cycleId = null

startBtn.addEventListener('click', () => {
  if (cycleId === null) {
    changeCount(() => COUNT = 0)
    cycleId =
      setInterval(() => {
        const target = spawnTarget()
        let intervalID = setInterval(() => animateTarget(target, intervalID), 50)
      }, 1000)
  }
})

stopBtn.addEventListener('click', () => {
  if (cycleId != null) {
    clearInterval(cycleId)
    cycleId = null
  }
})

/* funcs */
function destroyTarget(target) {
  target.isExists = false
  fieldContainer.removeChild(target.domElement)

  if (cycleId !== null && !target.isShoot) {
    changeCount(() => COUNT -= 5)
  }
}

function clickTarget(target) {
  changeCount(() => {
    COUNT += 5
  })
  target.isShoot = true
  destroyTarget(target)
}

function changeCount(fnCall) {
  fnCall()
  countContainer.innerHTML = `Count: ${COUNT}`
}

function spawnTarget() {
  let target = document.createElement('span')

  target.style.transition = 'transform 0.1s ease, box-shadow 0.5s ease'

  target.style.display = "inline-block"
  target.style.borderRadius = '50px'

  target.style.position = 'absolute'

  const [topPos, leftPos] = [getRandomInt(0, 500), getRandomInt(0, 500)]
  const [...colors] = [
    getRandomInt(0, 255),
    getRandomInt(0, 255),
    getRandomInt(0, 255)
  ]

  target.style.top = topPos + 'px'
  target.style.left = leftPos + 'px'

  target.style.backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`

  const targetObj = {
    domElement: target,
    scale: 1,
    state: 'increase',
    isShoot: false,
    isExists: true
  }

  targets.push(targetObj)

  target.style.width = 1 + 'px'
  target.style.height = 1 + 'px'

  target.addEventListener('click', event => {
    event.stopPropagation()
    clickTarget(targetObj)
  })

  fieldContainer.appendChild(target)

  return targetObj
}

function animateTarget(target, intervalID) {
  if (target.scale <= 0) {
    if (target.isExists) destroyTarget(target)
    clearInterval(intervalID)
    return
  }
  if (target.scale >= 50) target.state = 'decrease'
  if (target.state === 'increase') {
    target.domElement.style.transform = `scale(${target.scale++})`
  } else if (target.state === 'decrease') {
    target.domElement.style.transform = `scale(${target.scale--})`
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
