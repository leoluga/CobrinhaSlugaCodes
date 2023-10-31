const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
// const scoreDisplay = document.querySelector(".score")
// const score = document.querySelector(".score-value")

const score = document.getElementById('score')
const finalScore = document.querySelector(".final-score > span")
const startMenu = document.querySelector(".start-menu")
const stopScreen = document.querySelector(".stop-screen")
const gameOverMenu = document.querySelector(".game-over-screen")
const buttonPlay = document.querySelector(".btn-play")

const buttonStart = document.querySelector(".btn-start")




console.log(difficulty, gridSize)


const audio = new Audio('../assets/audio.mp3')



const checkSize = () => {
    const gridSize = document.getElementById('gridSize').value;
    if (gridSize == "small") {
        size = 30
    }
    else if (gridSize == "medium") {
        size = 45
    }
    else if (gridSize == "large") {
        size = 60
    }
}

const addScore = () => {
    score.innerText = +score.innerText + 1
}

const randomNumber = (min, max) => {
    return Math.round(Math.random()*(max - min) + min)
}

const randomxPosition = (grid_size) =>{
    const number = randomNumber(1, canvas.width - grid_size)
    return Math.round(number / grid_size) * grid_size
}

const randomyPosition = (grid_size) =>{
    const number = randomNumber(1, canvas.height - grid_size)
    return Math.round(number / grid_size) * grid_size
}

const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})`
}


let direction, loopId, prevDirection, speed, size, snake

checkSize()

const initialPosition = {x : randomxPosition(size), y: randomyPosition(size)}

const food = {
    x: randomxPosition(size), 
    y: randomyPosition(size),
    color : randomColor(size)
}

snake = [initialPosition]

const resetPositions = () => {
    checkSize()

    initialPosition.x = randomxPosition(size), 
    initialPosition.y = randomyPosition(size)

    food.x = randomxPosition(size)
    food.y = randomyPosition(size)

    snake = [initialPosition]
}


let gameOn = false

let gameLost = false

const drawFood = () => {
    const { x, y, color} = food
    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "grey"
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.shadowColor = "white"
            ctx.shadowBlur = 15
            ctx.fillStyle = "white"
            
        }
        ctx.fillRect(position.x, position.y, size, size)
        ctx.shadowBlur = 0
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    snake.shift()

    if (direction == "right") {
        snake.push({x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({x: head.x - size, y: head.y })
    }
    if (direction == "up") {
        snake.push({x: head.x, y: head.y - size})
    }
    if (direction == "down") {
        snake.push({x: head.x, y: head.y + size})
    }
}

const drawGrid = (width, blur) => {
    checkSize()
    console.log(size)
    ctx.lineWidth = width
    ctx.strokeStyle = "green"
    ctx.shadowColor = "white"
    ctx.shadowBlur = blur

    for (let i = 0; i <= canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
    } 
    for (let i = 0; i <= canvas.height; i += size) {
        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(canvas.height, i)
        ctx.stroke()
    } 
    ctx.shadowBlur = 0
}

const changeFoodPosition = () => {
    checkSize()
    let x = randomxPosition(size)
    let y = randomyPosition(size)

    while (snake.find((position) => position.x == x && position.y == y)) {
        x = randomxPosition(size)
        y = randomyPosition(size)
    }
    food.x = x
    food.y = y
    food.color = randomColor()
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        audio.play()
        addScore()
        snake.push(head)
        changeFoodPosition()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasxLimit = canvas.width - size
    const canvasyLimit = canvas.height - size
    const neckIndex = snake.length - 2
    const wallCollision = 
        head.x < 0 || head.x > canvasxLimit || head.y < 0 || head.y > canvasyLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const checkSpeed = () => {
    const difficulty = document.getElementById('difficulty').value;

    if (difficulty == 'easy') {
        speed = 100
    }
    else if (difficulty == 'medium') {
        speed = 60
    }
    else if (difficulty == 'hard') {
        speed = 40
    }
}

const gameOver = () => {
    direction = undefined
    gameOverMenu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
    gameOn = false
    gameLost = true
}

const gameStop = () => {
    if (gameOn) {
        prevDirection = direction
        stopScreen.style.display = "flex"
        direction = undefined
        gameOn = false
        gameLost = true
        canvas.style.filter = "blur(2px)"
    }
}

const gameContinue = () => {
    stopScreen.style.display = "none"
    gameOn = true
    canvas.style.filter = "blur(0.8px)"
    direction = prevDirection
}

const gameLoop = () => {
    
    clearInterval(loopId)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    checkSize()
    drawGrid(0.3, 0)
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()
    checkSpeed()
    loopId = setTimeout(() => {
        gameLoop()
    }, speed)
}

drawGrid(0.3, 0)
canvas.style.filter = "blur(0.8px)"

buttonStart.addEventListener("click", () => {
    resetPositions()
    gameOn = true
    startMenu.style.display = "none"
    gameLoop()
})


buttonPlay.addEventListener("click", () => {
    resetPositions()
    gameOn = true
    score.innerText = "00"
    gameOverMenu.style.display = "none"
    canvas.style.filter = "none"
    snake = [initialPosition]
    drawFood()
})

document.addEventListener("keydown", ({key}) => {
    if (gameOn == true && key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (gameOn == true && key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (gameOn == true && key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
    if (gameOn == true && key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if (gameOn && key == "Escape") {
        gameStop()
    }
    if (!gameOn && gameLost && key == "Enter") {
        gameContinue()
    }
})

const moveLeft = () => {
    if (gameOn == true && direction != "right") {
        direction = "left"
    }
}
const moveRight = () => {
    if (gameOn == true && direction != "left") {
        direction = "right"
    }
}
const moveUp = () => {
    if (gameOn == true && direction != "down") {
        direction = "up"
    }
}
const moveDown = () => {
    if (gameOn == true && direction != "up") {
        direction = "down"
    }
}