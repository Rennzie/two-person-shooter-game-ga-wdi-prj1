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
//  -->continually log the xy to the console when moving [X]
//____________________________________
// const ;

//  get opponents position [X]
//  detect the collision on impact [X]
//  reduce the health of opponents tank. [X]
//  --> create an array and push position of tanks as object to that array.[o]
//  --> array updating needs to be dynamic [o]
//  --> use array to check if bullet has hit any specific target [o]
//  --> log the targets name to the console [o]
//  --> use this to decrease the life of the hit tank [o]
//  log the reduction to the consol. [o]
//  continously retrieve the opposite tanks position [X]



///////- COMPARE DIV 'A' TO 'B' -//////////
//  determine when one div is within another [boolean response] [X]
//  grab x/y from div A and B log to console and save as viables. [X]
//  compare position of a to position of b [X]
//  --> if A < B then log to console [X]


//  move a div across the screen by updating its x and y position [jquery? css? js?]


////////////////////////////////////
///////- TANK MOVE -//////////
////////////////////////////////////
//  make the tanks position relative [X]
//  grab tank element from the dom [X]
//  update the x position few pixels on up key press [X]
//  limit the movement of the tank to its container [X]
//  --> before moving tank, check its not withi the board [X]
//  --> update to position of the tank after every keypress [X]
//  --> this should stop the tank form moving in that direction [X]
// --> update position of tank at start of the on move function [X]

//Two tank objects
//  -> Need to contain:
//  --> Direction of current movement [boolean] [X]
//  --> health [X]
//  --> move independantly with different keys [X]
//  --> update code to build tanks from a constructor [o]
//    --> add one tank to screen feeding it starting coordinates [X]
//    --> Move the tank using arrow keys [X]
//    --> Fire bullets from the tank [X]
//    --> add a second tank onto the screen [X]
//    --> move the second tank idependantly [X]
//  --> must instantiate and fire bullets in the stated direction [X]









////////////////////////////////////
///////- APPEND BULLET AND REMOVE BULLET FROM BOARD -//////////
////////////////////////////////////
//  --> append bullet by calling constructor [X]
//  --> move the bullet across the screen by adding 10px to x value [X]
//  --> continously do this with an interval of 100ms [X]
//  --> test the position of the bullet every 100ms and see if still in the battleField [X]
//  --> remove the element from the board when it hits the edge of the battle field [X]
