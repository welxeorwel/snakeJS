
export function drawRestart(context, endGameAnimations) {
    resetContext(context);
    endGameAnimation(context, endGameAnimations[tick % endGameAnimations.length]);
    endGameMessage(context);
  
    // when u need to start, call updateInterval()
  }
  function endGameAnimation(context, endGameAnimations) {
    context.drawImage(endGameAnimations, board.height / 4, board.width / 4);
  }
  function endGameMessage(context) {
    context.fillStyle = "white";
    context.font = "15px sans-serif";
    if (counter == 1) {
      context.fillText(
        "Putin ate just " + counter + " small sick dick! its not enouth!!",
        board.height / 6,
        board.width / 8
      );
    } else {
      context.fillText(
        "Putin ate just " + counter + " small sick dicks! its not enouth!!",
        board.height / 6,
        board.width / 8
      );
    }
  }