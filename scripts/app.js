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


  // const button = document.createElement('button')
  // button.innerText = 'White Noise'
  // button.addEventListener('click', () => {
  //   const whiteNoiseSource = audioContext.createBufferSource()
  //   whiteNoiseSource.buffer = buffer
  //   whiteNoiseSource.connect(primaryGainControl)
  //   whiteNoiseSource.start()
  // })
  // document.body.appendChild(button)


  const snareFilter = audioContext.createBiquadFilter()
  snareFilter.type = 'highpass'
  snareFilter.frequency.value = 500
  snareFilter.connect(primaryGainControl)


  const tempoKnob = document.createElement('input')
  tempoKnob.setAttribute('type', 'range')
  tempoKnob.setAttribute('min', '0')
  tempoKnob.setAttribute('max', '200')
  document.body.appendChild(tempoKnob)


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

  const lerp = (x, y, a) => x * (1 - a) + y * a
  const invlerp = (a, b, v) => clamp((v - a) / (b - a))
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

  let timerId = null
  let playheadPosition = 0
  let isPlaying = false
  let tempo = 120

  var knobPosition = -50

  let knobEngaged = false
  let previousY = null
  var min = 0
  var max = 100
  var step = 1

  const setKnob = (knob, min, max, value) => {
    const decimal = invlerp(min, max, value)
    const squashed = lerp(0, 300, decimal)
    knob.style.setProperty('--percentage', squashed)
  }

  function engageKnob(event) {
    knobEngaged = true
    previousY = event.clientY
    event.preventDefault()
    // console.log(engaged)
  }

  function disengageKnob() {
    knobEngaged = false
    // console.log(engaged)
  }

  // let inputValue = 0

  const rotaryMove = Y => {

    if (knobEngaged) {
      if (previousY - Y === 0) {
        return
      }
      const isGoingUp = previousY >= Y
      previousY = Y
      // console.log(isGoingUp + ' isGoingUp')

      // let diff = min < 0 ? min / -50 : max / 50
      // diff = diff < step ? step : diff
      // inputValue = Number(inputValue) + diff * (isGoingUp ? 1 : -1)

      // console.log(inputValue + ' input value')


      isGoingUp ? knobPosition++ : knobPosition--
      // console.log(Y)
      if (knobPosition <= -50 || knobPosition >= 230) {
        return
      }
      // console.log(inputValue + ' input value')

      // percentage = (value - min) / (max - min)

      console.log((knobPosition - 0) / (200 - 0) + ' knobPosition')

      testKnob.style = `--percentage:${knobPosition}`
    }
  }

  console.log(knobEngaged)
  // console.log(previousY)
  // console.log(inputValue)
  // console.log(step, min , max)



  const testKnob = document.createElement('button')
  testKnob.classList = 'knob'
  testKnob.innerText = 'test'
  testKnob.style = `--percentage:${knobPosition}`
  document.body.appendChild(testKnob)

  testKnob.addEventListener('mousedown', engageKnob)
  window.addEventListener('mouseup', disengageKnob)




  window.addEventListener('mousemove', event => {
    rotaryMove(event.clientY)
  })

















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
      // console.log(timerId)
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
    // console.log(playheadPosition + ' playheadPosition')
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
    console.log(newTempo)
    tempo = newTempo
  }

  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  stopButton.addEventListener('click', handleStop)
  clearGridButton.addEventListener('click', handleClearGrid)
  // tempoKnob.addEventListener('input', function () {
  //   tempo = this.value
  //   updateTempo(tempo)
  // })

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', toggleStepOnOff)
  }





}

window.addEventListener('DOMContentLoaded', init)