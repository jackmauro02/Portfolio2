let img;
let canvasWidth = 1200;
let canvasHeight = 900;
let shapeOptions = ['triangle', 'square', 'circle'];
let sizeRangeInput;
let randomizeSizeCheckbox;
let fillCheckbox; 
let shapes = [];
let outline;
let backgroundColorInput;
let backgroundImageCheckbox;

function setup() { // This setup will recieve all the details I need from my html page
  let canvas = createCanvas(canvasWidth, canvasHeight);
  img = loadImage('image.jpg', imageLoaded); // Load the image immediately

  let imageInput = document.getElementById('imageInput');
  imageInput.addEventListener('change', handleImage);

  let startButton = document.getElementById('startButton');
  startButton.addEventListener('click', drawShapes);

  sizeRangeInput = document.getElementById('sizeRange');

  colourRangeInput = document.getElementById('colourVariation');
  
  randomizeSizeCheckbox = document.getElementById('randomizeSize');
  rotationCheckbox = document.getElementById('rotation');
  outlinesCheckbox = document.getElementById('outlines');
  
  fillCheckbox = document.getElementById('fill');

  let saveButton = document.getElementById('download');
  saveButton.addEventListener('click', saveAsImage);

  backgroundColorInput = document.getElementById('backgroundColor');
  backgroundImageCheckbox = document.getElementById('backgroundImage');
}

function handleImage(e) { // Dislays image before generation
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function(event) {
      img = loadImage(event.target.result, imageLoaded);
    }
    reader.readAsDataURL(file);
  }
}

function imageLoaded() {
  let aspectRatio = img.width / img.height;

  if (img.width > canvasWidth || img.height > canvasHeight) {
    if (aspectRatio > 1) {
      img.resize(canvasWidth, canvasWidth / aspectRatio);
    } else {
      img.resize(canvasHeight * aspectRatio, canvasHeight);
    }
  }

  resizeCanvas(img.width, img.height);

  image(img, 0, 0);
}



function drawShapes() { // This is the function for actually sketching the shapes over the image
  if (img) {
    
    if (fillCheckbox.checked){ // Handles the background
      clear();
      background(255);
    } else if (backgroundImageCheckbox.checked) {
      clear();
      image(img, 0, 0);
      background(img, 0, 0, img.width, img.height);
    } else {
      clear();
      background(backgroundColorInput.value);
    }

    let count = 0;
    if (!(randomizeSizeCheckbox.checked)) {
      count = 9;
    }

    while (count < 10) {
      let shapeSize = parseFloat(sizeRangeInput.value); 
      let selectedShape = document.getElementById('shapeSelect').value; 

      for (let x = 0; x < img.width; x += shapeSize) {
        for (let y = 0; y < img.height; y += shapeSize) {
          let currentShapeSize = shapeSize;

          if (randomizeSizeCheckbox.checked) {
            currentShapeSize = random(1, shapeSize);
          }

          if (outlinesCheckbox.checked) {
            stroke(0); 
          } else {
            noStroke(); 
          }

          let placeShape = 'square'
          if (selectedShape == 'all') {
            placeShape = random(shapeOptions); // Randomly select shape from shape options
          } else {
            placeShape = selectedShape;
          }

          switch (placeShape) {
            case 'triangle':
              drawTriangle(x, y, currentShapeSize);
              break;
            case 'square':
              drawSquare(x, y, currentShapeSize);
              break;
            case 'circle':
              drawCircle(x, y, currentShapeSize);
              break;
          }
          count++;
        }
      }
    }

    if (fillCheckbox.checked) { // If fill checkbox is checked, fill empty spaces with shapes
      fillEmptySpaces();
    }
  } else {
    alert('Please upload an image first.');
  }
}

function drawTriangle(x, y, size) {
  let triangleColor = sampleColor(x + size / 2, y + size / 2);
  fill(triangleColor);
  if (rotationCheckbox.checked) {
    let rotationAngle = random(TWO_PI); // Random rotation angle
    push(); // Save the current drawing state
    translate(x + size / 2, y + size / 2); // Translate to the center of the triangle
    rotate(rotationAngle);
    triangle(-size / 2, size / 2, size / 2, size / 2, 0, -size / 2);
    pop(); // Restore the previous drawing state
  } else {
    triangle(x, y + size, x + size, y + size, x + size / 2, y);
  }
}

function drawSquare(x, y, size) {
  let squareColor = sampleColor(x + size / 2, y + size / 2);
  fill(squareColor);
  if (rotationCheckbox.checked) {
    let rotationAngle = random(TWO_PI); // Random rotation angle
    push(); // Save the current drawing state
    translate(x + size / 2, y + size / 2); // Translate to the center of the square
    rotate(rotationAngle); 
    rect(-size / 2, -size / 2, size, size);
    pop(); // Restore the previous drawing state
  } else {
    rect(x, y, size, size);
  }
}

function drawCircle(x, y, size) { // Doesn't need to rotate as it does nothing to a Circle
  let circleColor = sampleColor(x + size / 2, y + size / 2);
  fill(circleColor);
  ellipse(x + size / 2, y + size / 2, size, size);
}

function fillEmptySpaces() {
  // Loop for a fixed number of times
  for (let i = 0; i < 3; i++) {
    loadPixels();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) { // If pixel is white (empty space), place a random shape
        if (get(x, y)[0] === 255 && get(x, y)[1] === 255 && get(x, y)[2] === 255) {
          let shapeSize = parseFloat(sizeRangeInput.value);
          let selectedShape = document.getElementById('shapeSelect').value;
          let currentShapeSize = shapeSize;

          if (randomizeSizeCheckbox.checked) {
            currentShapeSize = random(1, shapeSize);
          }

          if (outlinesCheckbox.checked) {
            stroke(0); 
          } else {
            noStroke(); 
          }

          let placeShape = 'square';
          if (selectedShape == 'all') {
            placeShape = random(shapeOptions); // Randomly select shape
          } else {
            placeShape = selectedShape;
          }

          switch (placeShape) {
            case 'triangle':
              drawTriangle(x, y, currentShapeSize);
              break;
            case 'square':
              drawSquare(x, y, currentShapeSize);
              break;
            case 'circle':
              drawCircle(x, y, currentShapeSize);
              break;
          }
        }
      }
    }
  }
}

function sampleColor(x, y) {// Sample color from the image at given coordinates
  let c = img.get(int(x), int(y));
  let variation = parseFloat(colourRangeInput.value);
  let r = constrain(c[0] + random(-variation, variation), 0, 255);
  let g = constrain(c[1] + random(-variation, variation), 0, 255);
  let b = constrain(c[2] + random(-variation, variation), 0, 255);
  return color(r, g, b);
}

function saveAsImage() {
  saveCanvas('myCanvas', 'jpg');
}