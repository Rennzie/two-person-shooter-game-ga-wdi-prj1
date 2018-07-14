//console.log('this is linked');

////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {
  const $tank = $('.tank');
  const $battleField = $('.battle-field');

  const battleField = {
    left: $battleField.offset().left,
    top: $battleField.offset().top,
    right: $battleField.offset().left + $battleField.width(),
    bottom: $battleField.offset().top + $battleField.height()
  };

  const tankOne = {
    currentPosition: {
      left: $tank.offset().left,
      top: $tank.offset().top,
      right: $tank.offset().left + $tank.width(),
      bottom: $tank.offset().top + $tank.height()
    },

    movementPoints: 50
  };

  ///////- MOVE TANK -//////////
  function tankMove(direction) {
    updatedPosition(tankOne, $tank);
    switch(direction){
      case 'ArrowUp':
        return moveTankUp();
      case 'ArrowDown':
        return moveTankDown();
      case 'ArrowLeft':
        return moveTankLeft();
      case 'ArrowRight':
        return moveTankRight();
    }
  }

  function moveTankUp () {
    if(tankOne.currentPosition.top - 10 > battleField.top)
      $tank.offset({top: $tank.offset().top - tankOne.movementPoints});
  }
  function moveTankDown () {
    if(tankOne.currentPosition.bottom < battleField.bottom)
      $tank.offset({top: $tank.offset().top + tankOne.movementPoints});
  }
  function moveTankLeft () {
    if(tankOne.currentPosition.left > battleField.left)
      $tank.offset({left: $tank.offset().left - tankOne.movementPoints});
  }
  function moveTankRight () {
    if(tankOne.currentPosition.right < battleField.right)
      $tank.offset({left: $tank.offset().left + tankOne.movementPoints});
  }



  ///////- ELEMENT POSITION UPDATER -/////////
  //to dynamically update the position of an animated element
  //(works when called as step in animateBullet())
  function updatedPosition(itemObj, itemDom){
    itemObj.currentPosition.left = itemDom.offset().left;
    itemObj.currentPosition.top = itemDom.offset().top;
    itemObj.currentPosition.right = itemDom.offset().left + itemDom.width();
    itemObj.currentPosition.bottom = itemDom.offset().top + itemDom.height();
    //targetCollision();
  }
  ///////- COLLISION DETECTION -/////////
  // function targetCollision () {
  //   if(bullet.right > tankOne.left){
  //     bullet.collisionDetected = true;
  //     console.log('HIT HIT HIT ' + bullet.collisionDetected);
  //   }
  // }

  ////////////////////////////////////
  ///////- APPEND BULLET AND REMOVE BULLET FROM BOARD -//////////
  ////////////////////////////////////
  //  --> append bullet by calling constructor [X]
  //  --> move the bullet across the screen by adding 10px to x value [X]
  //  --> continously do this with an interval of 100ms [X]
  //  --> test the position of the bullet every 100ms and see if still in the battleField [X]
  //  --> remove the element from the board when it hits the edge of the battle field [X]


  function Bullet() {
    this.placementPosition = {
      left: tankOne.currentPosition.left + 50,
      top: tankOne.currentPosition.top + 25
    };

    this.style = {
      width: 25,
      height: 10
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
      height: ${this.style.height}px;`;


    this.currentPosition = {
      left: this.placementPosition.left,
      top: this.placementPosition.top,
      right: this.placementPosition.left + this.style.width,
      bottom: this.placementPosition.top + this.style.height
    };

    this.bulletSpeed = 5;

    this.collisionDetected = false;
  }

  Bullet.prototype.updatePosition = function (){
    this.currentPosition.left = $(this.element).offset().left;
    this.currentPosition.top = $(this.element).offset().top;
    this.currentPosition.right = $(this.element).offset().left + this.style.width;
    this.currentPosition.bottom = $(this.element).offset().top + this.style.height;
    //targetCollision();
  };

  Bullet.prototype.addBullet = function (){
    $battleField.append(this.element);
  };

  Bullet.prototype.removeBullet = function () {
    $(this.element).remove();
  };

  Bullet.prototype.fireBullet = function() {
    updatedPosition(tankOne, $tank);
    this.updatePosition();
    $(this.element).offset({left: $(this.element).offset().left + 10});
    this.updatePosition();
    if(this.currentPosition.left > battleField.left &&
      this.currentPosition.right < battleField.right &&
      this.currentPosition.top > battleField.top &&
      this.currentPosition.bottom < battleField.bottom ){
      setTimeout( () => {
        this.fireBullet();
      }, this.bulletSpeed);
    } else {
      this.removeBullet();
      return;
    }
  };

  //to move bullet around screen and update its position object
  function createBullet() {
    const bullet = new Bullet;
    console.log(bullet.currentPosition);
    bullet.addBullet();
    bullet.fireBullet();

  }


  //////-KEY DOWN IDENTIFIER -///////
  //use this to determine what key has been pressed and assign correct function
  function keyIdentifier(e){
    //console.log(e);
    if(e.originalEvent.key === ' ') createBullet();
    if(e.originalEvent.key === 'ArrowDown' ||
      e.originalEvent.key === 'ArrowUp' ||
      e.originalEvent.key === 'ArrowLeft' ||
      e.originalEvent.key === 'ArrowRight') tankMove(e.originalEvent.key);
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
