const ascii = document.querySelector("#ascii");

const width = 320;
const height = 90;

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
 * @returns {Point2D}
 */
function createPoint2d(x, y) {
  return { x, y };
}

/**
 * @typedef {Object} Point3D
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @param {number} x
 * @param {number} y
 * @returns {Point3D}
 */
function createPoint3d(x, y, z) {
  return { x, y, z };
}

/**
 * @param {Point3D} p
 * @param {number} distance
 * @returns {Point2D}
 */
function projectPoint(p, distance) {
  const scale = distance / (p.z + distance);
  const x2d = width / 2 + p.x * scale;
  const y2d = height / 2 + p.y * scale;

  return createPoint2d(Math.round(x2d), Math.round(y2d));
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
 * @param {Point3D} p
 * @param {number} angle
 * @returns {Point3D}
 */
function rotateY(p, angle) {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const x = p.x * cos - p.z * sin;
  const z = p.x * sin + p.z * cos;
  return createPoint3d(x, p.y, z);
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

/**
 * @param {Point3D} p1
 * @param {Point3D} p7
 * @param {number} angle
 */
function drawCuboid(p1, p7, angle) {
  const x1 = p1.x,
    y1 = p1.y,
    z1 = p1.z,
    x2 = p7.x,
    y2 = p7.y,
    z2 = p7.z;

  const p2 = createPoint3d(x2, y1, z1);
  const p3 = createPoint3d(x2, y2, z1);
  const p4 = createPoint3d(x1, y2, z1);
  const p5 = createPoint3d(x1, y1, z2);
  const p6 = createPoint3d(x2, y1, z2);
  const p8 = createPoint3d(x1, y2, z2);

  const corners = [p1, p2, p3, p4, p5, p6, p7, p8].map((pt) =>
    rotateY(pt, angle),
  );

  const distance = 100;
  const pp = corners.map((p) => projectPoint(p, distance));
  const [pp1, pp2, pp3, pp4, pp5, pp6, pp7, pp8] = pp;

  drawLine(pp1, pp2);
  drawLine(pp2, pp3);
  drawLine(pp3, pp4);
  drawLine(pp4, pp1);
  drawLine(pp5, pp6);
  drawLine(pp6, pp7);
  drawLine(pp7, pp8);
  drawLine(pp8, pp5);
  drawLine(pp1, pp5);
  drawLine(pp2, pp6);
  drawLine(pp3, pp7);
  drawLine(pp4, pp8);
}

let angle = 0;
function animate() {
  initBuffer();

  drawCuboid(createPoint3d(-25, -17, -25), createPoint3d(25, 17, 25), angle);

  renderBuffer();

  angle += 1;
  requestAnimationFrame(animate);
}

animate();
