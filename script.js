const ascii = document.querySelector("#ascii");

// const asciiChars = [" ", ".", "-", "+", "*", "#", "%", "@"];

const width = 100;
const height = 35;

let buffer = [];

function initBuffer() {
  buffer = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(" ");
    }
    buffer.push(row);
  }
}

function renderBuffer() {
  let asciiText = "";
  for (let y = 0; y < height; y++) {
    asciiText += buffer[y].join("") + "\n";
  }
  ascii.innerText = asciiText;
}

/**
 * @typedef {Object} Point2D
 * @property {number} x
 * @property {number} y
 */

function createPoint2d(x, y) {
  return { x, y };
}

/**
 * @param {Point2D} p1
 * @param {Point2D} p2
 */
function drawLine(p1, p2) {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const sx = p1.x < p2.x ? 1 : -1;
  const sy = p1.y < p2.y ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (p1.x >= 0 && p1.x < width && p1.y >= 0 && p1.y < height) {
      buffer[p1.y][p1.x] = "#";
    }
    if (p1.x === p2.x && p1.y === p2.y) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      p1.x += sx;
    }
    if (e2 < dx) {
      err += dx;
      p1.y += sy;
    }
  }
}

initBuffer();

drawLine(createPoint2d(3, 3), createPoint2d(9, 9));

renderBuffer();
