  // Initialize the canvas & state
  // app.canvas = document.getElementById('canvas');
  // app.context = canvas.getContext('2d');
  // app.starSpeed = 2;
  // app.wallSpeed = 3.5;
  // app.removeStars = false;
  // app.walls = [];
  // app.score = 0;
  // app.gameOver = false;
  // app.dialogue = '';
  // setGame();

  // Listen for keyboard events
  // window.addEventListener('keydown', myKeyDown);
  // window.addEventListener('keyup', myKeyUp);

  // Update the game board
  // app.lastTime = window.performance.now();
  // window.requestAnimationFrame(frameUpdate);



// Set Game Function
// let setGame = () => {
//   spawnPlayer();
//   app.stars = [];
//   spawnInitialStars();
// }


// Classes
class Game {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.context = canvas.getContext('2d');
    this.stars = [];
    this.walls = [];
    this.removeStars = false;
    this.score = 0;
    this.gameOver = false;
    this.dialogue = '';
  }
  spawnPlayer() {
    this.player = new Player();
  }
  addStar(init) {
    if (init === false) {
      let newStar = new Star({x: 763, y: Math.random() * this.canvas.height}, {height: 4, width: 4}, "#E4FFFF");
      this.stars.push(newStar);
    }
    else {
      let newStar = new Star({x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height}, {height: 4, width: 4}, "#FFFFFF");
      this.stars.push(newStar);
    }
  }
  addStarChance() {
    let chance = Math.random();
    if (chance >= 0.8) {
      this.addStar(false);
    }
  }
  spawnInitialStars() {
    let i = 0;
    while (i < 20) {
      this.addStar({x: Math.random(true) * this.canvas.width, y: Math.random() * this.canvas.height}, {height: 4, width: 4}, "#FF0000");
      i++;
    }
  }
  addWall() {
    let direction = Math.random();
    let xPosition = Math.random() * this.canvas.width;
    let yPosition = Math.random() * this.canvas.height;
    if (direction >= 0.5) {
      direction = 'left';
    }
    else {
      direction = 'up';
    }
    if (direction === 'left') {
      if (yPosition <= 40) {
        yPosition += 40;
      }
      this.walls.push(new Wall({x: 1144.5, y: yPosition}, {height: 150, width: 768}, '#FE3527', direction));
    }
    else if (direction === 'up') {
      if (xPosition <= 40) {
        xPosition += 40;
      }
      this.walls.push(new Wall({x: xPosition, y: 900}, {height: 600, width: 192}, '#FE3527', direction));
    }
  }
  eventListener() {
    window.addEventListener('keydown', this.keyDown());
    window.addEventListener('keyup', this.keyUp());
  }
  keyDown(e) {
    if (this.gameOver === true) {
      switch(e.keyCode) {
        case 32:
          this.resetGame();
      }
    }
    else {
      switch(e.keyCode) {
        case 38:
          this.upKeyDownHandler();
          break;
        case 40:
          this.downKeyDownHandler();
          break;
        case 39:
          this.rightKeyDownHandler();
          break;
        case 37:
          this.leftKeyDownHandler();
          break;
      }
    }
  }
  keyUp(e) {
    if (this.gameOver === true) {
      // do nothing
    }
    else {
      switch(e.keyCode) {
        case 38:
          this.upKeyUpHandler();
          break;
        case 40:
          this.downKeyUpHandler();
          break;
        case 39:
          this.rightKeyUpHandler();
          break;
        case 37:
          this.leftKeyUpHandler();
          break;
      }
    }
  }
  upKeyDownHandler() {
    this.player.moveUp = true;
  }
  downKeyDownHandler() {
    this.player.moveDown = true;
  }
  rightKeyDownHandler() {
    this.player.moveRight = true;
  }
  leftKeyDownHandler() {
    this.player.moveLeft = true;
  }
  upKeyUpHandler() {
    this.player.moveUp = false;
  }
  downKeyUpHandler() {
    this.player.moveDown = false;
  }
  rightKeyUpHandler() {
    this.player.moveRight = false;
  }
  leftKeyUpHandler() {
    this.player.moveLeft = false;
  }
  updateBoard() {
    this.lastTime = window.performance.now();
    window.requestAnimationFrame(this.frameUpdate);
  }
  drawScene() {
    this.context.fillStyle = '#000020';
    this.context.fillRect(0, 0, app.canvas.width, app.canvas.height);
    this.player.drawMe(app.context);
    this.stars.forEach(function (star) {
      star.drawMe(this.context);
    })
    this.walls.forEach(function (wall) {
      wall.drawMe(this.context);
    })
  }
  frameUpdate(timeStamp) {

    // ******************************************
    // PROBLEM GETTING 'THIS' inside this method
    // ******************************************

    console.log(this);
    this.lastTime = window.performance.now();
    window.requestAnimationFrame(this.frameUpdate);
    let dt = (timeStamp - game.lastTime) / 1000;
    this.lastTime = timeStamp;
    $('#score').text('SCORE: ' + this.score);
    $('#dialogue').text(this.dialogue);
    if (this.gameOver === true) {
      this.player.moveLeft = false;
      this.player.moveRight = false;
      this.player.moveUp = false;
      this.player.moveDown = false;
      this.dialogue = 'GAME OVER! (SPACEBAR TO PLAY AGAIN)';
      window.requestAnimationFrame(this.frameUpdate);
    }
    else {
      this.score++;
      window.requestAnimationFrame(frameUpdate);
      this.lastTime = timeStamp;
      this.player.move();
      this.drawScene();
      this.stars.forEach(function (star) {
        star.position.x -= this.starSpeed;
      })
      this.walls.forEach(function (wall) {
        wall.move();
        if (wall.direction === 'up') {
          if (wall.position.x - 109 <= this.player.position.x && wall.position.x + 109 >= this.player.position.x) {
            if (wall.position.y - 330 <= this.player.position.y && wall.position.y + 330 >= this.player.position.y) {
              this.gameOver = true;
            }
          }
          if (wall.position.y - 330 <= this.player.position.y && wall.position.y + 330 >= this.player.position.y) {
            if (wall.position.x - 109 <= this.player.position.x && wall.position.x + 109 >= this.player.position.x) {
              this.gameOver = true;
            }
          }
        }
        else if (wall.direction === 'left') {
          if (wall.position.x - 394 <= this.player.position.x && wall.position.x + 394 >= this.player.position.x) {
            if (wall.position.y - 98 <= this.player.position.y && wall.position.y + 98 >= this.player.position.y) {
              this.gameOver = true;
            }
          }
          if (wall.position.y - 98 <= this.player.position.y && wall.position.y + 98 >= this.player.position.y) {
            if (wall.position.x - 394 <= this.player.position.x && wall.position.x + 394 >= this.player.position.x) {
              this.gameOver = true;
            }
          }
        }
      })
      this.addStarChance();
      this.addWallChance();
      if (this.stars.length >= 200) {
        this.removeStars = true;
      }
      if (this.removeStars === true) {
        this.stars = this.stars.slice(this.stars.length / 2, this.stars.length);
        this.removeStars = false;
      }
    }
  }
  resetGame() {
    this.gameOver = false;
    this.dialogue = '';
    this.score = 0;
    this.player.position.x = 55;
    this.player.position.y = 300;
    this.stars = [];
    this.spawnInitialStars();
    this.walls = [];
    this.player.moveLeft = false;
    this.player.moveRight = false;
    this.player.moveUp = false;
    this.player.moveDown = false;
  }
}

