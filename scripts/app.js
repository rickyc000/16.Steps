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

  const now = audioContext.currentTime
  console.log(now)


  const primaryGainControl = audioContext.createGain()
  primaryGainControl.gain.setValueAtTime(1, 0)
  primaryGainControl.connect(audioContext.destination)

  const kickGainControl = audioContext.createGain()
  kickGainControl.gain.setValueAtTime(1, audioContext.currentTime)
  kickGainControl.connect(audioContext.destination)

  const kickFilter = audioContext.createBiquadFilter()
  kickFilter.type = 'lowpass'
  kickFilter.frequency.value = 500
  kickFilter.connect(kickGainControl)

  const snareGainControl = audioContext.createGain()
  snareGainControl.gain.setValueAtTime(1, audioContext.currentTime)
  snareGainControl.connect(audioContext.destination)

  const snareFilter = audioContext.createBiquadFilter()
  snareFilter.type = 'highpass'
  snareFilter.frequency.value = 1000
  snareFilter.connect(primaryGainControl)

  const hatFilter = audioContext.createBiquadFilter()
  hatFilter.type = 'highpass'
  hatFilter.frequency.value = 3000
  hatFilter.connect(primaryGainControl)

  const clapFilter = audioContext.createBiquadFilter()
  clapFilter.type = 'lowpass'
  clapFilter.frequency.setValueAtTime(2000, audioContext.currentTime)
  clapFilter.connect(primaryGainControl)

  const leadGainControl = audioContext.createGain()
  leadGainControl.gain.setValueAtTime(0.002, audioContext.currentTime)
  leadGainControl.connect(audioContext.destination)

  const lead2GainControl = audioContext.createGain()
  // leadGainControl.gain.setValueAtTime(0.9, audioContext.currentTime)
  leadGainControl.gain.setValueAtTime(0.6, audioContext.currentTime + 0.19)
  // lead2GainControl.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.2)
  lead2GainControl.connect(audioContext.destination)
  



  function playLead(freq) {
    const synthOscillator = audioContext.createOscillator()
    const synthOscillator2 = audioContext.createOscillator()

    const leadFilter = audioContext.createBiquadFilter()
    leadFilter.type = 'lowpass'
    leadFilter.frequency.value = 10
    // console.log(leadFilter.frequency)
    leadFilter.Q.value = 20
    leadFilter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.04)
    leadFilter.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.05)
    leadFilter.connect(leadGainControl)

    synthOscillator.frequency.setValueAtTime(freq, 0)
    synthOscillator.type = 'sawtooth'
    synthOscillator.connect(leadFilter)
    synthOscillator.start()
    synthOscillator.stop(audioContext.currentTime + 0.15)



    const leadFilter2 = audioContext.createBiquadFilter()
    leadFilter2.type = 'bandpass'
    leadFilter2.frequency.value = 100
    // console.log(leadFilter.frequency)
    leadFilter2.Q.value = 1
    leadFilter2.frequency.exponentialRampToValueAtTime(10000, audioContext.currentTime + 0.3)
    leadFilter2.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.12)
    leadFilter2.connect(lead2GainControl)

    synthOscillator2.frequency.setValueAtTime(freq, 0)
    synthOscillator2.type = 'square'
    synthOscillator2.connect(leadFilter2)
    synthOscillator2.start(audioContext.currentTime + 0.1)
    synthOscillator2.stop(audioContext.currentTime + 0.35)







  }

  // function playBass(freq) {
  //   const synthOscillator = audioContext.createOscillator()
  //   // synthOscillator.frequency.exponentialRampToValueAtTime(
  //   //   400,
  //   //   audioContext.currentTime + 0.2
  //   // )
  //   synthOscillator.frequency.setValueAtTime(freq, 0)
  //   synthOscillator.type = 'sine'
  //   synthOscillator.connect(snareFilter)
  //   synthOscillator.start()
  //   synthOscillator.stop(audioContext.currentTime + 0.1)
  // }

  function playDrums(note) {

    if (note === 'kick') {
      const synthOscillator = audioContext.createOscillator()
      synthOscillator.frequency.exponentialRampToValueAtTime(
        0.2,
        audioContext.currentTime + 0.2
      )
      synthOscillator.type = 'sine'
      synthOscillator.connect(kickFilter)
      synthOscillator.start()
      synthOscillator.stop(audioContext.currentTime + 0.5)
    }

    if (note === 'snare') {
      const lowTone = audioContext.createOscillator()
      lowTone.type = 'triangle'
      lowTone.frequency.value = 100

      const hiTone = audioContext.createOscillator()
      hiTone.type = 'triangle'
      hiTone.frequency.value = 300

      const whiteNoiseSource = audioContext.createBufferSource()
      whiteNoiseSource.buffer = buffer

      lowTone.connect(snareFilter)
      hiTone.connect(snareFilter)
      whiteNoiseSource.connect(snareFilter)

      lowTone.start(audioContext.currentTime)
      lowTone.stop(audioContext.currentTime + 0.1)

      hiTone.start(audioContext.currentTime)
      hiTone.stop(audioContext.currentTime + 0.07)

      whiteNoiseSource.start()
      whiteNoiseSource.stop(audioContext.currentTime + 0.1)
    }

    if (note === 'hihat') {
      const whiteNoiseSource = audioContext.createBufferSource()
      whiteNoiseSource.buffer = buffer

      whiteNoiseSource.connect(hatFilter)

      whiteNoiseSource.start()
      whiteNoiseSource.stop(audioContext.currentTime + 0.01)
    }

    if (note === 'clap') {

      const hiTone = audioContext.createOscillator()
      hiTone.type = 'sawtooth'
      hiTone.frequency.value = 300

      hiTone.start(audioContext.currentTime)
      hiTone.stop(audioContext.currentTime + 0.07)
      hiTone.connect(snareFilter)

      const whiteNoiseSource = audioContext.createBufferSource()
      whiteNoiseSource.buffer = buffer

      whiteNoiseSource.connect(clapFilter)

      whiteNoiseSource.start()
      whiteNoiseSource.stop(audioContext.currentTime + 0.1)
    }
  }




  let timerId = null
  let playheadPosition = 0
  let isPlaying = false



  let BPM = createKnob(80, 200, 80, 'Tempo')

  //* Timer
  function startTimer() {
    timerId = setTimeout(() => {
      movePlayhead()
      startTimer()
    }, (60000 / BPM) / 4)
  }

  // //* Update knob value
  function updateTempo(newBPM) {
    console.log(newBPM + ' newBPM')
    BPM = newBPM
  }

  //* CREATE KNOB FUNCTION

  function createKnob(min, max, defaultValue, knobName) {
    const knob = document.createElement('button')
    knob.classList = 'knob'
    knob.innerText = `${knobName}`
    let knobPosition = defaultValue
    knob.style = `--percentage:${knobPosition}`
    document.body.appendChild(knob)


    let knobEngaged = false
    let previousY = null
    let knobPercentage = ((knobPosition + 50) / 280) * 100

    const range = max - min

    let value = (knobPercentage / 100 * range) + min

    //* Engages when clicked
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
        knob.style = `--percentage:${knobPosition}`

        //* Turns the value into a percentage
        knobPercentage = ((knobPosition + 50) / 280) * 100
        console.log(knobPercentage + '%')

        //* Turn this value into a range between 80 / 200
        value = (knobPercentage / 100 * range) + min
        updateTempo(value)
      }
    }

    knob.addEventListener('mousedown', engageKnob)
    window.addEventListener('mouseup', disengageKnob)

    window.addEventListener('mousemove', event => {
      rotaryMove(event.clientY)
    })
    return value
  }

  //* END OF CREATE KNOB FUNCTION






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
    { name: 'B', frequency: 493.88 },
    { name: 'C', frequency: 523.25 }
  ]

  const selectNotes = [
    { name: 'C', frequency: 261.63 },

    { name: 'D', frequency: 293.66 },

    { name: 'E', frequency: 329.63 },
    { name: 'F', frequency: 349.23 },

    // { name: 'G', frequency: 392.0 },
    // { name: 'G#', frequency: 415.3 },
    // { name: 'A', frequency: 440.0 },
    // { name: 'A#', frequency: 466.16 },
    // { name: 'B', frequency: 493.88 },
    // { name: 'C', frequency: 523.25 }
  ]

  //* Drums
  const drums = [
    { name: 'hihat' },
    { name: 'clap' },
    { name: 'snare' },
    { name: 'kick' }
  ]

  //* Grid variables
  const grid = document.querySelector('.grid')
  const steps = 16
  const channels = 4
  const cells = []

  // * Creating the grid:
  function createGrid(instrumentName, channel) {
    for (let row = 1; row <= channels; row++) {
      for (let column = 1; column <= steps; column++) {
        const cell = document.createElement('div')
        cell.classList = `Y${row} X${column} ${instrumentName}`
        cell.id = `${((row - 1) * steps + column) + ((channel - 1) * 16 * 4)}`
        grid.appendChild(cell)
        cells.push(cell)
      }
    }
  }
  createGrid('lead', 1)
  createGrid('bass', 2)
  createGrid('drums', 3)


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
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove('on')
    }
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

  //* ROUTER SECTION
  function triggersSample() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains(`X${playheadPosition}`)
        && (cells[i].classList.contains('on'))) {
        const noteToPlay = cells[i].classList[0].slice(1) - 1


        if (cells[i].classList.contains('lead')) {
          playLead(selectNotes[noteToPlay].frequency)
        }

        // if (cells[i].classList.contains('bass')) {
        //   playBass(notes[noteToPlay].frequency)
        //   console.log('play bass')
        // }


        if (cells[i].classList.contains('drums')) {
          playDrums(drums[noteToPlay].name)
        }


      }
    }
  }




  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  stopButton.addEventListener('click', handleStop)
  clearGridButton.addEventListener('click', handleClearGrid)

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', toggleStepOnOff)
  }


  function presetPattern() {
    // cells[176].classList.add('on')
    // cells[180].classList.add('on')
    // cells[184].classList.add('on')
    // cells[188].classList.add('on')

    // cells[1].classList.add('on')
    cells[16].classList.add('on')
    cells[24].classList.add('on')
    cells[58].classList.add('on')

    cells[30].classList.add('on')
    cells[29].classList.add('on')
    // cells[17].classList.add('on')
    cells[20].classList.add('on')
  }
  presetPattern()

}

window.addEventListener('DOMContentLoaded', init)