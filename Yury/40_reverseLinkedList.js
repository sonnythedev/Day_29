/*
    Difficulty: Tricky    

    Expand your code from challenge 33 so that it has "reversed()" method that returns a copy of itself in reverse.

    Tip: Don't cheat! Don't reverse the alphabet letters before creating linked list!

    Samples:
    1) let listReversed = list.reversed();
       listReversed.printNodes() == "z y x w v u t s r q p o n m l k j i h g f e d c b a"
*/

// solution

class LinkedList {
    constructor() {
        this.start = null;
        this.end=null;
    }
    printNodes(){
        let output='';
         while(this.start!=null){
             output +=this.start.value+' ';
             this.start=this.start.next;
         }
         return output;
    }

    reverse(){
        while(this.prev!=null){
            this.prev=this.prev.prev;
        }

    }
    
}
class LinkedListNode {
    constructor(value, next = null, prev=null) {
        this.value = value;
        this.next  = next;
        this.prev=prev;
    }
}

let linkedList=new LinkedList();
let arr="abcdefghijklmnopqrstuvwxyz".split('');
let first=true;
for(let c of arr){
    let linkedListNode=new LinkedListNode(c);
    if(first){
        linkedList.start=linkedListNode;
    }
    else{
        linkedList.next=linkedListNode; 
    }
    
    first=false;
}

console.log(linkedList.printNodes());




