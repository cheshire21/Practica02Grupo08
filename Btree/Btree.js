let root = null;
let lastState = null;
let msg = '';
let printOutput = '';
let canvasWidth;
let delay = 1000;

class Node {
  constructor(degree, parent) {
    this.degree = degree;
    this.parent = parent;
    this.keys = [];
    this.childs = [];
  }
}

// DELAY CODE EXECUTION FOR SPECIFIED MILLISECONDS
function sleep(ms) {
  const start = Date.now();
  while (Date.now() < start + ms);
}

function unhighlightAll(node) {
  if (node !== null) {
    node.highlighted = false;
    unhighlightAll(node.left);
    unhighlightAll(node.right);
  }
}


function search(node, key) {
  if (node.childs.length == 0){
    if(node.keys.find(element => element == key) != undefined){
      msg = 'Se encontro el elemento ' +key ;
      return ;
    }else{
      msg = 'No se encontro el elemento ' +key ;
      return ;
    }
  }
  let i = 0;
    while (key > node.keys[i] && i < node.keys.length) {
      i += 1;
      if (key == node.keys[i]){
        msg = 'Se encontro el elemento ' +key ;
        
      }
    }
    if (node.childs[i]) {
      search(node.childs[i],key);
    }
}

// BUSCANDO EL MÍNIMO ELEMENTO EN EL B-TREE
function minimo_value(node) {
  
 if(node.childs.length !== 0) {
    msg = 'El minimo atual es ' + node.keys[0] + '. nos vamos a la última página.';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return minimo_value(node.childs[0])
  }
  else{
    msg = 'El minimo final es: ' + node.keys[0] + ' ';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return node.keys[0];    
  }
}

// BUSCANDO EL MÁXIMO ELEMENTO EN EL B-TREE
function max_value(node) {  
if(node.childs.length !== 0) {
    msg = 'El máximo atual es ' + node.keys[(node.keys.length-1)] + '. nos vamos a la última página.';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return max_value(node.childs[(node.childs.length-1)]);
  }
  else{
    msg = 'El máximo final es: ' + node.keys[(node.keys.length-1)] + ' ';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return node.keys[(node.keys.length-1)];    
  }
}

function pop(startingNode, key) {
  // 
}
function split(node) {
  if (node.keys.length !== node.degree - 1) {
    return;
  }
  lastMsg = 'dividiendo nodo';
  const medianIndex = node.degree/2 - 1;
  const leftChild = new Node(node.degree, node);
  const rightChild = new Node(node.degree, node);
  node.childs.forEach((child, index) => {
    if (index <= medianIndex) {
      child.parent = leftChild;
      leftChild.childs.push(child);
    } else {
      child.parent = rightChild;
      rightChild.childs.push(child);
    }
  });

  node.keys.forEach((key, index) => {
    if (index < medianIndex) {
      leftChild.keys.push(key);
    } else if (index > medianIndex) {
      rightChild.keys.push(key);
    }
  });

  const medianKey = node.keys[medianIndex];
  const parent = node.parent;
  if (!parent) {
    console.log('Este nodo es raiz')
    node.keys = [medianKey];
    node.childs = [leftChild, rightChild];
  } else {
    rightChild.parent = parent;
    leftChild.parent = parent;
    const childIndex = parent.childs.findIndex((c) => c == node);
    node.parent.childs[childIndex] = leftChild;
    node.parent.childs.splice(childIndex + 1, 0, rightChild);
    let i;
    for (i = 0; i < parent.keys.length; i++) {
      if (parent.keys[i] >= medianKey) {
        break;
      }
    }
    node.parent.keys.splice(i, 0, medianKey);
  }
  return { medianKey, leftChild, rightChild };
}
function push(node,value) {
  if (node == null){
    node = new Node(4);
  }
  // this.log();
  if (node.keys.length === node.degree- 1) {
    const { medianKey, rightChild, leftChild } = split(node);
    if (value > medianKey) {
      push(rightChild,value);
    } else {
      push(leftChild,value);
    }
  } else {
    let i = 0;
    while (value > node.keys[i] && i < node.keys.length) {
      i += 1;
    }
    if (node.childs[i]) {
      
      push(node.childs[i],value);
    } else {
      msg = 'Insercion en nodo hoja ';
      node.keys.push(value);
      node.keys.sort(function(a, b) {
        return a - b;
      });
    }
  }
  return node;
}

self.addEventListener('message', (event) => {
  switch (event.data[0]) {
    case 'Insert': {
      const value = event.data[1]; 
      canvasWidth = event.data[2];
      root = push(root, value); 
      self.postMessage([root, msg, 'Finished']); 
      break;
    }
    case 'Delete': {
      const key = event.data[1]; 
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']);
      }
      else {
        root = pop(root, key); 
        updatePosition(root); 
        self.postMessage([root, msg, 'Finished']); 
      }
      break;
    }
    case 'Find': {
      const key = event.data[1]; 
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']); 
      }
      else {
        search(root, key); 
        self.postMessage([root, msg, 'Finished']); 
      }
      break;
    }
    case 'Minimo': {
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']);
      }
      else {
        minimo_value(root);
        self.postMessage([root, msg, 'Finished']); 
      }
      break;    
    }
    case 'Maximo': {
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']);
      }
      else {
        max_value(root);
        self.postMessage([root, msg, 'Finished']); 
      }
      break;    
    }
    
    default: break;
  }
});
