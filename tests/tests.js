function assertEquals(expected, actuel) {
  if (expected !== actuel) {
    throw new Error(`Expected ${expected}, got ${actuel}`);
  }
}

function assertObjectEquals(expected, actual) {
  const expectedStr = JSON.stringify(expected);
  const actualStr = JSON.stringify(actual);
  if (expectedStr !== actualStr) {
    throw new Error(`Expected ${expectedStr}, got ${actualStr}`);
  }
}

function assertApproxEquals(expected, actual, epsilon = 0.001) {
  if (Math.abs(expected - actual) > epsilon) {
    throw new Error(`Expected approximately ${expected}, got ${actual}`);
  }
}

function generateTestReport() {
  const element = document.querySelector("#report");
  if (!element) return;

  const tests = [
    // Point creation tests
    {
      name: "createPoint2d test",
      run: () => {
        const point = createPoint2d(10, 20);
        assertObjectEquals({ x: 10, y: 20 }, point);
      },
    },
    {
      name: "createPoint3d test",
      run: () => {
        const point = createPoint3d(10, 20, 30);
        assertObjectEquals({ x: 10, y: 20, z: 30 }, point);
      },
    },

    // Projection test
    {
      name: "projectPoint test - point at origin",
      run: () => {
        const point3d = window.createPoint3d(0, 0, 0);
        const distance = 200;
        const result = window.projectPoint(point3d, distance);

        // Should project to the center of the screen
        assertEquals(Math.floor(window.width / 2), result.x);
        assertEquals(Math.floor(window.height / 2), result.y);
      },
    },

    // Rotation tests
    {
      name: "rotateY test - 90 degrees",
      run: () => {
        const point = window.createPoint3d(100, 0, 0);
        const rotated = window.rotateY(point, 90);

        // After 90 degree Y rotation, x should be ~0 and z should be ~100
        assertApproxEquals(0, rotated.x, 0.1);
        assertEquals(0, rotated.y); // Y shouldn't change
        assertApproxEquals(100, rotated.z, 0.1);
      },
    },
    {
      name: "rotateY test - 180 degrees",
      run: () => {
        const point = window.createPoint3d(100, 20, 50);
        const rotated = window.rotateY(point, 180);

        // After 180 degree Y rotation, x and z should be negated
        assertApproxEquals(-100, rotated.x, 0.1);
        assertEquals(20, rotated.y); // Y shouldn't change
        assertApproxEquals(-50, rotated.z, 0.1);
      },
    },

    // Rotation around center tests
    {
      name: "rotateAroundCenter test",
      run: () => {
        const point = window.createPoint3d(10, 0, 0);
        const center = window.createPoint3d(0, 0, 0);
        const rotated = window.rotateAroundCenter(point, center, 180);

        // After 180 degree rotation around origin, x should be negated
        assertApproxEquals(-10, rotated.x, 0.1);
        assertEquals(0, rotated.y);
        assertApproxEquals(0, rotated.z, 0.1);
      },
    },
    {
      name: "rotateAroundCenter test - non-origin center",
      run: () => {
        const point = window.createPoint3d(20, 10, 0);
        const center = window.createPoint3d(10, 10, 0);
        const rotated = window.rotateAroundCenter(point, center, 180);

        // Point is 10 units to the right of center
        // After 180 degrees, it should be 10 units to the left
        assertApproxEquals(0, rotated.x, 0.1);
        assertEquals(10, rotated.y);
        assertApproxEquals(0, rotated.z, 0.1);
      },
    },

    // Buffer tests
    {
      name: "initBuffer test",
      run: () => {
        window.initBuffer();
        assertEquals(window.height, window.buffer.length);
        assertEquals(window.width, window.buffer[0].length);
        assertEquals(" ", window.buffer[0][0]);
      },
    },

    // Line drawing test
    {
      name: "drawLine test - horizontal",
      run: () => {
        window.initBuffer();
        const p1 = window.createPoint2d(5, 5);
        const p2 = window.createPoint2d(10, 5);
        window.drawLine(p1, p2, "#");

        // Check that pixels along the line are set
        for (let x = 5; x <= 10; x++) {
          assertEquals("#", window.buffer[5][x]);
        }
      },
    },
  ];

  let passed = 0;
  let failed = 0;
  const results = tests.map((test) => {
    try {
      test.run();
      passed++;
      return `<li style="color: green;">✅ ${test.name}</li>`;
    } catch (e) {
      failed++;
      return `<li style="color: red;">❌ ${test.name}: ${e.message}</li>`;
    }
  });

  element.innerHTML = `
    <h2>Test Report</h2>
    <p>✅ Passed: ${passed}</p>
    <p>❌ Failed: ${failed}</p>
    <p>🔍 Details:</p>
    <ul>${results.join("")}</ul>
  `;
}
