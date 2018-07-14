//console.log('this is linked');
////////////////////////////////////
///////- TANK MOVE -//////////
////////////////////////////////////
//  make the tanks position relative [X]
//  grab tank element from the dom [X]
//  update the x position few pixels on up key press [X]
//  limit the movement of the tank to its container [o]
//  --> before moving tank, check its not withi the board
//  --> update to position of the tank after every keypress
//  --> this should stop the tank form moving in that direction


// --> update position of tank at start of the on move function
//
// --> on append of bullet, start an interval which runs update position function every millisecond
// --> interval runs function which check bullets position against position of opponent tank
// --> Interval will run while bullet is with battle field parameters of until it hits a tank
// --> once it breaks the while loop, bullet is removed if at edge of battle field or explode if hits target




////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {
  const $bullet = $('.bullet');
  const $tank = $('.tank');
  const $battleField = $('.battle-field');

  const battleField = {
    left: $battleField.offset().left,
    top: $battleField.offset().top,
    right: $battleField.offset().left + $battleField.width(),
    bottom: $battleField.offset().top + $battleField.height()
  };

  const tankOne = {
    position: {
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
    if(tankOne.position.top - 10 > battleField.top)
      $tank.offset({top: $tank.offset().top - tankOne.movementPoints});
  }
  function moveTankDown () {
    if(tankOne.position.bottom < battleField.bottom)
      $tank.offset({top: $tank.offset().top + tankOne.movementPoints});
  }
  function moveTankLeft () {
    if(tankOne.position.left > battleField.left)
      $tank.offset({left: $tank.offset().left - tankOne.movementPoints});
  }
  function moveTankRight () {
    if(tankOne.position.right < battleField.right)
      $tank.offset({left: $tank.offset().left + tankOne.movementPoints});
  }


  const bullet = {
    left: $bullet.offset().left,
    top: $bullet.offset().top,
    right: $bullet.offset().left + $bullet.width(),
    bottom: $bullet.offset().top + $bullet.height(),
    collisionDetected: false
  };


  ///////- COLLISION DETECTION -/////////

  //to dynamically update the position of an animated element
  //(works when called as step in animateBullet())
  function updatedPosition(itemObj, itemDom){
    itemObj.position.left = itemDom.offset().left;
    itemObj.position.top = itemDom.offset().top;
    itemObj.position.right = itemDom.offset().left + itemDom.width();
    itemObj.position.bottom = itemDom.offset().top + itemDom.height();
    targetCollision();
  }

  function targetCollision () {
    if(bullet.right > tankOne.left){
      bullet.collisionDetected = true;
      console.log('HIT HIT HIT ' + bullet.collisionDetected);
    }
  }

  //to move bullet around screen and update its position object
  function animateBullet() {
    console.log('I fired');
    $bullet.animate({
      left: '100%'
    }, {
      duration: 1000,
      step: updatedPosition
    });
  }

  //////-KEY DOWN IDENTIFIER -///////
  //use this to determine what key has been pressed and assign correct function
  function keyIdentifier(e){
    //console.log(e);
    if(e.originalEvent.key === ' ') animateBullet();
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
