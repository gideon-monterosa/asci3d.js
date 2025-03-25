const ascii = document.querySelector("#ascii");

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

/**
 * @param {number} x
 * @param {number} y
 */
function createPoint2d(x, y) {
  return { x, y };
}

/**
 * @param {Point2D} p1
 * @param {Point2D} p2
 */
function drawLine(p1, p2, char = "#") {
  x0 = p1.x;
  x1 = p2.x;
  y0 = p1.y;
  y1 = p2.y;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (x0 >= 0 && x0 < width && y0 >= 0 && y0 < height) {
      buffer[y0][x0] = char;
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

/**
 * @param {Point2D} p1
 * @param {Point2D} p3
 */
function drawRectangle(p1, p3) {
  const p2 = createPoint2d(p1.x, p3.y);
  const p4 = createPoint2d(p3.x, p1.y);

  drawLine(p1, p2);
  drawLine(p2, p3);
  drawLine(p3, p4);
  drawLine(p4, p1);
}

initBuffer();

drawRectangle(createPoint2d(3, 3), createPoint2d(9, 9));

renderBuffer();
