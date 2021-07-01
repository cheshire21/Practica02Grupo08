/* -------------------------------------------------------------------------------
This code is licensed under MIT License.

Copyright (c) 2019 I Putu Prema Ananda D.N

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
---------------------------------------------------------------------------------- */

let tree = null;
let controlDiv;
let controlBar;
let insertForm;
let insertButton;
let deleteForm;
let deleteButton;
let searchForm;
let searchButton;
let minButton;
let lastMsg = '';
let printOutput = '';
let value;
let AVL;
let payload;

function enableUI() {
  insertForm.removeAttribute('disabled');
  insertButton.removeAttribute('disabled');
  deleteForm.removeAttribute('disabled');
  deleteButton.removeAttribute('disabled');
  searchForm.removeAttribute('disabled');
  searchButton.removeAttribute('disabled');
  minButton.removeAttribute('disabled');
}

function disableUI() {
  insertForm.attribute('disabled', '');
  insertButton.attribute('disabled', '');
  deleteForm.attribute('disabled', '');
  deleteButton.attribute('disabled', '');
  searchForm.attribute('disabled', '');
  searchButton.attribute('disabled', '');
  minButton.attribute('disabled', '');
}

function displayNode(curr) {
  if (curr != null) {
    ellipseMode(CENTER);
    textAlign(CENTER);
    stroke('black');
    strokeWeight(3);
    if (curr.left != null) line(curr.x, curr.y, curr.left.x, curr.left.y);
    if (curr.right != null) line(curr.x, curr.y, curr.right.x, curr.right.y);
    noStroke();
    fill('red');
    if (curr.highlighted) ellipse(curr.x, curr.y, 40, 40);

    fill(209, 227, 79);

    ellipse(curr.x, curr.y, 30, 30);
    fill('black');
    text(curr.data, curr.x, curr.y + 5);
    displayNode(curr.left);
    displayNode(curr.right);
  }
}


function insert() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(insertForm.value(), 10);
  insertForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['Insert', value, width];
  AVL.postMessage(payload); // send message 'Insert', inputted value and canvas width to ask the Tree to insert new element
  AVL.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the AVL so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the AVL after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function del() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(deleteForm.value(), 10);
  deleteForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['Delete', value];
  AVL.postMessage(payload); // send message 'Delete' and inputted value to ask the Tree to delete an element
  AVL.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the AVL so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the AVL after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function find() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(searchForm.value(), 10);
  searchForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['Find', value];
  AVL.postMessage(payload); // send message 'Find' and inputted value to ask the Tree to find an element
  AVL.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the AVL so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the AVL after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
  
}
function val_min() {
  lastMsg = '';
  printOutput = '';
  //value = parseInt(searchForm.value(), 10);
  //searchForm.value('');
  //if (isNaN(value) === true) return undefined;
  disableUI();
  value=0;
  payload = ['Min', value];
  AVL.postMessage(payload); // send message 'Find' and inputted value to ask the Tree to find an element
  AVL.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the AVL so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the AVL after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function addControls(type, name, onClick) {
  let element;
  switch (type) {
    case 'Input':
      element = createInput();
      element.size(60);
      break;
    case 'Button':
      element = createButton(name);
      element.mousePressed(onClick);
      break;
    case 'Slider':
      element = createSlider(-2000, -500, -1000, 20);
      element.mouseReleased(onClick);
      element.touchEnded(onClick);
      break;
    case 'Label':
      element = createP(name);
      element.class('control-label');
      break;
    default: break;
  }
  const tableEntry = createElement('td');
  tableEntry.child(element);

  controlBar.child(element);

  
  return element;
}

function setup() {
  // INITIALIZE WEB WORKER THREAD FOR THE TREE ALGORITHM AND VISUALIZATION
  AVL = new Worker('AVL.js');

  // BEGIN VISUALIZATION CONTROLS STUFF
  controlBar = createDiv();//crea una etiqueta tabla
  controlBar.parent('mainContent');//coloca el div dentro del div con nombre maincontent

  controlDiv = createDiv();//crea un div 
  controlDiv.parent('mainContent');//coloca el div dentro del div con nombre maincontent
  controlDiv.id('controlSection'); // pone un id 
  
  controlBar.id('controles'); // pone un id 
  controlDiv.child(controlBar); //coloca la table dentro del Div anterior
  insertForm = addControls('Input', '', ''); //crea in textbox
  insertButton = addControls('Button', 'Insert', insert);
  deleteForm = addControls('Input', '', '');
  deleteButton = addControls('Button', 'Delete', del);
  searchForm = addControls('Input', '', '');
  searchButton = addControls('Button', 'Find', find);
  minButton = addControls('Button', 'MinValor', val_min);
  // END VISUALIZATION CONTROLS STUFF

  // SET CANVAS AND TEXT SIZE
  const canvas = createCanvas(1024, 500);
  canvas.parent('mainContent');
  textSize(15);
}

function draw() {
  background('white');
  displayNode(tree);
  fill('black');
  textAlign(LEFT);
  text(lastMsg, 30, 50);
  text(printOutput, 30, 70);
}
