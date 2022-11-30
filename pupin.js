//board
let blockSize = 25;
let rows = 20;
let columns = 20;

let context;
//pupin head
let pupinX = blockSize * 5; //start point
let pupinY = blockSize * 5;
//pupin body
let pupinBody = [];
//velocity
let velocityX = 0;
let velocityY = 0;
//counter
let counter = 0;
//dicks
let dickX;
let dickY;
let tick = 0;
const restartButton = document.getElementById("restart");

function loadImage(src) {
  const imageLoaded = new Promise((resolve, reject) => {
    const image = new Image(100, 75); // Using optional size for image
    image.onload = () => {
      resolve(image);
    };
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
  const endGameAnimations = await Promise.all([
    loadImage("./pupinCry1.png"),
    loadImage("./pupinCry2.png"),
    loadImage("./pupinCry3.png"),
  ]);

  drawBoard(board);

  const context = board.getContext("2d");
  resetContext(context);

  document.addEventListener("keyup", changeDirection);

  let openMouth = false;
  const updateInterval = () => {
    const currentInterval = setInterval(() => {
      tick++;
      openMouth = !openMouth;
      const currentHead = openMouth ? head1 : head2;
      const gameOver = update(context, dick, currentHead, flag);
      if (gameOver) {
        //clearInterval(currentInterval);
        drawRestart(context, endGameAnimations);
      }
    }, 200);
  };

  updateInterval();
}

function drawRestart(context, endGameAnimations) {
  resetContext(context);
  endGameAnimation(context, endGameAnimations[tick % endGameAnimations.length]);
  endGameMessage(context);
  // alert(
  //   "sosai!! Putin ate just " + counter + " small sick dicks! its not enouth!!"
  // );
  // when u need to start, call updateInterval()
}
function endGameAnimation(context, endGameAnimations) {
  context.drawImage(endGameAnimations, board.height / 4, board.width / 4);
 
}
function endGameMessage(context){
  context.fillStyle = "white";
  context.font = "15px sans-serif";
  if(counter==1){
  context.fillText(
    "sosai!! Putin ate just " + counter + " small sick dick! its not enouth!!",
    board.height / 6,
    board.width / 8  
  );
  }
  else{
context.fillText(
    "sosai!! Putin ate just " + counter + " small sick dicks! its not enouth!!",
    board.height / 6,
    board.width / 8
);
  }
} 

function drawBoard(board) {
  board.width = columns * blockSize;
  board.height = rows * blockSize;
}

function resetContext(context) {
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);
}

function drawDick(context, dick, x, y) {
  context.drawImage(dick, x, y, blockSize, blockSize);
}

function drawHead(context, head) {
  context.fillStyle = "orange"; //??? dosent draw without this... idk why
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

function update(context, dick, head, flag) {
  if (dickX == undefined && dickY == undefined) {
    [dickX, dickY] = placeDick();
  }

  resetContext(context);

  drawDick(context, dick, dickX, dickY);

  if (pupinX == dickX && pupinY == dickY) {
    pupinBody.push([dickX, dickY]);
    [dickX, dickY] = placeDick();
    counter++;
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
