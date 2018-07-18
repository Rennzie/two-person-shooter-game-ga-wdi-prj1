
////////////////////////////////////
///////- DOM INTERACTION -//////////
////////////////////////////////////

$(() => {

  const $body = $('body');
  //const $battleField = $('.battle-field');
  //const $playerOneHealth = $('#playerOneHealth');
  // const $playerTwoHealth = $('#playerTwoHealth');

  let gameItems = [];

  // function getGameItems(itemType) {
  //   return gameItems.filter(item => item.type === itemType);
  // }

  function getPlayer(number) {
    return gameItems.filter(item => item.name === `Player ${number}`)[0].object;
  }

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
      background-size: cover;`
  };

  ///////- Add battlefield and Obsticals-////////////

  const battleField = document.createElement('div');
  battleField.classList.add('battle-field');
  battleField.style.cssText = battleFieldObj.style;
  $body.append(battleField);



  //
  // class water extends gameItems {
  //   name: 'Water',
  //
  //   style: `
  //     position: absolute;
  //     top: 150px;
  //     left: 600px;
  //     width: 100px;
  //     height: 100px;
  //     background-image: url('styles/images/terrain-water-2.png');
  //     background-repeat: repeat;
  //     background-size: cover;`,
  //
  //   dimensions: {
  //     width: 100,
  //     height: 100
  //   }
  // }

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

      // NOTE: this will be where we decide what to do with other obsticals
      if(overlappingObjects){
        return overlappingObjects;
        // if(overlappingObjects[0].name !== 'Player 2'){
        //   //console.log('new position overlaps another object', this);
        // }
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
      const bulletSpeed = 2;

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
  Bullet.prototype.fly = function() {
    //console.log('the shooter at fly is: ', shooter);
    this.move(this.direction);

    setTimeout(() => {
      const moveResult = this.move(this.direction);
      if(!moveResult) {
        //console.log('bullet is within the board: ' + moveResult);
        this.remove();
        gameItems = gameItems.filter(gameItem => gameItem.object !== this);
        // Remove bullet! Is true when bullets hits the edge of the screen
      } else if (Array.isArray(moveResult)) {

        if(moveResult[0].object.name === 'Player 1'){
          getPlayer(1).health -= this.damage;
          console.log('Player 1s health is: '+ getPlayer(1).health);
        }else if(moveResult[0].object.name === 'Player 2'){
          getPlayer(2).health -= this.damage;
          console.log('Player 2s health is: '+ getPlayer(2).health);
        }

        this.remove();
        gameItems = gameItems.filter(gameItem => gameItem.object !== this);
        console.log(this);
        console.log('the game items are: ',gameItems);
        console.log('bullet collided with another object: ', moveResult[0].object.name);
        //console.log('bullet was removed');
        // COLLISION!! returns an array of what bullet collided with.
      }else{
        this.fly();
      }
    }, 1.0 / 30.0);
  };

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
    // const bullet = new Bullet(this.top + 30, this.left + 61, this.direction);
    const top = this.bulletStart(this.top, this.left, this.direction)[0];
    const left = this.bulletStart(this.top, this.left, this.direction)[1];

    const bullet = new Bullet(top, left, this.direction);
    console.log('bullet given direction is: ' + this.direction);
    gameItems.push({name: 'bullet', object: bullet, type: 'bullet'});
    bullet.fly(this.name);
  };

  Tank.prototype.updateHealth = function (){
    this.health -= this.bullet.damage;
  };

  Tank.prototype.bulletStart = function(top, left, direction){
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

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ///////////////- TANK CONSTRUCTOR end -////////////////////////
  class Mountain extends gameItem {
    constructor (startTop, startLeft) {
      const name = 'Mountain';
      const width = 100;
      const height = 100;

      const element = document.createElement('div');
      element.classList.add('tank');

      element.style.cssText = `
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${width}px;
      height: ${height}px;
      background-image: url('styles/images/terrain-mountain.jpg');
      background-repeat: repeat;
      background-size: cover;`;

      super(name, startTop, startLeft, width, height, 'obstical', element, 0, 0);
    }
  }

  class Water extends gameItem {
    constructor (startTop, startLeft) {
      const name = 'Water';
      const width = 100;
      const height = 100;

      const element = document.createElement('div');
      element.classList.add('tank');

      element.style.cssText = `
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${width}px;
      height: ${height}px;
      background-image: url('styles/images/terrain-water.png');
      background-repeat: repeat;
      background-size: cover;`;

      super(name, startTop, startLeft, width, height, 'obstical', element, 0, 0);
    }
  }

  class Marsh extends gameItem {
    constructor (startTop, startLeft) {
      const name = 'Water';
      const width = 100;
      const height = 100;

      const element = document.createElement('div');
      element.classList.add('tank');

      element.style.cssText = `
      position: absolute;
      top: ${startTop}px;
      left: ${startLeft}px;
      width: ${width}px;
      height: ${height}px;
      background-image: url('styles/images/terrain-wetland.jpg');
      background-repeat: repeat;
      background-size: cover;`;

      super(name, startTop, startLeft, width, height, 'obstical', element, 0, 0);
    }
  }
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

  gameItems.push({
    name: 'Mountain',
    object: new Mountain(100, 400),
    type: 'obstical'
  });

  gameItems.push({
    name: 'Mountain',
    object: new Water(300, 0),
    type: 'obstical'
  });

  gameItems.push({
    name: 'Mountain',
    object: new Marsh(30, 600),
    type: 'obstical'
  });

  function updateScore(){
    const $playerOneHealth = $('#playerOneHealth');
    const $playerTwoHealth = $('#playerTwoHealth');

    $playerOneHealth.attr('value', getPlayer(1).health);
    $playerTwoHealth.attr('value', getPlayer(2).health);
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

  // let playerOneHealth = playerOne.health;
  // let playerTwoHealth = playerTwo.health;
  //
  function checkForWin () {
    if (getPlayer(1).health === 0){
      window.alert('Player Two Won');
    }
    if (getPlayer(2).health === 0){
      window.alert('Player One Won');
    }
  }

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
  }

  $(window).keydown(keyIdentifier);
});
