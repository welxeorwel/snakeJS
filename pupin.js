//board
var blockSize = 25;
var rows = 20;
var columns = 20;
var board;
var context;
// var dick;
//pupin head
var pupinX = blockSize * 5; //start point
var pupinY = blockSize * 5;
//pupin body
var pupinBody = [];
//velocity
var velocityX = 0;
var velocityY = 0;
var gameOver = false;
//dicks
var dickX;
var dickY;

function loadImage(src) {
  const imageLoaded = new Promise((resolve, reject) => {
    const image = new Image(60, 45); // Using optional size for image
    image.onload = () => {
      resolve(image);
    }; // Draw when image has loaded
    
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = src;
  })

  return imageLoaded;
}

//field
window.onload = async function () {
  const dick = await loadImage('./dick.png');
  console.log(dick);

  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = columns * blockSize;
  context = board.getContext("2d");

  placeDick();
  document.addEventListener("keyup", changeDirection);
  setInterval(() => {
    update(dick)
  }, 1000 / 10);
};

function drawDick(dick) {
  // context.fillStyle = "green";
  // context.fillRect(dickX, dickY, blockSize, blockSize);
  context.drawImage(dick, dickX, dickY, blockSize, blockSize);

}

function update(dick) {
  if (gameOver) {
    return;
  }
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);
  
  drawDick(dick);

  if (pupinX == dickX && pupinY == dickY) {
    pupinBody.push([dickX, dickY]);
    placeDick();
  }
  for (let i = pupinBody.length - 1; i > 0; i--) {
    pupinBody[i] = pupinBody[i - 1];
  }
  if (pupinBody.length) {
    pupinBody[0] = [pupinX, pupinY];
  }

  context.fillStyle = "orange";
  pupinX += velocityX * blockSize;
  pupinY += velocityY * blockSize;
  context.fillRect(pupinX, pupinY, blockSize, blockSize);
  for (let i = 0; i < pupinBody.length; i++) {
    context.fillRect(pupinBody[i][0], pupinBody[i][1], blockSize, blockSize);
  }

  //game over
  if (
    pupinX < 0 ||
    pupinX > columns * blockSize ||
    pupinY < 0 ||
    pupinY > rows * blockSize
  ) {
    gameOver = true;
    alert("sosai");
  }
  for (let i = 0; i < pupinBody.length; i++) {
    if (pupinX == pupinBody[i][0] && pupinY==pupinBody[i][1]) {
      gameOver = true;
      alert("sosai");
    }
  }
}
function changeDirection(e) {
  if (e.code == "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code == "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code == "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if ((e.code == "ArrowRight") & (velocityX != -1)) {
    velocityX = 1;
    velocityY = 0;
  }
}
function placeDick() {
  dickX = Math.floor(Math.random() * columns) * blockSize;
  dickY = Math.floor(Math.random() * rows) * blockSize;
}
