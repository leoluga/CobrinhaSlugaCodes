const canvas = document.querySelector("canvas")

const ctx = canvas.getContext("2d")


const size = 10

const snake = [
    {x : 200, y:200},
]

const food = {
    x: 90, 
    y: 90,
    color : "lightgreen"

}


let direction, loopId

const drawFood = () => {
    const { x, y, color} = food
    ctx.shadowColor = "white"
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}


const drawSnake = () => {

    
    ctx.fillStyle = "cyan"
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "red"
        }
        ctx.fillRect(position.x, position.y, size, size)
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

const drawGrid = () => {
    ctx.lineWidth = 0.1
    ctx.strokeStyle = "cyan"

    for (let i = 0; i <= canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(600, i)

        ctx.stroke()
    } 
}

// drawGrid()

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0,0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}

gameLoop()


document.addEventListener("keydown", ({key}) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
})