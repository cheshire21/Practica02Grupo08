let root = null;
let lastState = null;
let msg = '';
let printOutput = '';
let canvasWidth;
let delay = 1000;

class Node {
  constructor(d, height, y, parent, loc) {
    if (d instanceof Node) { // if parameter passed is a node then use all properties of the node to be cloned for the new node
      this.data = d.data;
      this.left = d.left;
      this.right = d.right;
      this.parent = d.parent;
      this.loc = d.loc;
      this.height = d.height;
      this.x = d.x;
      this.y = d.y;
      this.highlighted = d.highlighted;
    }
    else {
      this.data = d;
      this.left = null;
      this.right = null;
      this.parent = parent;
      this.loc = loc;
      this.height = height;
      this.x = canvasWidth / 2;
      this.y = y;
      this.highlighted = false;
    }
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

function getHeight(node) {
  if(node === null)  {
    return 0;
  }else {
    return Math.max(getHeight(node.left),getHeight(node.right)) + 1;
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


// GET CURRENT HEIGHT/LEVEL OF A NODE
function getHeight(node) {
  if(node === null)  {
    return 0;
  }else {
    return Math.max(getHeight(node.left),getHeight(node.right)) + 1;
  }
}

// BUSCANDO EL MÍNIMO ELEMENTO EN EL AVL
function minimo(curr) {
  unhighlightAll(root);
  curr.highlighted = true;
  self.postMessage([root, msg, '']);
  if (curr.left===null) { // if key < current node's data then look at the left subtree
    msg = 'El minimo final es ' + curr.data + '. última hoja.';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return curr.data;    
  }
  else{
    msg = 'El minimo temporal es ' + curr.data + '. Se va por el subarbol izquierdo.';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return minimo(curr.left);  
  } 
}

// BUSCANDO EL MÁXIMO ELEMENTO EN EL AVL
function maximo(curr) {
  unhighlightAll(root);
  curr.highlighted = true;
  self.postMessage([root, msg, '']);
  if (curr.right===null) { // if key < current node's data then look at the left subtree
    msg = 'El máximo final es ' + curr.data + ' . última hoja.';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return curr.data;    
  }
  else{
    msg = 'El máximo temporal es ' + curr.data + ' . Se va por el subárbol derecho.';
    self.postMessage([root, msg, '']);
    sleep(delay); 
    return maximo(curr.right);  
  } 
}


// DELETE AN ELEMENT FROM THE TREE
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

function showProcess(node, mensaje){
  node.highlighted = true;
  updatePosition(root);
  msg = 'En el nodo '+ node.data + ' ' + mensaje;
  self.postMessage([root, msg, '']);
  sleep(delay);
  node.highlighted = false;
}
//CHECK THE BALANCE 
function rotateLL (node) {
  showProcess(node,'Se realiza rotacion a la izquierda');
  let tmp = node.right;
  //cambiando coordenadas 
  let nodeParent = node.parent;
  let nodeloc = node.loc;

  node.parent = tmp;
  node.loc = 'left';

  
  
  node.right = tmp.left;
  if (node.right != null){
    node.right.loc = 'right';
    node.right.parent = node;
  }


  tmp.parent = nodeParent;
  tmp.loc = nodeloc;
  
  tmp.left = node;
    
  return tmp;
};

   // Rotación simple a la derecha
function rotateRR (node) {
  showProcess(node,'Se realiza rotacion a la derecha');
  let tmp = node.left;
  // cambiar coordenadas 
  let nodeParent = node.parent;
  let nodeloc = node.loc;

  node.parent = tmp;
  node.loc = 'right';


  node.left = tmp.right;
  
  if(node.left != null){
    node.left.loc = 'left'; 
    node.left.parent = node
  }
  
  tmp.parent = nodeParent;
  tmp.loc = nodeloc;
  
  tmp.right = node;

  return tmp;
};

   // Doble rotación de izquierda a derecha
function rotateLR(node) {
  node.left = rotateLL(node.left);
  return rotateRR(node);
};

   // Doble rotación primero a la derecha y luego a la izquierda
function rotateRL (node) {
  node.right = rotateRR(node.right);
  return rotateLL(node);
};
function checkIsBalance(node) {
  if (node == null) {
      return node;
  }
           // La altura del subárbol izquierdo es mayor que la altura del subárbol derecho El factor de equilibrio del nodo primario es -2  
  if (getHeight(node.left) - getHeight(node.right) > 1) {
      if (getHeight(node.left.left) >= getHeight(node.left.right)) {
                           // Si la altura del subárbol izquierdo del subárbol izquierdo es mayor o igual que la altura del subárbol derecho del subárbol izquierdo, los subnodos izquierdos son -1 y 0
                           // giro directo a la derecha
          node = rotateRR(node);
      } else {
          
          console.log('LR',node);
          node = rotateLR(node);
          
      }
                   // La altura del subárbol derecho es mayor que la altura del subárbol izquierdo en 1 y el factor de equilibrio del nodo primario es 2
  } else if (getHeight(node.right) - getHeight(node.left) > 1) {
      if (getHeight(node.right.right) >= getHeight(node.right.left)) {
                           // Si la altura del subárbol derecho del subárbol derecho es mayor o igual que la altura del subárbol izquierdo del subárbol derecho
                           // Rotación simple izquierda directa
          node = rotateLL(node);
      } else {
                           // De lo contrario, se requiere doble rotación derecha e izquierda
          node = rotateRL(node);
          
      }
  }
  return node;
}
// INSERT AN ELEMENT TO THE TREE
function push(node, data, posY, parent, loc) {
  let curr = node;

  if (curr != null) { 
    curr.highlighted = true;
    self.postMessage([root, msg, '']);
  }

  if (curr == null) { 
    msg = 'Encontrodo nodo NULL. Insertando ' + data + '.';
    curr = new Node(data, 1, posY, parent, loc);
    
    
  }
  else if (data < curr.data) { 
    msg = data + ' < ' + curr.data + '. Se va por el subarbol Izquierdo.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    curr.left = push(curr.left, data, posY + 40, curr, 'left');

    // check balance 
    console.log(curr);
     curr = checkIsBalance(curr);
  }
  else if (data >= curr.data) { 
    msg = data + ' >= ' + curr.data + '. Se va por el subarbol Derecha.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    curr.right = push(curr.right, data, posY + 40, curr, 'right');

    //check balance 
    console.log(curr);
    
    curr = checkIsBalance(curr);
  }


  return curr; 
}

function updatePosition(node) {
  if (node != null) {
    if (node.loc === 'left') node.x = node.parent.x - ((2 ** (getHeight(node.right) + 1)) * 10);
    else if (node.loc === 'right') node.x = node.parent.x + ((2 ** (getHeight(node.left) + 1)) * 10);
    else if (node.loc === 'root') {
      node.x = canvasWidth / 2;
      node.y = 50;
    }
    if (node.parent != null) node.y = node.parent.y + 40;
    if (node.left != null) node.left.parent = node; 
    if (node.right != null) node.right.parent = node; 
    updatePosition(node.left);
    updatePosition(node.right);
  }
}

self.addEventListener('message', (event) => {
  switch (event.data[0]) {
    case 'Insert': {
      const value = event.data[1]; 
      canvasWidth = event.data[2];
      root = push(root, value, 50, null, 'root'); 
      updatePosition(root); 
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
        unhighlightAll(root);
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
        unhighlightAll(root); 
        self.postMessage([root, msg, 'Finished']); 
      }
      break;
    }
    case 'Min': {
      const key = event.data[1]; 
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']);
      }
      else {
        minimo(root);
        unhighlightAll(root); 
        self.postMessage([root, msg, 'Finished']); 
      }
      break;    
    }
    case 'Max': {
      const key = event.data[1]; 
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']);
      }
      else {
        maximo(root);
        unhighlightAll(root); 
        self.postMessage([root, msg, 'Finished']); 
      }
      break;    
    }

    
    default: break;
  }
});
