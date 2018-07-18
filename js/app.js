////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {
  ////////////////////////////////////
  ///////- START SCREEN -//////////
  const header = document.querySelector('header');
  // NOTE: nothing too special, the screen is hidden when the enter key is pressed

  ////////////////////////////////////
  ///////- INSTRUCTION SCREEN -//////////
  const instrucScreen = document.querySelector('.game-start');
  const startBtn = document.querySelector('#begin-game');
  const selectObsticals = document.querySelector('#set-obsticals');
  const setObsticalNumber = parseInt(selectObsticals.options[selectObsticals.selectedIndex].value);
  // NOTE: need an onchange to grab this updated number when starting game

  // obsticalCount.addEventListener('change', () => {
  //   setObsticalNumber = event.target.value;
  //   console.log(setObsticalNumber);
  // });



  startBtn.addEventListener('click', startGame);

  ////////////////////////////////////
  ///////- BATTLEFIELD SCREEN -//////////

  function startGame(){
    instrucScreen.style.display = 'none';
    $main.show();
    addRandomObstical();
    // setTimeout(function () {
    // }, 2000);
  }

  const $main = $('.battle-screen');
  $main.cssText = 'display: none';

  let gameItems = [];

  function getPlayer(number) {
    return gameItems.filter(item => item.name === `Player ${number}`)[0].object;
  }

  const battleFieldObj = {
    width: 900,
    height: 700,

    style: `
      position: relative;
      justify-content: center;
      align-items: center;
      width: 900px;
      height: 700px;
      border-radius: 30px;
      background-image: url('styles/images/terrain-barren-crackedmud.png');
      background-repeat: repeat;
      background-size: cover;`
  };
  // margin: 25px auto 0 auto;


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

    move(direction) {
      const newPosition = {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height
      };

      const speed = this.movementSpeed;

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
        return false;
      }

      const overlappingObjects = objectOverlapsObjects(this, newPosition, gameItems);

      if(overlappingObjects){
        const collidedWith = overlappingObjects[0].object.name;
        const collidingItemType = this.type;

        console.log('the colliding object is: ' + collidingItemType);
        console.log('the overlappingObj at move is: ', collidedWith);

        if(collidedWith === 'Water' && collidingItemType === 'tank'){
          window.alert(`Game over! ${this.name} went into the water`);

        }else if((collidedWith === 'Water' || collidedWith === 'Marsh') && collidingItemType === 'bullet'){
          //const nothing = 'do nothing';
        }else if(collidedWith === 'Marsh' && collidingItemType === 'tank'){
          const stickFactor = overlappingObjects[0].object.movementSpeed;

          switch(direction){
            case 'left':
              newPosition.left += speed - stickFactor;
              this.direction = 'left';
              break;
            case 'right':
              newPosition.left -= speed - stickFactor;
              this.direction = 'right';
              break;
            case 'up':
              newPosition.top += speed - stickFactor;
              this.direction = 'up';
              break;
            case 'down':
              newPosition.top -= speed - stickFactor;
              this.direction = 'down';
              break;
          }
        }else{
          return overlappingObjects;
        }
      }

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
      const bulletSpeed = 1;

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

      //repeatedly moves a bullet accross the screen
      this.fly = function() {
        //console.log('the shooter at fly is: ', shooter);
        this.move(this.direction);

        setTimeout(() => {
          const moveResult = this.move(this.direction);
          if(!moveResult) {
            this.remove();
            gameItems = gameItems.filter(gameItem => gameItem.object !== this);
          } else if (Array.isArray(moveResult)) {

            if(moveResult[0].object.name === 'Player 1'){
              getPlayer(1).health -= this.damage;
            }else if(moveResult[0].object.name === 'Player 2'){
              getPlayer(2).health -= this.damage;
            }

            this.remove();
            gameItems = gameItems.filter(gameItem => gameItem.object !== this);
          }else{
            this.fly();
          }
        }, 1.0 / 30.0);
      };
    }
  }

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
      height: ${height}px;
      z-index: 1;`;

      const imageStyle = 'style="position: relative; width: 101px; height: 25px; z-index: 1; padding-right: 20px;"';

      element.innerHTML = `<img ${imageStyle} src="styles/images/TopDown_soldier_tank_turrent.png">`;

      const movementPoints = 50;

      super(name, startTop, startLeft, width, height, 'tank', element, movementPoints, direction);

      this.health = 100;

      ////////- firing bullets -////////////
      this.addBullet = function (){
        const top = this.bulletStart(this.top, this.left, this.direction)[0];
        const left = this.bulletStart(this.top, this.left, this.direction)[1];

        const bullet = new Bullet(top, left, this.direction);
        gameItems.push({name: 'bullet', object: bullet, type: 'bullet'});
        bullet.fly(this.name);
      };

      this.bulletStart = function(top, left, direction){
        switch(direction){
          case 'right':
            return [top + 33, left + 61];
          case 'left':
            return [top + 33, left - 10];
          case 'up':
            return [top - 10, left + 33];
          case 'down':
            return [top + 61, left + 33];
        }
      };
    }
  }

  ///////////////- OBSTICAL CONSTRUCTORS -////////////////////////
  ////////////////////////////////////////////////////////////////
  class Mountain extends gameItem {
    constructor (startTop, startLeft) {
      const name = 'Mountain';
      const width = 100;
      const height = 100;

      const element = document.createElement('div');
      element.classList.add('.fade-in');

      element.style.cssText = `
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${width}px;
      height: ${height}px;
      background-image: url('styles/images/terrain-mountain.jpg');
      background-repeat: repeat;
      background-size: cover;
      border-radius: 100%;`;

      super(name, startTop, startLeft, width, height, 'obstical', element, 0, 0);
    }
  }

  class Water extends gameItem {
    constructor (startTop, startLeft) {
      const name = 'Water';
      const width = 100;
      const height = 100;
      const waterRadius = Math.random() * 100;

      const element = document.createElement('div');
      element.classList.add('.fade-in');

      element.style.cssText = `
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${width}px;
      height: ${height}px;
      border-radius: ${waterRadius}%;
      background-image: url('styles/images/terrain-water-3.jpg');
      background-repeat: repeat;
      background-size: cover;`;

      super(name, startTop, startLeft, width, height, 'obstical', element, 0, 0);
    }
  }

  class Marsh extends gameItem {
    constructor (startTop, startLeft) {
      const name = 'Marsh';
      const width = 100;
      const height = 100;
      const stickFactor = 4;

      const element = document.createElement('div');
      element.classList.add('.fade-in');

      element.style.cssText = `
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${width}px;
      height: ${height}px;
      background-image: url('styles/images/terrain-wetland.jpg');
      background-repeat: repeat;
      background-size: cover;`;

      super(name, startTop, startLeft, width, height, 'obstical', element, stickFactor, 0);
    }
  }

  ////////////////////////////////////////
  ///////- GLOBAL GAME CONTROL -//////////
  ////////////////////////////////////////

  ///////- Add battlefield and obsticals-////////////

  const battleField = document.createElement('div');
  battleField.classList.add('battle-field');
  battleField.style.cssText = battleFieldObj.style;
  $main.append(battleField);

  // add board items
  gameItems.push({
    name: 'Player 1',
    object: new Tank(0, 0, 'Player 1', 'blue', 'right'),
    type: 'tank'
  });
  gameItems.push({
    name: 'Player 2',
    object: new Tank(battleFieldObj.height - 60, battleFieldObj.width - 60,
      'Player 2', 'red', 'left'),
    type: 'tank'
  });



  function addRandomObstical() {
    const obsticalTypes = ['Mountain', 'Water', 'Marsh'];
    console.log('Value selected on instruc page: ' + setObsticalNumber);

    for( let i = 0; i < setObsticalNumber; i++ ){
      const randomObsticalIndex = Math.floor(Math.random() * obsticalTypes.length);
      const randomObstical = obsticalTypes[randomObsticalIndex];
      let randomTop = Math.floor(Math.random() * battleFieldObj.height);
      let randomLeft = Math.floor(Math.random() * battleFieldObj.width);

      //top and bottom must be > 0 and less than width/height -100
      if(randomTop < 0 ) randomTop += 101;
      if(randomLeft < 0 ) randomLeft += 101;
      if(randomTop > (battleFieldObj.height - 100)) randomTop -= 101;
      if(randomLeft > (battleFieldObj.width - 100)) randomLeft -= 101;

      let object = null;

      switch(randomObstical){
        case 'Mountain':
          object = new Mountain(randomTop, randomLeft);
          break;
        case 'Water':
          object = new Water(randomTop, randomLeft);
          break;
        case 'Marsh':
          object = new Marsh(randomTop, randomLeft);
          break;
      }

      gameItems.push({
        name: randomObstical,
        object: object,
        type: 'obstical'
      });
    }
    console.log(gameItems);
  }

  function updateScore(){
    const $playerOneHealth = $('#playerOneHealth');
    const $playerTwoHealth = $('#playerTwoHealth');

    $playerOneHealth.css('width', `${getPlayer(1).health}%`);
    $playerTwoHealth.css('width', `${getPlayer(2).health}%`);
  }

  function checkForWin () {
    if (getPlayer(1).health === 0){
      window.alert('Player Two Won');
    }
    if (getPlayer(2).health === 0){
      window.alert('Player One Won');
    }
  }

  function updateDOM() {
    //console.log(gameItems);
    for (let i = 0; i < gameItems.length; i++) {
      gameItems[i].object.drawDomElement();
    }
    updateScore();
    checkForWin();
  }
  setInterval(() => updateDOM(), 1.0 / 30.0);

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
    const boardHeight = battleFieldObj.height;
    const boardWidth = battleFieldObj.width;

    return (top >= 0) && (left >= 0) &&
      ((top + height) <= boardHeight) && ((left + width) <= boardWidth);
  }

  //////////////////- KEY PRESS CONTROLL -//////////////////////
  //////////////////////////////////////////////////////////////
  //to determine what key has been pressed and assign correct function

  //start interval on key down which calls the move FUNCTION

  // NOTE: appears to be a bug with the player 2 movement
  //which causes the players tank to glitch and move on its own
  const keyState = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    s: false,
    w: false,
    a: false,
    d: false
  };

  function keyDownIdentifier(e){
    const key = e.originalEvent.key;
    console.log(key);
    if(!keyState[key]){
      switch(key) {
        case 'ArrowDown':
          keyState[key] = true;
          moveDownA('down');
          break;
        case 'ArrowUp':
          keyState[key] = true;
          moveUpA('up');
          break;
        case 'ArrowLeft':
          keyState[key] = true;
          moveLeftA('left');
          break;
        case 'ArrowRight':
          keyState[key] = true;
          moveRightA('right');
          break;
        case 'w':
          keyState[key] = true;
          moveUpK('up');
          break;
        case 's':
          keyState[key] = true;
          moveDownK('down');
          break;
        case 'd':
          keyState[key] = true;
          moveRightK('right');
          break;
        case 'a':
          keyState[key] = true;
          moveLeftK('left');
          break;
        case ' ':
          getPlayer(1).addBullet();
          break;
        case 'Shift':
          getPlayer(2).addBullet();
          break;
        case 'Enter':
          header.style.display = 'none';
          instrucScreen.style.display = 'flex';
          break;
      }
    }

  }

  let downIntId = '';
  let upIntId = '';
  let leftIntId = '';
  let rightIntId = '';
  let sIntId = '';
  let wIntId = '';
  let aIntId = '';
  let dIntId = '';

  function moveDownA (direction){
    downIntId = setInterval(()=>{
      getPlayer(1).move(direction);
    }, 100);
  }
  function moveUpA (direction){
    upIntId = setInterval(()=>{
      getPlayer(1).move(direction);
    }, 100);
  }
  function moveLeftA (direction){
    leftIntId = setInterval(()=>{
      getPlayer(1).move(direction);
    }, 100);
  }
  function moveRightA (direction){
    rightIntId = setInterval(()=>{
      getPlayer(1).move(direction);
    }, 100);
  }
  function moveDownK (direction){
    sIntId = setInterval(()=>{
      getPlayer(2).move(direction);
    }, 100);
  }
  function moveUpK (direction){
    wIntId = setInterval(()=>{
      getPlayer(2).move(direction);
    }, 100);
  }
  function moveLeftK (direction){
    aIntId = setInterval(()=>{
      getPlayer(2).move(direction);
    }, 100);
  }
  function moveRightK (direction){
    dIntId = setInterval(()=>{
      getPlayer(2).move(direction);
    }, 100);
  }

  //clear the key down interval on key up
  function keyUpIdentifier(e) {
    const key = e.originalEvent.key;
    switch(e.originalEvent.key) {
      case 'ArrowDown':
        clearInterval(downIntId);
        keyState[key] = false;
        break;
      case 'ArrowUp':
        clearInterval(upIntId);
        keyState[key] = false;
        break;
      case 'ArrowLeft':
        clearInterval(leftIntId);
        keyState[key] = false;
        break;
      case 'ArrowRight':
        clearInterval(rightIntId);
        keyState[key] = false;
        break;
      case 's':
        clearInterval(sIntId);
        keyState[key] = false;
        break;
      case 'w':
        clearInterval(wIntId);
        keyState[key] = false;
        break;
      case 'a':
        clearInterval(aIntId);
        keyState[key] = false;
        break;
      case 'd':
        clearInterval(dIntId);
        keyState[key] = false;
        break;
    }
  }


  $(window).keydown(keyDownIdentifier);
  $(window).keyup(keyUpIdentifier);
});
