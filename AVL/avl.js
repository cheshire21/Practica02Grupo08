/*
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}
class BinarySearchTree {
    constructor(value) {
        this.root = new Node(value)
    }
    _insertNode(node, value) {
        if(node.value > value){
            if(node.left === null){
                node.left = new Node(value)
            }else{
                this._insertNode(node.left, value)
            }
        }else{
            if(node.right === null){
                node.right = new Node(value)
            }else{
                this._insertNode(node.right, value)
            }
        }
    }
    insert(value) {
        if(this.root === null) {
            this.root = new Node(value)
        }else{
            this._insertNode(this.root, value)
        }
        return this
    }
    // Recorrido de orden medio: izquierda -> medio -> derecha
    _inOrderTra(node, res) {
        if(node === null) { return }
        this._inOrderTra(node.left, res)
        res.push(node.value)
        this._inOrderTra(node.right, res)
    }
    inOrderTra() {
        let res = []
        this._inOrderTra(this.root, res)
        return res
    }
    // Recorrido de preorden: medio -> izquierda -> derecha
    _preOrderTra(node, res) {
        if(node === null) { return }
        res.push(node.value)
        this._preOrderTra(node.left, res)
        this._preOrderTra(node.right, res)
    }
    preOrderTra() {
        let res = []
        this._preOrderTra(this.root, res)
        return res
    }
    // Recorrido posterior al pedido: izquierda -> derecha -> centro
    _postOrderTra(node, res) {
        if(node === null) { return }
        this._postOrderTra(node.left, res)
        this._postOrderTra(node.right, res)
        res.push(node.value)
    }
    postOrderTra() {
        let res = []
        this._postOrderTra(this.root, res)
        return res
    }
    _getMin(node) { 
        if(node.left === null){ return node }
        return this._getMin(node.left) 
    }
    getMin() {
        return this._getMin(this.root)
    }
    _getMax(node) { 
        if(node.right === null){ return node }
        return this._getMax(node.right) 
    }
    getMax() {
        return this._getMax(this.root)
    }
    _search(node, value) {
        if(node.value > value) {
            if(node.left === null) {
                throw 'Function Search: ' + value + ' Extraviado'
            }else if(node.left.value === value) {
                return node.left
            }else {
                return this._search(node.left, value)
            }
        }else {
            if(node.right === null) {
                throw 'Function Search: ' + value + ' Extraviado'
            }else if(node.right.value === value) {
                return node.right
            }else {
                return this._search(node.right, value)
            }
        }
    }
    search(value) {
        if(value === this.root.value){
            return this.root
        }
        return this._search(this.root, value)
    }
    _removeNode(target, node=this.root) {
        // Encuentra el nodo padre del nodo eliminado
        if(node.left !== target && node.right !== target){
            if(node.value > target.value){
                return this._removeNode(target, node.left)
            }else{
                return this._removeNode(target, node.right)
            }
        }
        if(target.left === null && target.right === null){
            // El nodo eliminado no tiene hijos
            return node.left === target ? node.left = null : node.right = null
        }else if(target.left === null || target.right === null){
            // El nodo eliminado contiene solo un nodo hijo
            const son = target.left === null ? target.right : target.left
            return node.left === target ? node.left = son : node.right = son
        }else if(target.left !== null && target.right !== null){
            // El nodo eliminado contiene dos nodos secundarios
            const displace = this._getMin(target.right)
            return node.left === target ? node.left = displace : node.right = displace
        }
    }
    remove(value) {
        const target = this.search(value)
        if(target === this.root){
            throw 'Función eliminar: no se puede eliminar el nodo raíz'
        }
        this._removeNode(target)
        return this
    }
}


class AVL extends BinarySearchTree {
    constructor(superConstructor) {
        super(superConstructor)
    }
    _getNodeHeight(node) {
        if(node === null){
            return -1
        }
        return Math.max(this._getNodeHeight(node.left), this._getNodeHeight(node.right))+1
    }
    getNodeHeight(node=this.root) {
        return this._getNodeHeight(node)
    }
    getBalanceFactory(node) {
        const factory = this.getNodeHeight(node.left) - this.getNodeHeight(node.right)
        return factory
    }
    // Rotación única a la derecha
    rotationLL(node) {
        const tar = node.left
        try{
            node.left = tar.right
        }catch{
            node.left = null
        }
        tar.right = node
        return tar
    }
    // Rotación única a la izquierda
    rotationRR(node) {
        const tar = node.right
        try{
            node.right = tar.left
        }catch{
            node.right = null
        }
        tar.left = node
        return tar
    }
    // Doble rotación a la derecha
    rotationRL(node) {
        node.right = this.rotationLL(node.right)
        return this.rotationRR(node)
    }
    // Doble rotación a la izquierda
    rotationLR(node) {
        node.left = this.rotationRR(node.left)
        return this.rotationLL(node)
    }
    _changeToBalance(node) {
        switch(this.getBalanceFactory(node)){
          case 2:
              const factoryLeft = this.getBalanceFactory(node.left)
              if([0,1].indexOf(factoryLeft) !== -1 || factoryLeft > 2){
                  console.info('2 0 1')
                  node = this.rotationLL(node)
              }else if(factoryLeft === -1){
                  console.info('2 -1')
                  node = this.rotationLR(node)
              }else if(factoryLeft === 2){
                  console.info('2 2')
                  node.left = this._changeToBalance(node.left)
              }else if(factoryLeft === -2){
                  console.info('2 -2')
                  node.left = this._changeToBalance(node.left)
              }
              return node
          case -2:
              const factoryRight = this.getBalanceFactory(node.right)
              if([0,1].indexOf(factoryRight) !== -1){
                  console.info('-2 0 1')
                  node = this.rotationRL(node)
              }else if(factoryRight === -1 || factoryRight < -2){
                  console.info('-2 -1')
                  node = this.rotationRR(node)
              }else if(factoryRight === 2){
                  console.info('-2 2')
                  node.right = this._changeToBalance(node.right)
              }else if(factoryRight === -2){
                  console.info('-2 -2')
                  node.right = this._changeToBalance(node.right)
                  console.info(node.right)
              }
              return node
      }
        return node
    }
    checkIsBalance() {
        this.root = this._changeToBalance(this.root)
        return this
    }
    insert(value) {
        super.insert(value)
        return this.checkIsBalance()
    }
    remove(value) {
        super.remove(value)
        return this.checkIsBalance()
    }
}
*/
function AVLTreeNode(key) {

    this.key = key;
    this.leftChild = null;
    this.rightChild = null;
    this.parent = null;
}

