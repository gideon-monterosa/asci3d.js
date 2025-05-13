function assertEquals(expected, actuel) {
  if (expected !== actuel) {
    throw new Error(`Expected ${expected}, got ${actuel}`);
  }
}

function generateTestReport() {
  const element = document.querySelector("#report");
  if (!element) return;

  const tests = [
    {
      name: "Addition test",
      run: () => {
        const result = 1 + 1;
        assertEquals(2, result);
      },
    },
    {
      name: "Array length test",
      run: () => {
        const arr = [1, 2, 3];
        assertEquals(3, arr.length);
      },
    },
    {
      name: "Failing test example",
      run: () => {
        const value = "hello";
        assertEquals("world", value);
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
