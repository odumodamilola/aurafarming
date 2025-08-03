const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const asciiChars = "@%#*+=-:. "; // Dark to light

function imageToAscii(imagePath, width = 80) {
  return Jimp.read(imagePath).then((image) => {
    // Adjust height based on terminal character ratio
    const aspectRatio = 0.55;
    const height = Math.floor(image.bitmap.height * (width / image.bitmap.width) * aspectRatio);
    image.resize(width, height).greyscale();

    let ascii = "";
    for (let y = 0; y < image.bitmap.height; y++) {
      for (let x = 0; x < image.bitmap.width; x++) {
        const pixel = Jimp.intToRGBA(image.getPixelColor(x, y)).r;
        const char = asciiChars[Math.floor((pixel / 256) * asciiChars.length)];
        ascii += char;
      }
      ascii += "\n";
    }

    return ascii;
  });
}

async function playFrames() {
  const files = fs
    .readdirSync("./frames")
    .filter((file) => file.endsWith(".png"))
    .sort();

  for (const file of files) {
    const frame = await imageToAscii(path.join("frames", file));
    console.clear();
    console.log(frame);
    await new Promise((resolve) => setTimeout(resolve, 100)); // ~10 FPS
  }
}

playFrames();
