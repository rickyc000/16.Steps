function init() {
  console.log('Javascript is running')

  let timerId = null

  let playheadPosition = 0
  let isPlaying = false

  //* Grid variables
  const grid = document.querySelector('.grid')
  const width = 16
  const height = 10
  const cells = []

  // * Creating the grid:
  function createGrid() {
    for (let row = 1; row <= height; row++) {
      for (let column = 1; column <= width; column++) {
        const cell = document.createElement('div')
        cell.classList = `Y${row} X${column}`
        grid.appendChild(cell)
        cells.push(cell)
      }
    }
  }
  createGrid()

  //* Controls 
  const playButton = document.querySelector('.play-button')
  const stopButton = document.querySelector('.stop-button')
  const clearGridButton = document.querySelector('.clear-grid-button')

  //* Play sequence
  function handlePlay() {
    if (isPlaying === false) {
      console.log('play!')
      playheadPosition = 1
      updateCells(playheadPosition)
      startTimer()
      isPlaying = true
    } else {
      return
    }
  }

  //* Stop sequence
  function handleStop() {
    console.log('stop!')
    clearInterval(timerId)
    playheadPosition = 0
    isPlaying = false
  }

  //* Clear grid
  function handleClearGrid() {
    console.log('clear!')
  }


  //* Timer
  function startTimer() {
    timerId = setInterval(() => {
      console.log(timerId)
      movePlayhead()
    }, 200)
  }


  //* Move playhead
  function movePlayhead() {
    if (playheadPosition == 16) {
      playheadPosition = 1
    } else {
      playheadPosition = playheadPosition + 1
    }
    updateCells(playheadPosition)
    console.log(playheadPosition + ' playheadPosition')
  }

  //* Adds 'Active' class to the current column
  function updateCells(playheadPosition) {


    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove('active')

      if (cells[i].classList.contains(`X${playheadPosition}`)) {
        cells[i].classList.add('active')
      }
    }
  }






  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  stopButton.addEventListener('click', handleStop)
  clearGridButton.addEventListener('click', handleClearGrid)

}

window.addEventListener('DOMContentLoaded', init)