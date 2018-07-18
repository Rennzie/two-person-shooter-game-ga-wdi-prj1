
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

//////- OLD REDUCE LIFE FUNCTION --//////
// Bullet.prototype.reduceLife = function (target) {
//   if(target === 'playerOne'){
//     playerOneHealth -= this.damage;
//     $playerOneHealth.attr('value', playerOneHealth);
//   }else if (target === 'playerTwo'){
//     playerTwoHealth -= this.damage;
//     $playerTwoHealth.attr('value', playerTwoHealth);
//   }
// };


//////////- OLD KEY IDENTIFIER FUNCTION -///////////////////

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


///UPDATING THE BULLETS METHOD FOR UPDATING THE DOM!!!
// Bullet.prototype.removeBullet = function () {
//   // Remove bullet from DOM
//   $(this.element).remove();
//   // Remove bullet from the bullets array
//   // NOTE: update this so we are looking at the gameItems array
// };



/////////////- COLLISION DETECTION -/////////
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
