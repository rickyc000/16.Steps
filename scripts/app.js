function init() {
  console.log('Javascript is running')


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



}

window.addEventListener('DOMContentLoaded', init)