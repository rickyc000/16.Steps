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
  leadGainControl.gain.value = 0.3
  leadGainControl.connect(primaryGainControl)

  const lead2GainControl = audioContext.createGain()
  lead2GainControl.gain.setValueAtTime(0.3, audioContext.currentTime)
  lead2GainControl.connect(primaryGainControl)

  const bassGainControl = audioContext.createGain()
  bassGainControl.gain.setValueAtTime(0.7, audioContext.currentTime)
  bassGainControl.connect(primaryGainControl)





  //* SYNTH 1
  function playLead(freq) {
    const synthOscillator = audioContext.createOscillator()
    const synthOscillator2 = audioContext.createOscillator()

    //* OSC 1
    const leadFilter = audioContext.createBiquadFilter()
    leadFilter.type = 'lowpass'
    leadFilter.frequency.value = 10
    leadFilter.Q.value = 20
    leadFilter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.01)
    // leadFilter.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.06)
    leadFilter.connect(leadGainControl)

    synthOscillator.frequency.setValueAtTime(freq, 0)
    synthOscillator.type = 'sawtooth'
    synthOscillator.connect(leadFilter)
    synthOscillator.start()
    synthOscillator.stop(audioContext.currentTime + 0.1)


    //* OSC 2
    const leadFilter2 = audioContext.createBiquadFilter()
    leadFilter2.type = 'bandpass'
    leadFilter2.frequency.value = 100
    leadFilter2.Q.value = 1
    leadFilter2.frequency.exponentialRampToValueAtTime(3000, audioContext.currentTime + 0.05)
    // leadFilter2.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.025)
    leadFilter2.connect(lead2GainControl)

    synthOscillator2.frequency.setValueAtTime(freq, 0)
    synthOscillator2.type = 'square'
    synthOscillator2.connect(leadFilter2)
    synthOscillator2.start(audioContext.currentTime + 0.03)
    synthOscillator2.stop(audioContext.currentTime + 0.125)
  }

  function playBass(freq) {
    const synthOscillator = audioContext.createOscillator()

    // const distortion = audioContext.createWaveShaper()

    const bassFilter = audioContext.createBiquadFilter()
    bassFilter.type = 'lowpass'
    bassFilter.frequency.value = 1000
    bassFilter.frequency.exponentialRampToValueAtTime(10000, audioContext.currentTime + 0.001)
    bassFilter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.125)
    bassFilter.connect(bassGainControl)


    synthOscillator.frequency.setValueAtTime(freq, 0)
    synthOscillator.type = 'sawtooth'
    synthOscillator.connect(bassFilter)
    synthOscillator.start()
    synthOscillator.stop(audioContext.currentTime + 0.2)
  }

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
  const bassNotes = [
    //* Bass octave
    { name: 'C3', frequency: 130.81 },
    { name: 'C#3', frequency: 277.18 },
    { name: 'D3', frequency: 293.66 },
    { name: 'D#3', frequency: 311.13 },
    { name: 'E3', frequency: 329.63 },
    { name: 'F3', frequency: 349.23 },
    { name: 'F#3', frequency: 369.99 },
    { name: 'G3', frequency: 392.0 },
    { name: 'G#3', frequency: 415.3 },
    { name: 'A3', frequency: 440.0 },
    { name: 'A#3', frequency: 466.16 },
    { name: 'B3', frequency: 493.88 }
  ]

  const leadNotes = [
    //* Lead octave
    { name: 'C4', frequency: 261.63 },
    { name: 'C#4', frequency: 277.18 },
    { name: 'D4', frequency: 293.66 },
    { name: 'D#4', frequency: 311.13 },
    { name: 'E4', frequency: 329.63 },
    { name: 'F4', frequency: 349.23 },
    { name: 'F#4', frequency: 369.99 },
    { name: 'G4', frequency: 392.0 },
    { name: 'G#4', frequency: 415.3 },
    { name: 'A4', frequency: 440.0 },
    { name: 'A#4', frequency: 466.16 },
    { name: 'B4', frequency: 493.88 }
  ]


  let activeLeadChord = {
    note1: null,
    note2: null,
    note3: null,
    note4: null,
  }

  let activeBassChord = {
    note1: null,
    note2: null,
    note3: null,
    note4: null,
  }


  function setChord(chord, notes) {

    const note1 = notes.filter(note => {
      return note.name === chord[0]
    })
    const note2 = notes.filter(note => {
      return note.name === chord[1]
    })
    const note3 = notes.filter(note => {
      return note.name === chord[2]
    })
    const note4 = notes.filter(note => {
      return note.name === chord[3]
    })

    return [note1[0], note2[0], note3[0], note4[0]]
  }


  const bassChords = [
    ['C3', 'D3', 'F3', 'A3'],
    ['D3', 'B3', 'F#3', 'G3'],
    ['B3', 'A3', 'F#3', 'C#3']
  ]

  const leadChords = [
    ['C4', 'D4', 'F4', 'A4'],
    ['D4', 'B4', 'F#4', 'G4'],
    ['B4', 'A4', 'F#4', 'C#4']
  ]

  function setActiveChords() {
    const chordNumber = Math.floor(Math.random() * bassChords.length)
    activeBassChord = setChord(bassChords[chordNumber], bassNotes)
    activeLeadChord = setChord(leadChords[chordNumber], leadNotes)
  }
  setActiveChords()

  //* On click, randomly update active chord
  function handleChangeNotes() {
    console.log('change')
    setActiveChords()
  }

  // setChord(chords[Math.floor(Math.random() * chords.length)], leadNotes)

  console.log(activeLeadChord, activeBassChord)


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
  const changeNotesButton = document.querySelector('.change-notes-button')
  const fourToTheFloorButton = document.querySelector('.four-to-the-floor-button')
  const newDrumPattern = document.querySelector('.new-drum-pattern')


  //* Play sequence
  function handlePlay() {
    if (isPlaying === false) {
      console.log('play!')
      playheadPosition = 1
      updateCells()
      triggersSample()
      startTimer()
      isPlaying = true
      playButton.innerText = 'Stop'
    } else {
      handleStop()
    }
  }

  //* Stop sequence
  function handleStop() {
    console.log('stop!')
    clearInterval(timerId)
    playheadPosition = 0
    isPlaying = false
    playButton.innerText = 'Play'
    updateCells()
  }

  //* Clear grid
  function handleClearGrid() {
    clearCells('all')
  }

  //* Clear cells
  function clearCells(section) {
    for (let i = 0; i < cells.length; i++) {
      if (section === 'all') {
        cells[i].classList.remove('on')
      }
      if (section === 'drums') {
        if (cells[i].classList.contains('drums')) {
          cells[i].classList.remove('on')
        }
      }
      if (section === 'lead') {
        if (cells[i].classList.contains('lead')) {
          cells[i].classList.remove('on')
        }
      }
      if (section === 'bass') {
        if (cells[i].classList.contains('bass')) {
          cells[i].classList.remove('on')
        }
      }
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
          playLead(activeLeadChord[noteToPlay].frequency)
          console.log(activeLeadChord[noteToPlay].name)
        }

        if (cells[i].classList.contains('bass')) {
          playBass(activeBassChord[noteToPlay].frequency)
          console.log(activeBassChord[noteToPlay].name)
        }

        if (cells[i].classList.contains('drums')) {
          playDrums(drums[noteToPlay].name)
        }

      }
    }
  }




  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  // stopButton.addEventListener('click', handleStop)
  clearGridButton.addEventListener('click', handleClearGrid)
  changeNotesButton.addEventListener('click', handleChangeNotes)
  fourToTheFloorButton.addEventListener('click', handleFourFourKick)
  newDrumPattern.addEventListener('click', addRandomDrumPattern)

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', toggleStepOnOff)
  }


  //* Preset patterns
  const fourToTheFloor = [176, 180, 184, 188]

  const drumsPresets = [
    [174, 183, 189, 184, 176, 180, 184, 188],
    [129, 187, 190, 184, 180, 170, 184, 188],
    [130, 183, 189, 184, 176, 160, 181, 188],
    [134, 183, 189, 184, 191, 165, 182, 190]
  ]



  function presetPattern(cellsToAdd) {
    cellsToAdd.map(cell => {
      cells[cell].classList.add('on')
    })
  }

  function addRandomDrumPattern() {
    console.log('random drums')
    clearCells('drums')

    //* Picks a random drum preset
    presetPattern(drumsPresets[Math.floor(Math.random() * drumsPresets.length)])

  }


  function handleFourFourKick() {
    clearCells('drums')
    presetPattern(fourToTheFloor)
  }




}

window.addEventListener('DOMContentLoaded', init)