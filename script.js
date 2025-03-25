const ascii = document.querySelector("#ascii");

const asciiChars = [" ", ".", "-", "+", "*", "#", "%", "@"];

const width = 100;
const height = 35;

let asciiText = "";

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const randomIndex = Math.floor(Math.random() * asciiChars.length);
    asciiText += asciiChars[randomIndex];
  }
  asciiText += "\n";
}

ascii.innerText = asciiText;