class Player {
  constructor(position, size) {
    this.position = {
      x: 55,
      y: 300
    },
    this.size = {
      height: 60,
      width: 30
    },
    this.color = "#2694FE";
  }
  move() {
    if (this.moveUp) {
      if (this.position.y > 31) {
        this.position.y -= 5;
      }
      else {
        this.position.y = 31;
      }
    }
    else if (this.moveDown) {
      if (this.position.y < 569) {
        this.position.y += 5;
      }
      else {
        this.position.y = 569;
      }
    }
    else if (this.moveRight) {
      if (this.position.x < 752) {
        this.position.x += 5;
      }
      else {
        this.position.x = 752;
      }
    }
    else if (this.moveLeft) {
      if (this.position.x > 16) {
        this.position.x -= 5;
      }
      else {
        this.position.x = 16;
      }
    }
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

class Star {
  constructor(position, size, color) {
    this.position = position,
    this.size = size,
    this.color = color;
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

class Wall {
  constructor(position, size, color, direction) {
    this.position = position,
    this.size = size,
    this.color = color,
    this.direction = direction
  }
  move() {
    if (this.direction === 'up') {
      this.position.y -= app.wallSpeed;
      if (this.position.y <= -300) {
        let idx = app.walls.indexOf(this);
        app.walls.splice(idx, 1);
      }
    }
    else if (this.direction === 'left') {
      this.position.x -= app.wallSpeed;
      if (this.position.x <= -384) {
        let idx = app.walls.indexOf(this);
        app.walls.splice(idx, 1);
      }
    }
  }
  drawMe(context) {
    drawObject(context, this);
  }
}

let startApp = () => {
  let game = new Game();
  game.spawnPlayer();
  game.spawnInitialStars();
  game.lastTime = window.performance.now();
  window.requestAnimationFrame(game.frameUpdate);
}


// const spawnPlayer = () => {
//   app.player = new Player();
// }
//
// const spawnInitialStars = () => {
//   let i = 0;
//   while (i < 20) {
//     addStar({x: Math.random(true) * app.canvas.width, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FF0000");
//     i++;
//   }
// }

// const frameUpdate = (timeStamp) => {
//   $('#score').text('SCORE: ' + app.score);
//   $('#dialogue').text(app.dialogue);
//   if (app.gameOver === true) {
//     app.player.moveLeft = false;
//     app.player.moveRight = false;
//     app.player.moveUp = false;
//     app.player.moveDown = false;
//     app.dialogue = 'GAME OVER! (SPACEBAR TO PLAY AGAIN)';
//     window.requestAnimationFrame(frameUpdate);
//   }
//   else {
//     app.score++;
//     window.requestAnimationFrame(frameUpdate);
//     app.lastTime = timeStamp;
//     app.player.move();
//     drawScene();
//     app.stars.forEach(function (star) {
//       star.position.x -= app.starSpeed;
//     })
//     app.walls.forEach(function (wall) {
//       wall.move();
//       if (wall.direction === 'up') {
//         if (wall.position.x - 109 <= app.player.position.x && wall.position.x + 109 >= app.player.position.x) {
//           if (wall.position.y - 330 <= app.player.position.y && wall.position.y + 330 >= app.player.position.y) {
//             app.gameOver = true;
//           }
//         }
//         if (wall.position.y - 330 <= app.player.position.y && wall.position.y + 330 >= app.player.position.y) {
//           if (wall.position.x - 109 <= app.player.position.x && wall.position.x + 109 >= app.player.position.x) {
//             app.gameOver = true;
//           }
//         }
//       }
//       else if (wall.direction === 'left') {
//         if (wall.position.x - 394 <= app.player.position.x && wall.position.x + 394 >= app.player.position.x) {
//           if (wall.position.y - 98 <= app.player.position.y && wall.position.y + 98 >= app.player.position.y) {
//             app.gameOver = true;
//           }
//         }
//         if (wall.position.y - 98 <= app.player.position.y && wall.position.y + 98 >= app.player.position.y) {
//           if (wall.position.x - 394 <= app.player.position.x && wall.position.x + 394 >= app.player.position.x) {
//             app.gameOver = true;
//           }
//         }
//       }
//     })
//     addStarChance();
//     addWallChance();
//     if (app.stars.length >= 200) {
//       app.removeStars = true;
//     }
//     if (app.removeStars === true) {
//       app.stars = app.stars.slice(app.stars.length / 2, app.stars.length);
//       app.removeStars = false;
//     }
//   }
// }

// const addStarChance = () => {
//   let chance = Math.random();
//   if (chance >= 0.8) {
//     addStar(false);
//   }
// }
//
// const addWallChance = () => {
//   let chance = Math.random();
//   if (chance >= 0.98 && app.walls.length <= 3) {
//     addWall();
//   }
// }

// const addStar = (init) => {
//   if (init === false) {
//     let newStar = new Star({x: 763, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#E4FFFF");
//     app.stars.push(newStar);
//   }
//   else {
//     let newStar = new Star({x: Math.random() * app.canvas.width, y: Math.random() * app.canvas.height}, {height: 4, width: 4}, "#FFFFFF");
//     app.stars.push(newStar);
//   }
// }

// const addWall = () => {
//   let direction = Math.random();
//   let xPosition = Math.random() * app.canvas.width;
//   let yPosition = Math.random() * app.canvas.height;
//   if (direction >= 0.5) {
//     direction = 'left';
//   }
//   else {
//     direction = 'up';
//   }
//   if (direction === 'left') {
//     if (yPosition <= 40) {
//       yPosition += 40;
//     }
//     app.walls.push(new Wall({x: 1144.5, y: yPosition}, {height: 150, width: 768}, '#FE3527', direction));
//   }
//   else if (direction === 'up') {
//     if (xPosition <= 40) {
//       xPosition += 40;
//     }
//     app.walls.push(new Wall({x: xPosition, y: 900}, {height: 600, width: 192}, '#FE3527', direction));
//   }
// }

// const drawScene = () => {
//   app.context.fillStyle = '#000020';
//   app.context.fillRect(0, 0, app.canvas.width, app.canvas.height);
//   app.player.drawMe(app.context);
//   app.stars.forEach(function (star) {
//     star.drawMe(app.context);
//   })
//   app.walls.forEach(function (wall) {
//     wall.drawMe(app.context);
//   })
// }


// Key Down/Up
// const myKeyDown = (e) => {
//   if (app.gameOver === true) {
//     switch(e.keyCode) {
//       case 32:
//         resetGame();
//     }
//   }
//   else {
//     switch(e.keyCode) {
//       case 38:
//         upKeyDownHandler();
//         break;
//       case 40:
//         downKeyDownHandler();
//         break;
//       case 39:
//         rightKeyDownHandler();
//         break;
//       case 37:
//         leftKeyDownHandler();
//         break;
//     }
//   }
// }

// const myKeyUp = (e) => {
//   if (app.gameOver === true) {
//     // do nothing
//   }
//   else {
//     switch(e.keyCode) {
//       case 38:
//         upKeyUpHandler();
//         break;
//       case 40:
//         downKeyUpHandler();
//         break;
//       case 39:
//         rightKeyUpHandler();
//         break;
//       case 37:
//         leftKeyUpHandler();
//         break;
//     }
//   }
// }


// Key Handlers
// const upKeyDownHandler = () => {
//   app.player.moveUp = true;
// }
//
// const downKeyDownHandler = () => {
//   app.player.moveDown = true;
// }
//
// const rightKeyDownHandler = () => {
//   app.player.moveRight = true;
// }
//
// const leftKeyDownHandler = () => {
//   app.player.moveLeft = true;
// }
//
// const upKeyUpHandler = () => {
//   app.player.moveUp = false;
// }
//
// const downKeyUpHandler = () => {
//   app.player.moveDown = false;
// }
//
// const rightKeyUpHandler = () => {
//   app.player.moveRight = false;
// }
//
// const leftKeyUpHandler = () => {
//   app.player.moveLeft = false;
// }
//
//
// // Reset Game Function
// const resetGame = () => {
//   app.gameOver = false;
//   app.dialogue = '';
//   app.score = 0;
//   app.player.position.x = 55;
//   app.player.position.y = 300;
//   app.stars = [];
//   spawnInitialStars();
//   app.walls = [];
//   app.player.moveLeft = false;
//   app.player.moveRight = false;
//   app.player.moveUp = false;
//   app.player.moveDown = false;
// }
