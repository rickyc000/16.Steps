function init() {
  console.log('Javascript is running')

  const audioContext = new AudioContext()
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate
  )

  const channelData = buffer.getChannelData(0)
  console.log(channelData.length)

  for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1
  }

  const primaryGainControl = audioContext.createGain()
  primaryGainControl.gain.setValueAtTime(0.05, 0)
  primaryGainControl.connect(audioContext.destination)


  const snareFilter = audioContext.createBiquadFilter()
  snareFilter.type = 'highpass'
  snareFilter.frequency.value = 500
  snareFilter.connect(primaryGainControl)


  // const tempoKnob = document.createElement('input')
  // tempoKnob.setAttribute('type', 'range')
  // tempoKnob.setAttribute('min', '0')
  // tempoKnob.setAttribute('max', '200')
  // document.body.appendChild(tempoKnob)


  function playSynth(freq) {
    const synthOscillator = audioContext.createOscillator()
    // kickOscillator.frequency.exponentialRampToValueAtTime(
    //   0.001,
    //   audioContext.currentTime + 0.4
    // )
    synthOscillator.frequency.setValueAtTime(freq, 0)
    synthOscillator.type = 'sawtooth'
    synthOscillator.connect(snareFilter)
    synthOscillator.start()
    synthOscillator.stop(audioContext.currentTime + 0.2)
  }

  let timerId = null
  let playheadPosition = 0
  let isPlaying = false
  let tempo = createKnob()



  function createKnob() {
    let knobPosition = 200
    let knobEngaged = false
    let previousY = null
    let knobPercentage = ((knobPosition + 50) / 280) * 100

    const min = 80
    const max = 200
    const range = max - min

    let BPM = (knobPercentage / 100 * range) + min

    function engageKnob(event) {
      knobEngaged = true
      previousY = event.clientY
      event.preventDefault()
    }

    function disengageKnob() {
      knobEngaged = false
    }

    function rotaryMove(Y) {
      if (knobEngaged) {
        if (previousY - Y === 0) {
          return
        }
        const isGoingUp = previousY >= Y
        previousY = Y

        //* If the knob is at the top/bottom, do nothing:
        if (knobPosition <= -50 && isGoingUp === false ||
          knobPosition >= 230 && isGoingUp === true) {
          return
        }

        //* Determines the rate of knob movement
        isGoingUp ? knobPosition = knobPosition + 5 : knobPosition = knobPosition - 5

        //* Sets the knob position
        testKnob.style = `--percentage:${knobPosition}`

        //* Turns the value into a percentage
        knobPercentage = ((knobPosition + 50) / 280) * 100
        console.log(knobPercentage + '%')

        //* Turn this value into a range between 80 / 200
        BPM = (knobPercentage / 100 * range) + min
        // console.log(BPM)
        updateTempo(BPM)
      }
      
    }

    const testKnob = document.createElement('button')
    testKnob.classList = 'knob'
    testKnob.innerText = 'Test'
    testKnob.style = `--percentage:${knobPosition}`
    document.body.appendChild(testKnob)

    testKnob.addEventListener('mousedown', engageKnob)
    window.addEventListener('mouseup', disengageKnob)

    window.addEventListener('mousemove', event => {
      rotaryMove(event.clientY)
    })
    return knobPercentage

  }

  // console.log()





  //* Notes
  const notes = [
    { name: 'C', frequency: 261.63 },
    { name: 'C#', frequency: 277.18 },
    { name: 'D', frequency: 293.66 },
    { name: 'D#', frequency: 311.13 },
    { name: 'E', frequency: 329.63 },
    { name: 'F', frequency: 349.23 },
    { name: 'F#', frequency: 369.99 },
    { name: 'G', frequency: 392.0 },
    { name: 'G#', frequency: 415.3 },
    { name: 'A', frequency: 440.0 },
    { name: 'A#', frequency: 466.16 },
    { name: 'B', frequency: 493.88 }
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
        cell.id = `${(row - 1) * 16 + column}`
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
      updateCells()
      triggersSample()
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
  }

  //* Timer
  // function startTimer() {
  //   timerId = setInterval(() => {
  //     console.log(timerId)
  //     movePlayhead()
  //   }, tempo)
  // }

  function startTimer() {
    timerId = setTimeout(() => {
      movePlayhead()
      startTimer()
    }, tempo)
  }


  //* Move playhead
  function movePlayhead() {
    if (playheadPosition == 16) {
      playheadPosition = 1
    } else {
      playheadPosition = playheadPosition + 1
    }
    updateCells()
    triggersSample()
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


  //* Turn a STEP on or off
  function toggleStepOnOff(event) {
    const cellID = event.target.id - 1
    if (cells[cellID].classList.contains('on')) {
      cells[cellID].classList.remove('on')
    } else {
      cells[cellID].classList.add('on')
    }
  }

  //* Triggers play sound function
  function triggersSample() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains(`X${playheadPosition}`)
        && (cells[i].classList.contains('on'))) {
        const noteToPlay = cells[i].classList[0].slice(1)
        playSynth(notes[noteToPlay].frequency)
      }
    }
  }


  function updateTempo(newTempo) {
    console.log(newTempo + ' newTempo')
    tempo = (60000 / newTempo) / 4
    // console.log(tempo + ' tempo')
  }

  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  stopButton.addEventListener('click', handleStop)
  clearGridButton.addEventListener('click', handleClearGrid)


  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', toggleStepOnOff)
  }





}

window.addEventListener('DOMContentLoaded', init)