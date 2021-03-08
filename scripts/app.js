function init() {
  console.log('Javascript is running')

  let timerId = null
  let playheadPosition = 0
  let isPlaying = false

  //* 909 samples
  const samples = [
    '',
    '../assets/sounds/909kit_BD2.mp3',
    '../assets/sounds/909kit_ClapST.mp3',
    '../assets/sounds/909kit_Crash.mp3',
    '../assets/sounds/909kit_HH1.mp3',
    '../assets/sounds/909kit_HHo2.mp3',
    '../assets/sounds/909kit_Ride1.mp3',
    '../assets/sounds/909kit_RideST.mp3',
    '../assets/sounds/909kit_Rim1.mp3',
    '../assets/sounds/909kit_SD1.mp3',
    '../assets/sounds/909kit_Tom4.mp3'
  ]


  //* Grid variables
  const grid = document.querySelector('.grid')
  const width = 16
  const channels = 10
  const cells = []

  // * Creating the grid:
  function createGrid() {
    for (let row = 1; row <= channels; row++) {
      for (let column = 1; column <= width; column++) {
        const cell = document.createElement('div')
        cell.classList = `Y${row} X${column}`
        cell.id = `${(row - 1 ) * 16 + column}`
        grid.appendChild(cell)
        cells.push(cell)
      }
    }
  }
  createGrid()

  //*Creating the audio tags
  const body = document.querySelector('body')
  function createChannels() {
    for (let row = 1; row <= channels; row++) {
      const audioTag = document.createElement('audio')
      audioTag.classList = `channel${row}`
      body.appendChild(audioTag)
    }
  }
  createChannels()

  //* Selecting the audio tags
  const audioTags = []
  for (let i = 1; i <= channels; i++){
    audioTags[i] = document.querySelector(`.channel${i}`)
  }
  console.log(audioTags)


  function handlePlaySound(channel) {
    // console.log(event)
    const sound = samples[channel]
    console.log(sound)
    audioTags[channel].src = sound
    audioTags[channel].play()
  }

  //* Controls 
  const playButton = document.querySelector('.play-button')
  const stopButton = document.querySelector('.stop-button')
  const clearGridButton = document.querySelector('.clear-grid-button')

  //* Play sequence
  function handlePlay() {
    if (isPlaying === false) {
      console.log('play!')
      playheadPosition = 1
      updateCells()
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
    updateCells()
  }

  //* Clear grid
  function handleClearGrid() {
    console.log('clear')
    handlePlaySound(5)
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
    updateCells()
    console.log(playheadPosition + ' playheadPosition')
  }

  //* Adds 'Active' class to the current column
  function updateCells() {
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove('active')
      if (cells[i].classList.contains(`X${playheadPosition}`)) {
        cells[i].classList.add('active')
      }
    }
  }


  function toggleStepOnOff(event) {
    const cellID = event.target.id - 1
    console.log(event)

    if (cells[cellID].classList.contains('on')) {
      cells[cellID].classList.remove('on')
    } else {
      cells[cellID].classList.add('on')
    }
  }


  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  stopButton.addEventListener('click', handleStop)
  clearGridButton.addEventListener('click', handleClearGrid)

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', toggleStepOnOff)
  }


  // cells[4].addEventListener('click', handlePlaySound)

}

window.addEventListener('DOMContentLoaded', init)