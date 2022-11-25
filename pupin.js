//board
var blockSize = 25;
var rows = 20;
var columns = 20;

var context;
//pupin head
var pupinX = blockSize * 5; //start point
var pupinY = blockSize * 5;
//pupin body
var pupinBody = [];
//velocity
var velocityX = 0;
var velocityY = 0;

//dicks
var dickX;
var dickY;

function loadImage(src) {
  const imageLoaded = new Promise((resolve, reject) => {
    const image = new Image(100,75); // Using optional size for image
    image.onload = () => {
      resolve(image);
    }; // Draw when image has loaded

    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = src;
  });

  return imageLoaded;
}

async function startGame() {
  const dick = await loadImage("./dick.png");
  const head1 = await loadImage("./pupin.png");
  const head2 = await loadImage("./pupinOpen.png");
  const flag = await loadImage("./flag.png");
  const board = document.getElementById("board");
  drawBoard(board);

  const context = board.getContext("2d");
  resetContext(context);

  document.addEventListener("keyup", changeDirection);

  let openMouth = false;
  const updateInterval = setInterval(() => {
    openMouth = !openMouth;
    const currentHead = openMouth ? head1 : head2;
    const gameOver = update(context, dick, currentHead, flag);
    if (gameOver) {
      clearInterval(updateInterval);
      alert("sosai");
    }
  }, 2000 / 10);
}

function drawBoard(board) {
  board.height = rows * blockSize;
  board.width = columns * blockSize;
}

function resetContext(context) {
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);
}

function drawDick(context, dick, x, y) {
  context.drawImage(dick, x, y, blockSize, blockSize);
}

function drawHead(context, head) {
  context.fillStyle = "orange";//???
  pupinX += velocityX * blockSize;
  pupinY += velocityY * blockSize;
  context.drawImage(head, pupinX, pupinY, blockSize, blockSize);
}

function drawBody(context, flag) {
  for (let i = 0; i < pupinBody.length; i++) {
    context.drawImage(
      flag,
      pupinBody[i][0],
      pupinBody[i][1],
      blockSize,
      blockSize
    );
  }
}

function moveBodyForward() {
  if (pupinBody.length) {
    pupinBody[0] = [pupinX, pupinY];
  }

  for (let i = pupinBody.length - 1; i > 0; i--) {
    pupinBody[i] = pupinBody[i - 1];
  }
}

function checkBodyCollision() {
  for (let i = 0; i < pupinBody.length; i++) {
    if (pupinX == pupinBody[i][0] && pupinY == pupinBody[i][1]) {
      return true;
    }
  }

  return false;
}

function checkWallsCollision() {
  return (
    pupinX < 0 ||
    pupinX > columns * blockSize ||
    pupinY < 0 ||
    pupinY > rows * blockSize
  );
}

// returns game over
function update(context, dick, head, flag) {
  if (dickX == undefined && dickY == undefined) {
    [dickX, dickY] = placeDick();
  }

  resetContext(context);

  drawDick(context, dick, dickX, dickY);

  if (pupinX == dickX && pupinY == dickY) {
    pupinBody.push([dickX, dickY]);
    [dickX, dickY] = placeDick();
  }

  moveBodyForward();
  drawHead(context, head);
  drawBody(context, flag);

  if (checkWallsCollision() || checkBodyCollision()) {
    return true;
  }

  return false;
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
  const dickX = Math.floor(Math.random() * columns) * blockSize;
  const dickY = Math.floor(Math.random() * rows) * blockSize;
  return [dickX, dickY];
}
