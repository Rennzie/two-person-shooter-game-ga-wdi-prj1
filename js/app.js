//console.log('this is linked');

////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {
  const $battleField = $('.battle-field');
  const $tank = $('.tank');
  const $tank2 = $('.tank2');
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

  const tankTwo = {
    life: 100,

    currentPosition: {
      left: $tank2.offset().left,
      top: $tank2.offset().top,
      right: $tank2.offset().left + $tank.width(),
      bottom: $tank2.offset().top + $tank.height()
    }
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

  ///////////////- BULLET CONSTRUCTOR -////////////////////////
  /////////////////////////////////////////////////////////////
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

  //refreshes the current xy coords of a bullet
  Bullet.prototype.updatePosition = function (){
    this.currentPosition.left = $(this.element).offset().left;
    this.currentPosition.top = $(this.element).offset().top;
    this.currentPosition.right = $(this.element).offset().left + this.style.width;
    this.currentPosition.bottom = $(this.element).offset().top + this.style.height;
    this.detectCollision();
  };

  Bullet.prototype.addBullet = function (){
    $battleField.append(this.element);
  };

  Bullet.prototype.removeBullet = function () {
    $(this.element).remove();
  };

  //repeatedly moves a bullet accross the screen
  Bullet.prototype.fireBullet = function() {
    updatedPosition(tankOne, $tank);
    this.updatePosition();
    $(this.element).offset({left: $(this.element).offset().left + 10});
    this.updatePosition();
    if(this.currentPosition.left > battleField.left &&
      this.currentPosition.right < battleField.right &&
      this.currentPosition.top > battleField.top &&
      this.currentPosition.bottom < battleField.bottom &&
      !this.collisionDetected){
      setTimeout( () => {
        this.fireBullet();
      }, this.bulletSpeed);
    } else {
      this.removeBullet();
      return;
    }
  };

  ///////- COLLISION DETECTION -/////////
  Bullet.prototype.detectCollision = function() {
    if(this.currentPosition.left > tankTwo.currentPosition.left &&
      this.currentPosition.right < tankTwo.currentPosition.right &&
      this.currentPosition.top > tankTwo.currentPosition.top &&
      this.currentPosition.bottom < tankTwo.currentPosition.bottom ){

      this.collisionDetected = true;
      tankTwo.life -= 5;
      console.log('Tank health: ' + tankTwo.life);
    }
  };
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ///////////////- BULLET CONSTRUCTOR -////////////////////////


  //to instantiate a new bullet and fire it across the screen
  function createBullet() {
    const bullet = new Bullet;
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
