//console.log('this is linked');
///////////////////////////////////////
///////- COLLISION DETECTION -/////////
///////////////////////////////////////

///////- DIV MOVE AND X/Y LOG -////////
//  log the position of a div   [X]
//  -->save the xy of a div to a variable [X]
//  -->determine the current position of a div x/y [log it to the console] [X]
//  -->move the div and relog the position to the console [X]
//----
//  move the div on its own [X]
//  -->continually log the xy to the console when moving
//____________________________________
// const ;




///////- COMPARE DIV 'A' TO 'B' -//////////
//  determine when one div is within another [boolean response]
//  grab x/y from div A and B log to console and save as viables.
//  compare position of a to position of b
//  --> if A < B then log to console


//  move a div across the screen by updating its x and y position [jquery? css? js?]


////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {
  const $bullet = $('.bullet');
  const $tank = $('.tank');

  const tankPosition = {
    minX: $tank.offset().left,
    minY: $tank.offset().top,
    maxX: $tank.offset().left + $tank.width(),
    maxY: $tank.offset().top + $tank.height()
  };

  const bulletPosition = {
    minX: $bullet.offset().left,
    minY: $bullet.offset().top,
    maxX: $bullet.offset().left + $bullet.width(),
    maxY: $bullet.offset().top + $bullet.height()
  };

  window.requestAnimationFrame(updatedPosition);



  //prints position of boxes saved in object
  function printXy () {
    console.log('tank minX: ' + tankPosition.minX);
    console.log('tank minY: ' + tankPosition.minY);
    console.log('bullet minX: ' + bulletPosition.minX);
    console.log('bullet minY: ' + bulletPosition.minY);
  }

  //to dynamically update the position of an animated element (currently not working)
  function updatedPosition(){
    bulletPosition.minX = $bullet.offset().left;
    bulletPosition.minY = $bullet.offset().top;
    bulletPosition.maxX = $bullet.offset().left + $bullet.width();
    bulletPosition.maxY = $bullet.offset().top + $bullet.height();
    console.log(bulletPosition.minX);
  }


  function animateBullet() {
    $bullet.animate({
      left: '100%'
    }, {
      duration: 1000,
      step: updatedPosition,
      complete: printXy
    });

    printXy();
  }

  // $(function() {
  //   $(".mydiv").animate({
  //     left :"0px"
  //   }, {
  //     duration : 1234,
  //     start : function (promise) {
  //       console.log($(".mydiv").position().left);
  //     },
  //     step : function (now, tween) {
  //       console.log($(".mydiv").position().left);
  //     },
  //     progress : function (promise) {
  //       console.log($(".mydiv").position().left);
  //     },
  //     complete : function () {
  //       $(this).animate({left:"0px"}, 1234)
  //     }
  //   });
  // });


  $bullet.on('click', animateBullet);
});



////////////////////////////////////
///////- CODE GRAVEYARD -///////////
////////////////////////////////////

// interval timer to change x/y of a selected div
// function startInterval() {
//   const intervalId = setInterval(changeXy, 1000);
//   setTimeout(() => {
//     clearInterval(intervalId);
//   }, 10000);
// }
//function thats run in above interval
// function changeXy () {
//   $bullet.offset({left: $bullet.offset().left + 50 });
//   printXy();
// }