/**
   * Constructor del árbol AVL. Si no se pasa un nombre de clave válido, use los datos para la comparación; de lo contrario, use los datos [keyName] para la comparación
 *
   * @param {string} [keyName] -opcional parámetro. Nombre del campo del código clave en los datos
 * @constructor
 */
function AVLTree(keyName) {


    this.root = null;

         // Así es como calculamos la altura del nodo actual, recursivamente
    let getHeight = function (node) {
                 // 0 si no
        if(node === null) {
            return 0;
        } else {
            return Math.max(getHeight(node.leftChild),getHeight(node.rightChild)) + 1;
        }
    };
         // Rotación simple a la izquierda
    let rotateLL = function (node) {
        let tmp = node.rightChild;
        node.rightChild = tmp.leftChild;
        tmp.leftChild = node;
        return tmp;
    };

         // Rotación simple a la derecha
    let rotateRR = function (node) {

        let tmp = node.leftChild;
        node.leftChild = tmp.rightChild;
        tmp.rightChild = node;
        return tmp;
    };

         // Doble rotación de izquierda a derecha
    let rotateLR = function (node) {
        node.leftChild = rotateLL(node.leftChild);
        return rotateRR(node);
    };

         // Doble rotación primero a la derecha y luego a la izquierda
    let rotateRL = function (node) {
        node.rightChild = rotateRR(node.rightChild);
        return rotateLL(node);
    };
         // El método garantiza el equilibrio de todo el árbol.
    function checkIsBalance(node) {
        if (node == null) {
            return node;
        }
                 // La altura del subárbol izquierdo es mayor que la altura del subárbol derecho El factor de equilibrio del nodo primario es -2  
        if (getHeight(node.leftChild) - getHeight(node.rightChild) > 1) {
            if (getHeight(node.leftChild.leftChild) >= getHeight(node.leftChild.rightChild)) {
                                 // Si la altura del subárbol izquierdo del subárbol izquierdo es mayor o igual que la altura del subárbol derecho del subárbol izquierdo, los subnodos izquierdos son -1 y 0
                                 // giro directo a la derecha
                node = rotateRR(node);
            } else {
                             // Si el nodo secundario izquierdo es 1, debe girar a la izquierda y luego a la derecha
                node = rotateLR(node);
            }
                         // La altura del subárbol derecho es mayor que la altura del subárbol izquierdo en 1 y el factor de equilibrio del nodo primario es 2
        } else if (getHeight(node.rightChild) - getHeight(node.leftChild) > 1) {
            if (getHeight(node.rightChild.rightChild) >= getHeight(node.rightChild.leftChild)) {
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
     // Método de inserción:
    let insertNode = function(node, newNode){

        if (node == null){
            node = newNode;
            return node;
        } else if (newNode.key < node.key){
                   // Insertar en el subárbol izquierdo es lo mismo que buscar en el árbol binario
            if (node.leftChild === null){
                node.leftChild = newNode;
                return node;
            } else {
                node.leftChild = insertNode(node.leftChild, newNode);
                                 // Actualiza todo el árbol
                node = checkIsBalance(node);
            }
        } else if (newNode.key > node.key){
                     // Insertar en el subárbol derecho
            if (node.rightChild === null){
                node.rightChild = newNode;
                return node;
            } else {
                node.rightChild = insertNode(node.rightChild, newNode);
                node = checkIsBalance(node);
            }
        }
        return node;
    };


    this.insert = function (data) {
        let newNode = new AVLTreeNode(data);
        this.root = insertNode(this.root, newNode);
    };

    this.delete = function (data) {
        this.root = deleteData(this.root, data);
    };
     // Eliminar el nodo especificado
    function deleteData(node, data) {
        if( node === null){
            return null;
        }
                 // Si es menor que, elimine en el subárbol izquierdo
        if(data < node.key){
            node.leftChild =  deleteData(node.leftChild, data);
            node = checkIsBalance(node);

            return node
        }else if(data > node.key){
            node.rightChild = deleteData(node.rightChild, data);
            node = checkIsBalance(node);

            return node
        }else{
                         // Los datos eliminados son iguales a node.key

                         // Si este nodo tiene dos nodos secundarios
            if(!!node.leftChild && !!node.rightChild){
                let tempNode = node.rightChild;

                while ( null !== tempNode.leftChild){
                                         // Encuentra el nodo más pequeño en el subárbol derecho
                    tempNode = tempNode.leftChild;
                }
                
                                 // El nodo más pequeño en el subárbol derecho se asigna al nodo actual
                node.key =  tempNode.key ;
                                 // Eliminar el nodo con el valor más pequeño en el subárbol derecho
                node.rightChild = deleteData(node.rightChild, tempNode.key);
                node = checkIsBalance(node);

                return node;

            }else {
                                 // Solo hay un nodo hoja
                                 // nodo hoja
                if( null === node.leftChild && null === node.rightChild){
                    node = null;
                    return node;
                }
                                 // Solo correcto
                if( null === node.leftChild){
                    node = node.rightChild;
                    return node;
                }else if( null === node.rightChild){
                                         // Solo queda
                    node = node.leftChild;
                    return node;
                }
            }

        }
    }
    this.print = function () {
        console.log(this.root);
        debugger
        //return this.root
    }
    this.return_avl=function() {
        // body...
        var arr=[];
        arr.push(this.root);
        return arr//JSON.stringify(arr);
    }

}