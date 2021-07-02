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


function search(curr, key) {
  if (!curr) {
    msg = 'Buscando ' + key + ' : (Elemento no encontrado)';
    self.postMessage([root, msg, '']);
    return 0;
  }
  unhighlightAll(root);
  curr.highlighted = true;
  self.postMessage([root, msg, '']);
  if (key < curr.data) { 
    msg = 'Buscando ' + key + ' : ' + key + ' < ' + curr.data + '. Se va por el subarbol izquierdo.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    search(curr.left, key);
  }
  else if (key > curr.data) { 
    msg = 'Buscando ' + key + ' : ' + key + ' > ' + curr.data + '. Se va por el subarbol derecho.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    search(curr.right, key);
  }
  else { 
    msg = 'Buscando ' + key + ' : ' + key + ' == ' + curr.data + '. Elemento encontrado!';
    self.postMessage([root, msg, '']);
    sleep(delay);
  }
  return 0;
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
function pop(startingNode, key) {
  let node = startingNode;
  if (!node) { // if current node is null then element to delete does not exist in the tree
    msg = 'Searching for ' + key + ' : (Element not found)';
    self.postMessage([root, msg, '']);
    return null;
  }
  else {
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, '']);
    if (key < node.data) { // if key < current node's data then look at the left subtree
      msg = 'Searching for ' + key + ' : ' + key + ' < ' + node.data + '. Looking at left subtree.';
      self.postMessage([root, msg, '']);
      sleep(delay);
      node.left = pop(node.left, key);
    }
    else if (key > node.data) { // if key > current node's data then look at the right subtree
      msg = 'Searching for ' + key + ' : ' + key + ' > ' + node.data + '. Looking at right subtree.';
      self.postMessage([root, msg, '']);
      sleep(delay);
      node.right = pop(node.right, key);
    }
    else {
      msg = key + ' == ' + node.data + '. Found node to delete.'; // notify the main thread that node to delete is found.
      self.postMessage([root, msg, '']);
      sleep(delay);
      if (!node.left && !node.right) { // if node has no child (is a leaf) then just delete it.
        msg = 'Node to delete is a leaf. Delete it.';
        node = null;
        self.postMessage([root, msg, '']);
      }
      else if (!node.left) { // if node has RIGHT child then set parent of deleted node to right child of deleted node
        msg = 'Node to delete has no left child.\nSet parent of deleted node to right child of deleted node';
        self.postMessage([root, msg, '']);
        sleep(delay);
        for (let i = 0; i < 2; i += 1) {
          node.right.highlighted = true;
          if (node === root) node.highlighted = true;
          else node.parent.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          node.right.highlighted = false;
          if (node === root) node.highlighted = false;
          else node.parent.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        
        let del = node;
        node.right.parent = node.parent;
        node.right.loc = node.loc;
        node = node.right;
        del = null;
        node.y -= 40;
      }
      else if (!node.right) { 
        msg = 'Node to delete has no right child.\nSet parent of deleted node to left child of deleted node';
        self.postMessage([root, msg, '']);
        sleep(delay);
        for (let i = 0; i < 2; i += 1) {
          node.left.highlighted = true;
          if (node === root) node.highlighted = true;
          else node.parent.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          node.left.highlighted = false;
          if (node === root) node.highlighted = false;
          else node.parent.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        let del = node;
        node.left.parent = node.parent;
        node.left.loc = node.loc;
        node = node.left;
        del = null;
        node.y -= 40;
      }
      else { 
        msg = 'Node to delete has two children.\nFind largest node in left subtree.';
        self.postMessage([root, msg, '']);
        sleep(delay);
        let largestLeft = node.left;
        while (largestLeft.right) {
          unhighlightAll(root);
          largestLeft.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          largestLeft = largestLeft.right;
        }
        unhighlightAll(root);
        largestLeft.highlighted = true;
        msg = 'Largest node in left subtree is ' + largestLeft.data + '.\nCopy largest value of left subtree into node to delete.';
        self.postMessage([root, msg, '']);
        sleep(delay);

        for (let i = 0; i < 2; i += 1) {
          largestLeft.highlighted = true;
          node.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          largestLeft.highlighted = false;
          node.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        node.data = largestLeft.data;
        unhighlightAll(root);
        self.postMessage([root, msg, '']);
        sleep(delay);
        msg = 'Recursively delete largest node in left subtree';
        self.postMessage([root, msg, '']);
        sleep(delay);
        node.left = pop(node.left, largestLeft.data);
      }
    }
  }
  if (node == null) return node;

  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1; 
  return node;
}
function split(node) {
  if (node.keys.length !== node.degree * 2 - 1) {
    return;
  }
  lastMsg = 'dividiendo nodo';
  const medianIndex = node.degree - 1;
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
    node = new Node(2);
  }
  // this.log();
  if (node.keys.length === node.degree * 2 - 1) {
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
    
    default: break;
  }
});
