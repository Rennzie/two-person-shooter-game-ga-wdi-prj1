console.log('this is linked');
///////////////////////////////////////
///////- COLLISION DETECTION -/////////
///////////////////////////////////////

///////- DIV MOVE AND X/Y LOG -////////
//  log the position of a div   [X]
//  -->save the xy of a div to a variable
//  -->determine the current position of a div x/y [log it to the console]
//  -->move the div and relog the position to the console
//----
//  move the div on its own
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

  $bullet.on('click', function() {
    console.log($bullet);
    console.log('min-x position is: ' + this.offsetLeft);
    console.log('min-y position is: ' + this.offsetTop);
    console.log('max-x position is: ' + this.offsetWidth);
    console.log('max-y position is: ' + this.offsetHeight);
  });
});
