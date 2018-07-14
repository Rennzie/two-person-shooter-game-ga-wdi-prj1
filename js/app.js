//console.log('this is linked');
////////////////////////////////////
///////- TANK MOVE -//////////
////////////////////////////////////
//  make the tanks position relative [X]
//  grab tank element from the dom [X]
//  update the x position few pixels on up key press [X]
//  limit the movement of the tank to its container [o]
//  --> xy should not exceede that of the container
//  --> this should stop the tank form moving in that direction


////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {
  const $bullet = $('.bullet');
  const $tank = $('.tank');

  function tankMove(direction) {
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
    return $tank.offset({top: $tank.offset().top - 50});
  }
  function moveTankDown () {
    return $tank.offset({top: $tank.offset().top + 50});
  }
  function moveTankLeft () {
    return $tank.offset({left: $tank.offset().left - 50});
  }
  function moveTankRight () {
    return $tank.offset({left: $tank.offset().left + 50});
  }

  const tankOne = {
    minX: $tank.offset().left,
    minY: $tank.offset().top,
    maxX: $tank.offset().left + $tank.width(),
    maxY: $tank.offset().top + $tank.height()
  };

  const bullet = {
    minX: $bullet.offset().left,
    minY: $bullet.offset().top,
    maxX: $bullet.offset().left + $bullet.width(),
    maxY: $bullet.offset().top + $bullet.height(),
    collisionDetected: false
  };


  ///////- COLLISION DETECTION -/////////

  //to dynamically update the position of an animated element
  //(works when called as step in animateBullet())
  function updatedPosition(){
    bullet.minX = $bullet.offset().left;
    bullet.minY = $bullet.offset().top;
    bullet.maxX = $bullet.offset().left + $bullet.width();
    bullet.maxY = $bullet.offset().top + $bullet.height();
    targetCollision();
  }

  function targetCollision () {
    if(bullet.maxX > tankOne.minX){
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
    console.log(e);
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
