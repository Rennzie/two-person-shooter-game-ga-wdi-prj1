//console.log('this is linked');

////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {

  const $body = $('body');
  //const $battleField = $('.battle-field');
  //const $playerOneHealth = $('#playerOneHealth');
  // const $playerTwoHealth = $('#playerTwoHealth');

  //let bullets = [];
  const gameItems = [];

  function getGameItems(itemType) {
    return gameItems.filter(item => item.type === itemType);
  }

  function getPlayer(number) {
    return gameItems.filter(item => item.name === `Player ${number}`)[0].object;
  }

  // const $water = $('.water');
  // const $marsh = $('.marsh');
  // const $mountain = $('.mountain');



  // const water = {
  //   name: 'Water',
  //   position: {
  //     left: $water.offset().left,
  //     top: $water.offset().top,
  //     right: $water.offset().left + $water.width(),
  //     bottom: $water.offset().top + $water.height()
  //   }
  // };
  //
  // const marsh = {
  //   name: 'marsh',
  //   position: {
  //     left: $marsh.offset().left,
  //     top: $marsh.offset().top,
  //     right: $marsh.offset().left + $marsh.width(),
  //     bottom: $marsh.offset().top + $marsh.height()
  //   }
  // };
  //

  const battleFieldObj = {
    name: 'BattleField',

    dimensions: {
      width: 900,
      height: 700
    },

    style: `
      position: relative;
      justify-content: center;
      align-items: center;
      width: 900px;
      height: 700px;
      border: 1px solid red;
      margin: 25px auto 0 auto;
      background-image: url('styles/images/terrain-stone-desert.png');
      background-repeat: repeat;
      background-size: cover;`,

    obsticals: {
      mountain: {
        name: 'Mountain',

        style: `
          position: absolute;
          top: 150px;
          left: 350px;
          width: 100px;
          height: 100px;
          background-image: url('styles/images/terrain-pebbles.png');
          background-repeat: repeat;
          background-size: cover;`,

        dimensions: {
          width: 100,
          height: 100
        }
      },

      water: {
        name: 'Water',

        style: `
          position: absolute;
          top: 150px;
          left: 600px;
          width: 100px;
          height: 100px;
          background-image: url('styles/images/terrain-water-2.png');
          background-repeat: repeat;
          background-size: cover;`,

        dimensions: {
          width: 100,
          height: 100
        }
      }
    }
  };

  ///////- Add battlefield and Obsticals-////////////

  const battleField = document.createElement('div');
  battleField.classList.add('battle-field');
  battleField.style.cssText = battleFieldObj.style;
  $body.append(battleField);

  //console.log(battleField);

  // const battleFieldPos = {
  //   left: 0,
  //   top: 0,
  //   right: battleFieldObj.dimensions.width,
  //   bottom: battleFieldObj.dimensions.height
  // };

  // const mountain = document.createElement('div');
  // mountain.classList.add('mountain');
  // mountain.style.cssText = battleFieldObj.obsticals.mountain.style;
  // $(battleField).append(mountain);
  //
  // const mountainPos = {
  //   left: mountain.offsetLeft,
  //   top: mountain.offsetTop,
  //   right: mountain.offsetLeft + battleFieldObj.obsticals.mountain.dimensions.width,
  //   bottom: mountain.offsetTop + battleFieldObj.obsticals.mountain.dimensions.height
  // };
  //
  // const water = document.createElement('div');
  // water.classList.add('water');
  // water.style.cssText = battleFieldObj.obsticals.water.style;
  // $(battleField).append(water);
  //
  // const waterPos = {
  //   left: water.offsetLeft,
  //   top: water.offsetTop,
  //   right: water.offsetLeft + battleFieldObj.obsticals.water.dimensions.width,
  //   bottom: water.offsetTop + battleFieldObj.obsticals.water.dimensions.height
  // };

  class gameItem {
    constructor(name, top, left, width, height, type, domElement, movementSpeed, direction) {
      this.name = name;
      this.top = top;
      this.left = left;
      this.type = type;
      this.width = width;
      this.height = height;
      this.domElement = domElement;
      this.movementSpeed = movementSpeed;
      this.direction = direction;

      // Draw the DOM element
      battleField.appendChild(domElement);
      //orientate the dom element by direction
      if(direction){
        domElement.classList.add(direction);
      }

    }

    drawDomElement() {
      $(this.domElement).css('top', this.top);
      $(this.domElement).css('left', this.left);
    }

    remove(){
      $(this.domElement).remove();
    }

    // collidesWith(position){
    //   const collides = [];
    //   // 1. Checks everything in the global gameItems array
    //   // 2. Pushes anything that collides into the collides array
    //   return collides;
    // }

    // doesNotCollide(position) {
    //   return collidesWith(position).length === 0;
    // }

    move(direction) {
      const newPosition = {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height
      };

      const speed = this.movementSpeed;

      // console.log('the moving type is: ', this.type);
      switch(direction){
        case 'left':
          newPosition.left -= speed;
          this.direction = 'left';
          break;
        case 'right':
          newPosition.left += speed;
          this.direction = 'right';
          break;
        case 'up':
          newPosition.top -= speed;
          this.direction = 'up';
          break;
        case 'down':
          newPosition.top += speed;
          this.direction = 'down';
          break;
      }

      if(!positionIsOnBoard(newPosition.top, newPosition.left, this.width, this.height)){
        //console.log('new position not on board', newPosition);
        return false;
      }

      const overlappingObjects = objectOverlapsObjects(this, newPosition, gameItems);
      //console.log('the shooter at move is: ' + shooter);
      //console.log('the overlappingObj at move is: ', overlappingObjects[0].name);

      if(overlappingObjects){
        if(overlappingObjects[0].name !== 'Player 1'){
          console.log('new position overlaps another object', this);
          return overlappingObjects;
        }
      }

      //console.log('Moving to', newPosition);

      this.left = newPosition.left;
      this.top = newPosition.top;
      this.domElement.setAttribute('class', direction);
      return true;
    }
  }

  ///////////////- BULLET CONSTRUCTOR -////////////////////////
  /////////////////////////////////////////////////////////////
  class Bullet extends gameItem {
    constructor (tankPositionTop, tankPositionLeft, direction) {

      const width = 5;
      const height = 5;
      const bulletSpeed = 1.5;

      const element = document.createElement('div');
      element.classList.add('bullet');

      super(
        'bullet',
        tankPositionTop,
        tankPositionLeft,
        width,
        height,
        'bullet',
        element,
        bulletSpeed,
        direction
      );

      element.style.cssText = `
      margin: 2px;
      box-sizing: border-box;
      border: 1px solid black;
      position: absolute;
      background-color: red;
      top: ${tankPositionTop}px;
      left: ${tankPositionLeft}px;
      width: ${width}px;
      height: ${height}px;
      border-radius: 100%;`;


      this.damage = 5;
    }
  }

  //repeatedly moves a bullet accross the screen
  Bullet.prototype.fly = function(shooter) {
    console.log('the shooter at fly is: ', shooter);
    this.move(this.direction);

    setTimeout(() => {
      const moveResult = this.move(this.direction);
      if(!moveResult) {
        //console.log('bullet is within the board: ' + moveResult);
        this.remove();
        // Remove bullet! Is true when bullets hits the edge of the screen
      } else if (Array.isArray(moveResult)) {
        //console.log('shooter collides with bullet: '+ (shooter === moveResult[0].object.name));
        // if(shooter === moveResult[0].object.name){
        // }
        this.remove();
        console.log('bullet collided with another object: ', moveResult[0].object.name);
        //console.log('bullet was removed');
        // COLLISION!! returns an array of what bullet collided with.
      }else{
        this.fly(shooter);
      }
    }, 1.0 / 30.0);
  };
  // NOTE: NEED TO REMOVE THE BULLET FROM GAME ITEMS ON COLLISION
  ///UPDATING THE BULLETS METHOD FOR UPDATING THE DOM!!!
  Bullet.prototype.removeBullet = function () {
    // Remove bullet from DOM
    $(this.element).remove();
    // Remove bullet from the bullets array
    // NOTE: update this so we are looking at the gameItems array
  //  bullets = bullets.filter(bullet => bullet !== this);
  };

  // Bullet.prototype.reduceLife = function (target) {
  //   if(target === 'playerOne'){
  //     playerOneHealth -= this.damage;
  //     $playerOneHealth.attr('value', playerOneHealth);
  //   }else if (target === 'playerTwo'){
  //     playerTwoHealth -= this.damage;
  //     $playerTwoHealth.attr('value', playerTwoHealth);
  //   }
  // };

  /////- COLLISION DETECTION -/////////
  // Bullet.prototype.detectCollision = function(targetObj) {
  //   //console.log('Logged at detectCollision():', targetObj.tankPosition);
  //   if(positionsOverlap(this.bulletPosition, targetObj.tankPosition) ){
  //     this.collisionDetected = true;
  //     //console.log('Hit on ' + targetObj.name + ' detected: ' + this.collisionDetected);
  //     this.removeBullet();
  //     this.reduceLife(targetObj.name);
  //     checkForWin();
  //   }else if (positionsOverlap(this.bulletPosition, mountainPos)) {
  //     //console.log('Hit on ' + mountain.name + ' detected: ' + this.collisionDetected);
  //     this.removeBullet();
  //   }else{
  //     setTimeout(() => {
  //       this.detectCollision(targetObj);
  //     }, this.bulletSpeed);
  //
  //   }
  // };
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ///////////////- BULLET CONSTRUCTOR end -////////////////////////

  /////////////////- TANK CONSTRUCTOR -//////////////////////
  ///////////////////////////////////////////////////////////
  class Tank extends gameItem{
    constructor (startTop, startLeft, identity, colour, direction) {
      const width = 60;
      const height = 60;
      const name = identity;

      const element = document.createElement('div');
      element.classList.add('tank');

      element.style.cssText = `
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
      width: ${width}px;
      height: ${height}px;`;

      const imageStyle = 'style="position: relative; width: 101px; height: 25px; z-index: 1; padding-right: 20px;"';

      element.innerHTML = `<img ${imageStyle} src="styles/images/TopDown_soldier_tank_turrent.png">`;

      const movementPoints = 20;

      super(name, startTop, startLeft, width, height, 'tank', element, movementPoints, direction);

      this.health = 100;
    }
  }

  ////////- firing bullets -////////////
  Tank.prototype.addBullet = function (){
    //console.log('this at fired bullet is: ', this);
    const bullet = new Bullet(this.top + 65, this.left + 65, this.direction);
    //console.log('bullet given direction is: ' + this.direction);
    gameItems.push({object: bullet, type: 'bullet'});
    bullet.fly(this.name);
  };

  Tank.prototype.updateHealth = function (){
    this.health -= this.bullet.damage;
  };

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ///////////////- TANK CONSTRUCTOR end -////////////////////////

  ////////////////////////////////////////
  ///////- GLOBAL GAME CONTROL -//////////
  ////////////////////////////////////////

  gameItems.push({
    name: 'Player 1',
    object: new Tank(0, 0, 'Player 1', 'blue', 'right'),
    type: 'tank'
  });
  gameItems.push({
    name: 'Player 2',
    object: new Tank(battleFieldObj.dimensions.height - 60, battleFieldObj.dimensions.width - 60,
      'Player 2', 'red', 'left'),
    type: 'tank'
  });

  // let playerOneHealth = playerOne.health;
  // let playerTwoHealth = playerTwo.health;

  function updateDOM() {
    //console.log(gameItems);
    for (let i = 0; i < gameItems.length; i++) {
      gameItems[i].object.drawDomElement();
    }
  }
  //updateDOM();
  setInterval(() => updateDOM(), 1.0 / 30.0);

  //
  // function checkForWin () {
  //   if (playerOneHealth === 0){
  //     window.alert('Player Two Won');
  //   }
  //   if (playerTwoHealth === 0){
  //     window.alert('Player One Won');
  //   }
  // }

  //////- CHECKS FOR COLLISION -////////

  // Gives either an array of overlapping objects
  // or false if there are none.
  function objectOverlapsObjects(object, objNewPos, objectArray) {
    const overlapping = [];
    for (let i = 0; i < objectArray.length; i++) {
      // We don't check ourselves!
      if(object !== objectArray[i].object) {
        //console.log('removed itself from test: ' + object !== objectArray[i].object);
        // Do the positions overlap?
        if (positionsOverlap(objNewPos, objectArray[i].object)) {
          //console.log('check position overlap: ', object);
          overlapping.push(objectArray[i]);
        }
      }
    }
    if (overlapping.length) {
      return overlapping;
    } else {
      return false;
    }
  }

  function positionsOverlap(obj1, obj2) {
    const obj1right = obj1.left + obj1.width;
    const obj1bottom = obj1.top + obj1.height;
    const obj2right = obj2.left + obj2.width;
    const obj2bottom = obj2.top + obj2.height;

    const result = ((obj1right > obj2.left) && (obj1.left < obj2right)) &&
    ((obj1.top < obj2bottom) && (obj1bottom > obj2.top));
    //console.log('positions do overlap: ' + result);
    return result;
  }

  function positionIsOnBoard(top, left, width, height){
    const boardHeight = battleFieldObj.dimensions.height;
    const boardWidth = battleFieldObj.dimensions.width;

    return (top >= 0) && (left >= 0) &&
      ((top + height) <= boardHeight) && ((left + width) <= boardWidth);
  }

  //checks water and marsh first then passes to the Tank move methods
  // function checkForObsticals (tankObj, keyPress) {
  //   if(positionsOverlap(tankObj.tankPosition, waterPos)){
  //     //console.log('tank drove into water');
  //     window.alert(`Tank ${tankObj.name} drove into the water! GAME OVER!!!`);
  //     tankObj.moveTank(keyPress);
  //   }else if(positionsOverlap(tankObj.tankPosition, mountainPos)){
  //     console.log(`Tank ${tankObj.name} drove into a mountain`);
  //     tankObj.moveTank(keyPress);
  //   }else{
  //     tankObj.moveTank(keyPress);
  //   }
  // }


  //////- KEY DOWN IDENTIFIER -///////
  //use this to determine what key has been pressed and assign correct function
  function keyIdentifier(e){
    switch(e.originalEvent.key) {
      case 'ArrowDown':
        getPlayer(1).move('down');
        break;
      case 'ArrowUp':
        getPlayer(1).move('up');
        break;
      case 'ArrowLeft':
        getPlayer(1).move('left');
        break;
      case 'ArrowRight':
        getPlayer(1).move('right');
        break;
      case 'w':
        getPlayer(2).move('up');
        break;
      case 's':
        getPlayer(2).move('down');
        break;
      case 'd':
        getPlayer(2).move('right');
        break;
      case 'a':
        getPlayer(2).move('left');
        break;
      case ' ':
        getPlayer(1).addBullet();
        break;
      case 'Shift':
        getPlayer(2).addBullet();
        break;
    }


    // if(e.originalEvent.key === ' ' || e.originalEvent.key === 'Shift' )
    //   createBullet(e.originalEvent.key);
    // if(e.originalEvent.key === 'ArrowDown' ||
    //   e.originalEvent.key === 'ArrowUp' ||
    //   e.originalEvent.key === 'ArrowLeft' ||
    //   e.originalEvent.key === 'ArrowRight'){
    //   checkForObsticals(playerOne, e.originalEvent.key);
    // }
    // if(e.originalEvent.key === 'a' ||
    //   e.originalEvent.key === 'd' ||
    //   e.originalEvent.key === 's' ||
    //   e.originalEvent.key === 'w'){
    //   checkForObsticals(playerTwo, e.originalEvent.key);
    // }
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
/////////////////////////////////////////////////
///////////- OLD TANK MOVEMENT CODE - ////////////////
/////////////////////////////////////////////////


//
// Tank.prototype.moveTank = function (direction){
//   //this.updatePosition();
//   //console.log(targets);
//   //console.log(this.tankPosition);
//   switch(direction){
//     case 'ArrowUp':
//       return this.moveTankUp();
//     case 'w':
//       return this.moveTankUp();
//     case 'ArrowDown':
//       return this.moveTankDown();
//     case 's':
//       return this.moveTankDown();
//     case 'ArrowLeft':
//       return this.moveTankLeft();
//     case 'a':
//       return this.moveTankLeft();
//     case 'ArrowRight':
//       return this.moveTankRight();
//     case 'd':
//       return this.moveTankRight();
//   }
//   this.updateDomPosition();
// };

//
// Tank.prototype.updateDomPosition  = function() {
//   updateDOM(this.element, this.tankPosition);
// };
//
// Tank.prototype.moveTankUp = function () {
//   const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
//   newPos.top -= this.movementPoints;
//   newPos.bottom -= this.movementPoints;
//   if (!objectOverlapsObjects(newPos, this.obstacles())) {
//     // NOTE: now we're sure the newPos doesn't overlap anything!
//     // we can perform the move.
//   }
//   if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountainPos) ) {
//     if(this.tankPosition.top > battleFieldPos.top) {
//       this.tankPosition.top -= this.movementPoints;
//       this.tankPosition.bottom -= this.movementPoints;
//       // this.updateDomPosition();
//     }
//   }
//   $(this.element).attr('class', 'tank-90');
//   this.direction = 'up';
// };
//
// Tank.prototype.moveTankDown = function () {
//   const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
//   newPos.top += this.movementPoints;
//   newPos.bottom += this.movementPoints;
//   if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountainPos)) {
//     if(this.tankPosition.bottom < battleFieldPos.bottom){
//       this.tankPosition.top += this.movementPoints;
//       this.tankPosition.bottom += this.movementPoints;
//     }
//   }
//   $(this.element).attr('class', 'tank-270');
//   this.direction = 'down';
// };
//
// Tank.prototype.moveTankLeft = function () {
//   const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
//   newPos.left -= this.movementPoints;
//   newPos.right -= this.movementPoints;
//   if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountainPos)) {
//     if(this.tankPosition.left > battleFieldPos.left){
//       this.tankPosition.left -= this.movementPoints;
//       this.tankPosition.right -= this.movementPoints;
//     }
//   }
//   $(this.element).attr('class', 'tank-360');
//   this.direction = 'left';
// };
//
// Tank.prototype.moveTankRight = function () {
//   const newPos = Object.assign({}, this.tankPosition); // Make a deep copy of the object
//   newPos.left += this.movementPoints;
//   newPos.right += this.movementPoints;
//   console.log('moving right. newPos is', newPos);
//   if (!positionsOverlap(newPos, this.otherPlayer().tankPosition) && !positionsOverlap(newPos, mountainPos)) {
//     if(this.tankPosition.right < battleFieldPos.right){
//       this.tankPosition.left += this.movementPoints;
//       this.tankPosition.right += this.movementPoints;
//     }
//   }
//   $(this.element).attr('class', 'tank-180');
//   this.direction = 'right';
// };

// Tank.prototype.addTank = function (){
//   $(battleField).append(this.element);
// };

//update position by adding to x/y then updating the position in the DOM
//  --> movement should take the known location and add movement points to it [o]
//  --> function should then update the position of the element in the dom[o]



// Tank.prototype.otherPlayer = function() {
//   let otherPlayer = playerTwo;
//   if(this === playerTwo)  otherPlayer = playerOne;
//   return otherPlayer;
// };
