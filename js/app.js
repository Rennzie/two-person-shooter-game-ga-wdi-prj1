//console.log('this is linked');

////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {

  const $battleField = $('.battle-field');
  const $playerOneHealth = $('#playerOneHealth');
  const $playerTwoHealth = $('#playerTwoHealth');
  const $water = $('.water');
  const $marsh = $('.marsh');
  const $mountain = $('.mountain');

  const water = {
    name: 'Water',
    position: {
      left: $water.offset().left,
      top: $water.offset().top,
      right: $water.offset().left + $water.width(),
      bottom: $water.offset().top + $water.height()
    }
  };

  const marsh = {
    name: 'marsh',
    position: {
      left: $marsh.offset().left,
      top: $marsh.offset().top,
      right: $marsh.offset().left + $marsh.width(),
      bottom: $marsh.offset().top + $marsh.height()
    }
  };

  const mountain = {
    name: 'mountain',
    position: {
      left: $mountain.offset().left,
      top: $mountain.offset().top,
      right: $mountain.offset().left + $mountain.width(),
      bottom: $mountain.offset().top + $mountain.height()
    }
  };

  const battleField = {
    name: 'BattleField',

    left: $battleField.offset().left,
    top: $battleField.offset().top,
    right: $battleField.offset().left + $battleField.width(),
    bottom: $battleField.offset().top + $battleField.height()
  };

  ///////////////- BULLET CONSTRUCTOR -////////////////////////
  /////////////////////////////////////////////////////////////
  class Bullet {
    constructor (tankPositionTop, tankPositionLeft) {
      this.placementPosition = {
        left: tankPositionLeft + 30,
        top: tankPositionTop + 30
      };

      this.style = {
        width: 5,
        height: 5
      };

      this.element = document.createElement('div');
      this.element.classList.add('bullet');

      this.element.style.cssText = `
      margin: 2px;
      box-sizing: border-box;
      border: 1px solid black;
      position: absolute;
      top: ${this.placementPosition.top}px;
      left: ${this.placementPosition.left}px;
      width: ${this.style.width}px;
      height: ${this.style.height}px;
      border-radius: 100%;`;

      this.bulletPosition = {
        left: this.placementPosition.left,
        top: this.placementPosition.top,
        right: this.placementPosition.left + this.style.width,
        bottom: this.placementPosition.top + this.style.height
      };

      this.bulletSpeed = 5;

      this.damage = 5;

      this.collisionDetected = false;
    }
  }

  //refreshes the current xy coords of a bullet
  Bullet.prototype.updatePosition = function (){
    this.bulletPosition.left = $(this.element).offset().left;
    this.bulletPosition.top = $(this.element).offset().top;
    this.bulletPosition.right = $(this.element).offset().left + this.style.width;
    this.bulletPosition.bottom = $(this.element).offset().top + this.style.height;
    //this.detectCollision();
  };

  //repeatedly moves a bullet accross the screen
  Bullet.prototype.fireBullet = function(direction) {
    //console.log(direction);
    switch(direction){
      case 'right':
        $(this.element).offset({left: $(this.element).offset().left + 10});
        break;
      case 'left':
        $(this.element).offset({left: $(this.element).offset().left - 10});
        break;
      case 'up':
        $(this.element).offset({top: $(this.element).offset().top - 10});
        break;
      case 'down':
        $(this.element).offset({top: $(this.element).offset().top + 10});
        break;
    }
    this.updatePosition();
    //this.detectCollision(target);
    if(this.bulletPosition.left > battleField.left &&
      this.bulletPosition.right < battleField.right &&
      this.bulletPosition.top > battleField.top &&
      this.bulletPosition.bottom < battleField.bottom ){
      setTimeout( () => {
        this.fireBullet(direction);
      }, this.bulletSpeed);
    } else {
      this.removeBullet();
      return;
    }
  };
  Bullet.prototype.removeBullet = function () {
    $(this.element).remove();
  };

  Bullet.prototype.reduceLife = function (target) {
    if(target === 'playerOne'){
      playerOneHealth -= this.damage;
      $playerOneHealth.attr('value', playerOneHealth);
    }else if (target === 'playerTwo'){
      playerTwoHealth -= this.damage;
      $playerTwoHealth.attr('value', playerTwoHealth);
    }
  };

  /////- COLLISION DETECTION -/////////
  Bullet.prototype.detectCollision = function(targetObj) {
    //console.log('Logged at detectCollision():', targetObj.tankPosition);
    if(positionsOverlap(this.bulletPosition, targetObj.tankPosition) ){
      this.collisionDetected = true;
      console.log('Hit on ' + targetObj.name + ' detected: ' + this.collisionDetected);
      this.removeBullet();
      this.reduceLife(targetObj.name);
      checkForWin();
    }else{
      setTimeout(() => {
        this.detectCollision(targetObj);
      }, this.bulletSpeed);

    }
  };
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ///////////////- BULLET CONSTRUCTOR end -////////////////////////

  //////////- TANK CONSTRUCTOR with bullets -////////////////
  ///////////////////////////////////////////////////////////
  class Tank{
    constructor (startTop, startLeft, name, colour) {
      this.name = name;

      this.health = 100;

      this.direction = 'right';

      this.dimensions = {
        width: 60,
        height: 60
      };

      this.element = document.createElement('div');
      this.element.classList.add('tank');

      this.element.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('styles/images/TopDown_soldier_tank_body.png');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      border: 1px solid ${colour};
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${this.dimensions.width}px;
      height: ${this.dimensions.height}px;`;

      this.imageStyle = 'style="position: relative; width: 101px; height: 25px; z-index: 1; padding-right: 20px;"';

      this.element.innerHTML = `<img ${this.imageStyle} src="styles/images/TopDown_soldier_tank_turrent.png">`;

      this.tankPosition = {
        left: startLeft,
        top: startTop,
        right: startLeft + this.dimensions.width,
        bottom: startTop + this.dimensions.height
      };

      this.movementPoints = 20;
    }
  }

  Tank.prototype.addTank = function (){
    $battleField.append(this.element);
  };

  Tank.prototype.updatePosition = function (){
    this.tankPosition.left = $(this.element).offset().left;
    this.tankPosition.top = $(this.element).offset().top;
    this.tankPosition.right = $(this.element).offset().left + this.dimensions.width;
    this.tankPosition.bottom = $(this.element).offset().top + this.dimensions.height;
  };

  Tank.prototype.moveTank = function (direction){
    this.updatePosition();
    //console.log(targets);
    //console.log(this.tankPosition);
    switch(direction){
      case 'ArrowUp':
        return this.moveTankUp();
      case 'w':
        return this.moveTankUp();
      case 'ArrowDown':
        return this.moveTankDown();
      case 's':
        return this.moveTankDown();
      case 'ArrowLeft':
        return this.moveTankLeft();
      case 'a':
        return this.moveTankLeft();
      case 'ArrowRight':
        return this.moveTankRight();
      case 'd':
        return this.moveTankRight();
    }
  };

  Tank.prototype.otherPlayer = function() {
    let otherPlayer = playerTwo;
    if(this === playerTwo)  otherPlayer = playerOne;
    return otherPlayer;
  };

  Tank.prototype.moveTankUp = function () {
    const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
    newPos.top -= this.movementPoints;
    newPos.bottom -= this.movementPoints;
    if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountain.position) ) {
      if(this.tankPosition.top > battleField.top) {
        $(this.element).offset({top: newPos.top});
      }
    }
    $(this.element).attr('class', 'tank-90');
    this.direction = 'up';
  };

  Tank.prototype.moveTankDown = function () {
    const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
    newPos.top += this.movementPoints;
    newPos.bottom += this.movementPoints;
    if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountain.position)) {
      if(this.tankPosition.bottom < battleField.bottom){
        $(this.element).offset({top: newPos.top});
      }
    }
    $(this.element).attr('class', 'tank-270');
    this.direction = 'down';
  };

  Tank.prototype.moveTankLeft = function () {
    const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
    newPos.left -= this.movementPoints;
    newPos.right -= this.movementPoints;
    if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountain.position)) {
      if(this.tankPosition.left > battleField.left){
        $(this.element).offset({left: newPos.left});
      }
    }
    $(this.element).attr('class', 'tank-360');
    this.direction = 'left';
  };

  Tank.prototype.moveTankRight = function () {
    const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
    newPos.left += this.movementPoints;
    newPos.right += this.movementPoints;
    if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountain.position)) {
      if(this.tankPosition.right < battleField.right){
        $(this.element).offset({left: newPos.left});
      }
    }
    $(this.element).attr('class', 'tank-180');
    this.direction = 'right';
  };

  ////////- firing bullets -////////////
  Tank.prototype.addBullet = function (){
    this.updatePosition();
    this.bullet = new Bullet(this.tankPosition.top, this.tankPosition.left);
    $battleField.append(this.bullet.element);
    //const direction = this.direction;
    this.bullet.fireBullet(this.direction);
    //console.log(direction);
  };

  Tank.prototype.updateHealth = function (){
    this.health -= this.bullet.damage;
  };

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ///////////////- TANK CONSTRUCTOR end -////////////////////////

  ////////////////////////////////////////
  ///////- GLOBAL GAME CONTROL -//////////
  ////////////////////////////////////////
  const playerOne = new Tank(battleField.top, battleField.left, 'playerOne', 'blue' );
  const playerTwo = new Tank(battleField.bottom - 60, battleField.right - 60, 'playerTwo', 'red');

  let playerOneHealth = playerOne.health;
  let playerTwoHealth = playerTwo.health;


  //to fire bullets depending on which key stroke was pressed
  function createBullet(key) {
    playerOne.updatePosition();
    playerTwo.updatePosition();
    if(key === ' '){
      playerOne.addBullet();
      playerOne.bullet.detectCollision(playerTwo);
    }else if (key === 'Shift'){
      playerTwo.addBullet();
      playerTwo.bullet.detectCollision(playerOne);
    }
  }

  function checkForWin () {
    if (playerOneHealth === 0){
      window.alert('Player Two Won');
    }
    if (playerTwoHealth === 0){
      window.alert('Player One Won');
    }
  }

  function addPlayerOne() {
    playerOne.addTank();
  }
  function addPlayerTwo() {
    playerTwo.addTank();
  }

  addPlayerOne();
  addPlayerTwo();


  //////- CHECKS FOR COLLISION -////////
  function positionsOverlap(obj1, obj2) {
    return ((obj1.right > obj2.left) && (obj1.left < obj2.right)) &&
    ((obj1.top < obj2.bottom) && (obj1.bottom > obj2.top));
  }


  //checks water and marsh first then passes to the Tank move methods
  function checkForObsticals (tankObj, keyPress) {
    if(positionsOverlap(tankObj.tankPosition, water.position)){
      console.log('tank drove into water');
      window.alert(`Tank ${tankObj.name} drove into the water! GAME OVER!!!`);
      tankObj.moveTank(keyPress);
    }else if(positionsOverlap(tankObj.tankPosition, marsh.position)){
      console.log(`Tank ${tankObj.name} drove into a marshland`);
      setTimeout(function () {
        tankObj.moveTank(keyPress);
      }, 1000);
    }else if(positionsOverlap(tankObj.tankPosition, mountain.position)){
      console.log(`Tank ${tankObj.name} drove into a mountain`);
      tankObj.moveTank(keyPress);
    }else{
      tankObj.moveTank(keyPress);
    }
  }


  // const obsticals = {
  //   battleField: battleField,
  //   playerOne: playerOne,
  //   playerTwo: playerTwo
  // };
  //console.log(obsticals);

  //////- KEY DOWN IDENTIFIER -///////
  //use this to determine what key has been pressed and assign correct function
  function keyIdentifier(e){
    //console.log(e.originalEvent.key);
    if(e.originalEvent.key === ' ' || e.originalEvent.key === 'Shift' )
      createBullet(e.originalEvent.key);
    if(e.originalEvent.key === 'ArrowDown' ||
      e.originalEvent.key === 'ArrowUp' ||
      e.originalEvent.key === 'ArrowLeft' ||
      e.originalEvent.key === 'ArrowRight'){
      checkForObsticals(playerOne, e.originalEvent.key);
    }
    if(e.originalEvent.key === 'a' ||
      e.originalEvent.key === 'd' ||
      e.originalEvent.key === 's' ||
      e.originalEvent.key === 'w'){
      checkForObsticals(playerTwo, e.originalEvent.key);
    }
  }


  $(window).keydown(keyIdentifier);
});











////////////////////////////////////
///////- CODE GRAVEYARD -///////////
////////////////////////////////////

// //interval timer to change x/y of a selected div
// function startInterval() {
//   const intervalId = setInterval(changeXy, 1000);
//   setTimeout(() => {
//     clearInterval(intervalId);
//   }, 10000);
// }
// //function thats run in above interval
// function changeXy () {
//   $bullet.offset({left: $bullet.offset().left + 50 });
//   printXy();
// }

// //prints position of boxes saved in object
// function printXy () {
//   console.log('tank minX: ' + tankPosition.minX);
//   console.log('tank minY: ' + tankPosition.minY);
//   console.log('bullet minX: ' + bullet.minX);
//   console.log('bullet minY: ' + bullet.minY);
// }




///- OLD OBJECT FOR HARD CODED TANKS -///////////
/////////////////////////////////////////////////
/////////- TANK ONE -//////////////
// const tankOne = {
//   health: 100,
//
//   currentDirection: {
//     up: false,
//     down: false,
//     left: false,
//     right: false
//   },
//
//   currentPosition: {
//     left: $tank.offset().left,
//     top: $tank.offset().top,
//     right: $tank.offset().left + $tank.width(),
//     bottom: $tank.offset().top + $tank.height()
//   },
//
//   movementPoints: 50
// };

/////////- TANK TWO -//////////////
// const tankTwo = {
//   health: 100,
//
//   currentDirection: {
//     up: false,
//     down: false,
//     left: false,
//     right: false
//   },
//
//   currentPosition: {
//     left: $tank2.offset().left,
//     top: $tank2.offset().top,
//     right: $tank2.offset().left + $tank.width(),
//     bottom: $tank2.offset().top + $tank.height()
//   },
//
//   movementPoints: 50
// };


// ///////- MOVE TANK -//////////
// function tankMove(direction) {
//   updatedPosition(tankOne, $tank);
//   updatedPosition(tankTwo, $tank2);
//   switch(direction){
//     case 'ArrowUp':
//       return moveTankUp();
//     case 'ArrowDown':
//       return moveTankDown();
//     case 'ArrowLeft':
//       return moveTankLeft();
//     case 'ArrowRight':
//       return moveTankRight();
//     case 'w':
//       return moveTank2Up();
//     case 's':
//       return moveTank2Down();
//     case 'a':
//       return moveTank2Left();
//     case 'd':
//       return moveTank2Right();
//   }
// }
//
// function moveTankUp () {
//   if(tankOne.currentPosition.top - 10 > battleField.top)
//     $tank.offset({top: $tank.offset().top - tankOne.movementPoints});
// }
// function moveTankDown () {
//   if(tankOne.currentPosition.bottom < battleField.bottom)
//     $tank.offset({top: $tank.offset().top + tankOne.movementPoints});
// }
// function moveTankLeft () {
//   if(tankOne.currentPosition.left > battleField.left)
//     $tank.offset({left: $tank.offset().left - tankOne.movementPoints});
// }
// function moveTankRight () {
//   if(tankOne.currentPosition.right < battleField.right)
//     $tank.offset({left: $tank.offset().left + tankOne.movementPoints});
// }
//
// function moveTank2Up () {
//   if(tankTwo.currentPosition.top - 10 > battleField.top)
//     $tank2.offset({top: $tank2.offset().top - tankTwo.movementPoints});
// }
// function moveTank2Down () {
//   if(tankTwo.currentPosition.bottom < battleField.bottom)
//     $tank2.offset({top: $tank2.offset().top + tankTwo.movementPoints});
// }
// function moveTank2Left () {
//   if(tankTwo.currentPosition.left > battleField.left)
//     $tank2.offset({left: $tank2.offset().left - tankTwo.movementPoints});
// }
// function moveTank2Right () {
//   if(tankTwo.currentPosition.right < battleField.right)
//     $tank2.offset({left: $tank2.offset().left + tankTwo.movementPoints});
// }



// ///////- OLD ELEMENT POSITION UPDATER BEFORE TANK CONSTRUCTOR -/////////
// //to dynamically update the position of an animated element
// //(works when called as step in animateBullet())
// function updatedPosition(itemObj, itemDom){
//   itemObj.currentPosition.left = itemDom.offset().left;
//   itemObj.currentPosition.top = itemDom.offset().top;
//   itemObj.currentPosition.right = itemDom.offset().left + itemDom.width();
//   itemObj.currentPosition.bottom = itemDom.offset().top + itemDom.height();
//   //targetCollision();
// }



/////////- FAILED METHOD TO TEST FOR COLLISION -//////////////
// function checkForObsticals (name, keyPress) {
//   playerOne.updatePosition();
//   playerTwo.updatePosition();
//
//   if(!positionsOverlap(playerOne.tankPosition, playerTwo.tankPosition)) {
//     playerOne.moveTank(keyPress);
//  }
// if(name === 'playerOne'){
//   if((playerOne.tankPosition.left >= playerTwo.tankPosition.left &&
//   playerOne.tankPosition.left <= playerTwo.tankPosition.right &&
//   playerOne.tankPosition.top >= playerTwo.tankPosition.top &&
//   playerOne.tankPosition.top <= playerTwo.tankPosition.bottom) ||
//
//   (playerOne.tankPosition.right >= playerTwo.tankPosition.left &&
//   playerOne.tankPosition.right <= playerTwo.tankPosition.right &&
//   playerOne.tankPosition.bottom >= playerTwo.tankPosition.top &&
//   playerOne.tankPosition.bottom <= playerTwo.tankPosition.bottom) ||
//
//   (playerOne.tankPosition.right >= playerTwo.tankPosition.left &&
//   playerOne.tankPosition.right <= playerTwo.tankPosition.right &&
//   playerOne.tankPosition.top >= playerTwo.tankPosition.top &&
//   playerOne.tankPosition.top <= playerTwo.tankPosition.bottom)||
//
//   (playerOne.tankPosition.left >= playerTwo.tankPosition.left &&
//   playerOne.tankPosition.left <= playerTwo.tankPosition.right &&
//   playerOne.tankPosition.bottom >= playerTwo.tankPosition.top &&
//   playerOne.tankPosition.bottom <= playerTwo.tankPosition.bottom)){
//     return;
//   }
//   playerOne.moveTank(keyPress);
//console.log(name);
// }
//  }
