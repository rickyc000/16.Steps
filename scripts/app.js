function init() {
  console.log('Javascript is running')

  const tempoKnobWrapper = document.querySelector('.tempo-knob-wrapper')
  const bassFilterWrapper = document.querySelector('.bass-filter-knob-wrapper')
  const leadFilterWrapper = document.querySelector('.lead-filter-knob-wrapper')

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
  bassGainControl.gain.setValueAtTime(0.5, audioContext.currentTime)
  bassGainControl.connect(primaryGainControl)

  let leadMuted = false

  const leadFilter = audioContext.createBiquadFilter()
  leadFilter.type = 'lowpass'
  // leadFilter.frequency.value = 10
  leadFilter.Q.value = 10
  // leadFilter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.01)
  // leadFilter.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.06)
  leadFilter.connect(leadGainControl)

  const leadFilter2 = audioContext.createBiquadFilter()
  leadFilter2.type = 'bandpass'
  // leadFilter2.frequency.value = 100
  leadFilter2.Q.value = 1
  // leadFilter2.frequency.exponentialRampToValueAtTime(3000, audioContext.currentTime + 0.05)

  leadFilter2.connect(lead2GainControl)

  //* SYNTH 1
  function playLead(freq) {

    if (leadMuted === false) {

      const synthOscillator = audioContext.createOscillator()
      const synthOscillator2 = audioContext.createOscillator()

      synthOscillator.frequency.setValueAtTime(freq, 0)
      synthOscillator.type = 'sawtooth'
      synthOscillator.connect(leadFilter)
      synthOscillator.start()
      synthOscillator.stop(audioContext.currentTime + 0.1)

      synthOscillator2.frequency.setValueAtTime(freq, 0)
      synthOscillator2.type = 'square'
      synthOscillator2.connect(leadFilter2)
      synthOscillator2.start(audioContext.currentTime + 0.03)
      synthOscillator2.stop(audioContext.currentTime + 0.125)
    }
  }


  //* BASS SYNTH
  let bassMuted = false

  const bassFilter = audioContext.createBiquadFilter()
  bassFilter.type = 'lowpass'
  bassFilter.frequency.value = 1000
  bassFilter.frequency.exponentialRampToValueAtTime(10000, audioContext.currentTime + 0.001)
  bassFilter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.125)
  bassFilter.connect(bassGainControl)

  function playBass(freq) {

    if (bassMuted === false) {

      const synthOscillator = audioContext.createOscillator()

      // const bassFilter = audioContext.createBiquadFilter()
      // bassFilter.type = 'lowpass'
      // bassFilter.frequency.value = 1000
      // bassFilter.frequency.exponentialRampToValueAtTime(10000, audioContext.currentTime + 0.001)
      // bassFilter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.125)
      // bassFilter.connect(bassGainControl)

      synthOscillator.frequency.setValueAtTime(freq, 0)
      synthOscillator.type = 'sawtooth'
      synthOscillator.connect(bassFilter)
      synthOscillator.start()
      synthOscillator.stop(audioContext.currentTime + 0.2)
    }

  }
  let drumsMuted = false

  //* DRUMS

  function playDrums(note) {

    if (drumsMuted === false) {

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
  }

  let timerId = null
  let playheadPosition = 0
  let isPlaying = false
  let BPM = 135

  //* Timer
  function startTimer() {
    timerId = setTimeout(() => {
      movePlayhead()
      startTimer()
    }, (60000 / BPM) / 4)
  }



  const tempoKnob = document.createElement('button')
  const bassSynthFilterCutoffKnob = document.createElement('button')
  const leadSynthFilterCutoffKnob = document.createElement('button')


  //* Create knob function
  function createKnob(min, max, parameter, knob) {
    knob.classList = 'knob'
    let knobPosition = 0
    knob.style = `--percentage:${knobPosition}`

    let knobEngaged = false
    let previousY = null
    let knobPercentage = ((knobPosition + 50) / 290) * 100
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
        if (knobPosition <= -145 && isGoingUp === false ||
          knobPosition >= 145 && isGoingUp === true) {
          return
        }

        //* Determines the rate of knob movement
        isGoingUp ? knobPosition = knobPosition + 5 : knobPosition = knobPosition - 5

        //* Sets the knob position
        knob.style = `--percentage:${knobPosition}`

        //* Turns the value into a percentage
        knobPercentage = ((knobPosition + 145) / 290) * 100
        console.log(knobPercentage + '%')

        //* Turn this value into a range between 80 / 200
        value = (knobPercentage / 100 * range) + min

        if (parameter === 'tempo') {
          BPM = value
        }
        if (parameter === 'bassFilter') {
          bassFilter.frequency.exponentialRampToValueAtTime(value, audioContext.currentTime + 0.001)
        }
        if (parameter === 'leadFilter') {
          // console.log(value + 'value')
          leadFilter.frequency.value = value
          leadFilter2.frequency.value = value
          // leadFilter2.frequency.exponentialRampToValueAtTime(value, audioContext.currentTime + 0.05)
          // leadFilter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.01)
        }
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

  createKnob(80, 190, 'tempo', tempoKnob)
  tempoKnobWrapper.appendChild(tempoKnob)

  createKnob(10, 5000, 'bassFilter', bassSynthFilterCutoffKnob)
  bassFilterWrapper.appendChild(bassSynthFilterCutoffKnob)
  bassSynthFilterCutoffKnob.classList.add('filter-knob')

  createKnob(10, 5000, 'leadFilter', leadSynthFilterCutoffKnob)
  leadFilterWrapper.appendChild(leadSynthFilterCutoffKnob)
  leadSynthFilterCutoffKnob.classList.add('filter-knob', 'lead-filter')

  const note1display = document.querySelector('.note1')
  const note2display = document.querySelector('.note2')
  const note3display = document.querySelector('.note3')
  const note4display = document.querySelector('.note4')


  //* Notes
  const noteFrequencies = [
    //* Bass octave
    { name: 'C3', frequency: 130.81 },
    { name: 'C#3', frequency: 138.59 },
    { name: 'D3', frequency: 146.83 },
    { name: 'D#3', frequency: 155.56 },
    { name: 'E3', frequency: 164.81 },
    { name: 'F3', frequency: 174.61 },
    { name: 'F#3', frequency: 185.00 },
    { name: 'G3', frequency: 196.00 },
    { name: 'G#3', frequency: 207.65 },
    { name: 'A3', frequency: 220.00 },
    { name: 'A#3', frequency: 233.08 },
    { name: 'B3', frequency: 246.94 },

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

  // const leadNotes = [
  //   //* Lead octave
  //   { name: 'C4', frequency: 261.63 },
  //   { name: 'C#4', frequency: 277.18 },
  //   { name: 'D4', frequency: 293.66 },
  //   { name: 'D#4', frequency: 311.13 },
  //   { name: 'E4', frequency: 329.63 },
  //   { name: 'F4', frequency: 349.23 },
  //   { name: 'F#4', frequency: 369.99 },
  //   { name: 'G4', frequency: 392.0 },
  //   { name: 'G#4', frequency: 415.3 },
  //   { name: 'A4', frequency: 440.0 },
  //   { name: 'A#4', frequency: 466.16 },
  //   { name: 'B4', frequency: 493.88 }
  // ]


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

  function setChord(chord, instrument) {
    let note1 = null
    let note2 = null
    let note3 = null
    let note4 = null

    const bassChord = chord.map(noteName => {
      return `${noteName}3`
    })

    //* To transpose the notes from octave 3 to 4:
    const leadChord = chord.map(noteName => {
      // return noteName.replace('3', '4')
      return `${noteName}4`
    })

    if (instrument === 'bass') {
      note1 = noteFrequencies.filter(note => {
        return note.name === bassChord[0]
      })
      note2 = noteFrequencies.filter(note => {
        return note.name === bassChord[1]
      })
      note3 = noteFrequencies.filter(note => {
        return note.name === bassChord[2]
      })
      note4 = noteFrequencies.filter(note => {
        return note.name === bassChord[3]
      })
    }

    if (instrument === 'lead') {
      note1 = noteFrequencies.filter(note => {
        return note.name === leadChord[0]
      })
      note2 = noteFrequencies.filter(note => {
        return note.name === leadChord[1]
      })
      note3 = noteFrequencies.filter(note => {
        return note.name === leadChord[2]
      })
      note4 = noteFrequencies.filter(note => {
        return note.name === leadChord[3]
      })
    }


    return [note1[0], note2[0], note3[0], note4[0]]
  }


  const chords = [
    ['C', 'D', 'F', 'A'],
    ['C#', 'E', 'G#', 'A'],
    ['D', 'F', 'A', 'E'],
    ['G', 'B', 'D', 'E'],
    ['A#', 'D', 'E', 'F#'],
    ['G', 'B', 'D', 'F#'],
    ['A', 'C#', 'E', 'G#'],
    ['D', 'G', 'A#', 'C'],
    ['D', 'F#', 'A', 'B'],
    ['B', 'D', 'F#', 'A'],
    ['G#', 'B', 'D#', 'F#'],
    ['G', 'B', 'D', 'F#'],
    ['C', 'E', 'G', 'B'],
    ['B', 'D#', 'F#', 'A#'],
    ['G#', 'B', 'D#', 'F'],
    ['F#', 'A#', 'C#', 'D#'],
    ['C', 'F', 'G', 'A#'],
    ['A#', 'D#', 'F', 'G#']
  ]

  const noteColourThemes = ['violet', 'turquoise', 'violet', 'yellow', 'turquoise', 'violet', 'yellow']

  function updateNoteColours() {
    //* Changes the order of the colour scheme:
    noteColourThemes.unshift(noteColourThemes.pop())

    function noteDisplayUpdate(note, themeNumber) {
      note.classList.remove(noteColourThemes[0])
      note.classList.remove(noteColourThemes[1])
      note.classList.remove(noteColourThemes[2])
      note.classList.remove(noteColourThemes[3])
      note.classList.add(noteColourThemes[themeNumber])
    }

    noteDisplayUpdate(note1display, 2)
    noteDisplayUpdate(note2display, 3)
    noteDisplayUpdate(note3display, 1)
    noteDisplayUpdate(note4display, 0)
  }


  function setActiveChords() {
    const chordNumber = Math.floor(Math.random() * chords.length)
    // const chordNumber = 0
    activeBassChord = setChord(chords[chordNumber], 'bass')
    activeLeadChord = setChord(chords[chordNumber], 'lead')
    note1display.innerText = `${chords[chordNumber][0]}`
    note2display.innerText = `${chords[chordNumber][1]}`
    note3display.innerText = `${chords[chordNumber][2]}`
    note4display.innerText = `${chords[chordNumber][3]}`
  }
  setActiveChords()
  updateNoteColours()

  //* On click, randomly update active chord
  function handleChangeNotes() {
    setActiveChords()
    updateNoteColours()
  }

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
  const clearGridButton = document.querySelector('.clear-grid-button')
  const changeNotesButton = document.querySelector('.change-notes-button')
  const fourToTheFloorButton = document.querySelector('.four-to-the-floor-button')
  const newDrumPattern = document.querySelector('.new-drum-pattern')
  const offBeatHiHatButton = document.querySelector('.off-beat-hihat')
  const snareButton = document.querySelector('.snare-on-two-four')
  const clearDrumsButton = document.querySelector('.clear-drums')
  const clearLeadButton = document.querySelector('.clear-synth-1')
  const clearBassButton = document.querySelector('.clear-synth-2')
  const muteDrumsButton = document.querySelector('.mute-drums')
  const muteLeadButton = document.querySelector('.mute-synth-1')
  const muteBassButton = document.querySelector('.mute-synth-2')
  const leadChangePattern = document.querySelector('.new-lead-pattern')
  const bassChangePattern = document.querySelector('.new-bass-pattern')

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
      playButton.classList.add('playing')
    } else {
      handleStop()
    }
  }

  //* Stop sequence
  function handleStop() {
    clearInterval(timerId)
    playheadPosition = 0
    isPlaying = false
    playButton.innerText = 'Play'
    playButton.classList.remove('playing')
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

  const activeCells = []

  //* Turn a STEP on or off
  function toggleStepOnOff(event) {
    const cellID = event.target.id - 1
    if (cells[cellID].classList.contains('on')) {
      cells[cellID].classList.remove('on')
      
      const index = activeCells.indexOf(cellID)
      if (index > -1) {
        activeCells.splice(index, 1)
      }

    } else {
      cells[cellID].classList.add('on')
      activeCells.push(cellID) 
    }

    console.log(activeCells)
  }

  //* ROUTER SECTION
  function triggersSample() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains(`X${playheadPosition}`)
        && (cells[i].classList.contains('on'))) {
        const noteToPlay = cells[i].classList[0].slice(1) - 1
        if (cells[i].classList.contains('lead')) {
          playLead(activeLeadChord[noteToPlay].frequency)
        }
        if (cells[i].classList.contains('bass')) {
          playBass(activeBassChord[noteToPlay].frequency)
        }
        if (cells[i].classList.contains('drums')) {
          playDrums(drums[noteToPlay].name)
        }
      }
    }
  }

  //* Event listeners
  playButton.addEventListener('click', handlePlay)
  clearGridButton.addEventListener('click', handleClearGrid)
  changeNotesButton.addEventListener('click', handleChangeNotes)
  fourToTheFloorButton.addEventListener('click', handleFourFourKick)
  newDrumPattern.addEventListener('click', addRandomDrumPattern)
  offBeatHiHatButton.addEventListener('click', addOffBeatHiHat)
  snareButton.addEventListener('click', addSnareOnTwoFour)
  clearDrumsButton.addEventListener('click', clearInstrument)
  clearLeadButton.addEventListener('click', clearInstrument)
  clearBassButton.addEventListener('click', clearInstrument)
  muteDrumsButton.addEventListener('click', muteInstrument)
  muteLeadButton.addEventListener('click', muteInstrument)
  muteBassButton.addEventListener('click', muteInstrument)
  leadChangePattern.addEventListener('click', handleLeadChangePattern)
  bassChangePattern.addEventListener('click', handleBassChangePattern)

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', toggleStepOnOff)
  }


  //* Preset patterns
  const fourToTheFloor = [176, 180, 184, 188]
  const offBeatHiHat = [130, 134, 138, 142]
  const snareOnTwoFour = [164, 172]

  // const synth1Line = [1, 35, 37, 55, 41, 27, 13, 31, 65, 83, 101, 119, 105, 91, 77, 95]

  const drumsPresets = [
    [128, 130, 132, 133, 134, 136, 137, 138, 139, 140, 142, 143, 164, 172, 176, 179, 180, 182, 186, 188],
    [128, 132, 136, 139, 146, 152, 155, 174, 176, 180, 184, 187, 190, 191],
    [176, 128, 129, 130, 131, 164, 180, 184, 172, 188, 136, 137, 138, 139, 158, 142],
    [176, 128, 131, 132, 179, 180, 164, 183, 185, 184, 188, 172, 187, 135, 136, 137, 139, 138, 140, 158, 130],
    [176, 180, 184, 185, 188, 128, 129, 130, 132, 133, 134, 137, 138, 140, 141, 142, 136, 143],
    [128, 129, 130, 132, 133, 134, 137, 138, 140, 141, 142, 136, 143, 164, 172],
    [134, 141, 176, 168, 128, 130, 132, 136, 181, 184, 138, 142, 140, 139, 143, 156],
    [134, 141, 176, 128, 130, 132, 136, 138, 142, 140, 139, 143, 156, 164, 180, 172, 188, 184, 135],
    [134, 141, 176, 128, 130, 132, 136, 138, 142, 140, 139, 143, 156, 135, 179, 164, 180, 183, 184, 188, 172, 186, 131, 129],
    [141, 176, 142, 139, 143, 164, 183, 186, 172],
    [164, 172, 186, 128, 130, 132, 131, 140, 176],
    [128, 140, 176, 180, 185, 189, 184, 186, 190, 132, 136],
    [180, 185, 130, 134, 176, 164, 183, 172, 188, 186, 140, 131, 138, 137, 142]
  ]

  // const drumsUpdate = drumsPresets[1].map(cellNumber => {
  //   return cellNumber - 1
  // })

  // console.log(drumsUpdate)

  const leadPresets = [
    [48, 37, 20, 18, 40, 42, 29],
    [22, 3, 42, 27, 14],
    [16, 17, 18, 19, 39, 26, 27, 28, 29],
    [32, 33, 37, 38, 23, 43, 28, 10, 2],
    [1, 5, 8, 25, 42, 59],
    [32, 22, 28],
    [36, 5, 40, 9, 44, 13, 30],
    [48, 43, 29, 57, 20],
    [0, 1, 2, 3, 20, 37, 54],
    [48, 5, 33, 24, 30, 44],
    [0, 8, 44, 36, 37],
    [36, 30, 18, 54, 24, 42, 60],
    [18, 27, 20, 24],
    [48, 55, 60, 33, 35, 20, 22, 25, 40, 43, 14, 45]
  ]

  const bassPresets = [
    [106, 80, 99, 88, 93],
    [112, 98, 100, 120, 106, 108, 94],
    [80, 66, 68, 71, 106, 77, 111, 126],
    [112, 118, 90],
    [83, 118, 96],
    [64, 84, 72, 93, 75],
    [113, 99, 114, 84, 103, 88, 108, 93],
    [64, 66, 67, 72],
    [80, 86, 92],
    [98, 101, 90, 92],
    [98, 64, 70, 104]
  ]

  function presetPattern(cellsToAdd) {
    cellsToAdd.map(cell => {
      cells[cell].classList.add('on')
    })
  }

  //* Drum functions:
  function addOffBeatHiHat() {
    presetPattern(offBeatHiHat)
  }

  function addSnareOnTwoFour() {
    presetPattern(snareOnTwoFour)
  }

  function handleFourFourKick() {
    presetPattern(fourToTheFloor)
  }

  function addRandomDrumPattern() {
    clearCells('drums')
    //* Picks a random drum preset
    presetPattern(drumsPresets[Math.floor(Math.random() * drumsPresets.length)])

  }

  //* Clear a specific grid
  function clearInstrument(event) {
    const instrument = event.target.classList.value
    if (instrument === 'clear-drums') {
      clearCells('drums')
    }
    if (instrument === 'clear-synth-1') {
      clearCells('lead')
    }
    if (instrument === 'clear-synth-2') {
      clearCells('bass')
    }
  }

  function handleLeadChangePattern() {
    clearCells('lead')
    presetPattern(leadPresets[Math.floor(Math.random() * leadPresets.length)])
  }

  function handleBassChangePattern() {
    clearCells('bass')
    console.log('bass change')
    presetPattern(bassPresets[Math.floor(Math.random() * bassPresets.length)])
  }



  function instrumentClassUpdate(className, action, instrument) {

    if (action === 'add') {
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains(instrument)) {
          cells[i].classList.add(className)
        }
      }
    }

    if (action === 'remove') {
      console.log('this is running')
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains(instrument)) {
          cells[i].classList.remove(className)
        }
      }
    }
  }

  //* Mute an instrument
  function muteInstrument(event) {
    const instrument = event.target.classList.value

    if (instrument === 'mute-drums') {
      if (drumsMuted === false) {
        instrumentClassUpdate('muted', 'add', 'drums')
        drumsMuted = true
      } else {
        instrumentClassUpdate('muted', 'remove', 'drums')
        drumsMuted = false
      }
    }

    if (instrument === 'mute-synth-1') {
      if (leadMuted === false) {
        instrumentClassUpdate('muted', 'add', 'lead')
        leadMuted = true
      } else {
        instrumentClassUpdate('muted', 'remove', 'lead')
        leadMuted = false
      }
    }

    if (instrument === 'mute-synth-2') {
      if (bassMuted === false) {
        instrumentClassUpdate('muted', 'add', 'bass')
        bassMuted = true
      } else {
        instrumentClassUpdate('muted', 'remove', 'bass')
        bassMuted = false
      }
    }
  }

//   presetPattern(synth1Line)
}


window.addEventListener('DOMContentLoaded', init)