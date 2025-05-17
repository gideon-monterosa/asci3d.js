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
