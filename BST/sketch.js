

class Tree{
    constructor(){
        this.root = null;
        this.height = 0;
    }
    addNode(n) {
        if(this.root == null){
            this.root = n;
            this.root.setXY(width/2,20);
            
            this.addgraphicNode(null, this.root);
        }
        else{
            this.addNodeRc(this.root, n, 1);
        }
    }
    addNodeRc(nodo, newNodo, hgt){
        if (nodo.value >  newNodo.value){
            if(nodo.left == null){
                nodo.left = newNodo;
                this.height = hgt;
                newNodo.setXY(nodo.x -(separacionX-(disminuye*hgt)), nodo.y+separacionY)
                this.addgraphicNode(nodo,newNodo);
            }
            else{
                this.addNodeRc(nodo.left, newNodo,hgt+1);
            }
        }
        
        else if (nodo.value < newNodo.value){
            if(nodo.right == null){
                nodo.right = newNodo;

                this.height = hgt;
                newNodo.setXY(nodo.x + (separacionX-(disminuye*hgt)), nodo.y+separacionY)
                this.addgraphicNode(nodo,newNodo);
            }
            else{
                this.addNodeRc(nodo.right,newNodo,hgt+1);
            }
        }
    }
    addgraphicNode(parent, node){
        fill(255);
        noStroke();
        textAlign(CENTER);
        text(node.value, node.x, node.y);
        stroke(255);
        noFill();
        ellipse(node.x , node.y-4, 20, 20);
        if(parent != null){
            line(parent.x, parent.y+6, node.x , node.y-14);
        }
    }
    traverse(){
        this.root.visit();
    }
    search(val){
        return this.root.search(val);
    }
}


class Node{
    constructor(label, x, y){
        this.value = label;
        this.left = null;
        this.right = null;
        this.x = x;
        this.y = y;
    }
    visit(){
        if (this.left != null){
            this.left.visit()
        }    
        console.log(this.value)
        text(this.value,this.x, this.y)
        if (this.right != null){
            this.right.visit()
        }
    }
    search(val){
        if(this.value == val){
            return this;
        }else if (val < this.value && this.left != null){
            return this.left.search(val);   
        }else if (val > this.value && this.right != null){
            return this.right.search(val);   
        }
        
    }
    setXY(x,y){
        this.x = x;
        this.y = y;
    }
  }
  

function setup() {
    createCanvas(1000,1000);
    background(51);
    tree = new Tree();
    for(var i = 0; i < 7; i++){
        tree.addNode(new Node(Math.floor(Math.random()* (100 - 0))));
    }
    console.log(tree);


  
}

let separacionX = 100;
let separacionY = 30;
let disminuye = 20;

function draw(){
    
}
