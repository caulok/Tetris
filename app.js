document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const start = document.querySelector('#start')
    const restart = document.querySelector('#restart')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = ['#f2ff49','#ff4242','#fb62f6','#645dd7','#b3fffc']

    // Tetraminos
    const lTetramino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetramino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tTetramino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetramino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetramino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const tetraminos = [lTetramino,zTetramino,tTetramino,oTetramino,iTetramino]

    let currentPosition = 4
    let currentRotation = 0

    // Selección aleatoria de tetraminos
    let random = Math.floor(Math.random()*tetraminos.length)
    let current = tetraminos[random][currentRotation]

    // Dibujo de los tetraminos
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetraminos')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // Borrar los tetraminos
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetraminos')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Bajada de tetraminos
    // timerId = setInterval (moveDown, 400)

    // Asignar funciones al teclado
    function control(e){
        // Mover a la izquierda
        if(e.keyCode === 37){
            moveLeft()
        } 
        // Rotar
        else if(e.keyCode === 38){
            rotate()
        }
        // Mover a la derecha
        else if(e.keyCode === 39){
            moveRight()
        }
        // Bajar
        else if(e.keyCode === 40){
            moveDown()
        }
        
    }
    // Eventos al mover las teclas
    document.addEventListener('keyup',control)

    // Función freeze para detener los tetraminos 
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * tetraminos.length)
            current = tetraminos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShapes()
            addScore()
            gameOver()
        }
    }
    // Función moveDown
    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // Mover el tetramino a la izquierda hasta el borde
    function moveLeft(){
        undraw()
        const bordeIzq = current.some(index => (currentPosition + index) % width === 0)
        if(!bordeIzq) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList-contains('taken'))){
            currentPosition +=1
        }  
        draw()
    }
    // Mover el tetramino a la derecha hasta el borde
    function moveRight(){
        undraw()
        const bordeDer = current.some(index => (currentPosition + index) % width === width -1)
        if(!bordeDer) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList-contains('taken'))){
            currentPosition -=1
        }  
        draw()
    }

    // Rotar el tetramino
    function rotate(){
        undraw()
        currentRotation ++
        if(currentRotation === current.length){
            currentRotation = 0
        }
        current = tetraminos[random][currentRotation]
        draw()
    }

    // Mostrar próximo tetramino en el mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 1

    // Tetraminos sin rotación
    const siguiente = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth*2],
        [1, displayWidth, displayWidth+1, 2],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*1+1]
    ]
    // Mostrar la figura
    function displayShapes(){
        // Remover rastro de tetraminos de la grilla
        displaySquares.forEach(square => {
            square.classList.remove('tetraminos')
            square.style.backgroundColor = ''
        })
        siguiente[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetraminos')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]

        })
    }

    // Añadir funcionalidad al botón de Start y Pause
    start.addEventListener('click', () => {
        if (timerId) {
          clearInterval(timerId)
          timerId = null
        } else {
          draw()
          timerId = setInterval(moveDown, 400)
          nextRandom = Math.floor(Math.random()*tetraminos.length)
          displayShapes()
        }
    })

    // Puntaje
    function addScore(){
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetraminos')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Game Over
    function gameOver() {
        var perdiste = ' - Estuviste cerca, volvé a intentarlo'

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = score + perdiste
            clearInterval(timerId)
        }
    }
})