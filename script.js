const ascii = document.querySelector("#ascii");

const width = 320;
const height = 90;

let buffer = [];
const distance = 200;

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
  const y2d = height / 2 - p.y * scale * 0.5;

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
 * @param {Point3D} p
 * @param {Point3D} center
 * @param {number} angle
 * @returns {Point3D}
 */
function rotateAroundCenter(p, center, angle) {
  const translated = createPoint3d(
    p.x - center.x,
    p.y - center.y,
    p.z - center.z,
  );

  const rotated = rotateY(translated, angle);

  return createPoint3d(
    rotated.x + center.x,
    rotated.y + center.y,
    rotated.z + center.z,
  );
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

  const center = createPoint3d((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);

  const p2 = createPoint3d(x2, y1, z1);
  const p3 = createPoint3d(x2, y2, z1);
  const p4 = createPoint3d(x1, y2, z1);
  const p5 = createPoint3d(x1, y1, z2);
  const p6 = createPoint3d(x2, y1, z2);
  const p8 = createPoint3d(x1, y2, z2);

  const corners = [p1, p2, p3, p4, p5, p6, p7, p8].map((pt) =>
    rotateAroundCenter(pt, center, angle),
  );

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

/**
 * @param {Point3D} p1
 * @param {Point3D} p3
 * @param {Point3D} top
 * @param {number} angle
 */
function drawPyramid(p1, p3, top, angle) {
  const p2 = createPoint3d(p3.x, p1.y, p1.z);
  const p4 = createPoint3d(p1.x, p1.y, p3.z);

  const baseCenter = createPoint3d((p1.x + p3.x) / 2, p1.y, (p1.z + p3.z) / 2);

  const center = createPoint3d(
    (baseCenter.x + top.x) / 2,
    (baseCenter.y + top.y) / 2,
    (baseCenter.z + top.z) / 2,
  );

  const corners = [p1, p2, p3, p4, top].map((pt) =>
    rotateAroundCenter(pt, center, angle),
  );

  const projectedPoints = corners.map((p) => projectPoint(p, distance));

  const [pp1, pp2, pp3, pp4, ppTop] = projectedPoints;

  drawLine(pp1, pp2);
  drawLine(pp2, pp3);
  drawLine(pp3, pp4);
  drawLine(pp4, pp1);

  drawLine(pp1, ppTop);
  drawLine(pp2, ppTop);
  drawLine(pp3, ppTop);
  drawLine(pp4, ppTop);
}

let angle = 0;
function animate() {
  initBuffer();

  drawCuboid(createPoint3d(-100, -35, -35), createPoint3d(-30, 35, 35), angle);

  drawPyramid(
    createPoint3d(30, -35, -35),
    createPoint3d(100, -35, 35),
    createPoint3d(65, 35, 0),
    angle,
  );

  renderBuffer();

  angle += 1;
  requestAnimationFrame(animate);
}

animate();
