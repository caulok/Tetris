document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    constScoreDisplay = document.querySelector('#score')
    const start = document.querySelector('#start')
    const width = 10
    let nextRandom = 0

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
        current.forEach(index =>
            squares[currentPosition + index].classList.add('tetraminos'))
    }

    // Borrar los tetraminos
    function undraw(){
        current.forEach(index =>
            squares[currentPosition + index].classList.remove('tetraminos'))
    }

    // Bajada de tetraminos
    timerId = setInterval (moveDown, 400)

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
            mostrarFigura()
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
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*1+1]
    ]
    // Mostrar la figura
    function mostrarFigura(){
        // Remover rastro de tetraminos de la grilla
        displaySquares.forEach(square => {
            square.classList.remove('tetraminos')
        })
        siguiente[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetraminos')
        })
    }
})